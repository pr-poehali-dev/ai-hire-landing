import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime, timedelta

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Система уведомлений о задачах
    GET /notifications - получить все активные уведомления для пользователя
    GET /notifications?type=tasks - уведомления о задачах с истекающим сроком
    GET /notifications?type=leads - уведомления о лидах требующих внимания
    POST /notifications/read - отметить уведомление как прочитанное
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
            notification_type = params.get('type', 'all')
            
            notifications = []
            
            if notification_type in ['all', 'tasks']:
                now = datetime.now()
                today = now.date()
                tomorrow = (now + timedelta(days=1)).date()
                
                cursor.execute('''
                    SELECT 
                        t.id,
                        t.title,
                        t.due_date,
                        t.priority,
                        l.id as lead_id,
                        l.name as lead_name,
                        'task' as notification_type
                    FROM lead_tasks t
                    JOIN lead_data l ON t.lead_id = l.id
                    WHERE t.completed = false 
                    AND t.due_date IS NOT NULL
                    AND DATE(t.due_date) <= %s
                    ORDER BY t.due_date ASC
                ''', (tomorrow,))
                
                tasks = cursor.fetchall()
                
                for task in tasks:
                    task_date = task['due_date'].date() if task['due_date'] else None
                    
                    if task_date == today:
                        urgency = 'urgent'
                        message = f"Задача сегодня: {task['title']}"
                    elif task_date and task_date < today:
                        urgency = 'overdue'
                        days_overdue = (today - task_date).days
                        message = f"Просрочено {days_overdue} дн.: {task['title']}"
                    else:
                        urgency = 'normal'
                        message = f"Задача завтра: {task['title']}"
                    
                    notifications.append({
                        'id': f"task_{task['id']}",
                        'type': 'task',
                        'urgency': urgency,
                        'title': message,
                        'lead_id': task['lead_id'],
                        'lead_name': task['lead_name'],
                        'priority': task['priority'],
                        'due_date': str(task['due_date']),
                        'created_at': str(datetime.now())
                    })
            
            if notification_type in ['all', 'leads']:
                cursor.execute('''
                    SELECT 
                        l.id,
                        l.name,
                        l.priority,
                        l.created_at,
                        s.name as stage_name,
                        (SELECT COUNT(*) FROM lead_calls WHERE lead_id = l.id) as calls_count,
                        (SELECT MAX(started_at) FROM lead_calls WHERE lead_id = l.id) as last_call
                    FROM lead_data l
                    LEFT JOIN lead_stages s ON l.stage_id = s.id
                    WHERE l.priority = 'high'
                    AND l.stage_id <= 3
                    ORDER BY l.created_at DESC
                    LIMIT 10
                ''')
                
                leads = cursor.fetchall()
                
                for lead in leads:
                    days_old = (datetime.now() - lead['created_at']).days
                    last_call = lead.get('last_call')
                    
                    if lead['calls_count'] == 0 and days_old > 0:
                        notifications.append({
                            'id': f"lead_{lead['id']}_no_calls",
                            'type': 'lead',
                            'urgency': 'urgent',
                            'title': f"Нет звонков: {lead['name']}",
                            'lead_id': lead['id'],
                            'lead_name': lead['name'],
                            'priority': lead['priority'],
                            'message': f"Приоритетный лид без звонков уже {days_old} дн.",
                            'created_at': str(datetime.now())
                        })
                    
                    elif last_call:
                        days_since_call = (datetime.now() - last_call).days
                        if days_since_call > 3:
                            notifications.append({
                                'id': f"lead_{lead['id']}_inactive",
                                'type': 'lead',
                                'urgency': 'normal',
                                'title': f"Давно не было контакта: {lead['name']}",
                                'lead_id': lead['id'],
                                'lead_name': lead['name'],
                                'priority': lead['priority'],
                                'message': f"Последний звонок был {days_since_call} дн. назад",
                                'created_at': str(datetime.now())
                            })
            
            notifications.sort(key=lambda x: (
                0 if x['urgency'] == 'overdue' else 1 if x['urgency'] == 'urgent' else 2,
                x.get('due_date', '9999-99-99')
            ))
            
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({
                    'success': True,
                    'notifications': notifications,
                    'total': len(notifications),
                    'unread': len([n for n in notifications if n['urgency'] in ['urgent', 'overdue']])
                }, default=str),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'success': False, 'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    finally:
        cursor.close()
        conn.close()
