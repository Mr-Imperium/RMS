import React, { useEffect, useMemo, useState } from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { LoadingButton } from '@mui/lab';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
// import { fetchCurrenciesWithRates, selectCurrencies, selectSettingsStatus } from '../../../features/settings/settingsSlice';
import PageHeader from '../../../components/common/PageHeader';
import { supabase } from '../../../api/supabaseClient';
import { format } from 'date-fns';

const CurrencySettingsPage = () => {
  const dispatch = useAppDispatch();
  // const currencies = useAppSelector(selectCurrencies);
  const status = useAppSelector(selectSettingsStatus);
  const [updating, setUpdating] = useState(false);

  // useEffect(() => {
  //   dispatch(fetchCurrenciesWithRates());
  // }, [dispatch]);

  const handleManualUpdate = async () => {
    setUpdating(true);
    await supabase.functions.invoke('update-exchange-rates');
    // await dispatch(fetchCurrenciesWithRates());
    setUpdating(false);
  };
  
  const columns = useMemo(() => [
    { field: 'name', headerName: 'Currency', flex: 1 },
    { field: 'code', headerName: 'Code', width: 100 },
    { field: 'symbol', headerName: 'Symbol', width: 100 },
    {
      field: 'latest_rate',
      headerName: 'Latest Rate',
      flex: 1,
      valueFormatter: (params) => params.value ? params.value.toFixed(4) : 'N/A',
    },
    {
      field: 'rate_date',
      headerName: 'Rate As Of',
      flex: 1,
      valueFormatter: (params) => params.value ? format(new Date(params.value), 'MMM d, yyyy') : 'N/A',
    },
  ], []);

  return (
    <Box>
      <PageHeader title="Currency & Exchange Rates" />
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <LoadingButton variant="contained" onClick={handleManualUpdate} loading={updating}>
          Update Rates Now
        </LoadingButton>
      </Box>
      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={[]}
          columns={columns}
          loading={status === 'loading'}
        />
      </Paper>
    </Box>
  );
};
export default CurrencySettingsPage;