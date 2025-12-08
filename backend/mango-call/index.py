import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
import hashlib
import hmac

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    API для интеграции с Манго Офис
    POST /call - инициировать звонок через Манго
    POST /webhook - вебхук для получения событий от Манго (запись звонка, статус)
    GET /calls?lead_id=123 - получить историю звонков
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ['DATABASE_URL']
    conn = psycopg2.connect(dsn)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            lead_id = params.get('lead_id')
            
            if not lead_id:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'success': False, 'error': 'lead_id required'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute('SELECT * FROM lead_calls WHERE lead_id = %s ORDER BY started_at DESC', (lead_id,))
            calls = cursor.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'success': True, 'calls': [dict(c) for c in calls]}, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            path = event.get('path', '')
            
            if 'webhook' in path:
                call_data = body_data.get('call', {})
                
                cursor.execute('''
                    INSERT INTO lead_calls (lead_id, phone_number, direction, duration, recording_url, status, mango_call_id)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                    RETURNING id
                ''', (
                    body_data.get('lead_id', 0),
                    call_data.get('to', ''),
                    call_data.get('direction', 'outbound'),
                    call_data.get('duration', 0),
                    call_data.get('recording_url'),
                    call_data.get('status', 'completed'),
                    call_data.get('call_id')
                ))
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'success': True}),
                    'isBase64Encoded': False
                }
            else:
                lead_id = body_data.get('lead_id')
                phone = body_data.get('phone')
                
                if not lead_id or not phone:
                    return {
                        'statusCode': 400,
                        'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                        'body': json.dumps({'success': False, 'error': 'lead_id and phone required'}),
                        'isBase64Encoded': False
                    }
                
                cursor.execute('''
                    INSERT INTO lead_calls (lead_id, phone_number, direction, status)
                    VALUES (%s, %s, %s, %s)
                    RETURNING id
                ''', (lead_id, phone, 'outbound', 'initiated'))
                
                call_id = cursor.fetchone()['id']
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({
                        'success': True, 
                        'call_id': call_id,
                        'message': 'Call initiated. Configure Mango Office API for real calls.'
                    }),
                    'isBase64Encoded': False
                }
        
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'success': False, 'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    finally:
        cursor.close()
        conn.close()
