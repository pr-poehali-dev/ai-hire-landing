import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    CRM API для управления лидами: получение, создание, обновление, удаление
    GET /leads - список всех лидов
    GET /leads?id=123 - получить конкретный лид
    POST /leads - создать лид
    PUT /leads - обновить лид
    PATCH /leads/stage - изменить этап лида
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, OPTIONS',
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
            lead_id = params.get('id')
            
            if lead_id:
                cursor.execute('''
                    SELECT l.*, s.name as stage_name, s.color as stage_color
                    FROM lead_data l
                    LEFT JOIN lead_stages s ON l.stage_id = s.id
                    WHERE l.id = %s
                ''', (lead_id,))
                lead = cursor.fetchone()
                
                if lead:
                    cursor.execute('SELECT * FROM lead_tasks WHERE lead_id = %s ORDER BY created_at DESC', (lead_id,))
                    tasks = cursor.fetchall()
                    
                    cursor.execute('SELECT * FROM lead_comments WHERE lead_id = %s ORDER BY created_at DESC', (lead_id,))
                    comments = cursor.fetchall()
                    
                    cursor.execute('SELECT * FROM lead_calls WHERE lead_id = %s ORDER BY started_at DESC', (lead_id,))
                    calls = cursor.fetchall()
                    
                    result = dict(lead)
                    result['tasks'] = [dict(t) for t in tasks]
                    result['comments'] = [dict(c) for c in comments]
                    result['calls'] = [dict(c) for c in calls]
                    
                    return {
                        'statusCode': 200,
                        'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                        'body': json.dumps({'success': True, 'lead': result}, default=str),
                        'isBase64Encoded': False
                    }
                else:
                    return {
                        'statusCode': 404,
                        'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                        'body': json.dumps({'success': False, 'error': 'Lead not found'}),
                        'isBase64Encoded': False
                    }
            else:
                cursor.execute('''
                    SELECT l.*, s.name as stage_name, s.color as stage_color
                    FROM lead_data l
                    LEFT JOIN lead_stages s ON l.stage_id = s.id
                    ORDER BY l.created_at DESC
                ''')
                leads = cursor.fetchall()
                
                cursor.execute('SELECT * FROM lead_stages ORDER BY position')
                stages = cursor.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({
                        'success': True, 
                        'leads': [dict(l) for l in leads],
                        'stages': [dict(s) for s in stages],
                        'total': len(leads)
                    }, default=str),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            cursor.execute('''
                INSERT INTO lead_data (name, phone, email, company, vacancy, source, priority, notes)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            ''', (
                body_data.get('name'),
                body_data.get('phone'),
                body_data.get('email'),
                body_data.get('company'),
                body_data.get('vacancy'),
                body_data.get('source', 'manual'),
                body_data.get('priority', 'medium'),
                body_data.get('notes')
            ))
            
            lead_id = cursor.fetchone()['id']
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'success': True, 'lead_id': lead_id}),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            lead_id = body_data.get('id')
            
            if not lead_id:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'success': False, 'error': 'Lead ID required'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute('''
                UPDATE lead_data
                SET name = %s, phone = %s, email = %s, company = %s, 
                    vacancy = %s, priority = %s, notes = %s, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
            ''', (
                body_data.get('name'),
                body_data.get('phone'),
                body_data.get('email'),
                body_data.get('company'),
                body_data.get('vacancy'),
                body_data.get('priority'),
                body_data.get('notes'),
                lead_id
            ))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
        
        elif method == 'PATCH':
            body_data = json.loads(event.get('body', '{}'))
            lead_id = body_data.get('id')
            stage_id = body_data.get('stage_id')
            
            if not lead_id or not stage_id:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'success': False, 'error': 'Lead ID and Stage ID required'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute('UPDATE lead_data SET stage_id = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s', (stage_id, lead_id))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'success': True}),
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
