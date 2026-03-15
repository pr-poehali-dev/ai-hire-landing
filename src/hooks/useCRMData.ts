import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

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

export type { Lead, Stage, Task, Comment, Call };

export const useCRMData = () => {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterSource, setFilterSource] = useState<string>('all');
  const [showAnalytics, setShowAnalytics] = useState(false);

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
        return data.lead as Lead;
      }
    } catch (error) {
      console.error('Error fetching lead details:', error);
    }
    return null;
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
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority = filterPriority === 'all' || lead.priority === filterPriority;
    const matchesSource = filterSource === 'all' || lead.source === filterSource;

    return matchesSearch && matchesPriority && matchesSource;
  });

  const getLeadsByStage = (stageId: number) =>
    filteredLeads.filter(lead => lead.stage_id === stageId);

  const sources = Array.from(new Set(leads.map(l => l.source)));

  return {
    leads,
    setLeads,
    stages,
    setStages,
    selectedLead,
    setSelectedLead,
    isLoading,
    isExporting,
    searchQuery,
    setSearchQuery,
    filterPriority,
    setFilterPriority,
    filterSource,
    setFilterSource,
    showAnalytics,
    setShowAnalytics,
    fetchLeads,
    fetchLeadDetails,
    exportToExcel,
    filteredLeads,
    getLeadsByStage,
    sources,
  };
};
