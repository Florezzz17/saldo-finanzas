import React from 'react';
import { useStore } from '../store/StoreContext';
import { Icon } from '../components/Icon';
import { CatIcon, Sheet } from '../components/ui';

export function AddSheet({ editing, onClose }) {
  const { cats, addTx, updateTx, deleteTx, currency, NOW } = useStore();
  const isEdit = !!editing;

  const [type,   setType]   = React.useState(editing?.type  || "expense");
  const [amount, setAmount] = React.useState(editing ? String(editing.amount).replace(".", ",") : "");
  const [catId,  setCatId]  = React.useState(editing?.cat   || null);
  const [name,   setName]   = React.useState(editing?.name  || "");
  const [date,   setDate]   = React.useState(editing?.date  || NOW.toISOString().slice(0, 10));
  const [note,   setNote]   = React.useState(editing?.note  || "");

  const symbol = currency === "USD" ? "$" : "€";
  const list   = cats.filter(c => c.type === type);

  React.useEffect(() => {
    if (catId && !list.find(c => c.id === catId)) setCatId(null);
  }, [type]); // eslint-disable-line

  const onAmount = (e) => {
    let v = e.target.value.replace(/[^0-9,]/g, "");
    const parts = v.split(",");
    if (parts.length > 2) v = parts[0] + "," + parts.slice(1).join("");
    if (parts[1]?.length > 2) v = parts[0] + "," + parts[1].slice(0, 2);
    setAmount(v);
  };

  const numAmount = parseFloat(amount.replace(",", ".")) || 0;
  const valid     = numAmount > 0 && catId;

  return (
    <Sheet onClose={onClose}>
      {(close) => {
        const save = () => {
          if (!valid) return;
          const catName = cats.find(c => c.id === catId)?.name || "Movimiento";
          const payload = { type, amount: numAmount, cat: catId, date, note: note.trim(), name: name.trim() || catName };
          if (isEdit) updateTx(editing.id, payload); else addTx(payload);
          close();
        };
        const remove = () => { deleteTx(editing.id); close(); };
        return (
          <React.Fragment>
            <div className="grabber" />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <button className="btn-ghost" style={{ padding: "8px 10px", borderRadius: 11 }} onClick={close}><Icon name="x" size={18} stroke={2.3} /></button>
              <div style={{ fontSize: 16, fontWeight: 750 }}>{isEdit ? "Editar movimiento" : "Nuevo movimiento"}</div>
              {isEdit
                ? <button className="btn-ghost" style={{ padding: "8px 10px", borderRadius: 11, color: "var(--expense)", borderColor: "var(--expense-bg)" }} onClick={remove}><Icon name="trash" size={18} stroke={2.2} /></button>
                : <div style={{ width: 38 }} />}
            </div>

            <div className="seg" style={{ marginTop: 12 }}>
              <button className={type === "income"  ? "on-income"  : ""} onClick={() => setType("income")}>Ingreso</button>
              <button className={type === "expense" ? "on-expense" : ""} onClick={() => setType("expense")}>Gasto</button>
            </div>

            <div style={{ textAlign: "center", margin: "26px 0 8px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <span style={{ fontSize: 30, fontWeight: 700, color: numAmount > 0 ? (type === "income" ? "var(--income)" : "var(--text)") : "var(--text-3)" }}>{symbol}</span>
                <input className="amount-input" inputMode="decimal" placeholder="0,00" value={amount} onChange={onAmount} autoFocus={!isEdit}
                  style={{ maxWidth: 220, color: numAmount > 0 ? (type === "income" ? "var(--income)" : "var(--text)") : "var(--text-3)" }} />
              </div>
            </div>

            <div className="field">
              <label>Concepto</label>
              <input className="input" placeholder={type === "income" ? "Ej. Nómina, venta…" : "Ej. Mercadona, alquiler…"} value={name} onChange={e => setName(e.target.value)} maxLength={40} />
            </div>

            <div className="field">
              <label>Categoría</label>
              <div className="cat-grid">
                {list.map(c => (
                  <div key={c.id} className={"cat-pick tap" + (catId === c.id ? " sel" : "")} onClick={() => setCatId(c.id)}>
                    <CatIcon cat={c} size={36} radius={11} />
                    <span>{c.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="field">
              <label>Fecha</label>
              <div className="input" style={{ display: "flex", alignItems: "center", gap: 10, padding: 0, overflow: "hidden" }}>
                <span style={{ paddingLeft: 14, color: "var(--text-2)", display: "flex" }}><Icon name="calendar" size={18} stroke={2} /></span>
                <input type="date" value={date} max="2026-12-31" onChange={e => setDate(e.target.value)}
                  style={{ flex: 1, border: "none", background: "none", outline: "none", fontFamily: "var(--font)", fontSize: 15, fontWeight: 600, color: "var(--text)", padding: "14px 14px 14px 0" }} />
              </div>
            </div>

            <div className="field">
              <label>Nota <span style={{ color: "var(--text-3)", fontWeight: 500 }}>(opcional)</span></label>
              <input className="input" placeholder="Ej. cena con amigos" value={note} onChange={e => setNote(e.target.value)} maxLength={60} />
            </div>

            <button className="btn-primary" disabled={!valid} onClick={save}>
              {isEdit ? "Guardar cambios" : "Añadir movimiento"}
            </button>
          </React.Fragment>
        );
      }}
    </Sheet>
  );
}

export default AddSheet;
