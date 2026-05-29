/* data.jsx — categories, seed transactions, helpers, store context */

const CATEGORIES = [
  // expense
  { id: "super",  name: "Supermercado",   icon: "cart",      color: "#2f9e6f", type: "expense", budget: 350 },
  { id: "resto",  name: "Restaurantes",   icon: "utensils",  color: "#f0883e", type: "expense", budget: 200 },
  { id: "trans",  name: "Transporte",     icon: "car",       color: "#4b8df0", type: "expense", budget: 130 },
  { id: "casa",   name: "Vivienda",       icon: "house",     color: "#7c6cf0", type: "expense", budget: 900 },
  { id: "ocio",   name: "Ocio",           icon: "film",      color: "#e85ca0", type: "expense", budget: 100 },
  { id: "salud",  name: "Salud",          icon: "heart",     color: "#ef5b6b", type: "expense", budget: 80 },
  { id: "compras",name: "Compras",        icon: "bag",       color: "#d4a23a", type: "expense", budget: 200 },
  { id: "subs",   name: "Suscripciones",  icon: "repeat",    color: "#00b3c4", type: "expense", budget: 60 },
  { id: "cafe",   name: "Café",           icon: "coffee",    color: "#b07a4f", type: "expense", budget: 50 },
  { id: "serv",   name: "Servicios",      icon: "bolt",      color: "#6aa84f", type: "expense", budget: 160 },
  // income
  { id: "nomina", name: "Nómina",         icon: "wallet",    color: "#11a36b", type: "income" },
  { id: "free",   name: "Freelance",      icon: "briefcase", color: "#4b8df0", type: "income" },
  { id: "otros",  name: "Otros ingresos", icon: "gift",      color: "#7c6cf0", type: "income" },
];

const CAT_MAP = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));

let _id = 100;
const uid = () => "t" + (++_id);

const SEED = [
  { type: "expense", name: "Mercadona",            cat: "super",  amount: 47.30,  date: "2026-05-28", note: "Compra semanal" },
  { type: "expense", name: "Starbucks",            cat: "cafe",   amount: 4.20,   date: "2026-05-28" },
  { type: "expense", name: "Cabify",               cat: "trans",  amount: 12.50,  date: "2026-05-27", note: "Vuelta a casa" },
  { type: "expense", name: "Spotify",              cat: "subs",   amount: 11.99,  date: "2026-05-27" },
  { type: "expense", name: "Glovo",                cat: "resto",  amount: 18.90,  date: "2026-05-26", note: "Cena viernes" },
  { type: "expense", name: "Iberdrola",            cat: "serv",   amount: 64.10,  date: "2026-05-25", note: "Luz mayo" },
  { type: "expense", name: "Zara",                 cat: "compras",amount: 39.95,  date: "2026-05-24" },
  { type: "expense", name: "Lidl",                 cat: "super",  amount: 31.20,  date: "2026-05-23" },
  { type: "expense", name: "Netflix",              cat: "subs",   amount: 13.99,  date: "2026-05-22" },
  { type: "expense", name: "Renfe",                cat: "trans",  amount: 24.00,  date: "2026-05-21", note: "Billete Madrid" },
  { type: "expense", name: "Farmacia Sanz",        cat: "salud",  amount: 9.80,   date: "2026-05-20" },
  { type: "expense", name: "Filmin",               cat: "ocio",   amount: 7.99,   date: "2026-05-19" },
  { type: "expense", name: "La Tagliatella",       cat: "resto",  amount: 42.50,  date: "2026-05-18", note: "Cumple Marta" },
  { type: "income",  name: "Proyecto web",         cat: "free",   amount: 650.00, date: "2026-05-15", note: "Cliente Estudio Norte" },
  { type: "expense", name: "Amazon",               cat: "compras",amount: 22.40,  date: "2026-05-16" },
  { type: "expense", name: "Gimnasio McFit",       cat: "salud",  amount: 19.99,  date: "2026-05-15", note: "Cuota mensual" },
  { type: "expense", name: "Mercadona",            cat: "super",  amount: 53.75,  date: "2026-05-14" },
  { type: "expense", name: "Vodafone",             cat: "serv",   amount: 29.99,  date: "2026-05-12", note: "Fibra + móvil" },
  { type: "expense", name: "Uber Eats",            cat: "resto",  amount: 16.30,  date: "2026-05-10" },
  { type: "expense", name: "El Corte Inglés",      cat: "compras",amount: 78.20,  date: "2026-05-08" },
  { type: "expense", name: "Café Central",         cat: "cafe",   amount: 3.50,   date: "2026-05-06" },
  { type: "expense", name: "Alquiler piso",        cat: "casa",   amount: 850.00, date: "2026-05-05", note: "Mayo" },
  { type: "expense", name: "Cine Yelmo",           cat: "ocio",   amount: 11.00,  date: "2026-05-04" },
  { type: "expense", name: "Carrefour",            cat: "super",  amount: 28.60,  date: "2026-05-03" },
  { type: "expense", name: "Abono transporte",     cat: "trans",  amount: 54.60,  date: "2026-05-02", note: "Mensual" },
  { type: "income",  name: "Nómina Estudio Norte", cat: "nomina", amount: 2150.00,date: "2026-05-01", note: "Salario mayo" },
].map(t => ({ id: uid(), ...t }));

const INITIAL_BALANCE = 4200;

// fixed history for trend/comparison charts (income, expense) — current month appended at runtime
const HISTORY = [
  { key: "2025-12", label: "Dic", income: 2800, expense: 2090 },
  { key: "2026-01", label: "Ene", income: 2150, expense: 1685 },
  { key: "2026-02", label: "Feb", income: 2980, expense: 1820 },
  { key: "2026-03", label: "Mar", income: 2150, expense: 1560 },
  { key: "2026-04", label: "Abr", income: 3100, expense: 1990 },
];

/* ── helpers ── */
const CUR = { EUR: { code: "EUR", locale: "es-ES" }, USD: { code: "USD", locale: "es-ES" } };

function makeFmt(currency) {
  const c = CUR[currency] || CUR.EUR;
  const f = new Intl.NumberFormat(c.locale, { style: "currency", currency: c.code, minimumFractionDigits: 2 });
  const f0 = new Intl.NumberFormat(c.locale, { style: "currency", currency: c.code, maximumFractionDigits: 0 });
  return { full: (n) => f.format(n), round: (n) => f0.format(n) };
}

const MONTHS = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
const DOW = ["dom","lun","mar","mié","jue","vie","sáb"];
const NOW = new Date("2026-05-28T10:00:00");

function parseD(s) { const [y,m,d] = s.split("-").map(Number); return new Date(y, m-1, d); }

function relDay(dateStr) {
  const d = parseD(dateStr);
  const diff = Math.round((new Date(NOW.getFullYear(),NOW.getMonth(),NOW.getDate()) - d) / 86400000);
  if (diff === 0) return "Hoy";
  if (diff === 1) return "Ayer";
  if (diff < 7) return DOW[d.getDay()] + ". " + d.getDate();
  return d.getDate() + " " + MONTHS[d.getMonth()].slice(0,3);
}
function fullDay(dateStr) {
  const d = parseD(dateStr);
  return DOW[d.getDay()] + ", " + d.getDate() + " " + MONTHS[d.getMonth()];
}
function isThisMonth(dateStr) {
  const d = parseD(dateStr);
  return d.getMonth() === NOW.getMonth() && d.getFullYear() === NOW.getFullYear();
}

/* ── store context ── */
const StoreCtx = React.createContext(null);

function StoreProvider({ children, currency }) {
  const [txs, setTxs] = React.useState(SEED);
  const [cats, setCats] = React.useState(CATEGORIES);

  const addTx = (tx) => setTxs(prev => [{ id: uid(), ...tx }, ...prev]);
  const updateTx = (id, patch) => setTxs(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));
  const deleteTx = (id) => setTxs(prev => prev.filter(t => t.id !== id));
  const addCat = (cat) => setCats(prev => [...prev.slice(0, prev.findIndex(c=>c.type==="income")), { id: "c"+Date.now(), type: "expense", budget: 150, ...cat }, ...prev.slice(prev.findIndex(c=>c.type==="income"))]);

  const fmt = React.useMemo(() => makeFmt(currency), [currency]);
  const catMap = React.useMemo(() => Object.fromEntries(cats.map(c => [c.id, c])), [cats]);

  // derived for current month
  const month = React.useMemo(() => {
    const m = txs.filter(t => isThisMonth(t.date));
    const income = m.filter(t => t.type === "income").reduce((s,t) => s + t.amount, 0);
    const expense = m.filter(t => t.type === "expense").reduce((s,t) => s + t.amount, 0);
    const byCat = {};
    m.filter(t => t.type === "expense").forEach(t => { byCat[t.cat] = (byCat[t.cat]||0) + t.amount; });
    return { income, expense, net: income - expense, byCat, txs: m };
  }, [txs]);

  const balance = React.useMemo(() =>
    INITIAL_BALANCE + txs.reduce((s,t) => s + (t.type === "income" ? t.amount : -t.amount), 0)
  , [txs]);

  const history = React.useMemo(() =>
    [...HISTORY, { key: "2026-05", label: "May", income: month.income, expense: month.expense }]
  , [month]);

  const value = { txs, cats, catMap, addTx, updateTx, deleteTx, addCat, fmt, month, balance, history, currency, MONTHS, relDay, fullDay, isThisMonth, NOW, CATEGORIES };
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

const useStore = () => React.useContext(StoreCtx);

Object.assign(window, { StoreProvider, useStore, CATEGORIES, CAT_MAP, relDay, fullDay });
