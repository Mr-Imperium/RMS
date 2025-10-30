import React, { useState } from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ReportLayout from '../../../components/reports/ReportLayout';
import { supabase } from '../../../api/supabaseClient';
import { format } from 'date-fns';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const LabourApprovalReportPage = () => {
    const [reportData, setReportData] = useState(null);

    const handleGenerate = async (filters) => {
        const { data } = await supabase.rpc('get_labour_approval_report', {
            start_date: format(filters.startDate, 'yyyy-MM-dd'),
            end_date: format(filters.endDate, 'yyyy-MM-dd'),
            p_client_id: filters.clientId
        });
        setReportData(data || []);
    };
    
    const chartData = reportData ? Object.entries(
        reportData.reduce((acc, item) => {
            acc[item.company_name] = (acc[item.company_name] || 0) + 1;
            return acc;
        }, {})
    ).map(([name, value]) => ({ name, value })) : [];

    const columns = [
        { field: 'candidate_name', headerName: 'Candidate Name', flex: 1.5 },
        { field: 'passport_no', headerName: 'Passport #', flex: 1 },
        { field: 'job_title', headerName: 'Job Title', flex: 1 },
        { field: 'company_name', headerName: 'Company', flex: 1.5 },
        { field: 'approval_date', headerName: 'Approval Date', width: 180, valueFormatter: p => format(new Date(p.value), 'MMM d, yyyy h:mm a') },
    ];

    return (
        <ReportLayout
            title="Labour Approval Report"
            onGenerate={handleGenerate}
            reportData={reportData}
            pdfColumns={columns.map(c => ({ header: c.headerName, dataKey: c.field }))}
            excelColumns={columns.map(c => c.field)}
            fileName="Labour_Approval_Report"
        >
            <Grid container spacing={3}>
                <Grid item xs={12} lg={8}>
                    <Paper sx={{ height: 500, width: '100%' }}>
                        <DataGrid rows={reportData} columns={columns} getRowId={(r, i) => i} />
                    </Paper>
                </Grid>
                <Grid item xs={12} lg={4}>
                     <Paper sx={{ height: 500, p: 2 }}>
                        <Typography variant="h6" align="center">Approvals by Company</Typography>
                         <ResponsiveContainer width="100%" height="90%">
                            <PieChart>
                                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
                                    {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        </ReportLayout>
    );
};
export default LabourApprovalReportPage;