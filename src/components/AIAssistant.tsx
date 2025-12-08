import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface AIAssistantProps {
  leadId: number;
}

const AIAssistant = ({ leadId }: AIAssistantProps) => {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [suggestion, setSuggestion] = useState<any>(null);

  const analyzeL = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('https://functions.poehali.dev/b5093c80-da38-4c7f-8452-5125c945efe3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'analyze', lead_id: leadId })
      });

      const data = await response.json();
      
      if (data.success) {
        setAnalysis(data.analysis);
        toast({ title: 'AI-анализ завершен' });
      } else {
        toast({ 
          title: 'Ошибка AI-анализа', 
          description: data.error || 'Убедитесь, что добавлен OPENAI_API_KEY',
          variant: 'destructive' 
        });
      }
    } catch (error) {
      toast({ title: 'Ошибка подключения к AI', variant: 'destructive' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSuggestion = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('https://functions.poehali.dev/b5093c80-da38-4c7f-8452-5125c945efe3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'suggest', lead_id: leadId })
      });

      const data = await response.json();
      
      if (data.success) {
        setSuggestion(data.suggestion);
        toast({ title: 'Рекомендация готова' });
      }
    } catch (error) {
      toast({ title: 'Ошибка получения рекомендации', variant: 'destructive' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getTemperatureColor = (temp: string) => {
    if (temp === 'горячий') return 'bg-red-500/20 text-red-400';
    if (temp === 'теплый') return 'bg-yellow-500/20 text-yellow-400';
    return 'bg-blue-500/20 text-blue-400';
  };

  const getRiskColor = (risk: string) => {
    if (risk === 'высокий') return 'bg-red-500/20 text-red-400';
    if (risk === 'средний') return 'bg-yellow-500/20 text-yellow-400';
    return 'bg-green-500/20 text-green-400';
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button 
          onClick={analyzeL} 
          disabled={isAnalyzing}
          className="neon-glow flex-1"
        >
          {isAnalyzing ? (
            <>
              <Icon name="Loader2" className="animate-spin mr-2" size={16} />
              Анализирую...
            </>
          ) : (
            <>
              <Icon name="Sparkles" size={16} className="mr-2" />
              AI-анализ лида
            </>
          )}
        </Button>
        <Button 
          onClick={getSuggestion} 
          disabled={isAnalyzing}
          variant="outline"
        >
          <Icon name="Lightbulb" size={16} className="mr-2" />
          Что делать дальше?
        </Button>
      </div>

      {analysis && (
        <Card className="glass-dark p-6 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Icon name="Brain" size={20} className="text-primary" />
              AI-анализ лида
            </h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setAnalysis(null)}
            >
              <Icon name="X" size={16} />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Температура лида</p>
              <Badge className={getTemperatureColor(analysis.lead_temperature)}>
                {analysis.lead_temperature}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Вероятность конверсии</p>
              <Badge className="bg-primary/20 text-primary">
                {analysis.conversion_probability}%
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Уровень риска</p>
              <Badge className={getRiskColor(analysis.risk_level)}>
                {analysis.risk_level}
              </Badge>
            </div>
          </div>

          {analysis.key_insights && (
            <div className="glass p-4 rounded-lg">
              <p className="text-sm font-bold mb-2 flex items-center gap-2">
                <Icon name="Lightbulb" size={16} className="text-accent" />
                Ключевые инсайты
              </p>
              <p className="text-sm text-muted-foreground">{analysis.key_insights}</p>
            </div>
          )}

          {analysis.recommendations && analysis.recommendations.length > 0 && (
            <div>
              <p className="text-sm font-bold mb-2 flex items-center gap-2">
                <Icon name="ListChecks" size={16} className="text-primary" />
                Рекомендации
              </p>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <Icon name="CheckCircle2" size={14} className="text-primary mt-0.5 flex-shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      )}

      {suggestion && (
        <Card className="glass-dark p-6 space-y-4 animate-fade-in border-accent/30">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Icon name="Zap" size={20} className="text-accent" />
              Следующий шаг
            </h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSuggestion(null)}
            >
              <Icon name="X" size={16} />
            </Button>
          </div>

          <div className="glass p-4 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-lg">{suggestion.action}</h4>
              <Badge className="bg-primary/20 text-primary">{suggestion.priority}</Badge>
            </div>
            
            <p className="text-sm text-muted-foreground">{suggestion.description}</p>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border/50">
              <div className="flex items-center gap-1">
                <Icon name="Clock" size={12} />
                {suggestion.estimated_time}
              </div>
              <div className="flex items-center gap-1">
                <Icon name="Target" size={12} />
                {suggestion.expected_result}
              </div>
            </div>
          </div>
        </Card>
      )}

      {!analysis && !suggestion && !isAnalyzing && (
        <Card className="glass-dark p-6 text-center">
          <Icon name="Sparkles" size={48} className="mx-auto mb-4 text-primary animate-pulse" />
          <p className="text-muted-foreground">
            Используйте AI для анализа лида и получения рекомендаций
          </p>
        </Card>
      )}
    </div>
  );
};

export default AIAssistant;
