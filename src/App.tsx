import { useState, useEffect, lazy, Suspense } from 'react';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import Footer from './components/Footer';
import ChatwootWidget from './components/ChatwootWidget';
import CookieConsent from './components/CookieConsent';
import { useCustomCursor } from './hooks/useCustomCursor';
import { useScrollReveal } from './hooks/useScrollReveal';
import { initAudio, toggleMute } from './utils/audio';

const StatsBar = lazy(() => import('./components/StatsBar'));
const PipelineViz = lazy(() => import('./components/PipelineViz'));
const SimulationPlatform = lazy(() => import('./components/SimulationPlatform'));
const FeaturesGrid = lazy(() => import('./components/FeaturesGrid'));
const TechDiagram = lazy(() => import('./components/TechDiagram'));
const Pricing = lazy(() => import('./components/Pricing'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const FAQ = lazy(() => import('./components/FAQ'));
const CTABanner = lazy(() => import('./components/CTABanner'));
const AboutSection = lazy(() => import('./components/AboutSection'));
const ContactSection = lazy(() => import('./components/ContactSection'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsConditions = lazy(() => import('./pages/TermsConditions'));

type Page = 'home' | 'product' | 'privacy' | 'terms';

const PATH_MAP: Record<string, Page> = {
  '/product': 'product',
  '/Product': 'product',
  '/privacy': 'privacy',
  '/terms': 'terms',
};

const pathToPage = (): Page => PATH_MAP[window.location.pathname.toLowerCase()] || 'home';

const pageToPath = (page: Page): string => {
  if (page === 'home') return '/';
  if (page === 'product') return '/Product';
  return `/${page}`;
};

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [muted, setMuted] = useState(true); // always start muted on every page load
  const [page, setPage] = useState<Page>(() =>
    typeof window !== 'undefined' ? pathToPage() : 'home'
  );
  const { outerRef, innerRef } = useCustomCursor();

  const navigate = (target: Page) => {
    window.scrollTo(0, 0);
    setPage(target);
    window.history.pushState({ page: target }, '', pageToPath(target));
  };

  useEffect(() => {
    const handlePopState = () => setPage(pathToPage());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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

  // Register interactive element hover effects for cursor (event delegation)
  useEffect(() => {
    if (window.innerWidth <= 768) return;
    const outer = outerRef.current;
    if (!outer) return;

    const onEnter = () => outer.classList.add('hover');
    const onLeave = () => outer.classList.remove('hover');

    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.matches('a, button, [data-interactive], a *, button *')) {
        if (e.type === 'mouseover') onEnter();
        else onLeave();
      }
    };

    document.addEventListener('mouseover', handler, { passive: true });
    document.addEventListener('mouseout', handler, { passive: true });

    return () => {
      document.removeEventListener('mouseover', handler);
      document.removeEventListener('mouseout', handler);
    };
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
        <Suspense fallback={null}>
        {page === 'product' ? (
          <ProductPage onNavigate={navigate} muted={muted} onMuteToggle={handleMuteToggle} />
        ) : page === 'privacy' ? (
          <PrivacyPolicy onNavigate={navigate} muted={muted} onMuteToggle={handleMuteToggle} />
        ) : page === 'terms' ? (
          <TermsConditions onNavigate={navigate} muted={muted} onMuteToggle={handleMuteToggle} />
        ) : (
          <>
            <ScrollRevealInit />
            <Navbar currentPage="home" onNavigate={navigate} muted={muted} onMuteToggle={handleMuteToggle} />
            <HeroSection onNavigate={navigate} />
            <StatsBar />
            <PipelineViz />
            <SimulationPlatform />
            <FeaturesGrid />
            <TechDiagram />
            <Pricing />
            <Testimonials />
            <FAQ />
            <AboutSection />
            <ContactSection />
            <CTABanner />
            <Footer onNavigate={navigate} />
            <ChatwootWidget />
            <CookieConsent />
          </>
        )}
        </Suspense>
      </div>
    </>
  );
}

// Component that initializes scroll reveal after mount
function ScrollRevealInit() {
  useScrollReveal();
  return null;
}
