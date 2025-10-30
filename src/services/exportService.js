import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

/**
 * Generates and downloads a CSV/Excel template with specified headers.
 * @param {string[]} headers - An array of header strings.
 * @param {string} fileName - The name of the file to be downloaded.
 */
export const downloadTemplate = (headers, fileName) => {
    // Create an empty worksheet with just the headers
    const ws = utils.aoa_to_sheet([headers]);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Template');
    writeFile(wb, `${fileName}_template.xlsx`);
};

/**
 * Exports data to an Excel file (.xlsx).
 * @param {Array<object>} data - The array of data objects.
 * @param {string} fileName - The name for the exported file.
 */
export const exportToExcel = (data, fileName) => {
    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Data');
    writeFile(wb, `${fileName}.xlsx`);
};

/**
 * Exports data to a PDF file.
 * @param {object} params
 * @param {string} params.title - The title of the document.
 * @param {Array<{header: string, dataKey: string}>} params.columns - Column definitions.
 * @param {Array<object>} params.data - The data to export.
 * @param {string} params.fileName - The name for the exported file.
 */
export const exportToPdf = ({ title, columns, data, fileName }) => {
    const doc = new jsPDF();
    const tableHeader = columns.map(c => c.header);
    const tableBody = data.map(row => columns.map(c => row[c.dataKey] || ''));

    doc.text(title, 14, 15);
    doc.autoTable({
        head: [tableHeader],
        body: tableBody,
    });
    doc.save(`${fileName}.pdf`);
};