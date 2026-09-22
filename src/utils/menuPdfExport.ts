import jsPDF from 'jspdf';
import { MENU_BOOK_PAGES } from '../data/pdfMenuData';

export const generateMenuPdf = () => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  MENU_BOOK_PAGES.forEach((page, index) => {
    if (index > 0) {
      doc.addPage();
    }

    // Cover page styling
    if (page.pageNumber === 1) {
      doc.setFillColor(7, 36, 24); // Dark emerald green
      doc.rect(0, 0, pageWidth, pageHeight, 'F');

      doc.setTextColor(217, 163, 94); // Gold
      doc.setFontSize(28);
      doc.setFont('times', 'bold');
      doc.text('ARKANZA', pageWidth / 2, 80, { align: 'center' });

      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text('COFFEE & ROASTERY', pageWidth / 2, 90, { align: 'center' });

      doc.setFontSize(48);
      doc.setFont('times', 'bold');
      doc.text('MENU', pageWidth / 2, 130, { align: 'center' });

      doc.setFontSize(22);
      doc.setFont('times', 'italic');
      doc.setTextColor(247, 246, 242);
      doc.text('Happiness for all!', pageWidth / 2, 160, { align: 'center' });

      doc.setFontSize(10);
      doc.setTextColor(180, 200, 190);
      doc.text('Jl. Raya Kebon Agung KM 007, No. 17, Sukodono, Sidoarjo', pageWidth / 2, 260, { align: 'center' });
      return;
    }

    // Standard Page styling
    doc.setFillColor(247, 246, 242); // Warm off-white
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Header bar
    doc.setFillColor(31, 77, 58); // Emerald
    doc.rect(15, 15, pageWidth - 30, 2, 'F');

    doc.setTextColor(120, 120, 120);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(page.category.toUpperCase(), 15, 12);
    doc.text('ARKANZA COFFEE & ROASTERY', pageWidth - 15, 12, { align: 'right' });

    // Page Title
    doc.setTextColor(25, 25, 25);
    doc.setFontSize(20);
    doc.setFont('times', 'bold');
    doc.text(page.title, pageWidth / 2, 28, { align: 'center' });

    if (page.subtitle) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(100, 100, 100);
      doc.text(page.subtitle, pageWidth / 2, 34, { align: 'center' });
    }

    // Items
    let currentY = 46;
    if (page.items && page.items.length > 0) {
      page.items.forEach((item) => {
        // Item box
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(15, currentY, pageWidth - 30, 20, 2, 2, 'F');
        doc.setDrawColor(220, 220, 220);
        doc.roundedRect(15, currentY, pageWidth - 30, 20, 2, 2, 'D');

        // Item Name
        doc.setTextColor(20, 20, 20);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(item.name, 20, currentY + 7);

        // Price badge
        doc.setFillColor(230, 81, 0); // Orange
        doc.roundedRect(pageWidth - 45, currentY + 3, 25, 7, 2, 2, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(item.price, pageWidth - 32.5, currentY + 8, { align: 'center' });

        // Description
        if (item.description) {
          doc.setTextColor(90, 90, 90);
          doc.setFontSize(8.5);
          doc.setFont('helvetica', 'normal');
          const splitDesc = doc.splitTextToSize(item.description, pageWidth - 75);
          doc.text(splitDesc, 20, currentY + 14);
        }

        currentY += 24;
      });
    }

    // Benefits (e.g. for Meeting Room)
    if (page.benefits && page.benefits.length > 0) {
      currentY += 4;
      doc.setTextColor(31, 77, 58);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Fasilitas Termasuk:', 15, currentY);

      currentY += 6;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      doc.text(page.benefits.join(' • '), 15, currentY);
    }

    // Contact info (page 47)
    if (page.contactInfo) {
      currentY += 10;
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(15, currentY, pageWidth - 30, 45, 3, 3, 'F');
      doc.setDrawColor(31, 77, 58);
      doc.roundedRect(15, currentY, pageWidth - 30, 45, 3, 3, 'D');

      doc.setTextColor(31, 77, 58);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('INFORMASI OPERASIONAL & RESERVASI', 20, currentY + 10);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50, 50, 50);
      doc.text(`Telepon / WhatsApp: ${page.contactInfo.phone || '-'}`, 20, currentY + 18);
      doc.text(`Instagram: ${page.contactInfo.instagram || '-'} | TikTok: ${page.contactInfo.tiktok || '-'}`, 20, currentY + 25);
      doc.text(`Alamat: ${page.contactInfo.address || '-'}`, 20, currentY + 32);
      doc.text(`Jam Operasional: Weekday ${page.contactInfo.hoursWeekday || '-'} | Weekend ${page.contactInfo.hoursWeekend || '-'}`, 20, currentY + 39);
    }

    // Footer page number
    doc.setTextColor(140, 140, 140);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Halaman ${page.pageNumber} dari ${MENU_BOOK_PAGES.length}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
  });

  doc.save('Buku-Menu-Arkanza-Happiness-For-All.pdf');
};
