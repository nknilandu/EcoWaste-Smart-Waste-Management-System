import aboutImg from '@/assets/about-waste.jpg';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4 max-w-4xl animate-fade-in-up">
        <h1 className="text-4xl font-bold mb-8 text-gradient">About EcoWaste</h1>
        <img src={aboutImg} alt="About" className="rounded-xl w-full mb-8" loading="lazy" width={1280} height={720} />
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>EcoWaste is a next-generation smart waste management platform that connects cities, citizens, and waste collectors through an intelligent digital ecosystem.</p>
          <p>Our mission is to make cities cleaner and more sustainable by optimizing waste collection using IoT sensors, real-time data analytics, and automated scheduling.</p>
          <p>Founded in 2024, EcoWaste serves communities across the globe, helping reduce operational costs by up to 40% while improving environmental outcomes.</p>
        </div>
      </div>
    </div>
  );
}
