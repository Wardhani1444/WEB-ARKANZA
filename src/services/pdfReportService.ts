import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { StoredPromoClaim } from './promoClaimService';

export interface ReportOptions {
  statusFilter?: 'all' | 'active' | 'redeemed';
  generatedBy?: string;
}

/**
 * Helper to format date into Indonesian standard
 */
function formatDateTime(isoString?: string): string {
  if (!isoString) return '-';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return isoString;
  const day = String(d.getDate()).padStart(2, '0');
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const month = monthNames[d.getMonth()];
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day} ${month} ${year}, ${hours}:${minutes} WIB`;
}

function formatDateCompact(isoString?: string): string {
  if (!isoString) return '-';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return isoString;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year}\n${hours}:${minutes}`;
}

/**
 * Generates and downloads an invoice-style PDF audit report for Customer Promo Claims
 */
export function generateInvoiceReportPdf(
  claims: StoredPromoClaim[],
  options: ReportOptions = {}
): void {
  // Setup document: A4 Portrait
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const docNumber = `INV-ARK/${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}/${Math.floor(1000 + Math.random() * 9000)}`;
  const datePrintStr = formatDateTime(now.toISOString());

  // Statistics
  const totalClaims = claims.length;
  const activeClaims = claims.filter((c) => c.status === 'active').length;
  const redeemedClaims = claims.filter((c) => c.status === 'redeemed').length;
  const uniquePhones = new Set(claims.map((c) => c.customerPhone).filter(Boolean)).size;

  // 1. TOP BRANDING BAR
  doc.setFillColor(31, 77, 58); // #1F4D3A - Arkanza Deep Emerald Green
  doc.rect(0, 0, pageWidth, 7, 'F');

  // Gold accent strip
  doc.setFillColor(197, 168, 128); // #C5A880 - Arkanza Warm Gold
  doc.rect(0, 7, pageWidth, 1.5, 'F');

  // 2. INVOICE / REPORT HEADER
  let currentY = 16;

  // Left: Brand Name & Roastery Info
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(31, 77, 58);
  doc.text('ARKANZA COFFEE & ROASTERY', margin, currentY);

  currentY += 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(169, 130, 98); // #A98262
  doc.text('SPECIALTY COFFEE & ARTISAN ROASTERY', margin, currentY);

  currentY += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(80, 80, 80);
  doc.text('Jl. Raya Kebon Agung No.KM 007 No 17, Sambang', margin, currentY);
  currentY += 3.6;
  doc.text('Kebonagung, Kec. Sukodono, Kab. Sidoarjo, Jawa Timur 61258', margin, currentY);
  currentY += 3.6;
  doc.text('WhatsApp: +62 822-4545-8495 | Web: arkanzacoffee.com', margin, currentY);

  // Right: Document Metadata Box (Like an Official Invoice)
  const metaBoxWidth = 72;
  const metaBoxX = pageWidth - margin - metaBoxWidth;
  const metaBoxY = 12;

  doc.setFillColor(248, 246, 242);
  doc.setDrawColor(218, 210, 198);
  doc.roundedRect(metaBoxX, metaBoxY, metaBoxWidth, 27, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(31, 77, 58);
  doc.text('LAPORAN REKAPITULASI KLAIM', metaBoxX + 4, metaBoxY + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(90, 90, 90);
  doc.text('No. Dokumen', metaBoxX + 4, metaBoxY + 10.5);
  doc.text('Tanggal Cetak', metaBoxX + 4, metaBoxY + 15);
  doc.text('Status Filter', metaBoxX + 4, metaBoxY + 19.5);
  doc.text('Operator Kasir', metaBoxX + 4, metaBoxY + 24);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 30, 30);
  doc.text(`: ${docNumber}`, metaBoxX + 23, metaBoxY + 10.5);
  doc.text(`: ${datePrintStr}`, metaBoxX + 23, metaBoxY + 15);
  
  const filterLabel = options.statusFilter === 'active' 
    ? 'Hanya Voucher Aktif' 
    : options.statusFilter === 'redeemed' 
    ? 'Hanya Sudah Digunakan' 
    : 'Semua Status';
  doc.text(`: ${filterLabel}`, metaBoxX + 23, metaBoxY + 19.5);
  doc.text(`: ${options.generatedBy || 'Admin & Kasir'}`, metaBoxX + 23, metaBoxY + 24);

  // Divider Line
  currentY = 43;
  doc.setDrawColor(220, 215, 205);
  doc.setLineWidth(0.5);
  doc.line(margin, currentY, pageWidth - margin, currentY);

  // 3. KPI SUMMARY CARDS (INVOICE STATS)
  currentY += 4;
  const cardWidth = (pageWidth - margin * 2 - 9) / 4;
  const cardHeight = 15;

  const kpis = [
    { label: 'TOTAL KLAIM', val: `${totalClaims} Kupon`, bg: [248, 246, 242], border: [200, 190, 175], text: [31, 77, 58] },
    { label: 'BELUM DITUKAR', val: `${activeClaims} Aktif`, bg: [236, 253, 245], border: [167, 243, 208], text: [5, 150, 105] },
    { label: 'SELESAI DITUKAR', val: `${redeemedClaims} Selesai`, bg: [239, 246, 255], border: [191, 219, 254], text: [37, 99, 235] },
    { label: 'CUSTOMER UNIK', val: `${uniquePhones} Kontak`, bg: [254, 243, 199], border: [253, 230, 138], text: [180, 83, 9] },
  ];

  kpis.forEach((kpi, i) => {
    const cardX = margin + i * (cardWidth + 3);
    doc.setFillColor(kpi.bg[0], kpi.bg[1], kpi.bg[2]);
    doc.setDrawColor(kpi.border[0], kpi.border[1], kpi.border[2]);
    doc.roundedRect(cardX, currentY, cardWidth, cardHeight, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(110, 110, 110);
    doc.text(kpi.label, cardX + cardWidth / 2, currentY + 4.5, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(kpi.text[0], kpi.text[1], kpi.text[2]);
    doc.text(kpi.val, cardX + cardWidth / 2, currentY + 11, { align: 'center' });
  });

  currentY += cardHeight + 4;

  // 4. TABLE SECTION (INVOICE ITEMIZED TABLE)
  const tableData = claims.map((c, index) => {
    const statusText = c.status === 'redeemed' ? 'SUDAH DIGUNAKAN' : 'AKTIF';
    const customerInfo = `${c.customerName || '-'}\nWA: ${c.customerPhone || '-'}`;
    const promoDetail = `${c.promoTitle || '-'}\n[${c.discountTag || '-'}]`;
    const redeemInfo = c.status === 'redeemed' && c.redeemedAt ? formatDateCompact(c.redeemedAt) : '-';

    return [
      String(index + 1),
      formatDateCompact(c.claimedAt),
      customerInfo,
      c.promoCode || '-',
      promoDetail,
      statusText,
      redeemInfo
    ];
  });

  autoTable(doc, {
    startY: currentY,
    head: [[
      'NO',
      'WAKTU KLAIM',
      'DATA CUSTOMER',
      'KODE PROMO',
      'DETAIL DISKON & MENU',
      'STATUS KUPON',
      'WAKTU REDEEM'
    ]],
    body: tableData,
    margin: { left: margin, right: margin, bottom: 25 },
    theme: 'plain',
    headStyles: {
      fillColor: [31, 77, 58], // Emerald Dark
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7.5,
      halign: 'center',
      valign: 'middle',
      cellPadding: 2.5,
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [40, 40, 40],
      cellPadding: 2.5,
      valign: 'middle',
      lineColor: [225, 220, 210],
      lineWidth: 0.2,
    },
    alternateRowStyles: {
      fillColor: [252, 250, 247],
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 8 },
      1: { halign: 'center', cellWidth: 22 },
      2: { halign: 'left', cellWidth: 42 },
      3: { halign: 'center', fontStyle: 'bold', cellWidth: 26 },
      4: { halign: 'left', cellWidth: 40 },
      5: { halign: 'center', fontStyle: 'bold', cellWidth: 26 },
      6: { halign: 'center', cellWidth: 18 },
    },
    didParseCell: (data) => {
      // Color-code status cell
      if (data.section === 'body' && data.column.index === 5) {
        const text = data.cell.text.join('');
        if (text.includes('AKTIF')) {
          data.cell.styles.textColor = [5, 150, 105]; // Green
          data.cell.styles.fillColor = [236, 253, 245];
        } else if (text.includes('SUDAH DIGUNAKAN')) {
          data.cell.styles.textColor = [37, 99, 235]; // Blue
          data.cell.styles.fillColor = [239, 246, 255];
        }
      }
      // Highlight Promo Code
      if (data.section === 'body' && data.column.index === 3) {
        data.cell.styles.textColor = [31, 77, 58];
      }
    },
    didDrawPage: (data) => {
      // Footer page numbering & signature
      const pageCount = (doc.internal as any).getNumberOfPages ? (doc.internal as any).getNumberOfPages() : (doc as any).internal.pages.length - 1;
      const currentPage = data.pageNumber;

      // Bottom Bar
      doc.setFillColor(31, 77, 58);
      doc.rect(0, pageHeight - 5, pageWidth, 5, 'F');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(140, 140, 140);
      doc.text(
        `Arkanza Coffee & Roastery © ${now.getFullYear()} — Sistem Cloud Database & Kasir Voucher Rekap`,
        margin,
        pageHeight - 9
      );

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Halaman ${currentPage}`,
        pageWidth - margin,
        pageHeight - 9,
        { align: 'right' }
      );
    }
  });

  // 5. SIGNATURE & VERIFICATION SECTION (ON LAST PAGE IF SPACE PERMITS)
  const finalY = (doc as any).lastAutoTable?.finalY || currentY + 40;
  
  if (finalY + 32 < pageHeight - 15) {
    const signY = finalY + 8;
    
    // Notes on left
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(80, 80, 80);
    doc.text('CATATAN & LEGALITAS REKAP:', margin, signY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(110, 110, 110);
    doc.text('1. Rekapitulasi ini sah dicetak langsung dari sistem cloud POS Arkanza Coffee & Roastery.', margin, signY + 4);
    doc.text('2. Semua data customer terlindungi sesuai kebijakan privasi membership.', margin, signY + 7.5);
    doc.text('3. Kupon yang sudah berstatus "SUDAH DIGUNAKAN" tidak dapat ditukarkan kembali.', margin, signY + 11);

    // Signature box on right
    const signBoxX = pageWidth - margin - 50;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(60, 60, 60);
    doc.text('Sidoarjo, ' + formatDateTime(now.toISOString()).split(',')[0], signBoxX, signY);
    doc.text('Petugas Kasir & Roastery,', signBoxX, signY + 4);

    doc.setDrawColor(180, 180, 180);
    doc.line(signBoxX, signY + 18, signBoxX + 45, signY + 18);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(31, 77, 58);
    doc.text('( Admin / Kasir Arkanza )', signBoxX, signY + 22);
  }

  // 6. SAVE & DOWNLOAD FILE
  const dateFileStr = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}`;
  const filename = `INVOICE_REKAP_ARKANZA_${dateFileStr}.pdf`;
  doc.save(filename);
}
