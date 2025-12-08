import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Register = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inviteToken, setInviteToken] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  useEffect(() => {
    const token = searchParams.get('invite');
    if (token) {
      setInviteToken(token);
    } else {
      toast({
        title: 'Требуется инвайт',
        description: 'Регистрация возможна только по инвайт-ссылке',
        variant: 'destructive'
      });
      navigate('/login');
    }
  }, [searchParams, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://functions.poehali.dev/ed435586-cc3a-4110-823d-40bef1675071', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          invite_token: inviteToken
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: 'Регистрация завершена! 🎉',
          description: 'Теперь войдите в систему'
        });
        navigate('/login');
      } else {
        throw new Error(data.error || 'Ошибка регистрации');
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

  if (!inviteToken) {
    return null;
  }

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
            Регистрация в CRM
          </h1>
          <p className="text-muted-foreground">
            Создайте аккаунт для доступа к системе
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Icon name="User" size={16} className="text-primary" />
              Имя
            </label>
            <Input
              placeholder="Иван Иванов"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="glass border-primary/30 h-12 focus:neon-glow transition-all"
            />
          </div>

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
              className="glass border-secondary/30 h-12 focus:neon-glow transition-all"
            />
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full h-12 neon-glow bg-gradient-to-r from-primary to-secondary hover-scale"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Создание аккаунта...
              </>
            ) : (
              <>
                <Icon name="UserPlus" size={18} className="mr-2" />
                Зарегистрироваться
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/login')}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Icon name="ArrowLeft" size={16} className="mr-2" />
            Уже есть аккаунт? Войти
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Register;
