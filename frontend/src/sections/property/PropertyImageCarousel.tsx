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
  height: '650px',
  overflow: 'hidden',
  backgroundColor: '#f5f5f5',
  marginBottom: theme.spacing(3),
}));

const ImageGrid = styled(Box)<{ translateX: number }>(({ theme, translateX }) => ({
  display: 'flex',
  width: '100%',
  height: '100%',
  gap: '2px',
  transform: `translateX(${translateX}%)`,
  transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
}));

const CarouselImage = styled('img')(({ theme }) => ({
  flex: '0 0 calc(33.333% - 1.34px)',
  width: 'calc(33.333% - 1.34px)',
  height: '100%',
  objectFit: 'cover',
  cursor: 'zoom-in',
  transition: 'transform 0.3s ease, opacity 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
    opacity: 0.95,
  },
}));

const CarouselButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  color: '#000000',
  zIndex: 2,
  width: '48px',
  height: '48px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  '&:hover': {
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
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
  const [displayStartIndex, setDisplayStartIndex] = useState(0);
  const imagesPerView = 3;

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

  const handleNextGroup = () => {
    if (images.length === 0) return;
    setDisplayStartIndex((prev) => {
      const next = prev + imagesPerView;
      return next >= images.length ? 0 : next;
    });
  };

  const handlePrevGroup = () => {
    if (images.length === 0) return;
    setDisplayStartIndex((prev) => {
      const next = prev - imagesPerView;
      return next < 0 ? Math.max(0, images.length - imagesPerView) : next;
    });
  };

  // Calculate translateX percentage for smooth sliding
  // Each image takes 33.333% width, so we move by -33.333% * number of groups
  const translateX = -(displayStartIndex / imagesPerView) * 100;

  // Get all images to render (for smooth sliding animation)
  const allImages = images;

  return (
    <ImageCarouselContainer>
      <ImageGrid translateX={translateX}>
        {allImages.map((image, index) => (
          <CarouselImage
            key={image._id || index}
            src={image.url}
            alt={image.caption || `Image ${index + 1}`}
            onClick={() => openPreview(index)}
          />
        ))}
      </ImageGrid>
      
      {images.length > imagesPerView && (
        <>
          <CarouselButton
            onClick={handlePrevGroup}
            sx={{ left: 16 }}
          >
            <ArrowBackIosIcon />
          </CarouselButton>
          <CarouselButton
            onClick={handleNextGroup}
            sx={{ right: 16 }}
          >
            <ArrowForwardIosIcon />
          </CarouselButton>
        </>
      )}
      
      {images.length > 0 && (
        <ImageCounter>
          {Math.min(displayStartIndex + imagesPerView, images.length)} / {images.length}
        </ImageCounter>
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
