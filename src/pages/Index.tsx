import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import ConsultationModal from '@/components/landing/ConsultationModal';
import { TestimonialsCarousel, TeamCarousel } from '@/components/landing/Carousels';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [isConsultFormOpen, setIsConsultFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReport, setShowReport] = useState(false);

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
          setShowReport(true);
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

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const startDemo = () => {
    setIsAnalyzing(true);
    setAnalysisStep(0);
    setSkillScores({ communication: 0, motivation: 0, stress: 0, leadership: 0 });
    setShowReport(false);
  };

  const teamMembers = [
    { name: 'Дарья Коломанова', role: 'Ведущий HR-специалист', spec: 'IT-рекрутмент', exp: '8 лет', hires: '250+', img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=faces' },
    { name: 'Ангелина Малиновская', role: 'Senior HR-менеджер', spec: 'Продажи и маркетинг', exp: '6 лет', hires: '180+', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=faces' },
    { name: 'Дарья Морозова', role: 'Team Lead HR', spec: 'Стратегический найм', exp: '10 лет', hires: '320+', img: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop&crop=faces' },
    { name: 'Марианна Ковалёва', role: 'HR-специалист', spec: 'Маркетплейсы', exp: '5 лет', hires: '150+', img: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&fit=crop&crop=faces' },
    { name: 'Алексей Соколов', role: 'HR-аналитик', spec: 'Финтех', exp: '7 лет', hires: '220+', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=faces' },
    { name: 'Екатерина Волкова', role: 'Recruitment Lead', spec: 'Стартапы', exp: '12 лет', hires: '400+', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=faces' },
    { name: 'Михаил Петров', role: 'Junior HR', spec: 'Ритейл', exp: '3 года', hires: '80+', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces' },
    { name: 'Светлана Новикова', role: 'Senior Recruiter', spec: 'EdTech и Healthcare', exp: '9 лет', hires: '290+', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=faces' }
  ];

  const testimonials = [
    { 
      company: 'TechFlow Solutions',
      person: 'Дмитрий Козлов',
      role: 'Tech Lead',
      text: 'AI-анализ выявил кандидата, который работал с похожей архитектурой в банковской сфере. Это был неочевидный выбор, но именно то, что нам было нужно.',
      img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=faces',
      stats: { speed: '16ч', quality: '96%', period: '8 мес' },
      rating: 5,
      letterText: 'Выражаем благодарность HR-агентству 1 DAY HR за оперативный и качественный подбор IT-специалиста. Кандидат полностью соответствует нашим требованиям и успешно справляется с задачами.'
    },
    { 
      company: 'MegaSell Pro',
      person: 'Анна Смирнова',
      role: 'COO',
      text: 'Критически важно было найти человека быстро. 1 DAY HR справились за сутки, и это был именно тот специалист, который нам был нужен. Рост продаж +40% за первый квартал.',
      img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=faces',
      stats: { speed: '20ч', quality: '94%', period: '6 мес' },
      rating: 5,
      letterText: 'Благодарим команду 1 DAY HR за профессионализм и индивидуальный подход. Найденный специалист значительно повысил эффективность нашего отдела продаж.'
    },
    { 
      company: 'FinServe AI',
      person: 'Елена Соколова',
      role: 'Head of AI Department',
      text: 'Искали полгода классическими методами. 1 DAY HR нашли идеального кандидата за сутки. Система AI-анализа показала совместимость с нашей командой 94%.',
      img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=faces',
      stats: { speed: '24ч', quality: '98%', period: '10 мес' },
      rating: 5,
      letterText: 'Отмечаем высокий уровень сервиса агентства 1 DAY HR. Использование AI-технологий позволило найти уникального специалиста, который органично влился в нашу команду.'
    },
    { 
      company: 'MobileHub',
      person: 'Максим Петров',
      role: 'Product Manager',
      text: 'Боялись, что проект встанет. Но за сутки нашли специалиста, который не только закрыл задачу, но и провёл рефакторинг всего приложения.',
      img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=faces',
      stats: { speed: '18ч', quality: '95%', period: '7 мес' },
      rating: 5,
      letterText: 'Признательны агентству 1 DAY HR за срочный подбор разработчика. Кандидат превзошел ожидания, продемонстрировав глубокую экспертизу и инициативность.'
    },
    { 
      company: 'TelecomPro',
      person: 'Алексей Морозов',
      role: 'Sales Director',
      text: 'ИИ-анализ показал скрытые навыки кандидата в телекоме, которые мы бы упустили. За первый месяц вернул трёх крупных клиентов. Результат превзошёл все ожидания!',
      img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=faces',
      stats: { speed: '22ч', quality: '93%', period: '5 мес' },
      rating: 5,
      letterText: 'Выражаем признательность 1 DAY HR за тщательный отбор кандидатов. Подобранный менеджер по продажам показал выдающиеся результаты с первых дней работы.'
    },
    { 
      company: 'ConnectPlus',
      person: 'Ирина Федорова',
      role: 'Head of Sales',
      text: 'Кандидат знал наших конкурентов изнутри благодаря глубокому анализу AI-системы. За квартал увеличил выручку на 150% и выстроил новые процессы продаж.',
      img: 'https://images.unsplash.com/photo-1491349174775-aaafddd81942?w=400&h=400&fit=crop&crop=faces',
      stats: { speed: '19ч', quality: '97%', period: '9 мес' },
      rating: 5,
      letterText: 'Благодарим 1 DAY HR за системный подход к подбору персонала. Специалист не просто закрыл вакансию, а стал стратегическим игроком нашей команды.'
    }
  ];

  return (
    <div className="min-h-screen relative">
      <div className="fixed top-20 left-10 w-64 h-64 bg-primary/20 rounded-full blur-orb animate-pulse" style={{ animationDuration: '4s' }}></div>
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-secondary/15 rounded-full blur-orb animate-pulse" style={{ animationDuration: '6s' }}></div>
      <div className="fixed top-1/2 left-1/2 w-80 h-80 bg-secondary/10 rounded-full blur-orb animate-pulse" style={{ animationDuration: '5s' }}></div>

      <header className="fixed top-0 left-0 right-0 z-50 glass animate-fade-in">
        <div className="container mx-auto px-3 md:px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 md:gap-2 hover-scale cursor-pointer">
              <div className="relative">
                <div className="text-2xl md:text-3xl font-black tracking-tight">
                  <span className="text-5xl md:text-6xl font-black bg-gradient-to-br from-primary via-secondary to-secondary bg-clip-text text-transparent neon-text" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '-0.05em' }}>1D</span>
                  <span className="text-lg md:text-xl font-light text-muted-foreground mx-1">AY</span>
                  <span className="text-2xl md:text-3xl font-black bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent neon-text">HR</span>
                </div>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <DropdownMenu>
                <DropdownMenuTrigger className="text-sm hover:text-primary transition-all hover:scale-110 flex items-center gap-1">
                  Специализации <Icon name="chevron-down" className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="glass border-primary/20">
                  <DropdownMenuItem asChild>
                    <Link to="/sales-managers" className="flex items-center gap-2">
                      <Icon name="trending-up" className="w-4 h-4" />
                      Менеджеры по продажам
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/it-specialists" className="flex items-center gap-2">
                      <Icon name="code" className="w-4 h-4" />
                      IT-специалисты
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/marketplace-managers" className="flex items-center gap-2">
                      <Icon name="shopping-cart" className="w-4 h-4" />
                      Менеджеры по маркетплейсам
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/accountants" className="flex items-center gap-2">
                      <Icon name="calculator" className="w-4 h-4" />
                      Бухгалтеры
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/marketers" className="flex items-center gap-2">
                      <Icon name="megaphone" className="w-4 h-4" />
                      Маркетологи
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/directors" className="flex items-center gap-2">
                      <Icon name="crown" className="w-4 h-4" />
                      Директора и топ-менеджеры
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/retail-sales" className="flex items-center gap-2">
                      <Icon name="shopping-bag" className="w-4 h-4" />
                      Продавцы-консультанты
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <button onClick={() => scrollToSection('demo')} className="text-sm hover:text-primary transition-all hover:scale-110">AI Демо</button>
              <Link to="/calculator" className="text-sm hover:text-primary transition-all hover:scale-110">Калькулятор</Link>
              <button onClick={() => scrollToSection('cases')} className="text-sm hover:text-primary transition-all hover:scale-110">Кейсы</button>
              <button onClick={() => scrollToSection('team')} className="text-sm hover:text-primary transition-all hover:scale-110">Команда</button>
            </nav>

            <Button onClick={() => scrollToSection('cta')} size="sm" className="neon-glow bg-gradient-to-r from-primary to-secondary hover:opacity-90 hover:scale-105 transition-all text-xs md:text-sm px-3 md:px-4">
              <span className="hidden sm:inline">Подобрать сотрудника</span>
              <span className="sm:hidden">Подобрать</span>
            </Button>
          </div>
        </div>
      </header>

      <section className="pt-24 md:pt-32 pb-12 md:pb-20 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-8 p-4 md:p-8">
            {[
              { img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=faces', status: 'analyzing', name: 'Кандидат #1247' },
              { img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=faces', status: 'approved', name: 'Кандидат #1248' },
              { img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=faces', status: 'interview', name: 'Кандидат #1249' },
              { img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop&crop=faces', status: 'analyzing', name: 'Кандидат #1250' },
              { img: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=400&fit=crop&crop=faces', status: 'approved', name: 'Кандидат #1251' },
              { img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=faces', status: 'interview', name: 'Кандидат #1252' },
              { img: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=400&fit=crop&crop=faces', status: 'analyzing', name: 'Кандидат #1253' },
              { img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop&crop=faces', status: 'approved', name: 'Кандидат #1254' },
              { img: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=400&h=400&fit=crop&crop=faces', status: 'interview', name: 'Кандидат #1255' },
              { img: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop&crop=faces', status: 'analyzing', name: 'Кандидат #1256' },
              { img: 'https://images.unsplash.com/photo-1560087637-bf797bc7796a?w=400&h=400&fit=crop&crop=faces', status: 'approved', name: 'Кандидат #1257' },
              { img: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&h=400&fit=crop&crop=faces', status: 'interview', name: 'Кандидат #1258' }
            ].map((candidate, idx) => (
              <div key={idx} className="relative animate-fade-in hover-scale" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="relative aspect-square rounded-lg overflow-hidden glass border border-border/30">
                  <img 
                    src={candidate.img} 
                    alt={candidate.name} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&size=400&background=random`;
                    }}
                  />
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
              ✨ Первое HR агентство с AI-подбором
            </Badge>
            
            <h1 className="text-3xl sm:text-4xl md:text-7xl font-bold leading-tight neon-text animate-fade-in" style={{ animationDelay: '0.2s' }}>
              НАЙДЕМ СОТРУДНИКА<br />за 24 часа
            </h1>
            
            <div className="inline-block px-6 py-3 rounded-lg glass border-2 border-secondary animate-fade-in" style={{ animationDelay: '0.4s', boxShadow: '0 0 20px rgba(14, 165, 233, 0.3)' }}>
              <p className="text-lg md:text-2xl font-bold">
                Или вернем деньги. <span className="text-secondary font-extrabold">Гарантия 100%</span>
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 md:gap-6 text-sm md:text-lg animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="flex items-center gap-1.5 md:gap-2 hover-scale cursor-pointer">
                <Icon name="Brain" size={18} className="md:w-5 md:h-5 text-primary animate-pulse" />
                <span className="text-xs md:text-base">ИИ-анализ</span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2 hover-scale cursor-pointer">
                <Icon name="Shield" size={18} className="md:w-5 md:h-5 text-secondary animate-pulse" style={{ animationDelay: '0.5s' }} />
                <span className="text-xs md:text-base">Пожизненная гарантия</span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2 hover-scale cursor-pointer">
                <Icon name="Target" size={18} className="md:w-5 md:h-5 text-secondary animate-pulse" style={{ animationDelay: '1s' }} />
                <span className="text-xs md:text-base">Ролевые проверки</span>
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
                  <Icon name="Star" size={24} className="text-secondary" />
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
                    <p className="text-2xl font-bold text-secondary">24 часа</p>
                    <p className="text-xs text-muted-foreground">на подбор</p>
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
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-secondary flex items-center justify-center neon-glow">
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
                    <span className="font-bold text-secondary">1,258+</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Средняя оценка:</span>
                    <span className="font-bold text-primary">87%</span>
                  </div>
                </div>
              </Card>

              <Card className="glass-dark p-6 hover:neon-glow transition-all animate-fade-in hover-scale" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center neon-glow">
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

          {showReport && (
            <div className="max-w-6xl mx-auto mt-8 md:mt-12 lg:mt-20 px-3 md:px-0 animate-scale-in">
              <Card className="glass-dark p-4 sm:p-6 md:p-8 lg:p-12 border-primary/30 neon-glow relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 animate-pulse" style={{ animationDuration: '3s' }}></div>
                </div>

                <div className="relative">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4 animate-fade-in">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-glow animate-pulse" style={{ animationDuration: '2s' }}>
                        <Icon name="FileText" size={24} className="sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                      </div>
                      <div>
                        <Badge className="text-xs sm:text-sm px-3 sm:px-4 py-1 neon-glow mb-1.5 md:mb-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>📊 Пример отчёта</Badge>
                        <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold neon-text animate-fade-in" style={{ animationDelay: '0.2s' }}>Детальный отчёт кандидата</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.3s' }}>Александр Петров • Менеджер по продажам</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="hover:neon-glow hover:scale-110 transition-all animate-fade-in self-end sm:self-auto" onClick={() => setShowReport(false)} style={{ animationDelay: '0.4s' }}>
                      <Icon name="X" size={18} className="sm:w-5 sm:h-5" />
                    </Button>
                  </div>

                  <div className="space-y-4 md:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                      <Card className="glass p-3 sm:p-4 border-primary/20 hover:neon-glow transition-all hover:scale-105 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                        <div className="text-center">
                          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1 animate-pulse">{Math.round(skillScores.communication)}%</div>
                          <div className="text-xs sm:text-sm text-muted-foreground">Общая оценка</div>
                          <Badge className="mt-1.5 sm:mt-2 text-xs bg-primary/20 text-primary">Высокий уровень</Badge>
                        </div>
                      </Card>
                      <Card className="glass p-3 sm:p-4 border-secondary/20 hover:neon-glow transition-all hover:scale-105 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                        <div className="text-center">
                          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary mb-1 animate-pulse" style={{ animationDelay: '0.2s' }}>92%</div>
                          <div className="text-xs sm:text-sm text-muted-foreground">Прогноз успеха</div>
                          <Badge className="mt-1.5 sm:mt-2 text-xs bg-secondary/20 text-secondary">Рекомендован</Badge>
                        </div>
                      </Card>
                      <Card className="glass p-3 sm:p-4 border-secondary/20 hover:neon-glow transition-all hover:scale-105 animate-fade-in" style={{ animationDelay: '0.7s' }}>
                        <div className="text-center">
                          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary mb-1 animate-pulse" style={{ animationDelay: '0.4s' }}>5 лет</div>
                          <div className="text-xs sm:text-sm text-muted-foreground">Опыт в продажах</div>
                          <Badge className="mt-1.5 sm:mt-2 text-xs bg-secondary/20 text-secondary">Middle</Badge>
                        </div>
                      </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.8s' }}>
                        <h4 className="font-bold text-lg flex items-center gap-2">
                          <Icon name="Brain" size={20} className="text-primary animate-pulse" />
                          Психологический профиль
                        </h4>
                        <div className="space-y-3">
                          <div className="animate-fade-in" style={{ animationDelay: '0.9s' }}>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Экстраверсия</span>
                              <span className="font-bold text-primary">85%</span>
                            </div>
                            <Progress value={85} className="h-2" />
                          </div>
                          <div className="animate-fade-in" style={{ animationDelay: '1s' }}>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Добросовестность</span>
                              <span className="font-bold text-secondary">78%</span>
                            </div>
                            <Progress value={78} className="h-2" />
                          </div>
                          <div className="animate-fade-in" style={{ animationDelay: '1.1s' }}>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Открытость опыту</span>
                              <span className="font-bold text-secondary">82%</span>
                            </div>
                            <Progress value={82} className="h-2" />
                          </div>
                          <div className="animate-fade-in" style={{ animationDelay: '1.2s' }}>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Эмоциональная стабильность</span>
                              <span className="font-bold text-green-400">76%</span>
                            </div>
                            <Progress value={76} className="h-2" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 animate-fade-in" style={{ animationDelay: '1s' }}>
                        <h4 className="font-bold text-lg flex items-center gap-2">
                          <Icon name="Target" size={20} className="text-secondary animate-pulse" />
                          Ключевые компетенции
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between glass p-3 rounded-lg hover:neon-glow transition-all hover:scale-105 animate-fade-in" style={{ animationDelay: '1.1s' }}>
                            <div className="flex items-center gap-2">
                              <Icon name="MessageSquare" size={16} className="text-primary" />
                              <span className="text-sm">Коммуникация</span>
                            </div>
                            <Badge className="bg-primary/20 text-primary">94%</Badge>
                          </div>
                          <div className="flex items-center justify-between glass p-3 rounded-lg hover:neon-glow transition-all hover:scale-105 animate-fade-in" style={{ animationDelay: '1.2s' }}>
                            <div className="flex items-center gap-2">
                              <Icon name="Zap" size={16} className="text-secondary" />
                              <span className="text-sm">Мотивация</span>
                            </div>
                            <Badge className="bg-secondary/20 text-secondary">87%</Badge>
                          </div>
                          <div className="flex items-center justify-between glass p-3 rounded-lg hover:neon-glow transition-all hover:scale-105 animate-fade-in" style={{ animationDelay: '1.3s' }}>
                            <div className="flex items-center gap-2">
                              <Icon name="Shield" size={16} className="text-secondary" />
                              <span className="text-sm">Стрессоустойчивость</span>
                            </div>
                            <Badge className="bg-secondary/20 text-secondary">83%</Badge>
                          </div>
                          <div className="flex items-center justify-between glass p-3 rounded-lg hover:neon-glow transition-all hover:scale-105 animate-fade-in" style={{ animationDelay: '1.4s' }}>
                            <div className="flex items-center gap-2">
                              <Icon name="Users" size={16} className="text-green-400" />
                              <span className="text-sm">Лидерство</span>
                            </div>
                            <Badge className="bg-green-400/20 text-green-400">78%</Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Card className="glass-dark p-6 border-accent/30 hover:neon-glow transition-all animate-fade-in" style={{ animationDelay: '1.5s' }}>
                      <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Icon name="Lightbulb" size={20} className="text-secondary animate-pulse" />
                        Рекомендации AI
                      </h4>
                      <div className="space-y-3 text-sm text-muted-foreground">
                        <div className="flex gap-3 animate-fade-in" style={{ animationDelay: '1.6s' }}>
                          <Icon name="CheckCircle2" size={16} className="text-primary flex-shrink-0 mt-0.5" />
                          <p><strong className="text-foreground">Сильные стороны:</strong> Отличные коммуникативные навыки, высокая мотивация к достижению результатов, опыт работы в B2B сегменте</p>
                        </div>
                        <div className="flex gap-3 animate-fade-in" style={{ animationDelay: '1.7s' }}>
                          <Icon name="AlertCircle" size={16} className="text-secondary flex-shrink-0 mt-0.5" />
                          <p><strong className="text-foreground">Области развития:</strong> Стоит обратить внимание на управление стрессом в высоконагруженных ситуациях</p>
                        </div>
                        <div className="flex gap-3 animate-fade-in" style={{ animationDelay: '1.8s' }}>
                          <Icon name="TrendingUp" size={16} className="text-secondary flex-shrink-0 mt-0.5" />
                          <p><strong className="text-foreground">Прогноз:</strong> Высокая вероятность (92%) успешного прохождения испытательного срока и достижения KPI</p>
                        </div>
                      </div>
                    </Card>

                    <div className="flex justify-center gap-4 pt-4 animate-fade-in" style={{ animationDelay: '1.9s' }}>
                      <Button onClick={() => scrollToSection('cta')} className="neon-glow bg-gradient-to-r from-primary to-secondary hover:opacity-90 hover:scale-110 transition-all">
                        <Icon name="Rocket" size={18} className="mr-2" />
                        Найти такого кандидата
                      </Button>
                      <Button variant="outline" onClick={() => setShowReport(false)} className="hover:neon-glow hover:scale-110 transition-all">
                        Закрыть отчёт
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
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
                <div className="text-3xl md:text-6xl font-bold text-secondary animate-fade-in">24ч</div>
                <p className="text-xs md:text-base text-muted-foreground">Среднее время</p>
                <Icon name="Zap" size={20} className="md:w-6 md:h-6 text-secondary mx-auto animate-pulse" />
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
                    <span className="font-bold text-secondary">20 часов</span>
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
                  <span className="font-bold text-secondary">4%</span>
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

          <TestimonialsCarousel testimonials={testimonials} />
        </div>
      </section>

      <section id="why-us" className="py-12 md:py-20 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-16 space-y-3 md:space-y-4">
            <Badge className="text-base md:text-lg px-4 md:px-6 py-1.5 md:py-2 neon-glow animate-pulse">⭐ Почему мы</Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold neon-text">Почему выбирают нас</h2>
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              Мы объединили искусственный интеллект, 20+ лет опыта в продажах и систему финансовых гарантий
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-7xl mx-auto">
            <Card className="glass-dark p-4 md:p-6 hover:neon-glow transition-all hover-scale animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-glow flex-shrink-0">
                  <Icon name="Brain" size={20} className="md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base md:text-lg mb-1">ИИ-анализ без предвзятости</h3>
                  <Badge className="text-xs bg-primary/20 text-primary">Точность 90%+</Badge>
                </div>
              </div>
              <p className="text-sm md:text-base text-muted-foreground">
                Искусственный интеллект анализирует hard и soft skills объективно, без человеческого фактора
              </p>
            </Card>

            <Card className="glass-dark p-4 md:p-6 hover:neon-glow transition-all hover-scale animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-secondary to-primary flex items-center justify-center neon-glow flex-shrink-0">
                  <Icon name="Video" size={20} className="md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base md:text-lg mb-1">Ролевые проверки</h3>
                  <Badge className="text-xs bg-secondary/20 text-secondary">Видео каждого кандидата</Badge>
                </div>
              </div>
              <p className="text-sm md:text-base text-muted-foreground">
                Каждое интервью включает ролевую игру с записью — проверяем реальные навыки продаж
              </p>
            </Card>

            <Card className="glass-dark p-4 md:p-6 hover:neon-glow transition-all hover-scale animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-glow flex-shrink-0">
                  <Icon name="DollarSign" size={20} className="md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base md:text-lg mb-1">Финансовые гарантии</h3>
                  <Badge className="text-xs bg-primary/20 text-primary">Реальная ответственность</Badge>
                </div>
              </div>
              <p className="text-sm md:text-base text-muted-foreground">
                Просрочка на день = -10% от оплаты. Задержка на 7 дней — вторая часть бесплатно
              </p>
            </Card>

            <Card className="glass-dark p-4 md:p-6 hover:neon-glow transition-all hover-scale animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-secondary to-primary flex items-center justify-center neon-glow flex-shrink-0">
                  <Icon name="RefreshCcw" size={20} className="md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base md:text-lg mb-1">Безлимитная замена</h3>
                  <Badge className="text-xs bg-secondary/20 text-secondary">Даже через 2 года</Badge>
                </div>
              </div>
              <p className="text-sm md:text-base text-muted-foreground">
                На тарифе "Еще вчера" — бессрочная гарантия замены кандидата по любой причине
              </p>
            </Card>

            <Card className="glass-dark p-4 md:p-6 hover:neon-glow transition-all hover-scale animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-glow flex-shrink-0">
                  <Icon name="Target" size={20} className="md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base md:text-lg mb-1">Узкая специализация</h3>
                  <Badge className="text-xs bg-primary/20 text-primary">Только менеджеры</Badge>
                </div>
              </div>
              <p className="text-sm md:text-base text-muted-foreground">
                Более 20 лет опыта в продажах — знаем специфику и понимаем вашу нишу
              </p>
            </Card>

            <Card className="glass-dark p-4 md:p-6 hover:neon-glow transition-all hover-scale animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-secondary to-primary flex items-center justify-center neon-glow flex-shrink-0">
                  <Icon name="Sparkles" size={20} className="md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base md:text-lg mb-1">Дополнительный ИИ-скрининг</h3>
                  <Badge className="text-xs bg-secondary/20 text-secondary">Hard skills тест</Badge>
                </div>
              </div>
              <p className="text-sm md:text-base text-muted-foreground">
                На премиум тарифе — отдельное собеседование с ИИ для проверки скрытых профессиональных качеств
              </p>
            </Card>

            <Card className="glass-dark p-4 md:p-6 hover:neon-glow transition-all hover-scale animate-fade-in sm:col-span-2 lg:col-span-1" style={{ animationDelay: '0.7s' }}>
              <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-glow flex-shrink-0">
                  <Icon name="Eye" size={20} className="md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base md:text-lg mb-1">Прозрачность в реальном времени</h3>
                  <Badge className="text-xs bg-primary/20 text-primary">Полный контроль</Badge>
                </div>
              </div>
              <p className="text-sm md:text-base text-muted-foreground">
                Формируем файл с анализом каждого кандидата — вы видите прогресс онлайн
              </p>
            </Card>

            <Card className="glass-dark p-4 md:p-6 hover:neon-glow transition-all hover-scale animate-fade-in sm:col-span-2 lg:col-span-1" style={{ animationDelay: '0.8s' }}>
              <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-secondary to-primary flex items-center justify-center neon-glow flex-shrink-0">
                  <Icon name="Briefcase" size={20} className="md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base md:text-lg mb-1">Авторская адаптация</h3>
                  <Badge className="text-xs bg-secondary/20 text-secondary">Готов работать с 1 дня</Badge>
                </div>
              </div>
              <p className="text-sm md:text-base text-muted-foreground">
                Помогаем внедрить KPI и систему адаптации для максимальной эффективности нового сотрудника
              </p>
            </Card>
          </div>

          <div className="text-center mt-8 md:mt-12">
            <Button onClick={() => scrollToSection('cta')} size="lg" className="neon-glow bg-gradient-to-r from-primary to-secondary hover:opacity-90 hover:scale-110 transition-all text-base md:text-lg px-8 md:px-12 py-6 md:py-8">
              🚀 Получить кандидата завтра
            </Button>
          </div>
        </div>
      </section>

      <section id="team" className="py-12 md:py-20 px-4 md:px-6 bg-muted/5">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-16 space-y-3 md:space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold neon-text">Наша команда</h2>
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              Профессиональные HR-специалисты с многолетним опытом
            </p>
          </div>

          <TeamCarousel teamMembers={teamMembers} />
        </div>
      </section>

      <section id="specialists" className="py-12 md:py-20 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16 space-y-4">
            <Badge className="text-lg px-6 py-2 neon-glow animate-pulse">🎯 Специализация</Badge>
            <h2 className="text-4xl md:text-5xl font-bold neon-text">Каких специалистов мы нанимаем</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Подбираем специалистов любого профиля за 24 часа с помощью AI-технологий
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            <Card className="glass-dark p-6 space-y-4 hover:neon-glow transition-all animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-glow">
                  <Icon name="Code" size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold">IT-специалисты</h3>
              </div>
              <p className="text-sm text-muted-foreground">Разработчики, DevOps, тестировщики, аналитики данных</p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-primary/20 text-primary text-xs">Frontend</Badge>
                <Badge className="bg-primary/20 text-primary text-xs">Backend</Badge>
                <Badge className="bg-primary/20 text-primary text-xs">Full-Stack</Badge>
                <Badge className="bg-primary/20 text-primary text-xs">DevOps</Badge>
                <Badge className="bg-primary/20 text-primary text-xs">+2</Badge>
              </div>
            </Card>

            <Card className="glass-dark p-6 space-y-4 hover:neon-glow transition-all animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-secondary flex items-center justify-center neon-glow">
                  <Icon name="TrendingUp" size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold">Продажи</h3>
              </div>
              <p className="text-sm text-muted-foreground">B2B, B2C, Key Account, региональные менеджеры</p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-secondary/20 text-secondary text-xs">B2B Sales</Badge>
                <Badge className="bg-secondary/20 text-secondary text-xs">B2C Sales</Badge>
                <Badge className="bg-secondary/20 text-secondary text-xs">Key Account</Badge>
                <Badge className="bg-secondary/20 text-secondary text-xs">Sales Director</Badge>
                <Badge className="bg-secondary/20 text-secondary text-xs">+2</Badge>
              </div>
            </Card>

            <Card className="glass-dark p-6 space-y-4 hover:neon-glow transition-all animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center neon-glow">
                  <Icon name="ShoppingCart" size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold">Маркетплейсы</h3>
              </div>
              <p className="text-sm text-muted-foreground">Wildberries, Ozon, Яндекс.Маркет, Lamoda</p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-secondary/20 text-secondary text-xs">Category Manager</Badge>
                <Badge className="bg-secondary/20 text-secondary text-xs">Content Manager</Badge>
                <Badge className="bg-secondary/20 text-secondary text-xs">Аналитик</Badge>
                <Badge className="bg-secondary/20 text-secondary text-xs">SMM</Badge>
                <Badge className="bg-secondary/20 text-secondary text-xs">+2</Badge>
              </div>
            </Card>

            <Card className="glass-dark p-6 space-y-4 hover:neon-glow transition-all animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-glow">
                  <Icon name="Crown" size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold">Руководители</h3>
              </div>
              <p className="text-sm text-muted-foreground">CEO, COO, директора направлений, топ-менеджеры</p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-primary/20 text-primary text-xs">CEO</Badge>
                <Badge className="bg-primary/20 text-primary text-xs">COO</Badge>
                <Badge className="bg-primary/20 text-primary text-xs">CFO</Badge>
                <Badge className="bg-primary/20 text-primary text-xs">CTO</Badge>
                <Badge className="bg-primary/20 text-primary text-xs">+2</Badge>
              </div>
            </Card>

            <Card className="glass-dark p-6 space-y-4 hover:neon-glow transition-all animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center neon-glow">
                  <Icon name="Megaphone" size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold">Маркетологи</h3>
              </div>
              <p className="text-sm text-muted-foreground">Digital, SMM, контент, performance, бренд-менеджеры</p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-secondary/20 text-secondary text-xs">Digital Marketing</Badge>
                <Badge className="bg-secondary/20 text-secondary text-xs">SMM</Badge>
                <Badge className="bg-secondary/20 text-secondary text-xs">Content</Badge>
                <Badge className="bg-secondary/20 text-secondary text-xs">Performance</Badge>
                <Badge className="bg-secondary/20 text-secondary text-xs">+2</Badge>
              </div>
            </Card>

            <Card className="glass-dark p-6 space-y-4 hover:neon-glow transition-all animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-secondary flex items-center justify-center neon-glow">
                  <Icon name="Headphones" size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold">Поддержка</h3>
              </div>
              <p className="text-sm text-muted-foreground">Customer Success, техподдержка, операторы</p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-secondary/20 text-secondary text-xs">Customer Success</Badge>
                <Badge className="bg-secondary/20 text-secondary text-xs">Support</Badge>
                <Badge className="bg-secondary/20 text-secondary text-xs">Operators</Badge>
                <Badge className="bg-secondary/20 text-secondary text-xs">Service Manager</Badge>
                <Badge className="bg-secondary/20 text-secondary text-xs">+1</Badge>
              </div>
            </Card>

            <Card className="glass-dark p-6 space-y-4 hover:neon-glow transition-all animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-glow">
                  <Icon name="DollarSign" size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold">Финансисты</h3>
              </div>
              <p className="text-sm text-muted-foreground">Бухгалтеры, финансовые аналитики, экономисты</p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-primary/20 text-primary text-xs">Бухгалтер</Badge>
                <Badge className="bg-primary/20 text-primary text-xs">Фин. аналитик</Badge>
                <Badge className="bg-primary/20 text-primary text-xs">Экономист</Badge>
                <Badge className="bg-primary/20 text-primary text-xs">Казначей</Badge>
                <Badge className="bg-primary/20 text-primary text-xs">+1</Badge>
              </div>
            </Card>

            <Card className="glass-dark p-6 space-y-4 hover:neon-glow transition-all animate-fade-in" style={{ animationDelay: '0.7s' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-secondary flex items-center justify-center neon-glow">
                  <Icon name="Cog" size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold">Производство</h3>
              </div>
              <p className="text-sm text-muted-foreground">Инженеры, технологи, производственные специалисты</p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-secondary/20 text-secondary text-xs">Инженер</Badge>
                <Badge className="bg-secondary/20 text-secondary text-xs">Технолог</Badge>
                <Badge className="bg-secondary/20 text-secondary text-xs">Мастер участка</Badge>
                <Badge className="bg-secondary/20 text-secondary text-xs">Наладчик</Badge>
                <Badge className="bg-secondary/20 text-secondary text-xs">+1</Badge>
              </div>
            </Card>
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
                      <Icon name="Shield" size={20} className="text-secondary" />
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
                      <Icon name="MapPin" size={20} className="text-secondary" />
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
          <div className="glass-dark rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-12 neon-glow max-w-2xl mx-auto animate-scale-in">
            <div className="text-center space-y-4 md:space-y-6">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold neon-text">
                Получите идеального кандидата завтра!
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
                Оставьте заявку сейчас — получите результат через 24 часа
              </p>

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 max-w-md mx-auto pt-4 md:pt-6">
                <Input 
                  placeholder="Ваше имя *"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="glass border-primary/30 h-12 sm:h-14 text-base sm:text-lg focus:neon-glow transition-all"
                />

                <Input 
                  placeholder="Номер телефона *"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                  className="glass border-primary/30 h-12 sm:h-14 text-base sm:text-lg focus:neon-glow transition-all"
                />

                <Button type="submit" size="lg" className="w-full neon-glow bg-gradient-to-r from-primary to-secondary hover:opacity-90 hover:scale-105 transition-all text-base sm:text-lg md:text-xl py-6 sm:py-7 md:py-8" disabled={isSubmitting}>
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

      <footer className="py-8 md:py-12 px-4 md:px-6 pb-24 sm:pb-32 md:pb-12 border-t border-border/50 bg-muted/5 relative z-10">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 hover-scale cursor-pointer">
                <div className="relative">
                  <div className="text-2xl md:text-3xl font-black tracking-tight">
                    <span className="text-4xl md:text-5xl font-black bg-gradient-to-br from-primary via-secondary to-secondary bg-clip-text text-transparent neon-text" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '-0.05em' }}>1D</span>
                    <span className="text-base md:text-lg font-light text-muted-foreground mx-1">AY</span>
                    <span className="text-xl md:text-2xl font-black bg-gradient-to-r from-secondary to-secondary bg-clip-text text-transparent neon-text">HR</span>
                  </div>
                </div>
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
                <p className="flex items-center gap-2 hover:text-secondary transition-all cursor-pointer hover-scale">
                  <Icon name="Mail" size={16} className="text-secondary" />
                  <a href="mailto:1dayhunter24@gmail.com">1dayhunter24@gmail.com</a>
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

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6 mt-8 md:mt-12 pt-6 md:pt-8 border-t border-border/50">
            <div className="text-xs sm:text-sm text-muted-foreground text-center md:text-left">
              © 2024 1 DAY HR. Все права защищены.
            </div>

            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-all hover:scale-110">Политика конфиденциальности</a>
              <a href="#" className="hover:text-primary transition-all hover:scale-110">Обработка персональных данных</a>
            </div>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-4 md:bottom-6 right-3 md:right-6 z-50 flex flex-col gap-2 md:gap-3 items-end">
        <Button
          onClick={() => setIsConsultFormOpen(true)}
          size="sm"
          className="neon-glow bg-gradient-to-r from-secondary to-primary hover:opacity-90 hover:scale-110 transition-all shadow-2xl text-xs md:text-sm px-3 md:px-4 py-2 md:py-3 md:h-auto animate-fade-in"
        >
          <Icon name="Calendar" size={16} className="md:w-5 md:h-5 mr-1.5 md:mr-2" />
          <span className="hidden sm:inline">Бесплатная консультация</span>
          <span className="sm:hidden">Консультация</span>
        </Button>
        
        {/* <ChatWidget scrollToSection={scrollToSection} /> */}
      </div>

      <ConsultationModal 
        isOpen={isConsultFormOpen} 
        onClose={() => setIsConsultFormOpen(false)} 
      />
    </div>
  );
};

export default Index;