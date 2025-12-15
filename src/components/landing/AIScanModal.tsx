import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { sendMetrikaGoal, metrikaGoals } from '@/utils/metrika';
import { useNavigate } from 'react-router-dom';

interface AIScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  source?: string;
}

const AIScanModal = ({ isOpen, onClose, source = 'ai_scan_popup' }: AIScanModalProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    sendMetrikaGoal(metrikaGoals.FORM_SUBMIT, { form_type: 'ai_scan' });

    try {
      const timestamp = new Date().toLocaleString('ru-RU');
      const leadData = {
        name: formData.name,
        phone: formData.phone,
        source: source,
        form_type: 'ai_scan',
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

      sendMetrikaGoal(metrikaGoals.LEAD_CREATED, { source: source });

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
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-glow">
              <Icon name="brain" className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-sm sm:text-base md:text-xl font-bold neon-text">
                AI-сканирование
              </DialogTitle>
              <Badge className="mt-0.5 sm:mt-1 bg-green-500/20 text-green-400 border-green-500/30 text-[10px] sm:text-xs">
                ✨ Экономия 50,000₽
              </Badge>
            </div>
          </div>
          <DialogDescription className="text-[10px] sm:text-xs md:text-sm leading-relaxed pt-1 sm:pt-2">
            <div className="space-y-1.5 sm:space-y-2">
              <div className="grid grid-cols-1 gap-1 sm:gap-1.5">
                {[
                  { icon: 'target', text: 'Профиль кандидата' },
                  { icon: 'users', text: '10-15 специалистов' },
                  { icon: 'trending-up', text: 'Оценка рынка' }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-[10px] sm:text-xs">
                    <Icon name={item.icon as any} className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{item.text}</span>
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
                  <Icon name="brain" className="mr-1.5 sm:mr-2" size={14} />
                  Запустить AI
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

export default AIScanModal;