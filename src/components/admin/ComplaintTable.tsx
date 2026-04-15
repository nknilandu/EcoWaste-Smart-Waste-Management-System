interface Complaint {
  id: string;
  details: string;
  status: string;
  created_at: string;
  user_id: string;
  bin_id: string;
}

interface UserProfile {
  user_id: string;
  full_name: string;
  email?: string;
}

interface Bin {
  id: string;
  location: string;
  area?: string | null;
  subarea?: string | null;
}

interface ComplaintTableProps {
  complaints: Complaint[];
  users: UserProfile[];
  bins: Bin[];
  onStatusChange: (id: string, status: string) => void;
}

function statusBadge(status: string) {
  switch (status) {
    case 'pending':
      return 'bg-muted text-muted-foreground';
    case 'in_progress':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    case 'resolved':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

export default function ComplaintTable({ complaints, users, bins, onStatusChange }: ComplaintTableProps) {
  const userMap = new Map(users.map(u => [u.user_id, u]));
  const binMap = new Map(bins.map(b => [b.id, b]));

  return (
    <div className="bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">User</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Bin Details</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Details</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map(c => {
              const user = userMap.get(c.user_id);
              const bin = binMap.get(c.bin_id);
              return (
                <tr key={c.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-3">
                    <div>
                      <p className="text-sm font-medium">{user?.full_name || 'Unknown'}</p>
                      {user?.email && <p className="text-xs text-muted-foreground">{user.email}</p>}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div>
                      <p className="text-sm font-medium">{bin?.location || c.bin_id.slice(0, 8)}</p>
                      {(bin?.area || bin?.subarea) && (
                        <p className="text-xs text-muted-foreground">
                          {[bin.area, bin.subarea].filter(Boolean).join(' - ')}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm max-w-[250px] truncate">{c.details}</td>
                  <td className="px-5 py-3 text-sm text-muted-foreground whitespace-nowrap">
                    {new Date(c.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusBadge(c.status)}`}>
                      {c.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {c.status !== 'resolved' && (
                      <select
                        value={c.status}
                        onChange={e => onStatusChange(c.id, e.target.value)}
                        className="text-xs px-3 py-1.5 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    )}
                  </td>
                </tr>
              );
            })}
            {complaints.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-sm text-muted-foreground">No complaints found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
