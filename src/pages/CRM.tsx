import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

interface Lead {
  id: number;
  name: string;
  phone: string;
  company: string | null;
  vacancy: string | null;
  source: string;
  created_at: string;
  status: string;
}

const CRM = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [leads, searchQuery, statusFilter, sourceFilter]);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/a93ddbce-6315-4a84-8e82-7f3434116541');
      const data = await response.json();
      setLeads(data.leads || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...leads];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(lead => 
        lead.name.toLowerCase().includes(query) ||
        lead.phone.toLowerCase().includes(query) ||
        (lead.company?.toLowerCase().includes(query)) ||
        (lead.vacancy?.toLowerCase().includes(query))
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter(lead => lead.status === statusFilter);
    }

    if (sourceFilter !== 'all') {
      result = result.filter(lead => lead.source === sourceFilter);
    }

    setFilteredLeads(result);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setSourceFilter('all');
  };

  const getStats = () => {
    const stats = {
      total: leads.length,
      new: leads.filter(l => l.status === 'new').length,
      main_form: leads.filter(l => l.source === 'main_form').length,
      calculator: leads.filter(l => l.source === 'calculator').length,
      consultation: leads.filter(l => l.source === 'consultation').length
    };
    return stats;
  };

  const getSourceBadge = (source: string) => {
    const sources: Record<string, { label: string; color: string }> = {
      'main_form': { label: 'Главная форма', color: 'bg-primary/20 text-primary' },
      'calculator': { label: 'Калькулятор', color: 'bg-secondary/20 text-secondary' },
      'consultation': { label: 'Консультация', color: 'bg-accent/20 text-accent' }
    };
    const config = sources[source] || { label: source, color: 'bg-muted' };
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const statuses: Record<string, { label: string; color: string }> = {
      'new': { label: 'Новая', color: 'bg-green-500/20 text-green-400' },
      'in_progress': { label: 'В работе', color: 'bg-blue-500/20 text-blue-400' },
      'completed': { label: 'Завершена', color: 'bg-purple-500/20 text-purple-400' },
      'cancelled': { label: 'Отменена', color: 'bg-red-500/20 text-red-400' }
    };
    const config = statuses[status] || { label: status, color: 'bg-muted' };
    return <Badge className={config.color}>{config.label}</Badge>;
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

            <Button onClick={fetchLeads} variant="outline" size="sm">
              <Icon name="RefreshCw" size={16} className="mr-2" />
              Обновить
            </Button>
          </div>
        </div>
      </header>

      <section className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold neon-text mb-2">Заявки</h1>
                <p className="text-muted-foreground">Всего заявок: {total}</p>
              </div>
              <div className="flex gap-2">
                <Badge className="text-lg px-4 py-2 neon-glow">{filteredLeads.length} показано</Badge>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-3 mb-6">
              <Card className="glass-dark p-4 hover:neon-glow transition-all cursor-pointer" onClick={() => { setStatusFilter('all'); setSourceFilter('all'); }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Всего</p>
                    <p className="text-2xl font-bold neon-text">{getStats().total}</p>
                  </div>
                  <Icon name="Layers" size={32} className="text-primary" />
                </div>
              </Card>

              <Card className="glass-dark p-4 hover:neon-glow transition-all cursor-pointer" onClick={() => setStatusFilter('new')}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Новые</p>
                    <p className="text-2xl font-bold text-green-400">{getStats().new}</p>
                  </div>
                  <Icon name="Sparkles" size={32} className="text-green-400" />
                </div>
              </Card>

              <Card className="glass-dark p-4 hover:neon-glow transition-all cursor-pointer" onClick={() => setSourceFilter('calculator')}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Калькулятор</p>
                    <p className="text-2xl font-bold text-secondary">{getStats().calculator}</p>
                  </div>
                  <Icon name="Calculator" size={32} className="text-secondary" />
                </div>
              </Card>

              <Card className="glass-dark p-4 hover:neon-glow transition-all cursor-pointer" onClick={() => setSourceFilter('consultation')}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Консультации</p>
                    <p className="text-2xl font-bold text-accent">{getStats().consultation}</p>
                  </div>
                  <Icon name="Calendar" size={32} className="text-accent" />
                </div>
              </Card>
            </div>

            <Card className="glass-dark p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1">
                  <div className="relative">
                    <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input 
                      placeholder="Поиск по имени, телефону, компании..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 glass border-primary/30 h-12"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="glass border border-primary/30 rounded-md px-4 py-2 h-12 bg-background text-foreground cursor-pointer"
                  >
                    <option value="all">Все статусы</option>
                    <option value="new">Новые</option>
                    <option value="in_progress">В работе</option>
                    <option value="completed">Завершены</option>
                  </select>

                  <select 
                    value={sourceFilter}
                    onChange={(e) => setSourceFilter(e.target.value)}
                    className="glass border border-primary/30 rounded-md px-4 py-2 h-12 bg-background text-foreground cursor-pointer"
                  >
                    <option value="all">Все источники</option>
                    <option value="main_form">Главная форма</option>
                    <option value="calculator">Калькулятор</option>
                    <option value="consultation">Консультация</option>
                  </select>

                  {(searchQuery || statusFilter !== 'all' || sourceFilter !== 'all') && (
                    <Button 
                      onClick={clearFilters} 
                      variant="outline" 
                      size="sm"
                      className="hover:neon-glow h-12"
                    >
                      <Icon name="X" size={16} className="mr-1" />
                      Сбросить
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Icon name="Loader2" size={48} className="animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredLeads.map((lead) => (
                <Card key={lead.id} className="glass-dark p-6 hover:neon-glow transition-all animate-fade-in">
                  <div className="grid md:grid-cols-5 gap-4">
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon name="User" size={20} className="text-primary" />
                        <h3 className="font-bold text-lg">{lead.name}</h3>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Icon name="Phone" size={16} />
                        <a href={`tel:${lead.phone}`} className="hover:text-primary transition-colors">
                          {lead.phone}
                        </a>
                      </div>
                    </div>

                    <div>
                      {lead.company && (
                        <div className="mb-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                            <Icon name="Building2" size={14} />
                            <span>Компания</span>
                          </div>
                          <p className="font-medium">{lead.company}</p>
                        </div>
                      )}
                      {lead.vacancy && (
                        <div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                            <Icon name="Briefcase" size={14} />
                            <span>Вакансия</span>
                          </div>
                          <p className="font-medium text-sm">{lead.vacancy}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      {getSourceBadge(lead.source)}
                      {getStatusBadge(lead.status)}
                    </div>

                    <div className="flex flex-col justify-between items-end">
                      <div className="text-sm text-muted-foreground text-right">
                        <Icon name="Clock" size={14} className="inline mr-1" />
                        {formatDate(lead.created_at)}
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline" className="hover:neon-glow">
                          <Icon name="Phone" size={14} className="mr-1" />
                          Позвонить
                        </Button>
                        <Button size="sm" className="bg-primary hover:opacity-90">
                          <Icon name="Check" size={14} className="mr-1" />
                          Обработать
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {filteredLeads.length === 0 && !isLoading && leads.length > 0 && (
                <Card className="glass-dark p-12 text-center">
                  <Icon name="SearchX" size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <p className="text-xl text-muted-foreground mb-2">Ничего не найдено</p>
                  <Button onClick={clearFilters} variant="outline" className="mt-4">
                    Сбросить фильтры
                  </Button>
                </Card>
              )}

              {leads.length === 0 && !isLoading && (
                <Card className="glass-dark p-12 text-center">
                  <Icon name="Inbox" size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <p className="text-xl text-muted-foreground">Заявок пока нет</p>
                </Card>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CRM;