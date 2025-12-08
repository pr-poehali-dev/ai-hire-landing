import json
import os
import psycopg2
import secrets
from typing import Dict, Any
from datetime import datetime, timedelta

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Генерация инвайт-ссылок для регистрации в CRM
    POST / - создать новую инвайт-ссылку (только для пользователей с правами)
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    headers = event.get('headers', {})
    auth_token = headers.get('x-auth-token', headers.get('X-Auth-Token', ''))
    user_email = headers.get('x-user-email', headers.get('X-User-Email', ''))
    
    if not user_email:
        return {
            'statusCode': 401,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'success': False, 'error': 'Authentication required'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    max_uses = body_data.get('max_uses', 1)
    expires_in_hours = body_data.get('expires_in_hours', 168)
    
    conn = None
    try:
        database_url = os.environ['DATABASE_URL']
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor()
        
        cursor.execute(
            "SELECT id, can_generate_invites FROM t_p27512893_ai_hire_landing.users WHERE email = %s",
            (user_email.lower(),)
        )
        
        result = cursor.fetchone()
        
        if not result:
            cursor.close()
            return {
                'statusCode': 403,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'success': False, 'error': 'User not found'}),
                'isBase64Encoded': False
            }
        
        user_id, can_generate = result
        
        if not can_generate:
            cursor.close()
            return {
                'statusCode': 403,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'success': False, 'error': 'No permission to generate invites'}),
                'isBase64Encoded': False
            }
        
        token = secrets.token_urlsafe(32)
        expires_at = datetime.now() + timedelta(hours=expires_in_hours)
        
        cursor.execute(
            """INSERT INTO t_p27512893_ai_hire_landing.invite_links 
            (token, created_by, expires_at, max_uses, current_uses, is_active)
            VALUES (%s, %s, %s, %s, 0, true)
            RETURNING id""",
            (token, user_id, expires_at, max_uses)
        )
        
        invite_id = cursor.fetchone()[0]
        conn.commit()
        cursor.close()
        
        invite_url = f"https://www.1-day-hr.ru/register?invite={token}"
        
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({
                'success': True,
                'invite_id': invite_id,
                'token': token,
                'invite_url': invite_url,
                'expires_at': expires_at.isoformat(),
                'max_uses': max_uses
            }, default=str),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'success': False, 'error': f'Error: {str(e)}'}),
            'isBase64Encoded': False
        }
    finally:
        if conn:
            conn.close()
