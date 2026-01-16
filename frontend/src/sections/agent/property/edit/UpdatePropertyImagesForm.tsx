import React, { useState, useRef } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Typography,
  Divider,
  Card,
  CardContent,
  Button,
  IconButton,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Grid,
  Paper,
  Chip,
  Input,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Add, Delete, PhotoLibrary, CloudUpload, Save, Visibility, Close, Image as ImageIcon } from '@mui/icons-material';
import axiosInstance from '../../../../utils/axios';
import { enqueueSnackbar } from 'notistack';

const imageTypes = [
  'Photo',
  'Floor Plan',
  'EPC',
  'Site Plan',
  'Exterior',
  'Interior',
  'Aerial',
  'Other',
];

const imageCategories = [
  'Primary',
  'Gallery',
  'Floor Plan',
  'Document',
  'Thumbnail',
];

interface PropertyImage {
  id?: number;
  file_name?: string;
  file_size?: number;
  file_type?: string;
  image_type?: string;
  caption?: string;
  uploaded_at?: string;
  preview_url?: string;
  url?: string;
  is_primary?: boolean;
  file?: File;
}

interface PropertyImagesData {
  _id?: string;
  property_id?: string;
  images?: PropertyImage[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface UpdatePropertyImagesFormProps {
  onStepSubmitted?: (step: number) => void;
  initialData?: PropertyImagesData;
  onDataChange?: (data: PropertyImagesData) => void;
  propertyId?: string;
  fetchProperty?: () => void;
  fetchPropertyData?: () => void;
}

const UpdatePropertyImagesForm: React.FC<UpdatePropertyImagesFormProps> = ({ 
  onStepSubmitted, 
  initialData, 
  onDataChange,
  propertyId,
  fetchProperty,
  fetchPropertyData
}) => {
  const [formData, setFormData] = useState<PropertyImagesData>({
    _id: initialData?._id || '',
    property_id: initialData?.property_id || '',
    images: initialData?.images || [],
    createdAt: initialData?.createdAt || '',
    updatedAt: initialData?.updatedAt || '',
    __v: initialData?.__v || 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewDialog, setPreviewDialog] = useState<{ open: boolean; image: string | null }>({
    open: false,
    image: null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update form data when initialData changes
  React.useEffect(() => {
    if (initialData) {
      setFormData({
        _id: initialData._id || '',
        property_id: initialData.property_id || '',
        images: initialData.images || [],
        createdAt: initialData.createdAt || '',
        updatedAt: initialData.updatedAt || '',
        __v: initialData.__v || 0,
      });
      setIsSubmitted(true); // Mark as submitted since we're editing existing data
    }
  }, [initialData]);

  // Notify parent component of data changes
  React.useEffect(() => {
    if (onDataChange) {
      onDataChange(formData);
    }
  }, [formData, onDataChange]);

  // Check for changes compared to initial data
  React.useEffect(() => {
    if (initialData) {
      const initialFormData = {
        _id: initialData._id || '',
        property_id: initialData.property_id || '',
        images: initialData.images || [],
        createdAt: initialData.createdAt || '',
        updatedAt: initialData.updatedAt || '',
        __v: initialData.__v || 0,
      };

      const hasDataChanged = JSON.stringify(formData) !== JSON.stringify(initialFormData);
      setHasChanges(hasDataChanged);
    }
  }, [formData, initialData]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    formData.images?.forEach((image, index) => {
      if (!image.caption || image.caption.trim().length === 0) {
        errors[`image_${index}_caption`] = 'Caption is required';
      }
      if (!image.image_type) {
        errors[`image_${index}_type`] = 'Image type is required';
      }
    });

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleImageChange = (index: number, field: keyof PropertyImage, value: any) => {
    setFormData(prev => ({
      ...prev,
      images: (prev.images || []).map((image, i) => 
        i === index ? { ...image, [field]: value } : image
      )
    }));
  };

  const addImage = () => {
    const newImage: PropertyImage = {
      id: Date.now(),
      file_name: '',
      file_size: 0,
      file_type: '',
      image_type: 'Photo',
      caption: '',
      uploaded_at: new Date().toISOString(),
      preview_url: '',
      url: '',
      is_primary: false,
    };
    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), newImage]
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = async (files: FileList) => {
    // Check if adding these files would exceed the 10-file limit
    const currentImageCount = formData.images?.length || 0;
    const newFileCount = files.length;
    
    if (currentImageCount + newFileCount > 10) {
      enqueueSnackbar('Maximum 10 images allowed', { variant: 'error' });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadedImages: PropertyImage[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          enqueueSnackbar(`File ${file.name} is not a valid image`, { variant: 'error' });
          continue;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          enqueueSnackbar(`File ${file.name} is too large (max 10MB)`, { variant: 'error' });
          continue;
        }

        // Simulate upload progress
        const progress = ((i + 1) / files.length) * 100;
        setUploadProgress(progress);

        // Create preview URL
        const preview = URL.createObjectURL(file);
        
        // Create image data for form storage
        const uploadedImage: PropertyImage = {
          id: Date.now() + i,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          image_type: 'Photo',
          caption: `Image ${uploadedImages.length + 1}`,
          uploaded_at: new Date().toISOString(),
          preview_url: preview,
          url: preview, // For now, use preview URL
          is_primary: uploadedImages.length === 0, // First image is primary
          file: file, // Store the actual file for later upload
        };

        uploadedImages.push(uploadedImage);
      }

      // Add to form data
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...uploadedImages]
      }));

      enqueueSnackbar(`${uploadedImages.length} image(s) added successfully`, { variant: 'success' });

    } catch (error) {
      console.error('Upload failed:', error);
      enqueueSnackbar('Failed to add images', { variant: 'error' });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const setPrimaryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: (prev.images || []).map((img, i) => ({
        ...img,
        is_primary: i === index
      }))
    }));
  };

  const openPreview = (imageUrl: string) => {
    setPreviewDialog({ open: true, image: imageUrl });
  };

  const closePreview = () => {
    setPreviewDialog({ open: false, image: null });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!propertyId) {
      setSubmitError('Property ID is required for updating');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Separate existing images from new images
      const existingImages = (formData.images || []).filter(img => !img.file);
      const newImages = (formData.images || []).filter(img => img.file);

      // Prepare form data for mixed update
      const formDataToSend = new FormData();

      // Add existing images as JSON string
      if (existingImages.length > 0) {
        const existingImagesData = existingImages.map(img => ({
          url: img.url,
          caption: img.caption,
          image_type: img.image_type,
          file_name: img.file_name,
          file_size: img.file_size,
          mime_type: img.file_type,
          order: existingImages.indexOf(img),
          is_thumbnail: img.is_primary
        }));
        formDataToSend.append('existing_images', JSON.stringify(existingImagesData));
      }

      // Add new images and their metadata
      newImages.forEach((img, index) => {
        if (img.file) {
          formDataToSend.append('files', img.file);
          formDataToSend.append('captions', img.caption || '');
          formDataToSend.append('image_types', img.image_type || 'Photo');
        }
      });

      const response = await axiosInstance.put(`/api/agent/properties/${propertyId}/images/mixed`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        setIsSubmitted(true);
        setHasChanges(false); // Reset changes flag after successful update
        enqueueSnackbar('Property images updated successfully!', { variant: 'success' });
        
        // Refresh property data if callback is provided
        if (fetchProperty) {
          fetchProperty();
        }
        
        if (onStepSubmitted) {
          onStepSubmitted(6);
        }
        fetchPropertyData?.();
      } else {
        throw new Error(response.data.message || 'Failed to update property images');
      }
    } catch (error: any) {
      console.error('Error updating property images:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update property images';
      setSubmitError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Property Images
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Upload high-quality images to showcase your property. You can add photos, floor plans, and other visual content.
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Upload Area */}
        <Box>
          <Card variant="outlined">
          <CardContent>
              <Typography variant="h6" gutterBottom>
                Upload Images
              </Typography>
              
              <Paper
                variant="outlined"
                sx={{
                  p: 4,
                  textAlign: 'center',
                  border: '2px dashed #e0e0e0',
                  borderRadius: 2,
                  cursor: (formData.images?.length || 0) >= 10 ? 'not-allowed' : 'pointer',
                  transition: 'border-color 0.3s',
                  opacity: (formData.images?.length || 0) >= 10 ? 0.6 : 1,
                  '&:hover': (formData.images?.length || 0) < 10 ? {
                    borderColor: 'primary.main',
                    backgroundColor: 'action.hover',
                  } : {},
                }}
                onDrop={(formData.images?.length || 0) < 10 ? handleDrop : undefined}
                onDragOver={(formData.images?.length || 0) < 10 ? handleDragOver : undefined}
                onClick={(formData.images?.length || 0) < 10 ? () => fileInputRef.current?.click() : undefined}
              >
                <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  {(formData.images?.length || 0) >= 10 ? 'Maximum images reached' : 'Drop images here or click to browse'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Supports JPG, PNG, GIF up to 10MB each • {formData.images?.length || 0}/10 images uploaded
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<Add />}
                  disabled={(formData.images?.length || 0) >= 10}
                >
                  {(formData.images?.length || 0) >= 10 ? 'Limit Reached' : 'Select Images'}
              </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                  disabled={(formData.images?.length || 0) >= 10}
                />
              </Paper>

              {uploading && (
                <Box sx={{ mt: 2 }}>
                  <LinearProgress variant="determinate" value={uploadProgress} />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Uploading images... {Math.round(uploadProgress)}%
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Images Grid */}
        {(formData.images || []).length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Uploaded Images ({(formData.images || []).length})
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {(formData.images || []).map((image, index) => (
                <Box sx={{ flex: '1 1 250px', minWidth: '250px', maxWidth: '300px' }} key={image.id || index}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <Box sx={{ position: 'relative' }}>
                      <Box
                        sx={{
                          height: 200,
                          backgroundImage: `url(${image.preview_url || image.url})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          cursor: 'pointer',
                        }}
                        onClick={() => openPreview(image.preview_url || image.url || '')}
                      />
                      
                      {/* Primary Badge */}
                      {image.is_primary && (
                        <Chip
                          label="Primary"
                          color="primary"
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                          }}
                        />
                      )}

                      {/* Upload Status Badge */}
                      {image.file && (
                        <Chip
                          label="Pending Upload"
                          color="warning"
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            zIndex: 1,
                          }}
                        />
                      )}

                      {/* Action Buttons */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: image.file ? 120 : 8, // Adjust position if upload badge is present
                          display: 'flex',
                          gap: 0.5,
                        }}
                      >
                        <IconButton
                      size="small"
                          onClick={() => openPreview(image.preview_url || image.url || '')}
                          sx={{ backgroundColor: 'rgba(255,255,255,0.8)' }}
                    >
                          <Visibility fontSize="small" />
                        </IconButton>
                    <IconButton
                          size="small"
                      onClick={() => removeImage(index)}
                      color="error"
                          sx={{ backgroundColor: 'rgba(255,255,255,0.8)' }}
                    >
                          <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                    <CardContent>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box>
                          <FormControl fullWidth size="small" error={!!fieldErrors[`image_${index}_type`]}>
                      <InputLabel>Image Type</InputLabel>
                      <Select
                        value={image.image_type || ''}
                        onChange={(e) => handleImageChange(index, 'image_type', e.target.value)}
                        label="Image Type"
                      >
                        {imageTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                      {fieldErrors[`image_${index}_type`] && (
                        <FormHelperText>{fieldErrors[`image_${index}_type`]}</FormHelperText>
                      )}
                    </FormControl>
                  </Box>

                        <Box>
                  <TextField
                            label="Caption *"
                            fullWidth
                            size="small"
                            multiline
                            rows={2}
                            required
                    value={image.caption || ''}
                    onChange={(e) => handleImageChange(index, 'caption', e.target.value)}
                            error={!!fieldErrors[`image_${index}_caption`]}
                            helperText={fieldErrors[`image_${index}_caption`] || 'Caption is required'}
                            placeholder="Enter image caption..."
                    />
                  </Box>
                  </Box>
                    </CardContent>
                  </Card>
                </Box>
            ))}
            </Box>
          </Box>
        )}

        {/* Update Button */}
        {(formData.images || []).length > 0 && (
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={isSubmitting || uploading}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : <CloudUpload />}
            sx={{
              minWidth: 200,
                backgroundColor: 'error.main',
              '&:hover': {
                  backgroundColor: 'error.dark',
                }
              }}
            >
              {isSubmitting ? 'Updating...' : 'Update Images'}
            </Button>
          </Box>
        )}

        {/* Empty State */}
        {(formData.images || []).length === 0 && (
          <Box>
            <Card variant="outlined" sx={{ textAlign: 'center', py: 4 }}>
              <CardContent>
                <PhotoLibrary sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  No Images Uploaded
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Upload images to showcase your property effectively.
                </Typography>
                <Button
                  startIcon={<Add />}
                  onClick={() => fileInputRef.current?.click()}
                  variant="contained"
                >
                  Upload First Image
          </Button>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Tips */}
        <Box>
          <Alert severity="info">
            <Typography variant="subtitle2" gutterBottom>
              💡 Image Tips:
            </Typography>
            <Typography variant="body2">
              • Use high-resolution images (minimum 1200px wide)<br/>
              • Include both exterior and interior shots<br/>
              • Add floor plans and site plans when available<br/>
              • Write descriptive captions for better SEO<br/>
              • Set your best image as the primary image
            </Typography>
          </Alert>
        </Box>
      </Box>

      {/* Image Preview Dialog */}
      <Dialog
        open={previewDialog.open}
        onClose={closePreview}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Image Preview
            <IconButton onClick={closePreview}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {previewDialog.image && (
            <Box
              component="img"
              src={previewDialog.image}
              alt="Preview"
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: '70vh',
                objectFit: 'contain',
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default UpdatePropertyImagesForm;
