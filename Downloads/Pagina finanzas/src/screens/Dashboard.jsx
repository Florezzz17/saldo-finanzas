import React from 'react';
import { useStore } from '../store/StoreContext';
import { Icon } from '../components/Icon';
import { CatIcon, TxRow } from '../components/ui';

export function Dashboard({ onAdd, onGoto, onOpenTx }) {
  const { fmt, month, balance, cats, catMap, txs, MONTHS, NOW, user } = useStore();

  const hour      = NOW.getHours();
  const greet     = hour < 6 ? "Buenas noches" : hour < 13 ? "Buenos días" : hour < 21 ? "Buenas tardes" : "Buenas noches";
  const monthName = MONTHS[NOW.getMonth()];
  const firstName = (user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || "").split(" ")[0];

  const topCats = Object.entries(month.byCat)
    .map(([id, spent]) => ({ cat: catMap[id], spent }))
    .filter(x => x.cat)
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 4);

  const recent = txs.slice(0, 5);
  const net    = month.income - month.expense;

  return (
    <div className="screen-enter">
      {/* header */}
      <div className="pad" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 4, paddingBottom: 16 }}>
        <div>
          <div style={{ fontSize: 13.5, color: "var(--text-2)", fontWeight: 600 }}>{greet}{firstName ? `, ${firstName}` : ""} 👋</div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", textTransform: "capitalize" }}>{monthName} 2026</div>
        </div>
        <div className="tap" style={{ width: 42, height: 42, borderRadius: "50%", background: "var(--surface)", border: "1px solid var(--border)", display: "grid", placeItems: "center", boxShadow: "var(--shadow-sm)" }}>
          <Icon name="bell" size={20} stroke={2} color="var(--text-2)" />
        </div>
      </div>

      {/* balance card */}
      <div className="pad">
        <div className="balance-card">
          <div className="balance-sheen" />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.78, letterSpacing: "0.02em" }}>Saldo total</div>
              <div className="num" style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.025em", marginTop: 3, lineHeight: 1.05 }}>{fmt.full(balance)}</div>
            </div>
            <div style={{ display: "flex", gap: 5, alignItems: "center", opacity: 0.9 }}>
              <span style={{ width: 22, height: 22, border: "2px solid rgba(255,255,255,.6)", borderRadius: "50%", display: "grid", placeItems: "center", fontSize: 11 }}></span>
              <Icon name="card" size={22} color="rgba(255,255,255,.85)" stroke={2} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 22, marginTop: 22, position: "relative" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, opacity: 0.82, fontSize: 12, fontWeight: 600 }}>
                <span style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(255,255,255,.22)", display: "grid", placeItems: "center" }}><Icon name="arrowDown" size={12} stroke={2.6} /></span>
                Ingresos
              </div>
              <div className="num" style={{ fontSize: 17, fontWeight: 750, marginTop: 5 }}>{fmt.full(month.income)}</div>
            </div>
            <div style={{ width: 1, background: "rgba(255,255,255,.18)" }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, opacity: 0.82, fontSize: 12, fontWeight: 600 }}>
                <span style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(255,255,255,.22)", display: "grid", placeItems: "center" }}><Icon name="arrowUp" size={12} stroke={2.6} /></span>
                Gastos
              </div>
              <div className="num" style={{ fontSize: 17, fontWeight: 750, marginTop: 5 }}>{fmt.full(month.expense)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* quick summary tiles */}
      <div className="pad" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 14 }}>
        {[
          { label: "Ingresos",   val: month.income,  color: "var(--income)",      bg: "var(--income-bg)",   icon: "arrowDown" },
          { label: "Gastos",     val: month.expense, color: "var(--expense)",     bg: "var(--expense-bg)",  icon: "arrowUp"   },
          { label: "Disponible", val: net,           color: "var(--accent-text)", bg: "var(--accent-soft)", icon: "wallet"    },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: "13px 12px" }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: s.bg, display: "grid", placeItems: "center", marginBottom: 9 }}>
              <Icon name={s.icon} size={17} color={s.color} stroke={2.3} />
            </div>
            <div style={{ fontSize: 11, color: "var(--text-2)", fontWeight: 650 }}>{s.label}</div>
            <div className="num" style={{ fontSize: 15, fontWeight: 800, letterSpacing: "-0.02em", marginTop: 2, color: i === 2 ? s.color : "var(--text)" }}>{fmt.round(s.val)}</div>
          </div>
        ))}
      </div>

      {/* top categories */}
      <div className="pad">
        <div className="section-head">
          <h3>Dónde gastas más</h3>
          <button className="link-btn" onClick={() => onGoto("cats")}>Ver todo<Icon name="chevR" size={14} stroke={2.4} /></button>
        </div>
        <div className="card" style={{ padding: "6px 16px" }}>
          {topCats.map(({ cat, spent }, i) => {
            const pct  = cat.budget ? Math.min((spent / cat.budget) * 100, 100) : 0;
            const over = cat.budget && spent > cat.budget;
            return (
              <div key={cat.id} className="tap" onClick={() => onGoto("stats")} style={{ padding: "12px 0", borderTop: i ? "1px solid var(--border)" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 9 }}>
                  <CatIcon cat={cat} size={34} radius={10} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 650 }}>{cat.name}</div>
                    <div style={{ fontSize: 11.5, color: "var(--text-3)", fontWeight: 550 }}>{cat.budget ? `de ${fmt.round(cat.budget)}` : ""}</div>
                  </div>
                  <div className="num" style={{ fontSize: 14, fontWeight: 750, color: over ? "var(--expense)" : "var(--text)" }}>{fmt.full(spent)}</div>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: pct + "%", background: over ? "var(--expense)" : cat.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* recent movements */}
      <div className="pad">
        <div className="section-head">
          <h3>Últimos movimientos</h3>
          <button className="link-btn" onClick={() => onGoto("movs")}>Ver todo<Icon name="chevR" size={14} stroke={2.4} /></button>
        </div>
        <div className="card stagger" style={{ padding: "4px 16px" }}>
          {recent.map((tx, i) => (
            <div key={tx.id} style={{ borderTop: i ? "1px solid var(--border)" : "none", animationDelay: (i * 0.04) + "s" }}>
              <TxRow tx={tx} cat={catMap[tx.cat]} onClick={() => onOpenTx(tx)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
