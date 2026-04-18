import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { User, Camera, Mail, Shield } from "lucide-react";

export default function ProfilePage() {
  const { user, profile, role, refreshProfile } = useAuth();
  const [name, setName] = useState(profile?.full_name || "");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    let avatarUrl = profile?.avatar_url || null;

    if (avatar) {
      const ext = avatar.name.split(".").pop();
      const path = `${user.id}/avatar.${ext}`;
      const { error: uploadErr } = await supabase.storage
        .from("avatars")
        .upload(path, avatar, { upsert: true });
      if (!uploadErr) {
        const { data: urlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(path);
        avatarUrl = urlData.publicUrl;
      }
    }

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: name, avatar_url: avatarUrl })
      .eq("user_id", user.id);
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Profile updated!" });
      await refreshProfile();
    }
    setSaving(false);
  };

  const displayAvatar = preview || profile?.avatar_url;

  return (
    <div className=" bg-background pt-32 pb-24 px-4">
      <div className="max-w-lg mx-auto animate-fade-in-up">
        <h1 className="text-3xl font-bold mb-8 tracking-tight">My Profile</h1>
        <form
          onSubmit={handleSave}
          className="bg-card border rounded-2xl p-8 space-y-8"
        >
          {/* Avatar */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <div className="h-28 w-28 rounded-full bg-secondary flex items-center justify-center overflow-hidden border-4 border-background shadow-lg">
                {displayAvatar ? (
                  <img
                    src={displayAvatar}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 h-10 w-10 rounded-full gradient-primary flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg">
                <Camera className="h-4 w-4 text-primary-foreground" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            <p className="text-xs text-muted-foreground">
              Click the camera icon to change your photo
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> Email
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full px-4 py-3 border rounded-xl bg-muted text-muted-foreground text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" /> Role
              </label>
              <input
                type="text"
                value={role || "citizen"}
                disabled
                className="w-full px-4 py-3 border rounded-xl bg-muted text-muted-foreground text-sm capitalize"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 rounded-xl gradient-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
