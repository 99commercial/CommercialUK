import React, { useState, useEffect, useRef } from 'react';
import { NextPage } from 'next';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  InputAdornment,
  TextField,
  Button,
  List,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
  Drawer,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import NextLink from 'next/link';
import MainLayout from '../layouts/Main/MainLayout';
import Page from '../components/Page';
import axiosInstance from '../utils/axios';

// ----------------------------------------------------------------------
// Site color scheme
const COLORS = {
  primary: '#f2c514',
  primaryDark: '#e6b813',
  black: '#000000',
  darkGrey: '#1a1a1a',
  text: '#333333',
  textMuted: '#666666',
  bgContent: '#faf8f5',
  white: '#ffffff',
};

interface LegalContentItem {
  title: string;
  description: string;
}

interface GeneralPageData {
  LegalContent: LegalContentItem[];
}

// ----------------------------------------------------------------------

const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
  padding: theme.spacing(10, 0),
  textAlign: 'center',
  position: 'relative',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(6, 0),
  },
}));

const SearchWrapper = styled(Box)(({ theme }) => ({
  maxWidth: 560,
  margin: '0 auto',
  display: 'flex',
  alignItems: 'stretch',
  boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  backgroundColor: COLORS.white,
}));

const SearchInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: COLORS.white,
    borderRadius: 0,
    '& fieldset': { border: 'none' },
    '&:hover fieldset': { border: 'none' },
    '&.Mui-focused fieldset': { border: 'none' },
  },
}));

const SearchButton = styled(Button)(({ theme }) => ({
  backgroundColor: COLORS.black,
  color: COLORS.white,
  borderRadius: 0,
  minWidth: 56,
  padding: theme.spacing(1.5, 2),
  '&:hover': {
    backgroundColor: COLORS.darkGrey,
  },
}));

const BreadcrumbSection = styled(Box)(({ theme }) => ({
  backgroundColor: COLORS.bgContent,
  padding: theme.spacing(1.5, 0),
  borderBottom: `1px solid rgba(0,0,0,0.06)`,
}));

const BreadcrumbLink = styled(NextLink)(() => ({
  color: COLORS.textMuted,
  textDecoration: 'none',
  fontSize: '0.875rem',
  '&:hover': {
    color: COLORS.black,
    textDecoration: 'underline',
  },
}));

const MainWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: COLORS.bgContent,
  minHeight: '60vh',
  padding: theme.spacing(4, 0, 8),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3, 0, 6),
  },
}));

const Sidebar = styled(Box)(({ theme }) => ({
  position: 'sticky',
  top: theme.spacing(2),
  [theme.breakpoints.down('md')]: {
    position: 'static',
  },
}));

const NavItem = styled(ListItemButton)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  color: COLORS.text,
  fontSize: '0.9375rem',
  '&.Mui-selected': {
    backgroundColor: 'rgba(242, 197, 20, 0.2)',
    color: COLORS.black,
    fontWeight: 600,
    '&:hover': {
      backgroundColor: 'rgba(242, 197, 20, 0.3)',
    },
  },
  '&:hover': {
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
}));

const ContentCard = styled(Box)(({ theme }) => ({
  backgroundColor: COLORS.white,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(4, 4),
  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  border: `1px solid rgba(0,0,0,0.08)`,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3, 2),
  },
}));

const ContentTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: COLORS.black,
  fontSize: '1.75rem',
  marginBottom: theme.spacing(2),
  lineHeight: 1.3,
})) as typeof Typography;

const ContentBody = styled(Typography)(({ theme }) => ({
  color: COLORS.text,
  fontSize: '1rem',
  lineHeight: 1.7,
  whiteSpace: 'pre-line',
  '& ul': {
    paddingLeft: theme.spacing(3),
    margin: theme.spacing(1, 0),
  },
  '& li': {
    marginBottom: theme.spacing(1),
  },
})) as typeof Typography;

// ----------------------------------------------------------------------

const LawJurisdiction: NextPage = () => {
  const [data, setData] = useState<GeneralPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  const GENERAL_PAGE_ID = '696f52c16de78eddcec85424';

  useEffect(() => {
    const fetchGeneralPage = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get('/api/admin/static-pages/general-page', {
          params: { id: GENERAL_PAGE_ID },
        });
        if (response.data?.success && response.data?.data) {
          const payload = response.data.data;
          setData({
            LegalContent: Array.isArray(payload.LegalContent) ? payload.LegalContent : [],
          });
        } else {
          setData({ LegalContent: [] });
        }
      } catch (err: any) {
        const message = err?.response?.data?.message || err?.message || 'Failed to load content';
        setError(message);
        setData({ LegalContent: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchGeneralPage();
  }, []);

  const legalContent = data?.LegalContent ?? [];
  const selectedItem = legalContent[selectedIndex] ?? null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const idx = legalContent.findIndex(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (idx >= 0) setSelectedIndex(idx);
    setSidebarOpen(false);
  };

  const sidebarContent = (
    <Sidebar>
      <Typography
        variant="subtitle2"
        sx={{ color: COLORS.textMuted, fontWeight: 600, mb: 1.5, px: 1 }}
      >
        Sections
      </Typography>
      <List disablePadding>
        {legalContent.map((item, index) => (
          <NavItem
            key={index}
            selected={selectedIndex === index}
            onClick={() => {
              setSelectedIndex(index);
              setSidebarOpen(false);
            }}
          >
            <ListItemText primary={item.title} primaryTypographyProps={{ fontSize: '0.9375rem' }} />
            <ChevronRightRoundedIcon sx={{ fontSize: 18, color: 'inherit', opacity: 0.7 }} />
          </NavItem>
        ))}
      </List>
    </Sidebar>
  );

  if (loading) {
    return (
      <Page title="Law & Jurisdiction">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress sx={{ color: COLORS.primary }} />
        </Box>
      </Page>
    );
  }

  return (
    <Page title="Law & Jurisdiction">
      {/* Hero with search */}
      <HeroSection>
        <Container maxWidth="lg">
          <Typography component="h1" sx={{ fontWeight: 700, color: COLORS.black, fontSize: { xs: '1.75rem', sm: '2.25rem' }, mb: 2 }}>
            Hello. How can we help you?
          </Typography>
          <Box component="form" onSubmit={handleSearch}>
            <SearchWrapper>
              <SearchInput
                fullWidth
                placeholder="Search for answers"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="outlined"
                size="medium"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ ml: 1 }}>
                      <SearchRoundedIcon sx={{ color: COLORS.textMuted, fontSize: 22 }} />
                    </InputAdornment>
                  ),
                }}
              />
              <SearchButton type="submit" aria-label="Search">
                <SearchRoundedIcon />
              </SearchButton>
            </SearchWrapper>
          </Box>
        </Container>
      </HeroSection>

      {/* Two-column: sidebar + content */}
      <MainWrapper>
        <Container maxWidth="lg">
          {error && (
            <Alert severity="warning" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
            {/* Sidebar: desktop */}
            {isMdUp && <Box sx={{ width: 280, flexShrink: 0 }}>{sidebarContent}</Box>}

            {/* Mobile: menu button + drawer */}
            {!isMdUp && (
              <>
                <IconButton
                  onClick={() => setSidebarOpen(true)}
                  sx={{
                    position: 'fixed',
                    bottom: 72,
                    right: 16,
                    zIndex: 1299,
                    backgroundColor: COLORS.primary,
                    color: COLORS.black,
                    '&:hover': { backgroundColor: COLORS.primaryDark },
                  }}
                  aria-label="Open sections"
                >
                  <MenuRoundedIcon />
                </IconButton>
                <Drawer
                  anchor="left"
                  open={sidebarOpen}
                  onClose={() => setSidebarOpen(false)}
                  PaperProps={{
                    sx: { width: 280, pt: 2, px: 1 },
                  }}
                >
                  {sidebarContent}
                </Drawer>
              </>
            )}

            {/* Main content */}
            <Box ref={contentRef} sx={{ flex: 1, minWidth: 0 }}>
              <ContentCard>
                {legalContent.length === 0 && !error ? (
                  <Typography color="text.secondary" textAlign="center" sx={{ py: 6 }}>
                    No content available yet. Please check back later.
                  </Typography>
                ) : selectedItem ? (
                  <>
                    <ContentTitle component="h2">{selectedItem.title}</ContentTitle>
                    <ContentBody component="div">{selectedItem.description}</ContentBody>
                  </>
                ) : null}
              </ContentCard>
            </Box>
          </Box>
        </Container>
      </MainWrapper>

      {/* Floating "Ask me anything..." */}
      {/* <NextLink href="/contact-us" passHref legacyBehavior>
        <Box
          component="a"
          sx={{
            position: 'fixed',
            bottom: 3,
            right: 3,
            backgroundColor: COLORS.darkGrey,
            color: COLORS.white,
            borderRadius: 3,
            py: 1.5,
            px: 2.5,
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            fontSize: '0.9375rem',
            zIndex: 1300,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            textDecoration: 'none',
            '&:hover': { backgroundColor: COLORS.black, boxShadow: '0 6px 24px rgba(0,0,0,0.25)' },
          }}
        >
          <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 20 }} />
          Ask me anything...
          <SendRoundedIcon sx={{ fontSize: 18 }} />
        </Box>
      </NextLink> */}
    </Page>
  );
};

(LawJurisdiction as NextPage & { getLayout?: (page: React.ReactElement) => React.ReactElement }).getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default LawJurisdiction;
