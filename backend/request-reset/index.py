import json
import os
import psycopg2
import secrets
from datetime import datetime, timedelta
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Запрос на восстановление пароля - генерирует токен для сброса
    Args: event - объект с данными запроса (email)
          context - объект с атрибутами запроса
    Returns: JSON с токеном для восстановления пароля
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
    
    body = event.get('body', '{}')
    if not body or body == '':
        body = '{}'
    body_data = json.loads(body)
    email = body_data.get('email', '').strip().lower()
    
    if not email:
        return {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'error': 'Email is required'}),
            'isBase64Encoded': False
        }
    
    conn = None
    try:
        database_url = os.environ['DATABASE_URL']
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor()
        
        cursor.execute(
            "SELECT id FROM t_p27512893_ai_hire_landing.users WHERE email = %s",
            (email,)
        )
        
        result = cursor.fetchone()
        
        if not result:
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({
                    'success': True,
                    'message': 'If this email exists, a reset token has been sent'
                }),
                'isBase64Encoded': False
            }
        
        user_id = result[0]
        token = secrets.token_urlsafe(32)
        expires_at = datetime.now() + timedelta(hours=1)
        
        cursor.execute(
            "INSERT INTO t_p27512893_ai_hire_landing.password_reset_tokens (user_id, token, expires_at) "
            "VALUES (%s, %s, %s)",
            (user_id, token, expires_at)
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
                'token': token,
                'message': 'Reset token generated successfully'
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