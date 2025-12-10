import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface ChatWidgetProps {
  scrollToSection: (id: string) => void;
}

const ChatWidget = ({ scrollToSection }: ChatWidgetProps) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'bot', text: 'Привет! 👋 Я Юра, виртуальный HR-ассистент. Чем могу помочь?', time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [chatInput, setChatInput] = useState('');

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    
    const userMsg = { role: 'user', text: chatInput, time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');

    setTimeout(() => {
      const responses = [
        'Отличный вопрос! Наш AI анализирует кандидатов по 50+ параметрам за считанные секунды. Хотите узнать подробнее?',
        'Средняя скорость подбора — 18-24 часа. Для срочных заказов можем найти за 12 часов с доплатой 50%.',
        'Да, гарантия замены действует весь испытательный срок (до 3 месяцев). Это бесплатно!',
        'Стоимость от 35,000₽ до 110,000₽ в зависимости от уровня позиции. Попробуйте наш калькулятор выше!',
        'Конечно! Я могу помочь с любым вопросом. Напишите подробнее, что вас интересует, или оставьте заявку на консультацию.'
      ];
      const botMsg = { role: 'bot', text: responses[Math.floor(Math.random() * responses.length)], time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) };
      setChatMessages(prev => [...prev, botMsg]);
    }, 1000);
  };

  return (
    <>
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-4 md:bottom-6 right-3 md:right-6 z-50 w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-glow hover:scale-110 transition-all shadow-2xl relative animate-fade-in"
        >
          <Icon name="MessageCircle" size={24} className="md:w-7 md:h-7 text-white" />
          <span className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-accent rounded-full animate-pulse" />
        </button>
      )}

      {isChatOpen && (
        <Card className="fixed bottom-0 md:bottom-6 right-0 md:right-6 z-50 w-full md:w-96 h-[100dvh] md:h-[600px] md:rounded-lg glass-dark border-primary/30 neon-glow flex flex-col animate-scale-in shadow-2xl">
          <div className="flex items-center justify-between p-4 border-b border-border/50 bg-gradient-to-r from-primary/20 to-secondary/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-glow">
                <Icon name="Bot" size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold">Юра — HR-ассистент</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Онлайн
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsChatOpen(false)}
              className="hover:bg-destructive/20 hover:text-destructive"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                <div className={`max-w-[80%] space-y-1`}>
                  <div className={`p-3 rounded-lg ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-r from-primary to-secondary text-white ml-auto' 
                      : 'glass border border-border/50'
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                  <p className={`text-xs text-muted-foreground ${
                    msg.role === 'user' ? 'text-right' : 'text-left'
                  }`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-border/50 space-y-2">
            <Button
              onClick={() => window.open('https://t.me/TheDenisZ', '_blank')}
              className="w-full neon-glow bg-gradient-to-r from-primary to-secondary hover:opacity-90 mb-3"
            >
              <Icon name="MessageCircle" size={18} className="mr-2" />
              Написать в Telegram
            </Button>
            <div className="flex gap-2">
              <Input
                placeholder="Напишите сообщение..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                className="glass border-primary/30"
              />
              <Button
                onClick={sendChatMessage}
                size="icon"
                className="neon-glow bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                <Icon name="Send" size={18} />
              </Button>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Badge
                onClick={() => setChatInput('Сколько стоит подбор?')}
                className="cursor-pointer hover:scale-105 transition-all bg-primary/20 text-primary text-xs"
              >
                💰 Стоимость
              </Badge>
              <Badge
                onClick={() => setChatInput('Как быстро найдёте кандидата?')}
                className="cursor-pointer hover:scale-105 transition-all bg-secondary/20 text-secondary text-xs"
              >
                ⚡ Скорость
              </Badge>
              <Badge
                onClick={() => setChatInput('Есть гарантия?')}
                className="cursor-pointer hover:scale-105 transition-all bg-accent/20 text-accent text-xs"
              >
                🛡️ Гарантия
              </Badge>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default ChatWidget;