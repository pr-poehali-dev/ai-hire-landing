import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import ConsultationModal from '@/components/landing/ConsultationModal';
import { TestimonialsCarousel, TeamCarousel } from '@/components/landing/Carousels';

const Index = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [isConsultFormOpen, setIsConsultFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      
      toast({ title: 'Заявка отправлена!', description: 'Мы свяжемся с вами в течение 2 часов' });
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

  const teamMembers = [
    { name: 'Дарья Коломанова', role: 'Ведущий HR-специалист', spec: 'IT-рекрутмент', exp: '8 лет', hires: '250+', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Darya', description: '8 лет в IT-рекрутменте, 250+ успешных наймов в технологических компаниях' },
    { name: 'Ангелина Малиновская', role: 'Senior HR-менеджер', spec: 'Продажи и маркетинг', exp: '6 лет', hires: '180+', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Angelina', description: '6 лет специализации на продажах, 180+ закрытых вакансий в B2B и B2C' },
    { name: 'Дарья Морозова', role: 'Team Lead HR', spec: 'Стратегический найм', exp: '10 лет', hires: '320+', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DaryaM', description: '10 лет опыта, 320+ успешных наймов на топ-позиции' },
    { name: 'Марианна Ковалёва', role: 'HR-специалист', spec: 'Маркетплейсы', exp: '5 лет', hires: '150+', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marianna', description: '5 лет в e-commerce и маркетплейсах, 150+ специалистов' },
    { name: 'Алексей Соколов', role: 'HR-аналитик', spec: 'Финтех', exp: '7 лет', hires: '220+', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alexey', description: '7 лет в финтехе, 220+ закрытых вакансий в финансовом секторе' },
    { name: 'Екатерина Волкова', role: 'Recruitment Lead', spec: 'Стартапы', exp: '12 лет', hires: '400+', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ekaterina', description: '12 лет опыта в стартап-среде, 400+ успешных назначений' },
    { name: 'Михаил Петров', role: 'Junior HR', spec: 'Ритейл', exp: '3 года', hires: '80+', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mikhail', description: '3 года в ритейле, 80+ закрытых позиций' },
    { name: 'Светлана Новикова', role: 'Senior Recruiter', spec: 'EdTech и Healthcare', exp: '9 лет', hires: '290+', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Svetlana', description: '9 лет в EdTech и Healthcare, 290+ специалистов' }
  ];

  const caseStudies = [
    { 
      company: 'TechFlow Solutions',
      industry: 'IT / Финтех',
      position: 'Senior Developer',
      time: '18 часов',
      result: '+40% производительности команды за квартал',
      challenge: 'Требовался разработчик с опытом банковской архитектуры',
      solution: 'Найден специалист с уникальным опытом работы в крупном банке'
    },
    { 
      company: 'MegaSell Pro',
      industry: 'E-commerce',
      position: 'Руководитель отдела продаж',
      time: '20 часов',
      result: '+40% роста продаж за первый квартал',
      challenge: 'Срочная потребность в опытном лидере для команды продаж',
      solution: 'Подобран специалист с проверенным опытом масштабирования отделов'
    },
    { 
      company: 'FinServe AI',
      industry: 'AI / ML',
      position: 'AI Research Engineer',
      time: '24 часа',
      result: 'Запущено 3 новых ML-проекта за полгода',
      challenge: 'Поиск классическими методами не давал результатов 6 месяцев',
      solution: 'Использован AI-анализ для поиска нестандартных кандидатов'
    },
    { 
      company: 'MobileHub',
      industry: 'Mobile Development',
      position: 'Lead Mobile Developer',
      time: '18 часов',
      result: 'Полный рефакторинг приложения и рост рейтинга до 4.8',
      challenge: 'Проект на грани срыва из-за увольнения ключевого разработчика',
      solution: 'Экстренный подбор с углубленной технической оценкой'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Client-Focused */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-8">
            {/* Social Proof Badge - Above the fold */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm mb-6 border border-blue-100">
              <Icon name="check-circle" className="text-green-500 w-5 h-5" />
              <span className="text-sm font-medium text-gray-700">1200+ успешных закрытых вакансий</span>
            </div>

            {/* Client-Focused Headline */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
              Вы получите идеального сотрудника за 24 часа
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Ваша компания сэкономит недели поиска. Мы используем AI-технологии и проверенную базу для подбора точного специалиста под вашу задачу
            </p>

            {/* Single Primary CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button 
                onClick={() => setIsConsultFormOpen(true)}
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
              >
                <Icon name="calendar" className="mr-2 h-5 w-5" />
                Получить бесплатную оценку вакансии
              </Button>
            </div>

            {/* Soft Entry Points */}
            <div className="flex flex-wrap gap-6 justify-center text-sm">
              <button 
                onClick={() => scrollToSection('process')}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Icon name="download" className="w-4 h-4" />
                Скачать чек-лист по найму
              </button>
              <button 
                onClick={() => scrollToSection('cases')}
                className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
              >
                <Icon name="file-text" className="w-4 h-4" />
                Посмотреть примеры кейсов
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-12">
            {[
              { icon: 'clock', value: '24 часа', label: 'Средний срок подбора' },
              { icon: 'users', value: '1200+', label: 'Закрытых вакансий' },
              { icon: 'trending-up', value: '96%', label: 'Успешных наймов' },
              { icon: 'shield-check', value: '3 месяца', label: 'Гарантия замены' }
            ].map((stat, i) => (
              <Card key={i} className="p-4 text-center bg-white/80 backdrop-blur-sm border-blue-100 hover:shadow-md transition-shadow">
                <Icon name={stat.icon} className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-xs text-gray-600">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section - Real Case Stories */}
      <section id="cases" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                Реальные кейсы наших клиентов
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Конкретные результаты компаний, которые доверили нам поиск специалистов
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {caseStudies.map((caseItem, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-blue-600">
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{caseItem.company}</h3>
                        <p className="text-sm text-gray-600">{caseItem.industry}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        {caseItem.time}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-blue-600 mb-3">{caseItem.position}</p>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Задача:</p>
                      <p className="text-sm text-gray-700">{caseItem.challenge}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Решение:</p>
                      <p className="text-sm text-gray-700">{caseItem.solution}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Результат:</p>
                    <p className="text-lg font-bold text-green-600">{caseItem.result}</p>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center mt-10">
              <Button 
                variant="outline" 
                onClick={() => setIsConsultFormOpen(true)}
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Получить такой же результат
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Process Transparency Block */}
      <section id="process" className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                Как вы получите результат
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Прозрачный процесс работы с гарантиями качества
              </p>
            </div>

            {/* Process Steps */}
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              {[
                {
                  step: '1',
                  title: 'Анализ задачи',
                  description: 'Вы заполняете бриф. Мы анализируем требования и составляем портрет кандидата',
                  time: '2 часа'
                },
                {
                  step: '2',
                  title: 'Поиск кандидатов',
                  description: 'AI-система ищет в базе из 50,000+ профилей. Параллельно работает команда рекрутеров',
                  time: '8-12 часов'
                },
                {
                  step: '3',
                  title: 'Отбор и проверка',
                  description: 'Проводим интервью, проверяем навыки, рекомендации. Вы получаете 2-3 лучших кандидата',
                  time: '6-8 часов'
                },
                {
                  step: '4',
                  title: 'Ваше интервью',
                  description: 'Координируем встречу. Помогаем с офером. Сопровождаем выход сотрудника',
                  time: '2-4 часа'
                }
              ].map((item, index) => (
                <Card key={index} className="p-6 bg-white hover:shadow-lg transition-shadow relative">
                  <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {item.step}
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                    <div className="flex items-center gap-2 text-xs text-blue-600">
                      <Icon name="clock" className="w-4 h-4" />
                      <span>{item.time}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pricing & Guarantees */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 bg-white border-2 border-blue-200">
                <Icon name="dollar-sign" className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Прозрачное ценообразование</h3>
                <p className="text-gray-600 mb-4">От 50,000₽ за успешный найм. Оплата только по результату - когда кандидат вышел на работу</p>
                <Button variant="outline" size="sm" onClick={() => setIsConsultFormOpen(true)}>
                  Узнать точную стоимость
                </Button>
              </Card>

              <Card className="p-6 bg-white border-2 border-green-200">
                <Icon name="shield-check" className="w-10 h-10 text-green-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Гарантия замены</h3>
                <p className="text-gray-600">Если сотрудник не подошел в течение 3 месяцев - бесплатно найдем замену без дополнительных платежей</p>
              </Card>

              <Card className="p-6 bg-white border-2 border-purple-200">
                <Icon name="file-text" className="w-10 h-10 text-purple-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Официальный договор</h3>
                <p className="text-gray-600">Работаем по договору оферты с полным пакетом документов. НДС включен в стоимость услуг</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section - Enhanced with LinkedIn-style credibility */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                Команда профессионалов
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Опытные рекрутеры с подтвержденными результатами в каждой индустрии
              </p>
            </div>

            <div className="mb-8">
              <TeamCarousel 
                teamMembers={teamMembers.map(member => ({
                  ...member,
                  description: member.description
                }))} 
              />
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Средний опыт команды: 7+ лет | Суммарно закрыто: 2000+ вакансий
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
              Как работает AI-рекрутинг
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Технология помогает находить неочевидных кандидатов, которых упускают классические методы
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: 'database',
                  title: 'Анализ 50,000+ профилей',
                  description: 'Система сканирует базу кандидатов, включая пассивных специалистов, которые не ищут работу активно'
                },
                {
                  icon: 'brain',
                  title: 'Умный поиск совпадений',
                  description: 'AI находит скрытые навыки и опыт, которые не указаны напрямую в резюме, но важны для вашей задачи'
                },
                {
                  icon: 'target',
                  title: 'Точная рекомендация',
                  description: 'Вы получаете 2-3 кандидата с максимальным соответствием требованиям, проверенных HR-специалистом'
                }
              ].map((item, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow bg-white">
                  <Icon name={item.icon} className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
              Вы получаете комплексное решение
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: 'zap', title: 'Экспресс-найм за 24 часа', desc: 'Срочный подбор с использованием AI и приоритетным поиском' },
                { icon: 'users', title: 'Массовый подбор', desc: 'Закрытие 10+ вакансий одновременно с единой системой управления' },
                { icon: 'briefcase', title: 'Executive Search', desc: 'Поиск топ-менеджеров и редких специалистов с гарантией результата' },
                { icon: 'video', title: 'AI-анализ кандидатов', desc: 'Видео-интервью с автоматической оценкой компетенций и soft skills' },
                { icon: 'file-text', title: 'HR-консалтинг', desc: 'Аудит процессов найма и построение системы подбора персонала' },
                { icon: 'trending-up', title: 'Employer Branding', desc: 'Создание привлекательного бренда работодателя для лучших кандидатов' }
              ].map((service, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-all hover:-translate-y-1 bg-white border-gray-200">
                  <Icon name={service.icon} className="w-10 h-10 text-blue-600 mb-4" />
                  <h3 className="text-lg font-bold mb-2 text-gray-900">{service.title}</h3>
                  <p className="text-sm text-gray-600">{service.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
              Отзывы клиентов
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Мнения руководителей компаний о результатах нашей работы
            </p>
            
            <TestimonialsCarousel />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
              Частые вопросы
            </h2>
            
            <Accordion type="single" collapsible className="space-y-4">
              {[
                {
                  q: 'Действительно ли вы находите кандидатов за 24 часа?',
                  a: 'Да, в 87% случаев мы предоставляем первых кандидатов в течение 24 часов. Это возможно благодаря AI-анализу базы из 50,000+ профилей и опытной команде рекрутеров. Для редких специальностей срок может составить 2-3 дня.'
                },
                {
                  q: 'Как формируется стоимость услуг?',
                  a: 'Базовая стоимость - от 50,000₽ за успешный найм. Итоговая цена зависит от сложности позиции, срочности и уровня специалиста. Оплата только по результату - после выхода кандидата на работу. Консультация и оценка вакансии - бесплатно.'
                },
                {
                  q: 'Что включает гарантия на 3 месяца?',
                  a: 'Если сотрудник не прошел испытательный срок или уволился в течение 3 месяцев по любой причине - мы бесплатно находим замену без дополнительных платежей. Гарантия прописана в договоре.'
                },
                {
                  q: 'Чем AI-анализ лучше обычного рекрутинга?',
                  a: 'AI-система анализирует тысячи профилей за минуты и находит неочевидные совпадения - скрытые навыки, релевантный опыт в смежных областях. Это особенно важно для технических и редких позиций. HR-специалист затем проверяет лучшие совпадения.'
                },
                {
                  q: 'С какими индустриями вы работаете?',
                  a: 'У нас есть специалисты по IT, продажам, маркетингу, финтеху, e-commerce, телекому, стартапам, ритейлу, EdTech и Healthcare. Каждый рекрутер - эксперт в своей области с опытом 5-12 лет.'
                },
                {
                  q: 'Нужно ли платить аванс?',
                  a: 'Нет, мы работаем полностью по результату. Оплата только после того, как кандидат вышел на работу и прошел первый рабочий день. Никаких авансов и скрытых платежей.'
                }
              ].map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-blue-600">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Получите идеального кандидата за 24 часа
            </h2>
            <p className="text-xl mb-8 text-blue-50">
              Заполните заявку сейчас - мы свяжемся с вами в течение 2 часов и начнем поиск
            </p>
            
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 mb-8">
              <Input
                placeholder="Ваше имя"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-white/95 border-0 h-12"
              />
              <Input
                type="tel"
                placeholder="Телефон"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="bg-white/95 border-0 h-12"
              />
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-white text-blue-600 hover:bg-gray-100 h-12 text-lg font-semibold"
              >
                {isSubmitting ? 'Отправка...' : 'Получить бесплатную оценку вакансии'}
              </Button>
            </form>

            <p className="text-sm text-blue-100">
              Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
            </p>
          </div>
        </div>
      </section>

      {/* Footer with Legal Info */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="text-white font-bold text-xl mb-4">1 DAY HR</h3>
                <p className="text-sm text-gray-400">
                  Агентство по подбору персонала нового поколения с использованием AI-технологий
                </p>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-4">Контакты</h4>
                <div className="space-y-2 text-sm">
                  <p>Email: info@1-day-hr.ru</p>
                  <p>Телефон: +7 (495) 123-45-67</p>
                  <p>Telegram: @1dayhrsupport</p>
                </div>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-4">Услуги</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/services" className="hover:text-white transition-colors">Экспресс-найм</Link></li>
                  <li><Link to="/services" className="hover:text-white transition-colors">Массовый подбор</Link></li>
                  <li><Link to="/services" className="hover:text-white transition-colors">Executive Search</Link></li>
                  <li><Link to="/services" className="hover:text-white transition-colors">AI-анализ</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-4">Документы</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/privacy" className="hover:text-white transition-colors">Политика конфиденциальности</Link></li>
                  <li><Link to="/terms" className="hover:text-white transition-colors">Договор оферты</Link></li>
                  <li><Link to="/about" className="hover:text-white transition-colors">О компании</Link></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8">
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-400">
                <div>
                  <p className="font-semibold text-gray-300 mb-2">Реквизиты компании:</p>
                  <p>ООО "Уан Дэй Эйчар"</p>
                  <p>ИНН: 7701234567</p>
                  <p>ОГРН: 1234567890123</p>
                  <p>Юридический адрес: 123456, г. Москва, ул. Примерная, д. 1, офис 100</p>
                </div>
                <div className="md:text-right">
                  <p className="mb-2">Офис в Москве:</p>
                  <p>г. Москва, ул. Деловая, д. 10</p>
                  <p>БЦ "Технопарк", 5 этаж</p>
                  <p className="mt-4">© 2024 1 DAY HR. Все права защищены.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Consultation Modal */}
      <ConsultationModal 
        isOpen={isConsultFormOpen} 
        onClose={() => setIsConsultFormOpen(false)} 
      />
    </div>
  );
};

export default Index;
