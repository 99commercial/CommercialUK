import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { Save as SaveIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { enqueueSnackbar } from 'notistack';
import axiosInstance from '../../../utils/axios';
import { Page } from '../../../components';

interface TitleParagraphItem {
  title: string;
  paragraph: string;
}

interface LawJurisdictionFormData {
  content: TitleParagraphItem[];
}

const GeneralPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LawJurisdictionFormData>({
    defaultValues: {
      content: [{ title: '', paragraph: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'content',
  });

  // Fetch existing settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsFetching(true);
        const response = await axiosInstance.get('/api/admin/static-pages/general-page', {
          params: {
            id: '696f52c16de78eddcec85424',
          },
        });
        
        if (response.data.success && response.data.data) {
          // Map LegalContent from backend (title, description) to frontend format (title, paragraph)
          const legalContent = response.data.data.LegalContent || [];
          const content = legalContent.length > 0
            ? legalContent.map((item: any) => ({
                title: item.title || '',
                paragraph: item.description || '',
              }))
            : [{ title: '', paragraph: '' }];
          
          reset({ content });
        }
      } catch (err: any) {
        // If endpoint doesn't exist yet, that's okay - we'll just use defaults
        console.log('General page endpoint not found, using defaults');
      } finally {
        setIsFetching(false);
      }
    };

    fetchSettings();
  }, [reset]);

  const onSubmit = async (data: LawJurisdictionFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Map frontend format (title, paragraph) to backend format (title, description) in LegalContent
      const LegalContent = data.content.map((item) => ({
        title: item.title,
        description: item.paragraph,
      }));

      const response = await axiosInstance.patch('/api/admin/static-pages/general-page', {
        id: '696f52c16de78eddcec85424',
        LegalContent,
      });

      if (response.data.success) {
        setSuccess('Content updated successfully!');
        enqueueSnackbar('Content updated successfully', { variant: 'success' });
      } else {
        throw new Error(response.data.message || 'Failed to update content');
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to update content';
      setError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <Page title="Law and Jurisdiction Settings">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </Page>
    );
  }

  return (
    <Page title="Law and Jurisdiction Settings">
      <Box>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 1 }}>
            Law and Jurisdiction Settings
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Update the legal framework and jurisdiction information for the platform.
          </Typography>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Grid container spacing={3}>
                {/* Title and Paragraph Sections */}
                <Grid size={12}>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Content Sections
                      </Typography>
                      <Button
                        type="button"
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => append({ title: '', paragraph: '' })}
                        sx={{
                          borderColor: '#667eea',
                          color: '#667eea',
                          '&:hover': {
                            borderColor: '#5568d3',
                            backgroundColor: 'rgba(102, 126, 234, 0.04)',
                          },
                        }}
                      >
                        Add Content
                      </Button>
                    </Box>

                    {fields.map((field, index) => (
                      <Card key={field.id} sx={{ mb: 3, border: '1px solid #e5e7eb' }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                              Section {index + 1}
                            </Typography>
                            {fields.length > 1 && (
                              <Button
                                type="button"
                                variant="outlined"
                                color="error"
                                size="small"
                                startIcon={<DeleteIcon />}
                                onClick={() => remove(index)}
                                sx={{ minWidth: 'auto' }}
                              >
                                Remove
                              </Button>
                            )}
                          </Box>

                          <Grid container spacing={2}>
                            <Grid size={12}>
                              <Controller
                                name={`content.${index}.title` as const}
                                control={control}
                                rules={{ required: 'Title is required' }}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    fullWidth
                                    label="Title"
                                    placeholder="Enter the title..."
                                    required
                                    error={!!errors.content?.[index]?.title}
                                    helperText={errors.content?.[index]?.title?.message || 'Enter a title for this section'}
                                  />
                                )}
                              />
                            </Grid>

                            <Grid size={12}>
                              <Controller
                                name={`content.${index}.paragraph` as const}
                                control={control}
                                rules={{ required: 'Paragraph is required' }}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    fullWidth
                                    label="Paragraph"
                                    placeholder="Enter the paragraph content..."
                                    required
                                    multiline
                                    rows={4}
                                    error={!!errors.content?.[index]?.paragraph}
                                    helperText={errors.content?.[index]?.paragraph?.message || 'Enter paragraph content for this section'}
                                  />
                                )}
                              />
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                </Grid>

                {/* Submit Button */}
                <Grid size={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                      disabled={isLoading}
                      sx={{
                        minWidth: 150,
                        backgroundColor: '#667eea',
                        '&:hover': {
                          backgroundColor: '#5568d3',
                        },
                      }}
                    >
                      {isLoading ? 'Saving...' : 'Save Content'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </form>
      </Box>
    </Page>
  );
};

export default GeneralPage;
