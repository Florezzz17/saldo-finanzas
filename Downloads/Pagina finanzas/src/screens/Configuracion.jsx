import React from 'react';
import { Icon }               from '../components/Icon';
import { useStore }           from '../store/StoreContext';
import { supabase }           from '../lib/supabase';
import { exportCSV, exportPDF } from '../lib/export';

function Switch({ on, onClick }) {
  return <div className={"switch" + (on ? " on" : "")} onClick={onClick} />;
}

function SetRow({ icon, color, label, val, right, onClick }) {
  return (
    <div className="set-row" onClick={onClick}>
      <div style={{ width: 34, height: 34, borderRadius: 10, background: (color || "#888") + "22", color: color || "var(--text-2)", display: "grid", placeItems: "center", flexShrink: 0 }}>
        <Icon name={icon} size={19} stroke={2} />
      </div>
      <span className="set-label">{label}</span>
      {val && <span className="set-val">{val}</span>}
      {right !== undefined ? right : <Icon name="chevR" size={18} stroke={2.2} color="var(--text-3)" />}
    </div>
  );
}

const ACCENTS = ["#6359e9", "#0ea5a4", "#f59e0b", "#e85ca0", "#3b82f6"];

export function Configuracion({ dark, setDark, currency, setCurrency, accent, setAccent }) {
  const { user, txs, catMap, balance } = useStore();
  const [faceId, setFaceId]  = React.useState(true);
  const [notif,  setNotif]   = React.useState(true);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleExportCSV = () => exportCSV(txs, catMap);
  const handleExportPDF = () => exportPDF(txs, catMap, balance, currency);

  const displayName  = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || "Usuario";
  const initials     = displayName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="screen-enter">
      <div className="screen-head">
        <h2 className="screen-title">Ajustes</h2>
      </div>

      <div className="pad">
        <div className="card" style={{ padding: 16, display: "flex", alignItems: "center", gap: 14 }}>
          {user?.user_metadata?.avatar_url
            ? <img src={user.user_metadata.avatar_url} alt="" style={{ width: 54, height: 54, borderRadius: "50%", objectFit: "cover" }} />
            : <div style={{ width: 54, height: 54, borderRadius: "50%", background: "linear-gradient(140deg, var(--accent), color-mix(in oklch, var(--accent) 60%, black))", display: "grid", placeItems: "center", color: "#fff", fontWeight: 800, fontSize: 20 }}>{initials}</div>
          }
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 750 }}>{displayName}</div>
            <div style={{ fontSize: 13, color: "var(--text-3)", fontWeight: 550 }}>{user?.email}</div>
          </div>
          <button className="btn-ghost" style={{ padding: "8px 14px" }}>Editar</button>
        </div>
      </div>

      <div className="pad" style={{ marginTop: 18 }}>
        <div className="eyebrow" style={{ marginBottom: 9, marginLeft: 4 }}>Apariencia</div>
        <div className="set-group">
          <SetRow icon={dark ? "moon" : "sun"} color="var(--accent)" label="Tema oscuro" right={<Switch on={dark} onClick={() => setDark(!dark)} />} />
          <SetRow icon="globe" color="#4b8df0" label="Moneda" val={currency === "USD" ? "Dólar (USD)" : "Peso (COP)"} onClick={() => setCurrency(currency === "USD" ? "COP" : "USD")} right={
            <div className="seg" style={{ padding: 3, gap: 2 }} onClick={e => e.stopPropagation()}>
              {["USD", "COP"].map(c => (
                <button key={c} onClick={() => setCurrency(c)} style={{ padding: "5px 11px", borderRadius: 9, fontSize: 13, border: "none", cursor: "pointer", fontFamily: "var(--font)", fontWeight: 700, background: currency === c ? "var(--surface)" : "transparent", color: currency === c ? "var(--text)" : "var(--text-3)", boxShadow: currency === c ? "var(--shadow-sm)" : "none" }}>{c}</button>
              ))}
            </div>
          } />
          <div className="set-row" style={{ cursor: "default" }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: accent + "22", color: accent, display: "grid", placeItems: "center", flexShrink: 0 }}>
              <Icon name="bolt" size={19} stroke={2} />
            </div>
            <span className="set-label">Color de acento</span>
            <div style={{ display: "flex", gap: 9 }}>
              {ACCENTS.map(c => (
                <div key={c} className="tap" onClick={() => setAccent(c)} style={{ width: 24, height: 24, borderRadius: "50%", background: c, cursor: "pointer", boxShadow: accent === c ? "0 0 0 2px var(--surface), 0 0 0 4px " + c : "inset 0 0 0 1px rgba(0,0,0,.08)" }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pad" style={{ marginTop: 18 }}>
        <div className="eyebrow" style={{ marginBottom: 9, marginLeft: 4 }}>Datos</div>
        <div className="set-group">
          <SetRow icon="download" color="#11a36b" label="Exportar CSV" val="Excel" onClick={handleExportCSV} />
          <SetRow icon="download" color="#7c6cf0" label="Exportar PDF" val="Informe" onClick={handleExportPDF} />
          <SetRow icon="cloud"    color="#00b3c4" label="Copia de seguridad"    val="Hoy, 9:41" />
        </div>
      </div>

      <div className="pad" style={{ marginTop: 18 }}>
        <div className="eyebrow" style={{ marginBottom: 9, marginLeft: 4 }}>Seguridad</div>
        <div className="set-group">
          <SetRow icon="shield" color="#7c6cf0" label="Bloqueo con Face ID" right={<Switch on={faceId} onClick={() => setFaceId(!faceId)} />} />
          <SetRow icon="card"   color="#d4a23a" label="Cambiar PIN" />
        </div>
      </div>

      <div className="pad" style={{ marginTop: 18 }}>
        <div className="eyebrow" style={{ marginBottom: 9, marginLeft: 4 }}>General</div>
        <div className="set-group">
          <SetRow icon="bell"   color="#f0883e"        label="Notificaciones" right={<Switch on={notif} onClick={() => setNotif(!notif)} />} />
          <SetRow icon="user"   color="#4b8df0"        label="Cuenta" />
          <SetRow icon="logout" color="var(--expense)" label="Cerrar sesión" right={<span />} onClick={handleLogout} />
        </div>
      </div>

      <div className="pad" style={{ textAlign: "center", marginTop: 22, color: "var(--text-3)", fontSize: 12, fontWeight: 600 }}>
        Saldo · versión 1.0.0
      </div>
    </div>
  );
}

export default Configuracion;
