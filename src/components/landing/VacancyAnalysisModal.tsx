import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface VacancyAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VacancyAnalysisModal = ({ isOpen, onClose }: VacancyAnalysisModalProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    company: '',
    position: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('https://functions.poehali.dev/6389194d-86d0-46d4-bc95-83e9f660f267', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          company: formData.company,
          position: formData.position,
          description: formData.description,
          source: 'vacancy_analysis_popup',
          form_type: 'vacancy_analysis',
          page: 'main'
        })
      });
      
      if (!response.ok) throw new Error('Failed to submit');
      
      toast({ 
        title: 'Заявка отправлена! 🎯', 
        description: 'Мы проанализируем вашу вакансию и свяжемся с вами в течение 2 часов' 
      });
      
      setFormData({ name: '', phone: '', company: '', position: '', description: '' });
      onClose();
    } catch (error) {
      toast({ 
        title: 'Ошибка отправки', 
        description: 'Попробуйте еще раз или позвоните нам',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-dark border-primary/30 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-glow">
              <Icon name="brain" size={24} className="text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold neon-text">
                Бесплатный AI-анализ вакансии
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Получите готовую воронку найма и портрет кандидата за 30 минут
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="glass p-3 rounded-lg text-center hover:neon-glow transition-all">
              <Icon name="target" size={20} className="text-primary mx-auto mb-2" />
              <p className="text-xs font-bold">Портрет кандидата</p>
            </div>
            <div className="glass p-3 rounded-lg text-center hover:neon-glow transition-all">
              <Icon name="filter" size={20} className="text-secondary mx-auto mb-2" />
              <p className="text-xs font-bold">Воронка найма</p>
            </div>
            <div className="glass p-3 rounded-lg text-center hover:neon-glow transition-all">
              <Icon name="trending-up" size={20} className="text-secondary mx-auto mb-2" />
              <p className="text-xs font-bold">План действий</p>
            </div>
          </div>

          <div className="glass-dark p-4 rounded-lg border-l-4 border-primary">
            <div className="flex items-start gap-3">
              <Icon name="sparkles" size={20} className="text-primary flex-shrink-0 mt-0.5" />
              <div className="space-y-2 text-sm">
                <p className="font-bold">Что вы получите:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Icon name="check" size={14} className="text-primary flex-shrink-0 mt-0.5" />
                    <span>Детальный портрет идеального кандидата с навыками и качествами</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="check" size={14} className="text-secondary flex-shrink-0 mt-0.5" />
                    <span>Готовую воронку найма с этапами отбора</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="check" size={14} className="text-secondary flex-shrink-0 mt-0.5" />
                    <span>Список площадок для поиска + план выхода на кандидатов</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="check" size={14} className="text-primary flex-shrink-0 mt-0.5" />
                    <span>Прогноз сроков и бюджета закрытия вакансии</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm">
            <Badge className="bg-primary/20 text-primary">
              <Icon name="clock" size={12} className="mr-1" />
              30 минут
            </Badge>
            <Badge className="bg-secondary/20 text-secondary">
              <Icon name="gift" size={12} className="mr-1" />
              Бесплатно
            </Badge>
            <Badge className="bg-secondary/20 text-secondary">
              <Icon name="shield-check" size={12} className="mr-1" />
              Без обязательств
            </Badge>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input 
              placeholder="Ваше имя *"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              className="glass border-primary/30 focus:neon-glow transition-all"
            />

            <Input 
              placeholder="Телефон *"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
              className="glass border-primary/30 focus:neon-glow transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input 
              placeholder="Название компании"
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
              className="glass border-primary/30 focus:neon-glow transition-all"
            />

            <Input 
              placeholder="Должность для поиска *"
              value={formData.position}
              onChange={(e) => setFormData({...formData, position: e.target.value})}
              required
              className="glass border-primary/30 focus:neon-glow transition-all"
            />
          </div>

          <Textarea 
            placeholder="Краткое описание задач и требований к кандидату (опционально)"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={4}
            className="glass border-primary/30 focus:neon-glow transition-all resize-none"
          />

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              type="submit" 
              className="flex-1 neon-glow bg-gradient-to-r from-primary to-secondary hover:opacity-90 hover:scale-105 transition-all"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Icon name="loader-2" className="animate-spin mr-2" size={18} />
                  Отправка...
                </>
              ) : (
                <>
                  <Icon name="sparkles" className="mr-2" size={18} />
                  Получить бесплатный анализ
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="hover:neon-glow transition-all"
              disabled={isSubmitting}
            >
              Позже
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

export default VacancyAnalysisModal;
