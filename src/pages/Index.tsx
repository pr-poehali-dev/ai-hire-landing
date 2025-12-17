import { useState, useEffect, lazy, Suspense } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { sendMetrikaGoal, metrikaGoals } from '@/utils/metrika';
const ConsultationModal = lazy(() => import('@/components/landing/ConsultationModal'));
const AIScanModal = lazy(() => import('@/components/landing/AIScanModal'));
const VacancyAnalysisModal = lazy(() => import('@/components/landing/VacancyAnalysisModal'));
import { TestimonialsCarousel, TeamCarousel } from '@/components/landing/Carousels';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
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
  const [isAIScanOpen, setIsAIScanOpen] = useState(false);
  const [isVacancyAnalysisOpen, setIsVacancyAnalysisOpen] = useState(false);
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
    const hasSeenPopup = sessionStorage.getItem('vacancyAnalysisPopupSeen');
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsVacancyAnalysisOpen(true);
        sessionStorage.setItem('vacancyAnalysisPopupSeen', 'true');
      }, 15000);
      return () => clearTimeout(timer);
    }
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

  const handleSubmit = async (e: React.FormEvent, source: string = 'main_cta_form') => {
    e.preventDefault();
    setIsSubmitting(true);

    sendMetrikaGoal(metrikaGoals.FORM_SUBMIT, { source });
    
    try {
      const timestamp = new Date().toLocaleString('ru-RU');
      const leadData = {
        name: formData.name,
        phone: formData.phone,
        source: source,
        form_type: 'quick_contact',
        page: 'main',
        timestamp: timestamp
      };

      const response = await fetch('https://functions.poehali.dev/6389194d-86d0-46d4-bc95-83e9f660f267', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      });
      
      if (!response.ok) throw new Error('Failed to submit');

      console.log('Sending Telegram notification:', leadData);
      fetch('https://functions.poehali.dev/a7d1db0c-db9c-4d2f-b64e-42c388aed5d5', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      })
        .then(res => res.json())
        .then(data => console.log('Telegram response:', data))
        .catch(err => console.error('Telegram notification failed:', err));

      sendMetrikaGoal(metrikaGoals.LEAD_CREATED, { source });
      
      setFormData({ name: '', phone: '' });
      navigate('/thank-you');
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
    sendMetrikaGoal(metrikaGoals.CTA_CLICK, { action: 'start_ai_demo' });
    setIsAnalyzing(true);
    setAnalysisStep(0);
    setSkillScores({ communication: 0, motivation: 0, stress: 0, leadership: 0 });
    setShowReport(false);
  };

  const teamMembers = [
    { name: 'Дарья Коломанова', role: 'Ведущий HR-специалист', spec: 'IT-рекрутмент', exp: '8 лет', hires: '250+', img: 'https://randomuser.me/api/portraits/women/13.jpg' },
    { name: 'Ангелина Малиновская', role: 'Senior HR-менеджер', spec: 'Продажи и маркетинг', exp: '6 лет', hires: '180+', img: 'https://randomuser.me/api/portraits/women/14.jpg' },
    { name: 'Дарья Морозова', role: 'Team Lead HR', spec: 'Стратегический найм', exp: '10 лет', hires: '320+', img: 'https://randomuser.me/api/portraits/women/15.jpg' },
    { name: 'Марианна Ковалёва', role: 'HR-специалист', spec: 'Маркетплейсы', exp: '5 лет', hires: '150+', img: 'https://i.pravatar.cc/400?img=47' },
    { name: 'Алексей Соколов', role: 'HR-аналитик', spec: 'Финтех', exp: '7 лет', hires: '220+', img: 'https://i.pravatar.cc/400?img=12' },
    { name: 'Екатерина Волкова', role: 'Recruitment Lead', spec: 'Стартапы', exp: '12 лет', hires: '400+', img: 'https://i.pravatar.cc/400?img=38' },
    { name: 'Михаил Петров', role: 'Junior HR', spec: 'Ритейл', exp: '3 года', hires: '80+', img: 'https://randomuser.me/api/portraits/men/14.jpg' },
    { name: 'Светлана Новикова', role: 'Senior Recruiter', spec: 'EdTech и Healthcare', exp: '9 лет', hires: '290+', img: 'https://randomuser.me/api/portraits/women/18.jpg' }
  ];

  const testimonials = [
    { 
      company: 'TechFlow Solutions',
      person: 'Дмитрий Козлов',
      role: 'Tech Lead',
      text: 'AI-анализ выявил кандидата, который работал с похожей архитектурой в банковской сфере. Это был неочевидный выбор, но именно то, что нам было нужно.',
      img: 'https://randomuser.me/api/portraits/men/15.jpg',
      stats: { speed: '16ч', quality: '96%', period: '8 мес' },
      rating: 5,
      letterText: 'Выражаем благодарность HR-агентству 1 DAY HR за оперативный и качественный подбор IT-специалиста. Кандидат полностью соответствует нашим требованиям и успешно справляется с задачами.'
    },
    { 
      company: 'MegaSell Pro',
      person: 'Анна Смирнова',
      role: 'COO',
      text: 'Критически важно было найти человека быстро. 1 DAY HR справились за сутки, и это был именно тот специалист, который нам был нужен. Рост продаж +40% за первый квартал.',
      img: 'https://randomuser.me/api/portraits/women/19.jpg',
      stats: { speed: '20ч', quality: '94%', period: '6 мес' },
      rating: 5,
      letterText: 'Благодарим команду 1 DAY HR за профессионализм и индивидуальный подход. Найденный специалист значительно повысил эффективность нашего отдела продаж.'
    },
    { 
      company: 'FinServe AI',
      person: 'Елена Соколова',
      role: 'Head of AI Department',
      text: 'Искали полгода классическими методами. 1 DAY HR нашли идеального кандидата за сутки. Система AI-анализа показала совместимость с нашей командой 94%.',
      img: 'https://randomuser.me/api/portraits/women/20.jpg',
      stats: { speed: '24ч', quality: '98%', period: '10 мес' },
      rating: 5,
      letterText: 'Отмечаем высокий уровень сервиса агентства 1 DAY HR. Использование AI-технологий позволило найти уникального специалиста, который органично влился в нашу команду.'
    },
    { 
      company: 'MobileHub',
      person: 'Максим Петров',
      role: 'Product Manager',
      text: 'Боялись, что проект встанет. Но за сутки нашли специалиста, который не только закрыл задачу, но и провёл рефакторинг всего приложения.',
      img: 'https://randomuser.me/api/portraits/men/16.jpg',
      stats: { speed: '18ч', quality: '95%', period: '7 мес' },
      rating: 5,
      letterText: 'Признательны агентству 1 DAY HR за срочный подбор разработчика. Кандидат превзошел ожидания, продемонстрировав глубокую экспертизу и инициативность.'
    },
    { 
      company: 'TelecomPro',
      person: 'Алексей Морозов',
      role: 'Sales Director',
      text: 'ИИ-анализ показал скрытые навыки кандидата в телекоме, которые мы бы упустили. За первый месяц вернул трёх крупных клиентов. Результат превзошёл все ожидания!',
      img: 'https://randomuser.me/api/portraits/men/17.jpg',
      stats: { speed: '22ч', quality: '93%', period: '5 мес' },
      rating: 5,
      letterText: 'Выражаем признательность 1 DAY HR за тщательный отбор кандидатов. Подобранный менеджер по продажам показал выдающиеся результаты с первых дней работы.'
    },
    { 
      company: 'ConnectPlus',
      person: 'Ирина Федорова',
      role: 'Head of Sales',
      text: 'Кандидат знал наших конкурентов изнутри благодаря глубокому анализу AI-системы. За квартал увеличил выручку на 150% и выстроил новые процессы продаж.',
      img: 'https://randomuser.me/api/portraits/women/21.jpg',
      stats: { speed: '19ч', quality: '97%', period: '9 мес' },
      rating: 5,
      letterText: 'Благодарим 1 DAY HR за системный подход к подбору персонала. Специалист не просто закрыл вакансию, а стал стратегическим игроком нашей команды.'
    }
  ];

  return (
    <div className="min-h-screen relative">
      <div className="hidden md:block fixed top-20 left-10 w-64 h-64 bg-primary/20 rounded-full blur-orb animate-pulse" style={{ animationDuration: '4s' }}></div>
      <div className="hidden md:block fixed bottom-20 right-10 w-96 h-96 bg-secondary/15 rounded-full blur-orb animate-pulse" style={{ animationDuration: '6s' }}></div>
      <div className="hidden md:block fixed top-1/2 left-1/2 w-80 h-80 bg-secondary/10 rounded-full blur-orb animate-pulse" style={{ animationDuration: '5s' }}></div>

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
              <Link 
                to="/diagnostic-session" 
                className="text-sm hover:text-primary transition-all hover:scale-110 flex items-center gap-1"
                onClick={() => sendMetrikaGoal(metrikaGoals.CTA_CLICK, { action: 'header_diagnostic_session' })}
              >
                <Icon name="brain" className="w-4 h-4" />
                Диагностика
              </Link>
              <Link 
                to="/calculator" 
                className="text-sm hover:text-primary transition-all hover:scale-110"
                onClick={() => sendMetrikaGoal(metrikaGoals.CALCULATOR_OPEN, { source: 'header_nav' })}
              >
                Калькулятор
              </Link>
              <button onClick={() => scrollToSection('cases')} className="text-sm hover:text-primary transition-all hover:scale-110">Кейсы</button>
              <button onClick={() => scrollToSection('team')} className="text-sm hover:text-primary transition-all hover:scale-110">Команда</button>
            </nav>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="sm" className="hover:bg-primary/10 relative">
                    Меню
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass border-primary/20 w-56">
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
                  <DropdownMenuItem asChild>
                    <Link to="/diagnostic-session" className="flex items-center gap-2">
                      <Icon name="brain" className="w-4 h-4" />
                      Бесплатная диагностика
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/calculator" className="flex items-center gap-2">
                      <Icon name="calculator" className="w-4 h-4" />
                      Калькулятор стоимости
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button 
                onClick={() => {
                  sendMetrikaGoal(metrikaGoals.CTA_CLICK, { action: 'header_cta_button' });
                  scrollToSection('cta');
                }} 
                size="sm" 
                className="neon-glow bg-gradient-to-r from-primary to-secondary hover:opacity-90 hover:scale-105 transition-all text-xs md:text-sm px-3 md:px-4"
              >
                <span className="hidden sm:inline">Подобрать сотрудника</span>
                <span className="sm:hidden">Подобрать</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <section className="pt-24 md:pt-32 pb-12 md:pb-20 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://cdn.poehali.dev/files/ФОТО HR.jpg" 
            alt="HR Team" 
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-primary/30"></div>
          
          <svg className="hidden md:block absolute inset-0 w-full h-full opacity-[0.15]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="neural-grid" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="0" cy="0" r="2" fill="currentColor" className="text-primary">
                  <animate attributeName="r" values="2;3;2" dur="4s" repeatCount="indefinite" />
                </circle>
                <circle cx="50" cy="0" r="1.5" fill="currentColor" className="text-secondary">
                  <animate attributeName="r" values="1.5;2.5;1.5" dur="5s" repeatCount="indefinite" />
                </circle>
                <circle cx="100" cy="0" r="2" fill="currentColor" className="text-primary">
                  <animate attributeName="r" values="2;3;2" dur="6s" repeatCount="indefinite" />
                </circle>
                <circle cx="0" cy="50" r="1.5" fill="currentColor" className="text-secondary">
                  <animate attributeName="r" values="1.5;2.5;1.5" dur="4.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="50" cy="50" r="2" fill="currentColor" className="text-primary">
                  <animate attributeName="r" values="2;3.5;2" dur="5.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="100" cy="50" r="1.5" fill="currentColor" className="text-secondary">
                  <animate attributeName="r" values="1.5;2.5;1.5" dur="4s" repeatCount="indefinite" />
                </circle>
                <circle cx="0" cy="100" r="2" fill="currentColor" className="text-primary">
                  <animate attributeName="r" values="2;3;2" dur="5s" repeatCount="indefinite" />
                </circle>
                <circle cx="50" cy="100" r="1.5" fill="currentColor" className="text-secondary">
                  <animate attributeName="r" values="1.5;2.5;1.5" dur="6s" repeatCount="indefinite" />
                </circle>
                <circle cx="100" cy="100" r="2" fill="currentColor" className="text-primary">
                  <animate attributeName="r" values="2;3;2" dur="4.5s" repeatCount="indefinite" />
                </circle>
                
                <line x1="0" y1="0" x2="50" y2="0" stroke="currentColor" strokeWidth="0.5" className="text-primary/30" opacity="0.5">
                  <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3s" repeatCount="indefinite" />
                </line>
                <line x1="50" y1="0" x2="100" y2="0" stroke="currentColor" strokeWidth="0.5" className="text-secondary/30" opacity="0.5">
                  <animate attributeName="opacity" values="0.3;0.7;0.3" dur="4s" repeatCount="indefinite" />
                </line>
                <line x1="0" y1="0" x2="0" y2="50" stroke="currentColor" strokeWidth="0.5" className="text-primary/30" opacity="0.5">
                  <animate attributeName="opacity" values="0.3;0.7;0.3" dur="5s" repeatCount="indefinite" />
                </line>
                <line x1="50" y1="0" x2="50" y2="50" stroke="currentColor" strokeWidth="0.5" className="text-secondary/30" opacity="0.5">
                  <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3.5s" repeatCount="indefinite" />
                </line>
                <line x1="0" y1="50" x2="50" y2="50" stroke="currentColor" strokeWidth="0.5" className="text-primary/30" opacity="0.5">
                  <animate attributeName="opacity" values="0.3;0.7;0.3" dur="4.5s" repeatCount="indefinite" />
                </line>
                <line x1="50" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.5" className="text-secondary/30" opacity="0.5">
                  <animate attributeName="opacity" values="0.3;0.7;0.3" dur="5.5s" repeatCount="indefinite" />
                </line>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#neural-grid)" />
          </svg>
          
          <div className="hidden md:block absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }}></div>
          <div className="hidden md:block absolute bottom-1/4 -right-20 w-80 h-80 bg-secondary/15 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
          <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
          
          <div className="hidden md:block absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-32 h-32 border-2 border-primary rounded-lg rotate-12 animate-pulse"></div>
            <div className="absolute top-40 right-20 w-24 h-24 border-2 border-secondary rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-32 left-1/4 w-40 h-40 border-2 border-primary/50 rounded-lg -rotate-6 animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-20 right-1/3 w-28 h-28 border-2 border-secondary/50 rounded-full animate-pulse" style={{ animationDelay: '3s' }}></div>
          </div>
        </div>

        <div className="container mx-auto relative z-10 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-4 md:space-y-8">
            <Badge className="glass text-sm md:text-lg px-4 md:px-6 py-1.5 md:py-2 neon-glow animate-fade-in hover:scale-110 transition-all cursor-pointer">
              ✨ Первое HR агентство с AI-подбором
            </Badge>
            
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-bold leading-tight neon-text animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Сложности в найме сотрудников?<br />
              <span className="text-secondary">Решим за 24 часа</span>
            </h1>
            
            <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="inline-block px-4 py-2 md:px-6 md:py-3 rounded-lg glass border-2 border-primary" style={{ boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' }}>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold">
                  Если не уложимся в сроки - <span className="text-primary font-extrabold">не платите</span>
                </p>
              </div>
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

            <div className="flex flex-col items-center gap-3 md:gap-4 pt-2 md:pt-4 animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => {
                    sendMetrikaGoal(metrikaGoals.CTA_CLICK, { action: 'hero_find_employee' });
                    scrollToSection('cta');
                  }} 
                  className="hover:neon-glow hover:scale-110 transition-all text-sm sm:text-base md:text-lg lg:text-xl px-6 sm:px-8 md:px-12 py-4 sm:py-5 md:py-6 lg:py-8 border-2"
                >
                  🔥 Найти сотрудника
                </Button>
              </div>
              <Button 
                size="lg" 
                variant="ghost"
                onClick={() => {
                  sendMetrikaGoal(metrikaGoals.CTA_CLICK, { action: 'hero_telegram' });
                  window.open('https://t.me/TheDenisZ', '_blank');
                }} 
                className="hover:neon-glow hover:scale-110 transition-all text-sm md:text-base px-6 md:px-8 py-3 md:py-4"
              >
                <Icon name="MessageCircle" className="mr-2" size={20} />
                Написать в Telegram
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12 relative overflow-hidden">
        <div className="container mx-auto text-center mb-6 px-4 md:px-6">
          <h2 className="text-2xl md:text-4xl font-bold neon-text mb-2">
            Закрываем вакансии в любой отрасли
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            От строителей до топ-менеджеров
          </p>
        </div>
        
        <div className="relative overflow-hidden w-full">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-10 pointer-events-none"></div>
          <div className="flex gap-2 md:gap-3 animate-scroll-mobile md:animate-scroll-fast min-w-max">
            <Card className="glass-dark p-2 md:p-3 flex-shrink-0 w-40 md:w-52 hover:shadow-lg transition-all">
              <div className="flex items-center gap-2 md:gap-3 mb-2">
                <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                  <Icon name="Code" size={14} className="md:w-4 md:h-4 text-white" />
                </div>
                <h3 className="font-bold text-xs md:text-sm">IT-специалисты</h3>
              </div>
              <div className="flex flex-wrap gap-0.5 md:gap-1">
                <Badge className="bg-primary/20 text-primary text-[10px] md:text-xs px-1.5 py-0.5">Frontend</Badge>
                <Badge className="bg-primary/20 text-primary text-[10px] md:text-xs px-1.5 py-0.5">Backend</Badge>
                <Badge className="bg-primary/20 text-primary text-[10px] md:text-xs px-1.5 py-0.5">DevOps</Badge>
              </div>
            </Card>

            <Card className="glass-dark p-2 md:p-3 flex-shrink-0 w-40 md:w-52 hover:shadow-lg transition-all">
              <div className="flex items-center gap-2 md:gap-3 mb-2">
                <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-secondary to-secondary flex items-center justify-center flex-shrink-0">
                  <Icon name="TrendingUp" size={14} className="md:w-4 md:h-4 text-white" />
                </div>
                <h3 className="font-bold text-xs md:text-sm">Продажи</h3>
              </div>
              <div className="flex flex-wrap gap-0.5 md:gap-1">
                <Badge className="bg-secondary/20 text-secondary text-[10px] md:text-xs px-1.5 py-0.5">B2B Sales</Badge>
                <Badge className="bg-secondary/20 text-secondary text-[10px] md:text-xs px-1.5 py-0.5">B2C Sales</Badge>
                <Badge className="bg-secondary/20 text-secondary text-[10px] md:text-xs px-1.5 py-0.5">Key Account</Badge>
              </div>
            </Card>

            <Card className="glass-dark p-2 md:p-3 flex-shrink-0 w-40 md:w-52 hover:shadow-lg transition-all">
              <div className="flex items-center gap-2 md:gap-3 mb-2">
                <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center flex-shrink-0">
                  <Icon name="ShoppingCart" size={14} className="md:w-4 md:h-4 text-white" />
                </div>
                <h3 className="font-bold text-xs md:text-sm">Маркетплейсы</h3>
              </div>
              <div className="flex flex-wrap gap-0.5 md:gap-1">
                <Badge className="bg-secondary/20 text-secondary text-[10px] md:text-xs px-1.5 py-0.5">WB</Badge>
                <Badge className="bg-secondary/20 text-secondary text-[10px] md:text-xs px-1.5 py-0.5">Ozon</Badge>
                <Badge className="bg-secondary/20 text-secondary text-[10px] md:text-xs px-1.5 py-0.5">Аналитик</Badge>
              </div>
            </Card>

            <Card className="glass-dark p-2 md:p-3 flex-shrink-0 w-40 md:w-52 hover:shadow-lg transition-all">
              <div className="flex items-center gap-2 md:gap-3 mb-2">
                <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                  <Icon name="Crown" size={14} className="md:w-4 md:h-4 text-white" />
                </div>
                <h3 className="font-bold text-xs md:text-sm">Руководители</h3>
              </div>
              <div className="flex flex-wrap gap-0.5 md:gap-1">
                <Badge className="bg-primary/20 text-primary text-[10px] md:text-xs px-1.5 py-0.5">CEO</Badge>
                <Badge className="bg-primary/20 text-primary text-[10px] md:text-xs px-1.5 py-0.5">COO</Badge>
                <Badge className="bg-primary/20 text-primary text-[10px] md:text-xs px-1.5 py-0.5">CFO</Badge>
              </div>
            </Card>

            <Card className="glass-dark p-2 md:p-3 flex-shrink-0 w-40 md:w-52 hover:shadow-lg transition-all">
              <div className="flex items-center gap-2 md:gap-3 mb-2">
                <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center flex-shrink-0">
                  <Icon name="Megaphone" size={14} className="md:w-4 md:h-4 text-white" />
                </div>
                <h3 className="font-bold text-xs md:text-sm">Маркетологи</h3>
              </div>
              <div className="flex flex-wrap gap-0.5 md:gap-1">
                <Badge className="bg-secondary/20 text-secondary text-[10px] md:text-xs px-1.5 py-0.5">Digital</Badge>
                <Badge className="bg-secondary/20 text-secondary text-[10px] md:text-xs px-1.5 py-0.5">SMM</Badge>
                <Badge className="bg-secondary/20 text-secondary text-[10px] md:text-xs px-1.5 py-0.5">Content</Badge>
              </div>
            </Card>

            <Card className="glass-dark p-2 md:p-3 flex-shrink-0 w-40 md:w-52 hover:shadow-lg transition-all">
              <div className="flex items-center gap-2 md:gap-3 mb-2">
                <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-secondary to-secondary flex items-center justify-center flex-shrink-0">
                  <Icon name="Headphones" size={14} className="md:w-4 md:h-4 text-white" />
                </div>
                <h3 className="font-bold text-xs md:text-sm">Поддержка</h3>
              </div>
              <div className="flex flex-wrap gap-0.5 md:gap-1">
                <Badge className="bg-secondary/20 text-secondary text-[10px] md:text-xs px-1.5 py-0.5">Customer Success</Badge>
                <Badge className="bg-secondary/20 text-secondary text-[10px] md:text-xs px-1.5 py-0.5">Support</Badge>
              </div>
            </Card>

            <Card className="glass-dark p-2 md:p-3 flex-shrink-0 w-40 md:w-52 hover:shadow-lg transition-all">
              <div className="flex items-center gap-2 md:gap-3 mb-2">
                <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                  <Icon name="DollarSign" size={14} className="md:w-4 md:h-4 text-white" />
                </div>
                <h3 className="font-bold text-xs md:text-sm">Финансисты</h3>
              </div>
              <div className="flex flex-wrap gap-0.5 md:gap-1">
                <Badge className="bg-primary/20 text-primary text-[10px] md:text-xs px-1.5 py-0.5">Бухгалтер</Badge>
                <Badge className="bg-primary/20 text-primary text-[10px] md:text-xs px-1.5 py-0.5">Фин. аналитик</Badge>
              </div>
            </Card>

            <Card className="glass-dark p-2 md:p-3 flex-shrink-0 w-40 md:w-52 hover:shadow-lg transition-all">
              <div className="flex items-center gap-2 md:gap-3 mb-2">
                <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-secondary to-secondary flex items-center justify-center flex-shrink-0">
                  <Icon name="Cog" size={14} className="md:w-4 md:h-4 text-white" />
                </div>
                <h3 className="font-bold text-xs md:text-sm">Производство</h3>
              </div>
              <div className="flex flex-wrap gap-0.5 md:gap-1">
                <Badge className="bg-secondary/20 text-secondary text-[10px] md:text-xs px-1.5 py-0.5">Инженер</Badge>
                <Badge className="bg-secondary/20 text-secondary text-[10px] md:text-xs px-1.5 py-0.5">Технолог</Badge>
              </div>
            </Card>

            <Card className="glass-dark p-2 md:p-3 flex-shrink-0 w-40 md:w-52 hover:shadow-lg transition-all">
              <div className="flex items-center gap-2 md:gap-3 mb-2">
                <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                  <Icon name="hard-hat" size={14} className="md:w-4 md:h-4 text-white" />
                </div>
                <h3 className="font-bold text-xs md:text-sm">Строители</h3>
              </div>
              <div className="flex flex-wrap gap-0.5 md:gap-1">
                <Badge className="bg-primary/20 text-primary text-[10px] md:text-xs px-1.5 py-0.5">Прораб</Badge>
                <Badge className="bg-primary/20 text-primary text-[10px] md:text-xs px-1.5 py-0.5">Мастер</Badge>
                <Badge className="bg-primary/20 text-primary text-[10px] md:text-xs px-1.5 py-0.5">Рабочие</Badge>
              </div>
            </Card>

            <Card className="glass-dark p-2 md:p-3 flex-shrink-0 w-40 md:w-52 hover:shadow-lg transition-all">
              <div className="flex items-center gap-2 md:gap-3 mb-2">
                <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                  <Icon name="Code" size={14} className="md:w-4 md:h-4 text-white" />
                </div>
                <h3 className="font-bold text-xs md:text-sm">IT-специалисты</h3>
              </div>
              <div className="flex flex-wrap gap-0.5 md:gap-1">
                <Badge className="bg-primary/20 text-primary text-[10px] md:text-xs px-1.5 py-0.5">Frontend</Badge>
                <Badge className="bg-primary/20 text-primary text-[10px] md:text-xs px-1.5 py-0.5">Backend</Badge>
                <Badge className="bg-primary/20 text-primary text-[10px] md:text-xs px-1.5 py-0.5">DevOps</Badge>
              </div>
            </Card>

            <Card className="glass-dark p-2 md:p-3 flex-shrink-0 w-40 md:w-52 hover:shadow-lg transition-all">
              <div className="flex items-center gap-2 md:gap-3 mb-2">
                <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-secondary to-secondary flex items-center justify-center flex-shrink-0">
                  <Icon name="TrendingUp" size={14} className="md:w-4 md:h-4 text-white" />
                </div>
                <h3 className="font-bold text-xs md:text-sm">Продажи</h3>
              </div>
              <div className="flex flex-wrap gap-0.5 md:gap-1">
                <Badge className="bg-secondary/20 text-secondary text-[10px] md:text-xs px-1.5 py-0.5">B2B Sales</Badge>
                <Badge className="bg-secondary/20 text-secondary text-[10px] md:text-xs px-1.5 py-0.5">B2C Sales</Badge>
                <Badge className="bg-secondary/20 text-secondary text-[10px] md:text-xs px-1.5 py-0.5">Key Account</Badge>
              </div>
            </Card>

            <Card className="glass-dark p-2 md:p-3 flex-shrink-0 w-40 md:w-52 hover:shadow-lg transition-all">
              <div className="flex items-center gap-2 md:gap-3 mb-2">
                <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center flex-shrink-0">
                  <Icon name="ShoppingCart" size={14} className="md:w-4 md:h-4 text-white" />
                </div>
                <h3 className="font-bold text-xs md:text-sm">Маркетплейсы</h3>
              </div>
              <div className="flex flex-wrap gap-0.5 md:gap-1">
                <Badge className="bg-secondary/20 text-secondary text-[10px] md:text-xs px-1.5 py-0.5">WB</Badge>
                <Badge className="bg-secondary/20 text-secondary text-[10px] md:text-xs px-1.5 py-0.5">Ozon</Badge>
                <Badge className="bg-secondary/20 text-secondary text-[10px] md:text-xs px-1.5 py-0.5">Аналитик</Badge>
              </div>
            </Card>

            <Card className="glass-dark p-2 md:p-3 flex-shrink-0 w-40 md:w-52 hover:shadow-lg transition-all">
              <div className="flex items-center gap-2 md:gap-3 mb-2">
                <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                  <Icon name="Crown" size={14} className="md:w-4 md:h-4 text-white" />
                </div>
                <h3 className="font-bold text-xs md:text-sm">Руководители</h3>
              </div>
              <div className="flex flex-wrap gap-0.5 md:gap-1">
                <Badge className="bg-primary/20 text-primary text-[10px] md:text-xs px-1.5 py-0.5">CEO</Badge>
                <Badge className="bg-primary/20 text-primary text-[10px] md:text-xs px-1.5 py-0.5">COO</Badge>
                <Badge className="bg-primary/20 text-primary text-[10px] md:text-xs px-1.5 py-0.5">CFO</Badge>
              </div>
            </Card>

            <Card className="glass-dark p-2 md:p-3 flex-shrink-0 w-40 md:w-52 hover:shadow-lg transition-all">
              <div className="flex items-center gap-2 md:gap-3 mb-2">
                <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center flex-shrink-0">
                  <Icon name="Megaphone" size={14} className="md:w-4 md:h-4 text-white" />
                </div>
                <h3 className="font-bold text-xs md:text-sm">Маркетологи</h3>
              </div>
              <div className="flex flex-wrap gap-0.5 md:gap-1">
                <Badge className="bg-secondary/20 text-secondary text-[10px] md:text-xs px-1.5 py-0.5">Digital</Badge>
                <Badge className="bg-secondary/20 text-secondary text-[10px] md:text-xs px-1.5 py-0.5">SMM</Badge>
                <Badge className="bg-secondary/20 text-secondary text-[10px] md:text-xs px-1.5 py-0.5">Content</Badge>
              </div>
            </Card>

            <Card className="glass-dark p-2 md:p-3 flex-shrink-0 w-40 md:w-52 hover:shadow-lg transition-all">
              <div className="flex items-center gap-2 md:gap-3 mb-2">
                <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-secondary to-secondary flex items-center justify-center flex-shrink-0">
                  <Icon name="Headphones" size={14} className="md:w-4 md:h-4 text-white" />
                </div>
                <h3 className="font-bold text-xs md:text-sm">Поддержка</h3>
              </div>
              <div className="flex flex-wrap gap-0.5 md:gap-1">
                <Badge className="bg-secondary/20 text-secondary text-[10px] md:text-xs px-1.5 py-0.5">Customer Success</Badge>
                <Badge className="bg-secondary/20 text-secondary text-[10px] md:text-xs px-1.5 py-0.5">Support</Badge>
              </div>
            </Card>

            <Card className="glass-dark p-2 md:p-3 flex-shrink-0 w-40 md:w-52 hover:shadow-lg transition-all">
              <div className="flex items-center gap-2 md:gap-3 mb-2">
                <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                  <Icon name="DollarSign" size={14} className="md:w-4 md:h-4 text-white" />
                </div>
                <h3 className="font-bold text-xs md:text-sm">Финансисты</h3>
              </div>
              <div className="flex flex-wrap gap-0.5 md:gap-1">
                <Badge className="bg-primary/20 text-primary text-[10px] md:text-xs px-1.5 py-0.5">Бухгалтер</Badge>
                <Badge className="bg-primary/20 text-primary text-[10px] md:text-xs px-1.5 py-0.5">Фин. аналитик</Badge>
              </div>
            </Card>

            <Card className="glass-dark p-2 md:p-3 flex-shrink-0 w-40 md:w-52 hover:shadow-lg transition-all">
              <div className="flex items-center gap-2 md:gap-3 mb-2">
                <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-secondary to-secondary flex items-center justify-center flex-shrink-0">
                  <Icon name="Cog" size={14} className="md:w-4 md:h-4 text-white" />
                </div>
                <h3 className="font-bold text-xs md:text-sm">Производство</h3>
              </div>
              <div className="flex flex-wrap gap-0.5 md:gap-1">
                <Badge className="bg-secondary/20 text-secondary text-[10px] md:text-xs px-1.5 py-0.5">Инженер</Badge>
                <Badge className="bg-secondary/20 text-secondary text-[10px] md:text-xs px-1.5 py-0.5">Технолог</Badge>
              </div>
            </Card>

            <Card className="glass-dark p-2 md:p-3 flex-shrink-0 w-40 md:w-52 hover:shadow-lg transition-all">
              <div className="flex items-center gap-2 md:gap-3 mb-2">
                <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                  <Icon name="hard-hat" size={14} className="md:w-4 md:h-4 text-white" />
                </div>
                <h3 className="font-bold text-xs md:text-sm">Строители</h3>
              </div>
              <div className="flex flex-wrap gap-0.5 md:gap-1">
                <Badge className="bg-primary/20 text-primary text-[10px] md:text-xs px-1.5 py-0.5">Прораб</Badge>
                <Badge className="bg-primary/20 text-primary text-[10px] md:text-xs px-1.5 py-0.5">Мастер</Badge>
                <Badge className="bg-primary/20 text-primary text-[10px] md:text-xs px-1.5 py-0.5">Рабочие</Badge>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section id="why-us" className="relative py-20 md:py-32 px-4 md:px-6 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/2 via-secondary/3 to-primary/2 animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/4 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/3 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
          </div>
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-3" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(139, 92, 246, 0.3) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16 md:mb-20 space-y-6">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight animate-fade-in">
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                Почему нас выбирают
              </span>
              <br />
              <span className="text-3xl sm:text-4xl md:text-5xl text-muted-foreground font-normal">
                500+ компаний
              </span>
            </h2>
            <p className="text-lg md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Объединили <span className="text-primary font-bold">искусственный интеллект</span>, 
              <span className="text-secondary font-bold"> 20+ лет опыта</span> и  
              <span className="text-primary font-bold">систему финансовых гарантий</span>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
            <Card className="group relative glass-dark p-6 md:p-8 hover:shadow-lg transition-all duration-500 md:hover:scale-105 md:hover:-translate-y-2 animate-fade-in overflow-hidden" style={{ animationDelay: '0.1s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                  <Icon name="Brain" size={24} className="md:w-8 md:h-8 text-white group-hover:rotate-12 transition-transform duration-500" />
                </div>
                <div>
                  <h3 className="font-bold text-lg md:text-xl mb-2 group-hover:text-primary transition-colors">ИИ-анализ без предвзятости</h3>
                  <Badge className="text-xs bg-primary/20 text-primary">Точность 90%+</Badge>
                </div>
              </div>
              <p className="text-sm md:text-base text-muted-foreground">
                Искусственный интеллект анализирует hard и soft skills объективно, без человеческого фактора
              </p>
            </Card>

            <Card className="group glass-dark p-6 md:p-8 hover:shadow-lg transition-all duration-500 hover:scale-105 hover:-translate-y-2 animate-fade-in overflow-hidden" style={{ animationDelay: '0.2s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
                Каждое интервью включает ролевую игру с записью — проверяем реальные навыки
              </p>
            </Card>

            <Card className="group glass-dark p-6 md:p-8 hover:shadow-lg transition-all duration-500 hover:scale-105 hover:-translate-y-2 animate-fade-in overflow-hidden" style={{ animationDelay: '0.3s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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

            <Card className="group glass-dark p-6 md:p-8 hover:shadow-lg transition-all duration-500 hover:scale-105 hover:-translate-y-2 animate-fade-in overflow-hidden" style={{ animationDelay: '0.4s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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

            <Card className="group glass-dark p-6 md:p-8 hover:shadow-lg transition-all duration-500 hover:scale-105 hover:-translate-y-2 animate-fade-in overflow-hidden" style={{ animationDelay: '0.5s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-glow flex-shrink-0">
                  <Icon name="Target" size={20} className="md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base md:text-lg mb-1">Узкая специализация</h3>
                  <Badge className="text-xs bg-primary/20 text-primary">Только профессионалы</Badge>
                </div>
              </div>
              <p className="text-sm md:text-base text-muted-foreground">
                У нас группа компаний. Под каждое направление создан отдельный проект, который специализируется на вашей нише
              </p>
            </Card>

            <Card className="group glass-dark p-6 md:p-8 hover:shadow-lg transition-all duration-500 hover:scale-105 hover:-translate-y-2 animate-fade-in overflow-hidden" style={{ animationDelay: '0.6s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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

            <Card className="group glass-dark p-6 md:p-8 hover:shadow-lg transition-all duration-500 hover:scale-105 hover:-translate-y-2 animate-fade-in overflow-hidden sm:col-span-2 lg:col-span-1" style={{ animationDelay: '0.7s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-glow flex-shrink-0">
                  <Icon name="Eye" size={20} className="md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base md:text-lg mb-1">Прозрачный процесс</h3>
                  <Badge className="text-xs bg-primary/20 text-primary">Google-таблица онлайн</Badge>
                </div>
              </div>
              <p className="text-sm md:text-base text-muted-foreground">
                Формируем файл с анализом каждого кандидата — вы видите прогресс онлайн
              </p>
            </Card>

            <Card className="group glass-dark p-6 md:p-8 hover:shadow-lg transition-all duration-500 hover:scale-105 hover:-translate-y-2 animate-fade-in overflow-hidden sm:col-span-2 lg:col-span-1" style={{ animationDelay: '0.8s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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

          <div className="flex justify-center mt-8 md:mt-12">
            <Button 
              onClick={() => {
                sendMetrikaGoal(metrikaGoals.CTA_CLICK, { action: 'why_us_cta' });
                scrollToSection('cta');
              }} 
              size="lg" 
              className="neon-glow bg-gradient-to-r from-primary to-secondary hover:opacity-90 hover:scale-110 transition-all text-base md:text-lg px-8 md:px-12 py-6 md:py-8 w-full sm:w-auto"
            >
              🚀 Получить кандидата завтра
            </Button>
          </div>
        </div>
      </section>

      <section id="demo" className="py-12 md:py-20 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="text-center mb-8 md:mb-16 space-y-3 md:space-y-4">
            <Badge className="text-sm md:text-lg px-4 md:px-6 py-1.5 md:py-2 neon-glow animate-pulse">🤖 Интерактивная демонстрация</Badge>
            <h2 className="text-2xl md:text-5xl font-bold neon-text">Как мы находим лучших кандидатов</h2>
            <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto">
              AI анализирует видео-интервью и оценивает компетенции
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="glass-dark p-4 md:p-8 space-y-4 md:space-y-6 animate-scale-in hover:neon-glow transition-all mb-6 md:mb-8">
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
          </div>

          {showReport && (
            <div className="max-w-6xl mx-auto mt-8 md:mt-12 lg:mt-20 px-3 md:px-0 animate-scale-in">
              <Card className="glass-dark p-3 sm:p-4 md:p-6 lg:p-8 border-primary/30 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 animate-pulse" style={{ animationDuration: '3s' }}></div>
                </div>

                <div className="relative">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4 animate-fade-in">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-pulse" style={{ animationDuration: '2s' }}>
                        <Icon name="FileText" size={20} className="sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                      </div>
                      <div>
                        <Badge className="text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 mb-1 sm:mb-1.5 animate-fade-in" style={{ animationDelay: '0.1s' }}>📊 Пример отчёта</Badge>
                        <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold animate-fade-in" style={{ animationDelay: '0.2s' }}>Детальный отчёт кандидата</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.3s' }}>Александр Петров • Менеджер по продажам</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="hover:scale-110 transition-all animate-fade-in self-end sm:self-auto" onClick={() => setShowReport(false)} style={{ animationDelay: '0.4s' }}>
                      <Icon name="X" size={16} className="sm:w-4 sm:h-4" />
                    </Button>
                  </div>

                  <div className="space-y-4 md:space-y-6">
                    <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                      <Card className="glass p-2 sm:p-3 border-primary/20 transition-all animate-fade-in" style={{ animationDelay: '0.5s' }}>
                        <div className="text-center">
                          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-0.5 sm:mb-1 animate-pulse">{Math.round(skillScores.communication)}%</div>
                          <div className="text-[10px] sm:text-xs text-muted-foreground">Общая оценка</div>
                          <Badge className="mt-1 sm:mt-1.5 text-[9px] sm:text-xs px-1 sm:px-2 py-0 sm:py-0.5 bg-primary/20 text-primary">Высокий</Badge>
                        </div>
                      </Card>
                      <Card className="glass p-2 sm:p-3 border-secondary/20 transition-all animate-fade-in" style={{ animationDelay: '0.6s' }}>
                        <div className="text-center">
                          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-secondary mb-0.5 sm:mb-1 animate-pulse" style={{ animationDelay: '0.2s' }}>92%</div>
                          <div className="text-[10px] sm:text-xs text-muted-foreground">Прогноз успеха</div>
                          <Badge className="mt-1 sm:mt-1.5 text-[9px] sm:text-xs px-1 sm:px-2 py-0 sm:py-0.5 bg-secondary/20 text-secondary">ОК</Badge>
                        </div>
                      </Card>
                      <Card className="glass p-2 sm:p-3 border-secondary/20 transition-all animate-fade-in" style={{ animationDelay: '0.7s' }}>
                        <div className="text-center">
                          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-secondary mb-0.5 sm:mb-1 animate-pulse" style={{ animationDelay: '0.4s' }}>5 лет</div>
                          <div className="text-[10px] sm:text-xs text-muted-foreground">Опыт</div>
                          <Badge className="mt-1 sm:mt-1.5 text-[9px] sm:text-xs px-1 sm:px-2 py-0 sm:py-0.5 bg-secondary/20 text-secondary">Middle</Badge>
                        </div>
                      </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div className="space-y-3 sm:space-y-4 animate-fade-in" style={{ animationDelay: '0.8s' }}>
                        <h4 className="font-bold text-sm sm:text-base md:text-lg flex items-center gap-2">
                          <Icon name="Brain" size={16} className="sm:w-5 sm:h-5 text-primary animate-pulse" />
                          Психологический профиль
                        </h4>
                        <div className="space-y-2 sm:space-y-3">
                          <div className="animate-fade-in" style={{ animationDelay: '0.9s' }}>
                            <div className="flex justify-between text-xs sm:text-sm mb-1">
                              <span>Экстраверсия</span>
                              <span className="font-bold text-primary">85%</span>
                            </div>
                            <Progress value={85} className="h-1.5 sm:h-2" />
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

                      <div className="space-y-3 sm:space-y-4 animate-fade-in" style={{ animationDelay: '1s' }}>
                        <h4 className="font-bold text-sm sm:text-base md:text-lg flex items-center gap-2">
                          <Icon name="Target" size={16} className="sm:w-5 sm:h-5 text-secondary animate-pulse" />
                          Ключевые компетенции
                        </h4>
                        <div className="space-y-2 sm:space-y-3">
                          <div className="flex items-center justify-between glass p-2 sm:p-3 rounded-lg transition-all animate-fade-in" style={{ animationDelay: '1.1s' }}>
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <Icon name="MessageSquare" size={14} className="sm:w-4 sm:h-4 text-primary" />
                              <span className="text-xs sm:text-sm">Коммуникация</span>
                            </div>
                            <Badge className="bg-primary/20 text-primary text-[10px] sm:text-xs px-1.5 sm:px-2">94%</Badge>
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

                    <Card className="glass-dark p-3 sm:p-4 md:p-6 border-accent/30 transition-all animate-fade-in" style={{ animationDelay: '1.5s' }}>
                      <h4 className="font-bold text-sm sm:text-base md:text-lg mb-3 sm:mb-4 flex items-center gap-2">
                        <Icon name="Lightbulb" size={16} className="sm:w-5 sm:h-5 text-secondary animate-pulse" />
                        Рекомендации AI
                      </h4>
                      <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-muted-foreground">
                        <div className="flex gap-2 sm:gap-3 animate-fade-in" style={{ animationDelay: '1.6s' }}>
                          <Icon name="CheckCircle2" size={14} className="sm:w-4 sm:h-4 text-primary flex-shrink-0 mt-0.5" />
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

                    <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 pt-3 sm:pt-4 animate-fade-in" style={{ animationDelay: '1.9s' }}>
                      <Button 
                        onClick={() => {
                          sendMetrikaGoal(metrikaGoals.CTA_CLICK, { action: 'demo_find_candidate' });
                          scrollToSection('cta');
                        }} 
                        className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 hover:scale-105 transition-all text-xs sm:text-sm"
                      >
                        <Icon name="Rocket" size={16} className="sm:w-4 sm:h-4 mr-2" />
                        Найти такого кандидата
                      </Button>
                      <Button variant="outline" onClick={() => setShowReport(false)} className="hover:scale-105 transition-all text-xs sm:text-sm">
                        Закрыть
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

      <section id="cases" className="py-12 md:py-20 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16 space-y-4">
            <Badge className="text-lg px-6 py-2 neon-glow animate-pulse">💼 Отзывы от компаний</Badge>
            <h2 className="text-4xl md:text-5xl font-bold neon-text">Что говорят клиенты</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Более 500 компаний уже нашли своих сотрудников через нас
            </p>
          </div>

          <Suspense fallback={<div className="h-96 flex items-center justify-center"><Icon name="loader-2" className="animate-spin" size={32} /></div>}>
            <TestimonialsCarousel testimonials={testimonials} />
          </Suspense>
        </div>
      </section>

      <section id="team" className="py-12 md:py-20 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-16 space-y-3 md:space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold neon-text">Наша команда</h2>
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              Профессиональные HR-специалисты с многолетним опытом
            </p>
          </div>

          <Suspense fallback={<div className="h-96 flex items-center justify-center"><Icon name="loader-2" className="animate-spin" size={32} /></div>}>
            <TeamCarousel teamMembers={teamMembers} />
          </Suspense>
        </div>
      </section>



      <section id="faq" className="py-12 md:py-20 px-4 md:px-6">
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
                  <Button 
                    variant="outline" 
                    className="hover:neon-glow hover:scale-105 transition-all"
                    onClick={() => {
                      sendMetrikaGoal(metrikaGoals.PHONE_CLICK, { location: 'faq_section' });
                      window.open('tel:+79955556231', '_self');
                    }}
                  >
                    <Icon name="Phone" size={16} className="mr-2" />
                    Позвонить
                  </Button>
                  <Button 
                    className="neon-glow bg-gradient-to-r from-primary to-secondary hover:opacity-90 hover:scale-105 transition-all"
                    onClick={() => {
                      sendMetrikaGoal(metrikaGoals.CTA_CLICK, { action: 'faq_telegram' });
                      window.open('https://t.me/TheDenisZ', '_blank');
                    }}
                  >
                    <Icon name="MessageCircle" size={16} className="mr-2" />
                    Telegram
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

              <form onSubmit={(e) => handleSubmit(e, 'main_cta_form')} className="space-y-3 sm:space-y-4 max-w-md mx-auto pt-4 md:pt-6">
                <Input 
                  placeholder="Ваше имя *"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="glass border-primary/30 h-12 md:h-14 text-base focus:neon-glow transition-all"
                />

                <Input 
                  placeholder="Номер телефона *"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                  className="glass border-primary/30 h-12 md:h-14 text-base focus:neon-glow transition-all"
                />

                <Button type="submit" size="lg" className="w-full neon-glow bg-gradient-to-r from-primary to-secondary hover:opacity-90 hover:scale-105 transition-all text-base md:text-lg h-12 md:h-14" disabled={isSubmitting}>
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
                  <a href="https://t.me/TheDenisZ" target="_blank" rel="noopener noreferrer">Telegram</a>
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
                <Link 
                  to="/calculator" 
                  className="text-left hover:text-primary transition-all hover:scale-110"
                  onClick={() => sendMetrikaGoal(metrikaGoals.CALCULATOR_OPEN, { source: 'footer_nav' })}
                >
                  Калькулятор
                </Link>
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
          onClick={() => {
            sendMetrikaGoal(metrikaGoals.CTA_CLICK, { action: 'floating_vacancy_analysis' });
            setIsVacancyAnalysisOpen(true);
          }}
          size="sm"
          className="neon-glow bg-gradient-to-r from-primary to-secondary hover:opacity-90 hover:scale-110 transition-all shadow-2xl text-xs md:text-sm px-3 md:px-4 py-2 md:py-3 md:h-auto animate-fade-in"
        >
          <Icon name="sparkles" size={16} className="md:w-5 md:h-5 mr-1.5 md:mr-2" />
          <span className="hidden sm:inline">Бесплатный анализ вакансии</span>
          <span className="sm:hidden">Анализ</span>
        </Button>
        
        <Button
          onClick={() => {
            sendMetrikaGoal(metrikaGoals.CTA_CLICK, { action: 'floating_consultation' });
            setIsConsultFormOpen(true);
          }}
          size="sm"
          variant="outline"
          className="hover:neon-glow hover:scale-110 transition-all shadow-lg text-xs md:text-sm px-3 md:px-4 py-2 md:py-3 md:h-auto animate-fade-in"
          style={{ animationDelay: '0.2s' }}
        >
          <Icon name="Calendar" size={16} className="md:w-5 md:h-5 mr-1.5 md:mr-2" />
          <span className="hidden sm:inline">Консультация</span>
          <span className="sm:hidden">Звонок</span>
        </Button>
      </div>

      <Suspense fallback={null}>
        {isConsultFormOpen && <ConsultationModal isOpen={isConsultFormOpen} onClose={() => setIsConsultFormOpen(false)} />}
        {isAIScanOpen && <AIScanModal isOpen={isAIScanOpen} onClose={() => setIsAIScanOpen(false)} source="main_hero_button" />}
        {isVacancyAnalysisOpen && <VacancyAnalysisModal isOpen={isVacancyAnalysisOpen} onClose={() => setIsVacancyAnalysisOpen(false)} />}
      </Suspense>

      {/* Mobile Phone Bar */}
      <a 
        href="tel:+79955556231" 
        className="md:hidden fixed bottom-0 left-0 right-0 z-[101] bg-gradient-to-r from-blue-600 to-cyan-600 py-4 px-4 flex items-center justify-center gap-3 hover:opacity-90 transition-opacity shadow-[0_-4px_20px_rgba(59,130,246,0.5)]"
        onClick={() => sendMetrikaGoal(metrikaGoals.PHONE_CLICK, { location: 'mobile_bottom_bar' })}
      >
        <Icon name="phone" className="w-6 h-6 text-white animate-pulse" />
        <span className="text-2xl font-black text-white tracking-wide">
          +7 (995) 555-62-31
        </span>
      </a>
    </div>
  );
};

export default Index;