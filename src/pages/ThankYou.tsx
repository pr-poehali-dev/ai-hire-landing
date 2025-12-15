import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const ThankYou = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 10000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="fixed top-20 left-10 w-64 h-64 bg-primary/20 rounded-full blur-orb animate-pulse" style={{ animationDuration: '4s' }}></div>
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-secondary/15 rounded-full blur-orb animate-pulse" style={{ animationDuration: '6s' }}></div>

      <Card className="glass-dark p-8 md:p-12 max-w-2xl w-full text-center space-y-8 animate-scale-in relative z-10">
        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-glow animate-pulse">
          <Icon name="CheckCircle2" size={48} className="text-white" />
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold neon-text">
            Спасибо за вашу заявку!
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Мы получили вашу заявку и свяжемся с вами в течение 2 часов
          </p>
        </div>

        <div className="glass p-6 rounded-lg space-y-3 text-left">
          <div className="flex items-center gap-3">
            <Icon name="Clock" size={20} className="text-primary" />
            <p className="text-sm">Среднее время ответа: <strong className="text-primary">15 минут</strong></p>
          </div>
          <div className="flex items-center gap-3">
            <Icon name="Phone" size={20} className="text-secondary" />
            <p className="text-sm">Наш менеджер позвонит вам для уточнения деталей</p>
          </div>
          <div className="flex items-center gap-3">
            <Icon name="Users" size={20} className="text-secondary" />
            <p className="text-sm">Подберем <strong className="text-secondary">топ-3 кандидата</strong> за 24 часа</p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-muted-foreground">
            А пока можете узнать больше о нашей работе
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={() => navigate('/')} 
              className="neon-glow bg-gradient-to-r from-primary to-secondary hover:opacity-90 hover:scale-105 transition-all"
            >
              <Icon name="Home" size={18} className="mr-2" />
              Вернуться на главную
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.open('https://t.me/TheDenisZ', '_blank')}
              className="hover:neon-glow hover:scale-105 transition-all"
            >
              <Icon name="MessageCircle" size={18} className="mr-2" />
              Написать в Telegram
            </Button>
          </div>
        </div>

        <div className="pt-4 border-t border-border/30">
          <p className="text-xs text-muted-foreground">
            Автоматическое перенаправление через 10 секунд...
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ThankYou;
