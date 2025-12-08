import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    AI-ассистент для CRM: анализ лидов, рекомендации, автоматизация
    POST /analyze - анализ конкретного лида и рекомендации
    POST /suggest-action - предложить следующий шаг для лида
    POST /summarize - краткая сводка по лиду
    GET /insights?lead_id=123 - получить AI-инсайты по лиду
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
    openai_key = os.environ.get('OPENAI_API_KEY')
    
    if not openai_key:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({
                'success': False, 
                'error': 'OPENAI_API_KEY not configured. Please add it in project secrets.'
            }),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(dsn)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action', 'analyze')
            
            if action == 'daily_plan':
                leads_data = body_data.get('leads', [])
                daily_tasks = generate_daily_plan(leads_data, cursor, openai_key)
                
                return {
                    'statusCode': 200,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({
                        'success': True,
                        'daily_tasks': daily_tasks
                    }),
                    'isBase64Encoded': False
                }
            
            lead_id = body_data.get('lead_id')
            
            if not lead_id:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'success': False, 'error': 'lead_id required'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute('''
                SELECT l.*, s.name as stage_name
                FROM lead_data l
                LEFT JOIN lead_stages s ON l.stage_id = s.id
                WHERE l.id = %s
            ''', (lead_id,))
            lead = cursor.fetchone()
            
            if not lead:
                return {
                    'statusCode': 404,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'success': False, 'error': 'Lead not found'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute('SELECT * FROM lead_tasks WHERE lead_id = %s', (lead_id,))
            tasks = cursor.fetchall()
            
            cursor.execute('SELECT * FROM lead_comments WHERE lead_id = %s ORDER BY created_at DESC LIMIT 5', (lead_id,))
            comments = cursor.fetchall()
            
            cursor.execute('SELECT * FROM lead_calls WHERE lead_id = %s ORDER BY started_at DESC LIMIT 3', (lead_id,))
            calls = cursor.fetchall()
            
            lead_context = {
                'name': lead['name'],
                'phone': lead['phone'],
                'company': lead.get('company'),
                'vacancy': lead.get('vacancy'),
                'stage': lead.get('stage_name'),
                'priority': lead['priority'],
                'notes': lead.get('notes'),
                'tasks_count': len(tasks),
                'completed_tasks': len([t for t in tasks if t['completed']]),
                'comments_count': len(comments),
                'calls_count': len(calls),
                'last_call': calls[0] if calls else None,
                'created_at': str(lead['created_at'])
            }
            
            if action == 'analyze':
                analysis = analyze_lead_with_ai(lead_context, openai_key)
                return {
                    'statusCode': 200,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({
                        'success': True,
                        'analysis': analysis
                    }),
                    'isBase64Encoded': False
                }
            
            elif action == 'suggest':
                suggestion = suggest_next_action(lead_context, openai_key)
                return {
                    'statusCode': 200,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({
                        'success': True,
                        'suggestion': suggestion
                    }),
                    'isBase64Encoded': False
                }
            
            elif action == 'summarize':
                summary = summarize_lead(lead_context, comments, openai_key)
                return {
                    'statusCode': 200,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({
                        'success': True,
                        'summary': summary
                    }),
                    'isBase64Encoded': False
                }
        
        elif method == 'GET':
            params = event.get('queryStringParameters') or {}
            lead_id = params.get('lead_id')
            
            if not lead_id:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'success': False, 'error': 'lead_id required'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute('''
                SELECT l.*, s.name as stage_name
                FROM lead_data l
                LEFT JOIN lead_stages s ON l.stage_id = s.id
                WHERE l.id = %s
            ''', (lead_id,))
            lead = cursor.fetchone()
            
            if not lead:
                return {
                    'statusCode': 404,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'success': False, 'error': 'Lead not found'}),
                    'isBase64Encoded': False
                }
            
            insights = generate_quick_insights(dict(lead), openai_key)
            
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({
                    'success': True,
                    'insights': insights
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


def analyze_lead_with_ai(lead_context: dict, api_key: str) -> dict:
    '''Глубокий анализ лида с помощью AI'''
    from openai import OpenAI
    
    client = OpenAI(api_key=api_key)
    
    prompt = f"""Проанализируй лида в CRM системе HR-агентства и дай рекомендации:

Данные лида:
- Имя: {lead_context['name']}
- Компания: {lead_context.get('company', 'не указана')}
- Вакансия: {lead_context.get('vacancy', 'не указана')}
- Текущий этап: {lead_context['stage']}
- Приоритет: {lead_context['priority']}
- Задач выполнено: {lead_context['completed_tasks']}/{lead_context['tasks_count']}
- Звонков: {lead_context['calls_count']}
- Комментариев: {lead_context['comments_count']}
- Заметки: {lead_context.get('notes', 'нет')}

Дай краткий анализ (до 150 слов):
1. Оценка качества лида (горячий/теплый/холодный)
2. Вероятность закрытия сделки (%)
3. Главные риски
4. Рекомендации по работе

Ответ дай в JSON формате:
{{
  "lead_temperature": "горячий/теплый/холодный",
  "conversion_probability": 85,
  "risk_level": "низкий/средний/высокий",
  "key_insights": "краткий вывод",
  "recommendations": ["действие 1", "действие 2", "действие 3"]
}}"""
    
    try:
        response = client.chat.completions.create(
            model='gpt-4o-mini',
            messages=[
                {'role': 'system', 'content': 'Ты эксперт-аналитик CRM для HR-агентства. Даёшь четкие бизнес-рекомендации.'},
                {'role': 'user', 'content': prompt}
            ],
            temperature=0.7,
            max_tokens=500,
            response_format={"type": "json_object"}
        )
        
        content = response.choices[0].message.content
        return json.loads(content)
    
    except Exception as e:
        return generate_fallback_analysis(lead_context)


def suggest_next_action(lead_context: dict, api_key: str) -> dict:
    '''Предложить следующий шаг для лида'''
    from openai import OpenAI
    
    client = OpenAI(api_key=api_key)
    
    prompt = f"""Лид "{lead_context['name']}" на этапе "{lead_context['stage']}".
Компания: {lead_context.get('company', 'не указана')}
Вакансия: {lead_context.get('vacancy', 'не указана')}
Выполнено задач: {lead_context['completed_tasks']}/{lead_context['tasks_count']}
Последний звонок: {lead_context['last_call'] if lead_context['last_call'] else 'не было'}

Предложи ОДНО конкретное действие прямо сейчас в формате JSON:
{{
  "action": "краткое название действия",
  "description": "подробное описание что сделать",
  "priority": "high/medium/low",
  "estimated_time": "примерное время выполнения",
  "expected_result": "ожидаемый результат"
}}"""
    
    try:
        response = client.chat.completions.create(
            model='gpt-4o-mini',
            messages=[
                {'role': 'system', 'content': 'Ты HR-менеджер с опытом. Даёшь конкретные действия.'},
                {'role': 'user', 'content': prompt}
            ],
            temperature=0.8,
            max_tokens=300,
            response_format={"type": "json_object"}
        )
        
        content = response.choices[0].message.content
        return json.loads(content)
    except:
        return {
            'action': 'Позвонить клиенту',
            'description': 'Свяжитесь с клиентом для уточнения деталей',
            'priority': 'medium',
            'estimated_time': '15 минут',
            'expected_result': 'Уточнить детали вакансии'
        }


def summarize_lead(lead_context: dict, comments: list, api_key: str) -> str:
    '''Краткая сводка по лиду'''
    from openai import OpenAI
    
    client = OpenAI(api_key=api_key)
    comments_text = '\n'.join([f"- {c['text']}" for c in comments[:3]]) if comments else 'Комментариев нет'
    
    prompt = f"""Составь краткую сводку (до 100 слов) по лиду:

{lead_context['name']} ({lead_context.get('company', 'компания не указана')})
Этап: {lead_context['stage']}
Вакансия: {lead_context.get('vacancy', 'не указана')}

Последние комментарии:
{comments_text}

Заметки: {lead_context.get('notes', 'нет')}

Сводка должна быть понятна любому менеджеру, который впервые видит этого лида."""
    
    try:
        response = client.chat.completions.create(
            model='gpt-4o-mini',
            messages=[
                {'role': 'system', 'content': 'Ты составляешь краткие сводки по лидам для HR-менеджеров.'},
                {'role': 'user', 'content': prompt}
            ],
            temperature=0.5,
            max_tokens=200
        )
        
        return response.choices[0].message.content
    
    except:
        return f"Лид {lead_context['name']} на этапе {lead_context['stage']}. Компания: {lead_context.get('company', 'не указана')}."


def generate_daily_plan(leads_data: list, cursor, api_key: str) -> list:
    '''Генерация плана задач на день на основе анализа всех лидов'''
    from openai import OpenAI
    
    if not leads_data:
        return []
    
    client = OpenAI(api_key=api_key)
    
    leads_summary = []
    for lead in leads_data[:20]:
        cursor.execute('''
            SELECT 
                COUNT(CASE WHEN completed = false THEN 1 END) as open_tasks,
                COUNT(*) as total_tasks
            FROM lead_tasks
            WHERE lead_id = %s
        ''', (lead['id'],))
        tasks_info = cursor.fetchone()
        
        cursor.execute('''
            SELECT COUNT(*) as calls_count,
                   MAX(started_at) as last_call
            FROM lead_calls
            WHERE lead_id = %s
        ''', (lead['id'],))
        calls_info = cursor.fetchone()
        
        leads_summary.append({
            'id': lead['id'],
            'name': lead['name'],
            'stage_id': lead['stage_id'],
            'priority': lead['priority'],
            'open_tasks': tasks_info['open_tasks'] if tasks_info else 0,
            'last_call': str(calls_info['last_call']) if calls_info and calls_info['last_call'] else 'никогда'
        })
    
    prompt = f"""Ты - AI-помощник HR-менеджера. Проанализируй список лидов и составь оптимальный план работы на день.

Лиды:
{json.dumps(leads_summary, ensure_ascii=False, indent=2)}

Создай список из 5-7 самых важных задач на день. Учитывай:
- Приоритет лида (high > medium > low)
- Незавершенные задачи
- Давность последнего звонка
- Этап воронки (early stage = срочнее)

Для каждой задачи укажи lead_id, lead_name, action, priority, reason, estimated_time.

Ответ в JSON формате (массив объектов)."""
    
    try:
        response = client.chat.completions.create(
            model='gpt-4o-mini',
            messages=[{'role': 'user', 'content': prompt}],
            temperature=0.7,
            max_tokens=1500,
            response_format={"type": "json_object"}
        )
        
        result = json.loads(response.choices[0].message.content)
        daily_tasks = result.get('tasks', result.get('daily_tasks', []))
        return daily_tasks[:7]
        
    except Exception as e:
        return [
            {
                "lead_id": leads_data[0]['id'],
                "lead_name": leads_data[0]['name'],
                "action": "Связаться с клиентом",
                "priority": "high",
                "reason": f"Автоматическая рекомендация",
                "estimated_time": "15 минут"
            }
        ]


def generate_quick_insights(lead: dict, api_key: str) -> list:
    '''Быстрые инсайты по лиду (без глубокого анализа)'''
    
    insights = []
    
    stage_name = lead.get('stage_name', 'Новый лид')
    if stage_name == 'Новый лид':
        insights.append({
            'icon': 'Sparkles',
            'text': 'Новый лид! Рекомендуется связаться в течение 2 часов',
            'type': 'urgent'
        })
    
    if lead.get('priority') == 'high':
        insights.append({
            'icon': 'AlertTriangle',
            'text': 'Высокий приоритет - требует особого внимания',
            'type': 'warning'
        })
    
    if not lead.get('company'):
        insights.append({
            'icon': 'Building2',
            'text': 'Не указана компания - добавьте для лучшего контекста',
            'type': 'info'
        })
    
    if not lead.get('vacancy'):
        insights.append({
            'icon': 'Briefcase',
            'text': 'Не указана вакансия - уточните при первом контакте',
            'type': 'info'
        })
    
    if not insights:
        insights.append({
            'icon': 'CheckCircle2',
            'text': 'Все основные данные заполнены',
            'type': 'success'
        })
    
    return insights


def generate_fallback_analysis(lead_context: dict) -> dict:
    '''Базовый анализ без AI (fallback)'''
    
    probability = 50
    if lead_context['priority'] == 'high':
        probability += 20
    if lead_context['calls_count'] > 0:
        probability += 10
    if lead_context['completed_tasks'] > 0:
        probability += 10
    
    temperature = 'холодный'
    if probability > 70:
        temperature = 'горячий'
    elif probability > 50:
        temperature = 'теплый'
    
    return {
        'lead_temperature': temperature,
        'conversion_probability': probability,
        'risk_level': 'средний',
        'key_insights': f'Лид {lead_context["name"]} находится на этапе {lead_context["stage"]}. Требуется активная работа.',
        'recommendations': [
            'Связаться с клиентом',
            'Уточнить детали вакансии',
            'Назначить следующую встречу'
        ]
    }


def generate_fallback_suggestion(lead_context: dict) -> dict:
    '''Базовое предложение без AI (fallback)'''
    
    return {
        'action': 'Позвонить клиенту',
        'description': f'Свяжитесь с {lead_context["name"]} для уточнения деталей и обсуждения следующих шагов',
        'priority': 'medium',
        'estimated_time': '15-20 минут',
        'expected_result': 'Получить обратную связь и согласовать дальнейшие действия'
    }