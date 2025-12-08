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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [showSkills, setShowSkills] = useState(false);

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

  const simulateAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setShowSkills(false);
    
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsAnalyzing(false);
            setShowSkills(true);
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
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

  const testimonials = [
    { 
      company: 'TechFlow Solutions',
      person: 'Дмитрий Козлов',
      role: 'Tech Lead',
      text: 'AI-анализ выявил кандидата, который работал с похожей архитектурой в банковской сфере. Это был неочевидный выбор, но именно то, что нам было нужно.',
      img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dmitry',
      stats: { speed: '16ч', quality: '96%', period: '8 мес' },
      rating: 5,
      letterText: 'Выражаем благодарность HR-агентству 1 DAY HR за оперативный и качественный подбор IT-специалиста. Кандидат полностью соответствует нашим требованиям и успешно справляется с задачами.'
    },
    { 
      company: 'MegaSell Pro',
      person: 'Анна Смирнова',
      role: 'COO',
      text: 'Критически важно было найти человека быстро. 1 DAY HR справились за сутки, и это был именно тот специалист, который нам был нужен. Рост продаж +40% за первый квартал.',
      img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
      stats: { speed: '20ч', quality: '94%', period: '6 мес' },
      rating: 5,
      letterText: 'Благодарим команду 1 DAY HR за профессионализм и индивидуальный подход. Найденный специалист значительно повысил эффективность нашего отдела продаж.'
    },
    { 
      company: 'FinServe AI',
      person: 'Елена Соколова',
      role: 'Head of AI Department',
      text: 'Искали полгода классическими методами. 1 DAY HR нашли идеального кандидата за сутки. Система AI-анализа показала совместимость с нашей командой 94%.',
      img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
      stats: { speed: '24ч', quality: '98%', period: '10 мес' },
      rating: 5,
      letterText: 'Отмечаем высокий уровень сервиса агентства 1 DAY HR. Использование AI-технологий позволило найти уникального специалиста, который органично влился в нашу команду.'
    },
    { 
      company: 'MobileHub',
      person: 'Игорь Петров',
      role: 'CTO',
      text: 'Проект был на грани срыва. Нужен был lead-разработчик срочно. 1 DAY HR нашли специалиста за 18 часов. Сейчас он возглавляет команду из 12 человек.',
      img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Igor',
      stats: { speed: '18ч', quality: '95%', period: '7 мес' },
      rating: 5,
      letterText: 'Благодарим 1 DAY HR за спасение нашего проекта. Найденный специалист превзошел все ожидания и стал ключевым членом команды.'
    },
    { 
      company: 'TelecomPro',
      person: 'Ольга Васильева',
      role: 'HR Director',
      text: 'Масштабировали отдел продаж с 5 до 25 человек за 3 месяца. 1 DAY HR закрывали по 2-3 вакансии в неделю с качеством 93%+. Невероятная скорость и точность подбора.',
      img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olga',
      stats: { speed: '22ч', quality: '93%', period: '3 мес' },
      rating: 5,
      letterText: 'Выражаем признательность команде 1 DAY HR за профессиональное сопровождение масштабного проекта по найму. Все специалисты показывают отличные результаты.'
    },
    { 
      company: 'ConnectPlus',
      person: 'Сергей Михайлов',
      role: 'CEO',
      text: 'Искали уникального специалиста: продажи + техническая экспертиза + английский C1. За 20 часов 1 DAY HR нашли идеального кандидата. Выручка его отдела $2M за год.',
      img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sergey',
      stats: { speed: '20ч', quality: '97%', period: '12 мес' },
      rating: 5,
      letterText: 'Отмечаем высочайший профессионализм агентства 1 DAY HR. Они нашли специалиста с уникальным набором компетенций, что казалось невозможным.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0118] text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-purple-500/20 text-purple-300 border-purple-500/30 px-6 py-2 text-sm">
              AI-Powered Recruitment
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Находим идеальных кандидатов за 24 часа
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              AI-анализ резюме, автоматическая оценка навыков и совместимости с вашей командой. Технологии будущего в рекрутинге сегодня.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => setIsConsultFormOpen(true)} size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8">
                Попробовать AI-подбор
              </Button>
              <Button onClick={() => scrollToSection('demo')} variant="outline" size="lg" className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 text-lg px-8">
                Смотреть демо
              </Button>
            </div>
          </div>

          {/* Live Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { label: 'Закрытых вакансий', value: '1200+', icon: 'briefcase' },
              { label: 'Средняя скорость', value: '18ч', icon: 'zap' },
              { label: 'Качество подбора', value: '94%', icon: 'target' },
              { label: 'Сохранность год+', value: '89%', icon: 'users' }
            ].map((stat, i) => (
              <Card key={i} className="bg-white/5 backdrop-blur-lg border-purple-500/20 p-6 text-center hover:bg-white/10 transition-all">
                <Icon name={stat.icon as any} className="w-8 h-8 mx-auto mb-3 text-purple-400" />
                <div className="text-3xl font-bold text-purple-300 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Demo Section */}
      <section id="demo" className="relative py-20 px-4">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI-анализ кандидатов в действии
            </h2>
            <p className="text-xl text-gray-300">Посмотрите, как наша система оценивает кандидатов за секунды</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Video Analysis Simulator */}
            <Card className="bg-white/5 backdrop-blur-lg border-purple-500/20 p-8">
              <div className="aspect-video bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-lg mb-6 flex items-center justify-center relative overflow-hidden">
                {!isAnalyzing && !showSkills && (
                  <div className="text-center">
                    <Icon name="play-circle" className="w-20 h-20 text-purple-400 mb-4 mx-auto" />
                    <p className="text-gray-300">Симуляция AI-анализа резюме</p>
                  </div>
                )}
                {isAnalyzing && (
                  <div className="text-center w-full px-8">
                    <div className="mb-4">
                      <Icon name="cpu" className="w-16 h-16 text-purple-400 mx-auto animate-pulse" />
                    </div>
                    <div className="text-2xl font-bold text-purple-300 mb-2">{analysisProgress}%</div>
                    <div className="w-full bg-purple-900/30 rounded-full h-3 mb-4">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${analysisProgress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-400">Анализируем навыки, опыт и совместимость...</p>
                  </div>
                )}
                {showSkills && (
                  <div className="w-full px-8">
                    <div className="space-y-4">
                      {[
                        { skill: 'React/TypeScript', score: 94 },
                        { skill: 'Team Leadership', score: 89 },
                        { skill: 'System Design', score: 91 },
                        { skill: 'Communication', score: 87 }
                      ].map((item, i) => (
                        <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-300">{item.skill}</span>
                            <span className="text-sm font-bold text-purple-300">{item.score}%</span>
                          </div>
                          <div className="w-full bg-purple-900/30 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
                              style={{ width: `${item.score}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <Button 
                onClick={simulateAnalysis} 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                disabled={isAnalyzing}
              >
                {isAnalyzing ? 'Анализируем...' : showSkills ? 'Запустить снова' : 'Запустить анализ'}
              </Button>
            </Card>

            {/* Features */}
            <div className="space-y-4">
              {[
                {
                  icon: 'brain',
                  title: 'Глубокий AI-анализ',
                  description: 'Нейросеть анализирует не только навыки, но и опыт, паттерны карьеры и совместимость с вашей командой'
                },
                {
                  icon: 'zap',
                  title: 'Мгновенная оценка',
                  description: 'Система обрабатывает резюме за секунды и выдает детальный отчет с оценкой по 50+ параметрам'
                },
                {
                  icon: 'target',
                  title: 'Точность 94%+',
                  description: 'Наш AI показывает точность подбора 94%+, что в 3 раза выше классических методов рекрутинга'
                },
                {
                  icon: 'shield-check',
                  title: 'Проверка совместимости',
                  description: 'Алгоритм оценивает культурную совместимость кандидата с вашей компанией и командой'
                }
              ].map((feature, i) => (
                <Card key={i} className="bg-white/5 backdrop-blur-lg border-purple-500/20 p-6 hover:bg-white/10 transition-all">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                        <Icon name={feature.icon as any} className="w-6 h-6 text-purple-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-purple-300 mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Как мы работаем
            </h2>
            <p className="text-xl text-gray-300">Простой процесс от запроса до найма</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Анализ задачи', desc: 'AI анализирует вашу вакансию и определяет ключевые требования', icon: 'file-text' },
              { step: '2', title: 'Умный поиск', desc: 'Система ищет кандидатов по 50+ параметрам в базе 50,000+ специалистов', icon: 'search' },
              { step: '3', title: 'Оценка и отбор', desc: 'AI оценивает совместимость и отбирает топ-3 кандидатов', icon: 'award' },
              { step: '4', title: 'Быстрый найм', desc: 'Вы получаете готовых кандидатов с полным досье за 24 часа', icon: 'check-circle' }
            ].map((step, i) => (
              <Card key={i} className="bg-white/5 backdrop-blur-lg border-purple-500/20 p-6 text-center hover:bg-white/10 transition-all relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center font-bold text-sm">
                  {step.step}
                </div>
                <Icon name={step.icon as any} className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                <h3 className="text-xl font-semibold mb-3 text-purple-300">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Что говорят клиенты
            </h2>
            <p className="text-xl text-gray-300">Реальные отзывы о работе с 1 DAY HR</p>
          </div>
          <TestimonialsCarousel testimonials={testimonials} />
        </div>
      </section>

      {/* Team */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Наша команда экспертов
            </h2>
            <p className="text-xl text-gray-300">Профессионалы с многолетним опытом в рекрутинге</p>
          </div>
          <TeamCarousel members={teamMembers} />
        </div>
      </section>

      {/* Pricing */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Прозрачные цены
            </h2>
            <p className="text-xl text-gray-300">Никаких скрытых платежей</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Базовый',
                price: 'от 80,000₽',
                desc: 'Для разовых задач',
                features: ['1 вакансия', 'AI-анализ', '3 кандидата', '7 дней поддержки', 'Гарантия 3 месяца']
              },
              {
                name: 'Профессиональный',
                price: 'от 200,000₽',
                desc: 'Для растущих команд',
                features: ['3 вакансии', 'Приоритетный поиск', '5 кандидатов на вакансию', '30 дней поддержки', 'Гарантия 6 месяцев'],
                popular: true
              },
              {
                name: 'Корпоративный',
                price: 'Индивидуально',
                desc: 'Для масштабных проектов',
                features: ['Безлимит вакансий', 'Выделенный менеджер', 'Кастомные решения', 'Постоянная поддержка', 'Гарантия 12 месяцев']
              }
            ].map((plan, i) => (
              <Card key={i} className={`bg-white/5 backdrop-blur-lg border-purple-500/20 p-8 text-center hover:bg-white/10 transition-all relative ${plan.popular ? 'ring-2 ring-purple-500' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600">
                    Популярный
                  </Badge>
                )}
                <h3 className="text-2xl font-bold mb-2 text-purple-300">{plan.name}</h3>
                <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{plan.price}</div>
                <p className="text-gray-400 mb-6">{plan.desc}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-gray-300">
                      <Icon name="check" className="w-5 h-5 text-purple-400" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  onClick={() => setIsConsultFormOpen(true)}
                  className={plan.popular ? 'w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' : 'w-full bg-white/10 hover:bg-white/20'}
                >
                  Выбрать план
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Часто задаваемые вопросы
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {[
              {
                q: 'Как работает AI-анализ кандидатов?',
                a: 'Наша нейросеть анализирует резюме по 50+ параметрам: опыт, навыки, траекторию карьеры, культурную совместимость. Система обучена на данных 10,000+ успешных наймов и показывает точность 94%+.'
              },
              {
                q: 'Что если кандидат не подойдет?',
                a: 'Мы даем гарантию на всех специалистов. Если кандидат не прошел испытательный срок по профессиональным причинам, мы бесплатно найдем замену в течение гарантийного периода.'
              },
              {
                q: 'Сколько кандидатов вы предоставляете?',
                a: 'В базовом тарифе - 3 кандидата, в профессиональном - 5 на каждую вакансию. Каждый кандидат проходит тщательную проверку и AI-анализ совместимости с вашей компанией.'
              },
              {
                q: 'Можно ли закрыть несколько вакансий одновременно?',
                a: 'Да, мы специализируемся на массовом найме. Работаем параллельно над несколькими вакансиями, сохраняя скорость и качество подбора. Оптимальный вариант - корпоративный тариф.'
              },
              {
                q: 'В каких городах вы работаете?',
                a: 'Мы работаем по всей России и СНГ. Специализируемся как на локальном найме, так и на удаленных позициях. AI-технологии позволяют нам эффективно подбирать специалистов в любом регионе.'
              }
            ].map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="bg-white/5 backdrop-blur-lg border-purple-500/20 rounded-lg px-6">
                <AccordionTrigger className="text-left text-purple-300 hover:text-purple-200">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-gray-400">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-4xl relative z-10">
          <Card className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-lg border-purple-500/30 p-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
              Готовы найти идеального кандидата?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Оставьте заявку и получите первых кандидатов уже завтра
            </p>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
              <Input
                placeholder="Ваше имя"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-white/10 border-purple-500/30 text-white placeholder:text-gray-400"
              />
              <Input
                placeholder="Телефон"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="bg-white/10 border-purple-500/30 text-white placeholder:text-gray-400"
              />
              <Button 
                type="submit" 
                size="lg" 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Отправка...' : 'Получить консультацию'}
              </Button>
            </form>
          </Card>
        </div>
      </section>

      <ConsultationModal open={isConsultFormOpen} onOpenChange={setIsConsultFormOpen} />
    </div>
  );
};

export default Index;
