import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const MarketplaceManagers = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const leadData = {
        name: formData.name,
        phone: formData.phone,
        source: 'marketplace_managers_contact_form',
        form_type: 'specialization_page',
        page: 'marketplace_managers',
        vacancy: 'Менеджер по маркетплейсам',
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
      
      toast({ title: 'Заявка отправлена! 📦', description: 'Эксперт по маркетплейсам свяжется с вами в течение 1 часа' });
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-900/20 to-gray-900">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-orange-500/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 flex items-center justify-center">
              <Icon name="shopping-cart" className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              1 DAY HR
            </span>
          </Link>
          <Button onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })} size="lg" className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700">
            Найти менеджера
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,146,60,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(245,158,11,0.15),transparent_50%)]" />
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center max-w-5xl mx-auto mb-16">
            <Badge className="mb-4 md:mb-6 bg-gradient-to-r from-orange-600 to-amber-600 border-0 text-white px-4 py-1.5 md:px-6 md:py-2 text-sm md:text-lg">
              🥇 ЛИДЕРЫ РЫНКА МАРКЕТПЛЕЙСОВ
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-black mb-6 md:mb-8 leading-tight">
              <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                Менеджеры
              </span>
              <br />
              <span className="text-white">
                которые взорвут продажи на WB и Ozon
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-2xl lg:text-3xl text-gray-300 mb-8 md:mb-12 leading-relaxed">
              480+ менеджеров трудоустроено на Wildberries, Ozon, Яндекс Маркет
              <br />
              <span className="text-orange-400 font-bold">Средний рост продаж в 3.2 раза за первые 90 дней</span>
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-12">
              {[
                { value: '480+', label: 'Менеджеров на МП', icon: 'package' },
                { value: '3.2x', label: 'Рост продаж', icon: 'trending-up' },
                { value: '96%', label: 'Знают Helium/AMS', icon: 'bar-chart' },
                { value: '36ч', label: 'До кандидатов', icon: 'clock' }
              ].map((stat, i) => (
                <Card key={i} className="bg-white/5 backdrop-blur-lg border-orange-500/30 p-3 md:p-6 hover:bg-white/10 transition-all">
                  <Icon name={stat.icon as any} className="w-6 h-6 md:w-10 md:h-10 mx-auto mb-2 md:mb-3 text-orange-400" />
                  <div className="text-2xl md:text-4xl font-black text-transparent bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text mb-1 md:mb-2">
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm text-gray-400">{stat.label}</div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Marketplace Expertise */}
      <section className="relative py-12 md:py-20 px-4 bg-gradient-to-b from-orange-900/10 to-transparent">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-white">
              Экспертиза в маркетплейсах
            </h2>
            <p className="text-2xl text-orange-300">Всё для взрывного роста продаж</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: 'trending-up',
                title: 'Кейсы с x10 ROI',
                desc: 'Каждый кандидат приносит портфолио: скрины роста продаж, выведенные из 0 SKU, спасённые бренды',
                bonus: 'Реальные цифры прироста'
              },
              {
                icon: 'star',
                title: 'Управление рейтингом',
                desc: 'Эксперты в работе с отзывами, возвратами, рейтингами. Знают как вывести товар в ТОП-10',
                bonus: 'Методики белого продвижения'
              },
              {
                icon: 'dollar-sign',
                title: 'Контроль юнит-экономики',
                desc: 'Считают маржу, логистику, комиссии МП, промо. Оптимизируют до копейки',
                bonus: 'Рост прибыли, не только оборота'
              },
              {
                icon: 'megaphone',
                title: 'Рекламные кабинеты',
                desc: 'Настройка и ведение WB Продвижение, Ozon Performance, Маркет Performance',
                bonus: 'CPO снижение на 40%+'
              },
              {
                icon: 'bar-chart-3',
                title: 'Аналитика и BI',
                desc: 'Работают с Helium, Moneyplace, MPStats. Глубокая аналитика конкурентов и ниш',
                bonus: 'Находят "голубые океаны"'
              },
              {
                icon: 'package-open',
                title: 'Запуск новых SKU',
                desc: 'От упаковки и карточек до вывода в ТОП за 30 дней. Инструкции и чек-листы',
                bonus: 'Полный цикл запуска'
              }
            ].map((item, i) => (
              <Card key={i} className="relative bg-gradient-to-br from-orange-900/30 to-amber-900/20 backdrop-blur-xl border-orange-500/30 p-8 hover:scale-105 transition-all overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-600/20 to-amber-600/20 rounded-full blur-3xl group-hover:scale-150 transition-transform" />
                <Icon name={item.icon as any} className="w-16 h-16 mb-6 text-orange-400" />
                <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-gray-300 mb-4 leading-relaxed">{item.desc}</p>
                <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/50 text-green-300">
                  🔥 {item.bonus}
                </Badge>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-white">
              Платформы, которые мы знаем
            </h2>
            <p className="text-2xl text-gray-300">Глубокая экспертиза в каждой</p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { name: 'Wildberries', icon: '🟣', specialists: '280+', features: 'Продвижение, выкупы, аналитика' },
              { name: 'Ozon', icon: '🔵', specialists: '240+', features: 'Premium, FBO/FBS, Rocket' },
              { name: 'Яндекс Маркет', icon: '🔴', specialists: '145+', features: 'DBS, FBY, FBS, рейтинги' },
              { name: 'AliExpress', icon: '🔶', specialists: '98+', features: 'Tmall, таможня, локализация' },
              { name: 'Мегамаркет', icon: '🟠', specialists: '72+', features: 'СберЛогистика, промо' }
            ].map((platform, i) => (
              <Card key={i} className="bg-white/5 backdrop-blur-lg border-orange-500/20 p-6 hover:bg-white/10 transition-all text-center">
                <div className="text-5xl mb-4">{platform.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{platform.name}</h3>
                <Badge className="mb-3 bg-orange-500/20 text-orange-300 border-orange-500/30">
                  {platform.specialists} экспертов
                </Badge>
                <p className="text-sm text-gray-400">{platform.features}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-transparent via-orange-900/10 to-transparent">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-white">
              Реальные результаты
            </h2>
            <p className="text-2xl text-gray-300">Кейсы наших менеджеров</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                category: 'Косметика WB',
                before: '1.2M руб/мес',
                after: '4.8M руб/мес',
                period: '90 дней',
                actions: 'Оптимизация карточек, запуск рекламы, работа с отзывами'
              },
              {
                category: 'Электроника Ozon',
                before: '800K руб/мес',
                after: '3.2M руб/мес',
                period: '120 дней',
                actions: 'Премиум аккаунт, cross-sell, расширение ассортимента'
              },
              {
                category: 'Одежда WB',
                before: '2.5M руб/мес',
                after: '9.1M руб/мес',
                period: '60 дней',
                actions: 'Seasonal management, тренды, работа с ТОП-1000'
              },
              {
                category: 'Детские товары',
                before: '0 (запуск)',
                after: '2.4M руб/мес',
                period: '45 дней',
                actions: 'Выход с нуля, контент, первые продажи, масштаб'
              }
            ].map((caseItem, i) => (
              <Card key={i} className="bg-gradient-to-br from-orange-900/40 to-transparent backdrop-blur-xl border-orange-500/30 p-8 hover:scale-105 transition-all">
                <h3 className="text-2xl font-bold text-white mb-6">{caseItem.category}</h3>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1">
                    <div className="text-gray-400 text-sm mb-1">Было</div>
                    <div className="text-2xl font-bold text-red-400">{caseItem.before}</div>
                  </div>
                  <Icon name="arrow-right" className="w-8 h-8 text-orange-400" />
                  <div className="flex-1">
                    <div className="text-gray-400 text-sm mb-1">Стало</div>
                    <div className="text-2xl font-bold text-green-400">{caseItem.after}</div>
                  </div>
                </div>
                <Badge className="mb-4 bg-orange-500/20 text-orange-300 border-orange-500/30">
                  За {caseItem.period}
                </Badge>
                <p className="text-gray-300 text-sm">{caseItem.actions}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="relative py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <Card className="bg-gradient-to-br from-orange-900/40 via-amber-900/30 to-orange-900/40 backdrop-blur-xl border-orange-500/30 p-12">
            <div className="text-center mb-10">
              <h2 className="text-5xl font-black text-white mb-4">
                Взрывной рост на МП за 36 часов
              </h2>
              <p className="text-xl text-gray-300 mb-6">
                Оставьте заявку и получите:
              </p>
              <div className="space-y-3 text-left max-w-xl mx-auto">
                {[
                  '3-4 менеджера с опытом роста продаж на вашей платформе',
                  'Кейсы и портфолио с реальными цифрами',
                  'Проверенные навыки работы с рекламными кабинетами',
                  'Знание аналитических сервисов (Helium, MPStats)',
                  'Чек-листы запуска и масштабирования',
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
                className="bg-white/10 border-orange-500/30 text-white placeholder:text-gray-400 h-12 md:h-14 text-base md:text-lg"
              />
              <Input
                placeholder="Номер телефона *"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
                className="bg-white/10 border-orange-500/30 text-white placeholder:text-gray-400 h-12 md:h-14 text-base md:text-lg"
              />
              <Button 
                type="submit" 
                disabled={isSubmitting}
                size="lg"
                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold h-12 md:h-14 text-base md:text-lg"
              >
                {isSubmitting ? 'Отправка...' : 'Получить кандидатов за 36 часов'}
              </Button>
              <p className="text-center text-sm text-gray-400">
                Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
              </p>
            </form>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default MarketplaceManagers;