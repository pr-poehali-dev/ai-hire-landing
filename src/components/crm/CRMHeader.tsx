import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

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

interface Lead {
  id: number;
  name: string;
  [key: string]: any;
}

interface CRMHeaderProps {
  notifications: Notification[];
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  leads: Lead[];
  setSelectedLead: (lead: Lead | null) => void;
  fetchLeadDetails: (leadId: number) => void;
  generateDailyPlan: () => void;
  isGeneratingPlan: boolean;
  exportToExcel: () => void;
  isExporting: boolean;
}

const CRMHeader = ({
  notifications,
  showNotifications,
  setShowNotifications,
  leads,
  setSelectedLead,
  fetchLeadDetails,
  generateDailyPlan,
  isGeneratingPlan,
  exportToExcel,
  isExporting
}: CRMHeaderProps) => {
  const navigate = useNavigate();

  return (
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

            <Button size="sm" onClick={() => navigate('/crm/webhooks')} className="glass">
              <Icon name="Webhook" size={16} className="mr-2" />
              Вебхуки
            </Button>

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
  );
};

export default CRMHeader;
