import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, TextField, Grid, Divider } from '@mui/material';
import { useAppDispatch } from '../../../app/hooks';
import { setNotification } from '../../../features/ui/uiSlice';
import { supabase } from '../../../api/supabaseClient';
import { uploadEntityFile, deleteFile } from '../../../services/fileService';
import { STORAGE_BUCKETS } from '../../../utils/constants';
import FileUploader from '../../common/FileUploader';
import FileList from '../../common/FileList';
import ConfirmDialog from '../../common/ConfirmDialog';

const CandidateDocumentsTab = ({ candidateId }) => {
    const dispatch = useAppDispatch();
    const [filesToUpload, setFilesToUpload] = useState([]);
    const [documentType, setDocumentType] = useState('Resume');
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deleteInfo, setDeleteInfo] = useState({ open: false, fileId: null, filePath: null });

    const fetchDocuments = useCallback(async () => {
        setLoading(true);
        const { data } = await supabase.from('candidate_documents').select('*').eq('candidate_id', candidateId);
        setUploadedFiles(data || []);
        setLoading(false);
    }, [candidateId]);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    const handleUpload = async () => {
        if (filesToUpload.length === 0) return;
        setLoading(true);

        for (const file of filesToUpload) {
            const { data, error } = await uploadEntityFile(file, STORAGE_BUCKETS.DOCUMENTS, candidateId);
            if (error) {
                dispatch(setNotification({ message: `Failed to upload ${file.name}: ${error.message}`, severity: 'error' }));
                continue; // Skip to next file
            }
            // Add a record to our database
            await supabase.from('candidate_documents').insert({
                candidate_id: candidateId,
                document_type: documentType,
                file_path: data.path,
                file_name: file.name,
            });
        }
        
        setLoading(false);
        setFilesToUpload([]);
        fetchDocuments(); // Refresh the list
    };

    const handleDeleteConfirm = async () => {
        if (deleteInfo.fileId && deleteInfo.filePath) {
            // 1. Delete from database
            await supabase.from('candidate_documents').delete().eq('id', deleteInfo.fileId);
            // 2. Delete from storage
            await deleteFile(STORAGE_BUCKETS.DOCUMENTS, deleteInfo.filePath);
            
            dispatch(setNotification({ message: 'Document deleted successfully.', severity: 'success' }));
            fetchDocuments(); // Refresh list
        }
        setDeleteInfo({ open: false, fileId: null, filePath: null });
    };

    return (
        <Box>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={8}>
                    <FileUploader onFilesSelected={setFilesToUpload} />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField label="Document Type" value={documentType} onChange={(e) => setDocumentType(e.target.value)} fullWidth sx={{ mb: 2 }}/>
                    <Button variant="contained" fullWidth onClick={handleUpload} disabled={loading || filesToUpload.length === 0}>
                        {loading ? 'Uploading...' : `Upload ${filesToUpload.length} File(s)`}
                    </Button>
                </Grid>
            </Grid>
            
            <Divider sx={{ my: 3 }}><Typography>Uploaded Documents</Typography></Divider>

            <FileList
                files={uploadedFiles}
                bucketName={STORAGE_BUCKETS.DOCUMENTS}
                onDelete={(fileId, filePath) => setDeleteInfo({ open: true, fileId, filePath })}
            />

            <ConfirmDialog
                open={deleteInfo.open}
                onClose={() => setDeleteInfo({ open: false, fileId: null, filePath: null })}
                onConfirm={handleDeleteConfirm}
                title="Delete Document?"
                description="Are you sure you want to permanently delete this document? This action cannot be undone."
                confirmText="Delete"
                confirmColor="error"
            />
        </Box>
    );
};
export default CandidateDocumentsTab;