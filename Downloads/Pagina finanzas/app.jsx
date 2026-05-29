/* app.jsx — root: device frame, routing, modal, tweaks. */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "dark": false,
  "accent": "#6359e9",
  "currency": "EUR",
  "font": "Manrope"
}/*EDITMODE-END*/;

const FONT_STACK = {
  "Manrope": '"Manrope", -apple-system, system-ui, sans-serif',
  "Sistema": '-apple-system, "SF Pro", system-ui, sans-serif',
};

function App({ t, setTweak }) {
  const [tab, setTab] = React.useState("home");
  const [sheet, setSheet] = React.useState(null); // null | {editing}

  const openAdd = () => setSheet({ editing: null });
  const openTx = (tx) => setSheet({ editing: tx });
  const closeSheet = () => setSheet(null);

  const showFab = tab === "home" || tab === "movs";

  let screen;
  if (tab === "home") screen = <Dashboard onAdd={openAdd} onGoto={setTab} onOpenTx={openTx} />;
  else if (tab === "movs") screen = <Movimientos onOpenTx={openTx} />;
  else if (tab === "cats") screen = <Categorias />;
  else if (tab === "stats") screen = <Estadisticas />;
  else screen = <Configuracion dark={t.dark} setDark={v => setTweak("dark", v)} currency={t.currency} setCurrency={v => setTweak("currency", v)} accent={t.accent} setAccent={v => setTweak("accent", v)} />;

  return (
    <div className="app" data-theme={t.dark ? "dark" : undefined}
         style={{ "--accent": t.accent, "--font": FONT_STACK[t.font] || FONT_STACK.Manrope }}>
      <div className="scroll" key={tab}>{screen}</div>
      {showFab && <Fab onClick={openAdd} />}
      <BottomNav active={tab} onChange={setTab} />
      {sheet && <AddSheet editing={sheet.editing} onClose={closeSheet} />}
    </div>
  );
}

function Root() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  return (
    <StoreProvider currency={t.currency}>
      <div className="stage" style={{
        background: t.dark
          ? "radial-gradient(80% 70% at 50% -10%, #1a1a24 0%, transparent 60%), linear-gradient(180deg, #121216 0%, #0c0c0f 100%)"
          : "radial-gradient(80% 70% at 50% -10%, #e9e9f4 0%, transparent 60%), linear-gradient(180deg, #ededeb 0%, #e3e3e1 100%)",
        transition: "background .4s ease",
      }}>
        <IOSDevice dark={t.dark}>
          <App t={t} setTweak={setTweak} />
        </IOSDevice>
      </div>

      <TweaksPanel>
        <TweakSection label="Tema" />
        <TweakToggle label="Modo oscuro" value={t.dark} onChange={v => setTweak("dark", v)} />
        <TweakColor label="Acento" value={t.accent}
          options={["#6359e9", "#0ea5a4", "#f59e0b", "#e85ca0", "#3b82f6"]}
          onChange={v => setTweak("accent", v)} />
        <TweakSection label="Formato" />
        <TweakRadio label="Moneda" value={t.currency} options={["EUR", "USD"]} onChange={v => setTweak("currency", v)} />
        <TweakRadio label="Tipografía" value={t.font} options={["Manrope", "Sistema"]} onChange={v => setTweak("font", v)} />
      </TweaksPanel>
    </StoreProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
