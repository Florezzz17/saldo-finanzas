import React from 'react';
import { supabase }       from './lib/supabase';
import { StoreProvider }  from './store/StoreContext';
import { BottomNav, Fab } from './components/ui';
import { AuthScreen }     from './screens/AuthScreen';
import { Dashboard }      from './screens/Dashboard';
import { AddSheet }       from './screens/AddSheet';
import { Movimientos }    from './screens/Movimientos';
import { Categorias }     from './screens/Categorias';
import { Estadisticas }   from './screens/Estadisticas';
import { Metas }          from './screens/Metas';
import { Configuracion }  from './screens/Configuracion';

const DEFAULTS = { dark: false, accent: "#6359e9", currency: "USD", font: "Manrope" };
const FONT_STACK = {
  Manrope: '"Manrope", -apple-system, system-ui, sans-serif',
  Sistema: '-apple-system, "SF Pro", system-ui, sans-serif',
};

/* ── Loading screen ──────────────────────────────────────── */
function LoadingScreen({ dark }) {
  return (
    <div style={{
      minHeight: '100vh', display: 'grid', placeItems: 'center',
      background: dark ? '#0e1014' : '#f0f0ee',
      fontFamily: '"Manrope", system-ui, sans-serif',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 52, height: 52, borderRadius: 16,
          background: 'linear-gradient(140deg, #7c74f0, #6359e9)',
          display: 'grid', placeItems: 'center', margin: '0 auto 16px',
          boxShadow: '0 8px 20px rgba(99,89,233,.3)',
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v0H5"/>
            <rect x="3" y="7" width="18" height="13" rx="3"/>
            <circle cx="16.5" cy="13.5" r="1.4"/>
          </svg>
        </div>
        <p style={{ color: dark ? '#6b7280' : '#9a9ea9', fontSize: 14, fontWeight: 600, margin: 0 }}>
          Cargando…
        </p>
      </div>
    </div>
  );
}

/* ── Main app content (authenticated) ───────────────────── */
function AppContent({ t, setTweak }) {
  const [tab,   setTab]   = React.useState('home');
  const [sheet, setSheet] = React.useState(null);

  const openAdd    = () => setSheet({ editing: null });
  const openTx     = (tx) => setSheet({ editing: tx });
  const closeSheet = () => setSheet(null);

  const showFab = tab === 'home' || tab === 'movs';

  let screen;
  if      (tab === 'home')  screen = <Dashboard onAdd={openAdd} onGoto={setTab} onOpenTx={openTx} />;
  else if (tab === 'movs')  screen = <Movimientos onOpenTx={openTx} />;
  else if (tab === 'cats')  screen = <Categorias />;
  else if (tab === 'stats') screen = <Estadisticas />;
  else if (tab === 'metas') screen = <Metas />;
  else screen = (
    <Configuracion
      dark={t.dark}         setDark={v => setTweak('dark', v)}
      currency={t.currency} setCurrency={v => setTweak('currency', v)}
      accent={t.accent}     setAccent={v => setTweak('accent', v)}
    />
  );

  return (
    <div className="app" data-theme={t.dark ? 'dark' : undefined}
         style={{ '--accent': t.accent, '--font': FONT_STACK[t.font] || FONT_STACK.Manrope }}>
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-logo">S</span>
          Saldo
        </div>
        <BottomNav active={tab} onChange={setTab} />
      </aside>

      <div className="main">
        <div className="scroll" key={tab}>
          <div className="content-wrap">
            {screen}
          </div>
        </div>
      </div>

      {showFab && <Fab onClick={openAdd} />}
      {sheet && <AddSheet editing={sheet.editing} onClose={closeSheet} />}
    </div>
  );
}

/* ── Root: handles auth state ────────────────────────────── */
export default function App() {
  const [session, setSession] = React.useState(undefined); // undefined = still loading
  const [t, setT]             = React.useState(DEFAULTS);
  const setTweak              = (key, val) => setT(prev => ({ ...prev, [key]: val }));

  React.useEffect(() => {
    /* onAuthStateChange fires immediately with existing session
       and handles the implicit flow token in the URL hash */
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (session === undefined) return <LoadingScreen dark={t.dark} />;
  if (!session)              return <AuthScreen />;

  return (
    <StoreProvider currency={t.currency} user={session.user}>
      <AppContent t={t} setTweak={setTweak} />
    </StoreProvider>
  );
}
