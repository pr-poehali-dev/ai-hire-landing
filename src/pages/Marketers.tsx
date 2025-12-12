import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import SpecializationOfferModal from '@/components/landing/SpecializationOfferModal';

const Marketers = () => {
  const { toast } = useToast();
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
      
      toast({ title: 'Заявка отправлена! 🎨', description: 'Маркетинговый эксперт свяжется с вами в течение 1 часа' });
      setFormData({ name: '', phone: '' });
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-pink-900/20 to-gray-900">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-pink-500/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 flex items-center justify-center">
              <Icon name="megaphone" className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
              1 DAY HR
            </span>
          </Link>
          <div className="flex gap-2">
            <Link to="/">
              <Button variant="outline" size="sm" className="hidden md:inline-flex hover:bg-pink-600/20">
                На главную
              </Button>
              <Button variant="outline" size="icon" className="md:hidden">
                <Icon name="home" className="w-4 h-4" />
              </Button>
            </Link>
            <Button onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })} size="sm" className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-xs md:text-sm">
              <span className="hidden md:inline">Найти маркетолога</span>
              <span className="md:hidden">Заявка</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(236,72,153,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(244,63,94,0.15),transparent_50%)]" />
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center max-w-5xl mx-auto mb-16">
            <Badge className="mb-4 md:mb-6 bg-gradient-to-r from-pink-600 to-rose-600 border-0 text-white px-4 py-1.5 md:px-6 md:py-2 text-sm md:text-lg">
              🚀 МАРКЕТИНГ-ЭЛИТА
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-black mb-6 md:mb-8 leading-tight">
              <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-pink-400 bg-clip-text text-transparent">
                Маркетологи
              </span>
              <br />
              <span className="text-white">
                которые приводят клиентов с x5 ROI
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-2xl lg:text-3xl text-gray-300 mb-8 md:mb-12 leading-relaxed">
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
          </div>
        </div>
      </section>

      {/* Marketing Expertise */}
      <section className="relative py-12 md:py-20 px-4 bg-gradient-to-b from-pink-900/10 to-transparent">
        <div className="container mx-auto max-w-7xl">
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
        <div className="container mx-auto max-w-7xl">
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
        <div className="container mx-auto max-w-7xl">
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
        <div className="container mx-auto max-w-3xl">
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
    </div>
  );
};

export default Marketers;