import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import AIAssistant from '@/components/AIAssistant';
import { Separator } from '@/components/ui/separator';

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

interface TimelineEvent {
  id: string;
  type: 'task' | 'comment' | 'call' | 'info';
  timestamp: string;
  data: any;
}

interface DailyTask {
  lead_id: number;
  lead_name: string;
  action: string;
  priority: string;
  reason: string;
  estimated_time: string;
}

interface Notification {
  id: string;
  type: string;
  urgency: string;
  title: string;
  lead_id?: number;
  lead_name?: string;
  priority?: string;
  message?: string;
  due_date?: string;
  created_at: string;
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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isMangoSettingsOpen, setIsMangoSettingsOpen] = useState(false);
  const [isTestingMango, setIsTestingMango] = useState(false);
  
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
    fetchNotifications();
    
    const notifInterval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(notifInterval);
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

      toast({ title: 'Лид перемещен' });
      fetchLeads();
    } catch (error) {
      toast({ title: 'Ошибка перемещения', variant: 'destructive' });
    }
  };

  const createTask = async () => {
    if (!selectedLead || !taskForm.title) {
      toast({ title: 'Заполните название задачи', variant: 'destructive' });
      return;
    }

    try {
      await fetch('https://functions.poehali.dev/0aa01a4e-3c3d-4dff-8c77-0fa33c30c2c0', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead_id: selectedLead.id, ...taskForm })
      });

      toast({ title: 'Задача создана' });
      setTaskForm({ title: '', description: '', due_date: '', priority: 'medium' });
      fetchLeadDetails(selectedLead.id);
    } catch (error) {
      toast({ title: 'Ошибка создания задачи', variant: 'destructive' });
    }
  };

  const toggleTask = async (taskId: number, completed: boolean) => {
    try {
      await fetch('https://functions.poehali.dev/0aa01a4e-3c3d-4dff-8c77-0fa33c30c2c0', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId, completed })
      });

      toast({ title: completed ? 'Задача выполнена' : 'Задача открыта' });
      if (selectedLead) {
        fetchLeadDetails(selectedLead.id);
      }
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
        const errorMsg = data.error || 'Неизвестная ошибка';
        
        console.log('Mango Office error:', data);
        
        if (errorMsg.includes('credentials') || errorMsg.includes('не настроен') || errorMsg.includes('ключи') || errorMsg.includes('Unauthorized')) {
          setIsMangoSettingsOpen(true);
          
          let detailMsg = 'Проверьте правильность ключей API';
          if (data.debug_info) {
            detailMsg = `VPB ключ: ${data.debug_info.vpb_key_length} символов, Sign ключ: ${data.debug_info.sign_key_length} символов. Проверьте, что ключи скопированы полностью без пробелов.`;
          }
          
          toast({ 
            title: 'Неверные ключи Mango Office', 
            description: detailMsg,
            variant: 'destructive',
            duration: 8000
          });
        } else {
          toast({ 
            title: 'Ошибка звонка', 
            description: errorMsg,
            variant: 'destructive' 
          });
        }
      }
    } catch (error) {
      toast({ 
        title: 'Ошибка соединения', 
        description: 'Не удалось связаться с сервером звонков',
        variant: 'destructive' 
      });
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/08fef88e-bbab-4bb2-8cdd-44b75c800c91');
      const data = await response.json();
      if (data.success) {
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const generateDailyPlan = async () => {
    setIsGeneratingPlan(true);
    try {
      const response = await fetch('https://functions.poehali.dev/9a25ae9c-7d92-4d92-8c25-89148f59fb7d', {
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

  const exportToExcel = async () => {
    setIsExporting(true);
    try {
      const params = new URLSearchParams({ format: 'excel' });
      
      if (filterPriority !== 'all') params.append('priority', filterPriority);
      if (filterSource !== 'all') params.append('source', filterSource);
      
      const response = await fetch(`https://functions.poehali.dev/f9015ccd-0c31-47ee-be4f-f5c16ba760f6?${params}`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `leads_export_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast({ title: 'Экспорт завершен!' });
      }
    } catch (error) {
      toast({ title: 'Ошибка экспорта', variant: 'destructive' });
    } finally {
      setIsExporting(false);
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

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const buildTimeline = (lead: Lead): TimelineEvent[] => {
    const events: TimelineEvent[] = [];

    events.push({
      id: `info-${lead.id}`,
      type: 'info',
      timestamp: lead.created_at,
      data: { action: 'created', lead }
    });

    lead.tasks?.forEach(task => {
      events.push({
        id: `task-${task.id}`,
        type: 'task',
        timestamp: task.created_at || lead.created_at,
        data: task
      });
    });

    lead.comments?.forEach(comment => {
      events.push({
        id: `comment-${comment.id}`,
        type: 'comment',
        timestamp: comment.created_at,
        data: comment
      });
    });

    lead.calls?.forEach(call => {
      events.push({
        id: `call-${call.id}`,
        type: 'call',
        timestamp: call.started_at,
        data: call
      });
    });

    return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
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
              <span className="text-xl font-bold neon-text">CRM Система</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative"
                >
                  <Icon name="Bell" size={16} />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </Button>

                {showNotifications && notifications.length > 0 && (
                  <Card className="absolute right-0 top-12 w-80 max-h-96 overflow-y-auto glass-dark p-4 space-y-2 z-50">
                    {notifications.map(notif => (
                      <div key={notif.id} className="p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted" onClick={() => {
                        if (notif.lead_id) {
                          const lead = leads.find(l => l.id === notif.lead_id);
                          if (lead) {
                            setSelectedLead(lead);
                            fetchLeadDetails(notif.lead_id);
                            setShowNotifications(false);
                          }
                        }
                      }}>
                        <div className="flex items-start gap-2">
                          <Badge className={notif.urgency === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}>
                            {notif.type}
                          </Badge>
                          <div className="flex-1 text-sm">
                            <p className="font-semibold">{notif.title}</p>
                            {notif.message && <p className="text-muted-foreground text-xs mt-1">{notif.message}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </Card>
                )}
              </div>

              <Button size="sm" onClick={generateDailyPlan} disabled={isGeneratingPlan} className="glass">
                <Icon name="Calendar" size={16} className="mr-2" />
                {isGeneratingPlan ? 'Генерация...' : 'План дня'}
              </Button>

              <Button size="sm" onClick={exportToExcel} disabled={isExporting} className="glass">
                <Icon name="Download" size={16} className="mr-2" />
                {isExporting ? 'Экспорт...' : 'Экспорт'}
              </Button>

              <Button size="sm" onClick={() => navigate('/login')} variant="ghost">
                <Icon name="LogOut" size={16} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <section className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4 flex-1 max-w-3xl">
              <div className="relative flex-1">
                <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Поиск по имени, телефону, компании..." 
                  className="pl-10 glass"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-40 glass">
                  <SelectValue placeholder="Приоритет" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все</SelectItem>
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
                  {sources.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => setIsLeadDialogOpen(true)} className="neon-glow">
                <Icon name="Plus" size={18} className="mr-2" />
                Новый лид
              </Button>
              <Button variant="outline" onClick={() => {
                setStageForm({ id: 0, name: '', color: '#3b82f6', position: stages.length });
                setIsStageDialogOpen(true);
              }}>
                <Icon name="Settings" size={18} className="mr-2" />
                Настроить этапы
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stages.map((stage) => (
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
                                  <p className="text-xs font-semibold text-primary mb-1">{event.data.author_name}</p>
                                )}
                                <p className="text-sm">{event.data.text}</p>
                              </div>
                            </div>
                          </Card>
                        )}

                        {event.type === 'call' && (
                          <Card className="glass p-3">
                            <div className="flex items-start gap-2">
                              <Icon 
                                name={event.data.direction === 'inbound' ? "PhoneIncoming" : "PhoneOutgoing"} 
                                size={16} 
                                className={event.data.status === 'completed' ? "text-green-400" : "text-red-400"}
                                style={{ marginTop: '2px' }}
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium">
                                    {event.data.direction === 'inbound' ? 'Входящий' : 'Исходящий'} звонок
                                  </span>
                                  <Badge className={event.data.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                                    {event.data.status}
                                  </Badge>
                                </div>
                                <div className="text-xs text-muted-foreground space-y-1">
                                  <p>Номер: {event.data.phone_number}</p>
                                  {event.data.duration > 0 && (
                                    <p>Длительность: {formatDuration(event.data.duration)}</p>
                                  )}
                                  {event.data.recording_url && (
                                    <a href={event.data.recording_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                                      <Icon name="Play" size={12} />
                                      Прослушать запись
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Card>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="glass p-4">
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Добавить задачу..."
                        value={taskForm.title}
                        onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                        className="glass flex-1"
                        onKeyPress={(e) => e.key === 'Enter' && createTask()}
                      />
                      <Select value={taskForm.priority} onValueChange={(v) => setTaskForm({ ...taskForm, priority: v })}>
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

                    <Separator />

                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Добавить комментарий..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="glass min-h-[60px]"
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
                    <p className="font-semibold text-foreground mb-1">Перекопируйте ключи заново</p>
                    <p>Выделите ключ полностью (двойной клик), скопируйте без пробелов в начале/конце. Вставьте в секреты проекта poehali.dev</p>
                  </div>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-primary">3.</span>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Проверьте названия секретов</p>
                    <p>Названия должны быть точно: <code className="bg-muted px-1 rounded">MANGO_VPB_KEY</code> и <code className="bg-muted px-1 rounded">MANGO_SIGN_KEY</code></p>
                  </div>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-primary">4.</span>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Пересоздайте функцию</p>
                    <p>После изменения секретов нажмите "Синхронизировать" в редакторе backend функции mango-call</p>
                  </div>
                </li>
              </ol>
            </Card>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
              <p className="text-sm text-muted-foreground mb-2">
                <Icon name="Info" size={14} className="inline mr-1" />
                После исправления секретов обязательно пересоздайте функцию, чтобы изменения вступили в силу.
              </p>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 neon-glow" onClick={() => {
                window.open('https://app.mango-office.ru', '_blank');
              }}>
                <Icon name="ExternalLink" size={16} className="mr-2" />
                Открыть Mango Office
              </Button>
              <Button variant="outline" onClick={() => setIsMangoSettingsOpen(false)}>
                Закрыть
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDailyPlanOpen} onOpenChange={setIsDailyPlanOpen}>
        <DialogContent className="glass-dark max-w-3xl">
          <DialogHeader>
            <DialogTitle className="neon-text flex items-center gap-2">
              <Icon name="Calendar" size={24} />
              План на день
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-4 max-h-[60vh] overflow-y-auto">
            {dailyTasks.map((task, index) => (
              <Card key={index} className="glass p-4 hover:neon-glow transition-all cursor-pointer" onClick={() => {
                const lead = leads.find(l => l.id === task.lead_id);
                if (lead) {
                  setSelectedLead(lead);
                  fetchLeadDetails(task.lead_id);
                  setIsDailyPlanOpen(false);
                }
              }}>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold">{task.lead_name}</h4>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                    <p className="text-sm mb-1"><strong>Действие:</strong> {task.action}</p>
                    <p className="text-sm text-muted-foreground mb-1">{task.reason}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Icon name="Clock" size={12} />
                      <span>{task.estimated_time}</span>
                    </div>
                  </div>
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