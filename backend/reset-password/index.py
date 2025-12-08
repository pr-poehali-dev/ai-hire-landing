import json
import os
import psycopg2
import hashlib
from datetime import datetime
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Установка нового пароля по токену восстановления
    Args: event - объект с данными запроса (token, new_password)
          context - объект с атрибутами запроса
    Returns: JSON с результатом установки пароля
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
    
    token = body_data.get('token', '').strip()
    new_password = body_data.get('new_password', '').strip()
    
    if not token or not new_password:
        return {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'error': 'Token and new password are required'}),
            'isBase64Encoded': False
        }
    
    if len(new_password) < 6:
        return {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'error': 'Password must be at least 6 characters'}),
            'isBase64Encoded': False
        }
    
    conn = None
    try:
        database_url = os.environ['DATABASE_URL']
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor()
        
        cursor.execute(
            "SELECT user_id, expires_at, used FROM t_p27512893_ai_hire_landing.password_reset_tokens WHERE token = %s",
            (token,)
        )
        
        result = cursor.fetchone()
        
        if not result:
            cursor.close()
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'error': 'Invalid or expired token'}),
                'isBase64Encoded': False
            }
        
        user_id, expires_at, used = result
        
        if used:
            cursor.close()
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'error': 'Token has already been used'}),
                'isBase64Encoded': False
            }
        
        if datetime.now() > expires_at:
            cursor.close()
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'error': 'Token has expired'}),
                'isBase64Encoded': False
            }
        
        password_hash = hashlib.sha256(new_password.encode()).hexdigest()
        
        cursor.execute(
            "UPDATE t_p27512893_ai_hire_landing.users SET password_hash = %s WHERE id = %s",
            (password_hash, user_id)
        )
        
        cursor.execute(
            "UPDATE t_p27512893_ai_hire_landing.password_reset_tokens SET used = TRUE WHERE token = %s",
            (token,)
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
                'message': 'Password has been reset successfully'
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
