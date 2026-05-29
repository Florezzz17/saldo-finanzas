/* estadisticas.jsx — charts dashboard. Exposes window.Estadisticas */
function Estadisticas() {
  const { month, catMap, cats, fmt, history, txs, isThisMonth } = useStore();
  const [mode, setMode] = React.useState("expense");

  const source = mode === "expense" ? month.byCat : (() => {
    const o = {}; txs.filter(t => t.type === "income" && isThisMonth(t.date)).forEach(t => { o[t.cat] = (o[t.cat] || 0) + t.amount; }); return o;
  })();

  const segs = Object.entries(source)
    .map(([id, val]) => ({ cat: catMap[id], val }))
    .filter(x => x.cat)
    .sort((a, b) => b.val - a.val);
  const total = segs.reduce((s, x) => s + x.val, 0);
  const donutData = segs.map(s => ({ label: s.cat.name, value: s.val, color: s.cat.color }));

  // comparison vs previous month
  const cur = history[history.length - 1];
  const prev = history[history.length - 2];
  const curVal = mode === "expense" ? cur.expense : cur.income;
  const prevVal = mode === "expense" ? prev.expense : prev.income;
  const change = prevVal ? ((curVal - prevVal) / prevVal) * 100 : 0;
  const barData = history.map((h, i) => ({ ...h, current: i === history.length - 1 }));

  // most used by count
  const counts = {};
  txs.filter(t => isThisMonth(t.date) && t.type === mode).forEach(t => { counts[t.cat] = (counts[t.cat] || 0) + 1; });
  const mostUsed = Object.entries(counts).map(([id, n]) => ({ cat: catMap[id], n })).filter(x => x.cat).sort((a, b) => b.n - a.n).slice(0, 3);

  const goodChange = mode === "expense" ? change <= 0 : change >= 0;

  return (
    <div className="screen-enter">
      <div className="screen-head">
        <h2 className="screen-title">Estadísticas</h2>
        <p className="screen-sub">Mayo 2026</p>
      </div>

      {/* mode toggle */}
      <div className="pad">
        <div className="seg">
          <button className={mode === "expense" ? "on-expense" : ""} onClick={() => setMode("expense")}>Gastos</button>
          <button className={mode === "income" ? "on-income" : ""} onClick={() => setMode("income")}>Ingresos</button>
        </div>
      </div>

      {/* donut distribution */}
      <div className="pad" style={{ marginTop: 14 }}>
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700 }}>Distribución</h3>
          <div style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 12 }}>Reparto del {mode === "expense" ? "gasto" : "ingreso"} por categoría</div>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <Donut data={donutData} size={150} thickness={20}>
              <div style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 650 }}>Total</div>
              <div className="num" style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em", color: mode === "expense" ? "var(--expense)" : "var(--income)" }}>{fmt.round(total)}</div>
            </Donut>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 9 }}>
              {segs.slice(0, 5).map(s => (
                <div key={s.cat.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: s.cat.color, flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 12.5, fontWeight: 600, color: "var(--text-2)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.cat.name}</span>
                  <span className="num" style={{ fontSize: 12.5, fontWeight: 750 }}>{Math.round((s.val / total) * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* monthly comparison */}
      <div className="pad" style={{ marginTop: 14 }}>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Evolución mensual</h3>
              <div style={{ fontSize: 13, color: "var(--text-2)", marginTop: 3 }}>Últimos 6 meses</div>
            </div>
            <div className="pill" style={{ background: goodChange ? "var(--income-bg)" : "var(--expense-bg)", color: goodChange ? "var(--income)" : "var(--expense)" }}>
              <Icon name={change >= 0 ? "arrowUp" : "arrowDown"} size={13} stroke={2.6} />
              {change >= 0 ? "+" : ""}{change.toFixed(0)}%
            </div>
          </div>
          <Bars data={barData} height={140} />
          <div style={{ display: "flex", gap: 18, marginTop: 14, fontSize: 12, fontWeight: 600, color: "var(--text-2)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: "var(--income)" }} />Ingresos</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: "var(--expense)" }} />Gastos</span>
            <span style={{ marginLeft: "auto", color: "var(--text-3)" }}>vs {prev.label}: {fmt.round(prevVal)}</span>
          </div>
        </div>
      </div>

      {/* most used */}
      <div className="pad" style={{ marginTop: 14 }}>
        <div className="section-head"><h3>Más utilizadas</h3></div>
        <div className="card" style={{ padding: "6px 16px" }}>
          {mostUsed.length === 0 && <div style={{ padding: "16px 0", color: "var(--text-3)", fontSize: 13.5, textAlign: "center" }}>Sin datos este mes</div>}
          {mostUsed.map(({ cat, n }, i) => (
            <div key={cat.id} style={{ display: "flex", alignItems: "center", gap: 13, padding: "12px 0", borderTop: i ? "1px solid var(--border)" : "none" }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text-3)", width: 16 }}>{i + 1}</div>
              <CatIcon cat={cat} size={36} radius={11} />
              <div style={{ flex: 1, fontSize: 14.5, fontWeight: 650 }}>{cat.name}</div>
              <div className="num" style={{ fontSize: 13, fontWeight: 700, color: "var(--text-2)" }}>{n} mov.</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
window.Estadisticas = Estadisticas;
