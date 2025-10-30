import React from 'react';
import { Chip } from '@mui/material';

/**
 * @typedef {'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'} ChipColor
 */

/**
 * Displays a colored status badge (Chip).
 * @param {object} props
 * @param {string} props.status - The status text to display.
 * @param {object.<string, ChipColor>} [props.colorMap] - A map of status text to MUI Chip colors.
 */
const StatusBadge = ({ status, colorMap }) => {
  const defaultColorMap = {
    Pending: 'warning',
    'In Progress': 'info',
    Resolved: 'success',
    Completed: 'success',
    Closed: 'default',
    Cancelled: 'error',
    New: 'info',
  };

  const finalColorMap = { ...defaultColorMap, ...colorMap };
  const color = finalColorMap[status] || 'default';

  return <Chip label={status} color={color} size="small" />;
};

export default StatusBadge;