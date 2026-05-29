import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const MONTHS = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

function sortedTxs(txs) {
  return [...txs].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
}

/* ── CSV ─────────────────────────────────────────────────── */
export function exportCSV(txs, catMap) {
  const headers = ['Fecha', 'Tipo', 'Concepto', 'Categoría', 'Importe (€)', 'Nota'];

  const rows = sortedTxs(txs).map(tx => [
    formatDate(tx.date),
    tx.type === 'income' ? 'Ingreso' : 'Gasto',
    tx.name,
    catMap[tx.cat]?.name || '',
    (tx.type === 'income' ? '+' : '-') + tx.amount.toFixed(2),
    tx.note || '',
  ]);

  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(';'))
    .join('\r\n');

  // BOM for Excel to detect UTF-8
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  triggerDownload(blob, `saldo-transacciones-${today()}.csv`);
}

/* ── PDF ─────────────────────────────────────────────────── */
export function exportPDF(txs, catMap, balance, currency) {
  const doc    = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const symbol = currency === 'USD' ? '$' : '€';
  const now    = new Date();

  const totalIncome  = txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  /* ── Header ── */
  doc.setFillColor(99, 89, 233);
  doc.roundedRect(14, 12, 182, 28, 4, 4, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Saldo · Finanzas personales', 20, 23);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Exportado el ${now.getDate()} de ${MONTHS[now.getMonth()]} de ${now.getFullYear()}`, 20, 31);
  doc.text(`Total de movimientos: ${txs.length}`, 130, 31);

  /* ── Summary cards ── */
  doc.setTextColor(22, 24, 29);

  const cards = [
    { label: 'Saldo total',  value: fmt(balance,      symbol), color: [99, 89, 233] },
    { label: 'Ingresos',     value: '+' + fmt(totalIncome,  symbol), color: [17, 163, 107] },
    { label: 'Gastos',       value: '-' + fmt(totalExpense, symbol), color: [239, 91, 76]  },
  ];

  cards.forEach((c, i) => {
    const x = 14 + i * 62;
    doc.setFillColor(248, 248, 246);
    doc.roundedRect(x, 46, 58, 22, 3, 3, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(92, 96, 107);
    doc.text(c.label, x + 5, 53);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...c.color);
    doc.text(c.value, x + 5, 62);
  });

  /* ── Transactions table ── */
  doc.setTextColor(22, 24, 29);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Historial de movimientos', 14, 80);

  autoTable(doc, {
    startY: 84,
    head: [['Fecha', 'Concepto', 'Categoría', 'Tipo', 'Importe']],
    body: sortedTxs(txs).map(tx => [
      formatDate(tx.date),
      tx.name,
      catMap[tx.cat]?.name || '—',
      tx.type === 'income' ? 'Ingreso' : 'Gasto',
      (tx.type === 'income' ? '+' : '–') + fmt(tx.amount, symbol),
    ]),
    headStyles: {
      fillColor: [99, 89, 233],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: { fontSize: 8.5, textColor: [22, 24, 29] },
    alternateRowStyles: { fillColor: [248, 248, 246] },
    columnStyles: {
      0: { cellWidth: 22 },
      1: { cellWidth: 55 },
      2: { cellWidth: 38 },
      3: { cellWidth: 22 },
      4: { cellWidth: 30, halign: 'right', fontStyle: 'bold' },
    },
    didDrawCell(data) {
      // Color income/expense amounts
      if (data.section === 'body' && data.column.index === 4) {
        const isIncome = String(data.cell.text).startsWith('+');
        doc.setTextColor(isIncome ? 17 : 239, isIncome ? 163 : 91, isIncome ? 107 : 76);
      }
    },
    margin: { left: 14, right: 14 },
  });

  /* ── Footer ── */
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(154, 158, 169);
    doc.text(`Saldo · Página ${i} de ${pageCount}`, 14, 290);
    doc.text('saldo-finanzas-ephl.vercel.app', 140, 290);
  }

  doc.save(`saldo-transacciones-${today()}.pdf`);
}

/* ── Helpers ─────────────────────────────────────────────── */
function fmt(amount, symbol) {
  return symbol + new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(amount));
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a   = document.createElement('a');
  a.href    = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
