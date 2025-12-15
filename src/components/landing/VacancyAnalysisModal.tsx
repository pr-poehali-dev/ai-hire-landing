import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { sendMetrikaGoal, metrikaGoals } from '@/utils/metrika';

interface VacancyAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VacancyAnalysisModal = ({ isOpen, onClose }: VacancyAnalysisModalProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    sendMetrikaGoal(metrikaGoals.FORM_SUBMIT, { form_type: 'vacancy_analysis' });
    
    try {
      const timestamp = new Date().toLocaleString('ru-RU');
      const leadData = {
        name: formData.name,
        phone: formData.phone,
        source: 'vacancy_analysis_popup',
        form_type: 'vacancy_analysis',
        page: 'main',
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

      sendMetrikaGoal(metrikaGoals.VACANCY_VIEW);
      sendMetrikaGoal(metrikaGoals.LEAD_CREATED, { source: 'vacancy_analysis_popup' });
      
      setFormData({ name: '', phone: '' });
      onClose();
      navigate('/thank-you');
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
      <DialogContent className="glass-dark border-primary/30 max-w-md max-h-[95vh] overflow-hidden flex flex-col p-3 sm:p-4">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-glow">
              <Icon name="brain" size={16} className="text-white sm:w-5 sm:h-5" />
            </div>
            <div>
              <DialogTitle className="text-sm sm:text-xl font-bold neon-text">
                AI-анализ вакансии
              </DialogTitle>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                Готовая воронка за 30 минут
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 flex-1 overflow-y-auto">
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            <div className="glass p-1.5 sm:p-2 rounded-lg text-center hover:neon-glow transition-all">
              <Icon name="target" size={14} className="text-primary mx-auto mb-0.5 sm:mb-1 sm:w-4 sm:h-4" />
              <p className="text-[9px] sm:text-[10px] font-bold">Портрет</p>
            </div>
            <div className="glass p-1.5 sm:p-2 rounded-lg text-center hover:neon-glow transition-all">
              <Icon name="filter" size={14} className="text-secondary mx-auto mb-0.5 sm:mb-1 sm:w-4 sm:h-4" />
              <p className="text-[9px] sm:text-[10px] font-bold">Воронка</p>
            </div>
            <div className="glass p-1.5 sm:p-2 rounded-lg text-center hover:neon-glow transition-all">
              <Icon name="trending-up" size={14} className="text-secondary mx-auto mb-0.5 sm:mb-1 sm:w-4 sm:h-4" />
              <p className="text-[9px] sm:text-[10px] font-bold">План</p>
            </div>
          </div>

          <div className="glass-dark p-2 sm:p-3 rounded-lg border-l-2 border-primary">
            <div className="flex items-start gap-1.5 sm:gap-2">
              <Icon name="sparkles" size={14} className="text-primary flex-shrink-0 mt-0.5 sm:w-4 sm:h-4" />
              <div className="space-y-1 sm:space-y-1.5">
                <p className="font-bold text-[11px] sm:text-xs">Что вы получите:</p>
                <ul className="space-y-0.5 sm:space-y-1 text-muted-foreground text-[10px] sm:text-[11px]">
                  <li className="flex items-start gap-1">
                    <Icon name="check" size={10} className="text-primary flex-shrink-0 mt-0.5 sm:w-3 sm:h-3" />
                    <span>Портрет кандидата</span>
                  </li>
                  <li className="flex items-start gap-1">
                    <Icon name="check" size={10} className="text-secondary flex-shrink-0 mt-0.5 sm:w-3 sm:h-3" />
                    <span>Воронка найма</span>
                  </li>
                  <li className="flex items-start gap-1">
                    <Icon name="check" size={10} className="text-secondary flex-shrink-0 mt-0.5 sm:w-3 sm:h-3" />
                    <span>План поиска</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1 sm:gap-1.5">
            <Badge className="bg-primary/20 text-primary text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5">
              <Icon name="clock" size={8} className="mr-0.5 sm:mr-1 sm:w-2.5 sm:h-2.5" />
              30 мин
            </Badge>
            <Badge className="bg-secondary/20 text-secondary text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5">
              <Icon name="gift" size={8} className="mr-0.5 sm:mr-1 sm:w-2.5 sm:h-2.5" />
              Бесплатно
            </Badge>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3 flex-shrink-0">
          <div className="grid grid-cols-1 gap-2">
            <Input 
              placeholder="Ваше имя *"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              className="glass border-primary/30 focus:neon-glow transition-all h-9 sm:h-11 text-sm sm:text-base"
            />

            <Input 
              placeholder="Телефон *"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
              className="glass border-primary/30 focus:neon-glow transition-all h-9 sm:h-11 text-sm sm:text-base"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              type="submit" 
              className="flex-1 neon-glow bg-gradient-to-r from-primary to-secondary hover:opacity-90 hover:scale-105 transition-all h-9 sm:h-11 text-xs sm:text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Icon name="loader-2" className="animate-spin mr-1.5 sm:mr-2" size={14} />
                  Отправка...
                </>
              ) : (
                <>
                  <Icon name="sparkles" className="mr-1.5 sm:mr-2" size={14} />
                  Получить анализ
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="hover:neon-glow transition-all h-9 sm:h-11 text-xs sm:text-base"
              disabled={isSubmitting}
            >
              Позже
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

export default VacancyAnalysisModal;