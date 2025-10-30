import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import useResponsive from '../../hooks/useResponsive';

/**
 * A wrapper that displays a DataGrid on desktop/tablet and a list of cards on mobile.
 * @param {object} props
 * @param {Array<object>} props.rows - The data to display.
 * @param {Array<object>} props.columns - The column definitions for the DataGrid.
 * @param {function(object): React.ReactNode} props.renderCard - A function that takes a row item and returns a React Node (e.g., a Card).
 * @param {boolean} [props.loading=false]
 * @param {function} [props.onRowClick]
 */
const ResponsiveDataGrid = ({ rows, columns, renderCard, loading = false, onRowClick }) => {
    const { isMobile } = useResponsive();

    if (isMobile) {
        return (
            <Box>
                {rows.map((row, index) => (
                    <Box key={row.id || index} onClick={() => onRowClick && onRowClick({ row })} sx={{ mb: 2, cursor: onRowClick ? 'pointer' : 'default' }}>
                       {renderCard(row)}
                    </Box>
                ))}
            </Box>
        );
    }

    return (
        <Paper sx={{ height: 650, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                loading={loading}
                slots={{ toolbar: GridToolbar }}
                onRowClick={onRowClick}
                // ... other DataGrid props
            />
        </Paper>
    );
};
export default ResponsiveDataGrid;