import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Принимает заявки с сайта и сохраняет в базу данных
    Args: event - объект с данными запроса (name, phone, company, vacancy, source)
          context - объект с атрибутами запроса
    Returns: JSON с результатом сохранения
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
    
    name = body_data.get('name', '').strip()
    phone = body_data.get('phone', '').strip()
    company = body_data.get('company', '').strip()
    vacancy = body_data.get('vacancy', '').strip()
    source = body_data.get('source', 'main_form')
    
    if not name or not phone:
        return {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'error': 'Name and phone are required'}),
            'isBase64Encoded': False
        }
    
    conn = None
    try:
        database_url = os.environ['DATABASE_URL']
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor()
        
        cursor.execute(
            "INSERT INTO t_p27512893_ai_hire_landing.leads (name, phone, company, vacancy, source) "
            "VALUES (%s, %s, %s, %s, %s) RETURNING id",
            (name, phone, company if company else None, vacancy if vacancy else None, source)
        )
        
        lead_id = cursor.fetchone()[0]
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
                'lead_id': lead_id,
                'message': 'Заявка успешно отправлена!'
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
