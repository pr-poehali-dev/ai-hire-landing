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
      <DialogContent className="sm:max-w-[600px] glass-dark border-primary/30 max-h-[90vh] overflow-y-auto p-4 md:p-6">
        <DialogHeader>
          <div className="flex items-center gap-2 md:gap-3 mb-2">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-glow">
              <Icon name="brain" className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg md:text-2xl font-bold neon-text">
                Бесплатное AI-сканирование
              </DialogTitle>
              <Badge className="mt-1 bg-green-500/20 text-green-400 border-green-500/30">
                ✨ Экономия 50,000₽
              </Badge>
            </div>
          </div>
          <DialogDescription className="text-sm md:text-base leading-relaxed pt-3 md:pt-4">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Проведём глубокий анализ вашей вакансии и рынка за <span className="text-primary font-bold">30 минут</span>:
              </p>
              
              <div className="grid grid-cols-1 gap-3">
                {[
                  { icon: 'target', text: 'Составим профиль идеального кандидата по 50+ параметрам' },
                  { icon: 'users', text: 'Найдём 10-15 подходящих специалистов в нашей базе' },
                  { icon: 'trending-up', text: 'Оценим рыночную стоимость и доступность кандидатов' },
                  { icon: 'clock', text: 'Спрогнозируем точные сроки закрытия вакансии' },
                  { icon: 'lightbulb', text: 'Дадим рекомендации по улучшению условий найма' }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 md:gap-3 text-xs md:text-sm">
                    <Icon name={item.icon as any} className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="glass p-4 rounded-lg border border-secondary/30">
                <p className="text-secondary font-bold text-sm mb-2">💡 Почему это работает?</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Наша AI-система анализирует 15,000+ резюме в реальном времени, учитывая не только навыки, 
                  но и культурную совместимость, мотивацию и вероятность успешного найма. Это позволяет найти 
                  кандидата, который точно подойдёт именно вам.
                </p>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4 mt-3 md:mt-4">
          <div className="space-y-3">
            <Input
              placeholder="Ваше имя *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="glass border-primary/30 focus:neon-glow transition-all h-12 text-base"
            />

            <Input
              placeholder="Телефон *"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              className="glass border-primary/30 focus:neon-glow transition-all h-12 text-base"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 neon-glow bg-gradient-to-r from-primary to-secondary hover:opacity-90 hover:scale-105 transition-all h-12"
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
              className="hover:neon-glow hover:scale-105 transition-all h-12"
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