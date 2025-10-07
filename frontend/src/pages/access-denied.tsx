import React from 'react';
import { Box, Typography, Button, Container, Fade, Slide } from '@mui/material';
import { useRouter } from 'next/router';
import { styled, keyframes } from '@mui/material/styles';
import { Lock, Home, ArrowBack, Security } from '@mui/icons-material';

// Animation keyframes
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const StyledContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  textAlign: 'center',
  width: '100%',
  maxWidth: 'none !important',
  padding: 0,
  margin: 0,
  background: 'linear-gradient(135deg, #1a0033 0%, #000033 50%, #330000 100%)',
  position: 'relative',
  overflow: 'hidden',
}));

const ErrorCode = styled(Typography)(({ theme }) => ({
  fontSize: '8rem',
  fontWeight: 700,
  color: '#ff0000',
  lineHeight: 1,
  marginBottom: theme.spacing(2),
  position: 'relative',
  zIndex: 1,
}));

const ErrorMessage = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 600,
  color: '#ffffff',
  marginBottom: theme.spacing(1),
  position: 'relative',
  zIndex: 1,
  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
}));

const ErrorDescription = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  color: '#b0b0b0',
  marginBottom: theme.spacing(4),
  maxWidth: '500px',
  position: 'relative',
  zIndex: 1,
  lineHeight: 1.6,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 4),
  fontSize: '1rem',
  fontWeight: 600,
  borderRadius: '25px',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  position: 'relative',
  zIndex: 1,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
  },
}));

const IconContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  position: 'relative',
  zIndex: 1,
}));

const LockIcon = styled(Lock)(({ theme }) => ({
  fontSize: '4rem',
  color: '#ff0000',
  animation: `${float} 3s ease-in-out infinite`,
}));

const SecurityIcon = styled(Security)(({ theme }) => ({
  fontSize: '2rem',
  color: '#ff3333',
  marginLeft: theme.spacing(2),
  animation: `${rotate} 4s linear infinite`,
}));

const FloatingElements = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 0,
  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    borderRadius: '50%',
    background: 'rgba(255, 0, 0, 0.05)',
    animation: `${float} 6s ease-in-out infinite`,
  },
  '&::before': {
    width: '100px',
    height: '100px',
    top: '20%',
    left: '10%',
    animationDelay: '0s',
  },
  '&::after': {
    width: '150px',
    height: '150px',
    top: '60%',
    right: '10%',
    animationDelay: '3s',
  },
}));

export default function AccessDenied() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <StyledContainer>
      <FloatingElements />
      
      <Fade in={true} timeout={1000}>
        <Box>
          <IconContainer>
            <LockIcon />
            <SecurityIcon />
          </IconContainer>
          
          <Slide direction="up" in={true} timeout={1200}>
            <Box>
              <ErrorCode>403</ErrorCode>
              <ErrorMessage>Access Denied</ErrorMessage>
              <ErrorDescription>
                You don't have permission to access this page. Please check your role and try again.
              </ErrorDescription>
            </Box>
          </Slide>
          
          <Slide direction="up" in={true} timeout={1400}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
              <StyledButton
                variant="contained"
                sx={{
                  backgroundColor: '#ff0000',
                  '&:hover': {
                    backgroundColor: '#cc0000',
                  },
                }}
                startIcon={<Home />}
                onClick={handleGoHome}
              >
                Go to Home
              </StyledButton>
              <StyledButton
                variant="outlined"
                sx={{
                  color: '#ff3333',
                  borderColor: '#ff3333',
                  '&:hover': {
                    borderColor: '#ff0000',
                    color: '#ff0000',
                    backgroundColor: 'rgba(255, 51, 51, 0.1)',
                  },
                }}
                startIcon={<ArrowBack />}
                onClick={handleGoBack}
              >
                Go Back
              </StyledButton>
            </Box>
          </Slide>
        </Box>
      </Fade>
    </StyledContainer>
  );
}
