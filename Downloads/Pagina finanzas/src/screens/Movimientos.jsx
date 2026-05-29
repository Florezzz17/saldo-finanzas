import React from 'react';
import { useStore } from '../store/StoreContext';
import { Icon } from '../components/Icon';
import { TxRow } from '../components/ui';

export function Movimientos({ onOpenTx }) {
  const { txs, catMap, cats, fmt, fullDay } = useStore();
  const [q,        setQ]        = React.useState("");
  const [type,     setType]     = React.useState("all");
  const [catId,    setCatId]    = React.useState("all");
  const [showCats, setShowCats] = React.useState(false);

  const filtered = txs.filter(t => {
    if (type !== "all" && t.type !== type) return false;
    if (catId !== "all" && t.cat !== catId) return false;
    if (q.trim()) {
      const s  = q.toLowerCase();
      const cn = catMap[t.cat]?.name.toLowerCase() || "";
      if (!t.name.toLowerCase().includes(s) && !(t.note || "").toLowerCase().includes(s) && !cn.includes(s)) return false;
    }
    return true;
  });

  const total = filtered.reduce((s, t) => s + (t.type === "income" ? t.amount : -t.amount), 0);

  const groups = [];
  const idx    = {};
  [...filtered].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id)).forEach(t => {
    if (!(t.date in idx)) { idx[t.date] = groups.length; groups.push({ date: t.date, items: [] }); }
    groups[idx[t.date]].items.push(t);
  });

  const activeCat = catId !== "all" ? catMap[catId] : null;

  return (
    <div className="screen-enter">
      <div className="screen-head">
        <h2 className="screen-title">Movimientos</h2>
        <p className="screen-sub">{filtered.length} resultado{filtered.length !== 1 ? "s" : ""} · saldo {fmt.full(total)}</p>
      </div>

      <div className="pad">
        <div className="search-wrap">
          <Icon name="search" size={19} stroke={2.2} color="var(--text-3)" />
          <input placeholder="Buscar comercio, nota…" value={q} onChange={e => setQ(e.target.value)} />
          {q && <button onClick={() => setQ("")} style={{ border: "none", background: "none", cursor: "pointer", color: "var(--text-3)", display: "flex" }}><Icon name="x" size={16} stroke={2.4} /></button>}
        </div>
      </div>

      <div className="pad" style={{ display: "flex", gap: 8, marginTop: 12 }}>
        {[["all", "Todos"], ["expense", "Gastos"], ["income", "Ingresos"]].map(([v, l]) => (
          <button key={v} className={"chip" + (type === v ? " sel" : "")} onClick={() => setType(v)} style={{ flex: 1, textAlign: "center" }}>{l}</button>
        ))}
        <button className={"chip" + (showCats || activeCat ? " sel" : "")} onClick={() => setShowCats(s => !s)} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Icon name="filter" size={15} stroke={2.3} />{activeCat ? activeCat.name : "Filtrar"}
        </button>
      </div>

      {showCats && (
        <div className="pad" style={{ display: "flex", gap: 8, marginTop: 10, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
          <button className={"chip" + (catId === "all" ? " sel" : "")} onClick={() => setCatId("all")}>Todas</button>
          {cats.map(c => (
            <button key={c.id} className={"chip" + (catId === c.id ? " sel" : "")} onClick={() => setCatId(c.id)} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 9, height: 9, borderRadius: "50%", background: c.color }} />{c.name}
            </button>
          ))}
        </div>
      )}

      <div className="pad" style={{ marginTop: 8 }}>
        {groups.length === 0 && (
          <div className="empty">
            <div style={{ width: 56, height: 56, borderRadius: 18, background: "var(--surface-3)", display: "grid", placeItems: "center", margin: "0 auto 14px" }}>
              <Icon name="search" size={26} stroke={2} color="var(--text-3)" />
            </div>
            <div style={{ fontWeight: 700, color: "var(--text-2)" }}>Sin resultados</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>Prueba con otra búsqueda o filtro</div>
          </div>
        )}
        {groups.map(g => (
          <div key={g.date}>
            <div className="date-divider" style={{ textTransform: "capitalize" }}>{fullDay(g.date)}</div>
            <div className="card" style={{ padding: "4px 16px" }}>
              {g.items.map((tx, i) => (
                <div key={tx.id} style={{ borderTop: i ? "1px solid var(--border)" : "none" }}>
                  <TxRow tx={tx} cat={catMap[tx.cat]} onClick={() => onOpenTx(tx)} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Movimientos;
