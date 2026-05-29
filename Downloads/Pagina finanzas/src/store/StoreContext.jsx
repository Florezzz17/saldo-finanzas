import React from 'react';
import { supabase } from '../lib/supabase';

/* ── Date helpers ─────────────────────────────────────────── */
export const MONTHS = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
export const DOW    = ["dom","lun","mar","mié","jue","vie","sáb"];

function parseD(s) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function relDay(dateStr) {
  const now  = new Date();
  const d    = parseD(dateStr);
  const diff = Math.round((new Date(now.getFullYear(), now.getMonth(), now.getDate()) - d) / 86400000);
  if (diff === 0) return "Hoy";
  if (diff === 1) return "Ayer";
  if (diff < 7)  return DOW[d.getDay()] + ". " + d.getDate();
  return d.getDate() + " " + MONTHS[d.getMonth()].slice(0, 3);
}

export function fullDay(dateStr) {
  const d = parseD(dateStr);
  return DOW[d.getDay()] + ", " + d.getDate() + " " + MONTHS[d.getMonth()];
}

export function isThisMonth(dateStr) {
  const now = new Date();
  const d   = parseD(dateStr);
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

/* ── Currency formatter ───────────────────────────────────── */
const CUR = { USD: { code: "USD", locale: "es-CO" }, COP: { code: "COP", locale: "es-CO" } };

function makeFmt(currency) {
  const c  = CUR[currency] || CUR.EUR;
  const f  = new Intl.NumberFormat(c.locale, { style: "currency", currency: c.code, minimumFractionDigits: 2 });
  const f0 = new Intl.NumberFormat(c.locale, { style: "currency", currency: c.code, maximumFractionDigits: 0 });
  return { full: n => f.format(n), round: n => f0.format(n) };
}

/* ── Map DB row → local tx shape ──────────────────────────── */
const dbToTx = t => ({ ...t, cat: t.category_id ?? t.cat ?? null, id: String(t.id) });
const txToDb = (tx, userId) => ({
  user_id:     userId,
  type:        tx.type,
  amount:      tx.amount,
  category_id: tx.cat,
  name:        tx.name,
  note:        tx.note || null,
  date:        tx.date,
});

/* ── Map DB row → local category shape ───────────────────── */
const dbToCat = c => ({ ...c, id: String(c.id) });

/* ── Context ──────────────────────────────────────────────── */
const StoreCtx = React.createContext(null);

export function StoreProvider({ children, currency, user }) {
  const [txs,     setTxs]     = React.useState([]);
  const [cats,    setCats]    = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  /* Load data from Supabase once on mount */
  React.useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      const [catsRes, txsRes] = await Promise.all([
        supabase.from('categories').select('*').eq('user_id', user.id).order('position'),
        supabase.from('transactions').select('*').eq('user_id', user.id).order('date', { ascending: false }).order('created_at', { ascending: false }),
      ]);
      if (cancelled) return;
      if (catsRes.data) setCats(catsRes.data.map(dbToCat));
      if (txsRes.data)  setTxs(txsRes.data.map(dbToTx));
      setLoading(false);
    };

    load();
    return () => { cancelled = true; };
  }, [user?.id]);

  /* ── CRUD ──────────────────────────────────────────────── */
  const addTx = async (tx) => {
    const { data, error } = await supabase
      .from('transactions')
      .insert(txToDb(tx, user.id))
      .select()
      .single();
    if (error) { console.error(error); return; }
    setTxs(prev => [dbToTx(data), ...prev]);
  };

  const updateTx = async (id, patch) => {
    const { data, error } = await supabase
      .from('transactions')
      .update({ ...txToDb(patch, user.id), updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) { console.error(error); return; }
    setTxs(prev => prev.map(t => t.id === String(id) ? dbToTx(data) : t));
  };

  const deleteTx = async (id) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) { console.error(error); return; }
    setTxs(prev => prev.filter(t => t.id !== String(id)));
  };

  const addCat = async (cat) => {
    const incomeIdx = cats.findIndex(c => c.type === 'income');
    const position  = incomeIdx >= 0 ? (cats[incomeIdx - 1]?.position ?? 9) + 1 : cats.length + 1;
    const { data, error } = await supabase
      .from('categories')
      .insert({ user_id: user.id, type: 'expense', budget: 150, position, ...cat })
      .select()
      .single();
    if (error) { console.error(error); return; }
    setCats(prev => {
      const idx = prev.findIndex(c => c.type === 'income');
      const row = dbToCat(data);
      return idx >= 0 ? [...prev.slice(0, idx), row, ...prev.slice(idx)] : [...prev, row];
    });
  };

  /* ── Derived state ────────────────────────────────────────── */
  const fmt    = React.useMemo(() => makeFmt(currency), [currency]);
  const catMap = React.useMemo(() => Object.fromEntries(cats.map(c => [c.id, c])), [cats]);
  const now    = new Date();

  const month = React.useMemo(() => {
    const m       = txs.filter(t => isThisMonth(t.date));
    const income  = m.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = m.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const byCat   = {};
    m.filter(t => t.type === 'expense').forEach(t => { byCat[t.cat] = (byCat[t.cat] || 0) + t.amount; });
    return { income, expense, net: income - expense, byCat, txs: m };
  }, [txs]);

  const balance = React.useMemo(() =>
    txs.reduce((s, t) => s + (t.type === 'income' ? t.amount : -t.amount), 0)
  , [txs]);

  /* Build last 6 months of history from real transactions */
  const history = React.useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      months.push({ key, label: MONTHS[d.getMonth()].slice(0, 3), income: 0, expense: 0 });
    }
    txs.forEach(t => {
      const [y, m] = t.date.split('-');
      const key = `${y}-${m}`;
      const slot = months.find(h => h.key === key);
      if (!slot) return;
      if (t.type === 'income')  slot.income  += t.amount;
      else                       slot.expense += t.amount;
    });
    return months.map((h, i) => ({ ...h, current: i === months.length - 1 }));
  }, [txs]);

  const value = {
    txs, cats, catMap, addTx, updateTx, deleteTx, addCat,
    fmt, month, balance, history, currency, loading,
    MONTHS, relDay, fullDay, isThisMonth, NOW: now, user,
  };

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export const useStore = () => React.useContext(StoreCtx);
