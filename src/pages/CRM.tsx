import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

interface DailyTask {
  lead_id: number;
  lead_name: string;
  action: string;
  priority: string;
  reason: string;
  estimated_time: string;
}

const CRM = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterSource, setFilterSource] = useState<string>('all');
  const [isLeadDialogOpen, setIsLeadDialogOpen] = useState(false);
  const [isStageDialogOpen, setIsStageDialogOpen] = useState(false);
  const [isDailyPlanOpen, setIsDailyPlanOpen] = useState(false);
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  
  const [leadForm, setLeadForm] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    vacancy: '',
    source: 'manual',
    priority: 'medium',
    notes: ''
  });

  const [stageForm, setStageForm] = useState({
    id: 0,
    name: '',
    color: '#3b82f6',
    position: 0
  });

  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: 'medium'
  });

  const [commentText, setCommentText] = useState('');
  const [editingLead, setEditingLead] = useState<Partial<Lead>>({});

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
        setEditingLead(data.lead);
      }
    } catch (error) {
      console.error('Error fetching lead details:', error);
    }
  };

  const createLead = async () => {
    if (!leadForm.name || !leadForm.phone) {
      toast({ title: 'Заполните обязательные поля', variant: 'destructive' });
      return;
    }

    try {
      const response = await fetch('https://functions.poehali.dev/19fedd69-26c7-42ad-b2c4-72e66ff282e6', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadForm)
      });

      if (response.ok) {
        toast({ title: 'Лид создан!' });
        setIsLeadDialogOpen(false);
        setLeadForm({
          name: '',
          phone: '',
          email: '',
          company: '',
          vacancy: '',
          source: 'manual',
          priority: 'medium',
          notes: ''
        });
        fetchLeads();
      }
    } catch (error) {
      toast({ title: 'Ошибка создания лида', variant: 'destructive' });
    }
  };

  const updateLead = async () => {
    if (!selectedLead) return;

    try {
      await fetch('https://functions.poehali.dev/19fedd69-26c7-42ad-b2c4-72e66ff282e6', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedLead.id, ...editingLead })
      });

      toast({ title: 'Лид обновлен' });
      fetchLeads();
      fetchLeadDetails(selectedLead.id);
    } catch (error) {
      toast({ title: 'Ошибка обновления', variant: 'destructive' });
    }
  };

  const saveStage = async () => {
    if (!stageForm.name) {
      toast({ title: 'Введите название этапа', variant: 'destructive' });
      return;
    }

    try {
      const method = stageForm.id ? 'PATCH' : 'POST';
      const response = await fetch('https://functions.poehali.dev/19fedd69-26c7-42ad-b2c4-72e66ff282e6/stages', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stageForm)
      });

      if (response.ok) {
        toast({ title: stageForm.id ? 'Этап обновлен' : 'Этап создан' });
        setIsStageDialogOpen(false);
        setStageForm({ id: 0, name: '', color: '#3b82f6', position: 0 });
        fetchLeads();
      }
    } catch (error) {
      toast({ title: 'Ошибка сохранения этапа', variant: 'destructive' });
    }
  };

  const deleteStage = async (stageId: number) => {
    if (!confirm('Удалить этап? Все лиды будут перемещены в первый этап.')) return;

    try {
      await fetch(`https://functions.poehali.dev/19fedd69-26c7-42ad-b2c4-72e66ff282e6/stages/${stageId}`, {
        method: 'DELETE'
      });

      toast({ title: 'Этап удален' });
      fetchLeads();
    } catch (error) {
      toast({ title: 'Ошибка удаления', variant: 'destructive' });
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

      toast({ title: 'Этап изменен' });
    } catch (error) {
      toast({ title: 'Ошибка', variant: 'destructive' });
    }
  };

  const addTask = async () => {
    if (!selectedLead || !taskForm.title) return;

    try {
      await fetch('https://functions.poehali.dev/9861dc82-040e-4a0d-927d-4b27b1dac665', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead_id: selectedLead.id, ...taskForm })
      });

      toast({ title: 'Задача добавлена' });
      setTaskForm({ title: '', description: '', due_date: '', priority: 'medium' });
      fetchLeadDetails(selectedLead.id);
    } catch (error) {
      toast({ title: 'Ошибка добавления задачи', variant: 'destructive' });
    }
  };

  const toggleTask = async (taskId: number, completed: boolean) => {
    if (!selectedLead) return;

    try {
      await fetch('https://functions.poehali.dev/9861dc82-040e-4a0d-927d-4b27b1dac665', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId, completed })
      });

      fetchLeadDetails(selectedLead.id);
    } catch (error) {
      toast({ title: 'Ошибка обновления задачи', variant: 'destructive' });
    }
  };

  const addComment = async () => {
    if (!selectedLead || !commentText.trim()) return;

    try {
      await fetch('https://functions.poehali.dev/7a588f89-07d2-4cbe-9eec-6ef7c265b718', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead_id: selectedLead.id, text: commentText })
      });

      toast({ title: 'Комментарий добавлен' });
      setCommentText('');
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
          description: data.message || 'Звонок отправлен в Mango Office'
        });
        fetchLeadDetails(selectedLead.id);
      } else {
        toast({ 
          title: 'Ошибка звонка', 
          description: data.error,
          variant: 'destructive' 
        });
      }
    } catch (error) {
      toast({ title: 'Ошибка звонка', variant: 'destructive' });
    }
  };

  const generateDailyPlan = async () => {
    setIsGeneratingPlan(true);
    try {
      const response = await fetch('https://functions.poehali.dev/b5093c80-da38-4c7f-8452-5125c945efe3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'daily_plan',
          leads: leads.map(l => ({ id: l.id, name: l.name, stage_id: l.stage_id, priority: l.priority }))
        })
      });

      const data = await response.json();
      
      if (data.success && data.daily_tasks) {
        setDailyTasks(data.daily_tasks);
        setIsDailyPlanOpen(true);
        toast({ title: 'План на день готов!' });
      }
    } catch (error) {
      toast({ title: 'Ошибка генерации плана', variant: 'destructive' });
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPriority = filterPriority === 'all' || lead.priority === filterPriority;
    const matchesSource = filterSource === 'all' || lead.source === filterSource;
    
    return matchesSearch && matchesPriority && matchesSource;
  });

  const getLeadsByStage = (stageId: number) => {
    return filteredLeads.filter(lead => lead.stage_id === stageId);
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      high: 'bg-red-500/20 text-red-400 border-red-500/30',
      medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      low: 'bg-green-500/20 text-green-400 border-green-500/30'
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

  const sources = Array.from(new Set(leads.map(l => l.source)));

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
              <Button onClick={() => setIsLeadDialogOpen(true)} className="neon-glow">
                <Icon name="Plus" size={16} className="mr-2" />
                Добавить лид
              </Button>
              <Button onClick={generateDailyPlan} variant="outline" disabled={isGeneratingPlan}>
                <Icon name={isGeneratingPlan ? "Loader2" : "CalendarCheck"} size={16} className={`mr-2 ${isGeneratingPlan ? 'animate-spin' : ''}`} />
                План на день
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
              <div className="flex items-center gap-4">
                <Badge className="text-lg px-4 py-2 neon-glow">{filteredLeads.length} лидов</Badge>
                <Button onClick={() => setIsStageDialogOpen(true)} variant="outline" size="sm">
                  <Icon name="Settings" size={16} className="mr-2" />
                  Настройка этапов
                </Button>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Поиск по имени, телефону, компании..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 glass border-primary/30"
                />
              </div>

              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-40 glass">
                  <SelectValue placeholder="Приоритет" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все приоритеты</SelectItem>
                  <SelectItem value="high">Высокий</SelectItem>
                  <SelectItem value="medium">Средний</SelectItem>
                  <SelectItem value="low">Низкий</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterSource} onValueChange={setFilterSource}>
                <SelectTrigger className="w-40 glass">
                  <SelectValue placeholder="Источник" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все источники</SelectItem>
                  {sources.map(source => (
                    <SelectItem key={source} value={source}>{source}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(filterPriority !== 'all' || filterSource !== 'all') && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setFilterPriority('all');
                    setFilterSource('all');
                  }}
                >
                  <Icon name="X" size={16} className="mr-2" />
                  Сбросить
                </Button>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Icon name="Loader2" size={48} className="animate-spin text-primary" />
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {stages.map(stage => (
                  <Droppable key={stage.id} droppableId={String(stage.id)}>
                    {(provided) => (
                      <div 
                        ref={provided.innerRef} 
                        {...provided.droppableProps}
                        className="flex-shrink-0 w-80"
                      >
                        <Card className="glass-dark p-4 h-full">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: stage.color }}
                              />
                              <h3 className="font-bold">{stage.name}</h3>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-muted">{getLeadsByStage(stage.id).length}</Badge>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setStageForm(stage);
                                  setIsStageDialogOpen(true);
                                }}
                              >
                                <Icon name="Edit" size={14} />
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2 min-h-[400px] max-h-[calc(100vh-280px)] overflow-y-auto">
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
                                        <div className="flex items-center gap-1">
                                          <Icon name="Tag" size={12} />
                                          {lead.source}
                                        </div>
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
          )}
        </div>
      </section>

      <Dialog open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass-dark">
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
            <Tabs defaultValue="info" className="mt-4">
              <TabsList className="grid w-full grid-cols-5 glass">
                <TabsTrigger value="info">
                  <Icon name="User" size={16} className="mr-2" />
                  Информация
                </TabsTrigger>
                <TabsTrigger value="tasks">
                  <Icon name="CheckSquare" size={16} className="mr-2" />
                  Задачи ({selectedLead.tasks?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="comments">
                  <Icon name="MessageSquare" size={16} className="mr-2" />
                  Комментарии ({selectedLead.comments?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="calls">
                  <Icon name="Phone" size={16} className="mr-2" />
                  Звонки ({selectedLead.calls?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="ai">
                  <Icon name="Sparkles" size={16} className="mr-2" />
                  AI-анализ
                </TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Имя</label>
                    <Input 
                      value={editingLead.name || ''} 
                      onChange={(e) => setEditingLead({ ...editingLead, name: e.target.value })}
                      className="glass mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Телефон</label>
                    <Input 
                      value={editingLead.phone || ''} 
                      onChange={(e) => setEditingLead({ ...editingLead, phone: e.target.value })}
                      className="glass mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Email</label>
                    <Input 
                      value={editingLead.email || ''} 
                      onChange={(e) => setEditingLead({ ...editingLead, email: e.target.value })}
                      className="glass mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Компания</label>
                    <Input 
                      value={editingLead.company || ''} 
                      onChange={(e) => setEditingLead({ ...editingLead, company: e.target.value })}
                      className="glass mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Вакансия</label>
                    <Input 
                      value={editingLead.vacancy || ''} 
                      onChange={(e) => setEditingLead({ ...editingLead, vacancy: e.target.value })}
                      className="glass mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Приоритет</label>
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
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Заметки</label>
                  <Textarea 
                    value={editingLead.notes || ''} 
                    onChange={(e) => setEditingLead({ ...editingLead, notes: e.target.value })}
                    className="glass mt-1 min-h-[100px]"
                  />
                </div>
                <Card className="glass p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Источник:</span>
                      <span className="ml-2 font-bold">{selectedLead.source}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Создан:</span>
                      <span className="ml-2 font-bold">{formatDate(selectedLead.created_at)}</span>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="tasks" className="space-y-4 mt-4">
                <Card className="glass p-4">
                  <div className="space-y-3">
                    <Input 
                      placeholder="Название задачи" 
                      value={taskForm.title}
                      onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                      className="glass"
                    />
                    <Textarea 
                      placeholder="Описание (опционально)" 
                      value={taskForm.description}
                      onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                      className="glass"
                    />
                    <div className="flex gap-2">
                      <Input 
                        type="datetime-local"
                        value={taskForm.due_date}
                        onChange={(e) => setTaskForm({ ...taskForm, due_date: e.target.value })}
                        className="glass"
                      />
                      <Select 
                        value={taskForm.priority} 
                        onValueChange={(v) => setTaskForm({ ...taskForm, priority: v })}
                      >
                        <SelectTrigger className="glass w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">Высокий</SelectItem>
                          <SelectItem value="medium">Средний</SelectItem>
                          <SelectItem value="low">Низкий</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={addTask} className="w-full neon-glow">
                      <Icon name="Plus" size={16} className="mr-2" />
                      Добавить задачу
                    </Button>
                  </div>
                </Card>

                <div className="space-y-2">
                  {selectedLead.tasks?.map(task => (
                    <Card key={task.id} className="glass p-4 hover:neon-glow transition-all">
                      <div className="flex items-start gap-3">
                        <button 
                          onClick={() => toggleTask(task.id, !task.completed)}
                          className="mt-1"
                        >
                          <Icon 
                            name={task.completed ? "CheckSquare" : "Square"} 
                            size={20} 
                            className={task.completed ? "text-primary" : "text-muted-foreground"}
                          />
                        </button>
                        <div className="flex-1">
                          <h4 className={`font-bold ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                          )}
                          <div className="flex items-center gap-3 mt-2">
                            {task.due_date && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Icon name="Calendar" size={12} />
                                {formatDate(task.due_date)}
                              </div>
                            )}
                            <Badge className={getPriorityColor(task.priority)} style={{ fontSize: '10px', padding: '2px 6px' }}>
                              {task.priority}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="comments" className="space-y-4 mt-4">
                <Card className="glass p-4">
                  <div className="space-y-3">
                    <Textarea 
                      placeholder="Добавить комментарий..." 
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="glass min-h-[80px]"
                    />
                    <Button onClick={addComment} className="w-full neon-glow">
                      <Icon name="Send" size={16} className="mr-2" />
                      Добавить комментарий
                    </Button>
                  </div>
                </Card>

                <div className="space-y-2">
                  {selectedLead.comments?.map(comment => (
                    <Card key={comment.id} className="glass p-4">
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-bold text-sm">{comment.author_name || 'Менеджер'}</span>
                        <span className="text-xs text-muted-foreground">{formatDate(comment.created_at)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{comment.text}</p>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="calls" className="space-y-4 mt-4">
                <div className="space-y-2">
                  {selectedLead.calls?.map(call => (
                    <Card key={call.id} className="glass p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon 
                            name={call.direction === 'inbound' ? 'PhoneIncoming' : 'PhoneOutgoing'} 
                            size={20} 
                            className="text-primary"
                          />
                          <div>
                            <p className="font-bold">{call.phone_number}</p>
                            <p className="text-xs text-muted-foreground">
                              {call.direction === 'inbound' ? 'Входящий' : 'Исходящий'} • {call.duration}с
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={call.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}>
                            {call.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">{formatDate(call.started_at)}</p>
                        </div>
                      </div>
                      {call.recording_url && (
                        <div className="mt-3">
                          <audio controls src={call.recording_url} className="w-full" />
                        </div>
                      )}
                    </Card>
                  ))}
                  {(!selectedLead.calls || selectedLead.calls.length === 0) && (
                    <Card className="glass p-6 text-center">
                      <Icon name="Phone" size={32} className="mx-auto mb-2 text-muted-foreground" />
                      <p className="text-muted-foreground">История звонков пуста</p>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="ai" className="mt-4">
                <AIAssistant leadId={selectedLead.id} />
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isLeadDialogOpen} onOpenChange={setIsLeadDialogOpen}>
        <DialogContent className="glass-dark">
          <DialogHeader>
            <DialogTitle className="neon-text">Создать лид</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm text-muted-foreground">Имя *</label>
              <Input 
                value={leadForm.name} 
                onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                className="glass mt-1"
                placeholder="Иван Иванов"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Телефон *</label>
              <Input 
                value={leadForm.phone} 
                onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                className="glass mt-1"
                placeholder="+7 999 123-45-67"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Email</label>
              <Input 
                value={leadForm.email} 
                onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                className="glass mt-1"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Компания</label>
              <Input 
                value={leadForm.company} 
                onChange={(e) => setLeadForm({ ...leadForm, company: e.target.value })}
                className="glass mt-1"
                placeholder="ООО Компания"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Вакансия</label>
              <Input 
                value={leadForm.vacancy} 
                onChange={(e) => setLeadForm({ ...leadForm, vacancy: e.target.value })}
                className="glass mt-1"
                placeholder="Senior Developer"
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
            <div>
              <label className="text-sm text-muted-foreground">Заметки</label>
              <Textarea 
                value={leadForm.notes} 
                onChange={(e) => setLeadForm({ ...leadForm, notes: e.target.value })}
                className="glass mt-1"
                placeholder="Дополнительная информация..."
              />
            </div>
            <Button onClick={createLead} className="w-full neon-glow">
              <Icon name="Plus" size={16} className="mr-2" />
              Создать лид
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isStageDialogOpen} onOpenChange={setIsStageDialogOpen}>
        <DialogContent className="glass-dark">
          <DialogHeader>
            <DialogTitle className="neon-text">
              {stageForm.id ? 'Редактировать этап' : 'Новый этап'}
            </DialogTitle>
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
                <Icon name="Save" size={16} className="mr-2" />
                Сохранить
              </Button>
              {stageForm.id > 0 && (
                <Button 
                  onClick={() => {
                    deleteStage(stageForm.id);
                    setIsStageDialogOpen(false);
                  }} 
                  variant="destructive"
                >
                  <Icon name="Trash2" size={16} className="mr-2" />
                  Удалить
                </Button>
              )}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border/30">
            <h4 className="text-sm font-bold mb-3">Текущие этапы</h4>
            <div className="space-y-2">
              {stages.map(stage => (
                <Card 
                  key={stage.id} 
                  className="glass p-3 cursor-pointer hover:neon-glow transition-all"
                  onClick={() => setStageForm(stage)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: stage.color }}
                      />
                      <span className="font-bold">{stage.name}</span>
                    </div>
                    <Badge>{getLeadsByStage(stage.id).length}</Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDailyPlanOpen} onOpenChange={setIsDailyPlanOpen}>
        <DialogContent className="max-w-3xl glass-dark">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl neon-text">
              <Icon name="CalendarCheck" size={24} className="text-primary" />
              План работы на день
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-4 max-h-[60vh] overflow-y-auto">
            {dailyTasks.map((task, idx) => (
              <Card key={idx} className="glass p-4 hover:neon-glow transition-all">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="font-bold text-primary">{idx + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold">{task.lead_name}</h4>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                    <p className="text-sm font-bold text-primary mb-1">{task.action}</p>
                    <p className="text-sm text-muted-foreground mb-2">{task.reason}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Icon name="Clock" size={12} />
                      {task.estimated_time}
                    </div>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => {
                      const lead = leads.find(l => l.id === task.lead_id);
                      if (lead) {
                        setSelectedLead(lead);
                        fetchLeadDetails(lead.id);
                        setIsDailyPlanOpen(false);
                      }
                    }}
                  >
                    Открыть
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CRM;
