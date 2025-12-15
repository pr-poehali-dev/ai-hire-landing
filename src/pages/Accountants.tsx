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

const Accountants = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  useEffect(() => {
    const hasSeenOffer = sessionStorage.getItem('accountantsOfferSeen');
    if (!hasSeenOffer) {
      const timer = setTimeout(() => {
        setIsOfferModalOpen(true);
        sessionStorage.setItem('accountantsOfferSeen', 'true');
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    sendMetrikaGoal(metrikaGoals.FORM_SUBMIT, { form_type: 'accountants_contact', page: 'accountants' });
    
    try {
      const leadData = {
        name: formData.name,
        phone: formData.phone,
        source: 'accountants_contact_form',
        form_type: 'specialization_page',
        page: 'accountants',
        vacancy: 'Бухгалтер',
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

      sendMetrikaGoal(metrikaGoals.LEAD_CREATED, { source: 'accountants_contact_form' });
      
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-900/20 to-gray-900 overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-emerald-500/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center max-w-full">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center justify-center">
              <Icon name="calculator" className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              1 DAY HR
            </span>
          </Link>
          <div className="flex gap-2">
            <Link to="/">
              <Button variant="outline" size="sm" className="hidden md:inline-flex hover:bg-emerald-600/20">
                На главную
              </Button>
              <Button variant="outline" size="sm" className="md:hidden">
                На главную
              </Button>
            </Link>
            <Button onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })} size="sm" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-xs md:text-sm">
              <span className="hidden md:inline">Найти бухгалтера</span>
              <span className="md:hidden">Заявка</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(20,184,166,0.15),transparent_50%)]" />
        
        <div className="container mx-auto max-w-7xl relative z-10 px-4">
          <div className="text-center max-w-5xl mx-auto mb-16">
            <Badge className="mb-4 md:mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 border-0 text-white px-4 py-1.5 md:px-6 md:py-2 text-sm md:text-lg">
              💎 ПРЕМИУМ ФИНАНСОВЫЙ ПОДБОР
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-black mb-6 md:mb-8 leading-tight break-words">
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
                Бухгалтер
              </span>
              <br />
              <span className="text-white">
                который наведёт порядок в финансах
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
              380+ бухгалтеров трудоустроено в бизнесах от стартапов до холдингов
              <br />
              <span className="text-emerald-400 font-bold">0 штрафов от ФНС у 98% наших клиентов</span>
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-12">
              {[
                { value: '380+', label: 'Бухгалтеров нанято', icon: 'user-check' },
                { value: '98%', label: 'Без налоговых штрафов', icon: 'shield-check' },
                { value: '15 лет', label: 'Средний опыт', icon: 'award' },
                { value: '24ч', label: 'До кандидатов', icon: 'clock' }
              ].map((stat, i) => (
                <Card key={i} className="bg-white/5 backdrop-blur-lg border-emerald-500/30 p-3 md:p-6 hover:bg-white/10 transition-all">
                  <Icon name={stat.icon as any} className="w-6 h-6 md:w-10 md:h-10 mx-auto mb-2 md:mb-3 text-emerald-400" />
                  <div className="text-2xl md:text-4xl font-black text-transparent bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text mb-1 md:mb-2">
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
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-lg px-8 py-6 h-auto hover:scale-105 transition-all shadow-lg shadow-emerald-600/50"
              >
                <Icon name="Rocket" className="mr-2" size={24} />
                Подобрать сотрудника
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Accounting Expertise */}
      <section className="relative py-12 md:py-20 px-4 bg-gradient-to-b from-emerald-900/10 to-transparent">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-white">
              Комплексная экспертиза
            </h2>
            <p className="text-2xl text-emerald-300">Бухгалтеры, которым можно доверить всё</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: 'file-text',
                title: 'Полный цикл учёта',
                desc: 'От первички до баланса. БУ, НУ, управленческий учёт. Работа с 1С, SAP, кастомными ERP',
                bonus: 'Сертификаты 1С:Специалист'
              },
              {
                icon: 'briefcase',
                title: 'Налоговая оптимизация',
                desc: 'Легальные схемы снижения налогов. Планирование, консультации с юристами, споры с ФНС',
                bonus: 'Экономия до 30% налогов'
              },
              {
                icon: 'shield',
                title: 'Камеральные проверки',
                desc: 'Взаимодействие с ФНС, ответы на требования, защита интересов. Опыт прохождения ВНП',
                bonus: '0 доначислений у 95% клиентов'
              },
              {
                icon: 'wallet',
                title: 'Зарплата и кадры',
                desc: 'Расчёт з/п, больничные, отпуска, увольнения. Отчётность в ПФР, ФСС. Кадровый учёт',
                bonus: 'Без задержек выплат'
              },
              {
                icon: 'trending-up',
                title: 'Финансовая отчётность',
                desc: 'РСБУ, МСФО, управленческие отчёты. ДДС, P&L, балансы. Аналитика для собственников',
                bonus: 'Прозрачность в цифрах'
              },
              {
                icon: 'repeat',
                title: 'Автоматизация учёта',
                desc: 'Настройка интеграций банк-1С, EDI, API маркетплейсов. Сокращение рутины на 70%',
                bonus: 'Современные технологии'
              }
            ].map((item, i) => (
              <Card key={i} className="relative bg-gradient-to-br from-emerald-900/30 to-teal-900/20 backdrop-blur-xl border-emerald-500/30 p-8 hover:scale-105 transition-all overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 rounded-full blur-3xl group-hover:scale-150 transition-transform" />
                <Icon name={item.icon as any} className="w-16 h-16 mb-6 text-emerald-400" />
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

      {/* Specializations */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-white">
              Специализации
            </h2>
            <p className="text-2xl text-gray-300">Бухгалтеры под любую задачу</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Главный бухгалтер', desc: 'Полная ответственность за учёт и отчётность', level: 'Senior', count: '95+' },
              { title: 'Бухгалтер на участок', desc: 'Расчёты с контрагентами, банк, касса', level: 'Middle', count: '180+' },
              { title: 'Зарплата и кадры', desc: 'Расчёт з/п, отчётность в фонды', level: 'Middle', count: '78+' },
              { title: 'Бухгалтер-кассир', desc: 'Операционная работа, первичка', level: 'Junior', count: '52+' },
              { title: 'Финансовый директор', desc: 'Стратегия, бюджетирование, управленка', level: 'C-Level', count: '24+' },
              { title: 'Налоговый консультант', desc: 'Оптимизация, споры с ФНС', level: 'Expert', count: '18+' }
            ].map((spec, i) => (
              <Card key={i} className="bg-white/5 backdrop-blur-lg border-emerald-500/20 p-6 hover:bg-white/10 transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center flex-shrink-0">
                    <Icon name="briefcase" className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">{spec.title}</h3>
                    <p className="text-sm text-gray-400 mb-3">{spec.desc}</p>
                    <div className="flex gap-2">
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs">
                        {spec.level}
                      </Badge>
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                        {spec.count} специалистов
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Systems */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-transparent via-emerald-900/10 to-transparent">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-white">
              Системы учёта
            </h2>
            <p className="text-2xl text-gray-300">Экспертиза во всех популярных продуктах</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: '1С 8.3', icon: '1️⃣', desc: 'Бухгалтерия, ЗУП, ERP', level: 'Эксперты' },
              { name: 'SAP', icon: '🟦', desc: 'FI, CO, MM модули', level: 'Продвинутые' },
              { name: 'МойСклад', icon: '📦', desc: 'Облачный учёт для МСБ', level: 'Профи' },
              { name: 'Контур', icon: '🔵', desc: 'Экстерн, Бухгалтерия', level: 'Сертифицированы' }
            ].map((system, i) => (
              <Card key={i} className="bg-white/5 backdrop-blur-lg border-emerald-500/20 p-6 hover:bg-white/10 transition-all text-center">
                <div className="text-5xl mb-4">{system.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{system.name}</h3>
                <p className="text-sm text-gray-400 mb-3">{system.desc}</p>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                  {system.level}
                </Badge>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="relative py-20 px-4">
        <div className="container mx-auto max-w-3xl px-4">
          <Card className="bg-gradient-to-br from-emerald-900/40 via-teal-900/30 to-emerald-900/40 backdrop-blur-xl border-emerald-500/30 p-12">
            <div className="text-center mb-10">
              <h2 className="text-5xl font-black text-white mb-4">
                Закройте вакансию за 24 часа
              </h2>
              <p className="text-xl text-gray-300 mb-6">
                Оставьте заявку и получите:
              </p>
              <div className="space-y-3 text-left max-w-xl mx-auto">
                {[
                  '3-4 бухгалтера с опытом в вашей отрасли',
                  'Проверенные дипломы и сертификаты',
                  'Референсы от предыдущих работодателей',
                  'Тестовое задание на знание учёта',
                  'Консультацию по оптимизации учётных процессов',
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
                className="bg-white/10 border-emerald-500/30 text-white placeholder:text-gray-400 h-12 md:h-14 text-base md:text-lg"
              />
              <Input
                placeholder="Номер телефона *"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
                className="bg-white/10 border-emerald-500/30 text-white placeholder:text-gray-400 h-12 md:h-14 text-base md:text-lg"
              />
              <Button 
                type="submit" 
                disabled={isSubmitting}
                size="lg"
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold h-12 md:h-14 text-base md:text-lg"
              >
                {isSubmitting ? 'Отправка...' : 'Найти бухгалтера за 24 часа'}
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
        specialization="accountants"
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

export default Accountants;