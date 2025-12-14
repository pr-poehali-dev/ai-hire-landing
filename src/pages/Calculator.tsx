import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { sendMetrikaGoal, metrikaGoals } from '@/utils/metrika';

const Calculator = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [calcParams, setCalcParams] = useState({
    positions: 1,
    urgency: 24,
    level: 2
  });
  const [formData, setFormData] = useState({ name: '', phone: '', company: '', vacancy: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculatePrice = () => {
    const basePrice = 35000;
    const positionMultiplier = calcParams.positions;
    const urgencyMultiplier = calcParams.urgency === 12 ? 1.5 : calcParams.urgency === 24 ? 1 : 0.85;
    const levelMultiplier = calcParams.level === 1 ? 1 : calcParams.level === 2 ? 2.14 : 3.14;
    return Math.round(basePrice * positionMultiplier * urgencyMultiplier * levelMultiplier);
  };

  const getLevelName = (level: number) => {
    if (level === 1) return 'Junior / Middle';
    if (level === 2) return 'Senior';
    return 'Team Lead / C-level';
  };

  const getUrgencyName = (hours: number) => {
    if (hours === 12) return '12 часов';
    if (hours === 24) return '24 часа';
    return '48 часов';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    sendMetrikaGoal(metrikaGoals.CALCULATOR_SUBMIT, {
      positions: calcParams.positions,
      urgency: calcParams.urgency,
      level: getLevelName(calcParams.level),
      price: calculatePrice()
    });

    try {
      const leadData = {
        ...formData,
        source: 'calculator',
        vacancy: `${formData.vacancy} (${getLevelName(calcParams.level)}, ${getUrgencyName(calcParams.urgency)}, ${calcParams.positions} ${calcParams.positions === 1 ? 'позиция' : 'позиции'})`,
        timestamp: new Date().toLocaleString('ru-RU')
      };

      const response = await fetch('https://functions.poehali.dev/6389194d-86d0-46d4-bc95-83e9f660f267', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        fetch('https://functions.poehali.dev/a7d1db0c-db9c-4d2f-b64e-42c388aed5d5', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadData)
        }).catch(err => console.error('Telegram notification failed:', err));

        sendMetrikaGoal(metrikaGoals.LEAD_CREATED, { source: 'calculator' });

        toast({ 
          title: 'Заявка отправлена! 🚀', 
          description: 'Мы свяжемся с вами в течение 30 минут' 
        });
        setFormData({ name: '', phone: '', company: '', vacancy: '' });
      } else {
        throw new Error(data.error || 'Ошибка отправки');
      }
    } catch (error) {
      toast({ 
        title: 'Ошибка отправки', 
        description: 'Попробуйте ещё раз или позвоните нам', 
        variant: 'destructive' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      <div className="fixed top-20 left-10 w-64 h-64 bg-primary/20 rounded-full blur-orb animate-pulse" style={{ animationDuration: '4s' }}></div>
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-secondary/15 rounded-full blur-orb animate-pulse" style={{ animationDuration: '6s' }}></div>

      <header className="fixed top-0 left-0 right-0 z-50 glass animate-fade-in">
        <div className="container mx-auto px-3 md:px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate('/')} className="flex items-center gap-1.5 md:gap-2 hover-scale cursor-pointer">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-glow">
                <Icon name="Sparkles" size={16} className="md:w-5 md:h-5 text-white animate-pulse" />
              </div>
              <span className="text-base md:text-xl font-bold neon-text">1 DAY HR</span>
            </button>

            <Button 
              onClick={() => {
                sendMetrikaGoal(metrikaGoals.CTA_CLICK, { action: 'back_to_home_from_calculator' });
                navigate('/');
              }} 
              variant="outline" 
              size="sm" 
              className="text-xs md:text-sm"
            >
              <Icon name="ArrowLeft" size={16} className="mr-1" />
              На главную
            </Button>
          </div>
        </div>
      </header>

      <section className="pt-24 md:pt-32 pb-12 md:pb-20 px-3 md:px-4">
        <div className="container mx-auto">
          <div className="text-center mb-8 md:mb-16 space-y-3 md:space-y-4">
            <Badge className="text-sm md:text-lg px-4 md:px-6 py-1.5 md:py-2 neon-glow animate-pulse">💰 Калькулятор стоимости</Badge>
            <h1 className="text-2xl md:text-5xl font-bold neon-text px-2">Рассчитайте стоимость подбора</h1>
            <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              Настройте параметры и узнайте точную цену прямо сейчас
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-6 md:gap-8">
            <Card className="glass-dark p-4 md:p-8 space-y-6 md:space-y-8 hover:neon-glow transition-all animate-fade-in">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-base md:text-lg font-bold">Количество вакансий</h3>
                      <p className="text-xs md:text-sm text-muted-foreground">Сколько сотрудников нужно найти</p>
                    </div>
                    <Badge className="text-xl md:text-2xl px-4 md:px-6 py-1.5 md:py-2 bg-primary/20 text-primary neon-glow">
                      {calcParams.positions}
                    </Badge>
                  </div>
                  <Slider 
                    value={[calcParams.positions]} 
                    onValueChange={(v) => setCalcParams({...calcParams, positions: v[0]})}
                    min={1}
                    max={10}
                    step={1}
                    className="cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1 человек</span>
                    <span>10 человек</span>
                  </div>
                </div>

                <div className="h-px bg-border/50" />

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-base md:text-lg font-bold">Срочность</h3>
                      <p className="text-xs md:text-sm text-muted-foreground">За какое время нужен результат</p>
                    </div>
                    <Badge className="text-base md:text-lg px-3 md:px-4 py-1.5 md:py-2 bg-secondary/20 text-secondary neon-glow">
                      {getUrgencyName(calcParams.urgency)}
                    </Badge>
                  </div>
                  <Slider 
                    value={[calcParams.urgency === 12 ? 0 : calcParams.urgency === 24 ? 1 : 2]} 
                    onValueChange={(v) => {
                      const urgencyMap = [12, 24, 48];
                      setCalcParams({...calcParams, urgency: urgencyMap[v[0]]});
                    }}
                    min={0}
                    max={2}
                    step={1}
                    className="cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>12 часов</span>
                    <span>24 часа</span>
                    <span>48 часов</span>
                  </div>
                </div>

                <div className="h-px bg-border/50" />

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-base md:text-lg font-bold">Уровень специалиста</h3>
                      <p className="text-xs md:text-sm text-muted-foreground">Какую позицию нужно закрыть</p>
                    </div>
                    <Badge className="text-base md:text-lg px-3 md:px-4 py-1.5 md:py-2 bg-secondary/20 text-secondary neon-glow">
                      {getLevelName(calcParams.level)}
                    </Badge>
                  </div>
                  <Slider 
                    value={[calcParams.level]} 
                    onValueChange={(v) => setCalcParams({...calcParams, level: v[0]})}
                    min={1}
                    max={3}
                    step={1}
                    className="cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Junior/Middle</span>
                    <span>Senior</span>
                    <span>Lead/C-level</span>
                  </div>
                </div>
              </div>
            </Card>

            <div className="space-y-6">
              <Card className="glass-dark p-4 md:p-8 space-y-6 hover:neon-glow transition-all animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <Icon name="Calculator" size={24} className="md:w-8 md:h-8 text-primary animate-pulse" />
                    <h3 className="text-xl md:text-2xl font-bold">Итоговая стоимость</h3>
                  </div>
                  
                  <div className="py-6 md:py-8">
                    <div className="text-5xl md:text-7xl font-bold neon-text animate-scale-in">
                      {calculatePrice().toLocaleString('ru-RU')}
                    </div>
                    <div className="text-lg md:text-2xl text-muted-foreground mt-2">рублей</div>
                  </div>

                  <div className="glass p-4 md:p-6 rounded-lg space-y-3 text-left">
                    <div className="flex justify-between items-center text-sm md:text-base">
                      <span className="text-muted-foreground">Количество:</span>
                      <span className="font-bold">{calcParams.positions} {calcParams.positions === 1 ? 'вакансия' : 'вакансии'}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm md:text-base">
                      <span className="text-muted-foreground">Срок:</span>
                      <span className="font-bold text-secondary">{getUrgencyName(calcParams.urgency)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm md:text-base">
                      <span className="text-muted-foreground">Уровень:</span>
                      <span className="font-bold text-secondary">{getLevelName(calcParams.level)}</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="glass-dark p-4 md:p-6 space-y-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-center gap-3">
                  <Icon name="Gift" size={20} className="md:w-6 md:h-6 text-secondary animate-pulse" />
                  <h4 className="font-bold text-sm md:text-base">Что входит в стоимость:</h4>
                </div>
                <ul className="space-y-2 text-xs md:text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Icon name="CheckCircle2" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                    <span>AI-анализ кандидатов и видео-интервью</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="CheckCircle2" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                    <span>Проверка рекомендаций и опыта работы</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="CheckCircle2" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                    <span>Гарантия замены на испытательном сроке</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="CheckCircle2" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                    <span>Поддержка HR-специалиста весь период</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="CheckCircle2" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                    <span>Возврат денег, если не найдем кандидата</span>
                  </li>
                </ul>
              </Card>

              <Card className="glass-dark p-4 md:p-6 border-secondary/30 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <div className="flex items-center gap-3 mb-3">
                  <Icon name="Percent" size={20} className="md:w-6 md:h-6 text-secondary animate-pulse" />
                  <h4 className="font-bold text-secondary text-sm md:text-base">Специальное предложение</h4>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground">
                  При заказе от 3 вакансий — скидка 15%. При заказе от 5 вакансий — скидка 25%!
                </p>
              </Card>
            </div>
          </div>

          <Card className="glass-dark p-6 md:p-8 max-w-2xl mx-auto mt-8 md:mt-12 neon-glow animate-scale-in">
            <div className="text-center space-y-4 md:space-y-6">
              <h2 className="text-xl md:text-3xl font-bold neon-text">
                Оставьте заявку и получите кандидата завтра!
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4 max-w-md mx-auto pt-4">
                <Input 
                  placeholder="Ваше имя *"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="glass border-primary/30 h-12 md:h-14 text-base md:text-lg focus:neon-glow transition-all"
                />

                <Input 
                  placeholder="Номер телефона *"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                  className="glass border-primary/30 h-12 md:h-14 text-base md:text-lg focus:neon-glow transition-all"
                />

                <Input 
                  placeholder="Компания"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="glass border-primary/30 h-12 md:h-14 text-base md:text-lg focus:neon-glow transition-all"
                />

                <Input 
                  placeholder="Вакансия"
                  value={formData.vacancy}
                  onChange={(e) => setFormData({...formData, vacancy: e.target.value})}
                  className="glass border-primary/30 h-12 md:h-14 text-base md:text-lg focus:neon-glow transition-all"
                />

                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={isSubmitting}
                  className="w-full neon-glow bg-gradient-to-r from-primary to-secondary hover:opacity-90 hover:scale-105 transition-all text-base md:text-xl py-6 md:py-8"
                >
                  {isSubmitting ? (
                    <>
                      <Icon name="Loader2" className="animate-spin mr-2" />
                      Отправка...
                    </>
                  ) : (
                    <>
                      🔥 Заказать подбор за {calculatePrice().toLocaleString('ru-RU')} ₽
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
                </p>
              </form>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Calculator;