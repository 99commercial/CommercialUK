import React, { useState, useEffect } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Stack,
  Link,
  Fade,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// ----------------------------------------------------------------------

const PropertyCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.spacing(1.5),
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  minHeight: '400px',
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  backgroundColor: '#ffffff',
  border: '1px solid #e0e0e0',
  padding: theme.spacing(2),
  [theme.breakpoints.down('lg')]: { // Changed to lg for tablets
    flexDirection: 'column',
    minHeight: 'auto', // Let content determine height
    padding: theme.spacing(1.5),
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
  },
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
    borderColor: '#000000',
  },
}));

const PropertyImageContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  position: 'relative',
  flexShrink: 0,
  overflow: 'hidden',
  borderRadius: theme.spacing(1),
  backgroundColor: '#f5f5f5', // Ensure visible background
  [theme.breakpoints.down('lg')]: {
    height: '250px', // Fixed height for tablet/mobile layout
    width: '100%',
    borderRadius: theme.spacing(1),
    backgroundColor: '#f0f0f0', // Different background for mobile
  },
  [theme.breakpoints.down('sm')]: {
    height: '200px', // Smaller height for mobile
    backgroundColor: '#eeeeee', // Even more visible on mobile
  },
}));

const PropertyImage = styled(CardMedia)(({ theme }) => ({
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: 0,
  left: 0,
  transition: 'opacity 1s ease-in-out',
  objectFit: 'cover',
  backgroundColor: '#f5f5f5', // Fallback background
  minHeight: '200px', // Ensure minimum height
  [theme.breakpoints.down('lg')]: {
    minHeight: '250px', // Tablet
  },
  [theme.breakpoints.down('sm')]: {
    minHeight: '200px', // Mobile
  },
}));

const ImageGalleryScroller = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
  borderRadius: theme.spacing(1),
  backgroundColor: '#f5f5f5',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '200px', // Ensure minimum height
  [theme.breakpoints.down('lg')]: {
    minHeight: '250px',
    backgroundColor: '#f0f0f0',
  },
  [theme.breakpoints.down('sm')]: {
    minHeight: '200px',
    backgroundColor: '#eeeeee',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30px',
    background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
    zIndex: 2,
    pointerEvents: 'none',
  },
}));

const NavigationButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  color: '#000000',
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  zIndex: 4,
  opacity: 0,
  transition: 'opacity 0.3s ease',
  '&:hover': {
    backgroundColor: '#ffffff',
    opacity: 1,
  },
  '&.visible': {
    opacity: 0.8,
  },
}));

const PreviousButton = styled(NavigationButton)({
  left: 8,
});

const NextButton = styled(NavigationButton)({
  right: 8,
});

const CategoryChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  left: theme.spacing(1),
  zIndex: 3,
  fontWeight: 600,
  fontSize: '0.75rem',
  backgroundColor: '#000000',
  color: '#ffffff',
  minWidth: '60px',
  height: '24px',
  borderRadius: '12px',
  '&:hover': {
    backgroundColor: '#333333',
  },
  [theme.breakpoints.down('lg')]: {
    top: theme.spacing(1),
    left: theme.spacing(1),
    minWidth: '70px',
    fontSize: '0.75rem',
    height: '24px',
  },
  [theme.breakpoints.down('sm')]: {
    top: theme.spacing(1),
    left: theme.spacing(1),
    minWidth: '60px',
    height: '22px',
    fontSize: '0.7rem',
  },
}));

const FavoriteButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  zIndex: 3,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  color: '#666666',
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  '&:hover': {
    backgroundColor: '#ffffff',
    color: '#ff4444',
  },
}));

const StatusChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(1),
  right: theme.spacing(1),
  zIndex: 3,
  fontWeight: 600,
  fontSize: '0.75rem',
  minWidth: '80px',
  height: '28px',
  borderRadius: '14px',
}));

// ----------------------------------------------------------------------

export interface Property {
  _id: string;
  general_details: {
    building_name: string;
    address: string;
    town_city: string;
    postcode: string;
    country_region: string;
    sale_status: 'Available' | 'Under Offer' | 'Sold' | 'Let' | 'Withdrawn';
    property_type: string;
    property_sub_type: string;
    size_minimum: number;
    size_maximum: number;
    approximate_year_of_construction: number;
    expansion_capacity_percent: number;
    invoice_details: string;
    max_eaves_height: number;
    property_notes: string;
  };
  business_rates_id?: {
    _id: string;
    property_id: string;
    rateable_value_gbp: number;
    rates_payable_gbp: number;
    createdAt: string;
    updatedAt: string;
    deleted_at?: string | null;
    __v: number;
  };
  descriptions_id?: {
    _id: string;
    property_id: string;
    accommodation: string;
    general: string;
    location: string;
    specifications: string;
    terms: string;
    createdAt: string;
    updatedAt: string;
    deleted_at?: string | null;
    __v: number;
  };
  sale_types_id?: {
    _id: string;
    property_id: string;
    sale_types: Array<{
      _id: string;
      sale_type: string;
      price_currency: string;
      price_value: number;
      price_unit: string;
    }>;
    createdAt: string;
    updatedAt: string;
    deleted_at?: string | null;
    __v: number;
  };
  images_id?: {
    _id: string;
    property_id: string;
    images: Array<{
      _id: string;
      caption: string;
      file_name: string;
      file_size: number;
      image_type: string;
      is_thumbnail: boolean;
      mime_type: string;
      order: number;
      upload_status: string;
      url: string;
    }>;
    createdAt: string;
    updatedAt: string;
    deleted_at?: string | null;
    __v: number;
  };
  location_id?: {
    _id: string;
    property_id: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    address_details: {
      formatted_address: string;
      street_number: string;
      route: string;
      locality: string;
      administrative_area_level_2: string;
      administrative_area_level_1: string;
      country: string;
      postal_code: string;
    };
    formatted_address: string;
    administrative_area_level_1: string;
    administrative_area_level_2: string;
    country: string;
    locality: string;
    postal_code: string;
    route: string;
    street_number: string;
    geocoding_info: {
      place_id: string;
      geocoding_service: string;
      geocoding_accuracy: string;
      geocoded_at: string;
    };
    location_verified: boolean;
    map_settings: {
      disable_map_display: boolean;
      map_zoom_level: number;
      map_type: string;
    };
    verification_notes: string;
    createdAt: string;
    updatedAt: string;
    deleted_at?: string | null;
    __v: number;
  };
  features_id?: {
    _id: string;
    property_id: string;
    features: {
      air_conditioning: string;
      clean_room: string;
      craneage: string;
      laboratory: string;
      loading_bay: string;
      secure_yard: string;
      yard: string;
      [key: string]: string; // Allow for additional features
    };
    additional_features: Array<{
      _id: string;
      feature_name: string;
      feature_value: string;
      description: string;
      feature_notes: string;
      createdAt: string;
      deleted_at?: string | null;
    }>;
    createdAt: string;
    updatedAt: string;
    deleted_at?: string | null;
    __v: number;
  };
  documents_id?: {
    _id: string;
    property_id: string;
    documents: Array<{
      _id: string;
      document_name: string;
      document_type: string;
      download_count: number;
      file_name: string;
      file_size: number;
      file_url: string;
      mime_type: string;
      upload_status: string;
      uploaded_at: string;
    }>;
    updatedAt: string;
    __v: number;
  };
  virtual_tours_id?: {
    _id: string;
    property_id: string;
    virtual_tours: Array<{
      _id: string;
      tour_name: string;
      tour_url: string;
      description: string;
      display_order: number;
      duration: number;
      is_active: boolean;
      is_featured: boolean;
      link_type: string;
      thumbnail_url: string;
      __v: number;
    }>;
    createdAt: string;
    updatedAt: string;
    deleted_at?: string | null;
    __v: number;
  };
  epc?: {
    rating: string;
    score: number;
    certificate_number: string;
    expiry_date: string;
  };
  council_tax?: {
    band: string;
    authority: string;
  };
  planning?: {
    status: string;
    application_number: string;
    decision_date: string;
  };
  rateable_value?: number;
  slug?: string;
  is_active: boolean;
  is_featured: boolean;
  is_verified: boolean;
  property_status: 'Active' | 'Inactive' | 'Sold' | 'Let' | 'Withdrawn';
  listed_by?: {
    _id: string;
    email: string;
    phone: string;
    profile_picture: string;
  };
  deleted_at?: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface PropertyCardProps {
  property: Property;
  onFavorite?: (propertyId: string) => void;
  onViewDetails?: (propertyId: string) => void;
  isFavorite?: boolean;
}

// Image Gallery Component with Infinite Scroller
const ImageGallery: React.FC<{ images: Array<any> }> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showArrows, setShowArrows] = useState(false);

  const goToPreviousImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNextImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      if (!isHovered) {
        setCurrentIndex((prevIndex) => 
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [images.length, isHovered]);

  // Since getAllImages always returns at least one image, simplify logic
  if (images.length === 1) {
    return (
      <ImageGalleryScroller>
        <PropertyImage
          image={images[0].url}
          title={images[0].caption || 'Property image'}
        />
      </ImageGalleryScroller>
    );
  }

  return (
    <ImageGalleryScroller
      onMouseEnter={() => {
        setIsHovered(true);
        setShowArrows(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowArrows(false);
      }}
    >
      {images.map((image, index) => (
        <Fade
          key={`${image._id || image.url}-${index}`}
          in={index === currentIndex}
          timeout={1000}
        >
          <PropertyImage
            image={image.url}
            title={image.caption || 'Property image'}
          />
        </Fade>
      ))}
      
      {/* Navigation Arrows - Only show if multiple images */}
      {images.length > 1 && (
        <>
          <PreviousButton
            className={showArrows ? 'visible' : ''}
            onClick={goToPreviousImage}
            size="small"
          >
            <ChevronLeftIcon fontSize="small" />
          </PreviousButton>
          
          <NextButton
            className={showArrows ? 'visible' : ''}
            onClick={goToNextImage}
            size="small"
          >
            <ChevronRightIcon fontSize="small" />
          </NextButton>
        </>
      )}
      
      {/* Image counter indicator */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 8,
          right: 8,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '8px',
          fontSize: '0.75rem',
          fontWeight: 600,
          zIndex: 3,
        }}
      >
        {currentIndex + 1} / {images.length}
      </Box>
    </ImageGalleryScroller>
  );
};

const PropertyCardComponent: React.FC<PropertyCardProps> = ({
  property,
  onFavorite,
  onViewDetails,
  isFavorite = false,
}) => {
  const getAllImages = () => {
    if (property.images_id?.images && property.images_id.images.length > 0) {
      // Sort images by order if available, otherwise use as-is
      return property.images_id.images.sort((a, b) => (a.order || 0) - (b.order || 0));
    }
    
    // Always return at least one placeholder image for visibility
    return [{
      _id: 'placeholder',
      url: '/placeholder-property.jpg',
      caption: 'No images available',
      order: 0
    }];
  };

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

  const formatPrice = () => {
    if (property.sale_types_id && property.sale_types_id.sale_types.length > 0) {
      const saleType = property.sale_types_id.sale_types[0];
      const { price_currency, price_value, price_unit, sale_type } = saleType;
      const currencySymbol = price_currency === 'GBP' ? '£' : price_currency;
      return `${currencySymbol}${price_value.toLocaleString()}/${price_unit} (${sale_type})`;
    }
    if (property.business_rates_id) {
      const { rateable_value_gbp, rates_payable_gbp } = property.business_rates_id;
      if (rates_payable_gbp) {
        return `£${rates_payable_gbp.toLocaleString()}/year (Rates Payable)`;
      }
      if (rateable_value_gbp) {
        return `£${rateable_value_gbp.toLocaleString()}/year (Rateable Value)`;
      }
    }
    return 'Price on request';
  };

  const formatSize = () => {
    const { size_minimum, size_maximum } = property.general_details;
    if (size_minimum === size_maximum) {
      return `${size_minimum} sq ft`;
    }
    return `${size_minimum} - ${size_maximum} sq ft`;
  };

  const capitalizeFirstLetter = (str: string) => {
    if (!str || str.length === 0) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <PropertyCard>
      {/* Image Section */}
      <Box sx={{ 
        position: 'relative', 
        width: { 
          xs: '100%',      // Mobile: Full width
          sm: '100%',      // Tablet: Full width
          md: '100%',      // Laptop: Full width
          lg: '40%'        // Desktop: 40% width
        }, 
        flexShrink: 0,
        height: { 
          xs: '200px',     // Mobile: 200px
          sm: '250px',     // Tablet: 250px
          md: '280px',     // Laptop: 280px
          lg: 'auto'       // Desktop: Auto height
        },
      }}>
        <ImageGallery images={getAllImages()} />
        <CategoryChip
          label={property.general_details.property_type}
          size="small"
        />
        <FavoriteButton 
          size="small"
          onClick={() => onFavorite?.(property._id)}
          sx={{
            color: isFavorite ? '#ff4444' : '#666666',
            '&:hover': {
              backgroundColor: '#ffffff',
              color: '#ff4444',
            },
          }}
        >
          {isFavorite ? (
            <FavoriteIcon fontSize="small" />
          ) : (
            <FavoriteBorderIcon fontSize="small" />
          )}
        </FavoriteButton>
        <StatusChip
          label={property.general_details.sale_status}
          size="small"
          color={getStatusColor(property.general_details.sale_status) as any}
        />
      </Box>
      
      {/* Content Section */}
      <CardContent sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        padding: { 
          xs: '12px',      // Mobile: 12px
          sm: '14px',      // Tablet: 14px
          md: '16px',      // Laptop: 16px
          lg: '16px 20px'  // Desktop: 16px 20px
        },
        justifyContent: 'space-between',
        overflow: 'hidden',
        width: { 
          xs: '100%',      // Mobile: Full width
          sm: '100%',      // Tablet: Full width
          md: '100%',      // Laptop: Full width
          lg: '60%'        // Desktop: 60% width
        },
        minHeight: 'auto',
        wordWrap: 'break-word',
        marginTop: { 
          xs: '8px',       // Mobile: 8px
          sm: '8px',       // Tablet: 8px
          md: '8px',       // Laptop: 8px
          lg: 0            // Desktop: 0
        },
        '&:last-child': {
          paddingBottom: { 
            xs: '12px',    // Mobile: 12px
            sm: '14px',    // Tablet: 14px
            md: '16px',    // Laptop: 16px
            lg: '16px'     // Desktop: 16px
          },
        },
      }}>
        <Box>
          <Typography 
            variant="h5" 
            component="h3" 
            sx={{ 
              fontWeight: 700, 
              mb: 1,
              fontSize: { 
                xs: '1.1rem',    // Mobile: 1.1rem
                sm: '1.2rem',    // Tablet: 1.2rem
                md: '1.4rem',    // Laptop: 1.4rem
                lg: '1.5rem'     // Desktop: 1.5rem
              },
              lineHeight: 1.2,
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: { 
                xs: 1,           // Mobile: 1 line
                sm: 1,           // Tablet: 1 line
                md: 2,           // Laptop: 2 lines
                lg: 2            // Desktop: 2 lines
              },
              WebkitBoxOrient: 'vertical',
              hyphens: 'auto',
            }}
          >
            {capitalizeFirstLetter(property.general_details.building_name)}
          </Typography>
          
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ 
              mb: 1, 
              fontWeight: 500, 
              fontSize: { md: '1.1rem', sm: '1rem' },
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: { xs: 'none', sm: 'block' }, // Hide on mobile
            }}
          >
            {capitalizeFirstLetter(property.general_details.property_sub_type)}
          </Typography>

          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <LocationOnIcon fontSize="medium" color="action" />
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ 
                fontWeight: 500, 
                fontSize: { md: '1rem', sm: '0.9rem', xs: '0.85rem' },
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1,
              }}
            >
              {capitalizeFirstLetter(property.general_details.town_city)}, {property.general_details.postcode.toUpperCase()}
            </Typography>
          </Stack>

          <Stack 
            direction="row" 
            alignItems="center" 
            spacing={1} 
            sx={{ 
              mb: 1,
              display: { xs: 'none', sm: 'flex' }, // Hide on mobile
            }}
          >
            <SquareFootIcon fontSize="medium" color="action" />
            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500, fontSize: '1rem' }}>
              {formatSize()}
            </Typography>
          </Stack>

          {property.descriptions_id?.general && (
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ 
                mb: 1,
                lineHeight: 1.5,
                display: { 
                  xs: 'none',        // Hide on mobile
                  sm: '-webkit-box', // Show on tablet and up
                  md: '-webkit-box',
                  lg: '-webkit-box'
                },
                WebkitLineClamp: { lg: 2, md: 2, sm: 3 },
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                fontSize: { lg: '1rem', md: '0.95rem', sm: '0.9rem' },
                hyphens: 'auto',
              }}
            >
              {capitalizeFirstLetter(property.descriptions_id.general)}
            </Typography>
          )}
        </Box>

        <Box sx={{ mt: 'auto' }}>
          <Link
            component="button"
            variant="button"
            onClick={() => onViewDetails?.(property._id)}
            sx={{
              fontWeight: 600,
              fontSize: { 
                xs: '0.9rem',    // Mobile: 0.9rem
                sm: '0.95rem',   // Tablet: 0.95rem
                md: '1rem',      // Laptop: 1rem
                lg: '1.1rem'     // Desktop: 1.1rem
              },
              textDecoration: 'none',
              color: '#f2c514',
              width: '100%',
              textAlign: 'left',
              padding: { 
                xs: '6px 0',    // Mobile: 6px 0
                sm: '8px 0',     // Tablet: 8px 0
                md: '8px 0',     // Laptop: 8px 0
                lg: '8px 0'      // Desktop: 8px 0
              },
              display: 'block',
              '&:hover': {
                textDecoration: 'underline',
                color: '#c9a010',
              },
            }}
          >
            VIEW DETAILS
          </Link>
        </Box>
      </CardContent>
    </PropertyCard>
  );
};

export default PropertyCardComponent;
