import React from 'react';
import { Button } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

/**
 * A button that opens a new window/tab to a print-friendly URL.
 * The browser's print dialog (or save as PDF) is triggered automatically.
 * @param {object} props
 * @param {string} props.printUrl - The URL of the print-specific page (e.g., '/print/candidate/uuid').
 */
const PrintButton = ({ printUrl }) => {
    const handlePrint = () => {
        // Open the print-specific route in a new tab. The PrintLayout will trigger the print dialog.
        window.open(printUrl, '_blank');
    };

    return (
        <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            className="no-print" // This class hides the button itself when printing
        >
            Print / Save as PDF
        </Button>
    );
};

export default PrintButton;