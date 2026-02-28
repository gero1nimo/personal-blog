import Hero from '../components/Hero';
import FeaturedProjectBanner from '../components/FeaturedProjectBanner';
import SkillsSection from '../components/SkillsSection';
import ContactSection from '../components/ContactSection';

const Home = () => {
  return (
    <div className="bg-black">
      {/* Hero Section */}
      <Hero />

      {/* Featured Project Banner */}
      <FeaturedProjectBanner />

      {/* Skills Section */}
      <SkillsSection />

      {/* Contact Section */}
      <ContactSection />
    </div>
  );
};

export default Home;
