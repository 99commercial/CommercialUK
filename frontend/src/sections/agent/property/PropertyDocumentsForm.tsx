import React, { useState, useRef, useEffect, useMemo } from 'react';
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
    _id?: string;
    document_name?: string;
    file_name?: string;
    file_size?: number;
    mime_type?: string;
    file_type?: string;
    document_type?: string;
    uploaded_at?: string;
    file_url?: string;
    download_url?: string;
    url?: string;
    file?: File;
  }>;
}

interface PropertyDocumentsFormProps {
  onStepSubmitted?: (data: any) => void;
  propertyData?: any;
  hasExistingData?: boolean;
  fetchPropertyData?: () => void;
}

const PropertyDocumentsForm: React.FC<PropertyDocumentsFormProps> = ({
  onStepSubmitted,
  propertyData,
  hasExistingData = false,
  fetchPropertyData,
}) => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
    control,
  } = useFormContext<PropertyDocumentsFormData>();

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'property_documents',
  });

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { enqueueSnackbar } = useSnackbar();
  const lastPropertyIdRef = useRef<string | null>(null);
  const hasInitializedRef = useRef<boolean>(false);

  const watchedValues = watch();

  useEffect(() => {
    const currentPropertyId = propertyData?._id || null;
    const existingDocs = propertyData?.documents_id?.documents;

    if (propertyData?.documents_id?._id && Array.isArray(existingDocs)) {
      const shouldInitialize =
        !hasInitializedRef.current ||
        (currentPropertyId !== null && lastPropertyIdRef.current !== currentPropertyId);

      if (shouldInitialize) {
        const mappedDocuments = existingDocs.map((doc: any, index: number) => ({
          id: Date.now() + index,
          _id: doc._id,
          document_name: doc.document_name || doc.file_name || '',
          file_name: doc.file_name || doc.document_name || '',
          file_size: doc.file_size || 0,
          mime_type: doc.mime_type || '',
          file_type: doc.mime_type || '',
          document_type: doc.document_type || 'Other',
          uploaded_at: doc.uploaded_at || doc.createdAt || new Date().toISOString(),
          file_url: doc.file_url || doc.url || '',
          download_url: doc.file_url || doc.url || '',
          url: doc.file_url || doc.url || '',
        }));

        replace(mappedDocuments as any);
        lastPropertyIdRef.current = currentPropertyId;
        hasInitializedRef.current = true;
      }
    } else if (hasInitializedRef.current && currentPropertyId !== lastPropertyIdRef.current) {
      replace([]);
      lastPropertyIdRef.current = currentPropertyId;
    }
  }, [propertyData?._id, propertyData?.documents_id?._id, propertyData?.documents_id?.documents, replace]);

  const handleFileUpload = async (files: FileList) => {
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
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        if (!supportedFileTypes.includes(file.type)) {
          enqueueSnackbar(`Unsupported file type: ${file.name}`, { variant: 'error' });
          continue;
        }

        if (file.size > 20 * 1024 * 1024) {
          enqueueSnackbar(`File too large: ${file.name} (max 20MB)`, { variant: 'error' });
          continue;
        }

        const progress = ((i + 1) / files.length) * 100;
        setUploadProgress(progress);
        
        const uploadedDocument = {
          id: Date.now() + i,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          document_type: 'Other',
          uploaded_at: new Date().toISOString(),
          download_url: URL.createObjectURL(file),
          url: '',
          file,
        };

        uploadedDocuments.push(uploadedDocument);
      }

      uploadedDocuments.forEach(doc => append(doc));

    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to upload documents. Please try again.';
      enqueueSnackbar(errorMessage, { variant: 'error' });
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
    remove(index);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getPropertyId = () => {
    if (propertyData?._id) {
      return propertyData._id;
    }
    if (typeof window !== 'undefined') {
      return localStorage.getItem('newpropertyId') || localStorage.getItem('propertyId');
    }
    return null;
  };

  const handleCreateDocuments = async (propertyId: string, documents: any[]) => {
    const newDocuments = documents.filter((doc: any) => !!doc.file);
    if (newDocuments.length === 0) {
      enqueueSnackbar('Please upload at least one document to continue.', { variant: 'info' });
      return;
    }

    const formData = new FormData();
    newDocuments.forEach((doc: any) => {
      formData.append('files', doc.file);
    });

    const docTypes = newDocuments.map((doc: any) => doc.document_type || 'Other');
    formData.append('document_types', JSON.stringify(docTypes));

    return axiosInstance.put(`/api/agent/properties/${propertyId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      },
    });
  };

  const handleUpdateDocuments = async (propertyId: string, documents: any[]) => {
    const formData = new FormData();
    const existingDocuments = documents
      .filter((doc: any) => !doc.file)
      .map((doc: any, index: number) => {
        const fileUrl = doc.file_url || doc.url || doc.download_url || '';
        const documentName = doc.document_name || doc.file_name || `Document ${index + 1}`;
        return {
          _id: doc._id,
          document_name: documentName,
          document_type: doc.document_type || 'Other',
          file_url: fileUrl,
          file_name: doc.file_name || documentName,
          file_size: doc.file_size || 0,
          mime_type: doc.mime_type || doc.file_type || 'application/pdf',
          download_count: doc.download_count || 0,
          upload_status: doc.upload_status || 'Completed',
          uploaded_at: doc.uploaded_at || doc.createdAt || new Date().toISOString(),
        };
      });

    const newDocuments = documents.filter((doc: any) => !!doc.file);
    if (newDocuments.length > 0) {
      newDocuments.forEach((doc: any) => {
        formData.append('files', doc.file);
      });
      newDocuments.forEach((doc: any) => {
        formData.append('file_types', doc.document_type || 'Other');
      });
    }

    formData.append('existing_documents', JSON.stringify(existingDocuments));

    return axiosInstance.put(`/api/agent/properties/${propertyId}/documents/mixed`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      },
    });
  };

  const handleSubmit = async () => {
    const propertyId = getPropertyId();
    if (!propertyId) {
      enqueueSnackbar('Property ID not found. Please create the property first.', { variant: 'error' });
      return;
    }

    const watchedDocuments = watchedValues.property_documents || [];
    const documents = fields.map((field: any, index: number) => ({
      ...field,
      ...(watchedDocuments[index] || {}),
    }));
    if (documents.length === 0) {
      enqueueSnackbar('No documents to upload.', { variant: 'info' });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = hasExistingData
        ? await handleUpdateDocuments(propertyId, documents)
        : await handleCreateDocuments(propertyId, documents);

      if (response?.data?.success || response?.data?.data) {
        setIsUploaded(true);
        enqueueSnackbar(
          hasExistingData ? 'Documents updated successfully!' : 'Documents uploaded successfully!',
          { variant: 'success' }
        );

        await Promise.resolve(fetchPropertyData?.());
        setTimeout(() => {
          fetchPropertyData?.();
        }, 600);

        if (!hasExistingData) {
          if (response?.data?.data?._id) {
            localStorage.removeItem('propertyId');
          }
          localStorage.removeItem('newpropertyId');
        }

        if (onStepSubmitted) {
          onStepSubmitted(7);
        }
      }
    } catch (error: any) {
      console.error('Document request failed:', error);
      enqueueSnackbar(error?.response?.data?.message || 'Failed to save documents. Please try again.', {
        variant: 'error'
      });
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const handleSubmitSafe = () => {
    void handleSubmit().catch((error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to save documents. Please try again.';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    });
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

  const hasNewDocuments = (watchedValues.property_documents || []).some((doc: any) => !!doc?.file);
  const originalDocumentKeys = useMemo(() => {
    const originalDocs = propertyData?.documents_id?.documents || [];
    return originalDocs
      .map((doc: any) => String(doc?._id || doc?.file_url || doc?.url || doc?.file_name || ''))
      .filter(Boolean);
  }, [propertyData?.documents_id?.documents]);

  const currentExistingDocumentKeys = useMemo(() => {
    const watchedDocuments = watchedValues.property_documents || [];
    const mergedDocuments = fields.map((field: any, index: number) => ({
      ...field,
      ...(watchedDocuments[index] || {}),
    }));

    return mergedDocuments
      .filter((doc: any) => !doc?.file)
      .map((doc: any) => String(doc?._id || doc?.file_url || doc?.url || doc?.file_name || ''))
      .filter(Boolean);
  }, [fields, watchedValues.property_documents]);

  const hasRemovedExistingDocuments = useMemo(() => {
    if (!hasExistingData) return false;
    if (originalDocumentKeys.length === 0) return false;

    return originalDocumentKeys.some((key) => !currentExistingDocumentKeys.includes(key));
  }, [hasExistingData, originalDocumentKeys, currentExistingDocumentKeys]);

  const isButtonDisabled = isSubmitting || uploading || (isUploaded && !hasNewDocuments && !hasRemovedExistingDocuments);
  const showUpdateButton = hasExistingData && (hasNewDocuments || hasRemovedExistingDocuments);

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
                  Supports PDF files up to 20MB each &bull; {fields.length}/5 documents uploaded
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
                  const isNew = !!(field as any).file || !!document?.file;
                  return (
                    <ListItem key={field.id} divider={index < fields.length - 1}>
                      <ListItemIcon>
                        {getFileIcon(document?.file_type || document?.mime_type || '')}
                      </ListItemIcon>
                      
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1">
                              {document?.file_name || document?.document_name}
                            </Typography>
                            <Chip
                              label={document?.document_type || 'Unknown'}
                              size="small"
                              color={getFileTypeColor(document?.file_type || document?.mime_type || '') as any}
                              variant="outlined"
                            />
                            {isNew && (
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
                              {formatFileSize(document?.file_size || 0)} &bull; Uploaded {document?.uploaded_at ? new Date(document.uploaded_at).toLocaleDateString() : 'Unknown date'}
                            </Typography>
                          </Box>
                        }
                      />

                      <ListItemSecondaryAction>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          {!isNew && (document?.download_url || document?.file_url || document?.url) && (
                            <IconButton
                              size="small"
                              onClick={() => window.open(document?.download_url || document?.file_url || document?.url, '_blank')}
                            >
                              <Download />
                            </IconButton>
                          )}
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
                          {document?.file_name || document?.document_name}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <Box>
                            <FormControl fullWidth size="small" error={!!errors.property_documents?.[index]?.document_type}>
                              <InputLabel>Document Type</InputLabel>
                              <Select
                                {...register(`property_documents.${index}.document_type`)}
                                value={document?.document_type || ''}
                                onChange={(e) => {
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
                                <FormHelperText>{(errors.property_documents[index] as any).document_type.message}</FormHelperText>
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
            
            {/* Submit / Update Documents Button */}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleSubmitSafe}
                disabled={isSubmitting || uploading || (hasExistingData && !hasNewDocuments && !hasRemovedExistingDocuments && isUploaded)}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : <CloudUpload />}
                sx={{ 
                  minWidth: 200,
                  backgroundColor: isUploaded && !hasNewDocuments && !hasRemovedExistingDocuments ? 'success.main' : '#f2c514',
                  '&:hover': {
                    backgroundColor: isUploaded && !hasNewDocuments && !hasRemovedExistingDocuments ? 'success.dark' : '#d4a912',
                  }
                }}
              >
                {isUploaded && !hasNewDocuments && !hasRemovedExistingDocuments
                  ? 'Uploaded Successfully'
                  : isSubmitting
                    ? 'Uploading...'
                    : hasExistingData
                      ? 'Update Documents'
                      : 'Upload Documents'
                }
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
              Document Tips:
            </Typography>
            <Typography variant="body2">
              &bull; Upload EPC certificates and floor plans for better property visibility<br/>
              &bull; Include planning permission documents when available<br/>
              &bull; Use descriptive file names for better organization<br/>
              &bull; Keep file sizes reasonable for faster loading
            </Typography>
          </Alert>
        </Box>
      </Box>
    </Box>
  );
};

export default PropertyDocumentsForm;
