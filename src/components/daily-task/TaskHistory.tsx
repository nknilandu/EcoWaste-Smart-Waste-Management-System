import { MapPin, Clock } from 'lucide-react';

interface TaskRecord {
  id: string;
  bin_location: string;
  completed_at: string;
  bin_area: string;
  bin_subarea: string;
  sensor_id: string;
}


interface Props {
  tasks: TaskRecord[];
}

export default function TaskHistory({ tasks }: Props) {
  return (
    <div className="bg-card border rounded-2xl p-5">
      <h3 className="text-sm font-semibold mb-4">Task History</h3>
      {tasks.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No tasks completed yet.</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {tasks.map(t => {
            const d = new Date(t.completed_at);
            return (
              <div key={t.id} className="flex items-center justify-between px-4 py-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  <span className="text-sm font-medium">{t.sensor_id} <span className='text-xs opacity-60 ml-1'>   {"-" + t.bin_subarea }</span> </span>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium">{d.toLocaleDateString()}</p>
                  <p className="text-[10px] text-muted-foreground">{d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
