import fs from 'fs';
import path from 'path';
import { jsPDF } from 'jspdf';
import { MENU_BOOK_PAGES } from '../src/data/pdfMenuData';

function buildPdf() {
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

      // Decorative borders
      doc.setDrawColor(217, 163, 94);
      doc.setLineWidth(0.8);
      doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

      doc.setTextColor(217, 163, 94); // Gold
      doc.setFontSize(32);
      doc.setFont('times', 'bold');
      doc.text('ARKANZA', pageWidth / 2, 70, { align: 'center' });

      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(230, 210, 180);
      doc.text('COFFEE & ROASTERY', pageWidth / 2, 80, { align: 'center' });

      doc.setFontSize(54);
      doc.setFont('times', 'bold');
      doc.setTextColor(217, 163, 94);
      doc.text('MENU', pageWidth / 2, 125, { align: 'center' });

      doc.setFontSize(26);
      doc.setFont('times', 'italic');
      doc.setTextColor(247, 246, 242);
      doc.text('Happiness for all!', pageWidth / 2, 155, { align: 'center' });

      doc.setFontSize(11);
      doc.setTextColor(190, 215, 200);
      doc.text('Daftar Menu & Informasi Lengkap (47 Halaman)', pageWidth / 2, 240, { align: 'center' });

      doc.setFontSize(9.5);
      doc.setTextColor(160, 180, 170);
      doc.text('Jl. Raya Kebon Agung KM 007, No. 17, Sukodono, Sidoarjo', pageWidth / 2, 260, { align: 'center' });
      doc.text('WhatsApp: 081 125 512 006 | Instagram: @arkanzacoffeeandroastery', pageWidth / 2, 267, { align: 'center' });
      return;
    }

    // Other special pages (Photo collages, divider)
    if (page.pageNumber === 2 || page.pageNumber === 3 || page.pageNumber === 10 || page.pageNumber === 40 || page.pageNumber === 46 || page.pageNumber === 47) {
      doc.setFillColor(28, 22, 19); // Warm dark coffee
      doc.rect(0, 0, pageWidth, pageHeight, 'F');

      doc.setDrawColor(217, 163, 94);
      doc.setLineWidth(0.5);
      doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

      doc.setTextColor(217, 163, 94);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(page.category.toUpperCase(), pageWidth / 2, 35, { align: 'center' });

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(26);
      doc.setFont('times', 'bold');
      doc.text(page.title, pageWidth / 2, 50, { align: 'center' });

      if (page.subtitle) {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(220, 220, 220);
        doc.text(page.subtitle, pageWidth / 2, 60, { align: 'center' });
      }

      doc.setFontSize(32);
      doc.setFont('times', 'italic');
      doc.setTextColor(232, 212, 162);
      doc.text('Happiness for all!', pageWidth / 2, 140, { align: 'center' });

      if (page.contactInfo) {
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(20, 180, pageWidth - 40, 60, 3, 3, 'F');
        doc.setTextColor(31, 77, 58);
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text('INFORMASI OPERASIONAL & RESERVASI', pageWidth / 2, 195, { align: 'center' });

        doc.setFontSize(9.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(50, 50, 50);
        doc.text(`Telepon / WhatsApp: ${page.contactInfo.phone || '-'}`, 30, 207);
        doc.text(`Instagram: ${page.contactInfo.instagram || '-'}`, 30, 215);
        doc.text(`Alamat: ${page.contactInfo.address || '-'}`, 30, 223);
        doc.text(`Jam Buka: Weekdays 9:00 - 23:00 | Weekend 9:00 - 24:00`, 30, 231);
      }

      doc.setTextColor(180, 180, 180);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.text(`Halaman ${page.pageNumber} dari 47`, pageWidth / 2, pageHeight - 16, { align: 'center' });
      return;
    }

    // Standard Content Pages
    doc.setFillColor(248, 246, 240); // Soft warm parchment
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Header bar
    doc.setFillColor(31, 77, 58); // Emerald
    doc.rect(15, 12, pageWidth - 30, 1.5, 'F');

    doc.setTextColor(110, 110, 110);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(page.category.toUpperCase(), 15, 9);
    doc.text('ARKANZA COFFEE & ROASTERY', pageWidth - 15, 9, { align: 'right' });

    // Page Title
    doc.setTextColor(25, 25, 25);
    doc.setFontSize(18);
    doc.setFont('times', 'bold');
    doc.text(page.title, pageWidth / 2, 22, { align: 'center' });

    if (page.subtitle) {
      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(90, 90, 90);
      doc.text(page.subtitle, pageWidth / 2, 28, { align: 'center' });
    }

    // Items list
    let currentY = 36;
    if (page.items && page.items.length > 0) {
      page.items.forEach((item) => {
        // Item card
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(15, currentY, pageWidth - 30, 19, 2, 2, 'F');
        doc.setDrawColor(225, 220, 210);
        doc.setLineWidth(0.3);
        doc.roundedRect(15, currentY, pageWidth - 30, 19, 2, 2, 'D');

        // Item Name
        doc.setTextColor(20, 20, 20);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(item.name, 20, currentY + 6.5);

        // Price badge
        doc.setFillColor(217, 83, 30); // Warm reddish orange
        doc.roundedRect(pageWidth - 45, currentY + 3.5, 24, 7, 2, 2, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9.5);
        doc.setFont('helvetica', 'bold');
        doc.text(item.price, pageWidth - 33, currentY + 8.2, { align: 'center' });

        // Description
        if (item.description) {
          doc.setTextColor(100, 100, 100);
          doc.setFontSize(8);
          doc.setFont('helvetica', 'normal');
          const splitDesc = doc.splitTextToSize(item.description, pageWidth - 75);
          doc.text(splitDesc, 20, currentY + 13);
        }

        currentY += 22;
      });
    }

    // Benefits (e.g. for Meeting Room)
    if (page.benefits && page.benefits.length > 0) {
      currentY += 2;
      doc.setFillColor(235, 245, 240);
      doc.roundedRect(15, currentY, pageWidth - 30, 24, 2, 2, 'F');
      doc.setDrawColor(31, 77, 58);
      doc.setLineWidth(0.4);
      doc.roundedRect(15, currentY, pageWidth - 30, 24, 2, 2, 'D');

      doc.setTextColor(31, 77, 58);
      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'bold');
      doc.text('Fasilitas & Keuntungan Termasuk:', 20, currentY + 7);

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50, 60, 55);
      const benText = doc.splitTextToSize(page.benefits.join('   •   '), pageWidth - 40);
      doc.text(benText, 20, currentY + 14);
    }

    // Footer page number
    doc.setTextColor(140, 140, 140);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Arkanza Coffee & Roastery — Halaman ${page.pageNumber} dari 47`, pageWidth / 2, pageHeight - 8, { align: 'center' });
  });

  const outputDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, 'buku-menu-arkanza.pdf');
  const pdfBytes = doc.output('arraybuffer');
  fs.writeFileSync(outputPath, Buffer.from(pdfBytes));
  console.log('Successfully generated', outputPath, 'size:', fs.statSync(outputPath).size, 'bytes');
}

buildPdf();
