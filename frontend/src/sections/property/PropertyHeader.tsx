import React, { useState } from 'react';
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
  WhatsApp as WhatsAppIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
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
  const [shareOpen, setShareOpen] = useState(false);
  const shareTitle =
    property?.general_details?.building_name
      ? `${property.general_details.building_name} on 99Commercial`
      : 'Check this property on 99Commercial';
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const firstImageUrl =
    property?.images_id?.images && property.images_id.images.length > 0
      ? [...property.images_id.images].sort((a, b) => (a.order || 0) - (b.order || 0))[0]?.url
      : '/placeholder-property.jpg';

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
              backgroundColor: isFavorite ? '#c9a010' : '#e0e0e0',
            },
          }}
        >
          <FavoriteBorderIcon />
        </IconButton>
        <Box
          sx={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
          }}
          onMouseEnter={() => setShareOpen(true)}
          onMouseLeave={() => setShareOpen(false)}
        >
          {/* Hover menu with social icons */}
          <Box
            className="share-menu"
            sx={{
              position: 'absolute',
              right: 56, // place to the left of the share button
              top: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              opacity: shareOpen ? 1 : 0,
              transform: shareOpen ? 'translateX(0)' : 'translateX(8px)',
              pointerEvents: shareOpen ? 'auto' : 'none',
              transition: 'opacity 200ms ease, transform 200ms ease',
            }}
          >
            {/* Clickable preview card */}
            <Box
              onClick={() => {
                // Default behavior: trigger provided onShare handler or copy title
                if (onShare) {
                  onShare();
                } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
                  navigator.clipboard.writeText(shareTitle);
                }
              }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                backgroundColor: '#ffffff',
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                padding: '6px 8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                cursor: 'pointer',
                width: 220,
                '&:hover': { boxShadow: '0 4px 14px rgba(0,0,0,0.1)' },
              }}
            >
              <Box
                component="img"
                src={firstImageUrl}
                alt={shareTitle}
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 1,
                  objectFit: 'cover',
                  backgroundColor: '#f5f5f5',
                  flexShrink: 0,
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: '#333',
                  lineHeight: 1.2,
                  display: '-webkit-box',
                  overflow: 'hidden',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {property?.general_details?.building_name || 'Property'}
              </Typography>
            </Box>

            {/* Social icons row */}
            <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              component="a"
              href={`https://wa.me/?text=${encodeURIComponent(`${firstImageUrl}\n\n${shareTitle}\n${shareUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                backgroundColor: '#25D3661A',
                color: '#25D366',
                width: 40,
                height: 40,
                '&:hover': { backgroundColor: '#25D36633' },
              }}
            >
              <WhatsAppIcon fontSize="small" />
            </IconButton>
            <IconButton
              onClick={() => {
                if (typeof navigator !== 'undefined' && navigator.clipboard) {
                  navigator.clipboard.writeText(shareTitle);
                }
                window.open('https://www.linkedin.com/feed/?shareActive=true', '_blank', 'noopener,noreferrer');
              }}
              sx={{
                backgroundColor: '#0A66C21A',
                color: '#0A66C2',
                width: 40,
                height: 40,
                '&:hover': { backgroundColor: '#0A66C233' },
              }}
            >
              <LinkedInIcon fontSize="small" />
            </IconButton>
            <IconButton
              onClick={() => {
                if (typeof navigator !== 'undefined' && navigator.clipboard) {
                  navigator.clipboard.writeText(shareTitle);
                }
                window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
              }}
              sx={{
                backgroundColor: '#E1306C1A',
                color: '#E1306C',
                width: 40,
                height: 40,
                '&:hover': { backgroundColor: '#E1306C33' },
              }}
            >
              <InstagramIcon fontSize="small" />
            </IconButton>
            <IconButton
              component="a"
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}`}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                backgroundColor: '#1DA1F21A',
                color: '#1DA1F2',
                width: 40,
                height: 40,
                '&:hover': { backgroundColor: '#1DA1F233' },
              }}
            >
              <TwitterIcon fontSize="small" />
            </IconButton>
            </Box>
          </Box>

          {/* Main share button */}
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
