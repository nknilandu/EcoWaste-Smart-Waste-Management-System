import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "@/hooks/use-toast";
import {
  Users,
  Trash2,
  AlertTriangle,
  Calendar,
  Plus,
  Edit2,
  X,
  Check,
  TrendingUp,
  Activity,
  Search,
  ChartColumnBig,
} from "lucide-react";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";
import ScheduleForm from "@/components/admin/ScheduleForm";
import ComplaintTable from "@/components/admin/ComplaintTable";
import UserTables from "@/components/admin/UserTables";

const AREAS = [
  "Gulshan",
  "Banani",
  "Uttara",
  "Dhanmondi",
  "Mirpur",
  "Mohammadpur",
  "Motijheel",
  "Tejgaon",
  "Bashundhara",
  "Badda",
];

interface Bin {
  id: string;
  location: string;
  fill_level: number;
  status: string;
  sensor_id?: string | null;
  area?: string | null;
  subarea?: string | null;
}
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
  avatar_url: string | null;
  area?: string | null;
  created_at?: string;
  role?: string;
  email?: string;
}
interface UserRole {
  user_id: string;
  role: string;
}
interface Collection {
  id: string;
  bin_id: string;
  collector_id: string;
  pickup_time: string;
  status: string;
}

function AnalyticsCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Trash2;
  label: string;
  value: number;
  color: string;
}) {
  const count = useAnimatedCounter(value);
  return (
    <div className="bg-card border rounded-2xl p-5 stat-card hover-lift">
      <div className="flex items-center justify-between mb-3">
        <div
          className={`h-10 w-10 rounded-xl flex items-center justify-center ${color}`}
        >
          <Icon className="h-5 w-5 text-primary-foreground" />
        </div>
        <TrendingUp className="h-4 w-4 text-primary" />
      </div>
      <p className="text-2xl font-bold">{count}</p>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

function SimpleBarChart({
  data,
  title,
}: {
  data: { label: string; value: number; color: string }[];
  
  title: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="bg-card border rounded-2xl p-6">
      <h3 className="font-semibold mb-4">{title}</h3>
      <div className="flex items-end gap-3 h-32">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-xs font-semibold">{d.value}</span>
            <div className="w-full flex flex-col items-center justify-end h-24">
  <div
    className="w-full rounded-t-lg transition-all duration-700"
    style={{
      flexGrow: d.value === 0 ? 0.06 : d.value,
      background: d.color,
      minHeight: 2,
    }}
  />
</div>
            <span className="text-[10px] text-muted-foreground text-center leading-tight mt-1">
              {d.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function scheduleStatusBadge(status?: string | null) {
  switch (status) {
    case "scheduled":
      return "bg-sky-500/20 text-sky-600 dark:bg-sky-900/30 dark:text-sky-300";
    case "in_progress":
      return "bg-yellow-500/20 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-300";
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState<
    "overview" | "bins" | "users" | "complaints" | "schedules"
  >("overview");
  const [bins, setBins] = useState<Bin[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [collectors, setCollectors] = useState<
    { user_id: string; full_name: string; area?: string | null }[]
  >([]);
  const [search, setSearch] = useState("");

  const [showBinForm, setShowBinForm] = useState(false);
  const [editBin, setEditBin] = useState<Bin | null>(null);
  const [binForm, setBinForm] = useState({
    location: "",
    fill_level: 0,
    status: "active",
    sensor_id: "",
    area: "",
    subarea: "",
  });

  const [showScheduleForm, setShowScheduleForm] = useState(false);

  const isTouched = Object.values(binForm).some((v) => v !== "");

  const isFormValid =
    binForm.location?.trim() &&
    binForm.sensor_id?.trim() &&
    binForm.area &&
    binForm.subarea?.trim() &&
    binForm.fill_level >= 0 &&
    binForm.fill_level <= 100 &&
    binForm.status;

  const fetchAll = useCallback(async () => {
    const [binsR, complaintsR, profilesR, rolesR, collectionsR] =
      await Promise.all([
        supabase
          .from("bins")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("complaints")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("profiles")
          .select("user_id, full_name, avatar_url, area, created_at, email"),
        supabase.from("user_roles").select("user_id, role"),
        supabase
          .from("collections")
          .select("*")
          .order("pickup_time", { ascending: false }),
      ]);
    if (binsR.data) setBins(binsR.data as Bin[]);
    if (complaintsR.data) setComplaints(complaintsR.data);
    if (collectionsR.data) setCollections(collectionsR.data);
    if (profilesR.data && rolesR.data) {
      const roleMap = new Map(
        rolesR.data.map((r: UserRole) => [r.user_id, r.role]),
      );
      const merged = profilesR.data.map((p: any) => ({
        ...p,
        role: roleMap.get(p.user_id),
      }));
      setUsers(merged);
      setCollectors(
        profilesR.data
          .filter((p: any) => roleMap.get(p.user_id) === "collector")
          .map((p: any) => ({
            user_id: p.user_id,
            full_name: p.full_name,
            area: p.area,
          })),
      );
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // IoT Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setBins((prev) =>
        prev.map((bin) => {
          if (bin.status === "inactive" || bin.status === "maintenance")
            return bin;
          const newLevel = Math.min(
            100,
            bin.fill_level + Math.floor(Math.random() * 3),
          );
          const newStatus = newLevel >= 90 ? "full" : "active";
          if (newLevel >= 80 && bin.fill_level < 80 && user) {
            supabase.from("notifications").insert({
              user_id: user.id,
              title: "Bin Almost Full",
              message: `Bin at ${bin.location}${bin.sensor_id ? ` (Sensor: ${bin.sensor_id})` : ""} is ${newLevel}% full.`,
              type: "warning",
            });
          }
          return { ...bin, fill_level: newLevel, status: newStatus };
        }),
      );
    }, 8000);
    return () => clearInterval(interval);
  }, [user]);

  const saveBin = async () => {
    const payload = {
      location: binForm.location,
      fill_level: binForm.fill_level,
      status: binForm.status,
      sensor_id: binForm.sensor_id || null,
      area: binForm.area || null,
      subarea: binForm.subarea || null,
    };
    if (editBin) {
      await supabase.from("bins").update(payload).eq("id", editBin.id);
    } else {
      await supabase.from("bins").insert(payload);
    }
    setShowBinForm(false);
    setEditBin(null);
    setBinForm({
      location: "",
      fill_level: 0,
      status: "active",
      sensor_id: "",
      area: "",
      subarea: "",
    });
    fetchAll();
    toast({ title: editBin ? "Bin updated" : "Bin created" });
  };

  const deleteBin = async (id: string) => {
    await supabase.from("bins").delete().eq("id", id);
    fetchAll();
    toast({ title: "Bin deleted" });
  };

  const updateComplaintStatus = async (id: string, status: string) => {
    await supabase.from("complaints").update({ status }).eq("id", id);
    if (status === "resolved") {
      const complaint = complaints.find((c) => c.id === id);
      if (complaint) {
        await supabase.from("notifications").insert({
          user_id: complaint.user_id,
          title: "Complaint Resolved",
          message: "Your complaint has been resolved.",
          type: "info",
        });
      }
    }
    fetchAll();
  };

 const createSchedule = async (form: {
  bin_id: string;
  collector_id: string;
  pickup_time: string;
}) => {
  await supabase.from("collections").insert({
    ...form,
    status: "scheduled", 
  });

  setShowScheduleForm(false);
  fetchAll();
  toast({ title: "Schedule created" });
};

  const fillColor = (level: number) =>
    level >= 80
      ? "bg-destructive"
      : level >= 40
        ? "bg-[hsl(var(--warning))]"
        : "bg-primary";
  const fillLabel = (level: number) =>
    level >= 80 ? "FULL" : level >= 40 ? "MID" : "EMPTY";
  const fillBadge = (level: number) =>
    level >= 80
      ? "bg-destructive/10 text-destructive"
      : level >= 40
        ? "bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))]"
        : "bg-primary/10 text-primary";

  const tabs = [
    { key: "overview" as const, label: "Overview", icon: Activity },
    { key: "bins" as const, label: "Bins", icon: Trash2 },
    { key: "users" as const, label: "Users", icon: Users },
    { key: "complaints" as const, label: "Complaints", icon: AlertTriangle },
    { key: "schedules" as const, label: "Schedules", icon: Calendar },
  ];

  const pendingComplaints = complaints.filter(
    (c) => c.status === "pending",
  ).length;
  const fullBins = bins.filter((b) => b.fill_level >= 80).length;
  const activeBins = bins.filter((b) => b.status === "active").length;

  const filteredBins = bins.filter((b) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      b.location.toLowerCase().includes(q) ||
      b.area?.toLowerCase().includes(q) ||
      b.subarea?.toLowerCase().includes(q) ||
      b.sensor_id?.toLowerCase().includes(q)
    );
  });

  const chartData = [
    { label: "Total", value: bins.length, color: "hsl(var(--primary))" },
    { label: "Active", value: activeBins, color: "hsl(var(--success))" },
    { label: "Full", value: fullBins, color: "hsl(var(--destructive))" },
    {
      label: "Maint.",
      value: bins.filter((b) => b.status === "maintenance").length,
      color: "hsl(var(--warning))",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 md:p-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage bins, users, complaints, and collection schedules.
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search area, sensor, subarea..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 flex-wrap bg-muted/50 p-1 rounded-xl w-fit">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === t.key ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <AnalyticsCard
                icon={Trash2}
                label="Total Bins"
                value={bins.length}
                color="gradient-primary"
              />
              <AnalyticsCard
                icon={Users}
                label="Total Users"
                value={users.length}
                color="bg-accent"
              />
              <AnalyticsCard
                icon={AlertTriangle}
                label="Pending Complaints"
                value={pendingComplaints}
                color="bg-destructive"
              />
              <AnalyticsCard
                icon={Calendar}
                label="Scheduled Pickups"
                value={
                  collections.filter((c) => c.status === "scheduled").length
                }
                color="gradient-primary"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SimpleBarChart data={chartData} title="Bin Status Overview" />
              <SimpleBarChart
                data={[
                  {
                    label: "Pending",
                    value: pendingComplaints,
                    color: "hsl(var(--warning))",
                  },
                  {
                    label: "In Progress",
                    value: complaints.filter((c) => c.status === "in_progress")
                      .length,
                    color: "hsl(var(--accent))",
                  },
                  {
                    label: "Resolved",
                    value: complaints.filter((c) => c.status === "resolved")
                      .length,
                    color: "hsl(var(--success))",
                  },
                ]}
                title="Complaints Overview"
              />
            </div>

            <div className="bg-card border rounded-2xl p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" /> Live Bin Status
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {bins.slice(0, 6).map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {b.location}
                      </p>
                      {b.sensor_id && (
                        <p className="text-[10px] text-muted-foreground">
                          Sensor: {b.sensor_id}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ${fillColor(b.fill_level)}`}
                            style={{ width: `${b.fill_level}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-8">
                          {b.fill_level}%
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-1 rounded-full font-semibold ${fillBadge(b.fill_level)}`}
                    >
                      {fillLabel(b.fill_level)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fullBins > 0 && (
                <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-5">
                  <h4 className="font-semibold text-destructive flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" /> {fullBins} Bins Near
                    Full
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Schedule pickups for bins exceeding 80% capacity.
                  </p>
                  <button
                    onClick={() => setTab("schedules")}
                    className="mt-3 text-sm font-medium text-destructive hover:underline"
                  >
                    Create Schedule
                  </button>
                </div>
              )}
              {pendingComplaints > 0 && (
                <div className="bg-[hsl(var(--warning))]/5 border border-[hsl(var(--warning))]/20 rounded-2xl p-5">
                  <h4 className="font-semibold text-[hsl(var(--warning))] flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" /> {pendingComplaints}{" "}
                    Pending Complaints
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Review and resolve citizen complaints.
                  </p>
                  <button
                    onClick={() => setTab("complaints")}
                    className="mt-3 text-sm font-medium text-primary hover:underline"
                  >
                    View Complaints
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bins */}
        {tab === "bins" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {filteredBins.length} bins{search ? " matching" : " total"}
              </p>
              <button
                onClick={() => {
                  setShowBinForm(true);
                  setEditBin(null);
                  setBinForm({
                    location: "Dhaka",
                    fill_level: 0,
                    status: "active",
                    sensor_id: "",
                    area: "",
                    subarea: "",
                  });
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Plus className="h-4 w-4" /> Add Bin
              </button>
            </div>
            {showBinForm && (
              <div className="bg-card border rounded-xl p-5 space-y-3 animate-fade-in shadow-sm hover:shadow-md transition-shadow">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1 text-muted-foreground">
                      Location
                    </label>
                    <input
                      placeholder="e.g. Gulshan Circle-1"
                      value={binForm.location}
                      disabled
                      onChange={(e) =>
                        setBinForm({ ...binForm, location: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-muted-foreground">
                      Sensor ID
                    </label>
                    <input
                      placeholder="e.g. BIN-1023"
                      value={binForm.sensor_id}
                      onChange={(e) =>
                        setBinForm({ ...binForm, sensor_id: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-muted-foreground">
                      Area
                    </label>
                    <select
                      value={binForm.area}
                      onChange={(e) =>
                        setBinForm({ ...binForm, area: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Select Area</option>
                      {AREAS.map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-muted-foreground">
                      Subarea
                    </label>
                    <input
                      placeholder="e.g. Block-A, Lane-3"
                      value={binForm.subarea}
                      onChange={(e) =>
                        setBinForm({ ...binForm, subarea: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-muted-foreground">
                      Fill Level (%)
                    </label>
                    <input
                      type="number"
                      placeholder="0-100"
                      min={0}
                      max={100}
                      value={binForm.fill_level}
                      onChange={(e) =>
                        setBinForm({
                          ...binForm,
                          fill_level: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-4 py-2.5 border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-muted-foreground">
                      Status
                    </label>
                    <select
                      value={binForm.status}
                      onChange={(e) =>
                        setBinForm({ ...binForm, status: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="full">Full</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={saveBin}
                    disabled={!isFormValid}
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all gradient-primary text-primary-foreground ${isFormValid ? "opacity-100 hover:opacity-90 cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
                  >
                    <Check className="h-4 w-4 inline mr-1" />
                    Save
                  </button>
                  <button
                    onClick={() => setShowBinForm(false)}
                    className="px-5 py-2.5 rounded-xl border text-sm hover:bg-secondary transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            <div className="grid gap-3">
              {filteredBins.map((b) => (
                <div
                  key={b.id}
                  className="bg-card border rounded-xl p-5 flex items-center justify-between hover-lift shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium">{b.area}</p>
                      {b.subarea && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                          {b.subarea}
                        </span>
                      )}
                      {b.location && (
                        <span className="text-[10px] text-muted-foreground">
                          ● {b.location}
                        </span>
                      )}
                    </div>
                    {b.sensor_id && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Sensor: {b.sensor_id}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex-1 max-w-[200px] bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${fillColor(b.fill_level)}`}
                          style={{ width: `${b.fill_level}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {b.fill_level}%
                      </span>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${fillBadge(b.fill_level)}`}
                      >
                        {fillLabel(b.fill_level)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1 ml-4">
                    <button
                      onClick={() => {
                        setEditBin(b);
                        setBinForm({
                          location: b.location,
                          fill_level: b.fill_level,
                          status: b.status,
                          sensor_id: b.sensor_id || "",
                          area: b.area || "",
                          subarea: b.subarea || "",
                        });
                        setShowBinForm(true);
                      }}
                      className="p-2.5 rounded-xl hover:bg-secondary transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteBin(b.id)}
                      className="p-2.5 rounded-xl hover:bg-destructive/10 text-destructive transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users */}
        {tab === "users" && (
          <UserTables users={users} complaints={complaints} />
        )}

        {/* Complaints */}
        {tab === "complaints" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {complaints.length} total complaints
            </p>
            <ComplaintTable
              complaints={complaints}
              users={users}
              bins={bins}
              onStatusChange={updateComplaintStatus}
            />
          </div>
        )}

        {/* Schedules */}
        {tab === "schedules" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {collections.length} schedules
              </p>
              <button
                onClick={() => setShowScheduleForm(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Plus className="h-4 w-4" /> Create Schedule
              </button>
            </div>
            {showScheduleForm && (
              <ScheduleForm
                bins={bins}
                collectors={collectors}
                onSubmit={createSchedule}
                onCancel={() => setShowScheduleForm(false)}
              />
            )}
            <div className="grid gap-3">
              {collections.map((c) => (
                <div
                  key={c.id}
                  className="bg-card border rounded-xl p-5 hover-lift shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        {bins.find((b) => b.id === c.bin_id)?.area ||
                          c.bin_id} <span className="font-normal text-xs"> - {bins.find((b) => b.id === c.bin_id)?.subarea}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(c.pickup_time).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Collector:{" "}
                        {users.find((u) => u.user_id === c.collector_id)
                          ?.full_name || "Unknown"}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${scheduleStatusBadge(c.status)}`}
                    >
                       {(c.status || "checking...").replace("_", " ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
