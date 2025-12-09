import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import AIAssistant from '@/components/AIAssistant';
import { Separator } from '@/components/ui/separator';

interface Task {
  id: number;
  title: string;
  description?: string;
  due_date?: string;
  completed: boolean;
  priority: string;
  created_at?: string;
}

interface Comment {
  id: number;
  author_name?: string;
  text: string;
  created_at: string;
}

interface Call {
  id: number;
  phone_number: string;
  direction: string;
  duration: number;
  recording_url?: string;
  status: string;
  started_at: string;
}

interface Lead {
  id: number;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  vacancy?: string;
  source: string;
  stage_id: number;
  priority: string;
  notes?: string;
  created_at: string;
  tasks?: Task[];
  comments?: Comment[];
  calls?: Call[];
}

interface TimelineEvent {
  id: string;
  type: 'task' | 'comment' | 'call' | 'info';
  timestamp: string;
  data: any;
}

interface LeadDetailsDialogProps {
  selectedLead: Lead | null;
  setSelectedLead: (lead: Lead | null) => void;
  editingLead: Partial<Lead>;
  setEditingLead: (lead: Partial<Lead>) => void;
  updateLead: () => void;
  initiateCall: (phone: string) => void;
  taskForm: any;
  setTaskForm: (form: any) => void;
  createTask: () => void;
  toggleTask: (taskId: number, completed: boolean) => void;
  commentText: string;
  setCommentText: (text: string) => void;
  addComment: () => void;
  getPriorityColor: (priority: string) => string;
  formatDate: (date: string) => string;
  formatDuration: (seconds: number) => string;
  buildTimeline: (lead: Lead) => TimelineEvent[];
}

const LeadDetailsDialog = ({
  selectedLead,
  setSelectedLead,
  editingLead,
  setEditingLead,
  updateLead,
  initiateCall,
  taskForm,
  setTaskForm,
  createTask,
  toggleTask,
  commentText,
  setCommentText,
  addComment,
  getPriorityColor,
  formatDate,
  formatDuration,
  buildTimeline
}: LeadDetailsDialogProps) => {
  return (
    <Dialog open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden glass-dark flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-2xl neon-text">{selectedLead?.name}</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => selectedLead && initiateCall(selectedLead.phone)}>
                <Icon name="Phone" size={16} className="mr-2" />
                Позвонить
              </Button>
              <Button size="sm" onClick={updateLead} className="neon-glow">
                <Icon name="Save" size={16} className="mr-2" />
                Сохранить
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        {selectedLead && (
          <div className="grid grid-cols-3 gap-6 flex-1 overflow-hidden">
            <div className="col-span-1 space-y-4 overflow-y-auto pr-4">
              <Card className="glass p-4 space-y-4">
                <h3 className="font-bold flex items-center gap-2">
                  <Icon name="User" size={18} />
                  Информация
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground">Имя</label>
                    <Input 
                      value={editingLead.name || ''} 
                      onChange={(e) => setEditingLead({ ...editingLead, name: e.target.value })}
                      className="glass mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Телефон</label>
                    <Input 
                      value={editingLead.phone || ''} 
                      onChange={(e) => setEditingLead({ ...editingLead, phone: e.target.value })}
                      className="glass mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Email</label>
                    <Input 
                      value={editingLead.email || ''} 
                      onChange={(e) => setEditingLead({ ...editingLead, email: e.target.value })}
                      className="glass mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Компания</label>
                    <Input 
                      value={editingLead.company || ''} 
                      onChange={(e) => setEditingLead({ ...editingLead, company: e.target.value })}
                      className="glass mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Вакансия</label>
                    <Input 
                      value={editingLead.vacancy || ''} 
                      onChange={(e) => setEditingLead({ ...editingLead, vacancy: e.target.value })}
                      className="glass mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Приоритет</label>
                    <Select 
                      value={editingLead.priority || 'medium'} 
                      onValueChange={(v) => setEditingLead({ ...editingLead, priority: v })}
                    >
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
                  <div>
                    <label className="text-xs text-muted-foreground">Заметки</label>
                    <Textarea 
                      value={editingLead.notes || ''} 
                      onChange={(e) => setEditingLead({ ...editingLead, notes: e.target.value })}
                      className="glass mt-1 min-h-[100px]"
                    />
                  </div>
                </div>
              </Card>

              <Card className="glass p-4">
                <h3 className="font-bold flex items-center gap-2 mb-4">
                  <Icon name="Sparkles" size={18} />
                  AI-Ассистент
                </h3>
                <AIAssistant />
              </Card>
            </div>

            <div className="col-span-2 flex flex-col gap-4 overflow-hidden">
              <Card className="glass p-4 flex-1 overflow-hidden flex flex-col">
                <h3 className="font-bold flex items-center gap-2 mb-4">
                  <Icon name="Clock" size={18} />
                  История взаимодействий
                </h3>

                <div className="space-y-4 overflow-y-auto flex-1 pr-2">
                  {buildTimeline(selectedLead).map((event) => (
                    <div key={event.id} className="relative pl-8 pb-4 border-l-2 border-muted-foreground/20">
                      <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-2 border-background"></div>
                      
                      <div className="text-xs text-muted-foreground mb-2">
                        {formatDate(event.timestamp)}
                      </div>

                      {event.type === 'info' && (
                        <Card className="glass p-3">
                          <div className="flex items-center gap-2">
                            <Icon name="UserPlus" size={16} className="text-green-400" />
                            <span className="text-sm">Лид создан</span>
                          </div>
                        </Card>
                      )}

                      {event.type === 'task' && (
                        <Card className="glass p-3">
                          <div className="flex items-start gap-3">
                            <div onClick={() => toggleTask(event.data.id, !event.data.completed)} className="cursor-pointer mt-0.5">
                              <Icon 
                                name={event.data.completed ? "CheckCircle2" : "Circle"} 
                                size={18} 
                                className={event.data.completed ? "text-green-400" : "text-muted-foreground"}
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className={`text-sm font-medium ${event.data.completed ? 'line-through text-muted-foreground' : ''}`}>
                                  {event.data.title}
                                </span>
                                <Badge className={getPriorityColor(event.data.priority)} style={{ fontSize: '9px', padding: '2px 6px' }}>
                                  {event.data.priority}
                                </Badge>
                              </div>
                              {event.data.description && (
                                <p className="text-xs text-muted-foreground">{event.data.description}</p>
                              )}
                              {event.data.due_date && (
                                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                  <Icon name="Calendar" size={12} />
                                  {formatDate(event.data.due_date)}
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      )}

                      {event.type === 'comment' && (
                        <Card className="glass p-3">
                          <div className="flex items-start gap-2">
                            <Icon name="MessageSquare" size={16} className="text-blue-400 mt-0.5" />
                            <div className="flex-1">
                              {event.data.author_name && (
                                <p className="text-xs font-semibold mb-1">{event.data.author_name}</p>
                              )}
                              <p className="text-sm">{event.data.text}</p>
                            </div>
                          </div>
                        </Card>
                      )}

                      {event.type === 'call' && (
                        <Card className="glass p-3">
                          <div className="flex items-start gap-2">
                            <Icon name={event.data.direction === 'incoming' ? 'PhoneIncoming' : 'PhoneOutgoing'} size={16} className="text-green-400 mt-0.5" />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium">
                                  {event.data.direction === 'incoming' ? 'Входящий' : 'Исходящий'} звонок
                                </span>
                                <Badge className="text-xs">{formatDuration(event.data.duration)}</Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">{event.data.phone_number}</p>
                              {event.data.recording_url && (
                                <audio controls className="mt-2 w-full h-8">
                                  <source src={event.data.recording_url} type="audio/mpeg" />
                                </audio>
                              )}
                            </div>
                          </div>
                        </Card>
                      )}
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />
                
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Новая задача..."
                      value={taskForm.title}
                      onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                      className="glass"
                    />
                    <Select 
                      value={taskForm.priority} 
                      onValueChange={(v) => setTaskForm({ ...taskForm, priority: v })}
                    >
                      <SelectTrigger className="w-32 glass">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">Высокий</SelectItem>
                        <SelectItem value="medium">Средний</SelectItem>
                        <SelectItem value="low">Низкий</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={createTask} size="sm">
                      <Icon name="Plus" size={16} />
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <Input 
                      placeholder="Добавить комментарий..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addComment()}
                      className="glass"
                    />
                    <Button onClick={addComment} size="sm">
                      <Icon name="Send" size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LeadDetailsDialog;
