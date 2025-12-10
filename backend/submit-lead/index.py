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
    
    print(f"Received lead submission: {body_data}")
    
    name = body_data.get('name', '').strip()
    phone = body_data.get('phone', '').strip()
    company = body_data.get('company', '').strip()
    vacancy = body_data.get('vacancy', '').strip()
    source = body_data.get('source', 'main_form')
    form_type = body_data.get('form_type', '')
    page = body_data.get('page', '')
    
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
        
        # Экранируем одинарные кавычки для Simple Query Protocol
        name_escaped = name.replace("'", "''")
        phone_escaped = phone.replace("'", "''")
        company_escaped = company.replace("'", "''") if company else ''
        vacancy_escaped = vacancy.replace("'", "''") if vacancy else ''
        source_escaped = source.replace("'", "''")
        form_type_escaped = form_type.replace("'", "''") if form_type else ''
        page_escaped = page.replace("'", "''") if page else ''
        
        company_value = f"'{company_escaped}'" if company else 'NULL'
        vacancy_value = f"'{vacancy_escaped}'" if vacancy else 'NULL'
        form_type_value = f"'{form_type_escaped}'" if form_type else 'NULL'
        page_value = f"'{page_escaped}'" if page else 'NULL'
        
        # Сначала сохраняем в таблицу leads (старая таблица)
        query_leads = f"""
            INSERT INTO t_p27512893_ai_hire_landing.leads (name, phone, company, vacancy, source) 
            VALUES ('{name_escaped}', '{phone_escaped}', {company_value}, {vacancy_value}, '{source_escaped}')
        """
        cursor.execute(query_leads)
        
        # Теперь сохраняем в lead_data (для CRM) со статусом "Новый лид" (stage_id = 1)
        query_lead_data = f"""
            INSERT INTO t_p27512893_ai_hire_landing.lead_data 
            (name, phone, company, vacancy, source, stage_id, priority, notes, created_at, updated_at) 
            VALUES (
                '{name_escaped}', 
                '{phone_escaped}', 
                {company_value}, 
                {vacancy_value}, 
                '{source_escaped}', 
                1, 
                'medium', 
                CONCAT('Тип формы: ', {form_type_value}, E'\\n', 'Страница: ', {page_value}),
                NOW(), 
                NOW()
            )
            RETURNING id
        """
        cursor.execute(query_lead_data)
        
        print(f"Lead saved successfully")
        
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