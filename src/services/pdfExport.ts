import jsPDF from 'jspdf';
import { Lot } from '../models/types';
import { calculateLotStats, calculateTransportStats, formatCurrency, formatWeight, formatDate } from '../utils/calculations';

/**
 * Export a lot as PDF
 */
export function exportLotAsPDF(lot: Lot): void {
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  // Helper to add new page if needed
  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('JubGoong - รายงานการจับ', margin, yPosition);
  yPosition += 10;

  // Date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${formatDate(new Date())}`, margin, yPosition);
  yPosition += 15;

  // Lot Info
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`การจับ: ${lot.name}`, margin, yPosition);
  yPosition += 7;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Created: ${formatDate(lot.createdAt)}`, margin, yPosition);
  yPosition += 7;
  doc.text(`Default Basket Weight: ${formatWeight(lot.defaultBasketWeight)}`, margin, yPosition);
  yPosition += 15;

  // Lot Statistics
  const lotStats = calculateLotStats(lot);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary Statistics', margin, yPosition);
  yPosition += 7;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Transports: ${lotStats.transportCount}`, margin, yPosition);
  yPosition += 5;
  doc.text(`Total Baskets: ${lotStats.totalBaskets}`, margin, yPosition);
  yPosition += 5;
  doc.text(`Total Weight: ${formatWeight(lotStats.totalWeight)}`, margin, yPosition);
  yPosition += 5;
  doc.text(`Shrimp Weight: ${formatWeight(lotStats.totalShrimpWeight)}`, margin, yPosition);
  yPosition += 5;
  doc.text(`Total Value: ${formatCurrency(lotStats.totalValue)}`, margin, yPosition);
  yPosition += 15;

  // Transports
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Transports', margin, yPosition);
  yPosition += 10;

  lot.transports.forEach((transport, index) => {
    checkPageBreak(80);

    const transportStats = calculateTransportStats(transport);

    // Transport header
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`${index + 1}. ${transport.name}`, margin, yPosition);
    yPosition += 7;

    // Transport details
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Basket Weight: ${formatWeight(transport.basketWeight)}`, margin + 5, yPosition);
    yPosition += 5;
    doc.text(`Baskets: ${transportStats.basketCount} | Total: ${formatWeight(transportStats.totalWeight)} | Shrimp: ${formatWeight(transportStats.shrimpWeight)}`, margin + 5, yPosition);
    yPosition += 5;

    // Show remain shrimp if exists
    if (transportStats.remainCount > 0) {
      doc.setFont('helvetica', 'italic');
      doc.text(`Remain Shrimp: ${transportStats.remainCount} entries | ${formatWeight(transportStats.remainWeight)} (pure shrimp)`, margin + 5, yPosition);
      yPosition += 5;
      doc.setFont('helvetica', 'normal');
    }

    doc.text(`Price/kg: ${formatCurrency(transport.pricePerKg)} | Deduction: ${transport.deductionPercentage}%`, margin + 5, yPosition);
    yPosition += 5;
    doc.text(`Base Price: ${formatCurrency(transportStats.basePrice)} | Deduction: ${formatCurrency(transportStats.deduction)} | Final: ${formatCurrency(transportStats.finalPrice)}`, margin + 5, yPosition);
    yPosition += 8;

    // Basket list
    if (transport.baskets.length > 0) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      doc.text('Baskets:', margin + 5, yPosition);
      yPosition += 5;

      transport.baskets.forEach((basket, bIndex) => {
        checkPageBreak(5);
        doc.setFont('helvetica', 'normal');
        doc.text(`  ${bIndex + 1}. ${formatWeight(basket.weight)} - ${formatDate(basket.timestamp)}`, margin + 10, yPosition);
        yPosition += 4;
      });
    }

    yPosition += 8;
  });

  // Save PDF
  doc.save(`JubGoong-${lot.name}-${new Date().toISOString().split('T')[0]}.pdf`);
}
