import { AppProvider, useApp } from './AppContext';
import { DemoPanel } from './components/DemoPanel';
import { Generator } from './components/Generator';
import { Footer, Nav, Toasts } from './components/Layout';
import { PageHeader } from './components/Ui';
import { Dashboard } from './pages/Dashboard';
import { Experiments } from './pages/Experiments';
import { Home } from './pages/Home';
import { Playbook } from './pages/Playbook';
import { Register } from './pages/Register';
import { Worklog } from './pages/Worklog';
import { useEffect } from 'react';

const TITLES: Record<string, string> = {
  home: 'AI Sprint — Your First AI Project Starts Here',
  generate: 'Find Your First AI Project · AI Sprint',
  register: 'Register Free · AI Sprint',
  dashboard: 'Demo Dashboard · AI Sprint',
  playbook: 'Growth Playbook · AI Sprint',
  experiments: 'Growth Experiments · AI Sprint',
  worklog: 'AI Worklog · AI Sprint',
};

function Shell() {
  const { route } = useApp();
  useEffect(() => { document.title = TITLES[route]; }, [route]);
  return (
    <div className="min-h-screen">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-lime-400 focus:px-3 focus:py-2 focus:text-ink-950">Skip to content</a>
      <Nav />
      <main id="main" key={route}>
        {route === 'home' && <Home />}
        {route === 'generate' && (
          <div className="container-x">
            <PageHeader eyebrow="Project generator" title="Find Your First AI Project">
              Four quick choices. One beginner-friendly project matched to you — with steps, stack and what you could learn in 60 minutes.
            </PageHeader>
            <Generator />
          </div>
        )}
        {route === 'register' && <Register />}
        {route === 'dashboard' && <Dashboard />}
        {route === 'playbook' && <Playbook />}
        {route === 'experiments' && <Experiments />}
        {route === 'worklog' && <Worklog />}
      </main>
      <Footer />
      <DemoPanel />
      <Toasts />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
