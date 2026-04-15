import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg mb-3">
              <span className="text-2xl">♻️</span>
              <span className="text-gradient font-extrabold tracking-tight">EcoWaste</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">Smart waste management for cleaner, greener, and more sustainable cities.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm">Quick Links</h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm">Platform</h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Login</Link>
              <Link to="/register" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Register</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm">Contact</h4>
            <p className="text-sm text-muted-foreground">hello@ecowaste.io</p>
            <p className="text-sm text-muted-foreground mt-1">+880 1700-000000</p>
            <p className="text-sm text-muted-foreground mt-1">Dhaka, Bangladesh</p>
          </div>
        </div>
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} EcoWaste. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
