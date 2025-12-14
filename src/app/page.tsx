import AboutCoachSection from './section/AboutCoachSection';
import AboutTeaser from './section/AboutTeaser';
import ExplodingCTA from './section/ExplodingCTA';
import Footer from './section/Footer';
import HeroSection from './section/HeroSection';
import Marquee from './section/Marquee';
import ProcessAndPricing from './section/ProcessAndPricing';
import ReviewSection from "./section/ReviewSection";
// import AboutSection from '@/components/AboutSection';
// import PricingSection from '@/components/PricingSection';
// import ReviewsSection from '@/components/ReviewsSection';
// import FooterCTA from '@/components/FooterCTA';

export default function Home() {
  return (
    <div className="bg-slate-950 text-white selection:bg-red-600 selection:text-white overflow-x-hidden">
      <HeroSection />
      <AboutTeaser/>
      <Marquee/>
      <AboutCoachSection/>
      <ProcessAndPricing/>
     <ReviewSection/>
     <ExplodingCTA/>
     <Footer/>
      {/* <AboutSection />
      <PricingSection />
      <ReviewsSection />
      <FooterCTA /> */}
    </div>
  );
}