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
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Add,
  Delete,
  Description,
  CloudUpload,
  AttachFile,
  Download,
  Visibility,
  Edit,
} from '@mui/icons-material';
import { useFormContext, useFieldArray, FieldErrors } from 'react-hook-form';
import axiosInstance from '../../../utils/axios';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

const documentTypes = [
  'Floor Plan',
  'EPC Certificate',
  'Planning Permission',
  'Title Deeds',
  'Lease Agreement',
  'Survey Report',
  'Insurance Certificate',
  'Health & Safety Certificate',
  'Fire Safety Certificate',
  'Other',
];

const supportedFileTypes = [
  'application/pdf',
];

interface PropertyDocumentsFormData {
  property_documents: Array<{
    id?: number;
    file_name?: string;
    file_size?: number;
    file_type?: string;
    document_type?: string;
    uploaded_at?: string;
    download_url?: string;
    file?: File; // Store the actual file for later upload
  }>;
}

interface PropertyDocumentsFormProps {
  onStepSubmitted?: (data: any) => void;
}

const PropertyDocumentsForm: React.FC<PropertyDocumentsFormProps> = ({ onStepSubmitted }) => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
    control,
  } = useFormContext<PropertyDocumentsFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'property_documents',
  });

  const router = useRouter();
  const { propertyId } = router.query;

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]); // Store files separately
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { enqueueSnackbar } = useSnackbar();

  const watchedValues = watch();

  const handleFileUpload = async (files: FileList) => {
    // Check if adding these files would exceed the 5-file limit
    const currentDocumentCount = fields.length;
    const newFileCount = files.length;
    
    if (currentDocumentCount + newFileCount > 5) {
      enqueueSnackbar('Maximum 5 documents allowed', { variant: 'error' });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadedDocuments = [];
      const validFiles: File[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file type
        if (!supportedFileTypes.includes(file.type)) {
          console.warn(`Unsupported file type: ${file.type}`);
          enqueueSnackbar(`Unsupported file type: ${file.name}`, { variant: 'error' });
          continue;
        }

        // Validate file size (20MB limit)
        if (file.size > 20 * 1024 * 1024) {
          console.warn(`File too large: ${file.name}`);
          enqueueSnackbar(`File too large: ${file.name} (max 20MB)`, { variant: 'error' });
          continue;
        }

        // Simulate upload progress
        const progress = ((i + 1) / files.length) * 100;
        setUploadProgress(progress);
        
        // Create document data for form storage (without file object)
        const uploadedDocument = {
          id: Date.now() + i,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          document_type: 'Other',
          uploaded_at: new Date().toISOString(),
          download_url: URL.createObjectURL(file), // Mock URL
        };

        console.log('Created document:', uploadedDocument);
        uploadedDocuments.push(uploadedDocument);
        validFiles.push(file);
      }

      // Store files separately and add metadata to form
      setPendingFiles(prev => [...prev, ...validFiles]);
      uploadedDocuments.forEach(doc => append(doc));

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

  const removeDocument = (index: number) => {
    // Remove from pending files if it exists
    if (index < pendingFiles.length) {
      setPendingFiles(prev => prev.filter((_, i) => i !== index));
    }
    remove(index);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async () => {
    const storedPropertyId = localStorage.getItem('propertyId');
    if (!storedPropertyId) {
      console.error('Property ID not found in localStorage');
      enqueueSnackbar('Property ID not found. Please create the property first.', { variant: 'error' });
      return;
    }

    console.log('Pending files:', pendingFiles);
    console.log('Form documents:', fields);

    if (pendingFiles.length === 0) {
      console.log('No files to upload');
      enqueueSnackbar('No documents to upload.', { variant: 'info' });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for multipart upload
      const formData = new FormData();
      
      // Add files to FormData
      pendingFiles.forEach((file) => {
        formData.append('files', file);
      });

      // Add document types - map each pending file to its corresponding document type
      const documentTypes = pendingFiles.map((file, index) => {
        // Find the corresponding form field for this file
        const correspondingField = fields[index];
        if (correspondingField) {
          const docType = watchedValues.property_documents?.[index]?.document_type;
          console.log(`File ${file.name} -> Document type: ${docType}`);
          return docType || 'Other';
        }
        return 'Other';
      });
      
      // Add document types as JSON string to ensure it's received as array
      formData.append('document_types', JSON.stringify(documentTypes));

      // Debug FormData contents
      console.log('pendingFiles:', pendingFiles);
      console.log('documentTypes:', documentTypes);
      console.log('FormData entries:');

      // Upload to backend
      const response = await axiosInstance.put(
        `/api/user/properties/${storedPropertyId}/documents`,
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

      if (response.data.success) {
        // Clear pending files since they're now uploaded
        setPendingFiles([]);
        setIsUploaded(true);
        
        // Update propertyId in localStorage
        if (response.data.data && response.data.data._id) {
          localStorage.removeItem('propertyId');
        }

        localStorage.removeItem('newpropertyId');
        
        // Show success message
        enqueueSnackbar('Documents uploaded successfully!', { variant: 'success' });
        console.log('Documents uploaded successfully');
        
        // Mark step as submitted to enable Next button
        if (onStepSubmitted) {
          onStepSubmitted(7); // Step 7 is the documents step
        }
      }

    } catch (error: any) {
      console.error('Upload failed:', error);
      enqueueSnackbar(error?.response?.data?.message || 'Failed to upload documents. Please try again.', { variant: 'error' });
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <Description color="error" />;
    if (fileType.includes('word') || fileType.includes('document')) return <AttachFile color="primary" />;
    if (fileType.includes('image')) return <Visibility color="secondary" />;
    return <AttachFile color="action" />;
  };

  const getFileTypeColor = (fileType: string) => {
    if (fileType.includes('pdf')) return 'error';
    if (fileType.includes('word') || fileType.includes('document')) return 'primary';
    if (fileType.includes('image')) return 'secondary';
    return 'default';
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Property Documents
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Upload legal documents, certificates, and other important files related to your property.
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Upload Area */}
        <Box>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upload Documents
              </Typography>
              
              <Paper
                variant="outlined"
                sx={{
                  p: 4,
                  textAlign: 'center',
                  border: '2px dashed #e0e0e0',
                  borderRadius: 2,
                  cursor: fields.length >= 5 ? 'not-allowed' : 'pointer',
                  transition: 'border-color 0.3s',
                  opacity: fields.length >= 5 ? 0.6 : 1,
                  '&:hover': fields.length < 5 ? {
                    borderColor: 'primary.main',
                    backgroundColor: 'action.hover',
                  } : {},
                }}
                onDrop={fields.length < 5 ? handleDrop : undefined}
                onDragOver={fields.length < 5 ? handleDragOver : undefined}
                onClick={fields.length < 5 ? () => fileInputRef.current?.click() : undefined}
              >
                <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  {fields.length >= 5 ? 'Maximum documents reached' : 'Drop documents here or click to browse'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Supports PDF files up to 20MB each • {fields.length}/5 documents uploaded
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<Add />}
                  disabled={fields.length >= 5}
                >
                  {fields.length >= 5 ? 'Limit Reached' : 'Select Documents'}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                  disabled={fields.length >= 5}
                />
              </Paper>

              {uploading && (
                <Box sx={{ mt: 2 }}>
                  <LinearProgress variant="determinate" value={uploadProgress} />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Uploading documents... {Math.round(uploadProgress)}%
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Documents List */}
        {fields.length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Uploaded Documents ({fields.length})
            </Typography>
            
            <Card variant="outlined">
              <List>
                {fields.map((field, index) => {
                  const document = watchedValues.property_documents?.[index];
                  return (
                    <ListItem key={field.id} divider={index < fields.length - 1}>
                      <ListItemIcon>
                        {getFileIcon(document?.file_type || '')}
                      </ListItemIcon>
                      
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1">
                              {document?.file_name}
                            </Typography>
                            <Chip
                              label={document?.document_type || 'Unknown'}
                              size="small"
                              color={getFileTypeColor(document?.file_type || '') as any}
                              variant="outlined"
                            />
                            {index < pendingFiles.length && (
                              <Chip
                                label="Pending Upload"
                                color="warning"
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {formatFileSize(document?.file_size || 0)} • Uploaded {document?.uploaded_at ? new Date(document.uploaded_at).toLocaleDateString() : 'Unknown date'}
                            </Typography>
                          </Box>
                        }
                      />

                      <ListItemSecondaryAction>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <IconButton
                            size="small"
                            onClick={() => window.open(document?.download_url, '_blank')}
                          >
                            <Download />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => removeDocument(index)}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })}
              </List>
            </Card>
          </Box>
        )}

        {/* Document Settings */}
        {fields.length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Document Settings
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {fields.map((field, index) => {
                const document = watchedValues.property_documents?.[index];
                return (
                  <Box sx={{ flex: '1 1 300px', minWidth: '300px' }} key={field.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          {document?.file_name}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <Box>
                            <FormControl fullWidth size="small" error={!!errors.property_documents?.[index]?.document_type}>
                              <InputLabel>Document Type</InputLabel>
                              <Select
                                {...register(`property_documents.${index}.document_type`)}
                                value={document?.document_type || ''}
                                onChange={(e) => {
                                  console.log(`Setting document type for index ${index}:`, e.target.value);
                                  setValue(`property_documents.${index}.document_type`, e.target.value);
                                }}
                                label="Document Type"
                              >
                                {documentTypes.map((type) => (
                                  <MenuItem key={type} value={type}>
                                    {type}
                                  </MenuItem>
                                ))}
                              </Select>
                              {errors.property_documents?.[index]?.document_type && (
                                <FormHelperText>{errors.property_documents[index].document_type.message}</FormHelperText>
                              )}
                            </FormControl>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                );
              })}
            </Box>
            
            {/* Update Documents Button */}
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
                {isUploaded ? 'Uploaded Successfully' : isSubmitting ? 'Uploading...' : 'Update Documents'}
              </Button>
            </Box>
          </Box>
        )}

        {/* Empty State */}
        {fields.length === 0 && (
          <Box>
            <Card variant="outlined" sx={{ textAlign: 'center', py: 4 }}>
              <CardContent>
                <Description sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  No Documents Uploaded
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Upload important documents like EPC certificates, floor plans, and legal documents.
                </Typography>
                <Button
                  startIcon={<Add />}
                  onClick={() => fileInputRef.current?.click()}
                  variant="contained"
                >
                  Upload First Document
                </Button>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Tips */}
        <Box>
          <Alert severity="info">
            <Typography variant="subtitle2" gutterBottom>
              📄 Document Tips:
            </Typography>
            <Typography variant="body2">
              • Upload EPC certificates and floor plans for better property visibility<br/>
              • Include planning permission documents when available<br/>
              • Set documents as public to show them to potential tenants/buyers<br/>
              • Use descriptive file names for better organization<br/>
              • Keep file sizes reasonable for faster loading
            </Typography>
          </Alert>
        </Box>
      </Box>
    </Box>
  );
};

export default PropertyDocumentsForm;
