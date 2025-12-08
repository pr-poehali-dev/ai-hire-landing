import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const ITSpecialists = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', phone: '' });
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
          source: 'it_specialists_contact_form',
          form_type: 'specialization_page',
          page: 'it_specialists',
          vacancy: 'IT-специалист'
        })
      });
      
      if (!response.ok) throw new Error('Failed to submit');
      
      toast({ title: 'Заявка отправлена! 💻', description: 'Ваш tech-рекрутер свяжется с вами в течение 1 часа' });
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-blue-500/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center">
              <Icon name="code" className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              1 DAY HR
            </span>
          </Link>
          <Button onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })} size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
            Найти IT-специалистов
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(6,182,212,0.15),transparent_50%)]" />
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center max-w-5xl mx-auto mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 border-0 text-white px-6 py-2 text-lg">
              💎 TECH RECRUITING PREMIUM
            </Badge>
            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                IT-таланты
              </span>
              <br />
              <span className="text-white">
                которых не найти на HH
              </span>
            </h1>
            <p className="text-2xl md:text-3xl text-gray-300 mb-12 leading-relaxed">
              Доступ к 15,000+ IT-специалистов, включая пассивных кандидатов
              <br />
              <span className="text-blue-400 font-bold">Проверенные tech-скиллы + культурная совместимость</span>
            </p>
            
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              {[
                { value: '520+', label: 'Разработчиков нанято', icon: 'code' },
                { value: '92%', label: 'Проходят испытательный', icon: 'shield-check' },
                { value: '8.5/10', label: 'Средний грейд', icon: 'star' },
                { value: '48ч', label: 'До первых кандидатов', icon: 'zap' }
              ].map((stat, i) => (
                <Card key={i} className="bg-white/5 backdrop-blur-lg border-blue-500/30 p-6 hover:bg-white/10 transition-all">
                  <Icon name={stat.icon as any} className="w-10 h-10 mx-auto mb-3 text-blue-400" />
                  <div className="text-4xl font-black text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Exclusive IT Benefits */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-blue-900/10 to-transparent">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-white">
              Premium IT-рекрутинг
            </h2>
            <p className="text-2xl text-blue-300">Технологии, которые используют FAANG-компании</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: 'code-2',
                title: 'Live Coding проверка',
                desc: 'Все кандидаты решают реальные задачи на вашем стеке перед встречей с вами',
                bonus: 'Экономия 20+ часов на собеседованиях'
              },
              {
                icon: 'github',
                title: 'Аудит GitHub',
                desc: 'Глубокий анализ кода: архитектура, тесты, code review, вклад в open source',
                bonus: 'AI-оценка качества кода'
              },
              {
                icon: 'database',
                title: 'Tech Stack Match',
                desc: 'Подбор по 50+ технологиям: языки, фреймворки, БД, DevOps, архитектура',
                bonus: '98% совпадение требований'
              },
              {
                icon: 'users',
                title: 'Хантинг из лидеров',
                desc: 'Переманиваем сильных разработчиков из Яндекс, СБЕР, Тинькофф и стартапов',
                bonus: 'Доступ к закрытым кандидатам'
              },
              {
                icon: 'brain',
                title: 'Soft Skills + IQ',
                desc: 'Оценка коммуникации, английского, обучаемости, работы в команде',
                bonus: 'Психометрика + логические тесты'
              },
              {
                icon: 'award',
                title: 'Trial Period Support',
                desc: 'Менторинг в первые 3 месяца: 1-on-1, фидбэк, решение конфликтов',
                bonus: 'Гарантия удержания'
              }
            ].map((item, i) => (
              <Card key={i} className="relative bg-gradient-to-br from-blue-900/30 to-cyan-900/20 backdrop-blur-xl border-blue-500/30 p-8 hover:scale-105 transition-all overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-full blur-3xl group-hover:scale-150 transition-transform" />
                <Icon name={item.icon as any} className="w-16 h-16 mb-6 text-blue-400" />
                <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-gray-300 mb-4 leading-relaxed">{item.desc}</p>
                <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/50 text-green-300">
                  ⚡ {item.bonus}
                </Badge>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Positions */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-white">
              Кого мы находим
            </h2>
            <p className="text-2xl text-gray-300">Полный спектр IT-специалистов</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { role: 'Frontend', stack: 'React, Vue, Angular, Next.js', icon: 'monitor', count: '180+' },
              { role: 'Backend', stack: 'Python, Node, Go, Java, .NET', icon: 'server', count: '210+' },
              { role: 'Fullstack', stack: 'MERN, MEAN, Django, Rails', icon: 'layers', count: '95+' },
              { role: 'Mobile', stack: 'iOS, Android, React Native, Flutter', icon: 'smartphone', count: '78+' },
              { role: 'DevOps', stack: 'K8s, Docker, CI/CD, AWS, GCP', icon: 'cloud-cog', count: '64+' },
              { role: 'QA', stack: 'Автотесты, Performance, Security', icon: 'bug', count: '52+' },
              { role: 'Data', stack: 'ML, DS, DWH, BigData, Analytics', icon: 'database', count: '48+' },
              { role: 'Архитекторы', stack: 'Solution, Tech Lead, Principal', icon: 'network', count: '32+' }
            ].map((pos, i) => (
              <Card key={i} className="bg-white/5 backdrop-blur-lg border-blue-500/20 p-6 hover:bg-white/10 transition-all">
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                    <Icon name={pos.icon as any} className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{pos.role}</h3>
                    <p className="text-sm text-gray-400 mb-3">{pos.stack}</p>
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                      {pos.count} специалистов
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-transparent via-blue-900/10 to-transparent">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-white">
              Tech Recruitment Pipeline
            </h2>
            <p className="text-2xl text-gray-300">Проверенный процесс найма IT-талантов</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                step: '01', 
                title: 'Deep Tech Discovery', 
                desc: 'Разбираем архитектуру, стек, задачи, команду. Формируем tech-профиль идеального кандидата',
                time: '4-6 часов',
                icon: 'search'
              },
              { 
                step: '02', 
                title: 'AI Search + Headhunting', 
                desc: 'Поиск в 10+ источниках + переманивание из конкурентов. Фокус на пассивных кандидатах',
                time: '24-36 часов',
                icon: 'target'
              },
              { 
                step: '03', 
                title: 'Technical Screening', 
                desc: 'Coding challenge, GitHub review, soft skills interview, референс-чек от прошлых тимлидов',
                time: '12-18 часов',
                icon: 'check-circle'
              }
            ].map((item, i) => (
              <Card key={i} className="relative bg-gradient-to-br from-blue-900/40 to-transparent backdrop-blur-xl border-blue-500/30 p-8 hover:scale-105 transition-all overflow-hidden">
                <div className="absolute -top-6 -right-6 text-9xl font-black text-blue-500/10">
                  {item.step}
                </div>
                <Icon name={item.icon as any} className="w-14 h-14 mb-6 text-blue-400 relative z-10" />
                <Badge className="mb-4 bg-green-500/20 text-green-300 border-green-500/30">
                  ⏱ {item.time}
                </Badge>
                <h3 className="text-2xl font-bold text-white mb-4 relative z-10">{item.title}</h3>
                <p className="text-gray-300 leading-relaxed relative z-10">{item.desc}</p>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Card className="inline-block bg-gradient-to-r from-blue-900/40 to-cyan-900/40 backdrop-blur-xl border-blue-500/30 p-8">
              <div className="flex items-center gap-4">
                <Icon name="rocket" className="w-12 h-12 text-blue-400" />
                <div className="text-left">
                  <div className="text-3xl font-black text-white mb-1">48 часов</div>
                  <div className="text-gray-300">от заявки до презентации кандидатов</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="relative py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <Card className="bg-gradient-to-br from-blue-900/40 via-cyan-900/30 to-blue-900/40 backdrop-blur-xl border-blue-500/30 p-12">
            <div className="text-center mb-10">
              <h2 className="text-5xl font-black text-white mb-4">
                Найдём вашего dev за 48 часов
              </h2>
              <p className="text-xl text-gray-300 mb-6">
                Оставьте заявку и получите:
              </p>
              <div className="space-y-3 text-left max-w-xl mx-auto">
                {[
                  'Досье на 3-5 проверенных IT-специалистов',
                  'Результаты coding challenge на вашем стеке',
                  'GitHub-аудит и примеры кода',
                  'Видео-интервью и референсы',
                  'Tech Stack совместимость 95%+',
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
              <div>
                <Input
                  placeholder="Ваше имя"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="bg-white/10 border-blue-500/30 text-white placeholder:text-gray-400 text-lg py-6"
                />
              </div>
              <div>
                <Input
                  placeholder="Ваш телефон"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                  className="bg-white/10 border-blue-500/30 text-white placeholder:text-gray-400 text-lg py-6"
                />
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                size="lg"
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-xl py-7 font-bold"
              >
                {isSubmitting ? 'Отправка...' : 'Получить IT-кандидатов 💻'}
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

export default ITSpecialists;