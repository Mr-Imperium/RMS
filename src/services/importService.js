import { read, utils } from 'xlsx';

/**
 * Reads a file (Excel or CSV) and parses it into an array of objects.
 * @param {File} file - The file to parse.
 * @returns {Promise<Array<object>>} A promise that resolves with the parsed data.
 */
export const parseFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target.result;
        const workbook = read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = utils.sheet_to_json(worksheet);
        resolve(json);
      } catch (e) {
        reject(new Error("Error parsing file. Please ensure it's a valid CSV or Excel file."));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
};

/**
 * Validates parsed data against a schema and existing records.
 * @param {object} params
 * @param {Array<object>} params.parsedData - Data from the parsed file.
 * @param {import('yup').ObjectSchema} params.schema - A Yup schema for row-level validation.
 * @param {string} params.uniqueKey - The key to check for duplicates (e.g., 'passport_no').
 * @param {Array<object>} params.existingRecords - Records from the DB to check against.
 * @returns {Promise<{validRows: Array, errorRows: Array, updateRows: Array}>}
 */
export const validateData = async ({ parsedData, schema, uniqueKey, existingRecords }) => {
    const validRows = [];
    const errorRows = [];
    const updateRows = [];

    const existingKeys = new Set(existingRecords.map(r => r[uniqueKey]));

    for (const [index, row] of parsedData.entries()) {
        try {
            await schema.validate(row, { abortEarly: false });
            
            if (existingKeys.has(row[uniqueKey])) {
                updateRows.push({ ...row, _originalIndex: index });
            } else {
                validRows.push({ ...row, _originalIndex: index });
            }
        } catch (validationError) {
            errorRows.push({
                ...row,
                _originalIndex: index,
                _errors: validationError.inner.map(e => `${e.path}: ${e.message}`).join(', '),
            });
        }
    }
    return { validRows, errorRows, updateRows };
};