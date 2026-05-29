/* ui.jsx — shared primitives. Exposes window.{CatIcon, TxRow, BottomNav, Fab, Donut, Bars} */

function CatIcon({ cat, size = 42, radius = 13, iconSize }) {
  const color = cat ? cat.color : "#888";
  return (
    <div className="cat-ico" style={{
      width: size, height: size, borderRadius: radius,
      background: color + "22", color,
    }}>
      <Icon name={cat ? cat.icon : "dots"} size={iconSize || Math.round(size * 0.5)} stroke={2} />
    </div>
  );
}

function TxRow({ tx, cat, onClick }) {
  const { fmt, relDay } = useStore();
  const income = tx.type === "income";
  return (
    <div className="tx-row tap" onClick={onClick}>
      <CatIcon cat={cat} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="tx-name" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tx.name || (cat ? cat.name : "Movimiento")}</div>
        <div className="tx-meta">{tx.note ? tx.note : (cat ? cat.name : "")} · {relDay(tx.date)}</div>
      </div>
      <div className="tx-amt num" style={{ color: income ? "var(--income)" : "var(--text)" }}>
        {income ? "+" : "–"}{fmt.full(tx.amount).replace(/^-/, "")}
      </div>
    </div>
  );
}

const NAV = [
  { id: "home",  label: "Inicio",       icon: "home" },
  { id: "movs",  label: "Movimientos",  icon: "list" },
  { id: "cats",  label: "Categorías",   icon: "grid" },
  { id: "stats", label: "Estadísticas", icon: "chart" },
  { id: "config",label: "Ajustes",      icon: "settings" },
];

function BottomNav({ active, onChange }) {
  return (
    <nav className="tabbar">
      {NAV.map(n => (
        <button key={n.id} className={"tab" + (active === n.id ? " active" : "")} onClick={() => onChange(n.id)}>
          <Icon name={n.icon} size={23} stroke={active === n.id ? 2.4 : 2} />
          <span>{n.label}</span>
        </button>
      ))}
    </nav>
  );
}

function Fab({ onClick }) {
  return (
    <button className="fab" onClick={onClick} aria-label="Agregar movimiento">
      <Icon name="plus" size={28} stroke={2.6} />
    </button>
  );
}

/* Bottom sheet: rendered at its final visible state on first paint, so no
   entrance transition can be left frozen by a throttled environment.
   children is a render-prop receiving a `close` fn. */
function Sheet({ onClose, children }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()}>
        {children(onClose)}
      </div>
    </div>
  );
}

/* ── Donut chart (SVG). data: [{label,value,color}] ── */
function Donut({ data, size = 168, thickness = 22, children }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = (size - thickness) / 2;
  const cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--surface-3)" strokeWidth={thickness} />
        {data.map((d, i) => {
          const frac = d.value / total;
          const len = frac * circ;
          const seg = (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={d.color}
              strokeWidth={thickness} strokeLinecap="round"
              strokeDasharray={`${Math.max(len - 3, 0)} ${circ - Math.max(len - 3, 0)}`}
              strokeDashoffset={-offset}
              style={{ transition: "stroke-dasharray .7s cubic-bezier(.2,.8,.2,1)" }} />
          );
          offset += len;
          return seg;
        })}
      </svg>
      <div className="donut-center">{children}</div>
    </div>
  );
}

/* ── Grouped bar chart for monthly comparison ── */
function Bars({ data, max, height = 130, fmtFn }) {
  const peak = max || Math.max(...data.flatMap(d => [d.income, d.expense])) || 1;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height, paddingTop: 8 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 3, width: "100%", justifyContent: "center" }}>
            <div title="Ingresos" style={{ width: "42%", maxWidth: 16, height: `${(d.income / peak) * 100}%`, background: "var(--income)", borderRadius: "5px 5px 0 0", transition: "height .7s cubic-bezier(.2,.8,.2,1)" }} />
            <div title="Gastos" style={{ width: "42%", maxWidth: 16, height: `${(d.expense / peak) * 100}%`, background: "var(--expense)", borderRadius: "5px 5px 0 0", transition: "height .7s cubic-bezier(.2,.8,.2,1)" }} />
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: d.current ? "var(--text)" : "var(--text-3)" }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { CatIcon, TxRow, BottomNav, Fab, Sheet, Donut, Bars });
