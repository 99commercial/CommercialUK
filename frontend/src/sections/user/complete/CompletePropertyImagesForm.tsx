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
  Paper,
  LinearProgress,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import {
  Add,
  Delete,
  PhotoLibrary,
  CloudUpload,
  Image as ImageIcon,
  Close,
  Edit,
  Visibility,
} from '@mui/icons-material';
import { useFormContext, useFieldArray, FieldErrors } from 'react-hook-form';
import axiosInstance from '../../../utils/axios';
import { useSnackbar } from 'notistack';

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

interface ImagePreview {
  file: File;
  preview: string;
}

interface PropertyImagesFormData {
  property_images: Array<{
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
    file?: File; // Store the actual file for later upload
  }>;
}

interface PropertyImagesFormProps {
  propertyId: string;
  onStepSubmitted?: (data: any) => void;
}

const CompletePropertyImagesForm: React.FC<PropertyImagesFormProps> = ({ propertyId, onStepSubmitted }) => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
    control,
  } = useFormContext<PropertyImagesFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'property_images',
  });

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [previewDialog, setPreviewDialog] = useState<{ open: boolean; image: string | null }>({
    open: false,
    image: null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { enqueueSnackbar } = useSnackbar();

  const watchedValues = watch();

  const handleFileUpload = async (files: FileList) => {
    // Check if adding these files would exceed the 10-file limit
    const currentImageCount = fields.length;
    const newFileCount = files.length;
    
    if (currentImageCount + newFileCount > 10) {
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadedImages = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Simulate upload progress
        const progress = ((i + 1) / files.length) * 100;
        setUploadProgress(progress);

        // Create preview URL
        const preview = URL.createObjectURL(file);
        
        // Create image data for form storage
        const uploadedImage: {
          id: number;
          file_name: string;
          file_size: number;
          file_type: string;
          image_type: string;
          caption: string;
          uploaded_at: string;
          preview_url: string;
          url: string;
          is_primary: boolean;
          file: File;
        } = {
          id: Date.now() + i,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          image_type: 'Photo',
          caption: `Image ${uploadedImages.length + 1}`, // Default caption
          uploaded_at: new Date().toISOString(),
          preview_url: preview,
          url: preview, // For now, use preview URL
          is_primary: uploadedImages.length === 0, // First image is primary
          file: file, // Store the actual file for later upload
        };

        uploadedImages.push(uploadedImage);
      }

      // Add to form data
      const currentImages = watchedValues.property_images || [];
      setValue('property_images', [...currentImages, ...uploadedImages]);

    } catch (error) {
      console.error('Upload failed:', error);
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

  const removeImage = (index: number) => {
    remove(index);
  };

  const setPrimaryImage = (index: number) => {
    const images = [...(watchedValues.property_images || [])];
    images.forEach((img: any, i: number) => {
      img.is_primary = i === index;
    });
    setValue('property_images', images);
  };

  const openPreview = (imageUrl: string) => {
    setPreviewDialog({ open: true, image: imageUrl });
  };

  const closePreview = () => {
    setPreviewDialog({ open: false, image: null });
  };

  const handleSubmit = async () => {
    if (!propertyId) {
      console.error('Property ID not found');
      return;
    }

    const images = watchedValues.property_images || [];
    
    // Validate that all images have captions
    const imagesWithoutCaptions = images.filter(img => !img.caption || img.caption.trim().length === 0);
    if (imagesWithoutCaptions.length > 0) {
      enqueueSnackbar('All images must have captions before uploading', { variant: 'error' });
      return;
    }

    const filesToUpload = images.filter(img => img.file); // Only upload files that haven't been uploaded yet

    if (filesToUpload.length === 0) {
      console.log('No new files to upload');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for multipart upload
      const formData = new FormData();
      
      // Add files to FormData
      filesToUpload.forEach((image) => {
        if (image.file) {
          formData.append('files', image.file);
        }
      });

      // Add captions and image types
      const captions = filesToUpload.map(img => img.caption || '');
      const imageTypes = filesToUpload.map(img => img.image_type || 'Photo');
      
      captions.forEach(caption => formData.append('captions', caption));
      imageTypes.forEach(type => formData.append('image_types', type));

      // Upload to backend
      const response = await axiosInstance.put(
        `/api/user/properties/${propertyId}/images`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(progress);
            }
          },
        }
      );
        
        // Update propertyId in localStorage
       if (response.data.data && response.data.data._id) {
           setIsUploaded(true);
           localStorage.setItem('propertyId', response.data.data._id);
           // Show success message
           enqueueSnackbar('Images uploaded successfully!', { variant: 'success' });
           console.log('Images uploaded successfully');
           
           // Mark step as submitted to enable Next button
        if (onStepSubmitted) {
             onStepSubmitted(6); // Step 6 is the images step
        }
      }

    } catch (error: any) {
      console.error('Upload failed:', error);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
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
                  cursor: fields.length >= 10 ? 'not-allowed' : 'pointer',
                  transition: 'border-color 0.3s',
                  opacity: fields.length >= 10 ? 0.6 : 1,
                  '&:hover': fields.length < 10 ? {
                    borderColor: 'primary.main',
                    backgroundColor: 'action.hover',
                  } : {},
                }}
                onDrop={fields.length < 10 ? handleDrop : undefined}
                onDragOver={fields.length < 10 ? handleDragOver : undefined}
                onClick={fields.length < 10 ? () => fileInputRef.current?.click() : undefined}
              >
                <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  {fields.length >= 10 ? 'Maximum images reached' : 'Drop images here or click to browse'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Supports JPG, PNG, GIF up to 10MB each • {fields.length}/10 images uploaded
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  disabled={fields.length >= 10}
                >
                  {fields.length >= 10 ? 'Limit Reached' : 'Select Images'}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                  disabled={fields.length >= 10}
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
        {fields.length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Uploaded Images ({fields.length})
            </Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {fields.map((field, index) => {
                const image = watchedValues.property_images?.[index];
                return (
                  <Box sx={{ flex: '1 1 250px', minWidth: '250px', maxWidth: '300px' }} key={field.id}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <Box sx={{ position: 'relative' }}>
                        <Box
                          sx={{
                            height: 200,
                            backgroundImage: `url(${image?.preview_url || image?.url})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            cursor: 'pointer',
                          }}
                          onClick={() => openPreview(image?.preview_url || image?.url || '')}
                        />
                        
                        {/* Primary Badge */}
                        {image?.is_primary && (
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
                        {image?.file && (
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
                            right: image?.file ? 120 : 8, // Adjust position if upload badge is present
                            display: 'flex',
                            gap: 0.5,
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() => openPreview(image?.preview_url || image?.url || '')}
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
                            <FormControl fullWidth size="small" error={!!errors.property_images?.[index]?.image_type}>
                              <InputLabel>Image Type</InputLabel>
                          <Select
                                {...register(`property_images.${index}.image_type`)}
                                value={image?.image_type || ''}
                                onChange={(e) => setValue(`property_images.${index}.image_type`, e.target.value)}
                                label="Image Type"
                              >
                                {imageTypes.map((type) => (
                                  <MenuItem key={type} value={type}>
                                    {type}
                                  </MenuItem>
                                ))}
                          </Select>
                              {errors.property_images?.[index]?.image_type && (
                                <FormHelperText>{errors.property_images[index].image_type.message}</FormHelperText>
                              )}
                        </FormControl>
                      </Box>

                          <Box>
                            <TextField
                              {...register(`property_images.${index}.caption`)}
                              label="Caption *"
                              fullWidth
                        size="small"
                              multiline
                              rows={2}
                              required
                              error={!!errors.property_images?.[index]?.caption}
                              helperText={errors.property_images?.[index]?.caption?.message || 'Caption is required'}
                              placeholder="Enter image caption..."
                            />
                </Box>
              </Box>
            </CardContent>
          </Card>
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}

        {/* Update Button */}
        {fields.length > 0 && (
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={isSubmitting || uploading || isUploaded}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : <CloudUpload />}
              sx={{ 
                minWidth: 200,
                backgroundColor: isUploaded ? 'success.main' : 'error.main',
                '&:hover': {
                  backgroundColor: isUploaded ? 'success.dark' : 'error.dark',
                }
              }}
            >
              {isUploaded ? 'Uploaded Successfully' : isSubmitting ? 'Uploading...' : 'Update Images'}
            </Button>
          </Box>
        )}

        {/* Empty State */}
        {fields.length === 0 && (
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

export default CompletePropertyImagesForm;
