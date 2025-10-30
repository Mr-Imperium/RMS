import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

/**
 * A reusable confirmation dialog.
 * @param {object} props
 * @param {boolean} props.open - Whether the dialog is open.
 * @param {function} props.onClose - Function to call when the dialog is closed.
 * @param {function} props.onConfirm - Function to call when the confirm button is clicked.
 * @param {string} props.title - The title of the dialog.
 * @param {string} props.description - The body text of the dialog.
 * @param {string} [props.confirmText='Confirm'] - The text for the confirmation button.
 * @param {'primary'|'secondary'|'error'} [props.confirmColor='primary'] - The color of the confirmation button.
 */
const ConfirmDialog = ({ open, onClose, onConfirm, title, description, confirmText = 'Confirm', confirmColor = 'primary' }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color={confirmColor} autoFocus>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;