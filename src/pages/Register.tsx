import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { User, Truck } from "lucide-react";

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
  "Rampura",
  "Khilgaon",
  "Shahbag",
  "Farmgate",
  "Lalmatia",
];

type UserRole = "collector" | "citizen" | "admin";
type SubmitState = "idle" | "creating" | "signing-in";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"collector" | "citizen">("citizen");
  const [area, setArea] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  const navigate = useNavigate();

  const isLoading = submitState !== "idle";

  const getRedirectPath = (userRole: UserRole) => {
    if (userRole === "admin") return "/admin";
    if (userRole === "collector") return "/collector";
    return "/dashboard";
  };

  const loginAndRedirect = async (userEmail: string, userPassword: string) => {
    setSubmitState("signing-in");

    const { data: loginData, error: loginError } =
      await supabase.auth.signInWithPassword({
        email: userEmail,
        password: userPassword,
      });

    if (loginError) {
      toast({
        title: "Account created, but auto login failed",
        description: loginError.message,
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    const loggedInUser = loginData.user;

    if (!loggedInUser) {
      toast({
        title: "Login failed",
        description: "User session not found after sign in.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    const { data: roleData, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", loggedInUser.id)
      .single();

    if (roleError) {
      toast({
        title: "Login successful, but role fetch failed",
        description: roleError.message,
        variant: "destructive",
      });
      navigate("/dashboard");
      return;
    }

    const userRole = (roleData?.role as UserRole) || "citizen";

    toast({
      title: "Login successful",
      description: "Welcome to your account.",
    });

    navigate(getRedirectPath(userRole));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!area) {
      toast({
        title: "Please select your area",
        variant: "destructive",
      });
      return;
    }

    setSubmitState("creating");

    try {
      // 1. Create auth user
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              area,
            },
          },
        });

      if (signUpError) {
        toast({
          title: "Registration failed",
          description: signUpError.message,
          variant: "destructive",
        });
        setSubmitState("idle");
        return;
      }

      const user = signUpData.user;

      if (!user) {
        toast({
          title: "User creation failed",
          description: "No user returned from signup.",
          variant: "destructive",
        });
        setSubmitState("idle");
        return;
      }

      // 2. Upload avatar if exists
      let avatar_url: string | null = null;

      if (avatar) {
        const ext = avatar.name.split(".").pop();
        const filePath = `${user.id}/avatar.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, avatar, { upsert: true });

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from("avatars")
            .getPublicUrl(filePath);

          avatar_url = publicUrlData.publicUrl;
        }
      }

      // 3. Insert profile
      const { error: profileError } = await supabase.from("profiles").insert({
        user_id: user.id,
        full_name: name,
        email,
        avatar_url,
        area,
      });

      if (profileError) {
        toast({
          title: "Profile save failed",
          description: profileError.message,
          variant: "destructive",
        });
        setSubmitState("idle");
        return;
      }

      // 4. Insert role
      const { error: roleError } = await supabase.from("user_roles").insert({
        user_id: user.id,
        role,
      });

      if (roleError) {
        toast({
          title: "Role save failed",
          description: roleError.message,
          variant: "destructive",
        });
        setSubmitState("idle");
        return;
      }

      toast({
        title: "Account created",
        description: "Signing in to your account...",
      });

      // 5. Auto login with same email/password
      await loginAndRedirect(email, password);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong.";

      toast({
        title: "Registration failed",
        description: message,
        variant: "destructive",
      });

      setSubmitState("idle");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pb-14 pt-28 bg-background">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gradient">Create Account</h1>
          <p className="text-muted-foreground mt-2">
            Join EcoWaste and make a difference
          </p>
        </div>

        <form
          onSubmit={handleRegister}
          className="bg-card border rounded-xl p-6 space-y-5 shadow-sm"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center overflow-hidden border-2 border-border">
              {preview ? (
                <img
                  src={preview}
                  alt="Avatar preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-2xl">👤</span>
              )}
            </div>

            <label className="text-sm text-primary font-medium cursor-pointer hover:underline">
              Upload Photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
                disabled={isLoading}
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2.5 border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2.5 border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2.5 border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Area</label>
            <select
              required
              value={area}
              onChange={(e) => setArea(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2.5 border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm disabled:opacity-60"
            >
              <option value="">Select your area</option>
              {AREAS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">I am a</label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("citizen")}
                disabled={isLoading}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  role === "citizen"
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-muted-foreground/30"
                } disabled:opacity-60`}
              >
                <div
                  className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                    role === "citizen" ? "gradient-primary" : "bg-muted"
                  }`}
                >
                  <User
                    className={`h-6 w-6 ${
                      role === "citizen"
                        ? "text-primary-foreground"
                        : "text-muted-foreground"
                    }`}
                  />
                </div>
                <span
                  className={`text-sm font-semibold ${
                    role === "citizen"
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  User
                </span>
                <span className="text-[11px] text-muted-foreground text-center">
                  Report issues & track bins
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRole("collector")}
                disabled={isLoading}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  role === "collector"
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-muted-foreground/30"
                } disabled:opacity-60`}
              >
                <div
                  className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                    role === "collector" ? "gradient-primary" : "bg-muted"
                  }`}
                >
                  <Truck
                    className={`h-6 w-6 ${
                      role === "collector"
                        ? "text-primary-foreground"
                        : "text-muted-foreground"
                    }`}
                  />
                </div>
                <span
                  className={`text-sm font-semibold ${
                    role === "collector"
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  Collector
                </span>
                <span className="text-[11px] text-muted-foreground text-center">
                  Manage waste pickups
                </span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl gradient-primary text-primary-foreground font-medium text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitState === "creating"
              ? "Creating account..."
              : submitState === "signing-in"
                ? "Signing in..."
                : "Create Account"}
          </button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-medium hover:underline"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
