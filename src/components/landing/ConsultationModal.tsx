import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConsultationModal = ({ isOpen, onClose }: ConsultationModalProps) => {
  const { toast } = useToast();
  const [consultForm, setConsultForm] = useState({ name: '', phone: '', company: '', vacancy: '' });
  const [isConsultSubmitting, setIsConsultSubmitting] = useState(false);

  const handleConsultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConsultSubmitting(true);
    
    try {
      const response = await fetch('https://functions.poehali.dev/6389194d-86d0-46d4-bc95-83e9f660f267', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: consultForm.name,
          phone: consultForm.phone,
          company: consultForm.company,
          vacancy: consultForm.vacancy,
          source: 'consultation'
        })
      });
      
      if (!response.ok) throw new Error('Failed to submit');
      
      toast({ title: 'Консультация заказана! 🎉', description: 'Мы позвоним вам в течение 30 минут' });
      setConsultForm({ name: '', phone: '', company: '', vacancy: '' });
      onClose();
    } catch (error) {
      toast({ 
        title: 'Ошибка отправки', 
        description: 'Попробуйте еще раз или позвоните нам',
        variant: 'destructive'
      });
    } finally {
      setIsConsultSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 md:p-4 animate-fade-in" onClick={onClose}>
      <Card className="glass-dark p-4 sm:p-6 md:p-8 max-w-lg w-full neon-glow animate-scale-in max-h-[95vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center neon-glow">
              <Icon name="Calendar" size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold neon-text">Бесплатная консультация</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">Перезвоним в течение 30 минут</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-destructive/20 hover:text-destructive"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleConsultSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Icon name="User" size={16} className="text-primary" />
              Ваше имя *
            </label>
            <Input
              placeholder="Иван Иванов"
              value={consultForm.name}
              onChange={(e) => setConsultForm({...consultForm, name: e.target.value})}
              required
              className="glass border-primary/30 h-12 focus:neon-glow transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Icon name="Phone" size={16} className="text-secondary" />
              Телефон *
            </label>
            <Input
              type="tel"
              placeholder="+7 (999) 123-45-67"
              value={consultForm.phone}
              onChange={(e) => setConsultForm({...consultForm, phone: e.target.value})}
              required
              className="glass border-primary/30 h-12 focus:neon-glow transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Icon name="Building2" size={16} className="text-secondary" />
              Компания
            </label>
            <Input
              placeholder="ООО 'Ваша компания'"
              value={consultForm.company}
              onChange={(e) => setConsultForm({...consultForm, company: e.target.value})}
              className="glass border-primary/30 h-12 focus:neon-glow transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Icon name="Briefcase" size={16} className="text-primary" />
              Вакансия
            </label>
            <Input
              placeholder="Менеджер по продажам"
              value={consultForm.vacancy}
              onChange={(e) => setConsultForm({...consultForm, vacancy: e.target.value})}
              className="glass border-primary/30 h-12 focus:neon-glow transition-all"
            />
          </div>

          <Card className="glass p-3 sm:p-4 border-secondary/30 space-y-2">
            <div className="flex items-center gap-2">
              <Icon name="Gift" size={20} className="text-secondary" />
              <h4 className="font-bold text-sm sm:text-base text-secondary">Что вы получите:</h4>
            </div>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Icon name="CheckCircle2" size={14} className="text-primary flex-shrink-0" />
                Разбор вашей вакансии и требований
              </li>
              <li className="flex items-center gap-2">
                <Icon name="CheckCircle2" size={14} className="text-primary flex-shrink-0" />
                Расчёт точной стоимости подбора
              </li>
              <li className="flex items-center gap-2">
                <Icon name="CheckCircle2" size={14} className="text-primary flex-shrink-0" />
                Прогноз сроков и план поиска
              </li>
              <li className="flex items-center gap-2">
                <Icon name="CheckCircle2" size={14} className="text-primary flex-shrink-0" />
                Ответы на все ваши вопросы
              </li>
            </ul>
          </Card>

          <Button
            type="submit"
            size="lg"
            className="w-full neon-glow bg-gradient-to-r from-secondary to-primary hover:opacity-90 hover:scale-105 transition-all text-base sm:text-lg py-5 sm:py-6"
            disabled={isConsultSubmitting}
          >
            {isConsultSubmitting ? (
              <>
                <Icon name="Loader2" className="animate-spin mr-2" size={20} />
                Отправка...
              </>
            ) : (
              <>
                <Icon name="Rocket" size={20} className="mr-2" />
                Заказать консультацию
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
          </p>
        </form>
      </Card>
    </div>
  );
};

export default ConsultationModal;