import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import AIAssistant from '@/components/AIAssistant';

interface Lead {
  id: number;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  vacancy?: string;
  source: string;
  stage_id: number;
  stage_name?: string;
  stage_color?: string;
  priority: string;
  notes?: string;
  created_at: string;
  tasks?: Task[];
  comments?: Comment[];
  calls?: Call[];
}

interface Stage {
  id: number;
  name: string;
  color: string;
  position: number;
}

interface Task {
  id: number;
  title: string;
  description?: string;
  due_date?: string;
  completed: boolean;
  priority: string;
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

const CRM = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', due_date: '', priority: 'medium' });
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      toast({
        title: 'Требуется авторизация',
        description: 'Пожалуйста, войдите в систему',
        variant: 'destructive'
      });
      navigate('/login');
      return;
    }
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/19fedd69-26c7-42ad-b2c4-72e66ff282e6');
      const data = await response.json();
      setLeads(data.leads || []);
      setStages(data.stages || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast({ title: 'Ошибка загрузки данных', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLeadDetails = async (leadId: number) => {
    try {
      const response = await fetch(`https://functions.poehali.dev/19fedd69-26c7-42ad-b2c4-72e66ff282e6?id=${leadId}`);
      const data = await response.json();
      if (data.success) {
        setSelectedLead(data.lead);
      }
    } catch (error) {
      console.error('Error fetching lead details:', error);
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const leadId = parseInt(draggableId);
    const newStageId = parseInt(destination.droppableId);

    try {
      await fetch('https://functions.poehali.dev/19fedd69-26c7-42ad-b2c4-72e66ff282e6', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, stage_id: newStageId })
      });

      setLeads(prev => prev.map(lead => 
        lead.id === leadId ? { ...lead, stage_id: newStageId } : lead
      ));

      toast({ title: 'Этап изменен', description: 'Лид перемещен успешно' });
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось переместить лид', variant: 'destructive' });
    }
  };

  const addTask = async () => {
    if (!selectedLead || !taskForm.title) return;

    try {
      await fetch('https://functions.poehali.dev/9861dc82-040e-4a0d-927d-4b27b1dac665', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_id: selectedLead.id,
          ...taskForm
        })
      });

      toast({ title: 'Задача создана' });
      setIsTaskDialogOpen(false);
      setTaskForm({ title: '', description: '', due_date: '', priority: 'medium' });
      fetchLeadDetails(selectedLead.id);
    } catch (error) {
      toast({ title: 'Ошибка создания задачи', variant: 'destructive' });
    }
  };

  const addComment = async () => {
    if (!selectedLead || !commentText) return;

    try {
      await fetch('https://functions.poehali.dev/7a588f89-07d2-4cbe-9eec-6ef7c265b718', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_id: selectedLead.id,
          author_name: localStorage.getItem('user_name') || 'HR Manager',
          text: commentText
        })
      });

      toast({ title: 'Комментарий добавлен' });
      setCommentText('');
      setIsCommentDialogOpen(false);
      fetchLeadDetails(selectedLead.id);
    } catch (error) {
      toast({ title: 'Ошибка добавления комментария', variant: 'destructive' });
    }
  };

  const initiateCall = async (phone: string) => {
    if (!selectedLead) return;

    try {
      const response = await fetch('https://functions.poehali.dev/35742c04-37f7-41e3-9817-10f7d03806b3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_id: selectedLead.id,
          phone: phone
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast({ 
          title: 'Звонок инициирован', 
          description: data.message || 'Подключите Манго Офис для реальных звонков'
        });
        fetchLeadDetails(selectedLead.id);
      }
    } catch (error) {
      toast({ title: 'Ошибка звонка', variant: 'destructive' });
    }
  };

  const updateLead = async (updates: Partial<Lead>) => {
    if (!selectedLead) return;

    try {
      await fetch('https://functions.poehali.dev/19fedd69-26c7-42ad-b2c4-72e66ff282e6', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedLead.id, ...updates })
      });

      toast({ title: 'Лид обновлен' });
      fetchLeads();
      fetchLeadDetails(selectedLead.id);
    } catch (error) {
      toast({ title: 'Ошибка обновления', variant: 'destructive' });
    }
  };

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.vacancy?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getLeadsByStage = (stageId: number) => {
    return filteredLeads.filter(lead => lead.stage_id === stageId);
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      high: 'bg-red-500/20 text-red-400',
      medium: 'bg-yellow-500/20 text-yellow-400',
      low: 'bg-green-500/20 text-green-400'
    };
    return colors[priority] || colors.medium;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-20 left-10 w-64 h-64 bg-primary/20 rounded-full blur-orb animate-pulse" style={{ animationDuration: '4s' }}></div>
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-secondary/15 rounded-full blur-orb animate-pulse" style={{ animationDuration: '6s' }}></div>

      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 hover-scale cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-glow">
                <Icon name="Sparkles" size={20} className="text-white animate-pulse" />
              </div>
              <span className="text-xl font-bold neon-text">1 DAY HR - CRM</span>
            </button>

            <div className="flex items-center gap-2">
              <Button onClick={() => setViewMode(viewMode === 'kanban' ? 'list' : 'kanban')} variant="outline" size="sm">
                <Icon name={viewMode === 'kanban' ? 'List' : 'Columns'} size={16} className="mr-2" />
                {viewMode === 'kanban' ? 'Список' : 'Канбан'}
              </Button>
              <Button onClick={fetchLeads} variant="outline" size="sm">
                <Icon name="RefreshCw" size={16} className="mr-2" />
                Обновить
              </Button>
              <Button 
                onClick={() => {
                  localStorage.clear();
                  navigate('/login');
                }}
                variant="outline" 
                size="sm"
              >
                <Icon name="LogOut" size={16} className="mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      <section className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-full">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-bold neon-text">CRM система</h1>
              <Badge className="text-lg px-4 py-2 neon-glow">{filteredLeads.length} лидов</Badge>
            </div>

            <div className="relative max-w-md">
              <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Поиск по имени, телефону, компании..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass border-primary/30 h-12"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Icon name="Loader2" size={48} className="animate-spin text-primary" />
            </div>
          ) : viewMode === 'kanban' ? (
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {stages.map(stage => (
                  <Droppable key={stage.id} droppableId={String(stage.id)}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps}>
                        <Card className="glass-dark p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: stage.color }}
                              />
                              <h3 className="font-bold text-sm">{stage.name}</h3>
                            </div>
                            <Badge className="bg-muted">{getLeadsByStage(stage.id).length}</Badge>
                          </div>

                          <div className="space-y-2 min-h-[200px]">
                            {getLeadsByStage(stage.id).map((lead, index) => (
                              <Draggable key={lead.id} draggableId={String(lead.id)} index={index}>
                                {(provided) => (
                                  <Card
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="glass p-3 hover:neon-glow transition-all cursor-pointer"
                                    onClick={() => {
                                      setSelectedLead(lead);
                                      fetchLeadDetails(lead.id);
                                    }}
                                  >
                                    <div className="space-y-2">
                                      <div className="flex items-start justify-between">
                                        <h4 className="font-bold text-sm">{lead.name}</h4>
                                        <Badge className={getPriorityColor(lead.priority)} style={{ fontSize: '9px', padding: '2px 6px' }}>
                                          {lead.priority}
                                        </Badge>
                                      </div>
                                      <div className="text-xs text-muted-foreground space-y-1">
                                        <div className="flex items-center gap-1">
                                          <Icon name="Phone" size={12} />
                                          {lead.phone}
                                        </div>
                                        {lead.company && (
                                          <div className="flex items-center gap-1">
                                            <Icon name="Building2" size={12} />
                                            {lead.company}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </Card>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        </Card>
                      </div>
                    )}
                  </Droppable>
                ))}
              </div>
            </DragDropContext>
          ) : (
            <div className="grid gap-4">
              {filteredLeads.map(lead => (
                <Card 
                  key={lead.id} 
                  className="glass-dark p-6 hover:neon-glow transition-all cursor-pointer"
                  onClick={() => {
                    setSelectedLead(lead);
                    fetchLeadDetails(lead.id);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Icon name="User" size={24} className="text-primary" />
                      <div>
                        <h3 className="font-bold text-lg">{lead.name}</h3>
                        <p className="text-sm text-muted-foreground">{lead.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(lead.priority)}>{lead.priority}</Badge>
                      <Badge style={{ backgroundColor: lead.stage_color }}>{lead.stage_name}</Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass-dark">
          {selectedLead && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl neon-text flex items-center justify-between">
                  <span>{selectedLead.name}</span>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => initiateCall(selectedLead.phone)} className="neon-glow">
                      <Icon name="Phone" size={16} className="mr-1" />
                      Позвонить
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setSelectedLead(null)}>
                      <Icon name="X" size={16} />
                    </Button>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <Tabs defaultValue="info" className="mt-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="info">Информация</TabsTrigger>
                  <TabsTrigger value="tasks">Задачи ({selectedLead.tasks?.length || 0})</TabsTrigger>
                  <TabsTrigger value="comments">Комментарии ({selectedLead.comments?.length || 0})</TabsTrigger>
                  <TabsTrigger value="calls">Звонки ({selectedLead.calls?.length || 0})</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Имя</label>
                      <Input 
                        value={selectedLead.name} 
                        onChange={(e) => setSelectedLead({...selectedLead, name: e.target.value})}
                        onBlur={() => updateLead({ name: selectedLead.name })}
                        className="glass mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Телефон</label>
                      <Input 
                        value={selectedLead.phone}
                        onChange={(e) => setSelectedLead({...selectedLead, phone: e.target.value})}
                        onBlur={() => updateLead({ phone: selectedLead.phone })}
                        className="glass mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Email</label>
                      <Input 
                        value={selectedLead.email || ''}
                        onChange={(e) => setSelectedLead({...selectedLead, email: e.target.value})}
                        onBlur={() => updateLead({ email: selectedLead.email })}
                        className="glass mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Компания</label>
                      <Input 
                        value={selectedLead.company || ''}
                        onChange={(e) => setSelectedLead({...selectedLead, company: e.target.value})}
                        onBlur={() => updateLead({ company: selectedLead.company })}
                        className="glass mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Вакансия</label>
                      <Input 
                        value={selectedLead.vacancy || ''}
                        onChange={(e) => setSelectedLead({...selectedLead, vacancy: e.target.value})}
                        onBlur={() => updateLead({ vacancy: selectedLead.vacancy })}
                        className="glass mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Приоритет</label>
                      <select 
                        value={selectedLead.priority}
                        onChange={(e) => {
                          setSelectedLead({...selectedLead, priority: e.target.value});
                          updateLead({ priority: e.target.value });
                        }}
                        className="glass border border-primary/30 rounded-md px-4 py-2 h-10 bg-background text-foreground w-full mt-1"
                      >
                        <option value="low">Низкий</option>
                        <option value="medium">Средний</option>
                        <option value="high">Высокий</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Заметки</label>
                    <Textarea 
                      value={selectedLead.notes || ''}
                      onChange={(e) => setSelectedLead({...selectedLead, notes: e.target.value})}
                      onBlur={() => updateLead({ notes: selectedLead.notes })}
                      className="glass mt-1 min-h-[100px]"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="ai" className="mt-4">
                  <AIAssistant 
                    leadId={selectedLead.id} 
                    onCreateTask={(task) => {
                      setTaskForm({
                        title: task.title,
                        description: task.description,
                        due_date: '',
                        priority: task.priority
                      });
                      setIsTaskDialogOpen(true);
                    }}
                  />
                </TabsContent>

                <TabsContent value="tasks" className="space-y-4 mt-4">
                  <Button onClick={() => setIsTaskDialogOpen(true)} className="w-full neon-glow">
                    <Icon name="Plus" size={16} className="mr-2" />
                    Добавить задачу
                  </Button>

                  <div className="space-y-2">
                    {selectedLead.tasks?.map(task => (
                      <Card key={task.id} className="glass p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <input 
                              type="checkbox" 
                              checked={task.completed}
                              className="mt-1"
                              readOnly
                            />
                            <div className="flex-1">
                              <h4 className="font-bold">{task.title}</h4>
                              {task.description && <p className="text-sm text-muted-foreground mt-1">{task.description}</p>}
                              {task.due_date && (
                                <p className="text-xs text-muted-foreground mt-2">
                                  <Icon name="Clock" size={12} className="inline mr-1" />
                                  {formatDate(task.due_date)}
                                </p>
                              )}
                            </div>
                          </div>
                          <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="comments" className="space-y-4 mt-4">
                  <Button onClick={() => setIsCommentDialogOpen(true)} className="w-full neon-glow">
                    <Icon name="MessageSquare" size={16} className="mr-2" />
                    Добавить комментарий
                  </Button>

                  <div className="space-y-2">
                    {selectedLead.comments?.map(comment => (
                      <Card key={comment.id} className="glass p-4">
                        <div className="flex items-start gap-3">
                          <Icon name="User" size={20} className="text-primary mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-sm">{comment.author_name || 'HR Manager'}</span>
                              <span className="text-xs text-muted-foreground">{formatDate(comment.created_at)}</span>
                            </div>
                            <p className="text-sm">{comment.text}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="calls" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    {selectedLead.calls?.map(call => (
                      <Card key={call.id} className="glass p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <Icon name={call.direction === 'outbound' ? 'PhoneOutgoing' : 'PhoneIncoming'} size={20} className="text-primary mt-1" />
                            <div>
                              <div className="font-bold">{call.phone_number}</div>
                              <div className="text-sm text-muted-foreground mt-1">
                                {formatDate(call.started_at)} • {call.duration} сек
                              </div>
                              {call.recording_url && (
                                <a href={call.recording_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-2 inline-block">
                                  <Icon name="Play" size={12} className="inline mr-1" />
                                  Прослушать запись
                                </a>
                              )}
                            </div>
                          </div>
                          <Badge>{call.status}</Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent className="glass-dark">
          <DialogHeader>
            <DialogTitle className="neon-text">Новая задача</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm text-muted-foreground">Название задачи</label>
              <Input 
                value={taskForm.title}
                onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                className="glass mt-1"
                placeholder="Перезвонить клиенту"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Описание</label>
              <Textarea 
                value={taskForm.description}
                onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                className="glass mt-1"
                placeholder="Детали задачи..."
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Срок выполнения</label>
              <Input 
                type="datetime-local"
                value={taskForm.due_date}
                onChange={(e) => setTaskForm({...taskForm, due_date: e.target.value})}
                className="glass mt-1"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Приоритет</label>
              <select 
                value={taskForm.priority}
                onChange={(e) => setTaskForm({...taskForm, priority: e.target.value})}
                className="glass border border-primary/30 rounded-md px-4 py-2 h-10 bg-background text-foreground w-full mt-1"
              >
                <option value="low">Низкий</option>
                <option value="medium">Средний</option>
                <option value="high">Высокий</option>
              </select>
            </div>
            <Button onClick={addTask} className="w-full neon-glow">
              <Icon name="Plus" size={16} className="mr-2" />
              Создать задачу
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isCommentDialogOpen} onOpenChange={setIsCommentDialogOpen}>
        <DialogContent className="glass-dark">
          <DialogHeader>
            <DialogTitle className="neon-text">Новый комментарий</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Textarea 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="glass min-h-[120px]"
              placeholder="Введите комментарий..."
            />
            <Button onClick={addComment} className="w-full neon-glow">
              <Icon name="MessageSquare" size={16} className="mr-2" />
              Добавить комментарий
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CRM;