import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [formData1, setFormData1] = useState({
    position: '',
    location: '',
    salary: '',
    deadline: '',
    requirements: '',
    name: '',
    contact: ''
  });

  const [formData2, setFormData2] = useState({
    name: '',
    company: '',
    contact: '',
    comment: ''
  });

  const handleSubmit1 = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Заявка отправлена!',
      description: 'Мы свяжемся с вами в течение 2 часов'
    });
  };

  const handleSubmit2 = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Заявка на консультацию принята!',
      description: 'Наш менеджер скоро с вами свяжется'
    });
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-glow">
                <Icon name="Zap" size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold neon-text">AI Recruiter</span>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <button onClick={() => scrollToSection('how-it-works')} className="text-sm hover:text-primary transition-colors">
                Как это работает
              </button>
              <button onClick={() => scrollToSection('benefits')} className="text-sm hover:text-primary transition-colors">
                Преимущества
              </button>
              <button onClick={() => scrollToSection('for-who')} className="text-sm hover:text-primary transition-colors">
                Кому подходит
              </button>
              <button onClick={() => scrollToSection('cta')} className="text-sm hover:text-primary transition-colors">
                Контакты
              </button>
            </nav>

            <Button onClick={() => scrollToSection('cta')} className="neon-glow bg-primary hover:bg-primary/90">
              Оставить заявку
            </Button>
          </div>
        </div>
      </header>

      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold leading-tight neon-text">
                  Найм сотрудников за 24 часа без бесконечных интервью
                </h1>
                <p className="text-xl text-muted-foreground">
                  AI-сервис, который берёт на себя поиск, скрининг и первичные касания с кандидатами. Вы получаете только релевантных людей, готовых к интервью.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <Icon name="CheckCircle2" size={20} className="text-primary" />
                  </div>
                  <p className="text-lg">Первые резюме в течение одного рабочего дня</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <Icon name="CheckCircle2" size={20} className="text-secondary" />
                  </div>
                  <p className="text-lg">Фокус на опыте, мотивации и софт-скиллах</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <Icon name="CheckCircle2" size={20} className="text-accent" />
                  </div>
                  <p className="text-lg">Экономия до 70% времени HR-команды</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button size="lg" onClick={() => scrollToSection('hero-form')} className="neon-glow bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg px-8">
                  Получить подбор
                </Button>
                <Button size="lg" variant="outline" onClick={() => scrollToSection('cta')} className="border-primary text-primary hover:bg-primary/10 text-lg px-8">
                  Записаться на демо
                </Button>
              </div>
            </div>

            <Card id="hero-form" className="glass p-8 space-y-6 animate-scale-in neon-glow">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Заявка на подбор</h3>
                <p className="text-sm text-muted-foreground">Заполните форму, и мы начнём работу уже сегодня</p>
              </div>

              <form onSubmit={handleSubmit1} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Кого ищем</label>
                  <Input 
                    placeholder="Например: Senior Python Developer"
                    value={formData1.position}
                    onChange={(e) => setFormData1({...formData1, position: e.target.value})}
                    required
                    className="glass border-primary/30"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Город / формат</label>
                    <Input 
                      placeholder="Удалёнка / Москва"
                      value={formData1.location}
                      onChange={(e) => setFormData1({...formData1, location: e.target.value})}
                      required
                      className="glass border-primary/30"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Зарплатная вилка</label>
                    <Input 
                      placeholder="200-300k"
                      value={formData1.salary}
                      onChange={(e) => setFormData1({...formData1, salary: e.target.value})}
                      required
                      className="glass border-primary/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Срок закрытия</label>
                  <Input 
                    placeholder="До конца недели / месяца"
                    value={formData1.deadline}
                    onChange={(e) => setFormData1({...formData1, deadline: e.target.value})}
                    required
                    className="glass border-primary/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Ключевые требования</label>
                  <Textarea 
                    placeholder="Опыт с Django, PostgreSQL, знание Docker..."
                    value={formData1.requirements}
                    onChange={(e) => setFormData1({...formData1, requirements: e.target.value})}
                    required
                    className="glass border-primary/30 min-h-[80px]"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Ваше имя</label>
                    <Input 
                      placeholder="Иван"
                      value={formData1.name}
                      onChange={(e) => setFormData1({...formData1, name: e.target.value})}
                      required
                      className="glass border-primary/30"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Телефон / Telegram</label>
                    <Input 
                      placeholder="+7 900 123-45-67"
                      value={formData1.contact}
                      onChange={(e) => setFormData1({...formData1, contact: e.target.value})}
                      required
                      className="glass border-primary/30"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full neon-glow bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg py-6">
                  Отправить запрос на подбор
                </Button>

                <div className="space-y-2 text-xs text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <Icon name="Lock" size={14} />
                    Все данные защищены и конфиденциальны
                  </p>
                  <p className="flex items-center gap-2">
                    <Icon name="Clock" size={14} />
                    Сейчас в работе ограниченное количество вакансий
                  </p>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </section>

      <section id="benefits" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold neon-text">Почему это работает</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Искусственный интеллект берёт на себя рутину, вы фокусируетесь на людях
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="glass p-8 space-y-4 hover:neon-glow transition-all duration-300 hover-scale">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center neon-glow">
                <Icon name="Brain" size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold">Точный AI-скрининг</h3>
              <p className="text-muted-foreground leading-relaxed">
                Алгоритмы анализируют резюме по 50+ параметрам: опыт работы, стек технологий, траектория карьеры, частота смены мест. Отсеиваем неподходящих до того, как они попадут к вам.
              </p>
            </Card>

            <Card className="glass p-8 space-y-4 hover:neon-glow transition-all duration-300 hover-scale">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center neon-glow">
                <Icon name="Rocket" size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold">Быстрый выход на кандидатов</h3>
              <p className="text-muted-foreground leading-relaxed">
                Поиск идёт по всем релевантным источникам параллельно. Автоматические первичные касания через несколько каналов. Средний отклик в течение 4 часов, shortlist через 24 часа.
              </p>
            </Card>

            <Card className="glass p-8 space-y-4 hover:neon-glow transition-all duration-300 hover-scale">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center neon-glow">
                <Icon name="BarChart3" size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold">Прозрачная воронка и отчёты</h3>
              <p className="text-muted-foreground leading-relaxed">
                Вы видите каждый этап подбора в реальном времени. Статистика откликов, причины отсева, shortlist с комментариями. Никаких чёрных ящиков — только конкретные метрики.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold neon-text">Как это работает</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Простой процесс из трёх шагов — от заявки до найма
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex gap-6 items-start group">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-glow text-2xl font-bold">
                  1
                </div>
              </div>
              <Card className="glass p-6 flex-1 hover:neon-glow transition-all duration-300">
                <h3 className="text-2xl font-bold mb-3">Созвон и формирование профиля вакансии</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Проводим интервью на 30-40 минут, чтобы понять контекст задачи: команда, проект, культура, требования к кандидату. Формируем детальный профиль позиции с приоритетами.
                </p>
              </Card>
            </div>

            <div className="flex gap-6 items-start group">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center neon-glow text-2xl font-bold">
                  2
                </div>
              </div>
              <Card className="glass p-6 flex-1 hover:neon-glow transition-all duration-300">
                <h3 className="text-2xl font-bold mb-3">AI-поиск, первичные касания и фильтрация</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Система начинает параллельный поиск по базам, соцсетям и профильным площадкам. AI делает первичный скрининг, отправляет персонализированные сообщения, собирает отклики. Вы получаете только тех, кто прошёл все фильтры.
                </p>
              </Card>
            </div>

            <div className="flex gap-6 items-start group">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center neon-glow text-2xl font-bold">
                  3
                </div>
              </div>
              <Card className="glass p-6 flex-1 hover:neon-glow transition-all duration-300">
                <h3 className="text-2xl font-bold mb-3">Передача shortlist и поддержка при оффере</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Формируем финальный shortlist с развёрнутыми профилями кандидатов. Координируем интервью, собираем обратную связь. При необходимости помогаем на этапе оффера: переговоры по условиям, закрытие сделки.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section id="for-who" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold neon-text">Кому подходит</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              AI-подбор эффективен для компаний с чёткими требованиями к кандидатам
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="glass p-6 space-y-3">
              <Icon name="Building2" size={32} className="text-primary" />
              <h3 className="text-xl font-bold">Стартапы и scale-up</h3>
              <p className="text-muted-foreground">Быстрый найм без создания HR-отдела</p>
            </Card>

            <Card className="glass p-6 space-y-3">
              <Icon name="Code2" size={32} className="text-secondary" />
              <h3 className="text-xl font-bold">IT-компании</h3>
              <p className="text-muted-foreground">Закрытие массовых технических позиций</p>
            </Card>

            <Card className="glass p-6 space-y-3">
              <Icon name="Users" size={32} className="text-accent" />
              <h3 className="text-xl font-bold">Агентства и аутсорс</h3>
              <p className="text-muted-foreground">Масштабирование команд под проекты</p>
            </Card>

            <Card className="glass p-6 space-y-3">
              <Icon name="Briefcase" size={32} className="text-primary" />
              <h3 className="text-xl font-bold">Продуктовые команды</h3>
              <p className="text-muted-foreground">Усиление под запуск новых направлений</p>
            </Card>
          </div>
        </div>
      </section>

      <section id="cta" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="glass rounded-3xl p-12 neon-glow">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold neon-text">
                  Обсудим вашу задачу по найму за 15 минут
                </h2>
                <p className="text-xl text-muted-foreground">
                  Можно начать с одной позиции без долгосрочных контрактов. Если результат вам понравится — масштабируем сотрудничество.
                </p>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Icon name="MessageCircle" size={20} className="text-secondary" />
                  <span>Связаться напрямую: <a href="https://t.me/your_telegram" className="text-secondary hover:underline">@ai_recruiter</a></span>
                </div>
              </div>

              <Card className="glass p-8 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Записаться на консультацию</h3>
                  <p className="text-sm text-muted-foreground">Обсудим вашу задачу и предложим решение</p>
                </div>

                <form onSubmit={handleSubmit2} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Ваше имя</label>
                    <Input 
                      placeholder="Иван Иванов"
                      value={formData2.name}
                      onChange={(e) => setFormData2({...formData2, name: e.target.value})}
                      required
                      className="glass border-primary/30"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Компания</label>
                    <Input 
                      placeholder="ООО «Рога и копыта»"
                      value={formData2.company}
                      onChange={(e) => setFormData2({...formData2, company: e.target.value})}
                      required
                      className="glass border-primary/30"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Телефон / Telegram</label>
                    <Input 
                      placeholder="+7 900 123-45-67"
                      value={formData2.contact}
                      onChange={(e) => setFormData2({...formData2, contact: e.target.value})}
                      required
                      className="glass border-primary/30"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Комментарий</label>
                    <Textarea 
                      placeholder="Расскажите кратко о задаче..."
                      value={formData2.comment}
                      onChange={(e) => setFormData2({...formData2, comment: e.target.value})}
                      className="glass border-primary/30 min-h-[100px]"
                    />
                  </div>

                  <Button type="submit" className="w-full neon-glow bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg py-6">
                    Записаться на консультацию
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 px-4 border-t border-border/50">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Icon name="Zap" size={16} className="text-white" />
              </div>
              <span className="font-bold">AI Recruiter</span>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Политика конфиденциальности</a>
              <a href="#" className="hover:text-primary transition-colors">Обработка персональных данных</a>
            </div>

            <div className="text-sm text-muted-foreground">
              © 2024 AI Recruiter. Все права защищены
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
