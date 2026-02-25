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

const Marketers = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  useEffect(() => {
    const hasSeenOffer = sessionStorage.getItem('marketersOfferSeen');
    if (!hasSeenOffer) {
      const timer = setTimeout(() => {
        setIsOfferModalOpen(true);
        sessionStorage.setItem('marketersOfferSeen', 'true');
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    sendMetrikaGoal(metrikaGoals.FORM_SUBMIT, { form_type: 'marketers_contact', page: 'marketers' });
    
    try {
      const leadData = {
        name: formData.name,
        phone: formData.phone,
        source: 'marketers_contact_form',
        form_type: 'specialization_page',
        page: 'marketers',
        vacancy: 'Маркетолог',
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

      sendMetrikaGoal(metrikaGoals.LEAD_CREATED, { source: 'marketers_contact_form' });
      
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-pink-900/20 to-gray-900 overflow-x-hidden">
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
              <Link to="/">
                <Button variant="outline" size="sm" className="border-primary/40 hover:bg-primary/10 hover:border-primary text-xs md:text-sm">
                  <Icon name="home" className="w-4 h-4 mr-1.5" />
                  На главную
                </Button>
              </Link>
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(236,72,153,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(244,63,94,0.15),transparent_50%)]" />
        
        <div className="container mx-auto max-w-7xl relative z-10 px-4">
          <div className="text-center max-w-5xl mx-auto mb-16">
            <Badge className="mb-4 md:mb-6 bg-gradient-to-r from-pink-600 to-rose-600 border-0 text-white px-4 py-1.5 md:px-6 md:py-2 text-sm md:text-lg">
              🚀 МАРКЕТИНГ-ЭЛИТА
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-black mb-6 md:mb-8 leading-tight break-words">
              <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-pink-400 bg-clip-text text-transparent">
                Маркетологи
              </span>
              <br />
              <span className="text-white">
                которые приводят клиентов с x5 ROI
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
              620+ маркетологов трудоустроено от SMM до CMO
              <br />
              <span className="text-pink-400 font-bold">Средний ROMI 480% в первые 6 месяцев</span>
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-12">
              {[
                { value: '620+', label: 'Маркетологов нанято', icon: 'users' },
                { value: '480%', label: 'Средний ROMI', icon: 'trending-up' },
                { value: '8.2/10', label: 'Средняя экспертность', icon: 'star' },
                { value: '36ч', label: 'До кандидатов', icon: 'zap' }
              ].map((stat, i) => (
                <Card key={i} className="bg-white/5 backdrop-blur-lg border-pink-500/30 p-3 md:p-6 hover:bg-white/10 transition-all">
                  <Icon name={stat.icon as any} className="w-6 h-6 md:w-10 md:h-10 mx-auto mb-2 md:mb-3 text-pink-400" />
                  <div className="text-2xl md:text-4xl font-black text-transparent bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text mb-1 md:mb-2">
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
                className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-lg px-8 py-6 h-auto hover:scale-105 transition-all shadow-lg shadow-pink-600/50"
              >
                <Icon name="Rocket" className="mr-2" size={24} />
                Подобрать сотрудника
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Marketing Expertise */}
      <section className="relative py-12 md:py-20 px-4 bg-gradient-to-b from-pink-900/10 to-transparent">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-white">
              Полный маркетинг-стек
            </h2>
            <p className="text-2xl text-pink-300">От стратегии до execution</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: 'target',
                title: 'Performance Marketing',
                desc: 'Таргет, контекст, programmatic. Настройка воронок с CPL от 100₽. Ретаргетинг и look-alike',
                bonus: 'ROI 300%+ гарантировано'
              },
              {
                icon: 'trending-up',
                title: 'Growth Hacking',
                desc: 'Вирусные механики, реферальные программы, product-led growth. Тестируют 50+ гипотез/месяц',
                bonus: 'Organic рост на 200%'
              },
              {
                icon: 'layout',
                title: 'Контент-маркетинг',
                desc: 'Контент-планы, SEO-тексты, инфографика, видео. Редактура, UGC, сторителлинг',
                bonus: 'ТОП-10 Яндекс за 3 месяца'
              },
              {
                icon: 'mail',
                title: 'Email & CRM',
                desc: 'Триггерные цепочки, сегментация, персонализация. Работа с Unisender, Sendsay, SendPulse',
                bonus: 'Open Rate 45%+'
              },
              {
                icon: 'message-circle',
                title: 'SMM & Community',
                desc: 'Ведение соцсетей, комьюнити-менеджмент, инфлюенс-маркетинг. TikTok, Reels, YouTube',
                bonus: 'Engagement 8%+'
              },
              {
                icon: 'bar-chart',
                title: 'Аналитика & BI',
                desc: 'Google Analytics, Яндекс Метрика, сквозная аналитика, дашборды. Data-driven решения',
                bonus: 'Прозрачность каждого рубля'
              }
            ].map((item, i) => (
              <Card key={i} className="relative bg-gradient-to-br from-pink-900/30 to-rose-900/20 backdrop-blur-xl border-pink-500/30 p-8 hover:scale-105 transition-all overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-600/20 to-rose-600/20 rounded-full blur-3xl group-hover:scale-150 transition-transform" />
                <Icon name={item.icon as any} className="w-16 h-16 mb-6 text-pink-400" />
                <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-gray-300 mb-4 leading-relaxed">{item.desc}</p>
                <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/50 text-green-300">
                  💎 {item.bonus}
                </Badge>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Marketing Roles */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-white">
              Все маркетинговые роли
            </h2>
            <p className="text-2xl text-gray-300">От специалистов до директоров</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { role: 'Performance', channels: 'Яндекс, Google, VK, mytarget', icon: 'activity', count: '240+' },
              { role: 'SMM-менеджер', channels: 'VK, Telegram, YouTube, TikTok', icon: 'smartphone', count: '180+' },
              { role: 'SEO-специалист', channels: 'Техническое + ссылочное SEO', icon: 'search', count: '95+' },
              { role: 'Контент-маркетолог', channels: 'Блоги, YouTube, подкасты', icon: 'file-text', count: '78+' },
              { role: 'Email-маркетолог', channels: 'Триггеры, автоворонки, A/B', icon: 'mail', count: '62+' },
              { role: 'Brand-менеджер', channels: 'Позиционирование, айдентика', icon: 'award', count: '48+' },
              { role: 'Product Marketing', channels: 'GTM, продуктовый маркетинг', icon: 'box', count: '38+' },
              { role: 'CMO / Head of', channels: 'Стратегия, команда, бюджет', icon: 'crown', count: '24+' }
            ].map((pos, i) => (
              <Card key={i} className="bg-white/5 backdrop-blur-lg border-pink-500/20 p-6 hover:bg-white/10 transition-all">
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-600 to-rose-600 flex items-center justify-center">
                    <Icon name={pos.icon as any} className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{pos.role}</h3>
                    <p className="text-sm text-gray-400 mb-3">{pos.channels}</p>
                    <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30">
                      {pos.count} специалистов
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Cases */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-transparent via-pink-900/10 to-transparent">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-white">
              Кейсы роста
            </h2>
            <p className="text-2xl text-gray-300">Реальные результаты наших маркетологов</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                niche: 'SaaS B2B',
                metric: 'CAC',
                before: '12,000₽',
                after: '4,200₽',
                period: '4 месяца',
                method: 'Контент-маркетинг + SEO'
              },
              {
                niche: 'E-commerce',
                metric: 'ROAS',
                before: '180%',
                after: '520%',
                period: '3 месяца',
                method: 'Performance + email-цепочки'
              },
              {
                niche: 'Edtech',
                metric: 'Конверсия',
                before: '1.2%',
                after: '5.8%',
                period: '2 месяца',
                method: 'CRO + landing-оптимизация'
              }
            ].map((caseItem, i) => (
              <Card key={i} className="bg-gradient-to-br from-pink-900/40 to-transparent backdrop-blur-xl border-pink-500/30 p-8 hover:scale-105 transition-all">
                <Badge className="mb-4 bg-pink-500/20 text-pink-300 border-pink-500/30">
                  {caseItem.niche}
                </Badge>
                <h3 className="text-2xl font-bold text-white mb-6">{caseItem.metric}</h3>
                <div className="space-y-4 mb-6">
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Было</div>
                    <div className="text-2xl font-bold text-red-400">{caseItem.before}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Icon name="arrow-down" className="w-6 h-6 text-pink-400" />
                    <div className="text-gray-400">За {caseItem.period}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Стало</div>
                    <div className="text-2xl font-bold text-green-400">{caseItem.after}</div>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">
                  <span className="font-semibold">Метод:</span> {caseItem.method}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="relative py-20 px-4">
        <div className="container mx-auto max-w-3xl px-4">
          <Card className="bg-gradient-to-br from-pink-900/40 via-rose-900/30 to-pink-900/40 backdrop-blur-xl border-pink-500/30 p-12">
            <div className="text-center mb-10">
              <h2 className="text-5xl font-black text-white mb-4">
                Маркетолог мечты за 36 часов
              </h2>
              <p className="text-xl text-gray-300 mb-6">
                Оставьте заявку и получите:
              </p>
              <div className="space-y-3 text-left max-w-xl mx-auto">
                {[
                  '3-5 маркетологов с опытом в вашей нише',
                  'Портфолио с кейсами и метриками роста',
                  'Результаты тестового задания',
                  'План маркетинговой стратегии на 90 дней',
                  'Аудит текущих кампаний в подарок',
                  'Гарантию замены на 6 месяцев'
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
                className="bg-white/10 border-pink-500/30 text-white placeholder:text-gray-400 h-12 md:h-14 text-base md:text-lg"
              />
              <Input
                placeholder="Номер телефона *"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
                className="bg-white/10 border-pink-500/30 text-white placeholder:text-gray-400 h-12 md:h-14 text-base md:text-lg"
              />
              <Button 
                type="submit" 
                disabled={isSubmitting}
                size="lg"
                className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold h-12 md:h-14 text-base md:text-lg"
              >
                {isSubmitting ? 'Отправка...' : 'Получить маркетологов 🎨'}
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
        specialization="marketers"
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

export default Marketers;