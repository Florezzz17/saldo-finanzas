import React from 'react';
import { supabase } from '../lib/supabase';
import { Icon } from '../components/Icon';

export function AuthScreen() {
  const [loading, setLoading] = React.useState(false);
  const [error,   setError]   = React.useState(null);

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
    // On success, Supabase redirects to Google → then back here.
    // onAuthStateChange in App.jsx picks up the session automatically.
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(80% 70% at 50% -10%, #e9e9f4 0%, transparent 60%), linear-gradient(180deg, #ededeb 0%, #e3e3e1 100%)',
      padding: 24,
      fontFamily: '"Manrope", -apple-system, system-ui, sans-serif',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 400,
        background: '#fff',
        borderRadius: 32,
        padding: '48px 40px 40px',
        boxShadow: '0 2px 8px rgba(20,22,28,.06), 0 24px 64px rgba(20,22,28,.10)',
        border: '1px solid rgba(20,22,28,.07)',
        textAlign: 'center',
      }}>
        {/* Logo */}
        <div style={{
          width: 64, height: 64, borderRadius: 20,
          background: 'linear-gradient(140deg, #7c74f0, #6359e9)',
          display: 'grid', placeItems: 'center',
          margin: '0 auto 24px',
          boxShadow: '0 8px 20px rgba(99,89,233,.35)',
        }}>
          <Icon name="wallet" size={30} color="#fff" stroke={2} />
        </div>

        <h1 style={{ margin: '0 0 8px', fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', color: '#16181d' }}>
          Bienvenido a Saldo
        </h1>
        <p style={{ margin: '0 0 36px', fontSize: 15, color: '#5c606b', fontWeight: 500, lineHeight: 1.5 }}>
          Tu app de finanzas personales.<br />Inicia sesión para continuar.
        </p>

        {/* Google button */}
        <button
          onClick={signInWithGoogle}
          disabled={loading}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            padding: '14px 20px',
            borderRadius: 16,
            border: '1.5px solid rgba(20,22,28,.12)',
            background: loading ? '#f8f8f6' : '#fff',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: '"Manrope", system-ui, sans-serif',
            fontSize: 15,
            fontWeight: 700,
            color: loading ? '#9a9ea9' : '#16181d',
            transition: 'all .18s ease',
            boxShadow: loading ? 'none' : '0 1px 3px rgba(20,22,28,.06)',
          }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#f9f9f7'; }}
          onMouseLeave={e => { e.currentTarget.style.background = loading ? '#f8f8f6' : '#fff'; }}
        >
          {loading ? (
            <LoadingSpinner />
          ) : (
            <GoogleLogo />
          )}
          {loading ? 'Redirigiendo…' : 'Continuar con Google'}
        </button>

        {error && (
          <div style={{
            marginTop: 16, padding: '10px 14px', borderRadius: 12,
            background: '#fdecea', color: '#ef5b4c',
            fontSize: 13, fontWeight: 600,
          }}>
            {error}
          </div>
        )}

        <p style={{ margin: '28px 0 0', fontSize: 12, color: '#9a9ea9', lineHeight: 1.6 }}>
          Al continuar aceptas nuestros términos de uso.<br />
          Tus datos están protegidos con cifrado de extremo a extremo.
        </p>
      </div>
    </div>
  );
}

function GoogleLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.6 32.8 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.5 0 10.4-2.1 14.1-5.4l-6.5-5.5C29.6 35 26.9 36 24 36c-5.2 0-9.5-3.2-11.2-7.7l-6.5 5C9.6 39.6 16.3 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.9 2.3-2.5 4.3-4.5 5.7l6.5 5.5C43 35.8 44 30.3 44 24c0-1.3-.1-2.6-.4-3.9z"/>
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
         style={{ animation: 'spin 0.8s linear infinite' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
    </svg>
  );
}

export default AuthScreen;
