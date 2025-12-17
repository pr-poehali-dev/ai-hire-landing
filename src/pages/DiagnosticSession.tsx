import { useState } from 'react';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const timestamp = new Date().toLocaleString('ru-RU');
      const message = `🧠 ЗАЯВКА НА ДИАГНОСТИКУ\n\n👤 Имя: ${formData.name}\n📱 Телефон: ${formData.phone}\n🏢 Компания: ${formData.company}\n❗ Проблема: ${formData.problem}\n⏰ Время: ${timestamp}`;

      await fetch('https://api.telegram.org/bot7801505012:AAGrVPuDHHPZBt8BN0A9EzDzQ8lJLTVvWTs/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: '-4577488859',
          text: message,
          parse_mode: 'HTML'
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
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="hover:bg-white/10"
            >
              <Icon name="ArrowLeft" size={20} />
            </Button>
            <h1 className="text-xl md:text-2xl font-bold">Стратегическая диагностика</h1>
          </div>
          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
            <Icon name="Gift" className="mr-1" size={14} />
            Бесплатно
          </Badge>
        </div>
      </header>

      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Hero Section */}
          <section className="text-center mb-16 animate-in fade-in duration-500">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 mb-6 animate-pulse">
              <Icon name="Brain" size={48} />
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              Не нанимайте сотрудника,
              <br />
              <span className="text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text">
                пока не узнаете корень проблемы
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              90% компаний нанимают не того специалиста, потому что решают симптом, а не проблему. 
              Бесплатная диагностическая сессия покажет, что действительно нужно вашему бизнесу.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-6 py-3 text-base">
                <Icon name="Clock" className="mr-2" size={18} />
                50 минут
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-6 py-3 text-base">
                <Icon name="Video" className="mr-2" size={18} />
                Zoom-сессия
              </Badge>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-6 py-3 text-base">
                <Icon name="FileText" className="mr-2" size={18} />
                Отчёт + план
              </Badge>
            </div>
          </section>

          {/* Problem Statement */}
          <section className="mb-16">
            <Card className="bg-gradient-to-br from-red-900/30 to-orange-900/30 backdrop-blur-xl border-red-500/30 p-8">
              <h3 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Icon name="AlertTriangle" className="text-red-400" size={32} />
                Типичные ошибки при найме
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    icon: 'x-circle',
                    title: 'Нанимают "ещё одного такого же"',
                    desc: 'Но проблема не в количестве, а в процессе или навыках',
                    stat: '47%'
                  },
                  {
                    icon: 'target',
                    title: 'Копируют вакансию конкурентов',
                    desc: 'Не учитывая уникальность своей ситуации и культуры',
                    stat: '38%'
                  },
                  {
                    icon: 'users',
                    title: 'Винят людей, а не систему',
                    desc: 'Проблема часто в коммуникации между отделами',
                    stat: '52%'
                  },
                  {
                    icon: 'trending-down',
                    title: 'Игнорируют корневую причину',
                    desc: 'Например, продажи падают не из-за менеджеров, а из-за плохих лидов',
                    stat: '61%'
                  }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 bg-black/30 rounded-lg p-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                        <Icon name={item.icon as any} className="text-red-400" size={24} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-lg">{item.title}</h4>
                        <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                          {item.stat}
                        </Badge>
                      </div>
                      <p className="text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          {/* What You Get */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h3 className="text-4xl md:text-5xl font-black mb-4">
                Что вы получите от диагностики
              </h3>
              <p className="text-xl text-gray-300">
                Не просто список кандидатов, а стратегическое решение
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                {
                  icon: 'search',
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
                  icon: 'lightbulb',
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
                  icon: 'user-check',
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
                <Card key={i} className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border-white/20 p-8 hover:scale-105 transition-all">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6`}>
                    <Icon name={item.icon as any} size={32} />
                  </div>
                  <h4 className="text-2xl font-bold mb-3">{item.title}</h4>
                  <p className="text-gray-300 mb-6">{item.desc}</p>
                  <ul className="space-y-3">
                    {item.items.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Icon name="check-circle" className="text-green-400 flex-shrink-0 mt-1" size={18} />
                        <span className="text-sm text-gray-400">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </section>

          {/* Process */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h3 className="text-4xl md:text-5xl font-black mb-4">
                Как проходит сессия
              </h3>
              <p className="text-xl text-gray-300">
                Структурированный процесс за 50 минут
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  step: '1',
                  time: '5 мин',
                  title: 'Фрейминг',
                  desc: 'Объясняем цель: не обсуждать вакансию, а найти оптимальное решение для бизнеса',
                  icon: 'target'
                },
                {
                  step: '2',
                  time: '30 мин',
                  title: 'Глубокая диагностика',
                  desc: 'Задаём системные вопросы по 5 блокам: симптомы, процессы, ресурсы, оргструктура, цели',
                  icon: 'activity'
                },
                {
                  step: '3',
                  time: '10 мин',
                  title: 'Совместная гипотеза',
                  desc: 'Озвучиваем возможные корневые причины и точки приложения усилий',
                  icon: 'message-square'
                },
                {
                  step: '4',
                  time: '5 мин',
                  title: 'Следующий шаг',
                  desc: 'Договариваемся о формате отчёта и сроках. ИИ анализирует сессию и готовит решения',
                  icon: 'calendar-check'
                }
              ].map((item, i) => (
                <Card key={i} className="relative bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-xl border-purple-500/30 p-6 hover:scale-105 transition-all">
                  <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center font-black text-2xl shadow-lg">
                    {item.step}
                  </div>
                  <Badge className="mb-4 bg-green-500/20 text-green-300 border-green-500/30">
                    ⏱ {item.time}
                  </Badge>
                  <Icon name={item.icon as any} className="w-12 h-12 mb-4 text-purple-400" />
                  <h4 className="text-xl font-bold mb-3">{item.title}</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">{item.desc}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* Real Results */}
          <section className="mb-16">
            <Card className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl border-blue-500/30 p-8">
              <h3 className="text-3xl font-bold mb-8 text-center">
                Реальные результаты диагностики
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    company: 'E-commerce стартап',
                    problem: 'Хотели нанять SMM-менеджера',
                    solution: 'Диагностика показала: проблема в продукте, не в маркетинге',
                    result: 'Сэкономили 180,000₽ на зарплате. Переделали карточки товаров — конверсия +34%',
                    icon: 'shopping-cart',
                    saved: '180K₽'
                  },
                  {
                    company: 'B2B SaaS',
                    problem: 'Искали Head of Sales',
                    solution: 'Выяснили: текущий коммерческий директор не умеет работать с подчинёнными',
                    result: 'Наняли Sales Enablement Manager для обучения. Рост продаж +120%',
                    icon: 'trending-up',
                    saved: '4 мес'
                  },
                  {
                    company: 'Производство',
                    problem: 'Планировали взять 3 логистов',
                    solution: 'Корень — ручной учёт. Внедрили TMS-систему',
                    result: 'Обошлись текущей командой. Экономия 540,000₽/год на зарплатах',
                    icon: 'truck',
                    saved: '540K₽'
                  }
                ].map((item, i) => (
                  <div key={i} className="bg-black/30 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                        <Icon name={item.icon as any} size={24} />
                      </div>
                      <div>
                        <div className="font-bold">{item.company}</div>
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                          {item.saved}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-3 text-sm">
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
            <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-xl border-purple-500/30 p-8 md:p-12">
              <div className="text-center mb-8">
                <h3 className="text-4xl md:text-5xl font-black mb-4">
                  Запишитесь на бесплатную сессию
                </h3>
                <p className="text-xl text-gray-300 mb-6">
                  Узнайте, что реально нужно вашему бизнесу — найм или другое решение
                </p>
                <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-6 py-3">
                  <Icon name="shield-check" className="text-green-400" size={20} />
                  <span className="text-green-300 font-semibold">
                    Гарантия конфиденциальности — данные не передаются третьим лицам
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
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
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-xl py-8"
                >
                  {isSubmitting ? (
                    <>
                      <Icon name="Loader2" className="mr-2 animate-spin" size={24} />
                      Отправка...
                    </>
                  ) : (
                    <>
                      <Icon name="Calendar" className="mr-2" size={24} />
                      Записаться на диагностику
                    </>
                  )}
                </Button>

                <p className="text-center text-sm text-gray-400">
                  После отправки мы свяжемся с вами в течение 2 часов для согласования времени сессии
                </p>
              </form>
            </Card>
          </section>

          {/* Why Free */}
          <section className="mt-16">
            <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border-gray-700/30 p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-4 flex items-center justify-center gap-3">
                  <Icon name="help-circle" className="text-purple-400" size={28} />
                  Почему это бесплатно?
                </h3>
              </div>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <Icon name="handshake" className="w-12 h-12 mx-auto mb-3 text-blue-400" />
                  <h4 className="font-bold mb-2">Строим доверие</h4>
                  <p className="text-sm text-gray-400">
                    Показываем экспертизу до оплаты. Если поймёте ценность — продолжим работать
                  </p>
                </div>
                <div>
                  <Icon name="filter" className="w-12 h-12 mx-auto mb-3 text-purple-400" />
                  <h4 className="font-bold mb-2">Фильтруем задачи</h4>
                  <p className="text-sm text-gray-400">
                    Не все запросы требуют найма. Честно говорим, если есть другое решение
                  </p>
                </div>
                <div>
                  <Icon name="target" className="w-12 h-12 mx-auto mb-3 text-green-400" />
                  <h4 className="font-bold mb-2">Ищем Win-Win</h4>
                  <p className="text-sm text-gray-400">
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
