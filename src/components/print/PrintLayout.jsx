import React, { useEffect } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { useAppSelector } from '../../app/hooks';
import { selectAllSettings } from '../../features/settings/settingsSlice';

/**
 * A wrapper component for all print-specific pages.
 * It provides a consistent header/footer and applies print styles.
 * @param {object} props
 * @param {React.ReactNode} props.children - The content to be printed.
 * @param {string} props.documentTitle - The title of the document.
 */
const PrintLayout = ({ children, documentTitle }) => {
    const settings = useAppSelector(selectAllSettings);

    // Automatically trigger the print dialog when the component mounts
    useEffect(() => {
        window.print();
    }, []);

    return (
        <Box className="print-container" sx={{ p: 3, backgroundColor: '#fff' }}>
            <header>
                <Typography variant="h4" component="h1" gutterBottom>
                    {settings.company_name || 'Recruitment Management System'}
                </Typography>
                <Typography variant="h6" component="h2" color="text.secondary">
                    {documentTitle}
                </Typography>
                <Divider sx={{ my: 2 }} />
            </header>
            <main>
                {children}
            </main>
            {/* A footer could be added here if needed */}
        </Box>
    );
};

export default PrintLayout;