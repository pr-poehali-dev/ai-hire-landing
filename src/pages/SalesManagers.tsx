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

const SalesManagers = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  useEffect(() => {
    const hasSeenOffer = sessionStorage.getItem('salesOfferSeen');
    if (!hasSeenOffer) {
      const timer = setTimeout(() => {
        setIsOfferModalOpen(true);
        sessionStorage.setItem('salesOfferSeen', 'true');
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    sendMetrikaGoal(metrikaGoals.FORM_SUBMIT, { form_type: 'sales_managers_contact' });
    
    try {
      const leadData = {
        name: formData.name,
        phone: formData.phone,
        source: 'sales_managers_contact_form',
        form_type: 'specialization_page',
        page: 'sales_managers',
        vacancy: 'Менеджер по продажам',
        timestamp: new Date().toLocaleString('ru-RU')
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

      sendMetrikaGoal(metrikaGoals.LEAD_CREATED, { source: 'sales_managers_contact_form' });
      
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass animate-fade-in">
        <div className="container mx-auto px-3 md:px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-1.5 md:gap-2 hover-scale">
              <div className="font-black tracking-tight">
                <span className="text-2xl md:text-6xl font-black bg-gradient-to-br from-primary via-secondary to-secondary bg-clip-text text-transparent neon-text" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '-0.05em' }}>1D</span>
                <span className="text-sm md:text-xl font-light text-muted-foreground mx-0.5 md:mx-1">AY</span>
                <span className="text-xl md:text-3xl font-black bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent neon-text">HR</span>
              </div>
            </Link>

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
              <Link to="/diagnostic-session" className="text-sm hover:text-primary transition-all hover:scale-110 flex items-center gap-1">
                <Icon name="brain" className="w-4 h-4" />
                Диагностика
              </Link>
              <Link to="/calculator" className="text-sm hover:text-primary transition-all hover:scale-110">
                Калькулятор
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                    Меню
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass border-primary/20 w-56">
                  <DropdownMenuItem asChild>
                    <Link to="/" className="flex items-center gap-2">
                      <Icon name="home" className="w-4 h-4" />
                      На главную
                    </Link>
                  </DropdownMenuItem>
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
              <Link to="/">
                <Button variant="outline" size="sm" className="border-primary/40 hover:bg-primary/10 hover:border-primary text-xs md:text-sm">
                  <Icon name="home" className="w-4 h-4 mr-1.5" />
                  На главную
                </Button>
              </Link>
              <Button
                onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                size="sm"
                className="neon-glow bg-gradient-to-r from-primary to-secondary hover:opacity-90 hover:scale-105 transition-all text-xs md:text-sm px-3 md:px-4"
              >
                <span className="hidden sm:inline">Подобрать сотрудника</span>
                <span className="sm:hidden">Заявка</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(236,72,153,0.15),transparent_50%)]" />
        
        <div className="container mx-auto max-w-7xl relative z-10 px-4">
          <div className="text-center max-w-5xl mx-auto mb-16">
            <Badge className="mb-4 md:mb-6 bg-gradient-to-r from-purple-600 to-pink-600 border-0 text-white px-4 py-1.5 md:px-6 md:py-2 text-sm md:text-lg">
              🏆 #1 В ПОДБОРЕ МЕНЕДЖЕРОВ ПО ПРОДАЖАМ
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-black mb-6 md:mb-8 leading-tight break-words">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Найдём менеджера
              </span>
              <br />
              <span className="text-white">
                который закроет план
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
              1200+ закрытых вакансий в B2B и B2C продажах
              <br />
              <span className="text-purple-400 font-bold">Гарантируем результат за 24 часа</span>
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-12">
              {[
                { value: '847', label: 'Менеджеров трудоустроено', icon: 'users' },
                { value: '94%', label: 'Проходят испытательный', icon: 'trophy' },
                { value: '2.4x', label: 'Средний рост продаж', icon: 'trending-up' },
                { value: '24ч', label: 'Поиск кандидатов', icon: 'clock' }
              ].map((stat, i) => (
                <Card key={i} className="bg-white/5 backdrop-blur-lg border-purple-500/30 p-3 md:p-6 hover:bg-white/10 transition-all">
                  <Icon name={stat.icon as any} className="w-6 h-6 md:w-10 md:h-10 mx-auto mb-2 md:mb-3 text-purple-400" />
                  <div className="text-2xl md:text-4xl font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-1 md:mb-2">
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
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-6 h-auto hover:scale-105 transition-all shadow-lg shadow-purple-500/50"
              >
                <Icon name="Rocket" className="mr-2" size={24} />
                Подобрать сотрудника
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Section */}
      <section className="relative w-full overflow-hidden h-48 sm:h-64 md:h-[480px]">
        <img
          src="https://cdn.poehali.dev/projects/6101e03d-94a3-4421-8a60-a2976f31574c/bucket/45f466be-8b79-4d25-a8b6-542a96c5ff9f.jpg"
          alt="Команда менеджеров по продажам"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-purple-900/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/60 via-transparent to-gray-900/60" />
        <div className="absolute bottom-4 md:bottom-10 left-0 right-0 text-center px-4">
          <p className="text-sm sm:text-base md:text-2xl font-semibold text-white/90 drop-shadow-lg">
            Лучшие менеджеры по продажам — уже в нашей базе
          </p>
        </div>
      </section>

      {/* Exclusive Benefits */}
      <section className="relative py-12 md:py-20 px-4 bg-gradient-to-b from-purple-900/10 to-transparent">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-white">
              Что вы получите
            </h2>
            <p className="text-base md:text-xl lg:text-2xl text-purple-300">Эксклюзивный пакет услуг премиум-уровня</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {[
              {
                icon: 'target',
                title: '∞ кандидатов',
                desc: 'Неограниченное количество проверенных специалистов с опытом закрытия планов — пока не найдёте своего',
                bonus: 'Без лимита на подбор'
              },
              {
                icon: 'shield-check',
                title: 'Пожизненная гарантия',
                desc: 'Бесплатная замена, если менеджер не подошёл — без ограничений по времени',
                bonus: 'Страховка на всю жизнь'
              },
              {
                icon: 'brain',
                title: 'AI-психометрика',
                desc: 'Анализ 127 параметров личности: стрессоустойчивость, мотивация, переговоры',
                bonus: 'Технология за $50,000'
              },
              {
                icon: 'briefcase',
                title: 'Досье на каждого',
                desc: 'Подробный профиль: кейсы, результаты, рекомендации, видео-интервью',
                bonus: 'Полная аналитика'
              },
              {
                icon: 'phone-call',
                title: 'Выделенный менеджер',
                desc: 'Персональный HR-эксперт на связи 24/7 для решения любых вопросов',
                bonus: 'Прямой номер и Telegram'
              },
              {
                icon: 'rocket',
                title: 'Онбординг в подарок',
                desc: 'План адаптации на 90 дней + скрипты продаж + обучающие материалы',
                bonus: 'Экономия 150,000₽'
              }
            ].map((item, i) => (
              <Card key={i} className="relative bg-gradient-to-br from-purple-900/30 to-pink-900/20 backdrop-blur-xl border-purple-500/30 p-4 md:p-8 hover:scale-105 transition-all overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full blur-3xl group-hover:scale-150 transition-transform" />
                <Icon name={item.icon as any} className="w-10 h-10 md:w-16 md:h-16 mb-3 md:mb-6 text-purple-400" />
                <h3 className="text-lg md:text-2xl font-bold text-white mb-2 md:mb-4">{item.title}</h3>
                <p className="text-sm md:text-base text-gray-300 mb-3 md:mb-4 leading-relaxed">{item.desc}</p>
                <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/50 text-green-300">
                  ✨ {item.bonus}
                </Badge>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Specializations */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-white">
              Наши специализации
            </h2>
            <p className="text-2xl text-gray-300">Эксперты в каждой нише продаж</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              { title: 'B2B продажи', desc: 'Корпоративные клиенты, холодные звонки, тендеры', icon: 'building', cases: '340+' },
              { title: 'B2C розница', desc: 'Активные продажи в салонах, магазинах, шоурумах', icon: 'shopping-bag', cases: '280+' },
              { title: 'Сложные продажи', desc: 'Цикл 3-12 месяцев, multiple decision makers', icon: 'network', cases: '156+' },
              { title: 'SaaS/IT продажи', desc: 'Подписки, онлайн-продукты, облачные решения', icon: 'cloud', cases: '198+' },
              { title: 'Недвижимость', desc: 'Коммерческая и жилая, ипотека, новостройки', icon: 'home', cases: '224+' },
              { title: 'Автобизнес', desc: 'Продажа авто, допоборудования, trade-in', icon: 'car', cases: '142+' }
            ].map((spec, i) => (
              <Card key={i} className="bg-white/5 backdrop-blur-lg border-purple-500/20 p-6 hover:bg-white/10 transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                    <Icon name={spec.icon as any} className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{spec.title}</h3>
                    <p className="text-sm text-gray-400 mb-3">{spec.desc}</p>
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                      {spec.cases} закрытых вакансий
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-white">
              Как мы работаем
            </h2>
            <p className="text-2xl text-gray-300">Прозрачный процесс за 24 часа</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', time: '2 часа', title: 'Глубокий анализ', desc: 'Изучаем продукт, воронку продаж, KPI, портрет идеального менеджера' },
              { step: '2', time: '12 часов', title: 'AI-поиск + хантинг', desc: 'Анализ 50,000+ резюме + переманивание лучших из конкурентов' },
              { step: '3', time: '6 часов', title: 'Тестирование', desc: 'Видео-интервью, тесты продаж, проверка результатов на прошлых местах' },
              { step: '4', time: '4 часа', title: 'Презентация', desc: 'Досье на 5 кандидатов с рекомендациями кого нанимать в первую очередь' }
            ].map((item, i) => (
              <Card key={i} className="relative bg-gradient-to-br from-purple-900/40 to-transparent backdrop-blur-xl border-purple-500/30 p-8 hover:scale-105 transition-all">
                <div className="absolute -top-5 -right-5 w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center font-black text-3xl">
                  {item.step}
                </div>
                <Badge className="mb-4 bg-green-500/20 text-green-300 border-green-500/30">
                  ⏱ {item.time}
                </Badge>
                <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-gray-300 leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="relative py-20 px-4">
        <div className="container mx-auto max-w-3xl px-4">
          <Card className="bg-gradient-to-br from-purple-900/40 via-pink-900/30 to-purple-900/40 backdrop-blur-xl border-purple-500/30 p-12">
            <div className="text-center mb-10">
              <h2 className="text-5xl font-black text-white mb-4">
                Получите кандидатов
              </h2>
              <p className="text-xl text-gray-300 mb-6">
                Заполните форму и получите через 24 часа:
              </p>
              <div className="space-y-3 text-left max-w-xl mx-auto">
                {[
                  'Неограниченное досье на топовых менеджеров по продажам',
                  'AI-анализ личности каждого кандидата',
                  'Видео-визитки и кейсы из практики',
                  'Рекомендации по выбору и онбординг-план',
                  'Гарантию замены на 12 месяцев'
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Icon name="check-circle" className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    <span className="text-gray-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <Input
                placeholder="Ваше имя *"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                className="bg-white/10 border-purple-500/30 text-white placeholder:text-gray-400 text-base md:text-lg h-12 md:h-14"
              />
              <Input
                placeholder="Номер телефона *"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
                className="bg-white/10 border-purple-500/30 text-white placeholder:text-gray-400 text-base md:text-lg h-12 md:h-14"
              />
              <Button 
                type="submit" 
                disabled={isSubmitting}
                size="lg"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-base md:text-xl h-12 md:h-14 font-bold"
              >
                {isSubmitting ? 'Отправка...' : 'Получить кандидатов за 24 часа 🚀'}
              </Button>
              <p className="text-center text-sm text-gray-400">
                Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
              </p>
            </form>
          </Card>
        </div>
      </section>

      <SpecializationOfferModal
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        specialization="sales"
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
        href="tel:+79115302020" 
        className="md:hidden fixed bottom-0 left-0 right-0 z-[101] bg-gradient-to-r from-blue-600 to-cyan-600 py-4 px-4 flex items-center justify-center gap-3 hover:opacity-90 transition-opacity shadow-[0_-4px_20px_rgba(59,130,246,0.5)]"
      >
        <Icon name="phone" className="w-6 h-6 text-white animate-pulse" />
        <span className="text-2xl font-black text-white tracking-wide">
          +7 (911) 530-20-20
        </span>
      </a>
    </div>
  );
};

export default SalesManagers;