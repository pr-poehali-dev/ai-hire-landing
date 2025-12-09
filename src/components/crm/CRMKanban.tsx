import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface Lead {
  id: number;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  vacancy?: string;
  source: string;
  stage_id: number;
  priority: string;
  notes?: string;
  created_at: string;
}

interface Stage {
  id: number;
  name: string;
  color: string;
  position: number;
}

interface CRMKanbanProps {
  stages: Stage[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterPriority: string;
  setFilterPriority: (priority: string) => void;
  filterSource: string;
  setFilterSource: (source: string) => void;
  sources: string[];
  setIsLeadDialogOpen: (open: boolean) => void;
  setStageForm: (form: any) => void;
  setIsStageDialogOpen: (open: boolean) => void;
  handleDragEnd: (result: any) => void;
  getLeadsByStage: (stageId: number) => Lead[];
  getPriorityColor: (priority: string) => string;
  setSelectedLead: (lead: Lead) => void;
  fetchLeadDetails: (leadId: number) => void;
}

const CRMKanban = ({
  stages,
  isLoading,
  searchQuery,
  setSearchQuery,
  filterPriority,
  setFilterPriority,
  filterSource,
  setFilterSource,
  sources,
  setIsLeadDialogOpen,
  setStageForm,
  setIsStageDialogOpen,
  handleDragEnd,
  getLeadsByStage,
  getPriorityColor,
  setSelectedLead,
  fetchLeadDetails
}: CRMKanbanProps) => {
  return (
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
  );
};

export default CRMKanban;
