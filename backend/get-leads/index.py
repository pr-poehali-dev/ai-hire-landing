import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Получает список заявок из базы данных для CRM
    Args: event - объект с параметрами запроса (limit, offset, status)
          context - объект с атрибутами запроса
    Returns: JSON со списком заявок
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    params = event.get('queryStringParameters', {}) or {}
    limit = int(params.get('limit', 50))
    offset = int(params.get('offset', 0))
    status_filter = params.get('status', '')
    
    conn = None
    try:
        database_url = os.environ['DATABASE_URL']
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor()
        
        if status_filter:
            query = """
                SELECT id, name, phone, company, vacancy, source, created_at, status
                FROM t_p27512893_ai_hire_landing.leads
                WHERE status = %s
                ORDER BY created_at DESC
                LIMIT %s OFFSET %s
            """
            cursor.execute(query, (status_filter, limit, offset))
        else:
            query = """
                SELECT id, name, phone, company, vacancy, source, created_at, status
                FROM t_p27512893_ai_hire_landing.leads
                ORDER BY created_at DESC
                LIMIT %s OFFSET %s
            """
            cursor.execute(query, (limit, offset))
        
        rows = cursor.fetchall()
        
        leads = []
        for row in rows:
            leads.append({
                'id': row[0],
                'name': row[1],
                'phone': row[2],
                'company': row[3],
                'vacancy': row[4],
                'source': row[5],
                'created_at': row[6].isoformat() if row[6] else None,
                'status': row[7]
            })
        
        cursor.execute("SELECT COUNT(*) FROM t_p27512893_ai_hire_landing.leads")
        total = cursor.fetchone()[0]
        
        cursor.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'leads': leads,
                'total': total,
                'limit': limit,
                'offset': offset
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
