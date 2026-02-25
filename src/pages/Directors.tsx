import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import SpecializationOfferModal from '@/components/landing/SpecializationOfferModal';
import { sendMetrikaGoal, metrikaGoals } from '@/utils/metrika';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Directors = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  useEffect(() => {
    const hasSeenOffer = sessionStorage.getItem('directorsOfferSeen');
    if (!hasSeenOffer) {
      const timer = setTimeout(() => {
        setIsOfferModalOpen(true);
        sessionStorage.setItem('directorsOfferSeen', 'true');
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    sendMetrikaGoal(metrikaGoals.FORM_SUBMIT, { form_type: 'directors_contact', page: 'directors' });
    
    try {
      const leadData = {
        name: formData.name,
        phone: formData.phone,
        source: 'directors_contact_form',
        form_type: 'specialization_page',
        page: 'directors',
        vacancy: 'Директор',
        timestamp: new Date().toLocaleString('ru-RU')
      };

      const response = await fetch('https://functions.poehali.dev/6389194d-86d0-46d4-bc95-83e9f660f267', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      });
      
      if (!response.ok) throw new Error('Failed to submit');
      
      fetch('https://functions.poehali.dev/a7d1db0c-db9c-4d2f-b64e-42c388aed5d5', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      }).catch(err => console.error('Telegram notification failed:', err));

      sendMetrikaGoal(metrikaGoals.LEAD_CREATED, { source: 'directors_contact_form' });
      
      setFormData({ name: '', phone: '' });
      navigate('/thank-you');
    } catch (error) {
      toast({ 
        title: 'Ошибка отправки', 
        description: 'Попробуйте еще раз',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900/20 to-gray-900 overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass animate-fade-in">
        <div className="container mx-auto px-3 md:px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-1.5 md:gap-2 hover-scale">
              <div className="text-2xl md:text-3xl font-black tracking-tight">
                <span className="text-5xl md:text-6xl font-black bg-gradient-to-br from-primary via-secondary to-secondary bg-clip-text text-transparent neon-text" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '-0.05em' }}>1D</span>
                <span className="text-lg md:text-xl font-light text-muted-foreground mx-1">AY</span>
                <span className="text-2xl md:text-3xl font-black bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent neon-text">HR</span>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <DropdownMenu>
                <DropdownMenuTrigger className="text-sm hover:text-primary transition-all hover:scale-110 flex items-center gap-1">
                  Специализации <Icon name="chevron-down" className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="glass border-primary/20">
                  <DropdownMenuItem asChild><Link to="/sales-managers" className="flex items-center gap-2"><Icon name="trending-up" className="w-4 h-4" />Менеджеры по продажам</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/it-specialists" className="flex items-center gap-2"><Icon name="code" className="w-4 h-4" />IT-специалисты</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/marketplace-managers" className="flex items-center gap-2"><Icon name="shopping-cart" className="w-4 h-4" />Менеджеры по маркетплейсам</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/accountants" className="flex items-center gap-2"><Icon name="calculator" className="w-4 h-4" />Бухгалтеры</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/marketers" className="flex items-center gap-2"><Icon name="megaphone" className="w-4 h-4" />Маркетологи</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/directors" className="flex items-center gap-2"><Icon name="crown" className="w-4 h-4" />Директора и топ-менеджеры</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/retail-sales" className="flex items-center gap-2"><Icon name="shopping-bag" className="w-4 h-4" />Продавцы-консультанты</Link></DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Link to="/diagnostic-session" className="text-sm hover:text-primary transition-all hover:scale-110 flex items-center gap-1"><Icon name="brain" className="w-4 h-4" />Диагностика</Link>
              <Link to="/calculator" className="text-sm hover:text-primary transition-all hover:scale-110">Калькулятор</Link>
            </nav>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="sm" className="hover:bg-primary/10">Меню</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass border-primary/20 w-56">
                  <DropdownMenuItem asChild><Link to="/" className="flex items-center gap-2"><Icon name="home" className="w-4 h-4" />На главную</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/sales-managers" className="flex items-center gap-2"><Icon name="trending-up" className="w-4 h-4" />Менеджеры по продажам</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/it-specialists" className="flex items-center gap-2"><Icon name="code" className="w-4 h-4" />IT-специалисты</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/marketplace-managers" className="flex items-center gap-2"><Icon name="shopping-cart" className="w-4 h-4" />Менеджеры по маркетплейсам</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/accountants" className="flex items-center gap-2"><Icon name="calculator" className="w-4 h-4" />Бухгалтеры</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/marketers" className="flex items-center gap-2"><Icon name="megaphone" className="w-4 h-4" />Маркетологи</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/directors" className="flex items-center gap-2"><Icon name="crown" className="w-4 h-4" />Директора и топ-менеджеры</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/retail-sales" className="flex items-center gap-2"><Icon name="shopping-bag" className="w-4 h-4" />Продавцы-консультанты</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/diagnostic-session" className="flex items-center gap-2"><Icon name="brain" className="w-4 h-4" />Бесплатная диагностика</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/calculator" className="flex items-center gap-2"><Icon name="calculator" className="w-4 h-4" />Калькулятор стоимости</Link></DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })} size="sm" className="neon-glow bg-gradient-to-r from-primary to-secondary hover:opacity-90 hover:scale-105 transition-all text-xs md:text-sm px-3 md:px-4">
                <span className="hidden sm:inline">Подобрать сотрудника</span>
                <span className="sm:hidden">Заявка</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(139,92,246,0.15),transparent_50%)]" />
        
        <div className="container mx-auto max-w-7xl relative z-10 px-4">
          <div className="text-center max-w-5xl mx-auto mb-16">
            <Badge className="mb-4 md:mb-6 bg-gradient-to-r from-indigo-600 to-violet-600 border-0 text-white px-4 py-1.5 md:px-6 md:py-2 text-sm md:text-lg">
              👑 EXECUTIVE SEARCH BOUTIQUE
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-black mb-6 md:mb-8 leading-tight break-words">
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
                Лидеры
              </span>
              <br />
              <span className="text-white">
                которые трансформируют компании
              </span>
            </h1>
            <div className="flex justify-center mb-6 md:mb-8">
              <Button
                onClick={() => window.open('https://t.me/TheDenisZ', '_blank')}
                size="lg"
                variant="outline"
                className="hover:scale-105 transition-all text-sm md:text-base"
              >
                <Icon name="MessageCircle" className="mr-2" size={20} />
                Написать в Telegram
              </Button>
            </div>
            <p className="text-base sm:text-lg md:text-2xl lg:text-3xl text-gray-300 mb-8 md:mb-12 leading-relaxed break-words">
              180+ топ-менеджеров от руководителей отделов до CEO и партнёров
              <br />
              <span className="text-indigo-400 font-bold">Конфиденциальный поиск. Только проверенные лидеры рынка</span>
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-12">
              {[
                { value: '180+', label: 'Executive назначений', icon: 'crown' },
                { value: '25+', label: 'Средний опыт, лет', icon: 'briefcase' },
                { value: '95%', label: 'Удержание после года', icon: 'shield-check' },
                { value: '7 дней', label: 'До первых кандидатов', icon: 'zap' }
              ].map((stat, i) => (
                <Card key={i} className="bg-white/5 backdrop-blur-lg border-indigo-500/30 p-3 md:p-6 hover:bg-white/10 transition-all">
                  <Icon name={stat.icon as any} className="w-6 h-6 md:w-10 md:h-10 mx-auto mb-2 md:mb-3 text-indigo-400" />
                  <div className="text-2xl md:text-4xl font-black text-transparent bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text mb-1 md:mb-2">
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm text-gray-400">{stat.label}</div>
                </Card>
              ))}
            </div>
            <div className="flex justify-center">
              <Button 
                onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-lg px-8 py-6 h-auto hover:scale-105 transition-all shadow-lg shadow-indigo-600/50"
              >
                <Icon name="Rocket" className="mr-2" size={24} />
                Подобрать сотрудника
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Executive Approach */}
      <section className="relative py-12 md:py-20 px-4 bg-gradient-to-b from-indigo-900/10 to-transparent">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-white">
              Элитный подход
            </h2>
            <p className="text-2xl text-indigo-300">Поиск лидеров, который меняет правила игры</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: 'user-search',
                title: 'Закрытая база C-Level',
                desc: 'Доступ к 2,500+ топ-менеджеров не на открытом рынке. Действующие директора из TOP-100 компаний',
                bonus: 'Пассивные кандидаты'
              },
              {
                icon: 'shield',
                title: 'Абсолютная конфиденциальность',
                desc: 'NDA на всех этапах. Анонимная презентация компании. Личные встречи в нейтральных локациях',
                bonus: 'Защита репутации'
              },
              {
                icon: 'microscope',
                title: 'Executive Assessment',
                desc: 'Психометрия, leadership-тесты, case-interview, reference check от 5+ бизнес-партнёров',
                bonus: 'SHL, Hogan, DISC профили'
              },
              {
                icon: 'target',
                title: 'Headhunting элиты',
                desc: 'Прямое переманивание лидеров из конкурирующих компаний. Работа с мотивацией и career vision',
                bonus: 'Успех в 78% случаев'
              },
              {
                icon: 'handshake',
                title: 'Onboarding 100 дней',
                desc: 'Сопровождение в первые месяцы: интеграция в команду, quick wins, построение процессов',
                bonus: 'Гарантия успешного старта'
              },
              {
                icon: 'trending-up',
                title: 'Compensation Package',
                desc: 'Помощь в структурировании пакета: salary, bonus, equity, benefits. Консультации с юристами',
                bonus: 'Market benchmarking'
              }
            ].map((item, i) => (
              <Card key={i} className="relative bg-gradient-to-br from-indigo-900/30 to-violet-900/20 backdrop-blur-xl border-indigo-500/30 p-8 hover:scale-105 transition-all overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-600/20 to-violet-600/20 rounded-full blur-3xl group-hover:scale-150 transition-transform" />
                <Icon name={item.icon as any} className="w-16 h-16 mb-6 text-indigo-400" />
                <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-gray-300 mb-4 leading-relaxed">{item.desc}</p>
                <Badge className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-amber-500/50 text-amber-300">
                  ⭐ {item.bonus}
                </Badge>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Executive Positions */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-white">
              Позиции, которые мы закрываем
            </h2>
            <p className="text-2xl text-gray-300">От руководителей отделов до партнёров</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                level: 'C-Level',
                positions: ['CEO / Генеральный директор', 'COO / Операционный директор', 'CFO / Финансовый директор', 'CMO / Директор по маркетингу'],
                icon: 'crown',
                count: '42 назначения'
              },
              {
                level: 'VP / Director',
                positions: ['Коммерческий директор', 'Директор по развитию', 'Директор по персоналу', 'Директор производства'],
                icon: 'briefcase',
                count: '86 назначений'
              },
              {
                level: 'Head of Department',
                positions: ['Руководитель отдела продаж', 'Head of IT', 'Начальник логистики', 'Head of Supply Chain'],
                icon: 'users',
                count: '52 назначения'
              },
              {
                level: 'Partners & Founders',
                positions: ['Партнёр в бизнес', 'Co-founder поиск', 'Managing Partner', 'Business Partner'],
                icon: 'handshake',
                count: '18 назначений'
              }
            ].map((category, i) => (
              <Card key={i} className="bg-gradient-to-br from-indigo-900/40 to-transparent backdrop-blur-xl border-indigo-500/30 p-8 hover:scale-105 transition-all">
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center flex-shrink-0">
                    <Icon name={category.icon as any} className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold text-white mb-2">{category.level}</h3>
                    <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
                      {category.count}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  {category.positions.map((pos, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-gray-300">
                      <Icon name="check" className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                      <span>{pos}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-transparent via-indigo-900/10 to-transparent">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-white">
              Executive Search Process
            </h2>
            <p className="text-2xl text-gray-300">Проверенная методология поиска лидеров</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: '1',
                phase: 'Discovery',
                desc: 'Глубокое погружение в бизнес, стратегию, культуру. Формирование профиля идеального лидера',
                time: '3-5 дней'
              },
              {
                step: '2',
                phase: 'Search & Approach',
                desc: 'Mapping рынка, выявление целевых компаний, прямой контакт с топ-менеджерами',
                time: '7-14 дней'
              },
              {
                step: '3',
                phase: 'Assessment',
                desc: 'Структурные интервью, психометрия, case studies, референс-чеки, due diligence',
                time: '10-15 дней'
              },
              {
                step: '4',
                phase: 'Offer & Onboarding',
                desc: 'Подготовка оффера, переговоры, плавный выход с текущего места, адаптация',
                time: '30-90 дней'
              }
            ].map((item, i) => (
              <Card key={i} className="relative bg-gradient-to-br from-indigo-900/40 to-transparent backdrop-blur-xl border-indigo-500/30 p-6 hover:scale-105 transition-all">
                <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center font-black text-2xl">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 mt-2">{item.phase}</h3>
                <p className="text-gray-300 mb-4 text-sm leading-relaxed">{item.desc}</p>
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                  ⏱ {item.time}
                </Badge>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="relative py-20 px-4">
        <div className="container mx-auto max-w-3xl px-4">
          <Card className="bg-gradient-to-br from-indigo-900/40 via-violet-900/30 to-indigo-900/40 backdrop-blur-xl border-indigo-500/30 p-12">
            <div className="text-center mb-10">
              <h2 className="text-5xl font-black text-white mb-4">
                Конфиденциальная консультация
              </h2>
              <p className="text-xl text-gray-300 mb-6">
                Оставьте заявку для обсуждения executive-поиска:
              </p>
              <div className="space-y-3 text-left max-w-xl mx-auto">
                {[
                  'Личная встреча с партнёром агентства',
                  'Анализ организационной структуры',
                  'Рекомендации по профилю кандидата',
                  'Market mapping вашей индустрии',
                  'Конфиденциальное ведение проекта',
                  'Гарантия замены на 12 месяцев',
                  'Onboarding support первые 100 дней'
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Icon name="check-circle" className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    <span className="text-gray-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                placeholder="Ваше имя *"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                className="bg-white/10 border-indigo-500/30 text-white placeholder:text-gray-400 h-12 md:h-14 text-base md:text-lg"
              />
              <Input
                placeholder="Номер телефона *"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
                className="bg-white/10 border-indigo-500/30 text-white placeholder:text-gray-400 h-12 md:h-14 text-base md:text-lg"
              />
              <Button 
                type="submit" 
                disabled={isSubmitting}
                size="lg"
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold h-12 md:h-14 text-base md:text-lg"
              >
                {isSubmitting ? 'Отправка...' : 'Запросить консультацию 👔'}
              </Button>
              <p className="text-center text-sm text-gray-400">
                Все данные конфиденциальны и защищены NDA
              </p>
            </form>
          </Card>
        </div>
      </section>

      <SpecializationOfferModal 
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        specialization="directors"
      />

      <div className="fixed bottom-20 right-4 z-[100]">
        <Button
          onClick={() => setIsOfferModalOpen(true)}
          size="sm"
          className="neon-glow bg-gradient-to-r from-primary to-secondary hover:opacity-90 hover:scale-110 transition-all shadow-2xl text-xs md:text-sm px-3 md:px-4 py-2 md:py-3 whitespace-nowrap"
        >
          <Icon name="sparkles" size={16} className="md:w-5 md:h-5 mr-1.5 md:mr-2" />
          <span>Бесплатный анализ<br className="md:hidden" /> проблемных зон</span>
        </Button>
      </div>

      {/* Mobile Phone Bar */}
      <a 
        href="tel:+79955556231" 
        className="md:hidden fixed bottom-0 left-0 right-0 z-[101] bg-gradient-to-r from-blue-600 to-cyan-600 py-4 px-4 flex items-center justify-center gap-3 hover:opacity-90 transition-opacity shadow-[0_-4px_20px_rgba(59,130,246,0.5)]"
      >
        <Icon name="phone" className="w-6 h-6 text-white animate-pulse" />
        <span className="text-2xl font-black text-white tracking-wide">
          +7 (995) 555-62-31
        </span>
      </a>
    </div>
  );
};

export default Directors;