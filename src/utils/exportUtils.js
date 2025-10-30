import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

/**
 * Exports data to an Excel file.
 * @param {Array<object>} data - The array of data to export.
 * @param {Array<string>} columns - Array of keys to include in the export.
 * @param {string} fileName - The name of the file to be saved.
 */
export const exportToExcel = (data, columns, fileName) => {
  const worksheetData = data.map(item => {
    const row = {};
    columns.forEach(col => {
      row[col] = item[col];
    });
    return row;
  });
  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
  XLSX.writeFile(workbook, `${fileName}_${new Date().toLocaleDateString()}.xlsx`);
};

/**
 * Exports data to a PDF file.
 * @param {Array<object>} data - The array of data to export.
 * @param {Array<{header: string, dataKey: string}>} columns - Array of column definitions.
 * @param {string} title - The title of the report.
 * @param {string} fileName - The name of the file to be saved.
 */
export const exportToPdf = (data, columns, title, fileName) => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Report generated on: ${format(new Date(), 'MMM d, yyyy')}`, 14, 30);

  doc.autoTable({
    head: [columns.map(c => c.header)],
    body: data.map(item => columns.map(c => item[c.dataKey])),
    startY: 35,
  });
  
  doc.save(`${fileName}_${new Date().toLocaleDateString()}.pdf`);
};