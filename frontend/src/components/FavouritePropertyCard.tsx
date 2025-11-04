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
  borderRadius: theme.spacing(3),
  overflow: 'hidden',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  backgroundColor: '#ffffff',
  border: '1px solid rgba(226, 232, 240, 0.8)',
  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.02)',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 20px 60px rgba(220, 38, 38, 0.25), 0 0 0 1px rgba(220, 38, 38, 0.1)',
    borderColor: 'rgba(220, 38, 38, 0.3)',
  },
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '280px',
  overflow: 'hidden',
  backgroundColor: '#f5f5f5',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%)',
    zIndex: 1,
    opacity: 0,
    transition: 'opacity 0.3s ease',
    pointerEvents: 'none',
  },
  '&:hover::before': {
    opacity: 1,
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
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  color: '#1e293b',
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  zIndex: 4,
  opacity: 0,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  '&:hover': {
    backgroundColor: '#ffffff',
    color: '#dc2626',
    opacity: 1,
    transform: 'translateY(-50%) scale(1.1)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)',
  },
  '&.visible': {
    opacity: 0.9,
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
  top: theme.spacing(2),
  right: theme.spacing(2),
  zIndex: 5,
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  color: '#dc2626',
  width: '44px',
  height: '44px',
  borderRadius: '50%',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: '#dc2626',
    color: '#ffffff',
    transform: 'scale(1.15) rotate(5deg)',
    boxShadow: '0 6px 20px rgba(220, 38, 38, 0.4)',
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
          bottom: 12,
          right: 12,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(10px)',
          color: 'white',
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '0.8rem',
          fontFamily: '"Lato", sans-serif',
          fontWeight: 700,
          zIndex: 4,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          letterSpacing: '0.01em',
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
      <CardContent sx={{ p: 3.5, pb: 3 }}>
        <Typography 
          variant="h5" 
          component="h3" 
          sx={{ 
            fontWeight: 700, 
            mb: 1.5,
            fontSize: '1.5rem',
            lineHeight: 1.3,
            color: '#1e293b',
            fontFamily: '"Montserrat", sans-serif',
            letterSpacing: '-0.01em',
          }}
        >
          {property.general_details?.building_name || 'Property'}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ 
              fontWeight: 400,
              fontSize: '0.95rem',
              fontFamily: '"Lato", sans-serif',
              color: '#64748b',
              lineHeight: 1.5,
              letterSpacing: '0.01em',
            }}
          >
            {property.general_details?.address || 'Address not available'}
          </Typography>
        </Box>

        {property.descriptions_id?.general && (
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 3,
              lineHeight: 1.7,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              fontSize: '0.95rem',
              fontFamily: '"Lato", sans-serif',
              color: '#64748b',
              fontWeight: 400,
              letterSpacing: '0.01em',
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
            background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
            color: '#ffffff',
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: 600,
            fontSize: '1rem',
            py: 1.75,
            borderRadius: '12px',
            textTransform: 'none',
            letterSpacing: '0.02em',
            boxShadow: '0 4px 14px rgba(220, 38, 38, 0.4)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              background: 'linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)',
              boxShadow: '0 6px 20px rgba(220, 38, 38, 0.5)',
              transform: 'translateY(-2px)',
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