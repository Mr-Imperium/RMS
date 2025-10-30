import React from 'react';
import { Box, Typography, Button } from '@mui/material';

/**
 * A component to display when a list or table is empty.
 * @param {object} props
 * @param {string} props.title - The main message to display.
 * @param {string} [props.description] - A more detailed description.
 * @param {React.ReactNode} [props.icon] - An icon to display above the title.
 * @param {string} [props.actionText] - The text for a call-to-action button.
 * @param {function} [props.onActionClick] - The onClick handler for the action button.
 */
const EmptyState = ({ title, description, icon, actionText, onActionClick }) => {
  return (
    <Box sx={{ textAlign: 'center', p: 4 }}>
      {icon && <Box sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }}>{icon}</Box>}
      <Typography variant="h6" gutterBottom>{title}</Typography>
      {description && <Typography color="text.secondary">{description}</Typography>}
      {actionText && onActionClick && (
        <Button variant="contained" sx={{ mt: 3 }} onClick={onActionClick}>
          {actionText}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;