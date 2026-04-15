interface UserProfile {
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  role?: string;
  area?: string | null;
  created_at?: string;
  email?: string;
}

interface Complaint {
  user_id: string;
}

interface UserTablesProps {
  users: UserProfile[];
  complaints: Complaint[];
}

function UserTable({ title, users, extraColumns }: {
  title: string;
  users: UserProfile[];
  extraColumns?: (u: UserProfile) => React.ReactNode;
}) {
  return (
    <div className="bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="px-5 py-4 border-b bg-muted/20">
        <h3 className="font-semibold text-sm">{title} ({users.length})</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Role</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Area</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Created</th>
              {extraColumns && <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Details</th>}
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.user_id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    {u.avatar_url ? (
                      <img src={u.avatar_url} alt="" className="h-8 w-8 rounded-full object-cover" />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground text-xs font-medium">
                        {(u.full_name || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="font-medium text-sm">{u.full_name || 'Unnamed'}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-sm text-muted-foreground">{u.email || '-'}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    u.role === 'admin' ? 'bg-destructive/10 text-destructive' :
                    u.role === 'collector' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                    'bg-primary/10 text-primary'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-3 text-sm text-muted-foreground">{u.area || '-'}</td>
                <td className="px-5 py-3 text-sm text-muted-foreground whitespace-nowrap">
                  {u.created_at ? new Date(u.created_at).toLocaleDateString() : '-'}
                </td>
                {extraColumns && <td className="px-5 py-3">{extraColumns(u)}</td>}
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={extraColumns ? 6 : 5} className="px-5 py-8 text-center text-sm text-muted-foreground">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function UserTables({ users, complaints }: UserTablesProps) {
  const admins = users.filter(u => u.role === 'admin');
  const collectorsList = users.filter(u => u.role === 'collector');
  const citizens = users.filter(u => u.role === 'citizen');

  const complaintCounts = new Map<string, number>();
  complaints.forEach(c => {
    complaintCounts.set(c.user_id, (complaintCounts.get(c.user_id) || 0) + 1);
  });

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">{users.length} registered users</p>

      <UserTable title="Admins" users={admins} />

      <UserTable
        title="Collectors"
        users={collectorsList}
        extraColumns={(u) => (
          <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            Active
          </span>
        )}
      />

      <UserTable
        title="Citizens"
        users={citizens}
        extraColumns={(u) => {
          const count = complaintCounts.get(u.user_id) || 0;
          return (
            <span className="text-xs text-muted-foreground">
              {count} complaint{count !== 1 ? 's' : ''}
            </span>
          );
        }}
      />
    </div>
  );
}
