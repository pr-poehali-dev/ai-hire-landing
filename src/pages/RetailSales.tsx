import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import SpecializationOfferModal from '@/components/landing/SpecializationOfferModal';

const RetailSales = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  useEffect(() => {
    const hasSeenOffer = sessionStorage.getItem('retailOfferSeen');
    if (!hasSeenOffer) {
      const timer = setTimeout(() => {
        setIsOfferModalOpen(true);
        sessionStorage.setItem('retailOfferSeen', 'true');
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
        source: 'retail_sales_contact_form',
        form_type: 'specialization_page',
        page: 'retail_sales',
        vacancy: 'Продавец-консультант',
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
      
      toast({ title: 'Заявка отправлена! 🛍️', description: 'Эксперт по retail свяжется с вами в течение 2 часов' });
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-sky-900/20 to-gray-900">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-sky-500/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-sky-600 to-blue-600 flex items-center justify-center">
              <Icon name="shopping-bag" className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent">
              1 DAY HR
            </span>
          </Link>
          <div className="flex gap-2">
            <Link to="/">
              <Button variant="outline" size="sm" className="hidden md:inline-flex hover:bg-sky-600/20">
                На главную
              </Button>
              <Button variant="outline" size="icon" className="md:hidden">
                <Icon name="home" className="w-4 h-4" />
              </Button>
            </Link>
            <Button onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })} size="sm" className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-xs md:text-sm">
              <span className="hidden md:inline">Найти продавцов</span>
              <span className="md:hidden">Заявка</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(14,165,233,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(37,99,235,0.15),transparent_50%)]" />
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center max-w-5xl mx-auto mb-16">
            <Badge className="mb-4 md:mb-6 bg-gradient-to-r from-sky-600 to-blue-600 border-0 text-white px-4 py-1.5 md:px-6 md:py-2 text-sm md:text-lg">
              🏪 #1 В RETAIL РЕКРУТИНГЕ
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-black mb-6 md:mb-8 leading-tight">
              <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-sky-400 bg-clip-text text-transparent">
                Продавцы
              </span>
              <br />
              <span className="text-white">
                которые влюбляют в ваш продукт
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-2xl lg:text-3xl text-gray-300 mb-8 md:mb-12 leading-relaxed">
              950+ продавцов-консультантов для магазинов, салонов, шоурумов
              <br />
              <span className="text-sky-400 font-bold">Средний чек после найма растёт на 42%</span>
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-12">
              {[
                { value: '950+', label: 'Продавцов трудоустроено', icon: 'users' },
                { value: '42%', label: 'Рост среднего чека', icon: 'trending-up' },
                { value: '89%', label: 'Проходят испытательный', icon: 'badge-check' },
                { value: '48ч', label: 'До кандидатов', icon: 'clock' }
              ].map((stat, i) => (
                <Card key={i} className="bg-white/5 backdrop-blur-lg border-sky-500/30 p-3 md:p-6 hover:bg-white/10 transition-all">
                  <Icon name={stat.icon as any} className="w-6 h-6 md:w-10 md:h-10 mx-auto mb-2 md:mb-3 text-sky-400" />
                  <div className="text-2xl md:text-4xl font-black text-transparent bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text mb-1 md:mb-2">
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm text-gray-400">{stat.label}</div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Retail Skills */}
      <section className="relative py-12 md:py-20 px-4 bg-gradient-to-b from-sky-900/10 to-transparent">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-white">
              Навыки наших продавцов
            </h2>
            <p className="text-2xl text-sky-300">Профессионалы активных продаж</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: 'smile',
                title: 'Работа с возражениями',
                desc: 'Мастерски закрывают "дорого", "подумаю", "посмотрю в другом месте". Конверсия в покупку 65%+',
                bonus: 'Техники SPIN, AIDA, FAB'
              },
              {
                icon: 'package-plus',
                title: 'Допродажи & Up-sell',
                desc: 'Естественно предлагают сопутствующие товары. Средний чек выше на 30-50%',
                bonus: 'Cross-sell эксперты'
              },
              {
                icon: 'star',
                title: 'Сервис мирового уровня',
                desc: 'Создают WOW-впечатление. 95% клиентов готовы вернуться и рекомендовать',
                bonus: 'NPS 9-10 баллов'
              },
              {
                icon: 'sparkles',
                title: 'Презентация продукта',
                desc: 'Рассказывают о товаре так, что хочется купить. Демонстрируют, дают потрогать, вовлекают',
                bonus: 'Storytelling в продажах'
              },
              {
                icon: 'heart',
                title: 'Эмоциональный интеллект',
                desc: 'Считывают настроение клиента. Подстраиваются под тип личности. Создают доверие',
                bonus: 'Обучены EQ техникам'
              },
              {
                icon: 'zap',
                title: 'Быстрая адаптация',
                desc: 'Изучают ассортимент за 3 дня. Выходят на план продаж за 2 недели',
                bonus: 'Готовы к работе сразу'
              }
            ].map((item, i) => (
              <Card key={i} className="relative bg-gradient-to-br from-sky-900/30 to-blue-900/20 backdrop-blur-xl border-sky-500/30 p-8 hover:scale-105 transition-all overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-600/20 to-blue-600/20 rounded-full blur-3xl group-hover:scale-150 transition-transform" />
                <Icon name={item.icon as any} className="w-16 h-16 mb-6 text-sky-400" />
                <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-gray-300 mb-4 leading-relaxed">{item.desc}</p>
                <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/50 text-green-300">
                  ✓ {item.bonus}
                </Badge>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Retail Segments */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-white">
              Сегменты retail
            </h2>
            <p className="text-2xl text-gray-300">Опыт во всех категориях</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { segment: 'Одежда и обувь', desc: 'Fashion retail, масс-маркет, премиум', icon: 'shirt', count: '280+' },
              { segment: 'Электроника', desc: 'Гаджеты, техника, аксессуары', icon: 'smartphone', count: '195+' },
              { segment: 'Косметика и парфюм', desc: 'Beauty retail, селективная парфюмерия', icon: 'sparkles', count: '142+' },
              { segment: 'Мебель и интерьер', desc: 'Мебельные салоны, декор, свет', icon: 'sofa', count: '108+' },
              { segment: 'Ювелирные изделия', desc: 'Драгметаллы, часы премиум', icon: 'gem', count: '86+' },
              { segment: 'Спорттовары', desc: 'Экипировка, инвентарь, питание', icon: 'dumbbell', count: '72+' },
              { segment: 'Детские товары', desc: 'Игрушки, одежда, коляски', icon: 'baby', count: '95+' },
              { segment: 'Автозапчасти', desc: 'Оригинал, неоригинал, аксессуары', icon: 'car', count: '64+' },
              { segment: 'Оптика', desc: 'Очки, линзы, солнцезащитные', icon: 'glasses', count: '48+' }
            ].map((seg, i) => (
              <Card key={i} className="bg-white/5 backdrop-blur-lg border-sky-500/20 p-6 hover:bg-white/10 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-sky-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <Icon name={seg.icon as any} className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">{seg.segment}</h3>
                    <p className="text-sm text-gray-400 mb-3">{seg.desc}</p>
                    <Badge className="bg-sky-500/20 text-sky-300 border-sky-500/30">
                      {seg.count} продавцов
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Our Candidates */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-transparent via-sky-900/10 to-transparent">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-white">
              Почему наши кандидаты лучшие
            </h2>
            <p className="text-2xl text-gray-300">Многоступенчатый отбор</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                stage: 'Проверка мотивации',
                desc: 'Отсеиваем тех, кто ищет "просто работу". Оставляем только влюблённых в продажи',
                icon: 'heart',
                check: 'Психометрические тесты'
              },
              {
                stage: 'Ролевая игра',
                desc: 'Симуляция реальной продажи. Оцениваем технику, харизму, работу с возражениями',
                icon: 'users',
                check: 'Mystery shopping тест'
              },
              {
                stage: 'Проверка стрессоустойчивости',
                desc: 'Тестируем на сложных клиентах, peak hours, конфликтных ситуациях',
                icon: 'shield',
                check: 'Поведенческие интервью'
              },
              {
                stage: 'Внешний вид и дикция',
                desc: 'Опрятность, грамотная речь, приятный голос - важно для первого впечатления',
                icon: 'eye',
                check: 'Видео-интервью'
              }
            ].map((item, i) => (
              <Card key={i} className="bg-gradient-to-br from-sky-900/40 to-transparent backdrop-blur-xl border-sky-500/30 p-8 hover:scale-105 transition-all">
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <Icon name={item.icon as any} className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-3">{item.stage}</h3>
                    <p className="text-gray-300 mb-4">{item.desc}</p>
                    <Badge className="bg-sky-500/20 text-sky-300 border-sky-500/30">
                      ✓ {item.check}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="relative py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <Card className="bg-gradient-to-br from-sky-900/40 via-blue-900/30 to-sky-900/40 backdrop-blur-xl border-sky-500/30 p-12">
            <div className="text-center mb-10">
              <h2 className="text-5xl font-black text-white mb-4">
                Продавцы мечты за 48 часов
              </h2>
              <p className="text-xl text-gray-300 mb-6">
                Оставьте заявку и получите:
              </p>
              <div className="space-y-3 text-left max-w-xl mx-auto">
                {[
                  '5-7 продавцов-консультантов с опытом в вашем сегменте',
                  'Видео-визитки с примерами продаж',
                  'Результаты ролевых игр и тестов',
                  'Проверенные рекомендации с прошлых мест',
                  'Скрипты продаж для вашего ассортимента',
                  'Гарантию замены на 3 месяца',
                  'Обучающие материалы для онбординга'
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
                className="bg-white/10 border-sky-500/30 text-white placeholder:text-gray-400 h-12 md:h-14 text-base md:text-lg"
              />
              <Input
                placeholder="Номер телефона *"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
                className="bg-white/10 border-sky-500/30 text-white placeholder:text-gray-400 h-12 md:h-14 text-base md:text-lg"
              />
              <Button 
                type="submit" 
                disabled={isSubmitting}
                size="lg"
                className="w-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-bold h-12 md:h-14 text-base md:text-lg"
              >
                {isSubmitting ? 'Отправка...' : 'Получить продавцов 🛍️'}
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
        specialization="retail"
      />
    </div>
  );
};

export default RetailSales;