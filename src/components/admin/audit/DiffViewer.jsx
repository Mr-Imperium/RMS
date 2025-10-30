import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { diffJson } from 'diff';

const DiffViewer = ({ oldValues, newValues }) => {
    const differences = diffJson(oldValues || {}, newValues || {});

    return (
        <Paper variant="outlined" sx={{ p: 2, fontFamily: 'monospace', fontSize: '12px', whiteSpace: 'pre-wrap' }}>
            {differences.map((part, index) => {
                const color = part.added ? 'green' : part.removed ? 'red' : 'inherit';
                const sign = part.added ? '+' : part.removed ? '-' : ' ';
                return (
                    <Box key={index} sx={{ color, backgroundColor: part.added ? '#e6ffed' : part.removed ? '#ffebe9' : 'transparent' }}>
                        {part.value.split('\n').map((line, i) => (
                           <Typography key={i} component="span" sx={{display: 'block'}}>
                                {line && `${sign} ${line}`}
                           </Typography>
                        ))}
                    </Box>
                );
            })}
        </Paper>
    );
};

export default DiffViewer;