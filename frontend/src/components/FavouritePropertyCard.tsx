import React, { useState, useEffect } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  Stack,
  IconButton,
  Chip,
  Fade,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useRouter } from 'next/router';

// ----------------------------------------------------------------------

const FavouritePropertyCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
    borderColor: '#dc2626',
  },
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '250px',
  overflow: 'hidden',
  backgroundColor: '#f5f5f5',
}));

const PropertyImage = styled(CardMedia)(({ theme }) => ({
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: 0,
  left: 0,
  transition: 'opacity 1s ease-in-out',
  objectFit: 'cover',
}));

const ImageGalleryContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const NavigationButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
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

const FavoriteButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  zIndex: 3,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  color: '#dc2626',
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  '&:hover': {
    backgroundColor: '#ffffff',
    color: '#b91c1c',
  },
}));

// ----------------------------------------------------------------------

interface Property {
  _id: string;
  general_details: {
    building_name: string;
    address: string;
  };
  descriptions_id?: {
    general: string;
  };
  images_id?: {
    images: Array<{
      _id: string;
      caption: string;
      url: string;
      order: number;
    }>;
  };
}

interface FavouritePropertyCardProps {
  property: Property;
  onRemoveFavorite?: (propertyId: string) => void;
}

// Image Gallery Component
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
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length, isHovered]);

  if (images.length === 1) {
    return (
      <ImageGalleryContainer>
        <PropertyImage
          image={images[0].url}
          title={images[0].caption || 'Property image'}
        />
      </ImageGalleryContainer>
    );
  }

  return (
    <ImageGalleryContainer
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
    </ImageGalleryContainer>
  );
};

const FavouritePropertyCardComponent: React.FC<FavouritePropertyCardProps> = ({
  property,
  onRemoveFavorite,
}) => {
  const router = useRouter();

  const getAllImages = () => {
    if (property.images_id?.images && property.images_id.images.length > 0) {
      return property.images_id.images.sort((a, b) => (a.order || 0) - (b.order || 0));
    }
    
    return [{
      _id: 'placeholder',
      url: '/placeholder-property.jpg',
      caption: 'No images available',
      order: 0
    }];
  };

  const handleViewDetails = () => {
    router.push(`/property/${property._id}`);
  };

  const handleRemoveFavorite = () => {
    onRemoveFavorite?.(property._id);
  };

  return (
    <FavouritePropertyCard>
      {/* Image Section */}
      <ImageContainer>
        <ImageGallery images={getAllImages()} />
        
        <FavoriteButton 
          size="small"
          onClick={handleRemoveFavorite}
        >
          <FavoriteIcon fontSize="small" />
        </FavoriteButton>
      </ImageContainer>
      
      {/* Content Section */}
      <CardContent sx={{ p: 3 }}>
        <Typography 
          variant="h5" 
          component="h3" 
          sx={{ 
            fontWeight: 700, 
            mb: 1,
            fontSize: '1.4rem',
            lineHeight: 1.2,
            color: '#1e293b',
          }}
        >
          {property.general_details?.building_name || 'Property'}
        </Typography>
        
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ 
            mb: 2, 
            fontWeight: 500,
            fontSize: '1rem',
          }}
        >
          {property.general_details?.address || 'Address not available'}
        </Typography>

        {property.descriptions_id?.general && (
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 2,
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              fontSize: '0.9rem',
            }}
          >
            {property.descriptions_id.general}
          </Typography>
        )}

        <Button
          variant="contained"
          fullWidth
          onClick={handleViewDetails}
          sx={{
            backgroundColor: '#dc2626',
            fontWeight: 600,
            py: 1.5,
            '&:hover': {
              backgroundColor: '#b91c1c',
            },
          }}
        >
          View Details
        </Button>
      </CardContent>
    </FavouritePropertyCard>
  );
};

export default FavouritePropertyCardComponent;