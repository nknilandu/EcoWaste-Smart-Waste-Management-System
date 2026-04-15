import { X, CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';

export interface TaskAlertData {
  id: string;
  type: 'success' | 'warning' | 'danger';
  message: string;
}

interface Props {
  alerts: TaskAlertData[];
  onDismiss: (id: string) => void;
}

const styles: Record<string, string> = {
  success: 'bg-primary/5 border-primary/20 text-primary',
  warning: 'bg-[hsl(var(--warning))]/5 border-[hsl(var(--warning))]/20 text-[hsl(var(--warning))]',
  danger: 'bg-destructive/5 border-destructive/20 text-destructive',
};

const icons: Record<string, React.ReactNode> = {
  success: <CheckCircle2 className="h-4 w-4 flex-shrink-0" />,
  warning: <AlertCircle className="h-4 w-4 flex-shrink-0" />,
  danger: <AlertTriangle className="h-4 w-4 flex-shrink-0" />,
};

export default function TaskAlert({ alerts, onDismiss }: Props) {
  if (!alerts.length) return null;
  return (
    <div className="space-y-2 mb-6">
      {alerts.map(a => (
        <div key={a.id} className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-sm font-medium animate-fade-in ${styles[a.type]}`}>
          <div className="flex items-center gap-2">
            {icons[a.type]}
            <span>{a.message}</span>
          </div>
          <button onClick={() => onDismiss(a.id)} className="p-1 rounded-lg hover:bg-foreground/5 transition-colors">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
