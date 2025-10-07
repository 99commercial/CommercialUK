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
import axiosInstance from '../../../../utils/axios';
import { enqueueSnackbar } from 'notistack';

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

interface PropertyDocument {
  _id?: string;
  document_name?: string;
  document_type?: string;
  download_count?: number;
  file_name?: string;
  file_size?: number;
  file_url?: string;
  mime_type?: string;
  upload_status?: string;
  uploaded_at?: string;
  file?: File; // Store the actual file for later upload
}

interface PropertyDocumentsData {
  _id?: string;
  property_id?: string;
  documents?: PropertyDocument[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface UpdatePropertyDocumentsFormProps {
  onStepSubmitted?: (step: number) => void;
  initialData?: PropertyDocumentsData;
  onDataChange?: (data: PropertyDocumentsData) => void;
  propertyId?: string;
  fetchProperty?: () => void;
}

const UpdatePropertyDocumentsForm: React.FC<UpdatePropertyDocumentsFormProps> = ({ 
  onStepSubmitted, 
  initialData, 
  onDataChange,
  propertyId,
  fetchProperty
}) => {
  const [formData, setFormData] = useState<PropertyDocumentsData>({
    documents: initialData?.documents || [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update form data when initialData changes
  React.useEffect(() => {
    if (initialData) {
      setFormData({
        _id: initialData._id || '',
        property_id: initialData.property_id || '',
        documents: initialData.documents || [],
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
        documents: initialData.documents || [],
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

    (formData.documents || []).forEach((document, index) => {
      if (!document.document_type) {
        errors[`document_${index}_type`] = 'Document type is required';
      }
    });

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleDocumentChange = (index: number, field: keyof PropertyDocument, value: any) => {
    setFormData(prev => ({
      ...prev,
      documents: (prev.documents || []).map((document, i) => 
        i === index ? { ...document, [field]: value } : document
      )
    }));
  };

  const handleFileUpload = async (files: FileList) => {
    // Check if adding these files would exceed the 5-file limit
    const currentDocumentCount = (formData.documents || []).length;
    const newFileCount = files.length;
    
    if (currentDocumentCount + newFileCount > 5) {
      enqueueSnackbar('Maximum 5 documents allowed', { variant: 'error' });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadedDocuments: PropertyDocument[] = [];
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
        
        // Create document data for form storage
        const uploadedDocument: PropertyDocument = {
          _id: `temp_${Date.now() + i}`,
          document_name: file.name,
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type,
          document_type: 'Other',
          uploaded_at: new Date().toISOString(),
          file_url: URL.createObjectURL(file), // Mock URL
          download_count: 0,
          upload_status: 'Pending',
          file: file, // Store the actual file for later upload
        };

        console.log('Created document:', uploadedDocument);
        uploadedDocuments.push(uploadedDocument);
        validFiles.push(file);
      }

      // Store files separately and add metadata to form
      setPendingFiles(prev => [...prev, ...validFiles]);
      setFormData(prev => ({
        ...prev,
        documents: [...(prev.documents || []), ...uploadedDocuments]
      }));

      enqueueSnackbar(`${uploadedDocuments.length} document(s) added successfully`, { variant: 'success' });

    } catch (error) {
      console.error('Upload failed:', error);
      enqueueSnackbar('Failed to add documents', { variant: 'error' });
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
    setFormData(prev => ({
      ...prev,
      documents: (prev.documents || []).filter((_, i) => i !== index)
    }));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
      // Separate existing documents from new documents
      const existingDocuments = (formData.documents || []).filter(doc => !doc.file);
      const newDocuments = (formData.documents || []).filter(doc => doc.file);

      // Prepare form data for mixed update
      const formDataToSend = new FormData();

      // Add existing documents as JSON string with the required structure
      if (existingDocuments.length > 0) {
        const existingDocumentsData = existingDocuments.map(doc => ({
          document_name: doc.document_name,
          document_type: doc.document_type,
          download_count: doc.download_count || 0,
          file_name: doc.file_name,
          file_size: doc.file_size,
          file_url: doc.file_url,
          mime_type: doc.mime_type,
          upload_status: doc.upload_status || 'Completed',
          uploaded_at: doc.uploaded_at,
          _id: doc._id
        }));
        formDataToSend.append('existing_documents', JSON.stringify(existingDocumentsData));
      }

      // Add new documents as files and their types
      if (newDocuments.length > 0) {
        newDocuments.forEach((doc) => {
          if (doc.file) {
            formDataToSend.append('files', doc.file);
            formDataToSend.append('file_types', doc.document_type || 'Other');
          }
        });
      }

      console.log('FormData being sent:', {
        existing_documents: existingDocuments.length > 0 ? existingDocuments.map(doc => ({
          document_name: doc.document_name,
          document_type: doc.document_type,
          download_count: doc.download_count || 0,
          file_name: doc.file_name,
          file_size: doc.file_size,
          file_url: doc.file_url,
          mime_type: doc.mime_type,
          upload_status: doc.upload_status || 'Completed',
          uploaded_at: doc.uploaded_at,
          _id: doc._id
        })) : 'No existing documents',
        new_files: newDocuments.length,
        file_types: newDocuments.map(doc => doc.document_type || 'Other')
      });

      const response = await axiosInstance.put(`/api/user/properties/${propertyId}/documents/mixed`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        setIsSubmitted(true);
        setHasChanges(false); // Reset changes flag after successful update
        enqueueSnackbar('Property documents updated successfully!', { variant: 'success' });
        
        // Refresh property data if callback is provided
        if (fetchProperty) {
          fetchProperty();
        }
        
        if (onStepSubmitted) {
          onStepSubmitted(7);
        }
      } else {
        throw new Error(response.data.message || 'Failed to update property documents');
      }
    } catch (error: any) {
      console.error('Error updating property documents:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update property documents';
      setSubmitError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
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
                  cursor: (formData.documents || []).length >= 5 ? 'not-allowed' : 'pointer',
                  transition: 'border-color 0.3s',
                  opacity: (formData.documents || []).length >= 5 ? 0.6 : 1,
                  '&:hover': (formData.documents || []).length < 5 ? {
                    borderColor: 'primary.main',
                    backgroundColor: 'action.hover',
                  } : {},
                }}
                onDrop={(formData.documents || []).length < 5 ? handleDrop : undefined}
                onDragOver={(formData.documents || []).length < 5 ? handleDragOver : undefined}
                onClick={(formData.documents || []).length < 5 ? () => fileInputRef.current?.click() : undefined}
              >
                <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  {(formData.documents || []).length >= 5 ? 'Maximum documents reached' : 'Drop documents here or click to browse'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Supports PDF files up to 20MB each • {(formData.documents || []).length}/5 documents uploaded
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<Add />}
                  disabled={(formData.documents || []).length >= 5}
                >
                  {(formData.documents || []).length >= 5 ? 'Limit Reached' : 'Select Documents'}
              </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                  disabled={(formData.documents || []).length >= 5}
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
        {(formData.documents || []).length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Uploaded Documents ({(formData.documents || []).length})
            </Typography>
            
            <Card variant="outlined">
              <List>
                {(formData.documents || []).map((document, index) => (
                  <ListItem key={document._id || index} divider={index < (formData.documents || []).length - 1}>
                    <ListItemIcon>
                      {getFileIcon(document?.mime_type || '')}
                    </ListItemIcon>
                    
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1">
                            {document?.document_name}
                          </Typography>
                          <Chip
                            label={document?.document_type || 'Unknown'}
                            size="small"
                            color={getFileTypeColor(document?.mime_type || '') as any}
                            variant="outlined"
                          />
                          {document.file && (
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
                          onClick={() => window.open(document?.file_url, '_blank')}
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
                ))}
              </List>
            </Card>
          </Box>
        )}

        {/* Document Settings */}
        {(formData.documents || []).length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Document Settings
            </Typography>

                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {(formData.documents || []).map((document, index) => (
                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }} key={document._id || index}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        {document?.document_name}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box>
                          <FormControl fullWidth size="small" error={!!fieldErrors[`document_${index}_type`]}>
                      <InputLabel>Document Type</InputLabel>
                      <Select
                              value={document?.document_type || ''}
                        onChange={(e) => handleDocumentChange(index, 'document_type', e.target.value)}
                        label="Document Type"
                      >
                        {documentTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                      {fieldErrors[`document_${index}_type`] && (
                        <FormHelperText>{fieldErrors[`document_${index}_type`]}</FormHelperText>
                      )}
                    </FormControl>
                  </Box>
                  </Box>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
            
            {/* Update Documents Button */}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
                size="large"
                onClick={handleSubmit}
                disabled={isSubmitting || uploading || !hasChanges}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : <CloudUpload />}
            sx={{
              minWidth: 200,
                  backgroundColor: hasChanges ? 'error.main' : 'grey.400',
              '&:hover': {
                    backgroundColor: hasChanges ? 'error.dark' : 'grey.500',
                  }
                }}
              >
                {isSubmitting ? 'Updating...' : hasChanges ? 'Update Documents' : 'No Changes'}
              </Button>
            </Box>
          </Box>
        )}

        {/* Empty State */}
        {(formData.documents || []).length === 0 && (
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

export default UpdatePropertyDocumentsForm;