
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Student, Transaction } from '../types';
import { formatCurrency } from './utils';

// --- Configuration ---
// Instructions: Paste your Google Drive Link inside the quotes.
// If the image does not load due to CORS, convert your image to Base64 and paste the long string here instead.
const SCHOOL_LOGO = "https://drive.google.com/file/d/1-EoFPUZzWgms4VoE5uoYXBwOphg8Fz1J/view?usp=sharing";

const BRAND_COLORS = {
  primary: [4, 120, 87], // #047857 (Green)
  secondary: [249, 115, 22], // #F97316 (Orange)
  danger: [220, 38, 38], // #DC2626 (Red)
  text: [13, 18, 27], // #0d121b
  gray: [75, 85, 99], // #4b5563
  lightGray: [243, 244, 246] // #f3f4f6
};

// Generic info for other reports (Student List, Financial Report)
const SCHOOL_INFO = {
  name: "ESCOLA SEIVA DA NAÇÃO",
  subtitle: "Ensino Primário",
  address: "Av. Samora Machel, Bairro de Mussumbuluco",
  contact: "Cell: 842 696 623 | NUIT: 107 698 558"
};

// --- Helpers ---

const addHeader = (doc: jsPDF, title: string) => {
  const pageWidth = doc.internal.pageSize.width;
  
  // Logo Fallback
  if (SCHOOL_LOGO && SCHOOL_LOGO.length > 10) {
    try {
        doc.addImage(SCHOOL_LOGO, 'JPEG', 14, 10, 20, 20);
    } catch (e) {
        // Silent fail or console warn
    }
  } else {
    doc.setFillColor(BRAND_COLORS.primary[0], BRAND_COLORS.primary[1], BRAND_COLORS.primary[2]);
    doc.circle(24, 20, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("S", 22, 23);
  }

  // School Info
  doc.setTextColor(BRAND_COLORS.primary[0], BRAND_COLORS.primary[1], BRAND_COLORS.primary[2]);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(SCHOOL_INFO.name, 40, 18);

  doc.setTextColor(BRAND_COLORS.gray[0], BRAND_COLORS.gray[1], BRAND_COLORS.gray[2]);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(SCHOOL_INFO.subtitle, 40, 24);
  
  doc.setFontSize(8);
  doc.text(SCHOOL_INFO.address, 40, 29);
  doc.text(SCHOOL_INFO.contact, 40, 33);

  // Line
  doc.setDrawColor(BRAND_COLORS.primary[0], BRAND_COLORS.primary[1], BRAND_COLORS.primary[2]);
  doc.setLineWidth(0.5);
  doc.line(14, 40, pageWidth - 14, 40);

  // Title
  doc.setFontSize(14);
  doc.setTextColor(BRAND_COLORS.text[0], BRAND_COLORS.text[1], BRAND_COLORS.text[2]);
  doc.setFont("helvetica", "bold");
  doc.text(title, 14, 50);
  
  // Date
  const today = new Date().toLocaleDateString('pt-PT');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(`Gerado em: ${today}`, pageWidth - 14, 15, { align: 'right' });
};

const addFooter = (doc: jsPDF) => {
  const pageCount = doc.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Página ${i} de ${pageCount} - Seiva da Nação (Gestão Integrada)`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }
};

// --- Exports ---

export const generateStudentListPDF = (students: Student[], className: string = "Geral") => {
  const doc = new jsPDF();
  addHeader(doc, `Lista de Alunos - ${className}`);

  const tableColumn = ["#", "Nome Completo", "Matrícula", "Classe", "Gênero", "Status"];
  const tableRows: any[] = [];

  students.forEach((student, index) => {
    tableRows.push([
      index + 1,
      student.name,
      student.enrollmentId,
      student.grade,
      student.personal.gender === 'M' ? 'Masc' : 'Fem',
      student.status === 'active' ? 'Ativo' : 'Inativo',
    ]);
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 55,
    theme: 'striped',
    headStyles: {
      fillColor: BRAND_COLORS.primary as any,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    styles: { fontSize: 9, cellPadding: 3 },
    alternateRowStyles: { fillColor: [240, 253, 244] }
  });

  addFooter(doc);
  const filename = `lista_alunos_${className.toLowerCase().replace(/\s/g, '_')}_${new Date().getTime()}.pdf`;
  doc.save(filename);
};

export const generateFinancialReportPDF = (transactions: Transaction[], periodLabel: string) => {
  const doc = new jsPDF();
  addHeader(doc, `Relatório Financeiro - ${periodLabel}`);

  const income = transactions.filter(t => t.type === 'income' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expense;

  const startY = 60;
  
  // KPI Boxes
  doc.setDrawColor(200, 200, 200);
  
  // Income
  doc.setFillColor(240, 253, 244); 
  doc.roundedRect(14, startY, 55, 25, 2, 2, 'FD');
  doc.setFontSize(9);
  doc.setTextColor(BRAND_COLORS.primary[0], BRAND_COLORS.primary[1], BRAND_COLORS.primary[2]);
  doc.text("Total Entradas", 20, startY + 8);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(formatCurrency(income), 20, startY + 18);

  // Expense
  doc.setFillColor(254, 242, 242); 
  doc.roundedRect(77, startY, 55, 25, 2, 2, 'FD');
  doc.setFontSize(9);
  doc.setTextColor(BRAND_COLORS.danger[0], BRAND_COLORS.danger[1], BRAND_COLORS.danger[2]);
  doc.text("Total Saídas", 83, startY + 8);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(formatCurrency(expense), 83, startY + 18);

  // Balance
  doc.setFillColor(243, 244, 246);
  doc.roundedRect(140, startY, 55, 25, 2, 2, 'FD');
  doc.setFontSize(9);
  doc.setTextColor(BRAND_COLORS.text[0], BRAND_COLORS.text[1], BRAND_COLORS.text[2]);
  doc.text("Saldo Líquido", 146, startY + 8);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(formatCurrency(balance), 146, startY + 18);

  const tableColumn = ["Data", "Descrição", "Categoria", "Tipo", "Método", "Valor"];
  const tableRows = transactions.map(t => [
    t.date,
    t.description,
    t.category,
    t.type === 'income' ? 'Entrada' : 'Saída',
    t.method,
    formatCurrency(t.amount)
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: startY + 35,
    headStyles: { fillColor: BRAND_COLORS.primary as any },
    styles: { fontSize: 8 },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 5) {
        if (data.row.raw[3] === 'Saída') {
          data.cell.styles.textColor = BRAND_COLORS.danger as any;
        } else {
          data.cell.styles.textColor = BRAND_COLORS.primary as any;
        }
      }
    }
  });

  addFooter(doc);
  doc.save(`relatorio_financeiro_${periodLabel.toLowerCase().replace(/\s/g, '_')}.pdf`);
};

/**
 * Generates a Dual Receipt (Landscape A4 split in two).
 * Includes automatic image detection, dynamic table positioning, and proper footers.
 */
export const generateDualReceiptPDF = (transaction: Transaction) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 297;
  const pageHeight = 210;
  const halfWidth = pageWidth / 2;
  
  // Dashed Split Line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.setLineDashPattern([3, 3], 0);
  doc.line(halfWidth, 10, halfWidth, pageHeight - 10);
  doc.setLineDashPattern([], 0);

  // --- Parse Data ---
  const payerName = transaction.description.includes('Aluno:') 
      ? transaction.description.split('Aluno:')[1].trim() 
      : "Enc. / Pagador";
  
  const refInfo = transaction.category + " - " + (transaction.paidMonths?.join(', ') || transaction.description);

  // --- Render Loop (2 Copies) ---
  [0, halfWidth].forEach((offsetX, index) => {
    const isSchoolCopy = index === 0;
    
    // 1. Draw Logo
    try {
      if (SCHOOL_LOGO) {
        // Attempt to draw image
        // X = 10 + offsetX, Y = 10, W = 25, H = 25
        doc.addImage(SCHOOL_LOGO, 'JPEG', 10 + offsetX, 10, 25, 25);
      }
    } catch (error) {
      console.warn("Logo could not be loaded", error);
      // Fallback Circle
      doc.setFillColor(BRAND_COLORS.primary[0], BRAND_COLORS.primary[1], BRAND_COLORS.primary[2]);
      doc.circle(22 + offsetX, 22, 12, 'F');
    }

    // 2. Draw Header Text (Shifted right to accommodate logo)
    const textStartX = 40 + offsetX;
    
    // Title
    doc.setTextColor(BRAND_COLORS.primary[0], BRAND_COLORS.primary[1], BRAND_COLORS.primary[2]);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("ESCOLA SEIVA DA NAÇÃO", textStartX, 15);

    // Address & Info Block
    doc.setTextColor(55, 65, 81); // Dark Gray (#374151)
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    
    const headerLines = [
        "Av. Samora Machel",
        "Bairro de Mussumbuluco",
        "No 90/1 e 90/1/C",
        "Cell: 842 696 623 / 877 236 290",
        "NUIT: 107 698 558",
        "Matola - Moçambique"
    ];

    let currentY = 20;
    headerLines.forEach((line) => {
        doc.text(line, textStartX, currentY);
        currentY += 3.5;
    });

    // Separator Line
    doc.setDrawColor(BRAND_COLORS.primary[0], BRAND_COLORS.primary[1], BRAND_COLORS.primary[2]);
    doc.setLineWidth(0.5);
    doc.line(offsetX + 10, currentY + 2, offsetX + halfWidth - 10, currentY + 2);

    // 3. Receipt Title
    const titleY = currentY + 12;
    doc.setFontSize(14);
    doc.setTextColor(BRAND_COLORS.primary[0], BRAND_COLORS.primary[1], BRAND_COLORS.primary[2]);
    doc.setFont("helvetica", "bold");
    doc.text("RECIBO DE PAGAMENTO", offsetX + (halfWidth / 2), titleY, { align: 'center' });
    
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(isSchoolCopy ? "VIA DA ESCOLA" : "VIA DO ENCARREGADO", offsetX + (halfWidth / 2), titleY + 5, { align: 'center' });

    // 4. Info Box
    const boxY = titleY + 10;
    doc.setFillColor(BRAND_COLORS.lightGray[0], BRAND_COLORS.lightGray[1], BRAND_COLORS.lightGray[2]);
    doc.roundedRect(offsetX + 10, boxY, halfWidth - 20, 24, 2, 2, 'F');

    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    
    // Left
    doc.text("Recebemos de:", offsetX + 14, boxY + 6);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(BRAND_COLORS.text[0], BRAND_COLORS.text[1], BRAND_COLORS.text[2]);
    doc.text(payerName, offsetX + 14, boxY + 11);
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Referente a:", offsetX + 14, boxY + 16);
    doc.setTextColor(BRAND_COLORS.text[0], BRAND_COLORS.text[1], BRAND_COLORS.text[2]);
    doc.text(refInfo.substring(0, 45) + (refInfo.length > 45 ? '...' : ''), offsetX + 14, boxY + 20);

    // Right
    const rightAlignX = offsetX + halfWidth - 14;
    doc.setTextColor(100, 100, 100);
    doc.text("Data:", rightAlignX, boxY + 6, { align: 'right' });
    doc.setTextColor(BRAND_COLORS.text[0], BRAND_COLORS.text[1], BRAND_COLORS.text[2]);
    doc.setFont("helvetica", "bold");
    doc.text(new Date(transaction.date).toLocaleDateString('pt-PT'), rightAlignX, boxY + 11, { align: 'right' });
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Recibo Nº:", rightAlignX, boxY + 16, { align: 'right' });
    doc.setTextColor(BRAND_COLORS.text[0], BRAND_COLORS.text[1], BRAND_COLORS.text[2]);
    doc.text(`#${transaction.id.toUpperCase().substring(0, 8)}`, rightAlignX, boxY + 20, { align: 'right' });

    // 5. Transaction Table
    autoTable(doc, {
        startY: boxY + 30,
        head: [['Descrição', 'Método', 'Valor']],
        body: [[
            transaction.description,
            transaction.method,
            formatCurrency(transaction.amount)
        ]],
        theme: 'striped',
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: { 
            fillColor: BRAND_COLORS.primary as any,
            textColor: [255, 255, 255],
            fontStyle: 'bold'
        },
        columnStyles: {
            0: { cellWidth: 'auto' },
            1: { cellWidth: 30 },
            2: { cellWidth: 30, halign: 'right' }
        },
        margin: { left: offsetX + 10 },
        tableWidth: halfWidth - 20,
    });

    // 6. Dynamic Footer (Using lastAutoTable.finalY)
    const finalY = (doc as any).lastAutoTable.finalY;
    const footerY = finalY + 6;

    // Subtotal (Size 8, Gray)
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(75, 85, 99);
    doc.text("Subtotal:", 95 + offsetX, footerY, { align: 'right' }); 
    doc.text(formatCurrency(transaction.amount), 138 + offsetX, footerY, { align: 'right' });

    // TOTAL (Size 10, Bold, Orange, Right Aligned)
    doc.setFontSize(10); 
    doc.setFont("helvetica", "bold");
    doc.setTextColor(249, 115, 22); // Orange #F97316
    doc.text("TOTAL A PAGAR:", 95 + offsetX, footerY + 5, { align: 'right' });
    doc.text(formatCurrency(transaction.amount), 138 + offsetX, footerY + 5, { align: 'right' });

    // Signature
    doc.setDrawColor(200, 200, 200);
    doc.line(20 + offsetX, footerY + 20, 128 + offsetX, footerY + 20);
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    doc.text("O Tesoureiro / A Secretaria", 74 + offsetX, footerY + 24, { align: 'center' });

    // Footer Branding
    doc.setFontSize(6);
    doc.setTextColor(180, 180, 180);
    doc.text("Documento processado por computador - Seiva da Nação", 74 + offsetX, 195, { align: "center" });
  });

  doc.save(`recibo_duplo_${transaction.id}.pdf`);
};
