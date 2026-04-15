import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import NotificationBell from './NotificationBell';
import { Menu, X, LogOut, User, Home, Info, Phone, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, profile, role, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const dashboardPath = role === 'admin' ? '/admin' : role === 'collector' ? '/collector' : '/dashboard';

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const avatarUrl = profile?.avatar_url;

  const isActive = (path: string) => location.pathname === path;
  const linkClass = (path: string) =>
    `text-sm font-medium transition-colors ${isActive(path) ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`;

  return (
    <nav className="sticky top-0 z-50 glass border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg group">
          <span className="text-2xl group-hover:scale-110 transition-transform">♻️</span>
          <span className="text-gradient font-extrabold tracking-tight">EcoWaste</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {!user ? (
            <>
              <Link to="/" className={`px-3 py-2 rounded-lg hover:bg-secondary/60 ${linkClass('/')}`}>Home</Link>
              <Link to="/about" className={`px-3 py-2 rounded-lg hover:bg-secondary/60 ${linkClass('/about')}`}>About</Link>
              <Link to="/contact" className={`px-3 py-2 rounded-lg hover:bg-secondary/60 ${linkClass('/contact')}`}>Contact</Link>
              <div className="w-px h-6 bg-border mx-2" />
              <Link to="/login" className="text-sm font-medium gradient-primary text-primary-foreground px-5 py-2 rounded-lg hover:opacity-90 transition-opacity">
                Login
              </Link>
              <Link to="/register" className="text-sm font-medium border border-primary text-primary px-5 py-2 rounded-lg hover:bg-secondary transition-colors ml-1">
                Register
              </Link>
            </>
          ) : (
            <>
              <Link to="/" className={`px-3 py-2 rounded-lg hover:bg-secondary/60 ${linkClass('/')}`}>
                <span className="flex items-center gap-1.5"><Home className="h-4 w-4" /> Home</span>
              </Link>
              <Link to={dashboardPath} className={`px-3 py-2 rounded-lg hover:bg-secondary/60 ${linkClass(dashboardPath)}`}>
                <span className="flex items-center gap-1.5"><LayoutDashboard className="h-4 w-4" /> Dashboard</span>
              </Link>
              <div className="w-px h-6 bg-border mx-2" />
              <NotificationBell />
              <Link to="/profile" className="flex items-center gap-2 ml-1">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="h-8 w-8 rounded-full object-cover border-2 border-primary/30 hover:border-primary transition-colors" />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </Link>
              <button onClick={handleLogout} className="text-sm text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-destructive/10 ml-1">
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t bg-card animate-fade-in">
          <div className="flex flex-col p-4 gap-1">
            {!user ? (
              <>
                <Link to="/" onClick={() => setOpen(false)} className="py-2.5 px-3 text-sm rounded-lg hover:bg-secondary">Home</Link>
                <Link to="/about" onClick={() => setOpen(false)} className="py-2.5 px-3 text-sm rounded-lg hover:bg-secondary">About</Link>
                <Link to="/contact" onClick={() => setOpen(false)} className="py-2.5 px-3 text-sm rounded-lg hover:bg-secondary">Contact</Link>
                <div className="border-t my-2" />
                <Link to="/login" onClick={() => setOpen(false)} className="py-2.5 px-3 text-sm text-primary font-medium rounded-lg hover:bg-secondary">Login</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="py-2.5 px-3 text-sm text-primary font-medium rounded-lg hover:bg-secondary">Register</Link>
              </>
            ) : (
              <>
                <Link to="/" onClick={() => setOpen(false)} className="py-2.5 px-3 text-sm rounded-lg hover:bg-secondary flex items-center gap-2"><Home className="h-4 w-4" /> Home</Link>
                <Link to={dashboardPath} onClick={() => setOpen(false)} className="py-2.5 px-3 text-sm rounded-lg hover:bg-secondary flex items-center gap-2"><LayoutDashboard className="h-4 w-4" /> Dashboard</Link>
                <Link to="/profile" onClick={() => setOpen(false)} className="py-2.5 px-3 text-sm rounded-lg hover:bg-secondary flex items-center gap-2"><User className="h-4 w-4" /> Profile</Link>
                <div className="border-t my-2" />
                <button onClick={() => { handleLogout(); setOpen(false); }} className="py-2.5 px-3 text-sm text-destructive text-left rounded-lg hover:bg-destructive/10 flex items-center gap-2"><LogOut className="h-4 w-4" /> Logout</button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
