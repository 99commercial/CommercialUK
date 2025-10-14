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
  borderRadius: 12,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  border: 'none',
  background: '#ffffff',
  overflow: 'hidden',
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
  borderRadius: '8px 8px 0 0',
  color: 'white',
}));

interface UploadAreaProps { isDragOver: boolean }
const UploadArea = styled(Box, { shouldForwardProp: (prop) => prop !== 'isDragOver' })<UploadAreaProps>(({ theme, isDragOver }) => ({
  border: `2px dashed ${isDragOver ? '#dc2626' : '#d1d5db'}`,
  borderRadius: 12,
  padding: theme.spacing(4),
  textAlign: 'center',
  backgroundColor: isDragOver ? 'rgba(220, 38, 38, 0.05)' : '#f9fafb',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: '#dc2626',
    backgroundColor: 'rgba(220, 38, 38, 0.05)',
  },
}));

const PreviewContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(3),
  backgroundColor: '#f8fafc',
  borderRadius: 12,
  border: '1px solid #e5e7eb',
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  textTransform: 'none',
  fontWeight: 600,
  padding: theme.spacing(1.5, 3),
  minWidth: 120,
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
        <PhotoCameraIcon />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Update Profile Photo
        </Typography>
      </SectionHeader>

      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
            {success}
          </Alert>
        )}

        {/* Current Photo Preview */}
        {previewUrl && (
          <PreviewContainer>
            <Typography variant="h6" sx={{ color: '#dc2626', fontWeight: 600, mb: 1 }}>
              Photo Preview
            </Typography>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={previewUrl}
                sx={{
                  width: { xs: 120, md: 150 },
                  height: { xs: 120, md: 150 },
                  border: '4px solid #dc2626',
                  boxShadow: '0 8px 25px rgba(220, 38, 38, 0.3)',
                }}
              />
              <IconButton
                onClick={handleRemove}
                sx={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  backgroundColor: '#ef4444',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#dc2626',
                  },
                  width: 32,
                  height: 32,
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
            <Typography variant="body2" sx={{ color: '#6b7280', textAlign: 'center' }}>
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
            <CloudUploadIcon sx={{ fontSize: 48, color: '#dc2626', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#374151', fontWeight: 600, mb: 1 }}>
              Upload Profile Photo
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b7280', mb: 3 }}>
              Drag and drop an image here, or click to browse
            </Typography>
            <Button
              variant="contained"
              startIcon={<PhotoCameraIcon />}
              sx={{
                backgroundColor: '#dc2626',
                '&:hover': {
                  backgroundColor: '#b91c1c',
                },
              }}
            >
              Choose File
            </Button>
            <Typography variant="caption" sx={{ color: '#9ca3af', mt: 2, display: 'block' }}>
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
              startIcon={<DeleteIcon />}
              sx={{
                borderColor: '#ef4444',
                color: '#ef4444',
                '&:hover': {
                  borderColor: '#dc2626',
                  backgroundColor: 'rgba(239, 68, 68, 0.04)',
                },
              }}
            >
              Remove Photo
            </ActionButton>
            
            <ActionButton
              variant="contained"
              onClick={handleUpload}
              disabled={loading || !selectedFile}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
              sx={{
                backgroundColor: '#dc2626',
                '&:hover': {
                  backgroundColor: '#b91c1c',
                },
                '&:disabled': {
                  backgroundColor: '#fca5a5',
                },
              }}
            >
              {loading ? 'Uploading...' : 'Update Photo'}
            </ActionButton>
          </Box>
        )}

        {/* Photo Guidelines */}
        <Box sx={{ mt: 4, p: 3, backgroundColor: '#f8fafc', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ color: '#dc2626', fontWeight: 600, mb: 2 }}>
            Photo Guidelines
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2, color: '#6b7280' }}>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              Use a clear, professional headshot
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              Ensure good lighting and minimal background distractions
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              Supported formats: JPG, PNG, GIF
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              Maximum file size: 5MB
            </Typography>
            <Typography component="li" variant="body2">
              Recommended dimensions: 400x400 pixels or larger
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default PhotoUpdate;
