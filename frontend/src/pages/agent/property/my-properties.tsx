import React from 'react';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import HeaderCard from '../../../components/HeaderCard';
import { PropertiesTable } from '../../../sections/agent/property'; 

const MyPropertiesPage: React.FC = () => {
  const router = useRouter();

  return (
    <Box>
      {/* Header */}
      <HeaderCard 
        title="My Properties" 
        breadcrumbs={['Dashboard', 'Properties', 'My Properties']} 
      />

      {/* Properties Table Component */}
      <PropertiesTable
      />
    </Box>
  );
};

export default MyPropertiesPage;
