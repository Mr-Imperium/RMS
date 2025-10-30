import React, { useState, useEffect } from 'react';
import { Paper, Grid, TextField, Autocomplete, Box, Button, Typography } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { supabase } from '../../api/supabaseClient';
import { exportToPdf, exportToExcel } from '../../utils/exportUtils';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const ReportLayout = ({ title, children, onGenerate, reportData, pdfColumns, excelColumns, fileName }) => {
  const [clients, setClients] = useState([]);
  const [filters, setFilters] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)), // Default to one month ago
    endDate: new Date(),
    clientId: null,
  });

  useEffect(() => {
    const fetchClients = async () => {
      const { data } = await supabase.from('clients').select('id, company_name');
      setClients(data || []);
    };
    fetchClients();
  }, []);

  const handleGenerate = () => {
    onGenerate(filters);
  };
  
  const handleExportPdf = () => {
    exportToPdf(reportData, pdfColumns, title, fileName);
  };

  const handleExportExcel = () => {
    exportToExcel(reportData, excelColumns, fileName);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>{title}</Typography>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid item xs={12} sm={3}>
              <DatePicker label="Start Date" value={filters.startDate} onChange={(date) => setFilters(f => ({ ...f, startDate: date }))} renderInput={(params) => <TextField {...params} fullWidth />} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <DatePicker label="End Date" value={filters.endDate} onChange={(date) => setFilters(f => ({ ...f, endDate: date }))} renderInput={(params) => <TextField {...params} fullWidth />} />
            </Grid>
          </LocalizationProvider>
          <Grid item xs={12} sm={3}>
            <Autocomplete options={clients} getOptionLabel={(option) => option.company_name} onChange={(_, val) => setFilters(f => ({ ...f, clientId: val ? val.id : null }))}
              renderInput={(params) => <TextField {...params} label="Filter by Company" />} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button variant="contained" fullWidth size="large" onClick={handleGenerate}>Generate Report</Button>
          </Grid>
        </Grid>
      </Paper>

      {reportData && (
        <>
        <Box sx={{mb: 2, display: 'flex', justifyContent: 'flex-end', gap: 1}}>
            <Button variant="outlined" startIcon={<PictureAsPdfIcon/>} onClick={handleExportPdf}>Export PDF</Button>
            <Button variant="outlined" startIcon={<DownloadIcon/>} onClick={handleExportExcel}>Export Excel</Button>
        </Box>
        {children}
        </>
      )}
    </Box>
  );
};
export default ReportLayout;