import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

const DeleteConfirmDialog = ({ open, onClose, onConfirm, title, description }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title || 'Confirm Deletion'}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {description || 'Are you sure you want to delete this item? This action cannot be undone.'}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color="error" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog;