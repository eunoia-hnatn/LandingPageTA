import Header from '@user/components/Header';
import Footer from '@user/components/Footer';
import FloatingCTA from '@user/components/FloatingCTA';
import Hero from '@user/sections/Hero';
import TrustBar from '@user/sections/TrustBar';
import AboutValues from '@user/sections/AboutValues';
import TechShowcase from '@user/sections/TechShowcase';
import PainPoints from '@user/sections/PainPoints';
import ProcessSteps from '@user/sections/ProcessSteps';
import Courses from '@user/sections/Courses';
import Instructors from '@user/sections/Instructors';
import Testimonials from '@user/sections/Testimonials';
import Commitment from '@user/sections/Commitment';
import FAQ from '@user/sections/FAQ';
import MapContact from '@user/sections/MapContact';
import { useSmoothScroll } from '@user/hooks/useSmoothScroll';
import { Seo } from '@/shared/components/Seo';

// Port 1:1 từ docs/design export/code.html — thứ tự & id khớp đúng export.
// Form/nút hiện là UI tĩnh; nối <LeadForm>/submit-lead/useSiteContent thật ở lượt "logic" sau.
export default function LandingPage() {
  useSmoothScroll();

  return (
    <div className="min-h-screen bg-surface" id="top">
      <Seo routeKey="/" />
      <Header />
      <main className="w-full bg-surface">
        <div className="flex flex-col w-full">
          <Hero />
          <TrustBar />
          <AboutValues />
          <TechShowcase />
          <PainPoints />
          <ProcessSteps />
          <Courses />
          <Instructors />
          <Testimonials />
          <Commitment />
          <FAQ />
          <MapContact />
        </div>
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}
