import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
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

const ChatPrimaryButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f2c514, #facc15)',
  borderRadius: 999,
  padding: theme.spacing(1.2, 3.4),
  fontSize: '0.95rem',
  fontWeight: 600,
  fontFamily: '"Inter", sans-serif',
  textTransform: 'none',
  color: '#111827',
  letterSpacing: '0.2px',
  boxShadow: '0 10px 30px rgba(250, 204, 21, 0.45)',
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  '&:hover': {
    background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
    boxShadow: '0 14px 40px rgba(250, 204, 21, 0.6)',
    transform: 'translateY(-1px)',
  },
  '&:active': {
    transform: 'translateY(0px)',
    boxShadow: '0 6px 22px rgba(250, 204, 21, 0.5)',
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    justifyContent: 'center',
  },
}));

const typingBounce = keyframes`
  0%, 80%, 100% { transform: scale(0.8); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
`;

const TypingDot = styled('span')(() => ({
  width: 6,
  height: 6,
  borderRadius: '50%',
  backgroundColor: '#e5e7eb',
  display: 'inline-block',
  margin: '0 2px',
  animation: `${typingBounce} 1.2s infinite ease-in-out`,
  '&:nth-of-type(2)': {
    animationDelay: '0.18s',
  },
  '&:nth-of-type(3)': {
    animationDelay: '0.36s',
  },
}));

const MESSAGE_DELAY_MS = 500;

export default function HomeHero() {
  const [searchLocation, setSearchLocation] = useState('');
  const [forSaleChecked, setForSaleChecked] = useState(false);
  const [toLetChecked, setToLetChecked] = useState(false);
  const [showPostcodeStep, setShowPostcodeStep] = useState(false);
  const [showPostcodeTyping, setShowPostcodeTyping] = useState(false);
  const [showConfirmMessage, setShowConfirmMessage] = useState(false);
  const [showFirstBotMessage, setShowFirstBotMessage] = useState(false);
  const [showSaleLetOptions, setShowSaleLetOptions] = useState(false);
  const [showPostcodeBotMessage, setShowPostcodeBotMessage] = useState(false);
  const [showPostcodeInput, setShowPostcodeInput] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  // Initial message list: reveal each item with a delay
  useEffect(() => {
    const t1 = setTimeout(() => setShowFirstBotMessage(true), MESSAGE_DELAY_MS);
    const t2 = setTimeout(() => setShowSaleLetOptions(true), MESSAGE_DELAY_MS * 2);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const triggerPostcodeStep = () => {
    if (showPostcodeStep || showPostcodeTyping) return;
    setShowConfirmMessage(false);
    setShowPostcodeTyping(true);
    setTimeout(() => {
      setShowPostcodeTyping(false);
      setShowPostcodeStep(true);
    }, 900);
  };

  // Postcode step: reveal bot message then input with delay
  useEffect(() => {
    if (!showPostcodeStep) return;
    setShowPostcodeBotMessage(true);
    const t = setTimeout(() => setShowPostcodeInput(true), MESSAGE_DELAY_MS);
    return () => clearTimeout(t);
  }, [showPostcodeStep]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      const el = messagesContainerRef.current;
      el.scrollTop = el.scrollHeight;
    }
  }, [showFirstBotMessage, showSaleLetOptions, forSaleChecked, toLetChecked, showPostcodeTyping, showPostcodeStep, showPostcodeBotMessage, showPostcodeInput, showConfirmMessage]);

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
          <Box
            ref={messagesContainerRef}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: 2.5, sm: 3 },
              width: '100%',
              maxHeight: { xs: 320, sm: 360, md: 380 },
              overflowY: 'auto',
              pr: { xs: 0.5, sm: 1 },
            }}
          >
            {/* Chatbot Header */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f2c514, #f59e0b)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#111827',
                  fontWeight: 700,
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '1.1rem',
                }}
              >
                C
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.4 }}>
                <Typography
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    fontSize: { xs: '0.95rem', sm: '1rem' },
                    fontWeight: 600,
                    color: '#f9fafb',
                  }}
                >
                  CommercialUK Assistant
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: '#22c55e',
                    }}
                  />
                  <Typography
                    sx={{
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '0.8rem',
                      color: 'rgba(249, 250, 251, 0.8)',
                    }}
                  >
                    Online · Helping you find commercial properties
                  </Typography>
                </Box>
              </Box>
            </Box>

            {showFirstBotMessage && (
              <Box
                sx={{
                  maxWidth: { xs: '100%', sm: '80%', md: '70%' },
                  backgroundColor: 'rgba(17, 24, 39, 0.9)',
                  borderRadius: 3,
                  borderTopLeftRadius: 4,
                  padding: { xs: 1.5, sm: 1.8 },
                  border: '1px solid rgba(156, 163, 175, 0.3)',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    fontSize: { xs: '0.9rem', sm: '0.95rem' },
                    lineHeight: 1.6,
                    color: '#e5e7eb',
                  }}
                >
                  First, are you looking for a property <strong>For Sale</strong> or{' '}
                  <strong>To Let</strong>?
                </Typography>
              </Box>
            )}

            {showSaleLetOptions && (
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: { xs: 1.2, sm: 1.5 },
              }}
            >
              <CheckboxContainer
                onClick={() => {
                  const next = !forSaleChecked;
                  setForSaleChecked(next);
                  if (next) {
                    setToLetChecked(false);
                    triggerPostcodeStep();
                  }
                }}
                sx={{
                  backgroundColor: '#ffffff',
                  border: forSaleChecked
                    ? '2px solid #f2c514'
                    : '1px solid rgba(0, 0, 0, 0.12)',
                  borderRadius: 999,
                  padding: { xs: '10px 20px', sm: '12px 24px' },
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  width: 'auto',
                }}
              >
                <input
                  type="checkbox"
                  checked={forSaleChecked}
                  onChange={(e) => {
                    setForSaleChecked(e.target.checked);
                    if (e.target.checked) {
                      setToLetChecked(false);
                      triggerPostcodeStep();
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
                  const next = !toLetChecked;
                  setToLetChecked(next);
                  if (next) {
                    setForSaleChecked(false);
                    triggerPostcodeStep();
                  }
                }}
                sx={{
                  backgroundColor: '#ffffff',
                  border: toLetChecked
                    ? '2px solid #f2c514'
                    : '1px solid rgba(0, 0, 0, 0.12)',
                  borderRadius: 999,
                  padding: { xs: '10px 20px', sm: '12px 24px' },
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  width: 'auto',
                }}
              >
                <input
                  type="checkbox"
                  checked={toLetChecked}
                  onChange={(e) => {
                    setToLetChecked(e.target.checked);
                    if (e.target.checked) {
                      setForSaleChecked(false);
                      triggerPostcodeStep();
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
            )}

            {(forSaleChecked || toLetChecked) && (
              <>
                {showPostcodeTyping && (
                  <Box
                    sx={{
                      maxWidth: { xs: '100%', sm: '70%', md: '60%' },
                      backgroundColor: 'rgba(17, 24, 39, 0.9)',
                      borderRadius: 3,
                      borderTopLeftRadius: 4,
                      padding: { xs: 1.1, sm: 1.4 },
                      border: '1px solid rgba(156, 163, 175, 0.35)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    <TypingDot />
                    <TypingDot />
                    <TypingDot />
                  </Box>
                )}

                {showPostcodeStep && (
                  <>
                    {showPostcodeBotMessage && (
                    <Box
                      sx={{
                        maxWidth: { xs: '100%', sm: '80%', md: '70%' },
                        backgroundColor: 'rgba(17, 24, 39, 0.9)',
                        borderRadius: 3,
                        borderTopLeftRadius: 4,
                        padding: { xs: 1.5, sm: 1.8 },
                        border: '1px solid rgba(156, 163, 175, 0.3)',
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: '"Inter", sans-serif',
                          fontSize: { xs: '0.9rem', sm: '0.95rem' },
                          lineHeight: 1.6,
                          color: '#e5e7eb',
                        }}
                      >
                        Great, now type the <strong>postcode</strong> you&apos;re interested in
                        and press <strong>Enter</strong>.
                      </Typography>
                    </Box>
                    )}

                    {showPostcodeInput && (
                    <Box
                      sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          alignSelf: { xs: 'stretch', sm: 'flex-end' },
                          width: { xs: '100%', sm: '80%', md: '75%' },
                          background:
                            'linear-gradient(135deg, rgba(17, 24, 39, 0.96), rgba(15, 23, 42, 0.96))',
                          borderRadius: 3,
                          borderTopRightRadius: 4,
                          padding: { xs: 1.5, sm: 1.8, md: 2 },
                          border: '1px solid rgba(148, 163, 184, 0.35)',
                          boxShadow: '0 18px 45px rgba(15, 23, 42, 0.7)',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            gap: { xs: 1.5, sm: 2, md: 2.2 },
                            alignItems: { xs: 'stretch', md: 'center' },
                            justifyContent: 'center',
                            width: '100%',
                          }}
                        >
                          <StyledTextField
                            placeholder="Type a UK postcode..."
                            value={searchLocation}
                            onChange={(e) => setSearchLocation(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && searchLocation.trim()) {
                                setTimeout(() => setShowConfirmMessage(true), MESSAGE_DELAY_MS);
                                setTimeout(() => redirect(), MESSAGE_DELAY_MS + 3000);
                              }
                            }}
                            InputProps={{
                              startAdornment: (
                                <Box
                                  sx={{
                                    mr: 1.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: '#6b7280',
                                  }}
                                >
                                  <SearchIcon
                                    sx={{
                                      fontSize: {
                                        xs: '1.2rem',
                                        sm: '1.25rem',
                                        md: '1.3rem',
                                      },
                                    }}
                                  />
                                </Box>
                              ),
                            }}
                            sx={{
                              width: { xs: '100%', md: 'auto' },
                              flex: { xs: '0 0 auto', md: '1 1 auto' },
                              minWidth: { xs: '100%', sm: '260px', md: '300px' },
                              maxWidth: { xs: '100%', md: '380px' },
                              order: { xs: 1, md: 0 },
                            }}
                          />
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          width: 34,
                          height: 34,
                          borderRadius: '50%',
                          backgroundColor: 'rgba(15, 23, 42, 0.9)',
                          border: '1px solid rgba(148, 163, 184, 0.7)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#e5e7eb',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          fontFamily: '"Inter", sans-serif',
                        }}
                      >
                        U
                      </Box>
                    </Box>
                    )}
                  </>
                )}
              </>
            )}

            {showConfirmMessage && (
              <Box
                sx={{
                  mt: 2,
                  maxWidth: { xs: '100%', sm: '80%', md: '70%' },
                  backgroundColor: 'rgba(17, 24, 39, 0.9)',
                  borderRadius: 3,
                  borderTopLeftRadius: 4,
                  padding: { xs: 1.5, sm: 1.8 },
                  border: '1px solid rgba(156, 163, 175, 0.3)',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    fontSize: { xs: '0.9rem', sm: '0.95rem' },
                    lineHeight: 1.6,
                    color: '#e5e7eb',
                  }}
                >
                  Great, let me show you the properties for that postcode.
                </Typography>
              </Box>
            )}
          </Box>
        </SearchContainer>
      </Container>
    </HeroSection>
  );
}
