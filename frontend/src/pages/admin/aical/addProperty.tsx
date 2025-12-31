import React, { useState } from 'react';
import { Box, Alert, CircularProgress } from '@mui/material';
import Page from '../../../components/Page';
import HeaderCard from '../../../components/HeaderCard';
import PropertyForm from '../../../sections/admin/aical/propertyForm';
import axiosInstance from '@/utils/axios';
import { enqueueSnackbar } from 'notistack';
import { useRouter } from 'next/router';

interface PropertyFormData {
  property_type: string;
  property_link?: string;
  postcode: string;
  pricingPCM: number;
  pricingPA: number;
  sizeSQFT: {
    minimum: number;
    maximum: number;
  };
  pricePerSqftPA: number;
  pricePerSqftPCM: number;
  comments?: string;
}

const AddPropertyPage: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: PropertyFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post('/api/aical/commercial-properties', data);
      
      enqueueSnackbar('Property created successfully!', { variant: 'success' });
      
      // Optionally redirect or reset form
      // router.push('/admin/aical/properties');
      
    } catch (err: any) {
      console.error('Error creating property:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to create property';
      setError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const breadcrumbs = ['Admin', 'AICal', 'Add Property'];

  return (
    <Page title="Add Property">
      <HeaderCard
        title="Add Commercial Property ( AI Training Data )"
        breadcrumbs={breadcrumbs}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      <PropertyForm onSubmit={handleSubmit} isLoading={isLoading} />
    </Page>
  );
};

export default AddPropertyPage;
