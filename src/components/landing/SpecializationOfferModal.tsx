import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { sendMetrikaGoal, metrikaGoals } from '@/utils/metrika';

interface SpecializationOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  specialization: 'sales' | 'it' | 'marketplace' | 'accountants' | 'marketers' | 'directors' | 'retail';
}

const offers = {
  sales: {
    title: '🎯 Бесплатное предложение для отдела продаж',
    subtitle: 'Первые 3 кандидата — БЕСПЛАТНО',
    description: 'Протестируйте нашу систему подбора без рисков',
    benefits: [
      '3 кандидата с видеоинтервью',
      'AI-анализ навыков продаж',
      'Гарантия замены 90 дней'
    ],
    color: 'purple'
  },
  it: {
    title: '💻 Бесплатное предложение для IT-компаний',
    subtitle: 'Tech-рекрутер + AI-скрининг в подарок',
    description: 'Находим разработчиков за 48 часов',
    benefits: [
      'Персональный tech-рекрутер',
      'Тестовое задание от вас',
      'Проверка GitHub портфолио'
    ],
    color: 'blue'
  },
  marketplace: {
    title: '🛒 Бесплатное предложение для маркетплейсов',
    subtitle: 'Аналитика + менеджер в комплекте',
    description: 'Спец цены на пакетный подбор',
    benefits: [
      'Знание WB/Ozon изнутри',
      'Опыт ведения аккаунтов',
      'Первый кандидат за 24 часа'
    ],
    color: 'orange'
  },
  accountants: {
    title: '💼 Бесплатное предложение для бухгалтерии',
    subtitle: 'Бухгалтер с опытом 1С — за 3 дня',
    description: 'Специализация на налоговом учете',
    benefits: [
      'Знание 1С:Бухгалтерия',
      'Опыт сдачи отчетности',
      'Проверенные рекомендации'
    ],
    color: 'emerald'
  },
  marketers: {
    title: '📢 Бесплатное предложение для маркетинга',
    subtitle: 'Performance-маркетолог + кейсы',
    description: 'Специалисты с реальными результатами',
    benefits: [
      'Портфолио успешных кампаний',
      'Знание аналитики и метрик',
      'Опыт запуска с нуля'
    ],
    color: 'pink'
  },
  directors: {
    title: '👑 Бесплатное предложение для руководителей',
    subtitle: 'Топ-менеджеры C-level за 7 дней',
    description: 'Конфиденциальный поиск руководителей',
    benefits: [
      'Личные встречи с кандидатами',
      'Проверка деловой репутации',
      'Сопровождение онбординга'
    ],
    color: 'indigo'
  },
  retail: {
    title: '🛍️ Бесплатное предложение для ритейла',
    subtitle: 'Продавцы-консультанты за 24 часа',
    description: 'Массовый подбор по выгодным ценам',
    benefits: [
      'Опыт работы в ритейле',
      'Проверка на стрессоустойчивость',
      'Готовы выйти завтра'
    ],
    color: 'sky'
  }
};

const SpecializationOfferModal = ({ isOpen, onClose, specialization }: SpecializationOfferModalProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const offer = offers[specialization];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    sendMetrikaGoal(metrikaGoals.FORM_SUBMIT, { form_type: 'specialization_offer', specialization });

    try {
      const timestamp = new Date().toLocaleString('ru-RU');
      const leadData = {
        name: formData.name,
        phone: formData.phone,
        source: `${specialization}_offer_popup`,
        form_type: 'special_offer',
        page: specialization,
        timestamp: timestamp
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

      sendMetrikaGoal(metrikaGoals.LEAD_CREATED, { source: `${specialization}_offer_popup` });

      setFormData({ name: '', phone: '' });
      onClose();
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] glass-dark border-primary/30 max-h-[96vh] overflow-y-auto p-2.5 sm:p-4">
        <DialogHeader>
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-${offer.color}-600 to-${offer.color}-400 flex items-center justify-center neon-glow`}>
              <Icon name="gift" className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-sm sm:text-base md:text-xl font-bold neon-text">
                {offer.title}
              </DialogTitle>
              <Badge className={`mt-0.5 sm:mt-1 bg-${offer.color}-500/20 text-${offer.color}-400 border-${offer.color}-500/30 text-[10px] sm:text-xs`}>
                ⏰ Только сегодня
              </Badge>
            </div>
          </div>
          <DialogDescription className="text-[10px] sm:text-xs md:text-sm leading-relaxed pt-1 sm:pt-2">
            <div className="space-y-1.5 sm:space-y-2">
              <p className="text-primary font-bold text-xs sm:text-sm">{offer.subtitle}</p>
              <p className="text-foreground">{offer.description}</p>
              <div className="grid grid-cols-1 gap-1 sm:gap-1.5">
                {offer.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-[10px] sm:text-xs">
                    <Icon name="check" className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3 mt-2 sm:mt-3">
          <div className="space-y-2">
            <Input
              placeholder="Ваше имя *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="glass border-primary/30 focus:neon-glow transition-all h-9 sm:h-11 text-sm sm:text-base"
            />

            <Input
              placeholder="Телефон *"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              className="glass border-primary/30 focus:neon-glow transition-all h-9 sm:h-11 text-sm sm:text-base"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 neon-glow bg-gradient-to-r from-primary to-secondary hover:opacity-90 hover:scale-105 transition-all h-9 sm:h-11 text-xs sm:text-sm md:text-base"
            >
              {isSubmitting ? (
                <>
                  <Icon name="loader-2" className="animate-spin mr-1.5 sm:mr-2" size={14} />
                  Отправка...
                </>
              ) : (
                <>
                  <Icon name="gift" className="mr-1.5 sm:mr-2" size={14} />
                  Получить предложение
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="hover:neon-glow hover:scale-105 transition-all h-9 sm:h-11 text-xs sm:text-sm md:text-base"
            >
              Отмена
            </Button>
          </div>

          <p className="text-[9px] sm:text-xs text-muted-foreground text-center">
            Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SpecializationOfferModal;