import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface AIScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  source?: string;
}

const AIScanModal = ({ isOpen, onClose, source = 'ai_scan_popup' }: AIScanModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

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

      fetch('https://functions.poehali.dev/a7d1db0c-db9c-4d2f-b64e-42c388aed5d5', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      }).catch(err => console.log('Telegram notification failed:', err));

      toast({
        title: '🎯 AI-сканирование запланировано!',
        description: 'Мы свяжемся с вами в течение 1 часа для проведения анализа'
      });

      setFormData({ name: '', phone: '' });
      onClose();
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
      <DialogContent className="sm:max-w-[500px] glass-dark border-primary/30 max-h-[85vh] overflow-y-auto p-4">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-glow">
              <Icon name="brain" className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-base md:text-xl font-bold neon-text">
                Бесплатное AI-сканирование
              </DialogTitle>
              <Badge className="mt-1 bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                ✨ Экономия 50,000₽
              </Badge>
            </div>
          </div>
          <DialogDescription className="text-xs md:text-sm leading-relaxed pt-2">
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-2">
                {[
                  { icon: 'target', text: 'Профиль идеального кандидата' },
                  { icon: 'users', text: '10-15 подходящих специалистов' },
                  { icon: 'trending-up', text: 'Оценка рынка и стоимости' },
                  { icon: 'clock', text: 'Прогноз сроков закрытия' }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <Icon name={item.icon as any} className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{item.text}</span>
                  </div>
                ))}
              </div>


            </div>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 mt-3">
          <div className="space-y-2.5">
            <Input
              placeholder="Ваше имя *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="glass border-primary/30 focus:neon-glow transition-all h-11 text-base"
            />

            <Input
              placeholder="Телефон *"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              className="glass border-primary/30 focus:neon-glow transition-all h-11 text-base"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 neon-glow bg-gradient-to-r from-primary to-secondary hover:opacity-90 hover:scale-105 transition-all h-11 text-sm md:text-base"
            >
              {isSubmitting ? (
                <>
                  <Icon name="loader-2" className="animate-spin mr-2" size={18} />
                  Отправка...
                </>
              ) : (
                <>
                  <Icon name="brain" className="mr-2" size={18} />
                  Запустить AI-сканирование
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="hover:neon-glow hover:scale-105 transition-all h-11 text-sm md:text-base"
            >
              Отмена
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AIScanModal;