import React, { useState, useEffect, useCallback } from 'react';
import { Box, Paper, Typography, Grid, TextField, Button, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { queryAuditLogs } from '../../../services/auditService';
import PageHeader from '../../../components/common/PageHeader';
import DateRangePicker from '../../../components/common/DateRangePicker';
import DiffViewer from '../../../components/admin/audit/DiffViewer';
import { format } from 'date-fns';

const AuditLogsPage = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [rowCount, setRowCount] = useState(0);
    const [filters, setFilters] = useState({});
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });
    const [selectedLog, setSelectedLog] = useState(null);

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        const { data, count } = await queryAuditLogs({
            ...filters,
            page: paginationModel.page + 1,
            pageSize: paginationModel.pageSize,
        });
        setLogs(data || []);
        setRowCount(count || 0);
        setLoading(false);
    }, [filters, paginationModel]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const columns = [
        { field: 'user_name', headerName: 'User', flex: 1 },
        { field: 'action', headerName: 'Action', width: 100 },
        { field: 'entity_table', headerName: 'Entity', flex: 1 },
        { field: 'ip_address', headerName: 'IP Address', flex: 1 },
        { field: 'created_at', headerName: 'Timestamp', flex: 1.5, valueFormatter: p => format(new Date(p.value), 'MMM d, yyyy h:mm a') },
    ];
    
    return (
        <Box>
            <PageHeader title="Audit Trail" />
            {/* Filter controls would go here */}
            
            <Paper sx={{ height: 650, width: '100%' }}>
                <DataGrid
                    rows={logs}
                    columns={columns}
                    loading={loading}
                    rowCount={rowCount}
                    paginationMode="server"
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[10, 25, 50]}
                    onRowClick={(params) => setSelectedLog(params.row)}
                />
            </Paper>

            <Dialog open={Boolean(selectedLog)} onClose={() => setSelectedLog(null)} fullWidth maxWidth="md">
                <DialogTitle>Log Details</DialogTitle>
                <DialogContent>
                    {selectedLog && (
                        <>
                           <Typography variant="h6">Change Details</Typography>
                           <DiffViewer oldValues={selectedLog.old_values} newValues={selectedLog.new_values} />
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
};
export default AuditLogsPage;