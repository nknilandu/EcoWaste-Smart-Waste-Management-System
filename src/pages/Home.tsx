import { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';
import heroImg from '@/assets/hero-waste.jpg';
import aboutImg from '@/assets/about-waste.jpg';
import { Trash2, BarChart3, Bell, MapPin, ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Zap, Shield, Cpu, Star, CheckCircle2 } from 'lucide-react';

function StatCard({ value, label, icon: Icon }: { value: number; label: string; icon: typeof Trash2 }) {
  const count = useAnimatedCounter(value);
  return (
    <div className="bg-card border rounded-2xl p-6 stat-card hover-lift text-center">
      <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-3">
        <Icon className="h-6 w-6 text-primary-foreground" />
      </div>
      <p className="text-3xl font-bold text-foreground animate-counter">{count}+</p>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

const banners = [
  {
    title: 'Smart Waste Management for Cleaner Cities',
    desc: 'Monitor bins in real-time, optimize collection routes, and empower citizens with a modern waste management platform.',
    cta: 'Get Started Free',
    ctaLink: '/register',
  },
  {
    title: 'IoT-Powered Bin Monitoring',
    desc: 'Simulated sensors track fill levels automatically. Get instant alerts when bins reach capacity — no manual checks needed.',
    cta: 'Explore Features',
    ctaLink: '/register',
  },
  {
    title: 'Connecting Citizens & Collectors',
    desc: 'Report issues, track resolutions, and manage pickups seamlessly — all from a single dashboard for every stakeholder.',
    cta: 'Join Now',
    ctaLink: '/register',
  },
];

export default function HomePage() {
  const [stats, setStats] = useState({ bins: 0, complaints: 0, collections: 0, users: 0 });
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [bannerIdx, setBannerIdx] = useState(0);

  // Auto-slide banners
  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIdx(prev => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prevBanner = useCallback(() => setBannerIdx(prev => (prev - 1 + banners.length) % banners.length), []);
  const nextBanner = useCallback(() => setBannerIdx(prev => (prev + 1) % banners.length), []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('[data-animate]').forEach((el) => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      const [b, c, col, u] = await Promise.all([
        supabase.from('bins').select('id', { count: 'exact', head: true }),
        supabase.from('complaints').select('id', { count: 'exact', head: true }),
        supabase.from('collections').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
      ]);
      setStats({ bins: b.count || 0, complaints: c.count || 0, collections: col.count || 0, users: u.count || 0 });
    };
    fetchStats();
  }, []);

  const features = [
    { icon: Cpu, title: 'IoT Smart Bins', desc: 'Real-time fill level monitoring with simulated IoT sensors and automatic alerts.' },
    { icon: BarChart3, title: 'Live Analytics', desc: 'Data-driven insights for waste collection optimization and route planning.' },
    { icon: Bell, title: 'Instant Alerts', desc: 'Push notifications when bins reach capacity or complaints need attention.' },
    { icon: MapPin, title: 'Area Tracking', desc: 'Area-wise bin management across Gulshan, Banani, Uttara and more.' },
    { icon: Shield, title: 'Role Security', desc: 'Strict role-based access for admins, collectors, and citizens.' },
    { icon: Zap, title: 'Fast & Modern', desc: 'Built with cutting-edge tech for a seamless, responsive experience.' },
  ];

  const steps = [
    { num: '01', title: 'Report Issues', desc: 'Citizens report bin problems or submit complaints through the dashboard.', color: 'from-primary to-primary' },
    { num: '02', title: 'Monitor Bins', desc: 'IoT sensors track fill levels and auto-flag bins approaching capacity.', color: 'from-accent to-accent' },
    { num: '03', title: 'Dispatch Collectors', desc: 'Admins assign optimal collection schedules to available collectors.', color: 'from-primary to-accent' },
    { num: '04', title: 'Resolve & Track', desc: 'Collectors complete pickups with full status tracking and transparency.', color: 'from-accent to-primary' },
  ];

  const faqs = [
    { q: 'How does the smart bin monitoring work?', a: 'Our platform simulates IoT sensors to measure fill levels and transmit data in real-time. Bins automatically change status based on fill percentage and trigger notifications when capacity exceeds 80%.' },
    { q: 'Can citizens report issues directly?', a: 'Yes! Citizens can submit complaints about specific bins, track resolution status, and receive notifications when their issues are resolved.' },
    { q: 'How are waste collectors notified?', a: 'Collectors receive real-time notifications and assigned pickup schedules. They can mark tasks as in-progress or completed directly from their dashboard.' },
    { q: 'What areas are supported?', a: 'We support area-wise bins across major zones including Gulshan, Banani, Uttara, Dhanmondi, Mirpur, and more.' },
    { q: 'Is there a mobile version?', a: 'Our platform is fully responsive and works seamlessly on all devices — phones, tablets, and desktops.' },
  ];

  const testimonials = [
    { name: 'Sarah Johnson', role: 'City Manager, Dhaka North', text: 'EcoWaste reduced our waste collection costs by 35% in just six months. The real-time monitoring is incredible.', rating: 5 },
    { name: 'Mike Rahman', role: 'Environmental Officer', text: 'The IoT simulation gives us actionable data. We can predict when bins will be full before it becomes a problem.', rating: 5 },
    { name: 'Lisa Ahmed', role: 'Citizen, Gulshan', text: 'Reporting bin issues is now effortless. I love the transparency and getting notified when complaints are resolved!', rating: 5 },
    { name: 'Karim Hassan', role: 'Waste Collector', text: 'The collector dashboard makes my job so much easier. I know exactly where to go and what needs attention.', rating: 4 },
  ];

  const sectionClass = (id: string) =>
    `transition-all duration-700 ${visibleSections.has(id) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero with sliding banners */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Smart waste management" className="h-full w-full object-cover" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/30" />
        </div>
        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 text-primary-foreground text-xs font-medium mb-6 animate-fade-in backdrop-blur-sm border border-primary-foreground/10">
              <Zap className="h-3.5 w-3.5" /> Smart IoT-Powered Platform
            </span>
            {/* Sliding banner content */}
            <div className="relative min-h-[220px] md:min-h-[200px]">
              {banners.map((b, i) => (
                <div key={i} className={`absolute inset-0 transition-all duration-700 ${i === bannerIdx ? 'opacity-100 translate-x-0' : i < bannerIdx ? 'opacity-0 -translate-x-full' : 'opacity-0 translate-x-full'}`}>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-[1.1] tracking-tight">
                    {b.title.includes('Cleaner Cities') ? (
                      <>Smart Waste Management for{' '}<span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">Cleaner Cities</span></>
                    ) : b.title.includes('IoT') ? (
                      <><span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">IoT-Powered</span> Bin Monitoring</>
                    ) : (
                      <>Connecting <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">Citizens</span> & Collectors</>
                    )}
                  </h1>
                  <p className="mt-6 text-lg text-primary-foreground/75 max-w-xl leading-relaxed">{b.desc}</p>
                  <div className="mt-8 flex gap-4 flex-wrap">
                    <Link to={b.ctaLink} className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-all hover:shadow-lg hover:shadow-primary/25 text-sm">
                      {b.cta} <ArrowRight className="h-4 w-4" />
                    </Link>
                    <a href="#how-it-works" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-primary-foreground/20 text-primary-foreground font-semibold hover:bg-primary-foreground/10 transition-all backdrop-blur-sm text-sm">
                      See How It Works
                    </a>
                  </div>
                </div>
              ))}
            </div>
            {/* Banner controls */}
            <div className="flex items-center gap-4 mt-6">
              <button onClick={prevBanner} className="p-2 rounded-full border border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex gap-2">
                {banners.map((_, i) => (
                  <button key={i} onClick={() => setBannerIdx(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${i === bannerIdx ? 'w-8 bg-primary-foreground' : 'w-2 bg-primary-foreground/40'}`} />
                ))}
              </div>
              <button onClick={nextBanner} className="p-2 rounded-full border border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="absolute right-10 top-1/4 w-32 h-32 rounded-full bg-primary/10 blur-3xl animate-float hidden lg:block" />
        <div className="absolute right-1/4 bottom-1/4 w-24 h-24 rounded-full bg-accent/10 blur-3xl animate-float hidden lg:block" style={{ animationDelay: '2s' }} />
      </section>

      {/* Stats */}
      <section className="py-16 -mt-12 relative z-10" id="stats" data-animate>
        <div className={`container mx-auto px-4 ${sectionClass('stats')}`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard value={stats.bins || 24} label="Smart Bins" icon={Trash2} />
            <StatCard value={stats.users || 150} label="Active Users" icon={MapPin} />
            <StatCard value={stats.complaints || 45} label="Issues Resolved" icon={Bell} />
            <StatCard value={stats.collections || 120} label="Collections" icon={BarChart3} />
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20" data-animate>
        <div className={`container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${sectionClass('about')}`}>
          <div>
            <span className="section-label">About EcoWaste</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
              Revolutionizing Urban<br />
              <span className="text-gradient">Waste Management</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              EcoWaste is a comprehensive smart waste management platform designed to connect cities, citizens, and waste collectors through an intelligent digital ecosystem.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Using simulated IoT sensors, real-time analytics, and automated scheduling, we help reduce operational costs by up to 40% while dramatically improving environmental outcomes.
            </p>
            <div className="flex flex-col gap-3">
              {['Real-time bin fill level monitoring', 'Automated notification system', 'Role-based access for all stakeholders'].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img src={aboutImg} alt="Waste management team" className="rounded-2xl shadow-xl w-full" loading="lazy" width={1280} height={720} />
            <div className="absolute -bottom-6 -left-6 bg-card border rounded-2xl p-4 shadow-lg hidden md:flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <p className="font-bold text-lg">40%</p>
                <p className="text-xs text-muted-foreground">Cost Reduction</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-secondary/30" id="features" data-animate>
        <div className={`container mx-auto px-4 ${sectionClass('features')}`}>
          <div className="text-center mb-14">
            <span className="section-label">Features</span>
            <h2 className="text-3xl md:text-4xl font-bold">Everything You Need</h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">Powerful tools for every stakeholder in the waste management chain.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-card border rounded-2xl p-6 hover-lift group">
                <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20" data-animate>
        <div className={`container mx-auto px-4 ${sectionClass('how-it-works')}`}>
          <div className="text-center mb-14">
            <span className="section-label">Process</span>
            <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">A simple four-step process to keep your city clean.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="relative text-center group">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${s.color} mb-5 text-primary-foreground font-bold text-xl group-hover:scale-110 transition-transform shadow-lg`}>
                  {s.num}
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-px bg-border" />
                )}
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-secondary/30" id="testimonials" data-animate>
        <div className={`container mx-auto px-4 ${sectionClass('testimonials')}`}>
          <div className="text-center mb-14">
            <span className="section-label">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold">Loved by Communities</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-card border rounded-2xl p-6 hover-lift flex flex-col">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">"{t.text}"</p>
                <div className="mt-4 pt-4 border-t">
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20" id="faq" data-animate>
        <div className={`container mx-auto px-4 max-w-2xl ${sectionClass('faq')}`}>
          <div className="text-center mb-14">
            <span className="section-label">FAQ</span>
            <h2 className="text-3xl md:text-4xl font-bold">Common Questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className="border rounded-xl overflow-hidden bg-card hover:shadow-sm transition-shadow">
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left font-medium hover:bg-secondary/30 transition-colors"
                >
                  <span className="text-sm pr-4">{f.q}</span>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-300 flex-shrink-0 ${faqOpen === i ? 'rotate-180' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${faqOpen === i ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{f.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 bg-secondary/30" data-animate>
        <div className={`container mx-auto px-4 max-w-lg ${sectionClass('contact')}`}>
          <div className="text-center mb-10">
            <span className="section-label">Contact</span>
            <h2 className="text-3xl md:text-4xl font-bold">Get in Touch</h2>
            <p className="text-muted-foreground mt-3">Have questions? We'd love to hear from you.</p>
          </div>
          <form className="bg-card border rounded-2xl p-6 space-y-4 shadow-sm" onSubmit={e => { e.preventDefault(); }}>
            <input placeholder="Your Name" className="w-full px-4 py-3 border rounded-xl bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow" />
            <input placeholder="Your Email" type="email" className="w-full px-4 py-3 border rounded-xl bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow" />
            <textarea placeholder="Your Message" rows={4} className="w-full px-4 py-3 border rounded-xl bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-shadow" />
            <button type="submit" className="w-full py-3 rounded-xl gradient-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="gradient-primary rounded-3xl p-12 md:p-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">Ready to Transform Waste Management?</h2>
            <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">Join thousands of citizens and collectors making cities cleaner with EcoWaste.</p>
            <Link to="/register" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary-foreground text-foreground font-semibold hover:bg-primary-foreground/90 transition-all text-sm">
              Start For Free <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
