import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface DailyTask {
  lead_id: number;
  lead_name: string;
  action: string;
  priority: string;
  reason: string;
  estimated_time: string;
}

interface CRMModalsProps {
  isLeadDialogOpen: boolean;
  setIsLeadDialogOpen: (open: boolean) => void;
  leadForm: any;
  setLeadForm: (form: any) => void;
  createLead: () => void;
  
  isStageDialogOpen: boolean;
  setIsStageDialogOpen: (open: boolean) => void;
  stageForm: any;
  setStageForm: (form: any) => void;
  saveStage: () => void;
  deleteStage: (stageId: number) => void;
  
  isDailyPlanOpen: boolean;
  setIsDailyPlanOpen: (open: boolean) => void;
  dailyTasks: DailyTask[];
  
  isMangoSettingsOpen: boolean;
  setIsMangoSettingsOpen: (open: boolean) => void;
  isTestingMango: boolean;
}

const CRMModals = ({
  isLeadDialogOpen,
  setIsLeadDialogOpen,
  leadForm,
  setLeadForm,
  createLead,
  isStageDialogOpen,
  setIsStageDialogOpen,
  stageForm,
  setStageForm,
  saveStage,
  deleteStage,
  isDailyPlanOpen,
  setIsDailyPlanOpen,
  dailyTasks,
  isMangoSettingsOpen,
  setIsMangoSettingsOpen,
  isTestingMango
}: CRMModalsProps) => {
  return (
    <>
      <Dialog open={isLeadDialogOpen} onOpenChange={setIsLeadDialogOpen}>
        <DialogContent className="glass-dark">
          <DialogHeader>
            <DialogTitle className="neon-text">Новый лид</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Имя *</label>
                <Input 
                  value={leadForm.name} 
                  onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                  className="glass mt-1"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Телефон *</label>
                <Input 
                  value={leadForm.phone} 
                  onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                  className="glass mt-1"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Email</label>
                <Input 
                  value={leadForm.email} 
                  onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                  className="glass mt-1"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Компания</label>
                <Input 
                  value={leadForm.company} 
                  onChange={(e) => setLeadForm({ ...leadForm, company: e.target.value })}
                  className="glass mt-1"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Вакансия</label>
                <Input 
                  value={leadForm.vacancy} 
                  onChange={(e) => setLeadForm({ ...leadForm, vacancy: e.target.value })}
                  className="glass mt-1"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Приоритет</label>
                <Select value={leadForm.priority} onValueChange={(v) => setLeadForm({ ...leadForm, priority: v })}>
                  <SelectTrigger className="glass mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">Высокий</SelectItem>
                    <SelectItem value="medium">Средний</SelectItem>
                    <SelectItem value="low">Низкий</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Заметки</label>
              <Textarea 
                value={leadForm.notes} 
                onChange={(e) => setLeadForm({ ...leadForm, notes: e.target.value })}
                className="glass mt-1"
              />
            </div>
            <Button onClick={createLead} className="w-full neon-glow">
              Создать лид
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isStageDialogOpen} onOpenChange={setIsStageDialogOpen}>
        <DialogContent className="glass-dark">
          <DialogHeader>
            <DialogTitle className="neon-text">{stageForm.id ? 'Редактировать этап' : 'Новый этап'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm text-muted-foreground">Название</label>
              <Input 
                value={stageForm.name} 
                onChange={(e) => setStageForm({ ...stageForm, name: e.target.value })}
                className="glass mt-1"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Цвет</label>
              <Input 
                type="color"
                value={stageForm.color} 
                onChange={(e) => setStageForm({ ...stageForm, color: e.target.value })}
                className="glass mt-1 h-12"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={saveStage} className="flex-1 neon-glow">
                {stageForm.id ? 'Сохранить' : 'Создать'}
              </Button>
              {stageForm.id && (
                <Button variant="destructive" onClick={() => {
                  deleteStage(stageForm.id);
                  setIsStageDialogOpen(false);
                }}>
                  Удалить
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDailyPlanOpen} onOpenChange={setIsDailyPlanOpen}>
        <DialogContent className="glass-dark max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="neon-text flex items-center gap-2">
              <Icon name="Calendar" size={24} />
              План на день
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-3">
            {dailyTasks.map((task, index) => (
              <Card key={index} className="glass p-4">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold">{task.lead_name}</h4>
                      <div className="flex items-center gap-2">
                        <Badge className={
                          task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                          task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }>
                          {task.priority}
                        </Badge>
                        <Badge variant="outline">{task.estimated_time}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-foreground mb-2">{task.action}</p>
                    <p className="text-xs text-muted-foreground">{task.reason}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isMangoSettingsOpen} onOpenChange={setIsMangoSettingsOpen}>
        <DialogContent className="glass-dark max-w-2xl">
          <DialogHeader>
            <DialogTitle className="neon-text flex items-center gap-2">
              <Icon name="Phone" size={24} />
              Настройка Mango Office
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <div className="flex gap-3">
                <Icon name="AlertCircle" size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-red-400 mb-2">Ошибка аутентификации Mango Office</p>
                  <p className="text-muted-foreground mb-3">API Mango Office отклонил запрос с указанными ключами. Это означает, что:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                    <li>Ключи указаны неверно или устарели</li>
                    <li>При копировании добавились лишние пробелы или символы</li>
                    <li>API доступ не активирован в настройках АТС</li>
                    <li>IP адрес сервера не добавлен в белый список (если настроено)</li>
                  </ul>
                </div>
              </div>
            </div>

            <Card className="glass p-4">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Icon name="Settings" size={18} />
                Необходимые секреты:
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <Icon name="Key" size={16} className="text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-mono font-semibold">MANGO_VPB_KEY</p>
                    <p className="text-muted-foreground text-xs mt-1">Уникальный код вашей АТС Mango Office</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <Icon name="Key" size={16} className="text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-mono font-semibold">MANGO_SIGN_KEY</p>
                    <p className="text-muted-foreground text-xs mt-1">Ключ для подписи API запросов</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <Icon name="Key" size={16} className="text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-mono font-semibold">MANGO_API_URL</p>
                    <p className="text-muted-foreground text-xs mt-1">URL API (по умолчанию: https://app.mango-office.ru/vpbx/)</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="glass p-4">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Icon name="BookOpen" size={18} />
                Как исправить:
              </h3>
              <ol className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="font-bold text-primary">1.</span>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Проверьте активацию API</p>
                    <p>В личном кабинете Mango Office → Настройки → API убедитесь, что API доступ активирован</p>
                  </div>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-primary">2.</span>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Скопируйте ключи правильно</p>
                    <p>Копируйте VPB Key и Sign Key полностью, без пробелов в начале/конце</p>
                  </div>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-primary">3.</span>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Добавьте секреты в проект</p>
                    <p>Перейдите в настройки проекта → Секреты → Добавьте MANGO_VPB_KEY, MANGO_SIGN_KEY и MANGO_API_URL</p>
                  </div>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-primary">4.</span>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Перезагрузите backend</p>
                    <p>После добавления секретов перезапустите backend функции для применения изменений</p>
                  </div>
                </li>
              </ol>
            </Card>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setIsMangoSettingsOpen(false)}>
                Закрыть
              </Button>
              <Button 
                className="flex-1 neon-glow" 
                disabled={isTestingMango}
                onClick={() => window.open('https://app.mango-office.ru', '_blank')}
              >
                <Icon name="ExternalLink" size={16} className="mr-2" />
                Открыть Mango Office
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CRMModals;
