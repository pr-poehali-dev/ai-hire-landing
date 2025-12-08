import json
import os
import psycopg2
import hashlib
from datetime import datetime
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Регистрация новых пользователей в системе CRM (только по инвайт-ссылке)
    Args: event - объект с данными запроса (email, password, name, invite_token)
          context - объект с атрибутами запроса
    Returns: JSON с результатом регистрации
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    
    email = body_data.get('email', '').strip().lower()
    password = body_data.get('password', '').strip()
    name = body_data.get('name', '').strip()
    invite_token = body_data.get('invite_token', '').strip()
    
    if not email or not password or not invite_token:
        return {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'error': 'Email, password and invite_token are required'}),
            'isBase64Encoded': False
        }
    
    if len(password) < 6:
        return {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'error': 'Password must be at least 6 characters'}),
            'isBase64Encoded': False
        }
    
    password_hash = hashlib.sha256(password.encode()).hexdigest()
    
    conn = None
    try:
        database_url = os.environ['DATABASE_URL']
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor()
        
        cursor.execute(
            """SELECT id, expires_at, max_uses, current_uses, is_active 
            FROM t_p27512893_ai_hire_landing.invite_links WHERE token = %s""",
            (invite_token,)
        )
        
        invite_result = cursor.fetchone()
        
        if not invite_result:
            cursor.close()
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'error': 'Invalid invite token'}),
                'isBase64Encoded': False
            }
        
        invite_id, expires_at, max_uses, current_uses, is_active = invite_result
        
        if not is_active:
            cursor.close()
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'error': 'Invite token is inactive'}),
                'isBase64Encoded': False
            }
        
        if expires_at and datetime.now() > expires_at:
            cursor.close()
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'error': 'Invite token has expired'}),
                'isBase64Encoded': False
            }
        
        if current_uses >= max_uses:
            cursor.close()
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'error': 'Invite token has reached maximum uses'}),
                'isBase64Encoded': False
            }
        
        cursor.execute(
            "SELECT id FROM t_p27512893_ai_hire_landing.users WHERE email = %s",
            (email,)
        )
        
        if cursor.fetchone():
            cursor.close()
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'error': 'User with this email already exists'}),
                'isBase64Encoded': False
            }
        
        cursor.execute(
            "INSERT INTO t_p27512893_ai_hire_landing.users (email, password_hash, name) "
            "VALUES (%s, %s, %s) RETURNING id",
            (email, password_hash, name if name else None)
        )
        
        user_id = cursor.fetchone()[0]
        
        cursor.execute(
            "UPDATE t_p27512893_ai_hire_landing.invite_links SET current_uses = current_uses + 1 WHERE id = %s",
            (invite_id,)
        )
        
        conn.commit()
        cursor.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'success': True,
                'user_id': user_id,
                'message': 'User registered successfully'
            }),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'error': f'Database error: {str(e)}'}),
            'isBase64Encoded': False
        }
    finally:
        if conn:
            conn.close()