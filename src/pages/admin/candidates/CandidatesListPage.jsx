import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Avatar, Button } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchCandidates, selectAllCandidates, selectCandidatesStatus } from '../../../features/candidates/candidatesSlice';
import PageHeader from '../../../components/common/PageHeader';
import ImportDialog from '../../../components/common/ImportDialog';
import { exportToExcel } from '../../../services/exportService';
import * as yup from 'yup';

// Schema for validating imported candidate data
const candidateImportSchema = yup.object().shape({
    given_name: yup.string().required(),
    passport_no: yup.string().required(),
    // Add other fields as needed
});
const candidateTemplateHeaders = ['given_name', 'family_name', 'passport_no', 'national_id', 'mobile_number', 'email'];


const CandidatesListPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const candidates = useAppSelector(selectAllCandidates);
    const status = useAppSelector(selectCandidatesStatus);
    const [importOpen, setImportOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchCandidates({ page: 1 }));
    }, [dispatch]);
    
    const handleExport = () => {
        exportToExcel(candidates, 'Candidates_Export');
    };
    
    const handleImportSuccess = () => {
        setImportOpen(false);
        dispatch(fetchCandidates({ page: 1 })); // Refresh data
    };

    const columns = useMemo(() => [
        // ... column definitions from previous step
    ], []);

    return (
        <Box>
            <PageHeader
                title="Candidate Database"
                buttonText="Add New Candidate"
                onButtonClick={() => navigate('/candidates/new')}
            />
            <Box sx={{mb: 2, display: 'flex', gap: 1}}>
                <Button variant="outlined" onClick={() => setImportOpen(true)}>Import from Excel</Button>
                <Button variant="outlined" onClick={handleExport}>Export to Excel</Button>
            </Box>
            <Paper sx={{ height: 650, width: '100%' }}>
                <DataGrid
                    rows={candidates}
                    columns={columns}
                    loading={status === 'loading'}
                    slots={{ toolbar: GridToolbar }}
                    onRowClick={(params) => navigate(`/candidates/${params.id}`)}
                />
            </Paper>
            <ImportDialog
                open={importOpen}
                onClose={() => setImportOpen(false)}
                schema={candidateImportSchema}
                uniqueKey="passport_no"
                dbTable="candidates"
                templateHeaders={candidateTemplateHeaders}
                onImportSuccess={handleImportSuccess}
            />
        </Box>
    );
};
export default CandidatesListPage;