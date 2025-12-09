import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import CRMHeader from '@/components/crm/CRMHeader';
import CRMKanban from '@/components/crm/CRMKanban';
import LeadDetailsDialog from '@/components/crm/LeadDetailsDialog';
import CRMModals from '@/components/crm/CRMModals';

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

      <CRMHeader 
        notifications={notifications}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        leads={leads}
        setSelectedLead={setSelectedLead}
        fetchLeadDetails={fetchLeadDetails}
        generateDailyPlan={generateDailyPlan}
        isGeneratingPlan={isGeneratingPlan}
        exportToExcel={exportToExcel}
        isExporting={isExporting}
      />

      <CRMKanban 
        stages={stages}
        isLoading={isLoading}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterPriority={filterPriority}
        setFilterPriority={setFilterPriority}
        filterSource={filterSource}
        setFilterSource={setFilterSource}
        sources={sources}
        setIsLeadDialogOpen={setIsLeadDialogOpen}
        setStageForm={setStageForm}
        setIsStageDialogOpen={setIsStageDialogOpen}
        handleDragEnd={handleDragEnd}
        getLeadsByStage={getLeadsByStage}
        getPriorityColor={getPriorityColor}
        setSelectedLead={setSelectedLead}
        fetchLeadDetails={fetchLeadDetails}
      />

      <LeadDetailsDialog 
        selectedLead={selectedLead}
        setSelectedLead={setSelectedLead}
        editingLead={editingLead}
        setEditingLead={setEditingLead}
        updateLead={updateLead}
        initiateCall={initiateCall}
        taskForm={taskForm}
        setTaskForm={setTaskForm}
        createTask={createTask}
        toggleTask={toggleTask}
        commentText={commentText}
        setCommentText={setCommentText}
        addComment={addComment}
        getPriorityColor={getPriorityColor}
        formatDate={formatDate}
        formatDuration={formatDuration}
        buildTimeline={buildTimeline}
      />

      <CRMModals 
        isLeadDialogOpen={isLeadDialogOpen}
        setIsLeadDialogOpen={setIsLeadDialogOpen}
        leadForm={leadForm}
        setLeadForm={setLeadForm}
        createLead={createLead}
        isStageDialogOpen={isStageDialogOpen}
        setIsStageDialogOpen={setIsStageDialogOpen}
        stageForm={stageForm}
        setStageForm={setStageForm}
        saveStage={saveStage}
        deleteStage={deleteStage}
        isDailyPlanOpen={isDailyPlanOpen}
        setIsDailyPlanOpen={setIsDailyPlanOpen}
        dailyTasks={dailyTasks}
        isMangoSettingsOpen={isMangoSettingsOpen}
        setIsMangoSettingsOpen={setIsMangoSettingsOpen}
        isTestingMango={isTestingMango}
      />
    </div>
  );
};

export default CRM;
