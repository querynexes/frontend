import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import StatsBar from './components/StatsBar';
import PipelineViz from './components/PipelineViz';
import SimulationPlatform from './components/SimulationPlatform';
import FeaturesGrid from './components/FeaturesGrid';
import TechDiagram from './components/TechDiagram';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import CTABanner from './components/CTABanner';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import { useCustomCursor } from './hooks/useCustomCursor';
import { useScrollReveal } from './hooks/useScrollReveal';
import { initAudio, toggleMute } from './utils/audio';

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [muted, setMuted] = useState(() => localStorage.getItem('qn_muted') === 'true');
  const { outerRef, innerRef } = useCustomCursor();

  // Initialize audio on first interaction
  useEffect(() => {
    const handler = () => initAudio();
    document.addEventListener('click', handler, { once: true });
    document.addEventListener('keydown', handler, { once: true });
    return () => {
      document.removeEventListener('click', handler);
      document.removeEventListener('keydown', handler);
    };
  }, []);

  const handleMuteToggle = () => {
    const nowMuted = toggleMute();
    setMuted(nowMuted);
  };

  // Register interactive element hover effects for cursor
  useEffect(() => {
    if (window.innerWidth <= 768) return;
    const outer = outerRef.current;
    if (!outer) return;

    const addHover = () => {
      document.querySelectorAll('a, button, [data-interactive]').forEach(el => {
        el.addEventListener('mouseenter', () => outer.classList.add('hover'));
        el.addEventListener('mouseleave', () => outer.classList.remove('hover'));
      });
    };

    // Delay slightly to let DOM settle
    setTimeout(addHover, 600);
  }, [loaded, outerRef]);

  return (
    <>
      {/* Custom cursor */}
      {typeof window !== 'undefined' && window.innerWidth > 768 && (
        <>
          <div ref={outerRef} className="cursor-outer" />
          <div ref={innerRef} className="cursor-inner" />
        </>
      )}

      {/* Loader */}
      {!loaded && <Loader onComplete={() => setLoaded(true)} />}

      {/* Main site — shown after loader */}
      <div style={{
        opacity: loaded ? 1 : 0,
        transition: 'opacity 0.5s ease',
      }}>
        <ScrollRevealInit />
        <Navbar />
        <HeroSection />
        <StatsBar />
        <PipelineViz />
        <SimulationPlatform />
        <FeaturesGrid />
        <TechDiagram />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CTABanner />
        <AboutSection />
        <ContactSection />
        <Footer />
      </div>

      {/* Mute button */}
      {loaded && (
        <button
          className="mute-btn"
          onClick={handleMuteToggle}
          title={muted ? 'Unmute' : 'Mute'}
        >
          {muted
            ? <VolumeX size={18} strokeWidth={1.5} />
            : <Volume2 size={18} strokeWidth={1.5} />
          }
        </button>
      )}
    </>
  );
}

// Component that initializes scroll reveal after mount
function ScrollRevealInit() {
  useScrollReveal();
  return null;
}
