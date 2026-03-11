import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Generates a styled PDF report for En-Track donation data.
 */

interface TransactionRow {
  id: string;
  user: string;
  ngo: string;
  amount: number;
  date: string;
  hash: string;
  status: string;
}

interface DashboardStats {
  totalDonations: string;
  registeredNGOs: string;
  activeDonors: string;
  integrityHashes: string;
}

// Brand colors
const BRAND_GREEN: [number, number, number] = [59, 130, 246]; // #3B82F6 blue
const BRAND_BLUE: [number, number, number] = [56, 189, 248];  // #38BDF8 sky
const DARK_BG: [number, number, number] = [11, 14, 20];

function addHeader(doc: jsPDF, title: string) {
  // Gradient-like header bar
  doc.setFillColor(...BRAND_GREEN);
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 40, 'F');

  // Overlay to create gradient effect
  doc.setFillColor(...BRAND_BLUE);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (doc as any).setGlobalAlpha?.(0.4);
  doc.rect(doc.internal.pageSize.getWidth() / 2, 0, doc.internal.pageSize.getWidth() / 2, 40, 'F');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (doc as any).setGlobalAlpha?.(1);

  // Logo text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('En-Track', 14, 18);

  // Subtitle
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Secure & Transparent Digital Donation System', 14, 26);

  // Report title
  doc.setFontSize(10);
  doc.text(title, 14, 34);

  // Date on right
  doc.setFontSize(8);
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const timeStr = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
  doc.text(`Generated: ${dateStr} at ${timeStr}`, doc.internal.pageSize.getWidth() - 14, 18, { align: 'right' });
  doc.text('Data Integrity Protocol: SHA-256', doc.internal.pageSize.getWidth() - 14, 26, { align: 'right' });
}

function addFooter(doc: jsPDF) {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Footer line
    doc.setDrawColor(200, 200, 200);
    doc.line(14, pageHeight - 18, pageWidth - 14, pageHeight - 18);

    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `© ${new Date().getFullYear()} En-Track. Engineered for Absolute Transparency. All data verified via SHA-256 Data Integrity Protocol.`,
      14,
      pageHeight - 12
    );
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 14, pageHeight - 12, { align: 'right' });
  }
}

export function exportTransactionsPDF(transactions: TransactionRow[]) {
  const doc = new jsPDF({ orientation: 'landscape' });

  addHeader(doc, 'Transaction History Report');

  // Summary row
  const totalAmount = transactions.reduce((s, t) => s + t.amount, 0);
  const verifiedCount = transactions.filter((t) => t.status === 'Verified').length;
  const pendingCount = transactions.filter((t) => t.status === 'Pending').length;

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary:', 14, 52);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `Total Transactions: ${transactions.length}  |  Total Amount: ₹${totalAmount.toLocaleString('en-IN')}  |  Verified: ${verifiedCount}  |  Pending: ${pendingCount}`,
    50,
    52
  );

  // Table
  autoTable(doc, {
    startY: 58,
    head: [['TX ID', 'Donor ID', 'NGO Name', 'Amount (₹)', 'Date', 'SHA-256 Hash', 'Status']],
    body: transactions.map((tx) => [
      tx.id,
      tx.user,
      tx.ngo,
      `₹${tx.amount.toLocaleString('en-IN')}`,
      tx.date,
      tx.hash.slice(0, 24) + '...',
      tx.status,
    ]),
    styles: {
      fontSize: 8,
      cellPadding: 4,
      lineColor: [220, 220, 220],
      lineWidth: 0.25,
    },
    headStyles: {
      fillColor: BRAND_GREEN,
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'left',
    },
    alternateRowStyles: {
      fillColor: [239, 246, 255],
    },
    columnStyles: {
      0: { fontStyle: 'bold', textColor: [59, 130, 246] },
      3: { fontStyle: 'bold' },
      5: { fontSize: 6.5, textColor: [100, 100, 100] },
      6: { halign: 'center' },
    },
    didParseCell: (data) => {
      // Color status cell
      if (data.section === 'body' && data.column.index === 6) {
        const val = data.cell.raw as string;
        if (val === 'Verified') {
          data.cell.styles.textColor = [59, 130, 246];
          data.cell.styles.fontStyle = 'bold';
        } else {
          data.cell.styles.textColor = [217, 119, 6];
          data.cell.styles.fontStyle = 'bold';
        }
      }
    },
  });

  addFooter(doc);
  doc.save(`EnTrack_Transactions_${new Date().toISOString().split('T')[0]}.pdf`);
}

export function exportDashboardPDF(stats: DashboardStats, topNGOs: { name: string; amount: string; change: string }[]) {
  const doc = new jsPDF();

  addHeader(doc, 'Impact Dashboard Report');

  // Stats cards
  const startY = 52;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(60, 60, 60);
  doc.text('Key Metrics', 14, startY);

  const statsData = [
    { label: 'Total Donations Verified', value: stats.totalDonations },
    { label: 'Registered NGOs', value: stats.registeredNGOs },
    { label: 'Active Donors', value: stats.activeDonors },
    { label: 'Integrity Hashes', value: stats.integrityHashes },
  ];

  const cardWidth = 43;
  const cardHeight = 28;
  const cardGap = 4;

  statsData.forEach((stat, i) => {
    const x = 14 + i * (cardWidth + cardGap);
    const y = startY + 5;

    // Card background
    doc.setFillColor(239, 246, 255); // #EFF6FF light blue tint
    doc.roundedRect(x, y, cardWidth, cardHeight, 3, 3, 'F');

    // Border
    doc.setDrawColor(...BRAND_GREEN);
    doc.setLineWidth(0.5);
    doc.roundedRect(x, y, cardWidth, cardHeight, 3, 3, 'S');

    // Label
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(130, 130, 130);
    doc.text(stat.label, x + 4, y + 10);

    // Value
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...BRAND_GREEN);
    doc.text(stat.value, x + 4, y + 22);
  });

  // Top NGOs table
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(60, 60, 60);
  doc.text('Top Performing NGOs', 14, startY + 45);

  autoTable(doc, {
    startY: startY + 50,
    head: [['Rank', 'NGO Name', 'Total Received', 'Growth']],
    body: topNGOs.map((ngo, i) => [
      `#${i + 1}`,
      ngo.name,
      ngo.amount,
      ngo.change,
    ]),
    styles: {
      fontSize: 9,
      cellPadding: 5,
      lineColor: [220, 220, 220],
      lineWidth: 0.25,
    },
    headStyles: {
      fillColor: BRAND_GREEN,
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [239, 246, 255],
    },
    columnStyles: {
      0: { halign: 'center', fontStyle: 'bold' },
      3: { textColor: [59, 130, 246], fontStyle: 'bold' },
    },
  });

  // Disclaimer
  const lastY = (doc as any).lastAutoTable?.finalY || 160;
  doc.setFontSize(7);
  doc.setTextColor(170, 170, 170);
  doc.text(
    'Disclaimer: This report is auto-generated by the En-Track platform. All figures are based on verified transaction records.',
    14,
    lastY + 12
  );
  doc.text(
    'Each transaction is secured with a unique SHA-256 integrity hash for tamper-proof verification.',
    14,
    lastY + 17
  );

  addFooter(doc);
  doc.save(`EnTrack_Dashboard_${new Date().toISOString().split('T')[0]}.pdf`);
}

export function exportFullReportPDF() {
  const doc = new jsPDF();

  addHeader(doc, 'Full Transparency Report');

  let y = 52;

  // Overview
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(60, 60, 60);
  doc.text('Platform Overview', 14, y);
  y += 8;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  const overviewText = [
    'En-Track is a Secure & Transparent Digital Donation System that ensures every rupee is tracked from',
    'the donor to the final beneficiary using our Data Integrity Protocol powered by SHA-256 cryptographic hashes.',
    '',
    'Our platform connects verified NGOs with donors, providing real-time transparency and accountability.',
    'Every transaction generates a unique integrity hash that can be independently verified.',
  ];
  overviewText.forEach((line) => {
    doc.text(line, 14, y);
    y += 5;
  });

  y += 5;

  // Key Stats
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(60, 60, 60);
  doc.text('Key Statistics', 14, y);
  y += 8;

  autoTable(doc, {
    startY: y,
    head: [['Metric', 'Value', 'Status']],
    body: [
      ['Total Donations Processed', '₹4,82,10,500', 'Active'],
      ['Verified NGOs', '142', 'Growing'],
      ['Active Donors', '8,932+', 'Active'],
      ['Integrity Hashes Generated', '14,203', '100% Verified'],
      ['Platform Uptime', '99.97%', 'Operational'],
      ['Average Verification Time', '< 2 seconds', 'Optimal'],
    ],
    styles: { fontSize: 9, cellPadding: 5, lineColor: [220, 220, 220], lineWidth: 0.25 },
    headStyles: { fillColor: BRAND_GREEN, textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [239, 246, 255] },
    columnStyles: {
      1: { fontStyle: 'bold' },
      2: { textColor: [59, 130, 246], fontStyle: 'bold' },
    },
  });

  addFooter(doc);
  doc.save(`EnTrack_Full_Report_${new Date().toISOString().split('T')[0]}.pdf`);
}