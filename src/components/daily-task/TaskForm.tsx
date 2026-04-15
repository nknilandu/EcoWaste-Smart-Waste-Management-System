import { useState } from 'react';
import { ClipboardCheck, Send } from 'lucide-react';

interface Bin {
  id: string;
  location: string;
  sensor_id?: string | null;
}

interface Props {
  bins: Bin[];
  disabled: boolean;
  onSubmit: (binId: string, otp: string) => Promise<void>;
}

export default function TaskForm({ bins, disabled, onSubmit }: Props) {
  const [binId, setBinId] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!binId || otp.length !== 6) return;
    setLoading(true);
    await onSubmit(binId, otp);
    setLoading(false);
    setBinId('');
    setOtp('');
  };

  return (
    <div className="bg-card border rounded-2xl p-5">
      <h3 className="text-sm font-semibold mb-1">Complete Daily Task</h3>
      <p className="text-xs text-muted-foreground mb-4">Dispose waste into a bin near you</p>

      {disabled ? (
        <div className="text-center py-8">
          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <ClipboardCheck className='text-primary' /> 
          </div>
          <p className="text-sm font-medium text-primary">Today's task is already completed!</p>
          <p className="text-xs text-muted-foreground mt-1">Come back tomorrow for your next task.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Select Bin</label>
            <select required value={binId} onChange={e => setBinId(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow">
              <option value="">Choose a bin...</option>
              {bins.map(b => (
                <option key={b.id} value={b.id}>{b.location}{b.sensor_id ? ` [${b.sensor_id}]` : ''}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Enter OTP Code</label>
            <input type="text" required inputMode="numeric" maxLength={6} pattern="\d{6}" placeholder="6-digit code"
              value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full px-4 py-2.5 border rounded-xl bg-background text-sm tracking-[0.3em] text-center font-mono focus:outline-none focus:ring-2 focus:ring-ring transition-shadow" />
          </div>
          <button type="submit" disabled={loading || !binId || otp.length !== 6}
            className="w-full py-2.5 rounded-xl gradient-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
            <Send className="h-4 w-4" />
            {loading ? 'Submitting...' : 'Complete Task'}
          </button>
        </form>
      )}
    </div>
  );
}
