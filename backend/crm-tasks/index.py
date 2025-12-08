import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    API для управления задачами в CRM
    GET /tasks?lead_id=123 - получить задачи лида
    POST /tasks - создать задачу
    PATCH /tasks - обновить задачу (завершить)
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
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
            
            cursor.execute('SELECT * FROM lead_tasks WHERE lead_id = %s ORDER BY due_date ASC', (lead_id,))
            tasks = cursor.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'success': True, 'tasks': [dict(t) for t in tasks]}, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            cursor.execute('''
                INSERT INTO lead_tasks (lead_id, title, description, due_date, priority)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id
            ''', (
                body_data.get('lead_id'),
                body_data.get('title'),
                body_data.get('description'),
                body_data.get('due_date'),
                body_data.get('priority', 'medium')
            ))
            
            task_id = cursor.fetchone()['id']
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'success': True, 'task_id': task_id}),
                'isBase64Encoded': False
            }
        
        elif method == 'PATCH':
            body_data = json.loads(event.get('body', '{}'))
            task_id = body_data.get('id')
            completed = body_data.get('completed', True)
            
            if not task_id:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'success': False, 'error': 'Task ID required'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute('UPDATE lead_tasks SET completed = %s WHERE id = %s', (completed, task_id))
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
