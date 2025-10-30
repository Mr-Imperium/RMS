import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, List, ListItem, ListItemText, Divider, IconButton, TextField, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ReactQuill from 'react-quill'; // Assuming react-quill is installed
import 'react-quill/dist/quill.snow.css';
import { supabase } from '../../../api/supabaseClient';
import { useAppDispatch } from '../../../app/hooks';
import { setNotification } from '../../../features/ui/uiSlice';

const EmailTemplatesPage = () => {
    const dispatch = useAppDispatch();
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTemplates = async () => {
            const { data } = await supabase.from('email_templates').select('*');
            setTemplates(data || []);
        };
        fetchTemplates();
    }, []);
    
    const handleSave = async () => {
        setLoading(true);
        const { id, subject, body } = selectedTemplate;
        const { error } = await supabase.from('email_templates').update({ subject, body }).eq('id', id);
        if (error) {
            dispatch(setNotification({ message: `Error: ${error.message}`, severity: 'error' }));
        } else {
            dispatch(setNotification({ message: 'Template saved successfully!', severity: 'success' }));
        }
        setLoading(false);
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
                <Paper>
                    <Typography variant="h6" sx={{ p: 2 }}>Email Templates</Typography>
                    <Divider />
                    <List>
                        {templates.map(t => (
                            <ListItem button key={t.id} onClick={() => setSelectedTemplate({...t})}>
                                <ListItemText primary={t.id} secondary={t.description} />
                                <IconButton><EditIcon /></IconButton>
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </Grid>
            <Grid item xs={12} md={8}>
                {selectedTemplate ? (
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h5" gutterBottom>Edit: {selectedTemplate.id}</Typography>
                        <TextField label="Subject" value={selectedTemplate.subject} onChange={e => setSelectedTemplate(s => ({ ...s, subject: e.target.value }))} fullWidth sx={{ mb: 2 }} />
                        <ReactQuill theme="snow" value={selectedTemplate.body} onChange={value => setSelectedTemplate(s => ({ ...s, body: value }))} />
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Button variant="outlined">Send Test</Button>
                            <Button variant="contained" onClick={handleSave} disabled={loading}>{loading ? 'Saving...' : 'Save Template'}</Button>
                        </Box>
                    </Paper>
                ) : (
                    <Paper sx={{ p: 3, textAlign: 'center' }}><Typography>Select a template to edit.</Typography></Paper>
                )}
            </Grid>
        </Grid>
    );
};
export default EmailTemplatesPage;