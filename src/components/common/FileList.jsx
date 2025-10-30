import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, IconButton, Tooltip, Box, Typography } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';
import { createSignedUrl } from '../../services/fileService';

/**
 * Displays a list of uploaded files with download and delete actions.
 * @param {object} props
 * @param {Array<object>} props.files - Array of file objects from the database.
 * @param {string} props.bucketName - The Supabase storage bucket name.
 * @param {function(string): void} props.onDelete - Callback function when a file's delete icon is clicked.
 */
const FileList = ({ files, bucketName, onDelete }) => {
  const handleDownload = async (filePath) => {
    const { data, error } = await createSignedUrl(bucketName, filePath);
    if (data?.signedUrl) {
      window.open(data.signedUrl, '_blank');
    }
    // Handle error with a notification
  };
  
  if (!files || files.length === 0) {
      return <Typography color="text.secondary" sx={{mt: 2, textAlign: 'center'}}>No documents uploaded yet.</Typography>
  }

  return (
    <List>
      {files.map((file) => (
        <ListItem
          key={file.id}
          divider
          secondaryAction={
            <Box>
              <Tooltip title="Download">
                <IconButton onClick={() => handleDownload(file.file_path)}>
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton onClick={() => onDelete(file.id, file.file_path)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          }
        >
          <ListItemIcon><DescriptionIcon /></ListItemIcon>
          <ListItemText
            primary={file.file_name}
            secondary={`Uploaded on: ${format(new Date(file.uploaded_at), 'MMM d, yyyy')}`}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default FileList;