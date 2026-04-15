import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "@/hooks/use-toast";
import {
  Trash2,
  AlertTriangle,
  Plus,
  Send,
  MapPin,
  Search,
  CalendarCheck,
  Pin, 
} from "lucide-react";

import TaskAlert, {
  type TaskAlertData,
} from "@/components/daily-task/TaskAlert";
import TaskChart from "@/components/daily-task/TaskChart";
import TaskForm from "@/components/daily-task/TaskForm";
import TaskHistory from "@/components/daily-task/TaskHistory";

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
  bin_id: string;
  created_at: string;
}
interface DailyTask {
  id: string;
  bin_id: string;
  completed_at: string;
}

export default function CitizenDashboard() {
  const { user, profile } = useAuth();
  const [tab, setTab] = useState<"bins" | "complaints" | "daily-task">("bins");
  const [bins, setBins] = useState<Bin[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [complaintForm, setComplaintForm] = useState({
    bin_id: "",
    details: "",
  });
  const [search, setSearch] = useState("");
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(
    new Set(),
  );
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);

  const userArea = profile?.area;

  const fetchData = async () => {
    if (!user) return;
    // Fetch bins filtered by user area at API level
    let binQuery = supabase.from("bins").select("*").order("location");
    if (userArea) binQuery = binQuery.eq("area", userArea);

    const [binR, compR, taskR] = await Promise.all([
      binQuery,
      supabase
        .from("complaints")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("daily_tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false }),
    ]);
    if (binR.data) setBins(binR.data as Bin[]);
    if (compR.data) setComplaints(compR.data);
    if (taskR.data) setDailyTasks(taskR.data as DailyTask[]);
  };

  useEffect(() => {
    fetchData();
  }, [user, userArea]);

  // IoT Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setBins((prev) =>
        prev.map((bin) => {
          if (bin.status === "inactive" || bin.status === "maintenance")
            return bin;
          const newLevel = Math.min(
            100,
            bin.fill_level + Math.floor(Math.random() * 2),
          );
          return {
            ...bin,
            fill_level: newLevel,
            status: newLevel >= 90 ? "full" : "active",
          };
        }),
      );
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const submitComplaint = async () => {
    if (!user || !complaintForm.bin_id || !complaintForm.details.trim()) return;
    const { error } = await supabase.from("complaints").insert({
  user_id: user.id,
  bin_id: complaintForm.bin_id,
  details: complaintForm.details.trim(),
  status: "pending", 
});
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    await supabase.from("notifications").insert({
      user_id: user.id,
      title: "Complaint Submitted",
      message: "Your complaint has been submitted and is being reviewed.",
      type: "complaint",
    });
    setShowForm(false);
    setComplaintForm({ bin_id: "", details: "" });
    fetchData();
    toast({ title: "Complaint submitted!" });
  };

  const filteredBins = bins.filter((b) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      b.location.toLowerCase().includes(s) ||
      b.sensor_id?.toLowerCase().includes(s) ||
      b.subarea?.toLowerCase().includes(s)
    );
  });

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

  // Daily task logic
  const todayStr = new Date().toISOString().split("T")[0];

  const completedToday = dailyTasks.some(
    (t) => t.completed_at?.split("T")[0] === todayStr,
  );

  const completedDates = useMemo(() => {
    const s = new Set<string>();

    dailyTasks.forEach((t) => {
      if (t.completed_at) {
        s.add(t.completed_at.split("T")[0]);
      }
    });

    return s;
  }, [dailyTasks]);

  const taskHistory = useMemo(() => {
    return dailyTasks
      .filter((t) => t.completed_at) // important
      .map((t) => {
        const bin = bins.find((b) => b.id === t.bin_id);
        return {
          id: t.id,
          bin_location: bin?.location || "Unknown",
          completed_at: t.completed_at!,
        };
      });
  }, [dailyTasks, bins]);

  const handleTaskSubmit = async (binId: string, otp: string) => {
    if (!user) return;
    const { error } = await supabase.from("daily_tasks").insert({
      user_id: user.id,
      bin_id: binId,
      otp,
      completed_at: new Date().toISOString(), // 🔥 ADD THIS
    });
    if (error) {
      if (error.code === "23505") {
        toast({
          title: "Already completed",
          description: "You've already completed today's task.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
      return;
    }
    toast({ title: "✅ Task completed successfully!" });
    fetchData();
  };

  // Alert logic
  const lastTask = dailyTasks[0];
  const hoursSinceLastTask = lastTask
    ? (Date.now() - new Date(lastTask.completed_at).getTime()) /
      (1000 * 60 * 60)
    : Infinity;

  const taskAlerts: TaskAlertData[] = [];
  if (completedToday) {
    taskAlerts.push({
      id: "task-success",
      type: "success",
      message: "Task completed successfully",
    });
  } else if (hoursSinceLastTask > 72) {
    taskAlerts.push({
      id: "task-overdue",
      type: "danger",
      message: "Immediate action required — task overdue",
    });
  } else if (hoursSinceLastTask > 24) {
    taskAlerts.push({
      id: "task-reminder",
      type: "warning",
      message: "Reminder: Please complete your daily task",
    });
  }

  // Bin alerts
  const binAlerts: TaskAlertData[] = [];
  const fullBinsExist = bins.some((b) => b.fill_level >= 80);
  if (!fullBinsExist && bins.length > 0) {
    binAlerts.push({
      id: "all-ok",
      type: "success",
      message: "All bins functioning properly",
    });
  }
  if (fullBinsExist) {
    binAlerts.push({
      id: "full-bins",
      type: "danger",
      message: "Some bins are full — immediate action required",
    });
  }

  const currentAlerts = tab === "daily-task" ? taskAlerts : binAlerts;
  const visibleAlerts = currentAlerts.filter((a) => !dismissedAlerts.has(a.id));

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto p-4 md:p-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Citizen Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              {userArea
                ? `Area: ${userArea}`
                : "View nearby bins and manage your complaints."}
            </p>
          </div>
          {tab === "bins" && (
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search subarea, sensor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
              />
            </div>
          )}
        </div>

        <TaskAlert
          alerts={visibleAlerts}
          onDismiss={(id) =>
            setDismissedAlerts((prev) => new Set([...prev, id]))
          }
        />

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-muted/50 p-1 rounded-xl w-fit">
          <button
            onClick={() => setTab("bins")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === "bins" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Trash2 className="h-4 w-4" /> Bins
          </button>
          <button
            onClick={() => setTab("complaints")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === "complaints" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <AlertTriangle className="h-4 w-4" /> My Complaints
          </button>
          <button
            onClick={() => setTab("daily-task")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === "daily-task" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <CalendarCheck className="h-4 w-4" /> Daily Task
          </button>
        </div>

        {/* BINS TAB */}
        {tab === "bins" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {filteredBins.length} bins found
              {userArea ? ` in ${userArea}` : ""}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {filteredBins.map((b) => (
                <div
                  key={b.id}
                  className="bg-card border rounded-2xl p-5 hover-lift"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <p className="font-semibold">{b.subarea}</p>
                    </div>
                    <span
                      className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${fillBadge(b.fill_level)}`}
                    >
                      {fillLabel(b.fill_level)}
                    </span>
                  </div>
                  {(b.area || b.subarea) && (
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {b.area && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                          {b.area}
                        </span>
                      )}
                      {b.location && (
                        <span className="text-[10px] text-muted-foreground">
                          · {b.location}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-muted rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${fillColor(b.fill_level)}`}
                        style={{ width: `${b.fill_level}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                      {b.fill_level}%
                      {b.sensor_id ? ` (Sensor: ${b.sensor_id})` : ""}
                    </span>
                  </div>
                </div>
              ))}
              {filteredBins.length === 0 && (
                <div className="col-span-2 text-center py-16 bg-card border rounded-2xl">
                  <Trash2 className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    No bins found{userArea ? ` in ${userArea}` : ""}.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* COMPLAINTS TAB */}
        {tab === "complaints" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {complaints.length} complaints
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Plus className="h-4 w-4" /> New Complaint
              </button>
            </div>
            {showForm && (
              <div className="bg-card border rounded-2xl p-5 space-y-3 animate-fade-in">
                <select
                  value={complaintForm.bin_id}
                  onChange={(e) =>
                    setComplaintForm({
                      ...complaintForm,
                      bin_id: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select Bin</option>
                  {bins.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.location}
                      {b.sensor_id ? ` [${b.sensor_id}]` : ""}
                    </option>
                  ))}
                </select>
                <textarea
                  placeholder="Describe the issue in detail..."
                  rows={3}
                  value={complaintForm.details}
                  onChange={(e) =>
                    setComplaintForm({
                      ...complaintForm,
                      details: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 border rounded-xl bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <div className="flex gap-2">
                  <button
                    onClick={submitComplaint}
                    className="px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm flex items-center gap-1.5 font-medium"
                  >
                    <Send className="h-4 w-4" /> Submit
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-5 py-2.5 rounded-xl border text-sm hover:bg-secondary transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            <div className="grid gap-3">
              {complaints.map((c) => {
                const bin = bins.find((b) => b.id === c.bin_id);
                return (
                  <div
                    key={c.id}
                    className="bg-card border rounded-2xl p-5 hover-lift"
                  >
                    <p className="text-sm font-medium mb-2">{c.details}</p>
                    {bin && (
                      <p className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
                        <Pin size={15} className="text-primary"/> <span> {bin.location}
                        {bin.sensor_id ? ` [${bin.sensor_id}]` : ""} </span> 
                      </p>
                    )}
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${c.status === "pending" ? "bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))]" : c.status === "resolved" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
                      >
                        {c.status}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(c.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                );
              })}
              {complaints.length === 0 && (
                <div className="text-center py-16 bg-card border rounded-2xl">
                  <AlertTriangle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    No complaints submitted yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* DAILY TASK TAB */}
        {tab === "daily-task" && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid gap-6 md:grid-cols-2">
              <TaskForm
                bins={bins}
                disabled={completedToday}
                onSubmit={handleTaskSubmit}
              />
              <TaskChart completedDates={completedDates} />
            </div>
            <TaskHistory tasks={taskHistory} />
          </div>
        )}
      </div>
    </div>
  );
}
