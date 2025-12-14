import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Lead {
  id: number;
  source: string;
  stage_id: number;
  priority: string;
  created_at: string;
}

interface Stage {
  id: number;
  name: string;
  color: string;
}

interface AnalyticsProps {
  leads: Lead[];
  stages: Stage[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const CRMAnalytics = ({ leads, stages }: AnalyticsProps) => {
  const leadsLastWeek = leads.filter(l => {
    const date = new Date(l.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return date >= weekAgo;
  }).length;

  const conversionRate = leads.length > 0 
    ? ((leads.filter(l => stages.find(s => s.id === l.stage_id)?.name.toLowerCase().includes('успешно')).length / leads.length) * 100).toFixed(1)
    : '0';

  const avgLeadsPerDay = (leads.length / 30).toFixed(1);

  const sourceData = Object.entries(
    leads.reduce((acc, lead) => {
      acc[lead.source] = (acc[lead.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const stageData = stages.map(stage => ({
    name: stage.name,
    count: leads.filter(l => l.stage_id === stage.id).length,
    color: stage.color
  }));

  const priorityData = [
    { name: 'Высокий', value: leads.filter(l => l.priority === 'high').length },
    { name: 'Средний', value: leads.filter(l => l.priority === 'medium').length },
    { name: 'Низкий', value: leads.filter(l => l.priority === 'low').length }
  ].filter(d => d.value > 0);

  const dailyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
    const count = leads.filter(l => {
      const leadDate = new Date(l.created_at);
      return leadDate.toDateString() === date.toDateString();
    }).length;
    return { date: dateStr, leads: count };
  });

  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-dark p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Icon name="Users" size={24} className="text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Всего лидов</p>
              <p className="text-2xl font-bold">{leads.length}</p>
            </div>
          </div>
        </Card>

        <Card className="glass-dark p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
              <Icon name="TrendingUp" size={24} className="text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">За неделю</p>
              <p className="text-2xl font-bold">{leadsLastWeek}</p>
            </div>
          </div>
        </Card>

        <Card className="glass-dark p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Icon name="Target" size={24} className="text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Конверсия</p>
              <p className="text-2xl font-bold">{conversionRate}%</p>
            </div>
          </div>
        </Card>

        <Card className="glass-dark p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <Icon name="Calendar" size={24} className="text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Средн. в день</p>
              <p className="text-2xl font-bold">{avgLeadsPerDay}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-dark p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Icon name="TrendingUp" size={20} />
            Динамика лидов (7 дней)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #333' }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              <Line type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={2} name="Лидов" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="glass-dark p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Icon name="BarChart3" size={20} />
            Лиды по этапам
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #333' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="count" name="Лидов">
                {stageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="glass-dark p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Icon name="PieChart" size={20} />
            Источники лидов
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sourceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {sourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #333' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="glass-dark p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Icon name="AlertCircle" size={20} />
            Приоритет лидов
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                <Cell fill="#ef4444" />
                <Cell fill="#f59e0b" />
                <Cell fill="#10b981" />
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #333' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default CRMAnalytics;
