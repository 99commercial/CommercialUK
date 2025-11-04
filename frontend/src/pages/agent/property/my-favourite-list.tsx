import React from 'react';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import HeaderCard from '../../../components/HeaderCard';
import { MyFavoriteProperties } from '../../../sections/user/property';

// ----------------------------------------------------------------------

const MyFavoriteListPage: React.FC = () => {
  const router = useRouter();

  const handleViewProperty = (propertyId: string) => {
    router.push(`/property/${propertyId}`);
  };

  const handleRemoveFavorite = (propertyId: string) => {
    // The component handles the API call internally
    // This callback can be used for additional actions if needed
    console.log('Property removed from favorites:', propertyId);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <HeaderCard
          title="My Favorite Properties"
          breadcrumbs={['Home', 'User Dashboard', 'My Favorites']}
        />
        
        <MyFavoriteProperties
          onViewProperty={handleViewProperty}
          onRemoveFavorite={handleRemoveFavorite}
        />
    </Box>
  );
};

export default MyFavoriteListPage;
