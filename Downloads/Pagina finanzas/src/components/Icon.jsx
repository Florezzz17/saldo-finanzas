import React from 'react';

const ICON_PATHS = {
  // nav
  home:     <><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5"/><path d="M9.5 21v-6h5v6"/></>,
  list:     <><path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><circle cx="3.5" cy="6" r="1.2"/><circle cx="3.5" cy="12" r="1.2"/><circle cx="3.5" cy="18" r="1.2"/></>,
  grid:     <><rect x="3" y="3" width="7.5" height="7.5" rx="2.2"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2.2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2.2"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2.2"/></>,
  chart:    <><path d="M4 21V4"/><path d="M4 21h17"/><rect x="7" y="11" width="3.2" height="7" rx="1"/><rect x="13" y="7" width="3.2" height="11" rx="1"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M12 2.5v2.5M12 19v2.5M21.5 12H19M5 12H2.5M18.7 5.3l-1.8 1.8M7.1 16.9l-1.8 1.8M18.7 18.7l-1.8-1.8M7.1 7.1 5.3 5.3"/></>,
  // ui
  plus:     <><path d="M12 5v14M5 12h14"/></>,
  search:   <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></>,
  filter:   <><path d="M3 5h18M6 12h12M10 19h4"/></>,
  x:        <><path d="M18 6 6 18M6 6l12 12"/></>,
  chevR:    <><path d="m9 5 7 7-7 7"/></>,
  chevD:    <><path d="m6 9 6 6 6-6"/></>,
  pencil:   <><path d="M17 3.5a2.1 2.1 0 0 1 3 3L8 18.5l-4 1 1-4Z"/></>,
  trash:    <><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"/></>,
  sun:      <><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.5M12 19.5V22M22 12h-2.5M4.5 12H2M19 5l-1.8 1.8M6.8 17.2 5 19M19 19l-1.8-1.8M6.8 6.8 5 5"/></>,
  moon:     <><path d="M20 13.5A8 8 0 1 1 10.5 4 6.3 6.3 0 0 0 20 13.5Z"/></>,
  check:    <><path d="m4 12.5 5 5 11-11"/></>,
  arrowUp:  <><path d="M12 19V6M6 11l6-6 6 6"/></>,
  arrowDown:<><path d="M12 5v13M6 13l6 6 6-6"/></>,
  calendar: <><rect x="3.5" y="5" width="17" height="16" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/></>,
  download: <><path d="M12 4v11M7 11l5 5 5-5M5 20h14"/></>,
  shield:   <><path d="M12 3 5 6v6c0 4.2 3 7.5 7 9 4-1.5 7-4.8 7-9V6Z"/></>,
  bell:     <><path d="M18 9a6 6 0 1 0-12 0c0 5-2.2 6.5-2.2 6.5h16.4S18 14 18 9Z"/><path d="M10 19a2 2 0 0 0 4 0"/></>,
  wallet:   <><path d="M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v0H5"/><rect x="3" y="7" width="18" height="13" rx="3"/><circle cx="16.5" cy="13.5" r="1.4"/></>,
  card:     <><rect x="2.5" y="5" width="19" height="14" rx="3"/><path d="M2.5 9.5h19"/></>,
  globe:    <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18"/></>,
  cloud:    <><path d="M7 18a4 4 0 0 1-.5-7.97A5.5 5.5 0 0 1 17.5 11 3.5 3.5 0 0 1 17 18Z"/></>,
  logout:   <><path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3M15 8l4 4-4 4M19 12H9"/></>,
  user:     <><circle cx="12" cy="8" r="4"/><path d="M4 20c0-3.5 3.6-6 8-6s8 2.5 8 6"/></>,
  // category glyphs
  cart:     <><circle cx="9" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/><path d="M2.5 3h2.2l2 12.3a1.5 1.5 0 0 0 1.5 1.2h8.8a1.5 1.5 0 0 0 1.5-1.2L20 7H5.5"/></>,
  utensils: <><path d="M7 3v8a2 2 0 0 1-4 0V3M5 3v18M15 3c-1.5 1-2 3-2 5s.5 3 2 3 2-1 2-3-.5-4-2-5ZM17 11v10"/></>,
  car:      <><path d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11M4 11h16a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1Z"/><circle cx="7.5" cy="17" r="1.3"/><circle cx="16.5" cy="17" r="1.3"/></>,
  house:    <><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z"/><path d="M9.5 21v-6h5v6"/></>,
  film:     <><rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 9h18M3 15h18M8 4v16M16 4v16"/></>,
  heart:    <><path d="M12 20s-7-4.3-9.2-8.5C1.3 8.6 2.6 5 6 5c2 0 3.2 1.4 4 2.6C10.8 6.4 12 5 14 5c3.4 0 4.7 3.6 3.2 6.5C19 15.7 12 20 12 20Z"/></>,
  bag:      <><path d="M6 8h12l1 12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></>,
  repeat:   <><path d="M4 8a6 6 0 0 1 10-2l2 2M20 16a6 6 0 0 1-10 2l-2-2"/><path d="M16 4v4h-4M8 20v-4h4"/></>,
  coffee:   <><path d="M4 8h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5Z"/><path d="M17 9h2a2.5 2.5 0 0 1 0 5h-2M7 2.5v2M11 2.5v2"/></>,
  bolt:     <><path d="M13 2 4 14h7l-1 8 9-12h-7Z"/></>,
  briefcase:<><rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7M3 12h18"/></>,
  gift:     <><rect x="3.5" y="9" width="17" height="12" rx="2"/><path d="M3.5 13h17M12 9v12M12 9S10.5 4 8 5.2 9.5 9 12 9Zm0 0s1.5-5 4-3.8S14.5 9 12 9Z"/></>,
  plane:    <><path d="M10.5 13.5 3 11l1-2 8 1 4.5-5.2a2 2 0 0 1 3 2.6L14.5 12l1 8-2 1Z"/></>,
  book:     <><path d="M5 4h11a2 2 0 0 1 2 2v15l-7-3-7 3V6a2 2 0 0 1 1-2Z"/></>,
  phone:    <><rect x="6.5" y="2.5" width="11" height="19" rx="3"/><path d="M10.5 18.5h3"/></>,
  dumbbell: <><path d="M6 8v8M3.5 9.5v5M18 8v8M20.5 9.5v5M6 12h12"/></>,
  paw:      <><circle cx="8" cy="9" r="1.6"/><circle cx="16" cy="9" r="1.6"/><circle cx="5.5" cy="13" r="1.5"/><circle cx="18.5" cy="13" r="1.5"/><path d="M12 13c-2.5 0-4 2-4 4a2.5 2.5 0 0 0 5 0c0-.5 1.5-.5 1.5 0a2.5 2.5 0 0 0 5 0c0-2-1.5-4-4-4"/></>,
  dots:     <><circle cx="12" cy="5" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="12" cy="19" r="1.4"/></>,
  flag:     <><path d="M4 21V5"/><path d="M4 5h13l-3.5 5 3.5 5H4"/></>,
  piggy:    <><path d="M19 10c0 3.9-3.1 7-7 7s-7-3.1-7-7 3.1-7 7-7c1.4 0 2.7.4 3.8 1.1"/><path d="M19 10h2v3h-2"/><path d="M8 14s.8 2 4 2 4-2 4-2"/><circle cx="9.5" cy="9.5" r="1"/><path d="M17 6l2-2"/></>,
  star:     <><path d="M12 2l3.1 6.3L22 9.3l-5 4.9 1.2 6.9L12 18l-6.2 3.1 1.2-6.9-5-4.9 6.9-1z"/></>,
};

export function Icon({ name, size = 22, stroke = 2, fill = "none", color = "currentColor", style }) {
  const p = ICON_PATHS[name];
  if (!p) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
         stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
         style={style} aria-hidden="true">
      {p}
    </svg>
  );
}

export default Icon;
