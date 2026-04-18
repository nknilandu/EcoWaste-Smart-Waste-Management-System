import { Leaf } from "lucide-react";

export const Logo = ({ light = false }: { light?: boolean }) => (
  <a href="#home" className="flex items-center gap-2 group">
    <div className="relative h-9 w-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow transition-smooth group-hover:scale-105">
      <Leaf className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
    </div>
    <span className={`font-display font-bold text-xl tracking-tight ${light ? "text-white" : "text-foreground"}`}>
      Eco<span className="text-gradient">Waste</span>
    </span>
  </a>
);
