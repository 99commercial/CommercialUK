import React from 'react';
import { Box } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

// Animation for indeterminate progress - smooth fill animation
const progress = keyframes`
  0% {
    left: -40%;
    width: 40%;
  }
  50% {
    width: 60%;
  }
  100% {
    left: 100%;
    width: 40%;
  }
`;

// Container for fullscreen or inline
const LoaderContainer = styled(Box)<{ fullscreen?: boolean }>(({ fullscreen }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  ...(fullscreen && {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(4px)',
    zIndex: 9999,
  }),
  ...(!fullscreen && {
    padding: '40px 20px',
  }),
}));

// Progress bar wrapper
const ProgressBarContainer = styled(Box)<{ size?: 'small' | 'medium' | 'large' }>(({ size = 'medium' }) => {
  const heightMap = {
    small: '3px',
    medium: '4px',
    large: '6px',
  };

  const widthMap = {
    small: '200px',
    medium: '300px',
    large: '400px',
  };

  return {
    width: widthMap[size],
    height: heightMap[size],
    backgroundColor: '#e5e7eb', // Light gray for inactive segment
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '0px', // Flat, squared ends
  };
});

// Active progress bar (animated) - Dark yellow/gold color
const ProgressBarActive = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  height: '100%',
  backgroundColor: '#c9a010', // Dark yellow/gold color
  animation: `${progress} 2s ease-in-out infinite`,
  borderRadius: '0px', // Flat, squared ends
}));

interface LoaderProps {
  fullscreen?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const Loader: React.FC<LoaderProps> = ({ 
  fullscreen = false,
  size = 'medium'
}) => {
  return (
    <LoaderContainer fullscreen={fullscreen}>
      <ProgressBarContainer size={size}>
        <ProgressBarActive />
      </ProgressBarContainer>
    </LoaderContainer>
  );
};

export default Loader;

