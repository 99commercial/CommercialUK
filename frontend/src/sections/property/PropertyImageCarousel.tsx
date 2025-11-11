import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Dialog,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  ArrowBackIos as ArrowBackIosIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
} from '@mui/icons-material';

// ----------------------------------------------------------------------

const ImageCarouselContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '500px',
  overflow: 'hidden',
  backgroundColor: '#f5f5f5',
  marginBottom: theme.spacing(3),
}));

const CarouselImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.3s ease',
}));

const CarouselButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: '#ffffff',
  zIndex: 2,
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
}));

const ImageCounter = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  color: '#ffffff',
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.spacing(1),
  fontSize: '0.875rem',
}));

const PreviewContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0,0,0,0.95)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const PreviewImage = styled('img')(({ theme }) => ({
  maxWidth: '100%',
  maxHeight: '100%',
  objectFit: 'contain',
}));

const PreviewCloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: '#ffffff',
  zIndex: 3,
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
}));

// ----------------------------------------------------------------------

interface PropertyImageCarouselProps {
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
  currentImageIndex: number;
  onNextImage: () => void;
  onPrevImage: () => void;
}

const PropertyImageCarousel: React.FC<PropertyImageCarouselProps> = ({
  images,
  currentImageIndex,
  onNextImage,
  onPrevImage,
}) => {
  const currentImage = images[currentImageIndex];

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(currentImageIndex || 0);

  const openPreview = (index: number) => {
    setPreviewIndex(index);
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
  };

  const handleNextPreview = () => {
    if (images.length === 0) return;
    setPreviewIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevPreview = () => {
    if (images.length === 0) return;
    setPreviewIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <ImageCarouselContainer>
      {currentImage && (
        <CarouselImage
          src={currentImage.url}
          alt={currentImage.caption}
          onClick={() => openPreview(currentImageIndex)}
          style={{ cursor: 'zoom-in' }}
        />
      )}
      
      {images.length > 1 && (
        <>
          <CarouselButton
            onClick={onPrevImage}
            sx={{ left: 16 }}
          >
            <ArrowBackIosIcon />
          </CarouselButton>
          <CarouselButton
            onClick={onNextImage}
            sx={{ right: 16 }}
          >
            <ArrowForwardIosIcon />
          </CarouselButton>
          <ImageCounter>
            {currentImageIndex + 1} / {images.length}
          </ImageCounter>
        </>
      )}
      <Dialog
        fullScreen
        open={isPreviewOpen}
        onClose={closePreview}
        PaperProps={{
          sx: { backgroundColor: 'transparent' },
        }}
      >
        <PreviewContainer>
          {images[previewIndex] && (
            <PreviewImage
              src={images[previewIndex].url}
              alt={images[previewIndex].caption}
            />
          )}

          {images.length > 1 && (
            <>
              <CarouselButton onClick={handlePrevPreview} sx={{ left: 16 }}>
                <ArrowBackIosIcon />
              </CarouselButton>
              <CarouselButton onClick={handleNextPreview} sx={{ right: 16 }}>
                <ArrowForwardIosIcon />
              </CarouselButton>
              <ImageCounter>
                {previewIndex + 1} / {images.length}
              </ImageCounter>
            </>
          )}

          <PreviewCloseButton onClick={closePreview}>
            ✕
          </PreviewCloseButton>
        </PreviewContainer>
      </Dialog>
    </ImageCarouselContainer>
  );
};

export default PropertyImageCarousel;
