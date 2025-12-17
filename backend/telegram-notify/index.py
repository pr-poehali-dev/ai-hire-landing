import json
import os
import urllib.request
import urllib.parse
from typing import Dict, Any


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Отправляет уведомления о новых лидах в Telegram чат
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    chat_id = os.environ.get('TELEGRAM_CHAT_ID')
    
    if not bot_token or not chat_id:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Telegram credentials not configured'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    
    print(f"Received notification request: {body_data}")
    
    name = body_data.get('name', 'Не указано')
    phone = body_data.get('phone', 'Не указано')
    source = body_data.get('source', 'Неизвестно')
    form_type = body_data.get('form_type', 'Не указан')
    page = body_data.get('page', 'Не указана')
    company = body_data.get('company', '')
    problem = body_data.get('problem', '')
    
    message_parts = [
        '🔔 <b>Новая заявка!</b>',
        '',
        f'👤 <b>Имя:</b> {name}',
        f'📱 <b>Телефон:</b> {phone}',
    ]
    
    if company:
        message_parts.append(f'🏢 <b>Компания:</b> {company}')
    
    message_parts.extend([
        f'📍 <b>Источник:</b> {source}',
        f'📝 <b>Тип формы:</b> {form_type}',
    ])
    
    if problem:
        message_parts.append(f'❗ <b>Проблема:</b> {problem}')
    
    message_parts.extend([
        f'📄 <b>Страница:</b> {page}',
        '',
        f"⏰ Время: {body_data.get('timestamp', 'сейчас')}"
    ])
    
    message = '\n'.join(message_parts)
    
    print(f"Sending message to Telegram: {message}")
    
    telegram_url = f'https://api.telegram.org/bot{bot_token}/sendMessage'
    
    data = urllib.parse.urlencode({
        'chat_id': chat_id,
        'text': message,
        'parse_mode': 'HTML'
    }).encode()
    
    req = urllib.request.Request(telegram_url, data=data)
    
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            result = json.loads(response.read().decode())
            print(f"Telegram API response: {result}")
            
            if result.get('ok'):
                print("Message sent successfully!")
                return {
                    'statusCode': 200,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'success': True, 'message': 'Notification sent'})
                }
            else:
                print(f"Telegram API error: {result}")
                return {
                    'statusCode': 500,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Telegram API error', 'details': result})
                }
    except Exception as e:
        print(f"Exception occurred: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }