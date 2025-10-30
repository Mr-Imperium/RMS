import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, Stepper, Step, StepLabel, Alert, Link, List, ListItem, ListItemText, Divider } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import FileUploader from './FileUploader';
import { parseFile, validateData } from '../../services/importService';
import { supabase } from '../../api/supabaseClient';

/**
 * A multi-step dialog for importing data from CSV/Excel.
 */
const ImportDialog = ({ open, onClose, schema, uniqueKey, dbTable, templateHeaders, onImportSuccess }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [files, setFiles] = useState([]);
    const [parsedData, setParsedData] = useState([]);
    const [validationResult, setValidationResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleReset = () => {
        setActiveStep(0); setFiles([]); setParsedData([]); setValidationResult(null); setError(''); setLoading(false);
    };

    const handleNext = async () => {
        setError('');
        if (activeStep === 0) { // File Upload Step
            if (files.length === 0) { setError('Please select a file to upload.'); return; }
            setLoading(true);
            try {
                const data = await parseFile(files[0]);
                setParsedData(data);
                setActiveStep(1);
            } catch (e) { setError(e.message); }
            setLoading(false);
        } else if (activeStep === 1) { // Validation Step
            setLoading(true);
            const { data: existingRecords } = await supabase.from(dbTable).select(uniqueKey);
            const result = await validateData({ parsedData, schema, uniqueKey, existingRecords });
            setValidationResult(result);
            setLoading(false);
            setActiveStep(2);
        }
    };

    const handleConfirmImport = async () => {
        setLoading(true);
        const dataToUpsert = [...validationResult.validRows, ...validationResult.updateRows];
        const { error: upsertError } = await supabase.from(dbTable).upsert(dataToUpsert, { onConflict: uniqueKey });

        if (upsertError) {
            setError(`Import failed: ${upsertError.message}`);
        } else {
            onImportSuccess();
            handleClose();
        }
        setLoading(false);
    };

    const steps = ['Upload File', 'Validate Data', 'Confirm & Import'];

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Import Data</DialogTitle>
            <DialogContent>
                <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
                    {steps.map(label => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
                </Stepper>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {activeStep === 0 && (
                    <Box>
                        <Typography gutterBottom>Upload a CSV or Excel file. Make sure the columns match the template.</Typography>
                        <Link component="button" variant="body2" onClick={() => downloadTemplate(templateHeaders, dbTable)}>Download Template</Link>
                        <FileUploader onFilesSelected={(f) => setFiles(f)} multiple={false} />
                    </Box>
                )}
                {activeStep === 1 && (
                    <Typography>Click "Next" to validate {parsedData.length} rows...</Typography>
                )}
                {activeStep === 2 && validationResult && (
                    <Box>
                        <Typography variant="h6">Validation Complete</Typography>
                        <Alert severity="success">{validationResult.validRows.length} new rows will be created.</Alert>
                        <Alert severity="info" sx={{my: 1}}>{validationResult.updateRows.length} existing rows will be updated.</Alert>
                        {validationResult.errorRows.length > 0 && (
                           <Alert severity="error">
                                {validationResult.errorRows.length} rows have errors and will be ignored.
                                <List dense>
                                    {validationResult.errorRows.slice(0, 5).map(r => <ListItemText key={r._originalIndex} primary={`Row ${r._originalIndex + 2}: ${r._errors}`} />)}
                                </List>
                           </Alert>
                        )}
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleReset} sx={{mr: 'auto'}}>Reset</Button>
                <Button onClick={onClose}>Cancel</Button>
                {activeStep < 2 && <LoadingButton onClick={handleNext} loading={loading}>Next</LoadingButton>}
                {activeStep === 2 && <LoadingButton onClick={handleConfirmImport} loading={loading} variant="contained">Confirm Import</LoadingButton>}
            </DialogActions>
        </Dialog>
    );
};
export default ImportDialog;