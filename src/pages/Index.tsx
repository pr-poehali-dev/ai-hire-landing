import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [stats, setStats] = useState({ totalClosed: 1258, inProgress: 4 });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [skillScores, setSkillScores] = useState({
    communication: 0,
    motivation: 0,
    stress: 0,
    leadership: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        totalClosed: prev.totalClosed + Math.floor(Math.random() * 2),
        inProgress: 3 + Math.floor(Math.random() * 3)
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isAnalyzing) {
      const steps = ['Загрузка видео...', 'Анализ речи...', 'Оценка эмоций...', 'Формирование профиля...', 'Анализ завершен!'];
      const interval = setInterval(() => {
        setAnalysisStep(prev => {
          if (prev < steps.length - 1) return prev + 1;
          setIsAnalyzing(false);
          return prev;
        });
      }, 1500);

      const skillInterval = setInterval(() => {
        setSkillScores(prev => ({
          communication: Math.min(prev.communication + Math.random() * 15, 94),
          motivation: Math.min(prev.motivation + Math.random() * 12, 87),
          stress: Math.min(prev.stress + Math.random() * 10, 83),
          leadership: Math.min(prev.leadership + Math.random() * 8, 78)
        }));
      }, 100);

      return () => {
        clearInterval(interval);
        clearInterval(skillInterval);
      };
    }
  }, [isAnalyzing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Заявка отправлена! 🚀', description: 'Мы свяжемся с вами в течение 2 часов' });
    setFormData({ name: '', phone: '' });
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const startDemo = () => {
    setIsAnalyzing(true);
    setAnalysisStep(0);
    setSkillScores({ communication: 0, motivation: 0, stress: 0, leadership: 0 });
  };

  const teamMembers = [
    { name: 'Дарья Коломанова', role: 'Ведущий HR-специалист', spec: 'IT-рекрутмент', exp: '8 лет', hires: '250+', img: 'https://i.pravatar.cc/150?img=5' },
    { name: 'Ангелина Малиновская', role: 'Senior HR-менеджер', spec: 'Продажи и маркетинг', exp: '6 лет', hires: '180+', img: 'https://i.pravatar.cc/150?img=9' },
    { name: 'Дарья Морозова', role: 'Team Lead HR', spec: 'Стратегический найм', exp: '10 лет', hires: '320+', img: 'https://i.pravatar.cc/150?img=10' },
    { name: 'Марианна Ильясовна', role: 'HR-специалист', spec: 'Маркетплейсы', exp: '5 лет', hires: '150+', img: 'https://i.pravatar.cc/150?img=16' }
  ];

  const testimonials = [
    { name: 'Дмитрий Козлов', position: 'Tech Lead', company: 'NeoTech Solutions', text: 'AI-анализ выявил кандидата, который работал с похожей архитектурой в банковской сфере. Это был неочевидный выбор, но именно то, что нам было нужно.', rating: 5, img: 'https://i.pravatar.cc/150?img=12' },
    { name: 'Елена Соколова', position: 'Head of AI Department', company: 'FinServe Pro', text: 'Искали полгода классическими методами. 1 DAY HR нашли идеального кандидата за сутки. Система AI-анализа показала совместимость с нашей командой 94%.', rating: 5, img: 'https://i.pravatar.cc/150?img=20' },
    { name: 'Максим Петров', position: 'Product Manager', company: 'MobileHub', text: 'Боялись, что проект встанет. Но за сутки нашли специалиста, который не только закрыл задачу, но и провёл рефакторинг, улучшив всё приложение.', rating: 5, img: 'https://i.pravatar.cc/150?img=13' },
    { name: 'Анна Смирнова', position: 'COO', company: 'MegaSell', text: 'Критически важно было найти человека быстро. 1 DAY HR справились за сутки, и это был именно тот специалист, который нам был нужен.', rating: 5, img: 'https://i.pravatar.cc/150?img=23' },
    { name: 'Алексей Морозов', position: 'Sales Director', company: 'TelecomPro', text: 'ИИ-анализ показал скрытые навыки кандидата, которые мы бы упустили при обычном подборе. Результат превзошёл все ожидания!', rating: 5, img: 'https://i.pravatar.cc/150?img=33' },
    { name: 'Ирина Федорова', position: 'Head of Sales', company: 'ConnectPlus', text: 'Кандидат знал наших конкурентов изнутри. AI-система оценила это как преимущество. За месяц вернул трёх крупных клиентов.', rating: 5, img: 'https://i.pravatar.cc/150?img=47' }
  ];

  return (
    <div className="min-h-screen relative">
      <div className="fixed top-20 left-10 w-64 h-64 bg-primary/20 rounded-full blur-orb animate-pulse" style={{ animationDuration: '4s' }}></div>
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-secondary/15 rounded-full blur-orb animate-pulse" style={{ animationDuration: '6s' }}></div>
      <div className="fixed top-1/2 left-1/2 w-80 h-80 bg-accent/10 rounded-full blur-orb animate-pulse" style={{ animationDuration: '5s' }}></div>

      <header className="fixed top-0 left-0 right-0 z-50 glass animate-fade-in">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 hover-scale cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-glow">
                <Icon name="Sparkles" size={20} className="text-white animate-pulse" />
              </div>
              <span className="text-xl font-bold neon-text">1 DAY HR</span>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <button onClick={() => scrollToSection('demo')} className="text-sm hover:text-primary transition-all hover:scale-110">AI Демо</button>
              <button onClick={() => scrollToSection('benefits')} className="text-sm hover:text-primary transition-all hover:scale-110">Преимущества</button>
              <button onClick={() => scrollToSection('pricing')} className="text-sm hover:text-primary transition-all hover:scale-110">Тарифы</button>
              <button onClick={() => scrollToSection('team')} className="text-sm hover:text-primary transition-all hover:scale-110">Команда</button>
            </nav>

            <Button onClick={() => scrollToSection('cta')} className="neon-glow bg-gradient-to-r from-primary to-secondary hover:opacity-90 hover:scale-105 transition-all">
              Найти сотрудника
            </Button>
          </div>
        </div>
      </header>

      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge className="glass text-lg px-6 py-2 neon-glow animate-fade-in hover:scale-110 transition-all cursor-pointer">
              ✨ Первое HR-агентство с AI подбором
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight neon-text animate-fade-in" style={{ animationDelay: '0.2s' }}>
              НАЙДЕМ СОТРУДНИКА<br />за 24 часа
            </h1>
            
            <p className="text-2xl text-muted-foreground animate-fade-in" style={{ animationDelay: '0.4s' }}>
              Или вернем деньги. Гарантия 100%
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-lg animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="flex items-center gap-2 hover-scale cursor-pointer">
                <Icon name="Brain" size={20} className="text-primary animate-pulse" />
                <span>ИИ-анализ навыков</span>
              </div>
              <div className="flex items-center gap-2 hover-scale cursor-pointer">
                <Icon name="Shield" size={20} className="text-secondary animate-pulse" style={{ animationDelay: '0.5s' }} />
                <span>Гарантия замены</span>
              </div>
              <div className="flex items-center gap-2 hover-scale cursor-pointer">
                <Icon name="Target" size={20} className="text-accent animate-pulse" style={{ animationDelay: '1s' }} />
                <span>Ролевые проверки</span>
              </div>
            </div>

            <div className="flex justify-center gap-4 pt-4 animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <Button size="lg" onClick={() => scrollToSection('cta')} className="neon-glow bg-gradient-to-r from-primary to-secondary hover:opacity-90 hover:scale-110 transition-all text-xl px-12 py-8">
                🔥 Найти сотрудника
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="demo" className="py-20 px-4 bg-muted/5">
        <div className="container mx-auto">
          <div className="text-center mb-16 space-y-4">
            <Badge className="text-lg px-6 py-2 neon-glow animate-pulse">🤖 Интерактивная демонстрация</Badge>
            <h2 className="text-4xl md:text-5xl font-bold neon-text">Как мы находим лучших кандидатов</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              AI анализирует видео-интервью и оценивает компетенции
            </p>
          </div>

          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
            <Card className="glass-dark p-8 space-y-6 animate-scale-in hover:neon-glow transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon name="Star" size={24} className="text-accent" />
                  <h3 className="text-2xl font-bold">Анализ завершен</h3>
                </div>
                <Badge className="bg-primary/20 text-primary neon-glow">AI-A</Badge>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Коммуникация</span>
                    <span className="font-bold">{Math.round(skillScores.communication)}%</span>
                  </div>
                  <Progress value={skillScores.communication} className="h-3 bg-muted/50" style={{ '--progress-background': 'linear-gradient(to right, #8B5CF6, #A855F7)' } as React.CSSProperties} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Мотивация</span>
                    <span className="font-bold">{Math.round(skillScores.motivation)}%</span>
                  </div>
                  <Progress value={skillScores.motivation} className="h-3 bg-muted/50" style={{ '--progress-background': 'linear-gradient(to right, #10B981, #34D399)' } as React.CSSProperties} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Стрессоустойчивость</span>
                    <span className="font-bold">{Math.round(skillScores.stress)}%</span>
                  </div>
                  <Progress value={skillScores.stress} className="h-3 bg-muted/50" style={{ '--progress-background': 'linear-gradient(to right, #0EA5E9, #38BDF8)' } as React.CSSProperties} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Лидерство</span>
                    <span className="font-bold">{Math.round(skillScores.leadership)}%</span>
                  </div>
                  <Progress value={skillScores.leadership} className="h-3 bg-muted/50" style={{ '--progress-background': 'linear-gradient(to right, #D946EF, #E879F9)' } as React.CSSProperties} />
                </div>
              </div>

              <Card className="glass-dark p-4 border-accent/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">AI-анализ кандидата</p>
                    <p className="text-xs text-muted-foreground mt-1">Автоматическая оценка</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-accent">~30 сек</p>
                    <p className="text-xs text-muted-foreground">на анализ</p>
                  </div>
                </div>
              </Card>

              <Button onClick={startDemo} className="w-full neon-glow bg-gradient-to-r from-primary to-secondary hover:opacity-90 hover:scale-105 transition-all" disabled={isAnalyzing}>
                {isAnalyzing ? (
                  <>
                    <Icon name="Loader2" className="animate-spin mr-2" />
                    {['Загрузка видео...', 'Анализ речи...', 'Оценка эмоций...', 'Формирование профиля...', 'Анализ завершен!'][analysisStep]}
                  </>
                ) : (
                  <>
                    <Icon name="Play" className="mr-2" />
                    Запустить демонстрацию
                  </>
                )}
              </Button>
            </Card>

            <div className="space-y-6">
              <Card className="glass-dark p-6 hover:neon-glow transition-all animate-fade-in hover-scale">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-glow">
                    <Icon name="Eye" size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Оценка soft skills</h3>
                    <p className="text-sm text-muted-foreground">Анализ невербальных сигналов</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="glass p-3 rounded-lg">
                    <div className="text-2xl font-bold text-primary">98%</div>
                    <div className="text-xs text-muted-foreground">Точность</div>
                  </div>
                  <div className="glass p-3 rounded-lg">
                    <div className="text-2xl font-bold text-secondary">15+</div>
                    <div className="text-xs text-muted-foreground">Параметров</div>
                  </div>
                </div>
              </Card>

              <Card className="glass-dark p-6 hover:neon-glow transition-all animate-fade-in hover-scale" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center neon-glow">
                    <Icon name="MessageSquare" size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">AI-собеседование</h3>
                    <p className="text-sm text-muted-foreground">Умный анализ ответов</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Проведено интервью:</span>
                    <span className="font-bold text-accent">1,258+</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Средняя оценка:</span>
                    <span className="font-bold text-primary">87%</span>
                  </div>
                </div>
              </Card>

              <Card className="glass-dark p-6 hover:neon-glow transition-all animate-fade-in hover-scale" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center neon-glow">
                    <Icon name="TrendingUp" size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Прогноз успешности</h3>
                    <p className="text-sm text-muted-foreground">ML-модель предсказания</p>
                  </div>
                </div>
                <div className="glass p-4 rounded-lg text-center">
                  <div className="text-4xl font-bold neon-text mb-1">92%</div>
                  <div className="text-sm text-muted-foreground">вероятность успешного найма</div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section id="stats" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="glass rounded-3xl p-12 max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div className="space-y-3 hover-scale cursor-pointer">
                <div className="text-5xl md:text-6xl font-bold neon-text animate-fade-in">{stats.totalClosed}</div>
                <p className="text-muted-foreground">Вакансий закрыто</p>
                <Icon name="TrendingUp" size={24} className="text-primary mx-auto animate-pulse" />
              </div>
              <div className="space-y-3 hover-scale cursor-pointer">
                <div className="text-5xl md:text-6xl font-bold text-secondary animate-fade-in">{stats.inProgress}</div>
                <p className="text-muted-foreground">В работе сейчас</p>
                <Icon name="Clock" size={24} className="text-secondary mx-auto animate-pulse" />
              </div>
              <div className="space-y-3 hover-scale cursor-pointer">
                <div className="text-5xl md:text-6xl font-bold text-accent animate-fade-in">24ч</div>
                <p className="text-muted-foreground">Среднее время</p>
                <Icon name="Zap" size={24} className="text-accent mx-auto animate-pulse" />
              </div>
              <div className="space-y-3 hover-scale cursor-pointer">
                <div className="text-5xl md:text-6xl font-bold text-primary animate-fade-in">90%</div>
                <p className="text-muted-foreground">Точность подбора</p>
                <Icon name="Target" size={24} className="text-primary mx-auto animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="team" className="py-20 px-4 bg-muted/5">
        <div className="container mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold neon-text">Наша команда</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Профессиональные HR-специалисты с многолетним опытом
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {teamMembers.map((member, idx) => (
              <Card key={idx} className="glass-dark p-6 space-y-4 hover:neon-glow transition-all hover-scale animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                <Avatar className="w-24 h-24 mx-auto border-4 border-primary/50 neon-glow">
                  <AvatarImage src={member.img} alt={member.name} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-2xl">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center space-y-2">
                  <h3 className="font-bold text-lg">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                  <Badge className="bg-primary/20 text-primary">{member.spec}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border/50">
                  <div className="text-center">
                    <div className="text-xl font-bold text-primary">{member.exp}</div>
                    <div className="text-xs text-muted-foreground">опыта</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-secondary">{member.hires}</div>
                    <div className="text-xs text-muted-foreground">найма</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold neon-text">Что говорят клиенты</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Реальные отзывы руководителей, которые уже нашли своих сотрудников
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {testimonials.map((testimonial, idx) => (
              <Card key={idx} className="glass-dark p-6 space-y-4 hover:neon-glow transition-all hover-scale animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Icon key={i} name="Star" size={16} className="text-accent fill-accent animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
                
                <p className="text-muted-foreground leading-relaxed italic text-sm">
                  "{testimonial.text}"
                </p>
                
                <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                  <Avatar className="w-12 h-12 border-2 border-primary/50">
                    <AvatarImage src={testimonial.img} alt={testimonial.name} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-bold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-bold text-sm">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.position}</div>
                    <div className="text-xs text-muted-foreground opacity-70">{testimonial.company}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="cta" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="glass-dark rounded-3xl p-8 md:p-12 neon-glow max-w-2xl mx-auto animate-scale-in">
            <div className="text-center space-y-6">
              <h2 className="text-3xl md:text-5xl font-bold neon-text">
                Получите идеального кандидата завтра!
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground">
                Оставьте заявку сейчас — получите результат через 24 часа
              </p>

              <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto pt-6">
                <Input 
                  placeholder="Ваше имя *"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="glass border-primary/30 h-14 text-lg focus:neon-glow transition-all"
                />

                <Input 
                  placeholder="Номер телефона *"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                  className="glass border-primary/30 h-14 text-lg focus:neon-glow transition-all"
                />

                <Button type="submit" size="lg" className="w-full neon-glow bg-gradient-to-r from-primary to-secondary hover:opacity-90 hover:scale-105 transition-all text-xl py-8">
                  🔥 Найти сотрудника
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 px-4 border-t border-border/50 bg-muted/5">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 hover-scale cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-glow">
                  <Icon name="Sparkles" size={20} className="text-white" />
                </div>
                <span className="text-xl font-bold neon-text">1 DAY HR</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Инновационное агентство по подбору менеджеров по продажам с использованием искусственного интеллекта
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold">Контакты</h4>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2 hover:text-primary transition-all cursor-pointer hover-scale">
                  <Icon name="Phone" size={16} className="text-primary" />
                  <a href="tel:+79955556231">+7 (995) 555-62-31</a>
                </p>
                <p className="flex items-center gap-2 hover:text-secondary transition-all cursor-pointer hover-scale">
                  <Icon name="MessageCircle" size={16} className="text-secondary" />
                  <a href="https://t.me/your_telegram">Telegram</a>
                </p>
                <p className="flex items-center gap-2 hover:text-accent transition-all cursor-pointer hover-scale">
                  <Icon name="Mail" size={16} className="text-accent" />
                  <a href="mailto:info@1dayhr.ru">info@1dayhr.ru</a>
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold">Навигация</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <button onClick={() => scrollToSection('demo')} className="text-left hover:text-primary transition-all hover:scale-110">AI Демо</button>
                <button onClick={() => scrollToSection('benefits')} className="text-left hover:text-primary transition-all hover:scale-110">Преимущества</button>
                <button onClick={() => scrollToSection('team')} className="text-left hover:text-primary transition-all hover:scale-110">Команда</button>
                <button onClick={() => scrollToSection('testimonials')} className="text-left hover:text-primary transition-all hover:scale-110">Отзывы</button>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-12 pt-8 border-t border-border/50">
            <div className="text-sm text-muted-foreground">
              © 2024 1 DAY HR. Все права защищены.
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-all hover:scale-110">Политика конфиденциальности</a>
              <a href="#" className="hover:text-primary transition-all hover:scale-110">Обработка персональных данных</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
