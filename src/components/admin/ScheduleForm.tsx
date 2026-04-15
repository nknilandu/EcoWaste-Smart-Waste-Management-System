import { useState, useMemo } from 'react';
import { Check, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Bin {
  id: string;
  location: string;
  fill_level: number;
  sensor_id?: string | null;
  area?: string | null;
  subarea?: string | null;
}

interface Collector {
  user_id: string;
  full_name: string;
  area?: string | null;
}

interface ScheduleFormProps {
  bins: Bin[];
  collectors: Collector[];
  onSubmit: (form: { bin_id: string; collector_id: string; pickup_time: string }) => Promise<void>;
  onCancel: () => void;
}

export default function ScheduleForm({ bins, collectors, onSubmit, onCancel }: ScheduleFormProps) {
  const [binId, setBinId] = useState('');
  const [collectorId, setCollectorId] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [collectorTouched, setCollectorTouched] = useState(false);

  const selectedBin = useMemo(() => bins.find(b => b.id === binId), [bins, binId]);

  const filteredCollectors = useMemo(() => {
    if (!selectedBin?.area) return collectors;
    return collectors.filter(c => c.area === selectedBin.area);
  }, [collectors, selectedBin]);

  const isFormValid = binId && collectorId && pickupTime;

  const handleBinChange = (value: string) => {
    setBinId(value);
    setCollectorId('');
    setCollectorTouched(false);
  };

  const handleCollectorClick = () => {
    if (!binId) {
      setCollectorTouched(true);
      toast({ title: 'Please select a bin first', variant: 'destructive' });
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;
    await onSubmit({ bin_id: binId, collector_id: collectorId, pickup_time: pickupTime });
  };

  const inputClass = 'w-full px-4 py-2.5 border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all';
  const disabledClass = 'opacity-50 cursor-not-allowed';

  return (
    <div className="bg-card border rounded-xl p-5 space-y-3 animate-fade-in shadow-sm hover:shadow-md transition-shadow">
      <div>
        <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Select Bin</label>
        <select
          value={binId}
          onChange={e => handleBinChange(e.target.value)}
          className={inputClass}
        >
          <option value="">Select Bin</option>
          {bins.map(b => (
            <option key={b.id} value={b.id}>
              {b.location} ({b.fill_level}%){b.area ? ` - ${b.area}` : ''}{b.sensor_id ? ` [${b.sensor_id}]` : ''}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Select Collector</label>
        <div onClick={handleCollectorClick}>
          <select
            value={collectorId}
            onChange={e => setCollectorId(e.target.value)}
            disabled={!binId}
            className={`${inputClass} ${!binId ? disabledClass : ''}`}
          >
            <option value="">
              {!binId ? 'Select a bin first' : filteredCollectors.length === 0 ? 'No collectors in this area' : 'Select Collector'}
            </option>
            {binId && filteredCollectors.map(c => (
              <option key={c.user_id} value={c.user_id}>
                {c.full_name}{c.area ? ` (${c.area})` : ''}
              </option>
            ))}
          </select>
        </div>
        {collectorTouched && !binId && (
          <p className="text-xs text-destructive mt-1">Please select a bin first</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Schedule Date & Time</label>
        <input
          type="datetime-local"
          value={pickupTime}
          onChange={e => setPickupTime(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="flex gap-2 pt-1">
        <button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className={`px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium transition-all ${!isFormValid ? disabledClass : 'hover:opacity-90'}`}
        >
          <Check className="h-4 w-4 inline mr-1" />Create
        </button>
        <button onClick={onCancel} className="px-5 py-2.5 rounded-xl border text-sm hover:bg-secondary transition-colors">
          <X className="h-4 w-4 inline mr-1" />Cancel
        </button>
      </div>
    </div>
  );
}
