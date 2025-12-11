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

      console.log('Sending Telegram notification:', leadData);
      fetch('https://functions.poehali.dev/a7d1db0c-db9c-4d2f-b64e-42c388aed5d5', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      })
        .then(res => res.json())
        .then(data => console.log('Telegram response:', data))
        .catch(err => console.error('Telegram notification failed:', err));
      
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fade-in" onClick={onClose}>
      <Card className="glass-dark p-2.5 sm:p-6 max-w-md w-full neon-glow animate-scale-in max-h-[96vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-2 sm:mb-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center neon-glow">
              <Icon name="Calendar" size={18} className="text-white sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-xl font-bold neon-text">Бесплатная консультация</h2>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Перезвоним в течение 30 минут</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-destructive/20 hover:text-destructive h-8 w-8 sm:h-10 sm:w-10"
          >
            <Icon name="X" size={16} className="sm:w-5 sm:h-5" />
          </Button>
        </div>

        <form onSubmit={handleConsultSubmit} className="space-y-2 sm:space-y-3 flex-1 overflow-y-auto">
          <Input
            placeholder="Ваше имя *"
            value={consultForm.name}
            onChange={(e) => setConsultForm({...consultForm, name: e.target.value})}
            required
            className="glass border-primary/30 h-9 sm:h-11 text-sm sm:text-base focus:neon-glow transition-all"
          />

          <Input
            type="tel"
            placeholder="Номер телефона *"
            value={consultForm.phone}
            onChange={(e) => setConsultForm({...consultForm, phone: e.target.value})}
            required
            className="glass border-primary/30 h-9 sm:h-11 text-sm sm:text-base focus:neon-glow transition-all"
          />

          <Card className="glass p-2 sm:p-3 border-secondary/30 space-y-1">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Icon name="Gift" size={14} className="text-secondary sm:w-4 sm:h-4" />
              <h4 className="font-bold text-[11px] sm:text-xs text-secondary">Что вы получите:</h4>
            </div>
            <ul className="space-y-0.5 sm:space-y-1 text-[10px] sm:text-xs text-muted-foreground">
              <li className="flex items-center gap-1.5 sm:gap-2">
                <Icon name="CheckCircle2" size={10} className="text-primary flex-shrink-0 sm:w-3 sm:h-3" />
                Разбор вакансии
              </li>
              <li className="flex items-center gap-1.5 sm:gap-2">
                <Icon name="CheckCircle2" size={10} className="text-primary flex-shrink-0 sm:w-3 sm:h-3" />
                Расчёт стоимости
              </li>
              <li className="flex items-center gap-1.5 sm:gap-2">
                <Icon name="CheckCircle2" size={10} className="text-primary flex-shrink-0 sm:w-3 sm:h-3" />
                Прогноз сроков
              </li>
            </ul>
          </Card>

          <Button
            type="submit"
            className="w-full neon-glow bg-gradient-to-r from-secondary to-primary hover:opacity-90 hover:scale-105 transition-all text-xs sm:text-base h-9 sm:h-11"
            disabled={isConsultSubmitting}
          >
            {isConsultSubmitting ? (
              <>
                <Icon name="Loader2" className="animate-spin mr-1.5 sm:mr-2" size={16} />
                Отправка...
              </>
            ) : (
              <>
                <Icon name="Rocket" size={16} className="mr-1.5 sm:mr-2 sm:w-5 sm:h-5" />
                Заказать консультацию
              </>
            )}
          </Button>

          <p className="text-[9px] sm:text-xs text-muted-foreground text-center">
            Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
          </p>
        </form>
      </Card>
    </div>
  );
};

export default ConsultationModal;