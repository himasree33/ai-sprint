import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  clearState, initialState, loadState, markShared, parseCampaignParams, saveState,
  type AppState,
} from './lib/store';
import type { Channel } from './lib/campaign';

export type Route = 'home' | 'generate' | 'register' | 'dashboard' | 'playbook' | 'experiments' | 'worklog';
export const ROUTES: Route[] = ['home', 'generate', 'register', 'dashboard', 'playbook', 'experiments', 'worklog'];

interface Toast { id: number; text: string; tone: 'ok' | 'err' }

interface Ctx {
  state: AppState;
  update: (fn: (s: AppState) => AppState) => void;
  route: Route;
  navigate: (r: Route, anchor?: string) => void;
  pendingRef?: string;
  pendingChannel?: Channel;
  toast: (text: string, tone?: 'ok' | 'err') => void;
  toasts: Toast[];
  copy: (text: string, label: string) => Promise<void>;
  share: (code: string) => void;
  recordGenerate: () => void;
  reset: () => void;
  baseUrl: string;
}

const AppCtx = createContext<Ctx | null>(null);

function readRoute(): Route {
  const h = window.location.hash.replace(/^#\/?/, '').split(/[?#]/)[0];
  return (ROUTES as string[]).includes(h) ? (h as Route) : 'home';
}

function ss(key: string, value?: string): string | undefined {
  try {
    if (value !== undefined) sessionStorage.setItem(key, value);
    return sessionStorage.getItem(key) ?? undefined;
  } catch {
    return undefined;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState());
  const [route, setRoute] = useState<Route>(readRoute);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [pending, setPending] = useState<{ ref?: string; channel?: Channel }>(() => {
    // Preserve ?ref / ?ch for the whole session, even after navigating between views.
    const fromUrl = parseCampaignParams(window.location.search);
    if (fromUrl.ref) ss('pendingRef', fromUrl.ref);
    if (fromUrl.channel) ss('pendingChannel', fromUrl.channel);
    return { ref: ss('pendingRef'), channel: ss('pendingChannel') as Channel | undefined };
  });
  const toastId = useRef(0);

  useEffect(() => saveState(state), [state]);

  // Count one visit per browser session.
  useEffect(() => {
    if (!ss('visited')) {
      ss('visited', '1');
      setState((s) => ({ ...s, visitSessions: s.visitSessions + 1 }));
    }
  }, []);

  useEffect(() => {
    const onHash = () => {
      setRoute(readRoute());
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const update = useCallback((fn: (s: AppState) => AppState) => setState((s) => fn(s)), []);

  const toast = useCallback((text: string, tone: 'ok' | 'err' = 'ok') => {
    const id = ++toastId.current;
    setToasts((t) => [...t, { id, text, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);

  const navigate = useCallback((r: Route, anchor?: string) => {
    const target = r === 'home' ? '#/' : `#/${r}`;
    if (window.location.hash !== target) window.location.hash = target;
    setRoute(r);
    requestAnimationFrame(() => {
      if (anchor) document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }, []);

  const copy = useCallback(async (text: string, label: string) => {
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
      else {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      toast(`${label} copied to clipboard`);
    } catch {
      toast(`Could not copy ${label.toLowerCase()} — please copy it manually`, 'err');
    }
  }, [toast]);

  const share = useCallback((code: string) => setState((s) => markShared(s, code)), []);

  const recordGenerate = useCallback(() => {
    if (!ss('generated')) {
      ss('generated', '1');
      setState((s) => ({ ...s, generatorSessions: s.generatorSessions + 1 }));
    }
  }, []);

  const reset = useCallback(() => {
    clearState();
    // Strip ?ref from URL so the demo starts clean.
    window.history.replaceState(null, '', window.location.pathname + '#/');
    setPending({});
    ss('visited', '1');
    setState({ ...initialState(), visitSessions: 1 });
    setRoute('home');
    toast('Local demo data reset');
  }, [toast]);

  const baseUrl = `${window.location.origin}${window.location.pathname}`;

  const value = useMemo<Ctx>(() => ({
    state, update, route, navigate, toast, toasts, copy, share, recordGenerate, reset, baseUrl,
    pendingRef: pending.ref, pendingChannel: pending.channel,
  }), [state, update, route, navigate, toast, toasts, copy, share, recordGenerate, reset, baseUrl, pending]);

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp(): Ctx {
  const c = useContext(AppCtx);
  if (!c) throw new Error('useApp must be used inside AppProvider');
  return c;
}
