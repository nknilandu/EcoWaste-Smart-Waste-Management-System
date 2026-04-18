import { Logo } from "./eco/Logo";
import { Twitter, Linkedin, Github } from "lucide-react";

const cols = [
  {
    title: "Product",
    links: [
      { title: "About US", link: "#about" },
      { title: "Features", link: "#features" },
      { title: "How it Works", link: "#how" },
      { title: "Vision", link: "#vision" },
    ],
  },
  {
    title: "Platform",
    links: [
      { title: "Login", link: "/login" },
      { title: "Register", link: "/register" },
      { title: "profile", link: "/profile" },
    ],
  },
  {
    title: "Contact Us",
    links: [
      { title: "Green University of Bangladesh", link: "https://green.edu.bd/" },
      { title: "231902031@student.green.ac.bd", link: "#" },
      { title: "Dhaka, Bangladesh", link: "#" },
    ],
  },
];

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-16">
        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <Logo />
            <p className="text-sm text-muted-foreground mt-4 max-w-xs leading-relaxed">
              Smart waste management for cleaner, greener, and more sustainable cities.
            </p>

            <div className="flex gap-3 mt-6">
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-gradient-primary hover:text-primary-foreground transition-smooth"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="font-display font-bold mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((item, index) => (
                  <li key={index}>
                    <a
                      href={item.link}
                      className="text-sm text-muted-foreground hover:text-primary transition-smooth"
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © 2026 EcoWaste. All rights reserved.
          </p>

          <div className="flex gap-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-primary transition-smooth">
              Privacy
            </a>
            <a href="#" className="hover:text-primary transition-smooth">
              Terms
            </a>
            <a href="#" className="hover:text-primary transition-smooth">
              Security
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};