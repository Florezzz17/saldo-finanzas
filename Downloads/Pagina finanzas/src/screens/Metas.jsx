import React from 'react';
import { useStore } from '../store/StoreContext';
import { Icon }     from '../components/Icon';
import { Sheet }    from '../components/ui';

const GOAL_ICONS  = ["flag","star","plane","car","house","heart","dumbbell","globe","book","phone","bag","gift","piggy","briefcase","shield"];
const GOAL_COLORS = ["#6359e9","#2f9e6f","#f0883e","#4b8df0","#e85ca0","#ef5b6b","#d4a23a","#00b3c4","#b07a4f","#7c6cf0","#9b7bd4","#36b2a0"];

/* ── helpers ── */
function daysLeft(deadline) {
  if (!deadline) return null;
  const diff = Math.ceil((new Date(deadline) - new Date()) / 86400000);
  return diff;
}
function fmtDeadline(deadline) {
  if (!deadline) return null;
  const [y, m, d] = deadline.split('-');
  return `${d}/${m}/${y}`;
}

/* ══════════════════════════════════════════════
   Sheet: crear / editar meta
══════════════════════════════════════════════ */
function GoalSheet({ editing, onClose }) {
  const { addGoal, updateGoal } = useStore();
  const isEdit = !!editing;

  const [name,     setName]     = React.useState(editing?.name     || '');
  const [icon,     setIcon]     = React.useState(editing?.icon     || 'flag');
  const [color,    setColor]    = React.useState(editing?.color    || '#6359e9');
  const [target,   setTarget]   = React.useState(editing?.target   ? String(editing.target).replace('.', ',') : '');
  const [deadline, setDeadline] = React.useState(editing?.deadline || '');
  const [note,     setNote]     = React.useState(editing?.note     || '');

  const numTarget = parseFloat(target.replace(',', '.')) || 0;
  const valid     = name.trim().length > 0 && numTarget > 0;

  return (
    <Sheet onClose={onClose}>
      {(close) => {
        const save = async () => {
          if (!valid) return;
          const payload = {
            name: name.trim(),
            icon, color,
            target: numTarget,
            deadline: deadline || null,
            note: note.trim() || null,
          };
          if (isEdit) await updateGoal(editing.id, payload);
          else        await addGoal(payload);
          close();
        };
        return (
          <React.Fragment>
            <div className="grabber" />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <button className="btn-ghost" style={{ padding: '8px 10px', borderRadius: 11 }} onClick={close}>
                <Icon name="x" size={18} stroke={2.3} />
              </button>
              <div style={{ fontSize: 16, fontWeight: 750 }}>{isEdit ? 'Editar meta' : 'Nueva meta'}</div>
              <div style={{ width: 38 }} />
            </div>

            {/* Preview */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0 8px' }}>
              <div style={{ width: 64, height: 64, borderRadius: 20, background: color + '22', color, display: 'grid', placeItems: 'center' }}>
                <Icon name={icon} size={30} stroke={2} />
              </div>
            </div>

            <div className="field">
              <label>Nombre de la meta</label>
              <input className="input" placeholder="Ej. Viaje a México, Carro nuevo…" value={name} onChange={e => setName(e.target.value)} maxLength={40} autoFocus />
            </div>

            <div className="field">
              <label>Monto objetivo ($)</label>
              <input className="input" inputMode="decimal" placeholder="0,00" value={target}
                onChange={e => {
                  let v = e.target.value.replace(/[^0-9,]/g, '');
                  const parts = v.split(',');
                  if (parts.length > 2) v = parts[0] + ',' + parts.slice(1).join('');
                  if (parts[1]?.length > 2) v = parts[0] + ',' + parts[1].slice(0, 2);
                  setTarget(v);
                }} />
            </div>

            <div className="field">
              <label>Fecha límite <span style={{ color: 'var(--text-3)', fontWeight: 500 }}>(opcional)</span></label>
              <div className="input" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 0, overflow: 'hidden' }}>
                <span style={{ paddingLeft: 14, color: 'var(--text-2)', display: 'flex' }}><Icon name="calendar" size={18} stroke={2} /></span>
                <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)}
                  style={{ flex: 1, border: 'none', background: 'none', outline: 'none', fontFamily: 'var(--font)', fontSize: 15, fontWeight: 600, color: 'var(--text)', padding: '14px 14px 14px 0' }} />
              </div>
            </div>

            <div className="field">
              <label>Icono</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
                {GOAL_ICONS.map(ic => (
                  <div key={ic} className={'tap' + (icon === ic ? ' sel' : '')} onClick={() => setIcon(ic)}
                    style={{ aspectRatio: '1', borderRadius: 13, display: 'grid', placeItems: 'center', cursor: 'pointer',
                      background: icon === ic ? color + '22' : 'var(--surface)', border: '1.5px solid ' + (icon === ic ? color : 'var(--border)'),
                      color: icon === ic ? color : 'var(--text-2)' }}>
                    <Icon name={ic} size={20} stroke={2} />
                  </div>
                ))}
              </div>
            </div>

            <div className="field">
              <label>Color</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {GOAL_COLORS.map(col => (
                  <div key={col} className="tap" onClick={() => setColor(col)}
                    style={{ width: 32, height: 32, borderRadius: '50%', background: col, cursor: 'pointer',
                      boxShadow: color === col ? '0 0 0 3px var(--surface), 0 0 0 5px ' + col : 'none' }} />
                ))}
              </div>
            </div>

            <div className="field">
              <label>Nota <span style={{ color: 'var(--text-3)', fontWeight: 500 }}>(opcional)</span></label>
              <input className="input" placeholder="Para qué es esta meta…" value={note} onChange={e => setNote(e.target.value)} maxLength={80} />
            </div>

            <button className="btn-primary" disabled={!valid} onClick={save}>
              {isEdit ? 'Guardar cambios' : 'Crear meta'}
            </button>
          </React.Fragment>
        );
      }}
    </Sheet>
  );
}

/* ══════════════════════════════════════════════
   Sheet: agregar / retirar dinero
══════════════════════════════════════════════ */
function MoneySheet({ goal, onClose, onEdit }) {
  const { updateGoal, deleteGoal, fmt } = useStore();
  const [mode,   setMode]   = React.useState('add');
  const [amount, setAmount] = React.useState('');

  const num  = parseFloat(amount.replace(',', '.')) || 0;
  const pct  = Math.min((goal.saved / goal.target) * 100, 100);
  const days = daysLeft(goal.deadline);

  const save = async () => {
    if (num <= 0) return;
    const newSaved = mode === 'add'
      ? Math.min(goal.saved + num, goal.target)
      : Math.max(goal.saved - num, 0);
    await updateGoal(goal.id, { saved: newSaved });
    onClose();
  };

  const handleDelete = async () => {
    await deleteGoal(goal.id);
    onClose();
  };

  return (
    <Sheet onClose={onClose}>
      {(close) => (
        <React.Fragment>
          <div className="grabber" />

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <button className="btn-ghost" style={{ padding: '8px 10px', borderRadius: 11 }} onClick={close}>
              <Icon name="x" size={18} stroke={2.3} />
            </button>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-ghost" style={{ padding: '8px 10px', borderRadius: 11 }} onClick={() => { close(); onEdit(goal); }}>
                <Icon name="pencil" size={17} stroke={2.2} />
              </button>
              <button className="btn-ghost" style={{ padding: '8px 10px', borderRadius: 11, color: 'var(--expense)', borderColor: 'var(--expense-bg)' }} onClick={handleDelete}>
                <Icon name="trash" size={17} stroke={2.2} />
              </button>
            </div>
          </div>

          {/* Goal summary */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, padding: '16px', background: 'var(--surface-2)', borderRadius: 18, border: '1px solid var(--border)' }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: goal.color + '22', color: goal.color, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <Icon name={goal.icon} size={26} stroke={2} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 16, fontWeight: 750, marginBottom: 4 }}>{goal.name}</div>
              <div style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 600 }}>
                {fmt.full(goal.saved)} <span style={{ color: 'var(--text-3)' }}>/ {fmt.full(goal.target)}</span>
              </div>
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: pct >= 100 ? 'var(--income)' : goal.color }}>
              {Math.round(pct)}%
            </div>
          </div>

          {/* Progress bar */}
          <div className="bar-track" style={{ height: 10, marginBottom: 20 }}>
            <div className="bar-fill" style={{ width: pct + '%', background: pct >= 100 ? 'var(--income)' : goal.color }} />
          </div>

          {pct < 100 ? (
            <React.Fragment>
              {/* Mode toggle */}
              <div className="seg" style={{ marginBottom: 16 }}>
                <button className={mode === 'add' ? 'on-income' : ''} onClick={() => setMode('add')}>Agregar</button>
                <button className={mode === 'sub' ? 'on-expense' : ''} onClick={() => setMode('sub')}>Retirar</button>
              </div>

              {/* Amount input */}
              <div style={{ textAlign: 'center', margin: '8px 0 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <span style={{ fontSize: 30, fontWeight: 700, color: num > 0 ? (mode === 'add' ? 'var(--income)' : 'var(--expense)') : 'var(--text-3)' }}>$</span>
                  <input className="amount-input" inputMode="decimal" placeholder="0,00" value={amount}
                    style={{ maxWidth: 220, color: num > 0 ? (mode === 'add' ? 'var(--income)' : 'var(--expense)') : 'var(--text-3)' }}
                    onChange={e => {
                      let v = e.target.value.replace(/[^0-9,]/g, '');
                      const parts = v.split(',');
                      if (parts.length > 2) v = parts[0] + ',' + parts.slice(1).join('');
                      if (parts[1]?.length > 2) v = parts[0] + ',' + parts[1].slice(0, 2);
                      setAmount(v);
                    }} />
                </div>
              </div>

              <button className="btn-primary" disabled={num <= 0} onClick={save}
                style={{ background: mode === 'add'
                  ? 'linear-gradient(140deg, color-mix(in oklch, var(--income) 88%, white), var(--income))'
                  : 'linear-gradient(140deg, color-mix(in oklch, var(--expense) 88%, white), var(--expense))' }}>
                {mode === 'add' ? `Agregar ${num > 0 ? fmt.full(num) : ''}` : `Retirar ${num > 0 ? fmt.full(num) : ''}`}
              </button>
            </React.Fragment>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🎉</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--income)', marginBottom: 4 }}>¡Meta alcanzada!</div>
              <div style={{ fontSize: 14, color: 'var(--text-2)' }}>Felicitaciones, lograste tu objetivo.</div>
            </div>
          )}

          {goal.deadline && (
            <div style={{ textAlign: 'center', marginTop: 12, fontSize: 13, color: days !== null && days < 30 ? 'var(--expense)' : 'var(--text-3)', fontWeight: 600 }}>
              {days !== null && days > 0 ? `${days} días restantes · ` : days === 0 ? '¡Hoy es el límite! · ' : days < 0 ? 'Plazo vencido · ' : ''}
              {fmtDeadline(goal.deadline)}
            </div>
          )}
        </React.Fragment>
      )}
    </Sheet>
  );
}

/* ══════════════════════════════════════════════
   Pantalla principal de Metas
══════════════════════════════════════════════ */
export function Metas() {
  const { goals, fmt } = useStore();
  const [creating, setCreating] = React.useState(false);
  const [selected, setSelected] = React.useState(null); // goal object for MoneySheet
  const [editing,  setEditing]  = React.useState(null); // goal object for GoalSheet edit

  const totalSaved  = goals.reduce((s, g) => s + g.saved,  0);
  const totalTarget = goals.reduce((s, g) => s + g.target, 0);
  const completed   = goals.filter(g => g.saved >= g.target).length;

  return (
    <div className="screen-enter">
      <div className="screen-head">
        <h2 className="screen-title">Metas de ahorro</h2>
        <p className="screen-sub">
          {goals.length === 0 ? 'Sin metas aún' : `${goals.length} meta${goals.length !== 1 ? 's' : ''} · ${completed} completada${completed !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Summary card */}
      {goals.length > 0 && (
        <div className="pad">
          <div className="card" style={{ padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
              <span style={{ fontSize: 13.5, fontWeight: 650, color: 'var(--text-2)' }}>Total ahorrado</span>
              <span className="num" style={{ fontSize: 14, fontWeight: 700 }}>
                <b style={{ color: 'var(--text)' }}>{fmt.round(totalSaved)}</b>
                <span style={{ color: 'var(--text-3)' }}> / {fmt.round(totalTarget)}</span>
              </span>
            </div>
            <div className="bar-track" style={{ height: 10 }}>
              <div className="bar-fill" style={{
                width: totalTarget ? Math.min((totalSaved / totalTarget) * 100, 100) + '%' : '0%',
                background: 'var(--accent)',
              }} />
            </div>
          </div>
        </div>
      )}

      {/* Goals list */}
      <div className="pad" style={{ marginTop: 8 }}>
        {goals.length === 0 ? (
          <div className="empty" style={{ paddingTop: 60 }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: 'var(--accent-soft)', display: 'grid', placeItems: 'center', margin: '0 auto 16px', color: 'var(--accent-text)' }}>
              <Icon name="flag" size={30} stroke={2} />
            </div>
            <div style={{ fontWeight: 700, color: 'var(--text-2)', fontSize: 16, marginBottom: 6 }}>Sin metas de ahorro</div>
            <div style={{ fontSize: 14, marginBottom: 24 }}>Crea tu primera meta y empieza a ahorrar.</div>
            <button className="btn-primary" style={{ width: 'auto', padding: '14px 28px', margin: 0 }} onClick={() => setCreating(true)}>
              + Nueva meta
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {goals.map(goal => {
              const pct  = Math.min((goal.saved / goal.target) * 100, 100);
              const done = pct >= 100;
              const days = daysLeft(goal.deadline);
              const urgent = days !== null && days <= 30 && days >= 0 && !done;

              return (
                <div key={goal.id} className="card tap" style={{ padding: 18 }} onClick={() => setSelected(goal)}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 15, background: goal.color + '22', color: goal.color, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                      <Icon name={goal.icon} size={24} stroke={2} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                        <div style={{ fontSize: 15, fontWeight: 750, letterSpacing: '-0.01em' }}>{goal.name}</div>
                        {done && (
                          <span style={{ fontSize: 10.5, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: 'var(--income-bg)', color: 'var(--income)' }}>
                            Completada
                          </span>
                        )}
                        {urgent && (
                          <span style={{ fontSize: 10.5, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: 'var(--expense-bg)', color: 'var(--expense)' }}>
                            {days === 0 ? 'Hoy' : `${days}d`}
                          </span>
                        )}
                      </div>
                      {goal.note && (
                        <div style={{ fontSize: 12.5, color: 'var(--text-3)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {goal.note}
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div className="num" style={{ fontSize: 20, fontWeight: 800, color: done ? 'var(--income)' : goal.color }}>{Math.round(pct)}%</div>
                    </div>
                  </div>

                  <div className="bar-track" style={{ marginBottom: 10 }}>
                    <div className="bar-fill" style={{ width: pct + '%', background: done ? 'var(--income)' : goal.color }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="num" style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-2)' }}>
                      {fmt.full(goal.saved)}
                      <span style={{ color: 'var(--text-3)', fontWeight: 500 }}> / {fmt.full(goal.target)}</span>
                    </span>
                    {goal.deadline && !done && (
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: urgent ? 'var(--expense)' : 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Icon name="calendar" size={13} stroke={2} />
                        {days !== null && days >= 0 ? `${days} días` : 'Vencida'} · {fmtDeadline(goal.deadline)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Add new goal button */}
            <button onClick={() => setCreating(true)} className="tap"
              style={{ padding: '18px', borderRadius: 22, border: '1.5px dashed var(--border-2)', background: 'transparent', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, color: 'var(--text-2)', fontFamily: 'var(--font)', fontSize: 14, fontWeight: 700 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--accent-soft)', display: 'grid', placeItems: 'center', color: 'var(--accent-text)' }}>
                <Icon name="plus" size={20} stroke={2.4} />
              </div>
              Nueva meta
            </button>
          </div>
        )}
      </div>

      {/* Sheets */}
      {(creating || editing) && (
        <GoalSheet
          editing={editing}
          onClose={() => { setCreating(false); setEditing(null); }}
        />
      )}
      {selected && (
        <MoneySheet
          goal={selected}
          onClose={() => setSelected(null)}
          onEdit={(g) => { setSelected(null); setEditing(g); }}
        />
      )}
    </div>
  );
}

export default Metas;
