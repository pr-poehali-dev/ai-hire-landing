import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export default function DiagnosticSession() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', phone: '', company: '', problem: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const diagnosticSteps = [
    {
      title: 'Фрейминг проблемы',
      description: 'Определяем истинную цель и контекст бизнеса',
      icon: 'Focus',
      color: 'from-blue-500 to-cyan-500',
      progress: 0
    },
    {
      title: 'Анализ симптомов',
      description: 'Выявляем видимые признаки и их влияние на бизнес',
      icon: 'Stethoscope',
      color: 'from-purple-500 to-pink-500',
      progress: 25
    },
    {
      title: 'Исследование процессов',
      description: 'Разбираем workflow и находим узкие места',
      icon: 'Workflow',
      color: 'from-orange-500 to-red-500',
      progress: 50
    },
    {
      title: 'Корневая причина',
      description: 'Определяем настоящий источник проблемы',
      icon: 'ScanSearch',
      color: 'from-green-500 to-emerald-500',
      progress: 75
    },
    {
      title: 'Решения и план',
      description: 'Формируем 3+ варианта с прогнозом результатов',
      icon: 'ClipboardCheck',
      color: 'from-yellow-500 to-amber-500',
      progress: 100
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % diagnosticSteps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      if (!contentRef.current) return;

      const formSection = document.getElementById('booking-form');
      const originalFormDisplay = formSection?.style.display || '';
      if (formSection) formSection.style.display = 'none';

      const contactSection = document.createElement('section');
      contactSection.className = 'mb-12 md:mb-16';
      contactSection.innerHTML = `
        <div class="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-xl border border-purple-500/30 rounded-lg p-8 text-center">
          <h3 class="text-3xl font-black mb-6">Контакты</h3>
          <div class="space-y-4 text-lg">
            <div class="flex items-center justify-center gap-3">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>+7 (999) 123-45-67</span>
            </div>
            <div class="flex items-center justify-center gap-3">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>info@recruiting-agency.ru</span>
            </div>
            <div class="flex items-center justify-center gap-3">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <span>www.recruiting-agency.ru</span>
            </div>
          </div>
        </div>
      `;
      
      contentRef.current?.appendChild(contactSection);

      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#000000',
        logging: false
      });

      contactSection.remove();
      if (formSection) formSection.style.display = originalFormDisplay;

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      let heightLeft = imgHeight * ratio;
      let position = 0;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      heightLeft -= pdfHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight * ratio;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, imgHeight * ratio);
        heightLeft -= pdfHeight;
      }

      pdf.save('strategicheskaya-diagnostika.pdf');
      
      toast({
        title: 'Презентация скачана',
        description: 'PDF файл успешно сохранён'
      });
    } catch (error) {
      toast({
        title: 'Ошибка скачивания',
        description: 'Попробуйте еще раз',
        variant: 'destructive'
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const timestamp = new Date().toLocaleString('ru-RU');

      const crmResponse = await fetch('https://functions.poehali.dev/19fedd69-26c7-42ad-b2c4-72e66ff282e6', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          company: formData.company,
          vacancy: 'Стратегическая диагностика',
          source: 'diagnostic-form',
          priority: 'high',
          notes: `Проблема: ${formData.problem}`
        })
      });

      const crmData = await crmResponse.json();

      if (!crmData.success) {
        throw new Error('CRM integration failed');
      }

      await fetch('https://functions.poehali.dev/a7d1db0c-db9c-4d2f-b64e-42c388aed5d5', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          source: 'Форма диагностики',
          form_type: 'Стратегическая диагностика',
          page: window.location.href,
          timestamp: timestamp,
          company: formData.company,
          problem: formData.problem
        })
      });

      setFormData({ name: '', phone: '', company: '', problem: '' });
      navigate('/thank-you');
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="hover:bg-white/10 flex-shrink-0"
            >
              <Icon name="ArrowLeft" size={20} />
            </Button>
            <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold truncate">Стратегическая диагностика</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              variant="outline"
              size="sm"
              className="hidden sm:flex border-purple-500/50 hover:bg-purple-500/20 text-white"
            >
              <Icon name={isDownloading ? "Loader2" : "Download"} className={`mr-2 ${isDownloading ? 'animate-spin' : ''}`} size={16} />
              {isDownloading ? 'Скачивание...' : 'Скачать PDF'}
            </Button>
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30 flex-shrink-0 text-xs md:text-sm">
              <Icon name="Gift" className="mr-1" size={12} />
              Бесплатно
            </Badge>
          </div>
        </div>
      </header>

      <div className="pt-24 pb-12 px-4" ref={contentRef}>
        <div className="container mx-auto max-w-6xl">
          {/* Hero Section */}
          <section className="mb-12 md:mb-16">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 mb-4 md:mb-6 animate-pulse">
                <Icon name="Brain" size={40} className="md:hidden" />
                <Icon name="Brain" size={48} className="hidden md:block" />
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-6 leading-tight max-w-5xl mx-auto">
                Не нанимайте сотрудника,{' '}
                <span className="text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text">
                  пока не узнаете корень проблемы
                </span>
              </h2>
            </div>

            {/* Interactive Diagnostic Video */}
            <div className="relative max-w-4xl mx-auto mb-8">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-white/10 shadow-2xl">
                {/* Main diagnostic visualization */}
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  {diagnosticSteps.map((step, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                        index === currentStep 
                          ? 'opacity-100 scale-100' 
                          : index === (currentStep - 1 + diagnosticSteps.length) % diagnosticSteps.length
                          ? 'opacity-0 scale-95'
                          : 'opacity-0 scale-105'
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center h-full text-center px-4">
                        <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-lg animate-pulse`}>
                          <Icon name={step.icon as any} size={48} className="text-white" />
                        </div>
                        <h3 className="text-2xl md:text-4xl font-black mb-4 text-white">
                          {step.title}
                        </h3>
                        <p className="text-base md:text-xl text-gray-300 max-w-lg">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-800">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-1000 ease-linear"
                    style={{ width: `${diagnosticSteps[currentStep].progress}%` }}
                  />
                </div>

                {/* Video controls UI */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-xs md:text-sm font-medium text-white">
                      Этап {currentStep + 1} из {diagnosticSteps.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-2">
                    <Icon name="play" size={14} className="text-white" />
                    <span className="text-xs md:text-sm font-medium text-white">
                      {((currentStep + 1) * 10)}:00
                    </span>
                  </div>
                </div>

                {/* Step indicators */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {diagnosticSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentStep 
                          ? 'bg-white w-6' 
                          : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Description and badges */}
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 leading-relaxed">
                90% компаний нанимают не того специалиста, потому что решают симптом, а не проблему. 
                Бесплатная диагностическая сессия покажет, что действительно нужно вашему бизнесу.
              </p>
              <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-6">
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-4 py-2 md:px-6 md:py-3 text-sm md:text-base">
                  <Icon name="Timer" className="mr-1 md:mr-2" size={16} />
                  50 минут
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-4 py-2 md:px-6 md:py-3 text-sm md:text-base">
                  <Icon name="Video" className="mr-1 md:mr-2" size={16} />
                  Zoom-сессия
                </Badge>
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-4 py-2 md:px-6 md:py-3 text-sm md:text-base">
                  <Icon name="FileCheck" className="mr-1 md:mr-2" size={16} />
                  Отчёт + план
                </Badge>
              </div>
              
              <Button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                variant="outline"
                size="lg"
                className="sm:hidden border-purple-500/50 hover:bg-purple-500/20 text-white"
              >
                <Icon name={isDownloading ? "Loader2" : "Download"} className={`mr-2 ${isDownloading ? 'animate-spin' : ''}`} size={20} />
                {isDownloading ? 'Скачивание...' : 'Скачать презентацию PDF'}
              </Button>
            </div>
          </section>

          {/* Problem Statement */}
          <section className="mb-12 md:mb-16">
            <Card className="bg-gradient-to-br from-red-900/30 to-orange-900/30 backdrop-blur-xl border-red-500/30 p-4 sm:p-6 md:p-8">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                <Icon name="TriangleAlert" className="text-red-400 flex-shrink-0" size={24} />
                <span>Типичные ошибки при найме</span>
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                {[
                  {
                    icon: 'UserPlus',
                    title: 'Нанимают "ещё одного такого же"',
                    desc: 'Но проблема не в количестве, а в процессе или навыках',
                    stat: '47%'
                  },
                  {
                    icon: 'Copy',
                    title: 'Копируют вакансию конкурентов',
                    desc: 'Не учитывая уникальность своей ситуации и культуры',
                    stat: '38%'
                  },
                  {
                    icon: 'UserX',
                    title: 'Винят людей, а не систему',
                    desc: 'Проблема часто в коммуникации между отделами',
                    stat: '52%'
                  },
                  {
                    icon: 'Ban',
                    title: 'Игнорируют корневую причину',
                    desc: 'Например, продажи падают не из-за менеджеров, а из-за плохих лидов',
                    stat: '61%'
                  }
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 md:gap-4 bg-black/30 rounded-lg p-3 md:p-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                        <Icon name={item.icon as any} className="text-red-400" size={20} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-bold text-sm sm:text-base lg:text-lg leading-tight">{item.title}</h4>
                        <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-xs flex-shrink-0">
                          {item.stat}
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-xs sm:text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          {/* What You Get */}
          <section className="mb-12 md:mb-16">
            <div className="text-center mb-8 md:mb-12">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 md:mb-4 leading-tight">
                Что вы получите от диагностики
              </h3>
              <p className="text-base sm:text-lg md:text-xl text-gray-300">
                Не просто список кандидатов, а стратегическое решение
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
              {[
                {
                  icon: 'Microscope',
                  title: 'Диагноз проблемы',
                  desc: 'Выявляем корневую причину через анализ процессов, коммуникаций и целей',
                  color: 'from-blue-600 to-cyan-600',
                  items: [
                    'Где реально «рвётся» процесс',
                    'Почему предыдущие попытки не сработали',
                    'Что блокирует текущих сотрудников'
                  ]
                },
                {
                  icon: 'Lightbulb',
                  title: '3+ варианта решений',
                  desc: 'Найм — это только один из путей. Возможно, есть быстрее и дешевле',
                  color: 'from-purple-600 to-pink-600',
                  items: [
                    'Оптимизация без найма',
                    'Изменение процессов/инструментов',
                    'Перераспределение ролей'
                  ]
                },
                {
                  icon: 'BadgeCheck',
                  title: 'Точный портрет специалиста',
                  desc: 'Если найм нужен — получите профиль того, кто РЕАЛЬНО решит задачу',
                  color: 'from-green-600 to-emerald-600',
                  items: [
                    'Гибридные навыки под вашу ситуацию',
                    'Критерии культурной совместимости',
                    'План адаптации на 90 дней'
                  ]
                }
              ].map((item, i) => (
                <Card key={i} className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border-white/20 p-4 sm:p-6 md:p-8 hover:scale-105 transition-all">
                  <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 md:mb-6`}>
                    <Icon name={item.icon as any} size={24} className="md:hidden" />
                    <Icon name={item.icon as any} size={32} className="hidden md:block" />
                  </div>
                  <h4 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 md:mb-3">{item.title}</h4>
                  <p className="text-gray-300 mb-4 md:mb-6 text-sm md:text-base">{item.desc}</p>
                  <ul className="space-y-2 md:space-y-3">
                    {item.items.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Icon name="CircleCheck" className="text-green-400 flex-shrink-0 mt-0.5 md:mt-1" size={16} />
                        <span className="text-xs sm:text-sm text-gray-400">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </section>

          {/* Process */}
          <section className="mb-12 md:mb-16">
            <div className="text-center mb-8 md:mb-12">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 md:mb-4">
                Как проходит сессия
              </h3>
              <p className="text-base sm:text-lg md:text-xl text-gray-300">
                Структурированный процесс за 50 минут
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[
                {
                  step: '1',
                  time: '5 мин',
                  title: 'Фрейминг',
                  desc: 'Объясняем цель: не обсуждать вакансию, а найти оптимальное решение для бизнеса',
                  icon: 'Crosshair'
                },
                {
                  step: '2',
                  time: '30 мин',
                  title: 'Глубокая диагностика',
                  desc: 'Задаём системные вопросы по 5 блокам: симптомы, процессы, ресурсы, оргструктура, цели',
                  icon: 'Stethoscope'
                },
                {
                  step: '3',
                  time: '10 мин',
                  title: 'Совместная гипотеза',
                  desc: 'Озвучиваем возможные корневые причины и точки приложения усилий',
                  icon: 'MessageCircle'
                },
                {
                  step: '4',
                  time: '5 мин',
                  title: 'Следующий шаг',
                  desc: 'Договариваемся о формате отчёта и сроках. ИИ анализирует сессию и готовит решения',
                  icon: 'CalendarCheck'
                }
              ].map((item, i) => (
                <Card key={i} className="relative bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-xl border-purple-500/30 p-4 sm:p-6 hover:scale-105 transition-all">
                  <div className="absolute -top-3 -right-3 w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center font-black text-xl md:text-2xl shadow-lg">
                    {item.step}
                  </div>
                  <Badge className="mb-3 md:mb-4 bg-green-500/20 text-green-300 border-green-500/30 text-xs md:text-sm">
                    ⏱ {item.time}
                  </Badge>
                  <Icon name={item.icon as any} className="w-10 h-10 md:w-12 md:h-12 mb-3 md:mb-4 text-purple-400" />
                  <h4 className="text-base sm:text-lg md:text-xl font-bold mb-2 md:mb-3">{item.title}</h4>
                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* Real Results */}
          <section className="mb-12 md:mb-16">
            <Card className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl border-blue-500/30 p-4 sm:p-6 md:p-8">
              <h3 className="text-2xl sm:text-3xl font-bold mb-6 md:mb-8 text-center">
                Реальные результаты диагностики
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {[
                  {
                    company: 'E-commerce стартап',
                    problem: 'Хотели нанять SMM-менеджера',
                    solution: 'Диагностика показала: проблема в продукте, не в маркетинге',
                    result: 'Сэкономили 180,000₽ на зарплате. Переделали карточки товаров — конверсия +34%',
                    icon: 'ShoppingBag',
                    saved: '180K₽'
                  },
                  {
                    company: 'B2B SaaS',
                    problem: 'Искали Head of Sales',
                    solution: 'Выяснили: текущий коммерческий директор не умеет работать с подчинёнными',
                    result: 'Наняли Sales Enablement Manager для обучения. Рост продаж +120%',
                    icon: 'ChartLine',
                    saved: '4 мес'
                  },
                  {
                    company: 'Производство',
                    problem: 'Планировали взять 3 логистов',
                    solution: 'Корень — ручной учёт. Внедрили TMS-систему',
                    result: 'Обошлись текущей командой. Экономия 540,000₽/год на зарплатах',
                    icon: 'Package',
                    saved: '540K₽'
                  }
                ].map((item, i) => (
                  <div key={i} className="bg-black/30 rounded-lg p-4 md:p-6">
                    <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <Icon name={item.icon as any} size={20} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-sm md:text-base truncate">{item.company}</div>
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                          {item.saved}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2 md:space-y-3 text-xs sm:text-sm">
                      <div>
                        <div className="text-red-400 font-semibold mb-1">❌ Запрос:</div>
                        <div className="text-gray-400">{item.problem}</div>
                      </div>
                      <div>
                        <div className="text-blue-400 font-semibold mb-1">🔍 Диагноз:</div>
                        <div className="text-gray-400">{item.solution}</div>
                      </div>
                      <div>
                        <div className="text-green-400 font-semibold mb-1">✅ Результат:</div>
                        <div className="text-gray-300 font-medium">{item.result}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          {/* CTA Form */}
          <section id="booking-form">
            <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-xl border-purple-500/30 p-4 sm:p-6 md:p-8 lg:p-12">
              <div className="text-center mb-6 md:mb-8">
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 md:mb-4">
                  Запишитесь на бесплатную сессию
                </h3>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 mb-4 md:mb-6">
                  Узнайте, что реально нужно вашему бизнесу — найм или другое решение
                </p>
                <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-3 py-2 md:px-6 md:py-3 max-w-full">
                  <Icon name="shield-check" className="text-green-400 flex-shrink-0" size={18} />
                  <span className="text-green-300 font-semibold text-xs sm:text-sm md:text-base">
                    Гарантия конфиденциальности
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4 md:space-y-6">
                <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Ваше имя *</label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Иван Петров"
                      className="bg-black/30 border-white/20 focus:border-purple-500 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Телефон *</label>
                    <Input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+7 (900) 123-45-67"
                      className="bg-black/30 border-white/20 focus:border-purple-500 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Компания *</label>
                  <Input
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="ООО «Рога и Копыта»"
                    className="bg-black/30 border-white/20 focus:border-purple-500 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Кратко опишите проблему *
                  </label>
                  <Textarea
                    required
                    value={formData.problem}
                    onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                    placeholder="Падают продажи / Не можем найти разработчика / Высокая текучка..."
                    className="min-h-32 bg-black/30 border-white/20 focus:border-purple-500 text-white"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-base sm:text-lg md:text-xl py-6 md:py-8"
                >
                  {isSubmitting ? (
                    <>
                      <Icon name="Loader2" className="mr-2 animate-spin" size={20} />
                      Отправка...
                    </>
                  ) : (
                    <>
                      <Icon name="Calendar" className="mr-2" size={20} />
                      Записаться на диагностику
                    </>
                  )}
                </Button>

                <p className="text-center text-xs sm:text-sm text-gray-400">
                  После отправки мы свяжемся с вами в течение 2 часов для согласования времени сессии
                </p>
              </form>
            </Card>
          </section>

          {/* Why Free */}
          <section className="mt-12 md:mt-16">
            <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border-gray-700/30 p-4 sm:p-6 md:p-8">
              <div className="text-center mb-4 md:mb-6">
                <h3 className="text-xl sm:text-2xl font-bold mb-3 md:mb-4 flex items-center justify-center gap-2 md:gap-3">
                  <Icon name="CircleHelp" className="text-purple-400 flex-shrink-0" size={24} />
                  <span>Почему это бесплатно?</span>
                </h3>
              </div>
              <div className="grid sm:grid-cols-3 gap-4 md:gap-6 text-center">
                <div>
                  <Icon name="Handshake" className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 text-blue-400" />
                  <h4 className="font-bold mb-1 md:mb-2 text-sm md:text-base">Строим доверие</h4>
                  <p className="text-xs sm:text-sm text-gray-400">
                    Показываем экспертизу до оплаты. Если поймёте ценность — продолжим работать
                  </p>
                </div>
                <div>
                  <Icon name="Sliders" className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 text-purple-400" />
                  <h4 className="font-bold mb-1 md:mb-2 text-sm md:text-base">Фильтруем задачи</h4>
                  <p className="text-xs sm:text-sm text-gray-400">
                    Не все запросы требуют найма. Честно говорим, если есть другое решение
                  </p>
                </div>
                <div>
                  <Icon name="Trophy" className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 text-green-400" />
                  <h4 className="font-bold mb-1 md:mb-2 text-sm md:text-base">Ищем Win-Win</h4>
                  <p className="text-xs sm:text-sm text-gray-400">
                    Работаем только с задачами, где уверены в результате. Так все довольны
                  </p>
                </div>
              </div>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}