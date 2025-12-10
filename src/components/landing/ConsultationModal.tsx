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
  const [consultForm, setConsultForm] = useState({ name: '', phone: '' });
  const [isConsultSubmitting, setIsConsultSubmitting] = useState(false);

  const handleConsultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConsultSubmitting(true);
    
    try {
      const timestamp = new Date().toLocaleString('ru-RU');
      const leadData = {
        name: consultForm.name,
        phone: consultForm.phone,
        source: 'consultation_modal',
        form_type: 'consultation',
        page: window.location.pathname.split('/')[1] || 'main',
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
      }).catch(err => console.log('Telegram notification failed:', err));
      
      toast({ title: 'Консультация заказана! 🎉', description: 'Мы позвоним вам в течение 30 минут' });
      setConsultForm({ name: '', phone: '' });
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <Card className="glass-dark p-4 md:p-6 lg:p-8 max-w-lg w-full neon-glow animate-scale-in max-h-[95vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center neon-glow">
              <Icon name="Calendar" size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl lg:text-2xl font-bold neon-text">Бесплатная консультация</h2>
              <p className="text-xs md:text-sm text-muted-foreground">Перезвоним в течение 30 минут</p>
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
          <Input
            placeholder="Ваше имя *"
            value={consultForm.name}
            onChange={(e) => setConsultForm({...consultForm, name: e.target.value})}
            required
            className="glass border-primary/30 h-12 md:h-14 text-base focus:neon-glow transition-all"
          />

          <Input
            type="tel"
            placeholder="Номер телефона *"
            value={consultForm.phone}
            onChange={(e) => setConsultForm({...consultForm, phone: e.target.value})}
            required
            className="glass border-primary/30 h-12 md:h-14 text-base focus:neon-glow transition-all"
          />

          <Card className="glass p-3 md:p-4 border-secondary/30 space-y-2">
            <div className="flex items-center gap-2">
              <Icon name="Gift" size={20} className="text-secondary" />
              <h4 className="font-bold text-sm md:text-base text-secondary">Что вы получите:</h4>
            </div>
            <ul className="space-y-1 text-xs md:text-sm text-muted-foreground">
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
            className="w-full neon-glow bg-gradient-to-r from-secondary to-primary hover:opacity-90 hover:scale-105 transition-all text-base md:text-lg h-12 md:h-14"
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