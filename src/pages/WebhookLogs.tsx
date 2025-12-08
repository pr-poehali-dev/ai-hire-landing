import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface WebhookLog {
  id: number;
  source: string;
  event_type: string;
  payload: any;
  status: string;
  error_message?: string;
  created_at: string;
  processed_at?: string;
}

const WebhookLogs = () => {
  const { toast } = useToast();
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<WebhookLog | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_webhook_logs' })
      });

      const data = await response.json();
      if (data.success) {
        setLogs(data.logs || []);
      }
    } catch (error) {
      toast({ 
        title: 'Ошибка', 
        description: 'Не удалось загрузить логи',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed': return 'text-green-500';
      case 'error': return 'text-red-500';
      case 'received': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processed': return 'CheckCircle';
      case 'error': return 'XCircle';
      case 'received': return 'Clock';
      default: return 'HelpCircle';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold neon-text mb-2">Логи Вебхуков</h1>
            <p className="text-muted-foreground">История входящих событий от Mango Office</p>
          </div>
          
          <Button 
            onClick={fetchLogs}
            className="neon-glow bg-gradient-to-r from-primary to-secondary"
          >
            <Icon name="RefreshCw" size={16} className="mr-2" />
            Обновить
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {loading ? (
              <div className="glass rounded-lg p-8 text-center">
                <Icon name="Loader2" size={32} className="animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Загрузка логов...</p>
              </div>
            ) : logs.length === 0 ? (
              <div className="glass rounded-lg p-8 text-center">
                <Icon name="Inbox" size={48} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Пока нет событий от Mango Office</p>
              </div>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className={`glass rounded-lg p-4 cursor-pointer transition-all hover:border-primary/50 ${
                    selectedLog?.id === log.id ? 'border-primary neon-glow' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <Icon 
                        name={getStatusIcon(log.status)} 
                        size={20} 
                        className={getStatusColor(log.status)}
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{log.source.toUpperCase()}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">{log.event_type}</span>
                        </div>
                        
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>Получено: {new Date(log.created_at).toLocaleString('ru-RU')}</div>
                          {log.processed_at && (
                            <div>Обработано: {new Date(log.processed_at).toLocaleString('ru-RU')}</div>
                          )}
                        </div>

                        {log.error_message && (
                          <div className="mt-2 text-xs text-red-500 flex items-start gap-1">
                            <Icon name="AlertCircle" size={12} className="mt-0.5" />
                            <span>{log.error_message}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="lg:col-span-1">
            {selectedLog ? (
              <div className="glass rounded-lg p-6 sticky top-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Детали события</h3>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setSelectedLog(null)}
                  >
                    <Icon name="X" size={16} />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground">ID</label>
                    <div className="text-sm font-mono">{selectedLog.id}</div>
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground">Источник</label>
                    <div className="text-sm">{selectedLog.source}</div>
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground">Тип события</label>
                    <div className="text-sm">{selectedLog.event_type}</div>
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground">Статус</label>
                    <div className={`text-sm font-semibold ${getStatusColor(selectedLog.status)}`}>
                      {selectedLog.status}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground">Payload</label>
                    <pre className="text-xs bg-black/20 p-3 rounded mt-1 overflow-auto max-h-[300px]">
                      {JSON.stringify(selectedLog.payload, null, 2)}
                    </pre>
                  </div>

                  {selectedLog.error_message && (
                    <div>
                      <label className="text-xs text-muted-foreground">Ошибка</label>
                      <div className="text-xs text-red-500 mt-1">{selectedLog.error_message}</div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="glass rounded-lg p-8 text-center sticky top-6">
                <Icon name="MousePointerClick" size={32} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Выберите событие, чтобы посмотреть детали
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebhookLogs;
