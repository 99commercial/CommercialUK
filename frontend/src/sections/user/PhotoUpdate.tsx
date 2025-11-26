import React, { useState, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  Avatar,
  Alert,
  CircularProgress,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  PhotoCamera as PhotoCameraIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axiosInstance from '../../utils/axios';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
  border: '1px solid rgba(220, 38, 38, 0.08)',
  background: '#ffffff',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.06)',
  },
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  marginBottom: 0,
  padding: theme.spacing(2.5, 3),
  background: 'linear-gradient(135deg, #f2c514 0%, #d4a912 100%)',
  borderRadius: '16px 16px 0 0',
  color: 'white',
  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)',
}));

interface UploadAreaProps { isDragOver: boolean }
const UploadArea = styled(Box, { shouldForwardProp: (prop) => prop !== 'isDragOver' })<UploadAreaProps>(({ theme, isDragOver }) => ({
  border: `2px dashed ${isDragOver ? '#f2c514' : '#d1d5db'}`,
  borderRadius: 14,
  padding: theme.spacing(4),
  textAlign: 'center',
  backgroundColor: isDragOver ? 'rgba(220, 38, 38, 0.05)' : '#f9fafb',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  // 3D Effect
  boxShadow: isDragOver ? `
    0 8px 16px -4px rgba(220, 38, 38, 0.2),
    0 4px 8px -2px rgba(220, 38, 38, 0.15),
    inset 0 2px 0 0 rgba(255, 255, 255, 0.95),
    inset 0 -2px 0 0 rgba(220, 38, 38, 0.1)
  ` : `
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.9),
    inset 0 -1px 0 0 rgba(0, 0, 0, 0.05)
  `,
  '&:hover': {
    borderColor: '#f2c514',
    backgroundColor: 'rgba(220, 38, 38, 0.05)',
    transform: 'translateY(-2px)',
    boxShadow: `
      0 8px 16px -4px rgba(220, 38, 38, 0.2),
      0 4px 8px -2px rgba(220, 38, 38, 0.15),
      inset 0 2px 0 0 rgba(255, 255, 255, 0.95),
      inset 0 -2px 0 0 rgba(220, 38, 38, 0.1)
    `,
  },
}));

const PreviewContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(3),
  backgroundColor: '#f8fafc',
  borderRadius: 14,
  border: '1px solid #e5e7eb',
  // 3D Effect
  boxShadow: `
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.9),
    inset 0 -1px 0 0 rgba(0, 0, 0, 0.05)
  `,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    boxShadow: `
      0 6px 12px -2px rgba(0, 0, 0, 0.15),
      0 3px 6px -1px rgba(0, 0, 0, 0.1),
      inset 0 2px 0 0 rgba(255, 255, 255, 0.95),
      inset 0 -2px 0 0 rgba(0, 0, 0, 0.08)
    `,
    transform: 'translateY(-2px)',
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 14,
  textTransform: 'none',
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  fontWeight: 600,
  fontSize: '1.125rem',
  padding: theme.spacing(2, 5),
  minWidth: 160,
  letterSpacing: '0.02em',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: '0 6px 16px rgba(220, 38, 38, 0.25), 0 2px 4px rgba(220, 38, 38, 0.1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 24px rgba(220, 38, 38, 0.35), 0 4px 8px rgba(220, 38, 38, 0.15)',
  },
  '&:active': {
    transform: 'translateY(0)',
    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)',
  },
}));

interface PhotoUpdateProps {
  currentPhoto?: string;
}

const PhotoUpdate: React.FC<PhotoUpdateProps> = ({
  currentPhoto
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhoto || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setError('');
    setSelectedFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const data = new FormData();
      data.append('profile_photo', selectedFile);

      const response = await axiosInstance.put('/api/user/users/profile/photo', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess('Profile photo updated successfully!');
      
    } catch (err: any) {
      const message = typeof err === 'string'
        ? err
        : err?.message || err?.error || 'Failed to update profile photo. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError('');
    setSuccess('');
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <StyledCard>
      <SectionHeader>
        <PhotoCameraIcon sx={{ fontSize: '1.75rem', color: 'black' }} />
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            fontSize: '1.5rem',
            color: 'black',
            letterSpacing: '-0.01em',
          }}
        >
          Update Profile Photo
        </Typography>
      </SectionHeader>

      <CardContent sx={{ p: { xs: 3, md: 4.5 }, pt: { xs: 3.5, md: 4.5 } }}>
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              fontSize: '1rem',
              boxShadow: '0 2px 8px rgba(220, 38, 38, 0.1)',
              '& .MuiAlert-message': {
                fontSize: '1rem',
              },
            }}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              fontSize: '1rem',
              boxShadow: '0 2px 8px rgba(34, 197, 94, 0.1)',
              '& .MuiAlert-message': {
                fontSize: '1rem',
              },
            }}
          >
            {success}
          </Alert>
        )}

        {/* Current Photo Preview */}
        {previewUrl && (
          <PreviewContainer>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#f2c514', 
                fontWeight: 600, 
                mb: 1,
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                fontSize: '1.375rem',
              }}
            >
              Photo Preview
            </Typography>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={previewUrl}
                sx={{
                  width: { xs: 140, md: 180 },
                  height: { xs: 140, md: 180 },
                  border: '5px solid #f2c514',
                  boxShadow: `
                    0 10px 30px rgba(220, 38, 38, 0.35),
                    0 4px 12px rgba(220, 38, 38, 0.25),
                    inset 0 2px 0 0 rgba(255, 255, 255, 0.2)
                  `,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
              <IconButton
                onClick={handleRemove}
                sx={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  backgroundColor: '#f2c514',
                  color: 'white',
                  width: 40,
                  height: 40,
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    backgroundColor: '#f2c514',
                    transform: 'scale(1.1)',
                    boxShadow: '0 6px 16px rgba(220, 38, 38, 0.5)',
                  },
                }}
              >
                <DeleteIcon sx={{ fontSize: '1.25rem' }} />
              </IconButton>
            </Box>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#6b7280', 
                textAlign: 'center',
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                fontSize: '1rem',
              }}
            >
              {selectedFile ? `Selected: ${selectedFile.name}` : 'Current profile photo'}
            </Typography>
          </PreviewContainer>
        )}

        {/* Upload Area */}
        {!previewUrl && (
          <UploadArea
            isDragOver={isDragOver}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={handleBrowseClick}
          >
            <CloudUploadIcon sx={{ fontSize: 64, color: '#f2c514', mb: 2 }} />
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#374151', 
                fontWeight: 600, 
                mb: 1,
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                fontSize: '1.375rem',
              }}
            >
              Upload Profile Photo
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#6b7280', 
                mb: 3,
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                fontSize: '1rem',
              }}
            >
              Drag and drop an image here, or click to browse
            </Typography>
            <Button
              variant="contained"
              startIcon={<PhotoCameraIcon sx={{ fontSize: '1.5rem' }} />}
              sx={(theme) => ({
                backgroundColor: '#f2c514',
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                fontSize: '1.125rem',
                fontWeight: 600,
                color: 'black',
                padding: theme.spacing(1.75, 4),
                borderRadius: 14,
                boxShadow: '0 6px 16px rgba(220, 38, 38, 0.25), 0 2px 4px rgba(220, 38, 38, 0.1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  backgroundColor: '#d4a912',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 24px rgba(220, 38, 38, 0.35), 0 4px 8px rgba(220, 38, 38, 0.15)',
                },
              })}
            >
              Choose File
            </Button>
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#9ca3af', 
                mt: 2, 
                display: 'block',
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                fontSize: '0.9375rem',
              }}
            >
              Supports: JPG, PNG, GIF (Max 5MB)
            </Typography>
          </UploadArea>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />

        {/* Action Buttons */}
        {previewUrl && (
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            justifyContent: 'center', 
            mt: 4,
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            <ActionButton
              variant="outlined"
              onClick={handleRemove}
              startIcon={<DeleteIcon sx={{ fontSize: '1.5rem' }} />}
              sx={{
                borderColor: '#f2c514',
                color: '#f2c514',
                borderWidth: '2px',
                '&:hover': {
                  borderColor: '#f2c514',
                  backgroundColor: 'rgba(239, 68, 68, 0.04)',
                  borderWidth: '2px',
                },
              }}
            >
              Remove Photo
            </ActionButton>
            
            <ActionButton
              variant="contained"
              onClick={handleUpload}
              disabled={loading || !selectedFile}
              startIcon={loading ? <CircularProgress size={22} color="inherit" /> : <CheckCircleIcon sx={{ fontSize: '1.5rem' }} />}
              sx={{
                backgroundColor: '#f2c514',
                color: 'black',
                '&:hover': {
                  backgroundColor: '#d4a912',
                },
                '&:disabled': {
                  backgroundColor: '#f9d85a',
                  boxShadow: 'none',
                  transform: 'none',
                },
              }}
            >
              {loading ? 'Uploading...' : 'Update Photo'}
            </ActionButton>
          </Box>
        )}

        {/* Photo Guidelines */}
        <Box 
          sx={{ 
            mt: 4, 
            p: 3.5, 
            backgroundColor: '#f8fafc', 
            borderRadius: 14,
            // 3D Effect
            boxShadow: `
              0 4px 6px -1px rgba(0, 0, 0, 0.1),
              0 2px 4px -1px rgba(0, 0, 0, 0.06),
              inset 0 1px 0 0 rgba(255, 255, 255, 0.9),
              inset 0 -1px 0 0 rgba(0, 0, 0, 0.05)
            `,
            border: '1px solid rgba(0, 0, 0, 0.08)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              boxShadow: `
                0 6px 12px -2px rgba(0, 0, 0, 0.15),
                0 3px 6px -1px rgba(0, 0, 0, 0.1),
                inset 0 2px 0 0 rgba(255, 255, 255, 0.95),
                inset 0 -2px 0 0 rgba(0, 0, 0, 0.08)
              `,
            },
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#f2c514', 
              fontWeight: 600, 
              mb: 2,
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              fontSize: '1.375rem',
            }}
          >
            Photo Guidelines
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2.5, color: '#6b7280' }}>
            <Typography 
              component="li" 
              variant="body2" 
              sx={{ 
                mb: 1.5,
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                fontSize: '1rem',
              }}
            >
              Use a clear, professional headshot
            </Typography>
            <Typography 
              component="li" 
              variant="body2" 
              sx={{ 
                mb: 1.5,
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                fontSize: '1rem',
              }}
            >
              Ensure good lighting and minimal background distractions
            </Typography>
            <Typography 
              component="li" 
              variant="body2" 
              sx={{ 
                mb: 1.5,
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                fontSize: '1rem',
              }}
            >
              Supported formats: JPG, PNG, GIF
            </Typography>
            <Typography 
              component="li" 
              variant="body2" 
              sx={{ 
                mb: 1.5,
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                fontSize: '1rem',
              }}
            >
              Maximum file size: 5MB
            </Typography>
            <Typography 
              component="li" 
              variant="body2"
              sx={{
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                fontSize: '1rem',
              }}
            >
              Recommended dimensions: 400x400 pixels or larger
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default PhotoUpdate;
