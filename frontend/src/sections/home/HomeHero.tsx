import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/router';

// ----------------------------------------------------------------------

const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '90vh',
  backgroundImage: 'url("https://img.freepik.com/free-photo/bottom-view-modern-buildings_1112-805.jpg?semt=ais_hybrid&w=740&q=80")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4, 2),
  marginTop: 0,
  zIndex: 1,
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    minHeight: '100vh',
    padding: theme.spacing(3, 1.5),
    backgroundAttachment: 'scroll',
  },
  [theme.breakpoints.up('sm')]: {
    minHeight: '90vh',
    padding: theme.spacing(5, 2),
  },
  [theme.breakpoints.up('md')]: {
    minHeight: '85vh',
    padding: theme.spacing(6, 3),
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.45) 100%)',
    zIndex: 1,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.3) 100%)',
    zIndex: 1,
  },
}));

const SearchContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  padding: theme.spacing(4, 5),
  borderRadius: theme.spacing(3),
  maxWidth: 1100,
  width: '100%',
  margin: '0 auto',
  // backgroundColor: '#ffffff',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2.5, 2),
    borderRadius: theme.spacing(2),
    maxWidth: '100%',
    margin: theme.spacing(0, 1.5),
  },
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(3, 2.5),
    borderRadius: theme.spacing(2),
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(1.5),
    backgroundColor: '#ffffff',
    height: 58,
    fontFamily: '"Inter", sans-serif',
    fontSize: '0.95rem',
    fontWeight: 400,
    transition: 'all 0.2s ease',
    border: '2px solid rgba(0, 0, 0, 0.08)',
    '& fieldset': {
      border: 'none',
    },
  '&:hover': {
      border: '2px solid rgba(242, 197, 20, 0.3)',
      boxShadow: '0 2px 8px rgba(242, 197, 20, 0.1)',
    },
    '&.Mui-focused': {
      border: '2px solid #f2c514',
      boxShadow: '0 4px 12px rgba(242, 197, 20, 0.2)',
    },
  },
  '& .MuiInputBase-input': {
    padding: '18px 22px',
    color: '#1a1a1a',
    fontSize: '0.95rem',
    fontFamily: '"Inter", sans-serif',
    '&::placeholder': {
      color: '#666',
      opacity: 0.8,
      fontWeight: 400,
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#f2c514',
  borderRadius: theme.spacing(1.5),
  height: 58,
  padding: theme.spacing(0, 5),
  fontSize: '1rem',
  fontWeight: 600,
  fontFamily: '"Inter", sans-serif',
  textTransform: 'none',
  color: '#000000',
  letterSpacing: '0.3px',
  boxShadow: '0 4px 14px rgba(242, 197, 20, 0.3)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  [theme.breakpoints.down('sm')]: {
    height: 56,
    padding: theme.spacing(0, 4),
    fontSize: '0.95rem',
    width: '100%',
  },
  [theme.breakpoints.between('sm', 'md')]: {
    height: 56,
    padding: theme.spacing(0, 4),
  },
    '&:hover': {
    backgroundColor: '#e6b813',
    boxShadow: '0 6px 20px rgba(242, 197, 20, 0.4)',
      transform: 'translateY(-2px)',
    },
    '&:active': {
    transform: 'translateY(0px)',
    boxShadow: '0 2px 10px rgba(242, 197, 20, 0.3)',
  },
}));

const CheckboxContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1.5, 2),
  borderRadius: theme.spacing(1.5),
  backgroundColor: '#ffffff',
  border: '2px solid rgba(0, 0, 0, 0.1)',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.25, 1.75),
    gap: theme.spacing(1.25),
  },
  '&:hover': {
    backgroundColor: '#ffffff',
    border: '2px solid rgba(242, 197, 20, 0.5)',
  },
  '& input[type="checkbox"]': {
    width: 20,
    height: 20,
    cursor: 'pointer',
    accentColor: '#f2c514',
    [theme.breakpoints.down('sm')]: {
      width: 18,
      height: 18,
    },
  },
}));

export default function HomeHero() {
  const [searchLocation, setSearchLocation] = useState('');
  const [forSaleChecked, setForSaleChecked] = useState(false);
  const [toLetChecked, setToLetChecked] = useState(false);
  const router = useRouter();

  function redirect() {
    router.push(`/general/all-properties?location=${searchLocation}&forSale=${forSaleChecked}&toLet=${toLetChecked}`);
  }

  return (
    <HeroSection>
      <Container
        maxWidth={false}
        sx={{ 
          position: 'relative',
          zIndex: 2,
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '100%',
          gap: { xs: 4, sm: 5, md: 6 },
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 3, sm: 4, md: 5 },
        }}
      >
        <Box sx={{ 
          textAlign: 'center', 
          width: '100%', 
          mb: { xs: 2, sm: 3, md: 4 },
          maxWidth: { xs: '100%', sm: '90%', md: '85%', lg: '1100px' },
        }}>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontFamily: '"Oswald", sans-serif',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: { xs: '2rem', sm: '3rem', md: '3.8rem', lg: '4.5rem' },
              lineHeight: { xs: 1.3, sm: 1.3, md: 1.3 },
              textAlign: 'center',
              position: 'relative',
              zIndex: 3,
              mb: { xs: 1.5, sm: 2 },
            }}
          >
            The One of UK's Leading
          </Typography>
          <Typography
            variant="h1"
            component="span"
            sx={{
              fontFamily: '"Oswald", sans-serif',
              color: '#f2c514',
              fontWeight: 900,
              fontSize: { xs: '2rem', sm: '3rem', md: '3.8rem', lg: '4.5rem' },
              lineHeight: { xs: 1.3, sm: 1.3, md: 1.3 },
              textAlign: 'center',
              position: 'relative',
              zIndex: 3,
              display: 'block',
            }}
          >
            Commercial Property Marketplace
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: '"Inter", sans-serif',
              color: 'rgba(255, 255, 255, 0.95)',
              fontWeight: 400,
              fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.2rem' },
              lineHeight: 1.6,
              textAlign: 'center',
              mt: { xs: 2, sm: 2.5, md: 3 },
              maxWidth: { xs: '100%', sm: '600px', md: '700px' },
              mx: 'auto',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.4)',
              zIndex: 3,
              position: 'relative',
            }}
          >
            Discover premium commercial properties across the UK. Find your perfect investment opportunity today.
          </Typography>
        </Box>

        <SearchContainer>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 2, sm: 2.5, md: 2.5 },
            alignItems: { xs: 'stretch', md: 'center' },
            justifyContent: 'center', 
            width: '100%',
          }}>
            {/* Location Input */}
            <StyledTextField
              placeholder="Location (town or postcode)"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              InputProps={{
                startAdornment: (
                  <Box sx={{ mr: 1.5, display: 'flex', alignItems: 'center', color: '#666' }}>
                    <SearchIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.25rem', md: '1.3rem' } }} />
                  </Box>
                ),
              }}
              sx={{
                width: { xs: '100%', md: 'auto' },
                flex: { xs: '0 0 auto', md: '1 1 auto' },
                minWidth: { xs: '100%', sm: '280px', md: '320px' },
                maxWidth: { xs: '100%', md: '400px' },
                order: { xs: 1, md: 0 },
              }}
            />

            {/* For Sale/To Let Checkboxes */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'row',
              gap: { xs: 1.5, sm: 2 },
              alignItems: 'center',
              justifyContent: { xs: 'flex-start', sm: 'center' },
              width: { xs: '100%', md: 'auto' },
              flex: { xs: '0 0 auto', md: '0 0 auto' },
              order: { xs: 2, md: 0 },
            }}>
              <CheckboxContainer
                onClick={() => {
                  setForSaleChecked(!forSaleChecked);
                  if (!forSaleChecked) {
                    setToLetChecked(false);
                  }
                }}
                sx={{
                  backgroundColor: forSaleChecked ? 'rgba(242, 197, 20, 0.15)' : '#ffffff',
                  border: forSaleChecked ? '2px solid #f2c514' : '2px solid rgba(0, 0, 0, 0.1)',
                  width: { xs: 'auto', md: 'auto' },
                }}
              >
                <input
                  type="checkbox"
                  checked={forSaleChecked}
                  onChange={(e) => {
                    setForSaleChecked(e.target.checked);
                    if (e.target.checked) {
                      setToLetChecked(false);
                    }
                  }}
                />
                <Typography 
                  sx={{ 
                    fontSize: { xs: '0.9rem', sm: '0.95rem' }, 
                    color: '#1a1a1a', 
                    fontWeight: 500,
                    fontFamily: '"Inter", sans-serif',
                    userSelect: 'none',
                  }}
                >
                  For Sale
                </Typography>
              </CheckboxContainer>
              <CheckboxContainer
                onClick={() => {
                  setToLetChecked(!toLetChecked);
                  if (!toLetChecked) {
                    setForSaleChecked(false);
                  }
                }}
                sx={{
                  backgroundColor: toLetChecked ? 'rgba(242, 197, 20, 0.15)' : '#ffffff',
                  border: toLetChecked ? '2px solid #f2c514' : '2px solid rgba(0, 0, 0, 0.1)',
                  width: { xs: 'auto', md: 'auto' },
                }}
              >
                <input
                  type="checkbox"
                  checked={toLetChecked}
                  onChange={(e) => {
                    setToLetChecked(e.target.checked);
                    if (e.target.checked) {
                      setForSaleChecked(false);
                    }
                  }}
                />
                <Typography 
                  sx={{ 
                    fontSize: { xs: '0.9rem', sm: '0.95rem' }, 
                    color: '#1a1a1a', 
                    fontWeight: 500,
                    fontFamily: '"Inter", sans-serif',
                    userSelect: 'none',
                  }}
                >
                  To Let
                </Typography>
              </CheckboxContainer>
            </Box>

            {/* Search Button */}
            <StyledButton
              variant="contained"
              onClick={redirect}
              startIcon={
                <SearchIcon 
                  sx={{ 
                    fontSize: { xs: '1.2rem', sm: '1.25rem', md: '1.3rem' } 
                  }} 
                />
              }
              sx={{
                width: { xs: '100%', md: 'auto' },
                flex: { xs: '0 0 auto', sm: '0 0 auto', md: '0 0 auto' },
                minWidth: { xs: '100%', sm: '140px', md: '160px' },
                order: { xs: 3, md: 0 },
              }}
            >
              Search
            </StyledButton>
          </Box>
        </SearchContainer>
      </Container>
    </HeroSection>
  );
}
