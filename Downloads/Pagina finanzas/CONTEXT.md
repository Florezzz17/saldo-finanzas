# Saldo — Finanzas personales

App web de finanzas personales. Vite + React + Supabase + Vercel.

## URLs
| | URL |
|---|---|
| Producción | https://saldo-finanzas-ephl.vercel.app |
| GitHub | https://github.com/Florezzz17/saldo-finanzas |
| Supabase | https://supabase.com/dashboard/project/doiunbfsihbymcvhxcup |
| Vercel env vars | https://vercel.com/finanzas-fa4735f7/saldo-finanzas-ephl/settings/environment-variables |

## Stack
- **Frontend:** Vite + React 18, CSS puro con variables CSS
- **Backend:** Supabase (PostgreSQL + RLS + Auth)
- **Deploy:** Vercel — auto-deploy al hacer push a `main`
- **Auth:** Google OAuth (implicit flow)
- **Librerías:** jspdf + jspdf-autotable (exportar PDF)

## ⚠️ Git — leer antes de hacer commits
El repo git está raíz en el home del usuario (`C:\Users\santi\`).
El proyecto vive en `Downloads/Pagina finanzas/`.
**Nunca usar `git add -A` — agregaría todo el directorio home.**

```bash
cd "C:\Users\santi\Downloads\Pagina finanzas"
git add src/archivo.jsx          # siempre archivos específicos
git commit -m "descripción"
git push
```

## Estructura
```
src/
├── App.jsx              # Auth gate (Google OAuth) + layout raíz + routing
├── styles.css           # Diseño responsive (mobile bottom nav / desktop sidebar)
├── lib/
│   ├── supabase.js      # Cliente Supabase (implicit flow)
│   └── export.js        # Exportar CSV y PDF
├── store/
│   └── StoreContext.jsx # Estado global: txs, cats, goals + CRUD contra Supabase
├── components/
│   ├── Icon.jsx         # Set de iconos SVG (flag, piggy, star incluidos)
│   ├── ui.jsx           # CatIcon, TxRow, BottomNav (6 tabs), Fab, Sheet, Donut, Bars
│   ├── IOSDevice.jsx    # Frame iOS (sin usar, conservado)
│   └── TweaksPanel.jsx  # Panel tweaks (sin usar, conservado)
└── screens/
    ├── AuthScreen.jsx   # Login con Google
    ├── Dashboard.jsx    # Saldo, resumen mensual, top categorías, últimos movimientos
    ├── AddSheet.jsx     # Modal agregar/editar transacción
    ├── Movimientos.jsx  # Historial con búsqueda y filtros
    ├── Categorias.jsx   # Gestión de categorías con presupuestos
    ├── Estadisticas.jsx # Donut + barras evolución 6 meses + más usadas
    ├── Metas.jsx        # Metas de ahorro completas
    └── Configuracion.jsx # Tema, moneda, exportar, logout
supabase/
└── schema.sql           # Schema BD (ya ejecutado en Supabase)
```

## Base de datos
| Tabla | Columnas clave |
|---|---|
| `profiles` | id (= auth.uid), name, email |
| `categories` | id, user_id, name, icon, color, type, budget, position |
| `transactions` | id, user_id, type, amount, category_id, name, note, date |
| `savings_goals` | id, user_id, name, icon, color, target, saved, deadline, note |

- RLS activado en todas las tablas
- Trigger `on_auth_user_created`: crea perfil + 13 categorías por defecto al registrarse

## Navegación (6 tabs)
`home` → `movs` → `cats` → `stats` → `metas` → `config`

## Monedas
USD y COP. Locale `es-CO`. Default: USD.

## Funcionalidades implementadas
- [x] Diseño responsive (mobile / tablet / desktop)
- [x] Modo oscuro/claro + color de acento + moneda USD/COP
- [x] Login con Google OAuth
- [x] CRUD transacciones e ingresos
- [x] CRUD categorías con presupuestos mensuales
- [x] Dashboard con saldo total, resumen mensual, top categorías, últimos movimientos
- [x] Movimientos con búsqueda y filtros por tipo/categoría
- [x] Estadísticas: distribución donut + evolución 6 meses + más usadas
- [x] Exportar CSV (compatible Excel, separador ;, BOM UTF-8)
- [x] Exportar PDF (header con acento, resumen de saldo, tabla completa)
- [x] Metas de ahorro: crear, agregar/retirar dinero, editar, eliminar
- [x] Badges automáticos en metas: "Completada" y alerta de plazo
- [x] Perfil del usuario con nombre e imagen de Google
- [x] Logout

## Ideas para próximas sesiones
- [ ] Alertas al superar presupuesto por categoría
- [ ] Selector de rango de fechas en exportación
- [ ] Gráfico de gastos por semana
- [ ] Modo demo sin login
- [ ] Notificaciones / recordatorios
