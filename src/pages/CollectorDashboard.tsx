import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "@/hooks/use-toast";
import {
  Check,
  Clock,
  MapPin,
  Activity,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";

interface Collection {
  id: string;
  bin_id: string;
  pickup_time: string;
  status: string;
}
interface Bin {
  id: string;
  location: string;
  fill_level: number;
}

export default function CollectorDashboard() {
  const { user } = useAuth();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [bins, setBins] = useState<Map<string, Bin>>(new Map());
  const [filter, setFilter] = useState<
    "all" | "scheduled" | "in_progress" | "completed"
  >("all");

  const fetchData = async () => {
    if (!user) return;
    const [colR, binR] = await Promise.all([
      supabase
        .from("collections")
        .select("*")
        .eq("collector_id", user.id)
        .order("pickup_time", { ascending: true }),
      supabase
        .from("bins")
        .select("id, location, area, subarea, sensor_id, fill_level"),
    ]);
    if (colR.data) setCollections(colR.data);
    if (binR.data) setBins(new Map(binR.data.map((b) => [b.id, b])));
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const markCompleted = async (id: string, binId: string) => {
    try {
      // collection update
      await supabase
        .from("collections")
        .update({ status: "completed" })
        .eq("id", id);

      // bin update (MAIN LOGIC 🔥)
      await supabase.from("bins").update({ fill_level: 0 }).eq("id", binId);

      fetchData();
      toast({ title: "Marked as completed & bin emptied!" });
    } catch (err) {
      console.error(err);
      toast({ title: "Error updating data", variant: "destructive" });
    }
  };

  const markInProgress = async (id: string) => {
    await supabase
      .from("collections")
      .update({ status: "in_progress" })
      .eq("id", id);
    fetchData();
  };

  const filtered =
    filter === "all"
      ? collections
      : collections.filter((c) => c.status === filter);
  const scheduled = collections.filter((c) => c.status === "scheduled").length;
  const inProgress = collections.filter(
    (c) => c.status === "in_progress",
  ).length;
  const completed = collections.filter((c) => c.status === "completed").length;

  const scheduledCount = useAnimatedCounter(scheduled);
  const inProgressCount = useAnimatedCounter(inProgress);
  const completedCount = useAnimatedCounter(completed);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto p-4 md:p-8 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Collector Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            View and manage your assigned pickups.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-card border rounded-2xl p-5 hover-lift">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center">
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">Scheduled</span>
            </div>
            <p className="text-2xl font-bold">{scheduledCount}</p>
          </div>
          <div className="bg-card border rounded-2xl p-5 hover-lift">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-9 w-9 rounded-xl bg-accent/10 flex items-center justify-center">
                <Activity className="h-4 w-4 text-accent" />
              </div>
              <span className="text-sm text-muted-foreground">In Progress</span>
            </div>
            <p className="text-2xl font-bold">{inProgressCount}</p>
          </div>
          <div className="bg-card border rounded-2xl p-5 hover-lift">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Completed</span>
            </div>
            <p className="text-2xl font-bold">{completedCount}</p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-1 mb-6 bg-muted/50 p-1 rounded-xl w-fit">
          {(["all", "scheduled", "in_progress", "completed"] as const).map(
            (f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${filter === f ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {f === "in_progress" ? "In Progress" : f}
              </button>
            ),
          )}
        </div>

        {/* Tasks */}
        <div className="grid gap-4">
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-card border rounded-2xl">
              <AlertTriangle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No pickups found.</p>
            </div>
          ) : (
            filtered.map((c) => {
              const bin = bins.get(c.bin_id);
              const fillColor =
                (bin?.fill_level ?? 0) >= 80
                  ? "bg-destructive"
                  : (bin?.fill_level ?? 0) >= 50
                    ? "bg-accent"
                    : "bg-primary";
              return (
                <div
                  key={c.id}
                  className="bg-card border rounded-2xl p-5 hover-lift"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <p className="font-semibold">
                          {bin?.subarea || "Unknown bin"}{" "}
                          <span className="font-normal text-xs">
                            {" "}
                            # {bin?.sensor_id}
                          </span>
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />{" "}
                        {new Date(c.pickup_time).toLocaleString()}
                      </p>
                      {bin && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="w-24 bg-muted rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${fillColor}`}
                              style={{ width: `${bin.fill_level}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {bin.fill_level}% full
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${c.status === "completed" ? "bg-primary/10 text-primary" : c.status === "in_progress" ? "bg-yellow-500/10 text-yellow-600" : "bg-sky-600/10 text-sky-600"}`}
                      >
                        {c.status}
                      </span>
                      {c.status === "scheduled" && (
                        <button
                          onClick={() => markInProgress(c.id)}
                          className="px-4 py-2 text-xs rounded-xl bg-accent text-white hover:opacity-90 font-medium transition-opacity"
                        >
                          Start
                        </button>
                      )}
                      {c.status === "in_progress" && (
                        <button
                          onClick={() => markCompleted(c.id, c.bin_id)}
                          className="px-4 py-2 text-xs rounded-xl gradient-primary text-primary-foreground hover:opacity-90 flex items-center gap-1.5 font-medium transition-opacity"
                        >
                          <Check className="h-3.5 w-3.5" /> Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
