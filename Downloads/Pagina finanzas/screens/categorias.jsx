/* categorias.jsx — manage categories + create sheet. Exposes window.Categorias */
const NEW_ICONS = ["cart","utensils","car","house","film","heart","bag","repeat","coffee","bolt","plane","book","dumbbell","paw","gift","phone","briefcase","globe"];
const NEW_COLORS = ["#2f9e6f","#f0883e","#4b8df0","#7c6cf0","#e85ca0","#ef5b6b","#d4a23a","#00b3c4","#b07a4f","#6aa84f","#9b7bd4","#36b2a0"];

function CatSheet({ onClose }) {
  const { addCat } = useStore();
  const [name, setName] = React.useState("");
  const [icon, setIcon] = React.useState("cart");
  const [color, setColor] = React.useState("#4b8df0");
  const [budget, setBudget] = React.useState("");
  const valid = name.trim().length > 0;

  return (
    <Sheet onClose={onClose}>
      {(close) => {
        const save = () => {
          if (!valid) return;
          addCat({ name: name.trim(), icon, color, budget: parseFloat(budget) || 0 });
          close();
        };
        return (
        <React.Fragment>
        <div className="grabber" />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button className="btn-ghost" style={{ padding: "8px 10px", borderRadius: 11 }} onClick={close}><Icon name="x" size={18} stroke={2.3} /></button>
          <div style={{ fontSize: 16, fontWeight: 750 }}>Nueva categoría</div>
          <div style={{ width: 38 }} />
        </div>

        {/* preview */}
        <div style={{ display: "flex", justifyContent: "center", margin: "20px 0 6px" }}>
          <div className="cat-ico" style={{ width: 64, height: 64, borderRadius: 20, background: color + "22", color }}>
            <Icon name={icon} size={30} stroke={2} />
          </div>
        </div>

        <div className="field">
          <label>Nombre</label>
          <input className="input" placeholder="Ej. Mascotas" value={name} onChange={e => setName(e.target.value)} maxLength={20} autoFocus />
        </div>

        <div className="field">
          <label>Icono</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 }}>
            {NEW_ICONS.map(ic => (
              <div key={ic} className={"tap" + (icon === ic ? " sel" : "")} onClick={() => setIcon(ic)}
                style={{ aspectRatio: "1", borderRadius: 13, display: "grid", placeItems: "center", cursor: "pointer",
                  background: icon === ic ? color + "22" : "var(--surface)", border: "1.5px solid " + (icon === ic ? color : "var(--border)"),
                  color: icon === ic ? color : "var(--text-2)" }}>
                <Icon name={ic} size={20} stroke={2} />
              </div>
            ))}
          </div>
        </div>

        <div className="field">
          <label>Color</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {NEW_COLORS.map(col => (
              <div key={col} className="tap" onClick={() => setColor(col)}
                style={{ width: 32, height: 32, borderRadius: "50%", background: col, cursor: "pointer",
                  boxShadow: color === col ? "0 0 0 3px var(--surface), 0 0 0 5px " + col : "none" }} />
            ))}
          </div>
        </div>

        <div className="field">
          <label>Presupuesto mensual <span style={{ color: "var(--text-3)", fontWeight: 500 }}>(opcional)</span></label>
          <input className="input" inputMode="decimal" placeholder="0" value={budget} onChange={e => setBudget(e.target.value.replace(/[^0-9.]/g, ""))} />
        </div>

        <button className="btn-primary" disabled={!valid} onClick={save}>Crear categoría</button>
        </React.Fragment>
        );
      }}
    </Sheet>
  );
}

function Categorias() {
  const { cats, txs, month, fmt, isThisMonth } = useStore();
  const [creating, setCreating] = React.useState(false);

  const expense = cats.filter(c => c.type === "expense");
  const income = cats.filter(c => c.type === "income");

  const incomeByCat = {};
  txs.filter(t => t.type === "income" && isThisMonth(t.date)).forEach(t => { incomeByCat[t.cat] = (incomeByCat[t.cat] || 0) + t.amount; });

  const totalBudget = expense.reduce((s, c) => s + (c.budget || 0), 0);
  const budgetPct = totalBudget ? Math.min((month.expense / totalBudget) * 100, 100) : 0;

  return (
    <div className="screen-enter">
      <div className="screen-head">
        <h2 className="screen-title">Categorías</h2>
        <p className="screen-sub">Gasto del mes por categoría</p>
      </div>

      {/* budget overview */}
      <div className="pad">
        <div className="card" style={{ padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 11 }}>
            <span style={{ fontSize: 13.5, fontWeight: 650, color: "var(--text-2)" }}>Presupuesto total</span>
            <span className="num" style={{ fontSize: 14, fontWeight: 700 }}><b style={{ color: "var(--text)" }}>{fmt.round(month.expense)}</b> <span style={{ color: "var(--text-3)" }}>/ {fmt.round(totalBudget)}</span></span>
          </div>
          <div className="bar-track" style={{ height: 10 }}>
            <div className="bar-fill" style={{ width: budgetPct + "%", background: budgetPct > 90 ? "var(--expense)" : "var(--accent)" }} />
          </div>
        </div>
      </div>

      {/* expense categories */}
      <div className="pad">
        <div className="section-head"><h3>Gastos</h3></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 11 }}>
          {expense.map(c => {
            const spent = month.byCat[c.id] || 0;
            const pct = c.budget ? Math.min((spent / c.budget) * 100, 100) : 0;
            const over = c.budget && spent > c.budget;
            return (
              <div key={c.id} className="card tap" style={{ padding: 15 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 11 }}>
                  <CatIcon cat={c} size={38} radius={12} />
                  {over && <span className="pill" style={{ background: "var(--expense-bg)", color: "var(--expense)", padding: "3px 8px", fontSize: 10.5 }}>Excedido</span>}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{c.name}</div>
                <div className="num" style={{ fontSize: 17, fontWeight: 800, letterSpacing: "-0.02em", margin: "2px 0 10px", color: over ? "var(--expense)" : "var(--text)" }}>{fmt.full(spent)}</div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: pct + "%", background: over ? "var(--expense)" : c.color }} />
                </div>
                <div style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 550, marginTop: 6 }}>{c.budget ? `${Math.round(pct)}% de ${fmt.round(c.budget)}` : "Sin presupuesto"}</div>
              </div>
            );
          })}
          {/* add card */}
          <button onClick={() => setCreating(true)} className="tap" style={{ minHeight: 150, borderRadius: 22, border: "1.5px dashed var(--border-2)", background: "transparent", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, color: "var(--text-2)", fontFamily: "var(--font)" }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: "var(--accent-soft)", display: "grid", placeItems: "center", color: "var(--accent-text)" }}><Icon name="plus" size={22} stroke={2.4} /></div>
            <span style={{ fontSize: 13, fontWeight: 700 }}>Añadir categoría</span>
          </button>
        </div>
      </div>

      {/* income categories */}
      <div className="pad">
        <div className="section-head"><h3>Ingresos</h3></div>
        <div className="card" style={{ padding: "6px 16px" }}>
          {income.map((c, i) => (
            <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 13, padding: "12px 0", borderTop: i ? "1px solid var(--border)" : "none" }}>
              <CatIcon cat={c} size={38} radius={12} />
              <div style={{ flex: 1, fontSize: 14.5, fontWeight: 650 }}>{c.name}</div>
              <div className="num" style={{ fontSize: 15, fontWeight: 750, color: "var(--income)" }}>{incomeByCat[c.id] ? "+" + fmt.full(incomeByCat[c.id]) : fmt.full(0)}</div>
            </div>
          ))}
        </div>
      </div>

      {creating && <CatSheet onClose={() => setCreating(false)} />}
    </div>
  );
}
window.Categorias = Categorias;
