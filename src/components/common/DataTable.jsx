import React from 'react';
import { Paper, Box } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

/**
 * A reusable and standardized data table component built on top of MUI DataGrid.
 * @param {object} props
 * @param {Array<object>} props.rows - The data to display.
 * @param {Array<object>} props.columns - The column definitions for the grid.
 * @param {boolean} [props.loading=false] - Whether to show the loading overlay.
 * @param {function} [props.onRowClick] - Callback function when a row is clicked.
 * @param {object} [props.sx] - Custom styles for the Paper component.
 */
const DataTable = ({ rows, columns, loading = false, onRowClick, sx, ...props }) => {
  return (
    <Paper sx={{ height: 650, width: '100%', ...sx }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        pageSizeOptions={[10, 25, 50, 100]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        onRowClick={onRowClick}
        sx={{
          '& .MuiDataGrid-row:hover': {
            cursor: onRowClick ? 'pointer' : 'default',
          },
        }}
        disableRowSelectionOnClick
        {...props}
      />
    </Paper>
  );
};

export default DataTable;