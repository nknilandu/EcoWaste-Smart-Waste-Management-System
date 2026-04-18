import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { Logo } from "@/components/eco/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import NotificationBell from "./NotificationBell";
import {
  Menu,
  X,
  Home,
  LayoutGrid,
  Info,
  ShieldCheck,
  Phone,
  UserCircle2,
  LogOut,
  ChevronDown,
  UserRound,
} from "lucide-react";

type PublicItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

type PrivateItem = {
  label: string;
  to: string;
  icon: React.ElementType;
};

const publicItems: PublicItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Features", href: "#features", icon: LayoutGrid },
  { label: "How it Works", href: "#how", icon: Info },
  { label: "Vision", href: "#vision", icon: ShieldCheck },
  { label: "Contact", href: "#contact", icon: Phone },
];

export default function Navbar() {
  const { user, profile, role, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const isLoggedIn = !!user;
  const isHomePage = location.pathname === "/";

  const dashboardPath =
    role === "admin"
      ? "/admin"
      : role === "collector"
        ? "/collector"
        : "/dashboard";

  const privateItems: PrivateItem[] = [
    { label: "Home", to: "/", icon: Home },
    { label: "Dashboard", to: dashboardPath, icon: LayoutGrid },
    { label: "Dashboard", to: "/Profile", icon: UserRound },
  ];

  const avatarUrl =
    profile?.avatar_url ||
    profile?.photo_url ||
    profile?.image ||
    user?.user_metadata?.avatar_url ||
    "";

  const displayName =
    profile?.full_name ||
    profile?.name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Profile";

  useEffect(() => {
    const onScroll = () => {
      if (!isHomePage) {
        setScrolled(true);
        return;
      }
      setScrolled(window.scrollY > 20);
    };

    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHomePage]);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-profile-menu]")) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("click", handleOutside);
    return () => document.removeEventListener("click", handleOutside);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const handlePublicNav = (href: string) => {
    setMobileOpen(false);

    if (href === "/") {
      if (location.pathname !== "/") {
        navigate("/");
        return;
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const sectionId = href.replace("#", "");

    if (location.pathname !== "/") {
      navigate(`/${href}`);
      return;
    }

    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", href);
    }
  };

  const activePublicHash = isHomePage ? location.hash : "";

  const navbarShellClass = cn(
    "fixed inset-x-0 top-0 z-50 transition-all duration-300",
    isHomePage && !scrolled
      ? "bg-transparent"
      : "bg-background/85 backdrop-blur-xl border-b border-border/60 shadow-sm",
  );

  const navPillClass = cn(
    "hidden lg:flex items-center gap-2 rounded-full border px-2 py-2 transition-all duration-300",
    isHomePage && !scrolled
      ? "bg-white/10 border-white/15 backdrop-blur-xl"
      : "bg-background/80 border-border/70 backdrop-blur-xl shadow-sm",
  );

  const profileTriggerClass =
    "inline-flex items-center gap-3 rounded-full px-3 py-2 gradient-primary text-primary-foreground font-semibold text-sm shadow-md hover:opacity-90 transition-opacity";

  const getPublicNavClass = (active: boolean) =>
    cn(
      "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 border",
      active
        ? isHomePage && !scrolled
          ? "bg-white/15 text-white border-white/20"
          : "bg-primary/10 text-primary border-primary/20"
        : isHomePage && !scrolled
          ? "text-white/85 hover:text-white hover:bg-white/10 border-transparent"
          : "text-foreground/80 hover:text-foreground hover:bg-muted/70 border-transparent",
    );

  const getPrivateNavClass = (isActive: boolean) =>
    cn(
      "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 border",
      isActive
        ? isHomePage && !scrolled
          ? "bg-white/15 text-white border-white/20"
          : "bg-primary/10 text-primary border-primary/20"
        : isHomePage && !scrolled
          ? "text-white/85 hover:text-white hover:bg-white/10 border-transparent"
          : "text-foreground/80 hover:text-foreground hover:bg-muted/70 border-transparent",
    );

  const renderPublicDesktop = () =>
    publicItems.map((item) => {
      const Icon = item.icon;

      let active = false;
      if (item.href === "/") {
        active = isHomePage && !activePublicHash;
      } else {
        active = isHomePage && activePublicHash === item.href;
      }

      return (
        <button
          key={item.label}
          type="button"
          onClick={() => handlePublicNav(item.href)}
          className={getPublicNavClass(active)}
        >
          <Icon className="h-[17px] w-[17px]" />
          <span>{item.label}</span>
        </button>
      );
    });

  const renderPrivateDesktop = () =>
    privateItems.map((item) => {
      const Icon = item.icon;
      return (
        <NavLink key={item.to} to={item.to}>
          {({ isActive }) => (
            <span className={getPrivateNavClass(isActive)}>
              <Icon className="h-[17px] w-[17px]" />
              <span>{item.label}</span>
            </span>
          )}
        </NavLink>
      );
    });

  const renderPublicMobile = () =>
    publicItems.map((item) => {
      const Icon = item.icon;

      let active = false;
      if (item.href === "/") {
        active = isHomePage && !activePublicHash;
      } else {
        active = isHomePage && activePublicHash === item.href;
      }

      return (
        <button
          key={item.label}
          type="button"
          onClick={() => handlePublicNav(item.href)}
          className={cn(
            "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200",
            active
              ? isHomePage && !scrolled
                ? "bg-white/15 text-white"
                : "bg-primary/10 text-primary"
              : isHomePage && !scrolled
                ? "text-white/90 hover:bg-white/10 hover:text-white"
                : "text-foreground/80 hover:bg-muted hover:text-foreground",
          )}
        >
          <Icon className="h-[18px] w-[18px]" />
          <span>{item.label}</span>
        </button>
      );
    });

  const renderPrivateMobile = () =>
    privateItems.map((item) => {
      const Icon = item.icon;
      return (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200",
              isActive
                ? isHomePage && !scrolled
                  ? "bg-white/15 text-white"
                  : "bg-primary/10 text-primary"
                : isHomePage && !scrolled
                  ? "text-white/90 hover:bg-white/10 hover:text-white"
                  : "text-foreground/80 hover:bg-muted hover:text-foreground",
            )
          }
        >
          <Icon className="h-[18px] w-[18px]" />
          <span>{item.label}</span>
        </NavLink>
      );
    });

  return (
    <header className={navbarShellClass}>
      <div className="container">
        <div className="flex h-16 items-center justify-between md:h-20">
          <Link to="/" className="shrink-0">
            <Logo light={isHomePage && !scrolled} />
          </Link>

          <nav className={navPillClass}>
            {isLoggedIn ? renderPrivateDesktop() : renderPublicDesktop()}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            {!isLoggedIn ? (
              <>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "rounded-full p-5",
                    isHomePage && !scrolled
                      ? "text-white hover:bg-white/10 hover:text-white"
                      : "",
                  )}
                >
                  <Link to="/login">Sign in</Link>
                </Button>

                <Button
                  asChild
                  size="sm"
                  className="rounded-full px-5 py-5 shadow-md gradient-primary text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  <Link to="/register">Get Started</Link>
                </Button>
              </>
            ) : (
              <>
                {/* <NotificationBell /> */}
                <NotificationBell isHomePage={isHomePage} scrolled={scrolled} />

                <div className="relative" data-profile-menu>
                  <button
                    type="button"
                    onClick={() => setProfileOpen((prev) => !prev)}
                    className={cn(
                      "inline-flex items-center gap-3 rounded-full px-2 py-2 text-sm font-medium transition-all duration-200 border",
                      isHomePage && !scrolled
                        ? "bg-white/10 border-white/15 text-white hover:bg-white/15"
                        : "bg-background/70 border-border text-foreground hover:bg-muted",
                    )}
                  >
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={displayName}
                        className="h-7 w-7 rounded-full object-cover border border-white/30"
                      />
                    ) : (
                      <div className="h-7 w-7 rounded-full bg-white/15 border border-white/20 flex items-center justify-center">
                        <UserCircle2 className="h-4 w-4" />
                      </div>
                    )}

                    <span className="max-w-[120px] truncate">
                      {displayName}
                    </span>

                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        profileOpen && "rotate-180",
                      )}
                    />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-3xl border border-border bg-background/95 shadow-xl backdrop-blur-xl">
                      <div className="border-b border-border px-4 py-4 flex items-center gap-3">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt={displayName}
                            className="h-11 w-11 rounded-full object-cover border border-border"
                          />
                        ) : (
                          <div className="h-11 w-11 rounded-full bg-muted flex items-center justify-center">
                            <UserCircle2 className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {displayName}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {user?.email}
                          </p>
                        </div>
                      </div>

                      <div className="p-2">
                        <Link
                          to="/profile"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm text-foreground/85 transition hover:bg-muted"
                        >
                          <UserCircle2 className="h-4 w-4" />
                          <span>Profile</span>
                        </Link>

                        <button
                          type="button"
                          onClick={async () => {
                            setProfileOpen(false);
                            await handleLogout();
                          }}
                          className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm text-red-500 transition hover:bg-red-500/10"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-full transition lg:hidden",
              isHomePage && !scrolled
                ? "text-white hover:bg-white/10"
                : "text-foreground hover:bg-muted",
            )}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {mobileOpen && (
          <div className="lg:hidden pb-4">
            <div
              className={cn(
                "overflow-hidden rounded-3xl border shadow-lg backdrop-blur-2xl",
                isHomePage && !scrolled
                  ? "border-white/15 bg-black/25"
                  : "border-border bg-background/95",
              )}
            >
              <nav className="flex flex-col p-3">
                {isLoggedIn ? renderPrivateMobile() : renderPublicMobile()}

                <div className="mt-3 border-t border-border/60 pt-3">
                  {!isLoggedIn ? (
                    <div className="grid grid-cols-2 gap-2">
                      <Button asChild variant="ghost" className="rounded-2xl">
                        <Link to="/login" onClick={() => setMobileOpen(false)}>
                          Sign in
                        </Link>
                      </Button>
                      <Button asChild className="rounded-2xl">
                        <Link
                          to="/register"
                          onClick={() => setMobileOpen(false)}
                        >
                          Get Started
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link
                        to="/profile"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-foreground/85 transition hover:bg-muted"
                      >
                        <UserCircle2 className="h-[18px] w-[18px]" />
                        <span>Profile</span>
                      </Link>

                      <button
                        type="button"
                        onClick={async () => {
                          setMobileOpen(false);
                          await handleLogout();
                        }}
                        className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-red-500 transition hover:bg-red-500/10"
                      >
                        <LogOut className="h-[18px] w-[18px]" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
