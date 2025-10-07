import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Stack,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import { Property } from '../../components/PropertyCard';

// ----------------------------------------------------------------------

const HeaderSection = styled(Box)(({ theme }) => ({
  backgroundColor: '#ffffff',
  padding: theme.spacing(4, 3),
  borderBottom: '1px solid #e0e0e0',
  marginBottom: theme.spacing(3),
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
}));

// ----------------------------------------------------------------------

interface PropertyHeaderProps {
  property: Property;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
  onShare: () => void;
}

const PropertyHeader: React.FC<PropertyHeaderProps> = ({
  property,
  isFavorite,
  onFavoriteToggle,
  onShare,
}) => {
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'success';
      case 'Under Offer':
        return 'warning';
      case 'Sold':
        return 'error';
      case 'Let':
        return 'info';
      case 'Withdrawn':
        return 'default';
      default:
        return 'default';
    }
  };

  // // Format price
  // const formatPrice = () => {
  //   if (property.sale_types_id && property.sale_types_id.sale_types.length > 0) {
  //     const saleType = property.sale_types_id.sale_types[0];
  //     const { price_currency, price_value, price_unit, sale_type } = saleType;
  //     const currencySymbol = price_currency === 'GBP' ? '£' : price_currency;
  //     return `${currencySymbol}${price_value.toLocaleString()}/${price_unit} (${sale_type})`;
  //   }
  //   if (property.business_rates_id) {
  //     const { rateable_value_gbp, rates_payable_gbp } = property.business_rates_id;
  //     if (rates_payable_gbp) {
  //       return `£${rates_payable_gbp.toLocaleString()}/year (Rates Payable)`;
  //     }
  //     if (rateable_value_gbp) {
  //       return `£${rateable_value_gbp.toLocaleString()}/year (Rateable Value)`;
  //     }
  //   }
  //   return 'Price on request';
  // };

  return (
    <HeaderSection sx={{ position: 'relative' }}>
      {/* Favorite and Share Buttons - Top Right Corner */}
      <Box sx={{ 
        position: 'absolute',
        top: 16,
        right: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        zIndex: 1
      }}>
        <IconButton
          onClick={onFavoriteToggle}
          sx={{
            backgroundColor: isFavorite ? '#ff4444' : '#f5f5f5',
            color: isFavorite ? '#ffffff' : '#666',
            width: 48,
            height: 48,
            '&:hover': {
              backgroundColor: isFavorite ? '#cc0000' : '#e0e0e0',
            },
          }}
        >
          <FavoriteBorderIcon />
        </IconButton>
        <IconButton
          onClick={onShare}
          sx={{
            backgroundColor: '#f5f5f5',
            color: '#666',
            width: 48,
            height: 48,
            '&:hover': {
              backgroundColor: '#e0e0e0',
            },
          }}
        >
          <ShareIcon />
        </IconButton>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        flexDirection: 'column',
        textAlign: 'center',
        maxWidth: '800px',
        width: '100%'
      }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1, color: '#333' }}>
          {property.general_details.building_name}
        </Typography>
        <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
          {property.general_details.property_sub_type}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 2, justifyContent: 'center' }}>
          <Chip
            label={property.general_details.property_type}
            color="primary"
            variant="outlined"
          />
          <Chip
            label={property.general_details.sale_status}
            color={getStatusColor(property.general_details.sale_status) as any}
            variant="filled"
          />
          {property.is_featured && (
            <Chip
              label="Featured"
              color="secondary"
              variant="filled"
            />
          )}
        </Stack>
      </Box>
    </HeaderSection>
  );
};

export default PropertyHeader;
