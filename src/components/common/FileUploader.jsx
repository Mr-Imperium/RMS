import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, LinearProgress, List, ListItem, ListItemText, ListItemIcon, IconButton, Paper, Avatar } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import { MAX_FILE_SIZE_MB } from '../../utils/constants';

/**
 * An enhanced drag-and-drop file uploader with validation and previews.
 * @param {object} props
 * @param {function(File[]): void} props.onFilesSelected - Callback with the array of valid files selected by the user.
 * @param {boolean} [props.multiple=true] - Whether to allow multiple files.
 */
const FileUploader = ({ onFilesSelected, multiple = true }) => {
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState([]);

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
    onFilesSelected([...files, ...acceptedFiles]);
    
    if (fileRejections.length > 0) {
      const newErrors = fileRejections.map(rejection => 
        `${rejection.file.name}: ${rejection.errors.map(e => e.message).join(', ')}`
      );
      setErrors(prev => [...prev, ...newErrors]);
    }
  }, [files, onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: MAX_FILE_SIZE_MB * 1024 * 1024,
  });
  
  const handleRemove = (fileToRemove) => {
    const newFiles = files.filter(file => file !== fileToRemove);
    setFiles(newFiles);
    onFilesSelected(newFiles);
  }

  return (
    <Box>
      <Paper
        {...getRootProps()}
        sx={{
          p: 4, border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'divider',
          textAlign: 'center', cursor: 'pointer',
          backgroundColor: isDragActive ? 'action.hover' : 'background.paper'
        }}
      >
        <input {...getInputProps()} />
        <UploadFileIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
        <Typography>Drag & drop files here, or click to select</Typography>
        <Typography variant="caption" color="text.secondary">
            Allowed: PDF, DOC, DOCX, JPG, PNG (Max {MAX_FILE_SIZE_MB}MB)
        </Typography>
      </Paper>

      {errors.length > 0 && <Box sx={{ mt: 2 }}>{errors.map((e, i) => <Typography key={i} color="error" variant="body2">{e}</Typography>)}</Box>}

      {files.length > 0 && (
        <List dense sx={{ mt: 2 }}>
            {files.map((file, index) => (
                <ListItem
                 key={index}
                 secondaryAction={
                    <IconButton edge="end" onClick={() => handleRemove(file)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                    <ListItemIcon>
                        <Avatar variant="rounded" src={file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined}>
                           <DescriptionIcon />
                        </Avatar>
                    </ListItemIcon>
                    <ListItemText primary={file.name} secondary={`${(file.size / 1024).toFixed(2)} KB`} />
                </ListItem>
            ))}
        </List>
      )}
    </Box>
  );
};

export default FileUploader;