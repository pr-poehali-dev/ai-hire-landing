import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });

  const [stats, setStats] = useState({
    totalClosed: 1258,
    inProgress: 4
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        totalClosed: prev.totalClosed + Math.floor(Math.random() * 2),
        inProgress: 3 + Math.floor(Math.random() * 3)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Заявка отправлена! 🚀',
      description: 'Мы свяжемся с вами в течение 2 часов'
    });
    setFormData({ name: '', phone: '' });
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const liveVacancies = [
    { title: 'Senior Full-Stack Developer', company: 'TechVision Solutions', candidates: 12, deadline: '4ч', match: 95, status: 'found' },
    { title: 'Chief Financial Officer', company: 'FinanceHub Pro', candidates: 7, status: 'searching' },
    { title: 'Head of Marketing', company: 'RetailMax Group', candidates: 15, status: 'found' },
    { title: 'Lead Data Scientist', company: 'MedTech Innovations', candidates: 23, status: 'closed' },
    { title: 'VP of Product', company: 'EduPlatform Digital', candidates: 9, status: 'searching' }
  ];

  const testimonials = [
    {
      name: 'Дмитрий Козлов',
      position: 'Tech Lead',
      company: 'NeoTech Solutions',
      text: 'AI-анализ выявил кандидата, который работал с похожей архитектурой в банковской сфере. Это был неочевидный выбор, но именно то, что нам было нужно.',
      rating: 5
    },
    {
      name: 'Елена Соколова',
      position: 'Head of AI Department',
      company: 'FinServe Pro',
      text: 'Искали полгода классическими методами. 1 DAY HR нашли идеального кандидата за сутки. Система AI-анализа показала совместимость с нашей командой 94%.',
      rating: 5
    },
    {
      name: 'Максим Петров',
      position: 'Product Manager',
      company: 'MobileHub',
      text: 'Боялись, что проект встанет. Но за сутки нашли специалиста, который не только закрыл задачу, но и провёл рефакторинг, улучшив всё приложение.',
      rating: 5
    },
    {
      name: 'Анна Смирнова',
      position: 'COO',
      company: 'MegaSell',
      text: 'Критически важно было найти человека быстро. 1 DAY HR справились за сутки, и это был именно тот специалист, который нам был нужен.',
      rating: 5
    },
    {
      name: 'Алексей Морозов',
      position: 'Sales Director',
      company: 'TelecomPro',
      text: 'ИИ-анализ показал скрытые навыки кандидата, которые мы бы упустили при обычном подборе. Результат превзошёл все ожидания!',
      rating: 5
    },
    {
      name: 'Ирина Федорова',
      position: 'Head of Sales',
      company: 'ConnectPlus',
      text: 'Кандидат знал наших конкурентов изнутри. AI-система оценила это как преимущество. За месяц вернул трёх крупных клиентов.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-glow">
                <Icon name="Sparkles" size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold neon-text">1 DAY HR</span>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <button onClick={() => scrollToSection('benefits')} className="text-sm hover:text-primary transition-colors">
                Преимущества
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="text-sm hover:text-primary transition-colors">
                Как работает
              </button>
              <button onClick={() => scrollToSection('pricing')} className="text-sm hover:text-primary transition-colors">
                Тарифы
              </button>
              <button onClick={() => scrollToSection('cases')} className="text-sm hover:text-primary transition-colors">
                Кейсы
              </button>
            </nav>

            <Button onClick={() => scrollToSection('cta')} className="neon-glow bg-gradient-to-r from-primary to-secondary hover:opacity-90">
              Найти сотрудника
            </Button>
          </div>
        </div>
      </header>

      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            <Badge className="glass text-lg px-6 py-2 neon-glow">
              Первое HR-агентство с AI подбором
            </Badge>
            
            <h1 className="text-6xl md:text-7xl font-bold leading-tight neon-text">
              НАЙДЕМ СОТРУДНИКА<br />за 24 часа
            </h1>
            
            <p className="text-2xl text-muted-foreground">
              Или вернем деньги. Гарантия 100%
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-lg">
              <div className="flex items-center gap-2">
                <Icon name="Brain" size={20} className="text-primary" />
                <span>ИИ-анализ навыков</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Shield" size={20} className="text-secondary" />
                <span>Гарантия замены</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Target" size={20} className="text-accent" />
                <span>Ролевые проверки</span>
              </div>
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <Button size="lg" onClick={() => scrollToSection('cta')} className="neon-glow bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-xl px-12 py-8">
                🔥 Найти сотрудника
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="problems" className="py-20 px-4 bg-muted/10">
        <div className="container mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold neon-text">Знакомая ситуация?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Почему традиционный найм не работает
            </p>
            <p className="text-lg text-muted-foreground">
              68% наймов признаются неудачными в течение первого года
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="glass p-8 space-y-4 hover:neon-glow transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="text-5xl font-bold text-primary/30">01</div>
                <div className="flex-1 space-y-2">
                  <div className="text-4xl font-bold text-primary">85%</div>
                  <p className="text-sm text-muted-foreground">резюме содержат преувеличения</p>
                </div>
              </div>
              <h3 className="text-2xl font-bold">Резюме врёт</h3>
              <p className="text-muted-foreground leading-relaxed">
                Красивые слова, впечатляющие достижения. А по факту — базовые навыки и завышенные ожидания.
              </p>
            </Card>

            <Card className="glass p-8 space-y-4 hover:neon-glow transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="text-5xl font-bold text-secondary/30">02</div>
                <div className="flex-1 space-y-2">
                  <div className="text-4xl font-bold text-secondary">52 дня</div>
                  <p className="text-sm text-muted-foreground">средний срок закрытия вакансии</p>
                </div>
              </div>
              <h3 className="text-2xl font-bold">Время — деньги</h3>
              <p className="text-muted-foreground leading-relaxed">
                Каждый день без нужного сотрудника — это упущенные возможности и выгоревшая команда.
              </p>
            </Card>

            <Card className="glass p-8 space-y-4 hover:neon-glow transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="text-5xl font-bold text-accent/30">03</div>
                <div className="flex-1 space-y-2">
                  <div className="text-4xl font-bold text-accent">3-5x</div>
                  <p className="text-sm text-muted-foreground">оклада стоит ошибка найма</p>
                </div>
              </div>
              <h3 className="text-2xl font-bold">Цена ошибки растёт</h3>
              <p className="text-muted-foreground leading-relaxed">
                Неудачный найм обходится в 3-5 окладов. А время и нервы не посчитать.
              </p>
            </Card>

            <Card className="glass p-8 space-y-4 hover:neon-glow transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="text-5xl font-bold text-primary/30">04</div>
                <div className="flex-1 space-y-2">
                  <div className="text-4xl font-bold text-primary">31%</div>
                  <p className="text-sm text-muted-foreground">падение продуктивности команды</p>
                </div>
              </div>
              <h3 className="text-2xl font-bold">Бизнес страдает</h3>
              <p className="text-muted-foreground leading-relaxed">
                Пока вакансия открыта — проекты буксуют, клиенты недовольны, конкуренты обгоняют.
              </p>
            </Card>
          </div>

          <div className="text-center mt-16">
            <h3 className="text-3xl font-bold mb-6 neon-text">Мы решаем эти проблемы</h3>
            <p className="text-xl text-muted-foreground mb-8">
              AI-подбор с гарантией результата за 24 часа
            </p>
            <Button size="lg" onClick={() => scrollToSection('cta')} className="neon-glow bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg px-8">
              Получить кандидата завтра
            </Button>
          </div>
        </div>
      </section>

      <section id="benefits" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold neon-text">Технологии будущего</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Почему выбирают нас
            </p>
            <p className="text-lg text-muted-foreground">
              Мы объединили искусственный интеллект, 20+ лет опыта в продажах и систему финансовых гарантий
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="glass p-6 space-y-4 hover:neon-glow transition-all duration-300 hover-scale">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center neon-glow">
                <Icon name="Brain" size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold">ИИ-анализ без предвзятости</h3>
              <Badge className="bg-primary/20 text-primary">Точность 90%+</Badge>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Искусственный интеллект анализирует hard и soft skills объективно, без человеческого фактора
              </p>
            </Card>

            <Card className="glass p-6 space-y-4 hover:neon-glow transition-all duration-300 hover-scale">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center neon-glow">
                <Icon name="Video" size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold">Ролевые проверки</h3>
              <Badge className="bg-secondary/20 text-secondary">Видео каждого кандидата</Badge>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Каждое интервью включает ролевую игру с записью — проверяем реальные навыки продаж
              </p>
            </Card>

            <Card className="glass p-6 space-y-4 hover:neon-glow transition-all duration-300 hover-scale">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center neon-glow">
                <Icon name="DollarSign" size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold">Финансовые гарантии</h3>
              <Badge className="bg-accent/20 text-accent">Реальная ответственность</Badge>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Просрочка на день = -10% от оплаты. Задержка на 7 дней — вторая часть бесплатно
              </p>
            </Card>

            <Card className="glass p-6 space-y-4 hover:neon-glow transition-all duration-300 hover-scale">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-glow">
                <Icon name="Infinity" size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold">Безлимитная замена</h3>
              <Badge className="bg-primary/20 text-primary">Даже через 2 года</Badge>
              <p className="text-muted-foreground text-sm leading-relaxed">
                На тарифе 'Еще вчера' — бессрочная гарантия замены кандидата по любой причине
              </p>
            </Card>

            <Card className="glass p-6 space-y-4 hover:neon-glow transition-all duration-300 hover-scale">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center neon-glow">
                <Icon name="Target" size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold">Узкая специализация</h3>
              <Badge className="bg-secondary/20 text-secondary">Только менеджеры</Badge>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Более 20 лет опыта в продажах — знаем специфику и понимаем вашу нишу
              </p>
            </Card>

            <Card className="glass p-6 space-y-4 hover:neon-glow transition-all duration-300 hover-scale">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center neon-glow">
                <Icon name="Sparkles" size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold">Дополнительный ИИ-скрининг</h3>
              <Badge className="bg-accent/20 text-accent">Hard skills тест</Badge>
              <p className="text-muted-foreground text-sm leading-relaxed">
                На премиум тарифе — отдельное собеседование с ИИ для проверки скрытых профессиональных качеств
              </p>
            </Card>

            <Card className="glass p-6 space-y-4 hover:neon-glow transition-all duration-300 hover-scale">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-glow">
                <Icon name="Eye" size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold">Прозрачность в реальном времени</h3>
              <Badge className="bg-primary/20 text-primary">Полный контроль</Badge>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Формируем файл с анализом каждого кандидата — вы видите прогресс онлайн
              </p>
            </Card>

            <Card className="glass p-6 space-y-4 hover:neon-glow transition-all duration-300 hover-scale">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center neon-glow">
                <Icon name="Rocket" size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold">Авторская адаптация</h3>
              <Badge className="bg-secondary/20 text-secondary">Готов работать с 1 дня</Badge>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Помогаем внедрить KPI и систему адаптации для максимальной эффективности нового сотрудника
              </p>
            </Card>
          </div>

          <div className="flex justify-center gap-12 mt-16">
            <div className="text-center">
              <div className="text-5xl font-bold neon-text mb-2">90%</div>
              <p className="text-muted-foreground">точность подбора</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold neon-text mb-2">24ч</div>
              <p className="text-muted-foreground">время поиска</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold neon-text mb-2">500+</div>
              <p className="text-muted-foreground">успешных наймов</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button size="lg" onClick={() => scrollToSection('cta')} className="neon-glow bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg px-8">
              Начать подбор сейчас
            </Button>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 px-4 bg-muted/10">
        <div className="container mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold neon-text">Процесс подбора</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Прозрачный процесс из 6 этапов с четкими сроками и ответственными
            </p>
            <Badge className="text-lg px-6 py-2">Общий срок: 1-14 дней в среднем</Badge>
          </div>

          <div className="max-w-5xl mx-auto space-y-6">
            {[
              {
                num: 1,
                days: '1-2 дня',
                title: 'Анализ требований',
                desc: 'Детальное изучение вашей вакансии и определение идеального профиля кандидата'
              },
              {
                num: 2,
                days: '3-5 дней',
                title: 'Поиск кандидатов',
                desc: 'Активный поиск специалистов по всем доступным каналам с использованием AI'
              },
              {
                num: 3,
                days: '2-3 дня',
                title: 'Первичный отбор',
                desc: 'AI-анализ резюме и автоматический скрининг по ключевым параметрам'
              },
              {
                num: 4,
                days: '4-7 дней',
                title: 'Глубинные интервью',
                desc: 'Проведение структурированных интервью и оценка компетенций'
              },
              {
                num: 5,
                days: '2-3 дня',
                title: 'Проверка данных',
                desc: 'Верификация информации и проверка рекомендаций'
              },
              {
                num: 6,
                days: '1-2 дня',
                title: 'Финализация и оффер',
                desc: 'Подготовка предложения и сопровождение выхода на работу'
              }
            ].map((step) => (
              <div key={step.num} className="flex gap-6 items-start group">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex flex-col items-center justify-center neon-glow text-white">
                    <div className="text-2xl font-bold">{step.num}</div>
                    <div className="text-[10px] opacity-80">{step.days}</div>
                  </div>
                </div>
                <Card className="glass p-6 flex-1 hover:neon-glow transition-all duration-300">
                  <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                </Card>
              </div>
            ))}
          </div>

          <div className="mt-16 glass rounded-3xl p-8">
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">6 этапов</div>
                <p className="text-sm text-muted-foreground">Структурированный процесс</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary mb-2">1-14 дней</div>
                <p className="text-sm text-muted-foreground">В среднем</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent mb-2">3+ специалистов</div>
                <p className="text-sm text-muted-foreground">Команда на проекте</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">AI-ускорение</div>
                <p className="text-sm text-muted-foreground">Процесса</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold neon-text">Прозрачные пакеты</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Без скрытых платежей и процентов от зарплаты. Фиксированная стоимость за результат
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <Card className="glass p-8 space-y-6 hover:neon-glow transition-all duration-300">
              <div>
                <h3 className="text-2xl font-bold mb-2">Экономный</h3>
                <p className="text-sm text-muted-foreground">Для тех, кто ценит надежность</p>
              </div>
              <div className="text-5xl font-bold neon-text">35 000 ₽</div>
              <div className="space-y-3">
                <Badge className="bg-primary/20 text-primary">⚡ до 14 дней</Badge>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-primary mt-1 flex-shrink-0" />
                    <span>Срок проведения интервью до 14 дней</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-primary mt-1 flex-shrink-0" />
                    <span>Гарантия замены кандидата — 2 недели</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-primary mt-1 flex-shrink-0" />
                    <span>Телефонное интервью</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-primary mt-1 flex-shrink-0" />
                    <span>Базовая проверка навыков</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-primary mt-1 flex-shrink-0" />
                    <span>Финансовая гарантия по срокам (-10% за день просрочки)</span>
                  </li>
                </ul>
              </div>
              <Button className="w-full neon-glow bg-primary hover:bg-primary/90" onClick={() => scrollToSection('cta')}>
                Получить кандидата завтра
              </Button>
            </Card>

            <Card className="glass p-8 space-y-6 border-2 border-primary relative overflow-hidden">
              <Badge className="absolute top-4 right-4 bg-primary text-white">⭐ Популярный</Badge>
              <div>
                <h3 className="text-2xl font-bold mb-2">Оптимальный</h3>
                <p className="text-sm text-muted-foreground">Самый выбираемый пакет</p>
              </div>
              <div className="text-5xl font-bold neon-text">75 000 ₽</div>
              <div className="space-y-3">
                <Badge className="bg-secondary/20 text-secondary">⚡ до 5 дней</Badge>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-secondary mt-1 flex-shrink-0" />
                    <span>Срок проведения интервью до 5 дней</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-secondary mt-1 flex-shrink-0" />
                    <span>Гарантия замены — 2 месяца</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-secondary mt-1 flex-shrink-0" />
                    <span>Ролевые игры + видеозаписи</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-secondary mt-1 flex-shrink-0" />
                    <span>ИИ-анализ интервью без предвзятости</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-secondary mt-1 flex-shrink-0" />
                    <span>Транскрипция и объективная оценка</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-secondary mt-1 flex-shrink-0" />
                    <span>Файл с анализом в реальном времени</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-secondary mt-1 flex-shrink-0" />
                    <span>Финансовая гарантия по срокам</span>
                  </li>
                </ul>
              </div>
              <Button className="w-full neon-glow bg-gradient-to-r from-primary to-secondary hover:opacity-90" onClick={() => scrollToSection('cta')}>
                Получить кандидата завтра
              </Button>
            </Card>

            <Card className="glass p-8 space-y-6 border-2 border-accent relative overflow-hidden">
              <Badge className="absolute top-4 right-4 bg-accent text-white">👑 Премиум</Badge>
              <div>
                <h3 className="text-2xl font-bold mb-2">Еще вчера</h3>
                <p className="text-sm text-muted-foreground">Максимальная скорость и защита</p>
              </div>
              <div className="text-5xl font-bold neon-text">110 000 ₽</div>
              <div className="space-y-3">
                <Badge className="bg-accent/20 text-accent">⚡ 1 день</Badge>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-accent mt-1 flex-shrink-0" />
                    <span>Видеоинтервью на следующий день после договора</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-accent mt-1 flex-shrink-0" />
                    <span className="font-bold">БЕССРОЧНАЯ гарантия замены (даже через 2 года!)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-accent mt-1 flex-shrink-0" />
                    <span>ИИ-анализ живого собеседования</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-accent mt-1 flex-shrink-0" />
                    <span>Дополнительное интервью с ИИ</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-accent mt-1 flex-shrink-0" />
                    <span>Проверка хард-скилов через ИИ по вашему профилю</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-accent mt-1 flex-shrink-0" />
                    <span>Авторская система адаптации и KPI</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-accent mt-1 flex-shrink-0" />
                    <span>Приоритетный подбор</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-accent mt-1 flex-shrink-0" />
                    <span>Личный HR-менеджер</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-accent mt-1 flex-shrink-0" />
                    <span>Еженедельная аналитика и отчеты</span>
                  </li>
                </ul>
              </div>
              <Button className="w-full neon-glow bg-accent hover:bg-accent/90" onClick={() => scrollToSection('cta')}>
                Получить кандидата завтра
              </Button>
            </Card>
          </div>

          <div className="text-center mt-12 text-sm text-muted-foreground">
            💰 Финансовые гарантии: -10% за каждый день просрочки • При задержке на 7 дней — вторая часть бесплатно
          </div>
        </div>
      </section>

      <section id="cases" className="py-20 px-4 bg-muted/10">
        <div className="container mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold neon-text">Истории успеха</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Реальные кейсы и галерея проектов
            </p>
            <p className="text-lg text-muted-foreground">
              Как мы помогли компаниям найти идеальных специалистов за 24 часа
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {[
              {
                icon: '🚀',
                level: 'Senior',
                company: 'ТехноСфера',
                category: 'IT',
                position: 'Senior Full-Stack Developer',
                time: '18 часов',
                candidates: '47',
                satisfaction: '98%',
                results: ['Запуск нового продукта в срок', 'Оптимизация кода на 40%', 'Повышение производительности системы']
              },
              {
                icon: '📦',
                level: 'Lead',
                company: 'TradeMax',
                category: 'Маркетплейсы',
                position: 'Head of Marketplace',
                time: '22 часа',
                candidates: '35',
                satisfaction: '95%',
                results: ['Рост продаж на 240%', 'Запуск новых категорий товаров', 'Оптимизация рекламного бюджета']
              },
              {
                icon: '💼',
                level: 'Middle',
                company: 'SalesBoost',
                category: 'Продажи',
                position: 'Sales Manager B2B',
                time: '20 часов',
                candidates: '52',
                satisfaction: '97%',
                results: ['Закрыл первую сделку через 2 дня', 'План продаж выполнен на 180%', '15 новых корпоративных клиентов']
              },
              {
                icon: '⚙️',
                level: 'Middle',
                company: 'CloudMatrix',
                category: 'IT',
                position: 'DevOps Engineer',
                time: '16 часов',
                candidates: '38',
                satisfaction: '96%',
                results: ['Автоматизация CI/CD процессов', 'Сокращение времени деплоя на 60%', 'Стабилизация инфраструктуры']
              },
              {
                icon: '🛒',
                level: 'Middle',
                company: 'SellPoint',
                category: 'Маркетплейсы',
                position: 'Менеджер по работе с категориями',
                time: '19 часов',
                candidates: '31',
                satisfaction: '97%',
                results: ['Увеличение ассортимента на 150%', 'Рост конверсии на 85%', 'Привлечение 50+ новых поставщиков']
              },
              {
                icon: '🎯',
                level: 'Senior',
                company: 'InsurancePro',
                category: 'Продажи',
                position: 'Key Account Manager',
                time: '19 часов',
                candidates: '44',
                satisfaction: '98%',
                results: ['Удержание ключевых клиентов 100%', 'Upsell на 2.5 млн руб', 'Расширение контрактов с топ-10 клиентами']
              }
            ].map((caseItem, idx) => (
              <Card key={idx} className="glass p-6 space-y-4 hover:neon-glow transition-all duration-300 hover-scale">
                <div className="flex items-start justify-between">
                  <div className="text-4xl">{caseItem.icon}</div>
                  <Badge className="bg-primary/20 text-primary">{caseItem.level}</Badge>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">{caseItem.company}</h3>
                  <p className="text-sm text-muted-foreground">{caseItem.category}</p>
                </div>
                <p className="font-semibold">{caseItem.position}</p>
                <div className="grid grid-cols-3 gap-4 py-4 border-y border-border/50">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{caseItem.time}</div>
                    <div className="text-xs text-muted-foreground">Время найма</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary">{caseItem.candidates}</div>
                    <div className="text-xs text-muted-foreground">Кандидатов</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">{caseItem.satisfaction}</div>
                    <div className="text-xs text-muted-foreground">Довольны</div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-2">Результаты:</p>
                  <ul className="space-y-1">
                    {caseItem.results.map((result, ridx) => (
                      <li key={ridx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="live-search" className="py-20 px-4 bg-muted/10">
        <div className="container mx-auto">
          <div className="text-center mb-16 space-y-4">
            <Badge className="text-lg px-6 py-2 neon-glow animate-pulse">🔴 Live поиск</Badge>
            <h2 className="text-4xl md:text-5xl font-bold neon-text">Вакансии закрываются прямо сейчас</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Смотрите, как наша система находит кандидатов в режиме реального времени
            </p>
          </div>

          <div className="glass rounded-3xl p-8 mb-12 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 text-center">
              <div className="space-y-2">
                <div className="text-5xl font-bold neon-text animate-fade-in">{stats.totalClosed}</div>
                <p className="text-muted-foreground">Вакансий закрыто всего</p>
              </div>
              <div className="space-y-2">
                <div className="text-5xl font-bold text-secondary animate-fade-in">{stats.inProgress}</div>
                <p className="text-muted-foreground">В работе сейчас</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {liveVacancies.map((vacancy, idx) => (
              <Card key={idx} className="glass p-6 space-y-4 hover:neon-glow transition-all duration-300 animate-fade-in">
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-lg flex-1">{vacancy.title}</h3>
                  {vacancy.status === 'found' && <Badge className="bg-primary/20 text-primary">Кандидаты найдены</Badge>}
                  {vacancy.status === 'searching' && <Badge className="bg-secondary/20 text-secondary animate-pulse">Поиск кандидатов</Badge>}
                  {vacancy.status === 'closed' && <Badge className="bg-accent/20 text-accent">Закрыта</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">{vacancy.company}</p>
                
                {vacancy.status === 'found' && (
                  <div className="grid grid-cols-3 gap-2 text-center py-3 border-y border-border/50">
                    <div>
                      <div className="text-2xl font-bold text-primary">{vacancy.candidates}</div>
                      <div className="text-xs text-muted-foreground">Кандидатов</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-secondary">{vacancy.deadline}</div>
                      <div className="text-xs text-muted-foreground">До дедлайна</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-accent">{vacancy.match}%</div>
                      <div className="text-xs text-muted-foreground">Совпадение</div>
                    </div>
                  </div>
                )}
                
                {vacancy.status === 'searching' && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon name="Search" size={16} className="text-secondary animate-pulse" />
                    <span>{vacancy.candidates} кандидатов в анализе...</span>
                  </div>
                )}
                
                {vacancy.status === 'closed' && (
                  <div className="flex items-center gap-2 text-sm text-accent">
                    <Icon name="CheckCircle2" size={16} />
                    <span>Сотрудник вышел на работу</span>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold neon-text">Что говорят клиенты</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Реальные отзывы руководителей, которые уже нашли своих сотрудников
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {testimonials.map((testimonial, idx) => (
              <Card key={idx} className="glass p-6 space-y-4 hover:neon-glow transition-all duration-300 hover-scale">
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Icon key={i} name="Star" size={16} className="text-accent fill-accent" />
                  ))}
                </div>
                
                <p className="text-muted-foreground leading-relaxed italic">
                  "{testimonial.text}"
                </p>
                
                <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                  <Avatar className="w-12 h-12 border-2 border-primary/50">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-bold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-bold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.position}</div>
                    <div className="text-xs text-muted-foreground opacity-70">{testimonial.company}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="cta" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="glass rounded-3xl p-12 neon-glow max-w-2xl mx-auto">
            <div className="text-center space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold neon-text">
                Получите идеального кандидата завтра!
              </h2>
              <p className="text-xl text-muted-foreground">
                Оставьте заявку сейчас — получите результат через 24 часа
              </p>

              <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto pt-6">
                <div>
                  <Input 
                    placeholder="Ваше имя *"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="glass border-primary/30 h-14 text-lg"
                  />
                </div>

                <div>
                  <Input 
                    placeholder="Номер телефона *"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                    className="glass border-primary/30 h-14 text-lg"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full neon-glow bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-xl py-8">
                  Найти сотрудника
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 px-4 border-t border-border/50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
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
                <p className="flex items-center gap-2">
                  <Icon name="Phone" size={16} className="text-primary" />
                  <a href="tel:+79955556231" className="hover:text-primary transition-colors">+7 (995) 555-62-31</a>
                </p>
                <p className="flex items-center gap-2">
                  <Icon name="MessageCircle" size={16} className="text-secondary" />
                  <a href="https://t.me/your_telegram" className="hover:text-secondary transition-colors">Telegram</a>
                </p>
                <p className="flex items-center gap-2">
                  <Icon name="Mail" size={16} className="text-accent" />
                  <a href="mailto:info@1dayhr.ru" className="hover:text-accent transition-colors">info@1dayhr.ru</a>
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold">Навигация</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <button onClick={() => scrollToSection('benefits')} className="text-left hover:text-primary transition-colors">Преимущества</button>
                <button onClick={() => scrollToSection('how-it-works')} className="text-left hover:text-primary transition-colors">Как работает</button>
                <button onClick={() => scrollToSection('pricing')} className="text-left hover:text-primary transition-colors">Тарифы</button>
                <button onClick={() => scrollToSection('cases')} className="text-left hover:text-primary transition-colors">Кейсы</button>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-12 pt-8 border-t border-border/50">
            <div className="text-sm text-muted-foreground">
              © 2024 1 DAY HR. Все права защищены.
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Политика конфиденциальности</a>
              <a href="#" className="hover:text-primary transition-colors">Обработка персональных данных</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;