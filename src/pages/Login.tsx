import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isReset, setIsReset] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isReset) {
        if (!resetToken) {
          const response = await fetch('https://functions.poehali.dev/5abb26ce-21bf-442e-a2d0-45f452b38e21', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: formData.email })
          });

          const data = await response.json();

          if (response.ok && data.success) {
            if (data.token) {
              setResetToken(data.token);
              toast({ 
                title: 'Токен получен! 🔑', 
                description: 'Введите новый пароль' 
              });
            } else {
              toast({ 
                title: 'Проверьте почту', 
                description: 'Если email существует, инструкция отправлена' 
              });
            }
          } else {
            throw new Error(data.error || 'Ошибка');
          }
        } else {
          const response = await fetch('https://functions.poehali.dev/594ecf2c-625e-46c1-ac73-2078fdcd39e0', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: resetToken, new_password: formData.password })
          });

          const data = await response.json();

          if (response.ok && data.success) {
            toast({ 
              title: 'Пароль изменён! 🎉', 
              description: 'Теперь войдите с новым паролем' 
            });
            setIsReset(false);
            setResetToken('');
            setIsLogin(true);
            setFormData({ email: '', password: '', name: '' });
          } else {
            throw new Error(data.error || 'Ошибка');
          }
        }
      } else {
        const response = await fetch('https://functions.poehali.dev/7c9852b6-3eca-44e3-966d-f3ecbcb52656', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          localStorage.setItem('auth_token', data.token);
          localStorage.setItem('user_email', data.user.email);
          localStorage.setItem('user_name', data.user.name || '');
          
          toast({ 
            title: 'Добро пожаловать! 🚀', 
            description: 'Вы успешно вошли в систему' 
          });
          
          navigate('/crm');
        } else {
          throw new Error(data.error || 'Ошибка');
        }
      }
    } catch (error: any) {
      toast({ 
        title: 'Ошибка', 
        description: error.message || 'Попробуйте еще раз',
        variant: 'destructive' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4">
      <div className="fixed top-20 left-10 w-64 h-64 bg-primary/20 rounded-full blur-orb animate-pulse" style={{ animationDuration: '4s' }}></div>
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-secondary/15 rounded-full blur-orb animate-pulse" style={{ animationDuration: '6s' }}></div>

      <Card className="glass-dark p-8 max-w-md w-full neon-glow animate-scale-in relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-glow">
              <Icon name="Sparkles" size={24} className="text-white animate-pulse" />
            </div>
            <span className="text-2xl font-bold neon-text">1 DAY HR</span>
          </div>
          
          <h1 className="text-3xl font-bold neon-text mb-2">
            {isReset ? 'Восстановление пароля' : 'Вход в CRM'}
          </h1>
          <p className="text-muted-foreground">
            {isReset ? 'Введите email для восстановления' : 'Войдите в систему управления заявками'}
          </p>
        </div>

        {isReset && (
          <Button
            type="button"
            variant="outline"
            className="w-full mb-6"
            onClick={() => { setIsReset(false); setResetToken(''); }}
          >
            <Icon name="ArrowLeft" size={16} className="mr-2" />
            Назад к входу
          </Button>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {!resetToken && (
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Icon name="Mail" size={16} className="text-primary" />
                Email *
              </label>
              <Input
                type="email"
                placeholder="example@mail.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                className="glass border-primary/30 h-12 focus:neon-glow transition-all"
              />
            </div>
          )}

          {!isReset && (
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Icon name="Lock" size={16} className="text-secondary" />
                Пароль *
              </label>
              <Input
                type="password"
                placeholder="Минимум 6 символов"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                minLength={6}
                className="glass border-primary/30 h-12 focus:neon-glow transition-all"
              />
            </div>
          )}

          {isReset && resetToken && (
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Icon name="Lock" size={16} className="text-secondary" />
                Новый пароль *
              </label>
              <Input
                type="password"
                placeholder="Минимум 6 символов"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                minLength={6}
                className="glass border-primary/30 h-12 focus:neon-glow transition-all"
              />
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full neon-glow bg-gradient-to-r from-primary to-secondary hover:opacity-90 hover:scale-105 transition-all text-lg py-6 mt-6"
          >
            {isSubmitting ? (
              <>
                <Icon name="Loader2" className="animate-spin mr-2" size={20} />
                Загрузка...
              </>
            ) : isReset ? (
              <>
                <Icon name="Key" size={20} className="mr-2" />
                {resetToken ? 'Установить новый пароль' : 'Получить токен'}
              </>
            ) : (
              <>
                <Icon name={isLogin ? "LogIn" : "UserPlus"} size={20} className="mr-2" />
                {isLogin ? 'Войти' : 'Зарегистрироваться'}
              </>
            )}
          </Button>
        </form>

        {isLogin && !isReset && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setIsReset(true)}
              className="text-sm text-muted-foreground hover:text-primary transition-all"
            >
              Забыли пароль?
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-muted-foreground hover:text-primary transition-all"
          >
            <Icon name="ArrowLeft" size={14} className="inline mr-1" />
            Вернуться на главную
          </button>
        </div>

        {!isLogin && (
          <Card className="glass p-4 border-accent/30 mt-6">
            <div className="flex items-start gap-3">
              <Icon name="Info" size={20} className="text-accent flex-shrink-0 mt-0.5" />
              <div className="text-xs text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Требования к паролю:</p>
                <ul className="space-y-1">
                  <li>• Минимум 6 символов</li>
                  <li>• Используйте надежный пароль</li>
                </ul>
              </div>
            </div>
          </Card>
        )}
      </Card>
    </div>
  );
};

export default Login;