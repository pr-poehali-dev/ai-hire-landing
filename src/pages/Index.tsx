import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [stats, setStats] = useState({ totalClosed: 1258, inProgress: 4 });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [skillScores, setSkillScores] = useState({
    communication: 0,
    motivation: 0,
    stress: 0,
    leadership: 0
  });
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'bot', text: 'Привет! 👋 Я Юра, виртуальный HR-ассистент. Чем могу помочь?', time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [consultForm, setConsultForm] = useState({ name: '', phone: '', company: '', vacancy: '' });
  const [isConsultFormOpen, setIsConsultFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConsultSubmitting, setIsConsultSubmitting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        totalClosed: prev.totalClosed + Math.floor(Math.random() * 2),
        inProgress: 3 + Math.floor(Math.random() * 3)
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isAnalyzing) {
      const steps = ['Загрузка видео...', 'Анализ речи...', 'Оценка эмоций...', 'Формирование профиля...', 'Анализ завершен!'];
      const interval = setInterval(() => {
        setAnalysisStep(prev => {
          if (prev < steps.length - 1) return prev + 1;
          setIsAnalyzing(false);
          return prev;
        });
      }, 1500);

      const skillInterval = setInterval(() => {
        setSkillScores(prev => ({
          communication: Math.min(prev.communication + Math.random() * 15, 94),
          motivation: Math.min(prev.motivation + Math.random() * 12, 87),
          stress: Math.min(prev.stress + Math.random() * 10, 83),
          leadership: Math.min(prev.leadership + Math.random() * 8, 78)
        }));
      }, 100);

      return () => {
        clearInterval(interval);
        clearInterval(skillInterval);
      };
    }
  }, [isAnalyzing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('https://functions.poehali.dev/6389194d-86d0-46d4-bc95-83e9f660f267', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          source: 'main_form'
        })
      });
      
      if (!response.ok) throw new Error('Failed to submit');
      
      toast({ title: 'Заявка отправлена! 🚀', description: 'Мы свяжемся с вами в течение 2 часов' });
      setFormData({ name: '', phone: '' });
    } catch (error) {
      toast({ 
        title: 'Ошибка отправки', 
        description: 'Попробуйте еще раз или позвоните нам',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConsultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConsultSubmitting(true);
    
    try {
      const response = await fetch('https://functions.poehali.dev/6389194d-86d0-46d4-bc95-83e9f660f267', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: consultForm.name,
          phone: consultForm.phone,
          company: consultForm.company,
          vacancy: consultForm.vacancy,
          source: 'consultation'
        })
      });
      
      if (!response.ok) throw new Error('Failed to submit');
      
      toast({ title: 'Консультация заказана! 🎉', description: 'Мы позвоним вам в течение 30 минут' });
      setConsultForm({ name: '', phone: '', company: '', vacancy: '' });
      setIsConsultFormOpen(false);
    } catch (error) {
      toast({ 
        title: 'Ошибка отправки', 
        description: 'Попробуйте еще раз или позвоните нам',
        variant: 'destructive'
      });
    } finally {
      setIsConsultSubmitting(false);
    }
  };

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

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const startDemo = () => {
    setIsAnalyzing(true);
    setAnalysisStep(0);
    setSkillScores({ communication: 0, motivation: 0, stress: 0, leadership: 0 });
  };

  const teamMembers = [
    { name: 'Дарья Коломанова', role: 'Ведущий HR-специалист', spec: 'IT-рекрутмент', exp: '8 лет', hires: '250+', img: 'https://i.pravatar.cc/150?img=5' },
    { name: 'Ангелина Малиновская', role: 'Senior HR-менеджер', spec: 'Продажи и маркетинг', exp: '6 лет', hires: '180+', img: 'https://i.pravatar.cc/150?img=9' },
    { name: 'Дарья Морозова', role: 'Team Lead HR', spec: 'Стратегический найм', exp: '10 лет', hires: '320+', img: 'https://i.pravatar.cc/150?img=10' },
    { name: 'Марианна Ильясовна', role: 'HR-специалист', spec: 'Маркетплейсы', exp: '5 лет', hires: '150+', img: 'https://i.pravatar.cc/150?img=16' },
    { name: 'Алексей Соколов', role: 'HR-аналитик', spec: 'Финтех', exp: '7 лет', hires: '220+', img: 'https://i.pravatar.cc/150?img=12' },
    { name: 'Екатерина Волкова', role: 'Recruitment Lead', spec: 'Стартапы', exp: '12 лет', hires: '400+', img: 'https://i.pravatar.cc/150?img=32' },
    { name: 'Михаил Петров', role: 'Junior HR', spec: 'Ритейл', exp: '3 года', hires: '80+', img: 'https://i.pravatar.cc/150?img=15' },
    { name: 'Светлана Новикова', role: 'Senior Recruiter', spec: 'EdTech и Healthcare', exp: '9 лет', hires: '290+', img: 'https://i.pravatar.cc/150?img=28' }
  ];

  const testimonials = [
    { name: 'Дмитрий Козлов', position: 'Tech Lead', company: 'NeoTech Solutions', text: 'AI-анализ выявил кандидата, который работал с похожей архитектурой в банковской сфере. Это был неочевидный выбор, но именно то, что нам было нужно.', rating: 5, img: 'https://i.pravatar.cc/150?img=12' },
    { name: 'Елена Соколова', position: 'Head of AI Department', company: 'FinServe Pro', text: 'Искали полгода классическими методами. 1 DAY HR нашли идеального кандидата за сутки. Система AI-анализа показала совместимость с нашей командой 94%.', rating: 5, img: 'https://i.pravatar.cc/150?img=20' },
    { name: 'Максим Петров', position: 'Product Manager', company: 'MobileHub', text: 'Боялись, что проект встанет. Но за сутки нашли специалиста, который не только закрыл задачу, но и провёл рефакторинг, улучшив всё приложение.', rating: 5, img: 'https://i.pravatar.cc/150?img=13' },
    { name: 'Анна Смирнова', position: 'COO', company: 'MegaSell', text: 'Критически важно было найти человека быстро. 1 DAY HR справились за сутки, и это был именно тот специалист, который нам был нужен.', rating: 5, img: 'https://i.pravatar.cc/150?img=23' },
    { name: 'Алексей Морозов', position: 'Sales Director', company: 'TelecomPro', text: 'ИИ-анализ показал скрытые навыки кандидата, которые мы бы упустили при обычном подборе. Результат превзошёл все ожидания!', rating: 5, img: 'https://i.pravatar.cc/150?img=33' },
    { name: 'Ирина Федорова', position: 'Head of Sales', company: 'ConnectPlus', text: 'Кандидат знал наших конкурентов изнутри. AI-система оценила это как преимущество. За месяц вернул трёх крупных клиентов.', rating: 5, img: 'https://i.pravatar.cc/150?img=47' }
  ];

  return (
    <div className="min-h-screen relative">
      <div className="fixed top-20 left-10 w-64 h-64 bg-primary/20 rounded-full blur-orb animate-pulse" style={{ animationDuration: '4s' }}></div>
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-secondary/15 rounded-full blur-orb animate-pulse" style={{ animationDuration: '6s' }}></div>
      <div className="fixed top-1/2 left-1/2 w-80 h-80 bg-accent/10 rounded-full blur-orb animate-pulse" style={{ animationDuration: '5s' }}></div>

      <header className="fixed top-0 left-0 right-0 z-50 glass animate-fade-in">
        <div className="container mx-auto px-3 md:px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 md:gap-2 hover-scale cursor-pointer">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-glow">
                <Icon name="Sparkles" size={16} className="md:w-5 md:h-5 text-white animate-pulse" />
              </div>
              <span className="text-base md:text-xl font-bold neon-text">1 DAY HR</span>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <button onClick={() => scrollToSection('demo')} className="text-sm hover:text-primary transition-all hover:scale-110">AI Демо</button>
              <Link to="/calculator" className="text-sm hover:text-primary transition-all hover:scale-110">Калькулятор</Link>
              <button onClick={() => scrollToSection('cases')} className="text-sm hover:text-primary transition-all hover:scale-110">Кейсы</button>
              <button onClick={() => scrollToSection('team')} className="text-sm hover:text-primary transition-all hover:scale-110">Команда</button>
            </nav>

            <Button onClick={() => scrollToSection('cta')} size="sm" className="neon-glow bg-gradient-to-r from-primary to-secondary hover:opacity-90 hover:scale-105 transition-all text-xs md:text-sm px-3 md:px-4">
              <span className="hidden sm:inline">Найти сотрудника</span>
              <span className="sm:hidden">Заявка</span>
            </Button>
          </div>
        </div>
      </header>

      <section className="pt-24 md:pt-32 pb-12 md:pb-20 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-8 p-4 md:p-8">
            {[
              { img: 'https://i.pravatar.cc/200?img=12', status: 'analyzing', name: 'Кандидат #1247' },
              { img: 'https://i.pravatar.cc/200?img=23', status: 'approved', name: 'Кандидат #1248' },
              { img: 'https://i.pravatar.cc/200?img=33', status: 'interview', name: 'Кандидат #1249' },
              { img: 'https://i.pravatar.cc/200?img=47', status: 'analyzing', name: 'Кандидат #1250' },
              { img: 'https://i.pravatar.cc/200?img=14', status: 'approved', name: 'Кандидат #1251' },
              { img: 'https://i.pravatar.cc/200?img=25', status: 'interview', name: 'Кандидат #1252' },
              { img: 'https://i.pravatar.cc/200?img=32', status: 'analyzing', name: 'Кандидат #1253' },
              { img: 'https://i.pravatar.cc/200?img=28', status: 'approved', name: 'Кандидат #1254' },
              { img: 'https://i.pravatar.cc/200?img=35', status: 'interview', name: 'Кандидат #1255' },
              { img: 'https://i.pravatar.cc/200?img=41', status: 'analyzing', name: 'Кандидат #1256' },
              { img: 'https://i.pravatar.cc/200?img=15', status: 'approved', name: 'Кандидат #1257' },
              { img: 'https://i.pravatar.cc/200?img=20', status: 'interview', name: 'Кандидат #1258' }
            ].map((candidate, idx) => (
              <div key={idx} className="relative animate-fade-in hover-scale" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="relative aspect-square rounded-lg overflow-hidden glass border border-border/30">
                  <img src={candidate.img} alt={candidate.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <div className="text-[8px] md:text-xs font-bold text-white drop-shadow-lg truncate">{candidate.name}</div>
                    <div className="flex items-center gap-1 mt-1">
                      {candidate.status === 'analyzing' && (
                        <div className="flex items-center gap-1">
                          <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-blue-400 rounded-full animate-pulse" />
                          <span className="text-[7px] md:text-[9px] text-blue-400">AI анализ</span>
                        </div>
                      )}
                      {candidate.status === 'approved' && (
                        <div className="flex items-center gap-1">
                          <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-green-400 rounded-full" />
                          <span className="text-[7px] md:text-[9px] text-green-400">Одобрен</span>
                        </div>
                      )}
                      {candidate.status === 'interview' && (
                        <div className="flex items-center gap-1">
                          <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-purple-400 rounded-full animate-pulse" />
                          <span className="text-[7px] md:text-[9px] text-purple-400">Интервью</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="container mx-auto relative z-10 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-4 md:space-y-8">
            <Badge className="glass text-sm md:text-lg px-4 md:px-6 py-1.5 md:py-2 neon-glow animate-fade-in hover:scale-110 transition-all cursor-pointer">
              ✨ Первое HR-агентство с AI подбором
            </Badge>
            
            <h1 className="text-3xl sm:text-4xl md:text-7xl font-bold leading-tight neon-text animate-fade-in" style={{ animationDelay: '0.2s' }}>
              НАЙДЕМ СОТРУДНИКА<br />за 24 часа
            </h1>
            
            <p className="text-lg md:text-2xl text-muted-foreground animate-fade-in" style={{ animationDelay: '0.4s' }}>
              Или вернем деньги. Гарантия 100%
            </p>

            <div className="flex flex-wrap justify-center gap-3 md:gap-6 text-sm md:text-lg animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="flex items-center gap-1.5 md:gap-2 hover-scale cursor-pointer">
                <Icon name="Brain" size={18} className="md:w-5 md:h-5 text-primary animate-pulse" />
                <span className="text-xs md:text-base">ИИ-анализ</span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2 hover-scale cursor-pointer">
                <Icon name="Shield" size={18} className="md:w-5 md:h-5 text-secondary animate-pulse" style={{ animationDelay: '0.5s' }} />
                <span className="text-xs md:text-base">Гарантия</span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2 hover-scale cursor-pointer">
                <Icon name="Target" size={18} className="md:w-5 md:h-5 text-accent animate-pulse" style={{ animationDelay: '1s' }} />
                <span className="text-xs md:text-base">Проверки</span>
              </div>
            </div>

            <div className="flex justify-center gap-4 pt-2 md:pt-4 animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <Button size="lg" onClick={() => scrollToSection('cta')} className="neon-glow bg-gradient-to-r from-primary to-secondary hover:opacity-90 hover:scale-110 transition-all text-base md:text-xl px-8 md:px-12 py-6 md:py-8">
                🔥 Найти сотрудника
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="demo" className="py-12 md:py-20 px-4 md:px-6 bg-muted/5">
        <div className="container mx-auto">
          <div className="text-center mb-8 md:mb-16 space-y-3 md:space-y-4">
            <Badge className="text-sm md:text-lg px-4 md:px-6 py-1.5 md:py-2 neon-glow animate-pulse">🤖 Интерактивная демонстрация</Badge>
            <h2 className="text-2xl md:text-5xl font-bold neon-text">Как мы находим лучших кандидатов</h2>
            <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto">
              AI анализирует видео-интервью и оценивает компетенции
            </p>
          </div>

          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-6 md:gap-8">
            <Card className="glass-dark p-4 md:p-8 space-y-4 md:space-y-6 animate-scale-in hover:neon-glow transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon name="Star" size={24} className="text-accent" />
                  <h3 className="text-2xl font-bold">Анализ завершен</h3>
                </div>
                <Badge className="bg-primary/20 text-primary neon-glow">AI-A</Badge>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Коммуникация</span>
                    <span className="font-bold">{Math.round(skillScores.communication)}%</span>
                  </div>
                  <Progress value={skillScores.communication} className="h-3 bg-muted/50" style={{ '--progress-background': 'linear-gradient(to right, #8B5CF6, #A855F7)' } as React.CSSProperties} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Мотивация</span>
                    <span className="font-bold">{Math.round(skillScores.motivation)}%</span>
                  </div>
                  <Progress value={skillScores.motivation} className="h-3 bg-muted/50" style={{ '--progress-background': 'linear-gradient(to right, #10B981, #34D399)' } as React.CSSProperties} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Стрессоустойчивость</span>
                    <span className="font-bold">{Math.round(skillScores.stress)}%</span>
                  </div>
                  <Progress value={skillScores.stress} className="h-3 bg-muted/50" style={{ '--progress-background': 'linear-gradient(to right, #0EA5E9, #38BDF8)' } as React.CSSProperties} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Лидерство</span>
                    <span className="font-bold">{Math.round(skillScores.leadership)}%</span>
                  </div>
                  <Progress value={skillScores.leadership} className="h-3 bg-muted/50" style={{ '--progress-background': 'linear-gradient(to right, #D946EF, #E879F9)' } as React.CSSProperties} />
                </div>
              </div>

              <Card className="glass-dark p-4 border-accent/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">AI-анализ кандидата</p>
                    <p className="text-xs text-muted-foreground mt-1">Автоматическая оценка</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-accent">~30 сек</p>
                    <p className="text-xs text-muted-foreground">на анализ</p>
                  </div>
                </div>
              </Card>

              <Button onClick={startDemo} className="w-full neon-glow bg-gradient-to-r from-primary to-secondary hover:opacity-90 hover:scale-105 transition-all text-sm md:text-base" disabled={isAnalyzing}>
                {isAnalyzing ? (
                  <>
                    <Icon name="Loader2" className="animate-spin mr-2" size={18} />
                    <span className="text-xs md:text-sm">{['Загрузка видео...', 'Анализ речи...', 'Оценка эмоций...', 'Формирование профиля...', 'Анализ завершен!'][analysisStep]}</span>
                  </>
                ) : (
                  <>
                    <Icon name="Play" className="mr-2" size={18} />
                    <span className="hidden sm:inline">Запустить демонстрацию</span>
                    <span className="sm:hidden">Запустить</span>
                  </>
                )}
              </Button>
            </Card>

            <div className="space-y-6">
              <Card className="glass-dark p-6 hover:neon-glow transition-all animate-fade-in hover-scale">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-glow">
                    <Icon name="Eye" size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Оценка soft skills</h3>
                    <p className="text-sm text-muted-foreground">Анализ невербальных сигналов</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="glass p-3 rounded-lg">
                    <div className="text-2xl font-bold text-primary">98%</div>
                    <div className="text-xs text-muted-foreground">Точность</div>
                  </div>
                  <div className="glass p-3 rounded-lg">
                    <div className="text-2xl font-bold text-secondary">15+</div>
                    <div className="text-xs text-muted-foreground">Параметров</div>
                  </div>
                </div>
              </Card>

              <Card className="glass-dark p-6 hover:neon-glow transition-all animate-fade-in hover-scale" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center neon-glow">
                    <Icon name="MessageSquare" size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">AI-собеседование</h3>
                    <p className="text-sm text-muted-foreground">Умный анализ ответов</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Проведено интервью:</span>
                    <span className="font-bold text-accent">1,258+</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Средняя оценка:</span>
                    <span className="font-bold text-primary">87%</span>
                  </div>
                </div>
              </Card>

              <Card className="glass-dark p-6 hover:neon-glow transition-all animate-fade-in hover-scale" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center neon-glow">
                    <Icon name="TrendingUp" size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Прогноз успешности</h3>
                    <p className="text-sm text-muted-foreground">ML-модель предсказания</p>
                  </div>
                </div>
                <div className="glass p-4 rounded-lg text-center">
                  <div className="text-4xl font-bold neon-text mb-1">92%</div>
                  <div className="text-sm text-muted-foreground">вероятность успешного найма</div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section id="stats" className="py-12 md:py-20 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="glass rounded-2xl md:rounded-3xl p-6 md:p-12 max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
              <div className="space-y-2 md:space-y-3 hover-scale cursor-pointer">
                <div className="text-3xl md:text-6xl font-bold neon-text animate-fade-in">{stats.totalClosed}</div>
                <p className="text-xs md:text-base text-muted-foreground">Вакансий закрыто</p>
                <Icon name="TrendingUp" size={20} className="md:w-6 md:h-6 text-primary mx-auto animate-pulse" />
              </div>
              <div className="space-y-2 md:space-y-3 hover-scale cursor-pointer">
                <div className="text-3xl md:text-6xl font-bold text-secondary animate-fade-in">{stats.inProgress}</div>
                <p className="text-xs md:text-base text-muted-foreground">В работе сейчас</p>
                <Icon name="Clock" size={20} className="md:w-6 md:h-6 text-secondary mx-auto animate-pulse" />
              </div>
              <div className="space-y-2 md:space-y-3 hover-scale cursor-pointer">
                <div className="text-3xl md:text-6xl font-bold text-accent animate-fade-in">24ч</div>
                <p className="text-xs md:text-base text-muted-foreground">Среднее время</p>
                <Icon name="Zap" size={20} className="md:w-6 md:h-6 text-accent mx-auto animate-pulse" />
              </div>
              <div className="space-y-2 md:space-y-3 hover-scale cursor-pointer">
                <div className="text-3xl md:text-6xl font-bold text-primary animate-fade-in">90%</div>
                <p className="text-xs md:text-base text-muted-foreground">Точность подбора</p>
                <Icon name="Target" size={20} className="md:w-6 md:h-6 text-primary mx-auto animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="success-charts" className="py-12 md:py-20 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16 space-y-4">
            <Badge className="text-lg px-6 py-2 neon-glow animate-pulse">📊 Аналитика успешности</Badge>
            <h2 className="text-4xl md:text-5xl font-bold neon-text">Результаты нашей работы</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Данные по успешности найма за последние 12 месяцев
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto mb-12">
            <Card className="glass-dark p-8 space-y-6 hover:neon-glow transition-all animate-fade-in">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">Скорость найма по отраслям</h3>
                <Icon name="BarChart3" size={24} className="text-primary animate-pulse" />
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>IT / Tech</span>
                    <span className="font-bold text-primary">18 часов</span>
                  </div>
                  <Progress value={95} className="h-3" style={{ '--progress-background': 'linear-gradient(to right, #8B5CF6, #A855F7)' } as React.CSSProperties} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Продажи / B2B</span>
                    <span className="font-bold text-secondary">22 часа</span>
                  </div>
                  <Progress value={85} className="h-3" style={{ '--progress-background': 'linear-gradient(to right, #0EA5E9, #38BDF8)' } as React.CSSProperties} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Маркетинг</span>
                    <span className="font-bold text-accent">20 часов</span>
                  </div>
                  <Progress value={90} className="h-3" style={{ '--progress-background': 'linear-gradient(to right, #D946EF, #E879F9)' } as React.CSSProperties} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Финансы</span>
                    <span className="font-bold text-green-400">24 часа</span>
                  </div>
                  <Progress value={80} className="h-3" style={{ '--progress-background': 'linear-gradient(to right, #10B981, #34D399)' } as React.CSSProperties} />
                </div>
              </div>
            </Card>

            <Card className="glass-dark p-8 space-y-6 hover:neon-glow transition-all animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">Прохождение испытательного срока</h3>
                <Icon name="PieChart" size={24} className="text-secondary animate-pulse" />
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center space-y-2">
                  <div className="text-6xl font-bold neon-text">94%</div>
                  <p className="text-sm text-muted-foreground">Успешно прошли</p>
                  <Icon name="CheckCircle2" size={32} className="text-primary mx-auto animate-pulse" />
                </div>
                <div className="text-center space-y-2">
                  <div className="text-6xl font-bold text-muted-foreground">6%</div>
                  <p className="text-sm text-muted-foreground">Не прошли</p>
                  <Icon name="XCircle" size={32} className="text-muted-foreground mx-auto" />
                </div>
              </div>

              <div className="glass p-4 rounded-lg space-y-3 mt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">С заменой по гарантии:</span>
                  <span className="font-bold text-accent">4%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Без замены:</span>
                  <span className="font-bold text-muted-foreground">2%</span>
                </div>
              </div>
            </Card>
          </div>


        </div>
      </section>

      <section id="cases" className="py-12 md:py-20 px-4 md:px-6 bg-muted/5">
        <div className="container mx-auto">
          <div className="text-center mb-16 space-y-4">
            <Badge className="text-lg px-6 py-2 neon-glow animate-pulse">💼 Отзывы от компаний</Badge>
            <h2 className="text-4xl md:text-5xl font-bold neon-text">Что говорят клиенты</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Более 120 компаний уже нашли своих сотрудников через нас
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {[
              { 
                company: 'TechFlow Solutions',
                person: 'Дмитрий Козлов',
                role: 'Tech Lead',
                text: 'AI-анализ выявил кандидата, который работал с похожей архитектурой в банковской сфере. Это был неочевидный выбор, но именно то, что нам было нужно.',
                img: 'https://i.pravatar.cc/300?img=12',
                stats: { speed: '16ч', quality: '96%', period: '8 мес' },
                rating: 5
              },
              { 
                company: 'MegaSell Pro',
                person: 'Анна Смирнова',
                role: 'COO',
                text: 'Критически важно было найти человека быстро. 1 DAY HR справились за сутки, и это был именно тот специалист, который нам был нужен. Рост продаж +40% за первый квартал.',
                img: 'https://i.pravatar.cc/300?img=23',
                stats: { speed: '20ч', quality: '94%', period: '6 мес' },
                rating: 5
              },
              { 
                company: 'FinServe AI',
                person: 'Елена Соколова',
                role: 'Head of AI Department',
                text: 'Искали полгода классическими методами. 1 DAY HR нашли идеального кандидата за сутки. Система AI-анализа показала совместимость с нашей командой 94%.',
                img: 'https://i.pravatar.cc/300?img=20',
                stats: { speed: '24ч', quality: '98%', period: '10 мес' },
                rating: 5
              },
              { 
                company: 'MobileHub',
                person: 'Максим Петров',
                role: 'Product Manager',
                text: 'Боялись, что проект встанет. Но за сутки нашли специалиста, который не только закрыл задачу, но и провёл рефакторинг всего приложения.',
                img: 'https://i.pravatar.cc/300?img=13',
                stats: { speed: '18ч', quality: '95%', period: '7 мес' },
                rating: 5
              },
              { 
                company: 'TelecomPro',
                person: 'Алексей Морозов',
                role: 'Sales Director',
                text: 'ИИ-анализ показал скрытые навыки кандидата в телекоме, которые мы бы упустили. За первый месяц вернул трёх крупных клиентов. Результат превзошёл все ожидания!',
                img: 'https://i.pravatar.cc/300?img=33',
                stats: { speed: '22ч', quality: '93%', period: '5 мес' },
                rating: 5
              },
              { 
                company: 'ConnectPlus',
                person: 'Ирина Федорова',
                role: 'Head of Sales',
                text: 'Кандидат знал наших конкурентов изнутри благодаря глубокому анализу AI-системы. За квартал увеличил выручку на 150% и выстроил новые процессы продаж.',
                img: 'https://i.pravatar.cc/300?img=47',
                stats: { speed: '19ч', quality: '97%', period: '9 мес' },
                rating: 5
              },
              { 
                company: 'DataSphere Analytics',
                person: 'Сергей Волков',
                role: 'CTO',
                text: 'Нужен был data scientist с опытом в финтех. AI подобрал кандидата, который раньше работал в смежной сфере. За полгода создал 5 ML-моделей.',
                img: 'https://i.pravatar.cc/300?img=14',
                stats: { speed: '21ч', quality: '99%', period: '6 мес' },
                rating: 5
              },
              { 
                company: 'CloudNine Technologies',
                person: 'Мария Новикова',
                role: 'HR Director',
                text: 'Искали DevOps-инженера с опытом в Kubernetes. За 15 часов получили 3 сильных кандидата, выбрали лучшего. Он автоматизировал CI/CD pipeline.',
                img: 'https://i.pravatar.cc/300?img=25',
                stats: { speed: '15ч', quality: '96%', period: '4 мес' },
                rating: 5
              },
              { 
                company: 'RetailMax Group',
                person: 'Виктор Соловьёв',
                role: 'CEO',
                text: 'Нужен был COO для масштабирования бизнеса. AI-анализ выявил кандидата с успешным опытом выхода на маркетплейсы. За 3 месяца увеличил оборот на 60%.',
                img: 'https://i.pravatar.cc/300?img=32',
                stats: { speed: '23ч', quality: '95%', period: '3 мес' },
                rating: 5
              },
              { 
                company: 'EduTech Innovations',
                person: 'Ольга Романова',
                role: 'Founder',
                text: 'Искали senior front-end разработчика для EdTech платформы. За сутки нашли специалиста, который переписал интерфейс с нуля. Конверсия выросла на 80%.',
                img: 'https://i.pravatar.cc/300?img=28',
                stats: { speed: '24ч', quality: '98%', period: '5 мес' },
                rating: 5
              },
              { 
                company: 'GreenEnergy Solutions',
                person: 'Андрей Белов',
                role: 'Managing Partner',
                text: 'Критически нужен был project manager для запуска нового проекта в энергетике. 1 DAY HR нашли профессионала за 17 часов. Проект запустился в срок.',
                img: 'https://i.pravatar.cc/300?img=35',
                stats: { speed: '17ч', quality: '94%', period: '8 мес' },
                rating: 5
              },
              { 
                company: 'HealthCare Digital',
                person: 'Татьяна Кузнецова',
                role: 'Medical Director',
                text: 'Искали специалиста на стык медицины и IT для цифровизации клиники. AI нашёл уникального кандидата с опытом в обеих областях.',
                img: 'https://i.pravatar.cc/300?img=41',
                stats: { speed: '20ч', quality: '97%', period: '4 мес' },
                rating: 5
              }
            ].map((testimonial, idx) => (
              <Card key={idx} className="glass-dark overflow-hidden hover:neon-glow transition-all hover-scale animate-fade-in" style={{ animationDelay: `${idx * 0.05}s` }}>
                <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
                  <img src={testimonial.img} alt={testimonial.person} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-bold text-lg text-white drop-shadow-lg">{testimonial.company}</h3>
                    <p className="text-sm text-white/90 drop-shadow-md">{testimonial.person} • {testimonial.role}</p>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Icon key={i} name="Star" size={16} className="text-accent fill-accent" />
                    ))}
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    "{testimonial.text}"
                  </p>

                  <div className="glass p-4 rounded-lg space-y-3 mt-4 border border-primary/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Благодарственное письмо</p>
                        <p className="text-sm font-bold">{testimonial.company}</p>
                      </div>
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full border-4 border-primary/30 flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                          <Icon name="BadgeCheck" size={32} className="text-primary" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                          <Icon name="Award" size={14} className="text-white" />
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground/80 leading-relaxed">
                      Выражаем благодарность агентству 1 DAY HR за профессиональный подбор персонала и высокое качество оказанных услуг.
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-border/30">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8 border-2 border-primary/50">
                          <AvatarImage src={testimonial.img} alt={testimonial.name} />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-xs">
                            {testimonial.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-xs font-bold">{testimonial.person}</div>
                          <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                        </div>
                      </div>
                      <Icon name="FileCheck" size={20} className="text-primary/50" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/50">
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">{testimonial.stats.speed}</div>
                      <div className="text-xs text-muted-foreground">найден</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-secondary">{testimonial.stats.quality}</div>
                      <div className="text-xs text-muted-foreground">качество</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-accent">{testimonial.stats.period}</div>
                      <div className="text-xs text-muted-foreground">работает</div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="team" className="py-12 md:py-20 px-4 md:px-6 bg-muted/5">
        <div className="container mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold neon-text">Наша команда</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Профессиональные HR-специалисты с многолетним опытом
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {teamMembers.map((member, idx) => (
              <Card key={idx} className="glass-dark p-6 space-y-4 hover:neon-glow transition-all hover-scale animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                <Avatar className="w-24 h-24 mx-auto border-4 border-primary/50 neon-glow">
                  <AvatarImage src={member.img} alt={member.name} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-2xl">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center space-y-2">
                  <h3 className="font-bold text-lg">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                  <Badge className="bg-primary/20 text-primary">{member.spec}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border/50">
                  <div className="text-center">
                    <div className="text-xl font-bold text-primary">{member.exp}</div>
                    <div className="text-xs text-muted-foreground">опыта</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-secondary">{member.hires}</div>
                    <div className="text-xs text-muted-foreground">найма</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>



      <section id="faq" className="py-12 md:py-20 px-4 md:px-6 bg-muted/5">
        <div className="container mx-auto">
          <div className="text-center mb-16 space-y-4">
            <Badge className="text-lg px-6 py-2 neon-glow animate-pulse">❓ Частые вопросы</Badge>
            <h2 className="text-4xl md:text-5xl font-bold neon-text">Ответы на ваши вопросы</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Всё, что нужно знать о работе с 1 DAY HR
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="glass-dark p-8 hover:neon-glow transition-all animate-fade-in">
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-1" className="border-border/30">
                  <AccordionTrigger className="text-left text-lg font-bold hover:text-primary hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Icon name="Clock" size={20} className="text-primary" />
                      Действительно ли вы находите за 24 часа?
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pl-8">
                    Да! В 94% случаев мы находим подходящего кандидата за 24 часа. Это возможно благодаря AI-системе, которая анализирует тысячи резюме в режиме реального времени и оценивает кандидатов по 50+ параметрам. Если мы не найдём кандидата за обещанный срок — вернём деньги полностью.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border-border/30">
                  <AccordionTrigger className="text-left text-lg font-bold hover:text-primary hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Icon name="Brain" size={20} className="text-secondary" />
                      Как работает AI-анализ кандидатов?
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pl-8">
                    Наш AI анализирует видео-интервью кандидата, оценивая речь, эмоции, невербальные сигналы и профессиональные компетенции. Система проверяет 15+ soft skills (коммуникация, стрессоустойчивость, мотивация) и сравнивает с профилем вашей вакансии. Точность прогноза успешности найма — 98%.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border-border/30">
                  <AccordionTrigger className="text-left text-lg font-bold hover:text-primary hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Icon name="Shield" size={20} className="text-accent" />
                      Что включает гарантия замены?
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pl-8">
                    Если сотрудник не прошёл испытательный срок по любой причине (не справился с задачами, не подошёл по культуре компании, уволился сам), мы бесплатно найдём замену в течение 48 часов. Гарантия действует весь испытательный срок (до 3 месяцев). Это входит в стоимость подбора.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="border-border/30">
                  <AccordionTrigger className="text-left text-lg font-bold hover:text-primary hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Icon name="Wallet" size={20} className="text-primary" />
                      Когда нужно оплачивать услугу?
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pl-8">
                    Мы работаем по предоплате 50% для старта подбора. Оставшиеся 50% вы оплачиваете после одобрения кандидата и перед выходом на работу. Если мы не найдём кандидата за обещанный срок или вам не понравится ни один из предложенных специалистов — вернём предоплату полностью.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5" className="border-border/30">
                  <AccordionTrigger className="text-left text-lg font-bold hover:text-primary hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Icon name="Users" size={20} className="text-secondary" />
                      Сколько кандидатов вы представите?
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pl-8">
                    Мы не работаем по принципу "закидать резюме". AI-система отбирает топ-3 лучших кандидата по совместимости с вашей вакансией. Каждый кандидат проходит видео-интервью, проверку рекомендаций и тестовое задание. Вы получаете только релевантных специалистов с прогнозом успешности 85%+.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6" className="border-border/30">
                  <AccordionTrigger className="text-left text-lg font-bold hover:text-primary hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Icon name="MapPin" size={20} className="text-accent" />
                      В каких городах вы работаете?
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pl-8">
                    Мы работаем по всей России и СНГ. Основной фокус — Москва, Санкт-Петербург, Екатеринбург, Новосибирск, Казань. Также подбираем специалистов для удалённой работы из любой точки мира. AI-система не ограничена географией и находит лучших кандидатов независимо от локации.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7" className="border-border/30">
                  <AccordionTrigger className="text-left text-lg font-bold hover:text-primary hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Icon name="Target" size={20} className="text-primary" />
                      Какие вакансии вы закрываете?
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pl-8">
                    Специализируемся на подборе менеджеров по продажам всех уровней (от Junior до Head of Sales), IT-специалистов, маркетологов и руководителей. Закрываем вакансии в B2B, B2C, SaaS, e-commerce, телекоме, финтехе. Не работаем с массовым подбором (операторы, курьеры, грузчики).
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8" className="border-border/30">
                  <AccordionTrigger className="text-left text-lg font-bold hover:text-primary hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Icon name="Star" size={20} className="text-secondary" />
                      Чем вы отличаетесь от обычных HR-агентств?
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pl-8">
                    Обычные агентства тратят 4-8 недель на подбор, отправляют десятки нерелевантных резюме и берут комиссию 20-30% годового дохода. Мы находим за 24 часа благодаря AI, представляем только 3 лучших кандидата, работаем за фиксированную цену (35-110к) и даём гарантию замены. Экономите время, деньги и нервы.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>

            <Card className="glass-dark p-6 mt-8 border-primary/30 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-glow flex-shrink-0">
                  <Icon name="MessageCircle" size={24} className="text-white" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="font-bold text-lg mb-1">Не нашли ответ на свой вопрос?</h3>
                  <p className="text-sm text-muted-foreground">
                    Свяжитесь с нами, и мы ответим в течение 15 минут
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button variant="outline" className="hover:neon-glow hover:scale-105 transition-all">
                    <Icon name="Phone" size={16} className="mr-2" />
                    Позвонить
                  </Button>
                  <Button onClick={() => scrollToSection('cta')} className="neon-glow bg-gradient-to-r from-primary to-secondary hover:opacity-90 hover:scale-105 transition-all">
                    <Icon name="Send" size={16} className="mr-2" />
                    Написать
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section id="cta" className="py-12 md:py-20 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="glass-dark rounded-3xl p-8 md:p-12 neon-glow max-w-2xl mx-auto animate-scale-in">
            <div className="text-center space-y-6">
              <h2 className="text-3xl md:text-5xl font-bold neon-text">
                Получите идеального кандидата завтра!
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground">
                Оставьте заявку сейчас — получите результат через 24 часа
              </p>

              <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto pt-6">
                <Input 
                  placeholder="Ваше имя *"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="glass border-primary/30 h-14 text-lg focus:neon-glow transition-all"
                />

                <Input 
                  placeholder="Номер телефона *"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                  className="glass border-primary/30 h-14 text-lg focus:neon-glow transition-all"
                />

                <Button type="submit" size="lg" className="w-full neon-glow bg-gradient-to-r from-primary to-secondary hover:opacity-90 hover:scale-105 transition-all text-xl py-8" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Icon name="Loader2" className="animate-spin mr-2" size={20} />
                      Отправка...
                    </>
                  ) : (
                    <>🔥 Найти сотрудника</>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 md:py-12 px-4 md:px-6 pb-32 md:pb-12 border-t border-border/50 bg-muted/5 relative z-10">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 hover-scale cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-glow">
                  <Icon name="Sparkles" size={20} className="text-white" />
                </div>
                <span className="text-xl font-bold neon-text">1 DAY HR</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Инновационное агентство по подбору менеджеров по продажам с использованием искусственного интеллекта
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold">Контакты</h4>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2 hover:text-primary transition-all cursor-pointer hover-scale">
                  <Icon name="Phone" size={16} className="text-primary" />
                  <a href="tel:+79955556231">+7 (995) 555-62-31</a>
                </p>
                <p className="flex items-center gap-2 hover:text-secondary transition-all cursor-pointer hover-scale">
                  <Icon name="MessageCircle" size={16} className="text-secondary" />
                  <a href="https://t.me/your_telegram">Telegram</a>
                </p>
                <p className="flex items-center gap-2 hover:text-accent transition-all cursor-pointer hover-scale">
                  <Icon name="Mail" size={16} className="text-accent" />
                  <a href="mailto:info@1dayhr.ru">info@1dayhr.ru</a>
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold">Навигация</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <button onClick={() => scrollToSection('demo')} className="text-left hover:text-primary transition-all hover:scale-110">AI Демо</button>
                <Link to="/calculator" className="text-left hover:text-primary transition-all hover:scale-110">Калькулятор</Link>
                <button onClick={() => scrollToSection('cases')} className="text-left hover:text-primary transition-all hover:scale-110">Кейсы</button>
                <button onClick={() => scrollToSection('faq')} className="text-left hover:text-primary transition-all hover:scale-110">FAQ</button>
                <Link to="/crm" className="text-left hover:text-primary transition-all hover:scale-110 flex items-center gap-1">
                  <Icon name="LayoutDashboard" size={14} />
                  CRM
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-12 pt-8 border-t border-border/50">
            <div className="text-sm text-muted-foreground">
              © 2024 1 DAY HR. Все права защищены.
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-all hover:scale-110">Политика конфиденциальности</a>
              <a href="#" className="hover:text-primary transition-all hover:scale-110">Обработка персональных данных</a>
            </div>
          </div>
        </div>
      </footer>

      {!isChatOpen && (
        <div className="fixed bottom-4 md:bottom-6 right-3 md:right-6 z-50 flex flex-col gap-2 md:gap-3 items-end animate-fade-in">
          <Button
            onClick={() => setIsConsultFormOpen(true)}
            size="sm"
            className="neon-glow bg-gradient-to-r from-accent to-primary hover:opacity-90 hover:scale-110 transition-all shadow-2xl text-xs md:text-sm px-3 md:px-4 py-2 md:py-3 md:h-auto"
          >
            <Icon name="Calendar" size={16} className="md:w-5 md:h-5 mr-1.5 md:mr-2" />
            <span className="hidden sm:inline">Бесплатная консультация</span>
            <span className="sm:hidden">Консультация</span>
          </Button>
          
          <button
            onClick={() => setIsChatOpen(true)}
            className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-glow hover:scale-110 transition-all shadow-2xl relative"
          >
            <Icon name="MessageCircle" size={24} className="md:w-7 md:h-7 text-white" />
            <span className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-accent rounded-full animate-pulse" />
          </button>
        </div>
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

      {isConsultFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 md:p-4 animate-fade-in" onClick={() => setIsConsultFormOpen(false)}>
          <Card className="glass-dark p-5 md:p-8 max-w-lg w-full neon-glow animate-scale-in max-h-[95vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center neon-glow">
                  <Icon name="Calendar" size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold neon-text">Бесплатная консультация</h2>
                  <p className="text-sm text-muted-foreground">Перезвоним в течение 30 минут</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsConsultFormOpen(false)}
                className="hover:bg-destructive/20 hover:text-destructive"
              >
                <Icon name="X" size={20} />
              </Button>
            </div>

            <form onSubmit={handleConsultSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Icon name="User" size={16} className="text-primary" />
                  Ваше имя *
                </label>
                <Input
                  placeholder="Иван Иванов"
                  value={consultForm.name}
                  onChange={(e) => setConsultForm({...consultForm, name: e.target.value})}
                  required
                  className="glass border-primary/30 h-12 focus:neon-glow transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Icon name="Phone" size={16} className="text-secondary" />
                  Телефон *
                </label>
                <Input
                  type="tel"
                  placeholder="+7 (999) 123-45-67"
                  value={consultForm.phone}
                  onChange={(e) => setConsultForm({...consultForm, phone: e.target.value})}
                  required
                  className="glass border-primary/30 h-12 focus:neon-glow transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Icon name="Building2" size={16} className="text-accent" />
                  Компания
                </label>
                <Input
                  placeholder="ООО 'Ваша компания'"
                  value={consultForm.company}
                  onChange={(e) => setConsultForm({...consultForm, company: e.target.value})}
                  className="glass border-primary/30 h-12 focus:neon-glow transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Icon name="Briefcase" size={16} className="text-primary" />
                  Вакансия
                </label>
                <Input
                  placeholder="Менеджер по продажам"
                  value={consultForm.vacancy}
                  onChange={(e) => setConsultForm({...consultForm, vacancy: e.target.value})}
                  className="glass border-primary/30 h-12 focus:neon-glow transition-all"
                />
              </div>

              <Card className="glass p-4 border-accent/30 space-y-2">
                <div className="flex items-center gap-2">
                  <Icon name="Gift" size={20} className="text-accent" />
                  <h4 className="font-bold text-accent">Что вы получите:</h4>
                </div>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Icon name="CheckCircle2" size={14} className="text-primary flex-shrink-0" />
                    Разбор вашей вакансии и требований
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="CheckCircle2" size={14} className="text-primary flex-shrink-0" />
                    Расчёт точной стоимости подбора
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="CheckCircle2" size={14} className="text-primary flex-shrink-0" />
                    Прогноз сроков и план поиска
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="CheckCircle2" size={14} className="text-primary flex-shrink-0" />
                    Ответы на все ваши вопросы
                  </li>
                </ul>
              </Card>

              <Button
                type="submit"
                size="lg"
                className="w-full neon-glow bg-gradient-to-r from-accent to-primary hover:opacity-90 hover:scale-105 transition-all text-lg py-6"
                disabled={isConsultSubmitting}
              >
                {isConsultSubmitting ? (
                  <>
                    <Icon name="Loader2" className="animate-spin mr-2" size={20} />
                    Отправка...
                  </>
                ) : (
                  <>
                    <Icon name="Rocket" size={20} className="mr-2" />
                    Заказать консультацию
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
              </p>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Index;