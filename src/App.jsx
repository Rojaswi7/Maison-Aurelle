import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Nav from './components/Nav';
import Footer from './components/Footer';
import { Cursor, Loader, ScrollProgress } from './components/Chrome';
import { ToastProvider } from './components/Toast';
import { scrollToTop, useSmoothScroll } from './lib/smooth';
import Home from './pages/Home';
import Collections from './pages/Collections';
import Configurator from './pages/Configurator';
import Atelier from './pages/Atelier';
import Appointment from './pages/Appointment';
import CaseStudy from './pages/CaseStudy';
import NotFound from './pages/NotFound';

export default function App() {
  const location = useLocation();
  useSmoothScroll();

  return (
    <ToastProvider>
      <div className="app">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Loader />
        <ScrollProgress />
        <Nav />
        <AnimatePresence mode="wait" onExitComplete={scrollToTop}>
          <motion.div key={location.pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }}>
            <main id="main">
              <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/configure" element={<Configurator />} />
              <Route path="/atelier" element={<Atelier />} />
              <Route path="/appointment" element={<Appointment />} />
              <Route path="/case-study" element={<CaseStudy />} />
              <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </motion.div>
        </AnimatePresence>
        <Cursor />
      </div>
    </ToastProvider>
  );
}
