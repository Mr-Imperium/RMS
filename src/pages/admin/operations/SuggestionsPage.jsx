import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Chip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchSuggestions, addSuggestion, resolveSuggestion, selectAllSuggestions } from '../../../features/suggestions/suggestionsSlice';
import { selectCurrentUserProfile } from '../../../features/auth/authSlice';
import PageHeader from '../../../components/common/PageHeader';
import { format } from 'date-fns';

const SuggestionsPage = () => {
    const dispatch = useAppDispatch();
    const suggestions = useAppSelector(selectAllSuggestions);
    const userProfile = useAppSelector(selectCurrentUserProfile);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newSuggestion, setNewSuggestion] = useState('');

    useEffect(() => {
        dispatch(fetchSuggestions());
    }, [dispatch]);

    const handleAddSuggestion = () => {
        if (newSuggestion.trim()) {
            dispatch(addSuggestion({ suggestion_text: newSuggestion, user_id: userProfile.id }));
            setNewSuggestion('');
            setDialogOpen(false);
        }
    };

    const handleResolve = (id) => {
        dispatch(resolveSuggestion({ id, resolution_text: "Resolved by admin." }));
    };

    const columns = [
        { field: 'suggestion_text', headerName: 'Suggestion', flex: 3 },
        { field: 'submitted_by', headerName: 'Submitted By', flex: 1, valueGetter: (p) => p.row.profiles.full_name },
        { field: 'created_at', headerName: 'Date', width: 150, valueFormatter: (p) => format(new Date(p.value), 'MMM d, yyyy') },
        {
            field: 'is_resolved',
            headerName: 'Status',
            width: 120,
            renderCell: (p) => <Chip label={p.value ? 'Resolved' : 'Pending'} color={p.value ? 'success' : 'warning'} size="small"/>
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            renderCell: (params) => (
                userProfile.role === 'admin' && !params.row.is_resolved && (
                    <Button size="small" onClick={() => handleResolve(params.id)}>Resolve</Button>
                )
            )
        }
    ];

    return (
        <Box>
            <PageHeader title="System Suggestions" buttonText="Add Suggestion" onButtonClick={() => setDialogOpen(true)} />
            <Paper sx={{ height: 600, width: '100%' }}>
                <DataGrid rows={suggestions} columns={columns} />
            </Paper>
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth>
                <DialogTitle>Submit a New Suggestion</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" label="Your suggestion..." type="text" fullWidth multiline rows={4}
                        value={newSuggestion} onChange={(e) => setNewSuggestion(e.target.value)} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddSuggestion}>Submit</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
export default SuggestionsPage;