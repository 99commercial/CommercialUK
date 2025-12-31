import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
  Container,
  Paper,
  Card,
  CardContent,
  Divider,
  TextField,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { enqueueSnackbar } from 'notistack';
import ShareIcon from '@mui/icons-material/Share';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DescriptionIcon from '@mui/icons-material/Description';
import PinDropIcon from '@mui/icons-material/PinDrop';
import PublicIcon from '@mui/icons-material/Public';
import MapIcon from '@mui/icons-material/Map';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import FlagIcon from '@mui/icons-material/Flag';
import DomainIcon from '@mui/icons-material/Domain';
import axiosInstance from '../../utils/axios';

// ----------------------------------------------------------------------

const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: '#ffffff',
  display: 'flex',
  flexDirection: 'column',
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  width: '100%',
  overflowX: 'hidden',
  overflowY: 'visible',
  position: 'relative',
}));

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(3, 4),
  borderBottom: '1px solid #e5e7eb',
  backgroundColor: '#ffffff',
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  width: '100%',
  boxSizing: 'border-box',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
    minHeight: 'auto',
  },
}));

const LogoSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  flexShrink: 0,
  [theme.breakpoints.down('md')]: {
    display: 'block',
    visibility: 'visible',
    width: '100%',
  },
}));

const LogoIcon = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  backgroundColor: '#fbbf24',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#000000',
}));

const AddressSection = styled(Box)(({ theme }) => ({
  flex: 1,
  textAlign: 'center',
  [theme.breakpoints.down('md')]: {
    textAlign: 'left',
    width: '100%',
    display: 'block',
    visibility: 'visible',
  },
}));

const PropertyDetails = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginTop: theme.spacing(0.5),
  fontSize: '14px',
  color: '#6b7280',
  [theme.breakpoints.down('md')]: {
    flexWrap: 'wrap',
  },
}));

const ShareButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  color: '#000000',
  borderColor: '#e5e7eb',
  borderRadius: '50px',
  fontFamily: '"Montserrat", "Inter", sans-serif',
  fontWeight: 500,
  flexShrink: 0,
  '&:hover': {
    borderColor: '#d1d5db',
    backgroundColor: '#f9fafb',
  },
  [theme.breakpoints.down('md')]: {
    display: 'block',
    visibility: 'visible',
    width: '100%',
    marginTop: theme.spacing(1),
  },
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flex: 1,
  marginTop: '73px',
  paddingLeft: '280px', // Account for fixed sidebar on large screens
  width: '100%',
  minHeight: 'calc(100vh - 73px)',
  overflowX: 'hidden',
  overflowY: 'visible',
  position: 'relative',
  zIndex: 1,
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    paddingLeft: 0,
    marginTop: '150px', // Account for header (73px) + fixed sidebar (77px) = 150px
    minHeight: 'calc(100vh - 150px)',
  },
  [theme.breakpoints.down('sm')]: {
    marginTop: '160px', // Account for header (73px) + fixed sidebar (87px) = 160px
    minHeight: 'calc(100vh - 160px)',
  },
}));

const Sidebar = styled(Box)(({ theme }) => ({
  width: 280,
  minWidth: 280,
  backgroundColor: '#ffffff',
  borderRight: '1px solid #e5e7eb',
  padding: theme.spacing(4, 0),
  position: 'fixed',
  top: '73px',
  left: 0,
  alignSelf: 'flex-start',
  height: 'calc(100vh - 73px)',
  overflowY: 'auto',
  zIndex: 999,
  [theme.breakpoints.down('md')]: {
    position: 'fixed',
    top:'195px',
    left: 0,
    right: 0,
    width: '100%',
    height: 'auto',
    minHeight: '77px',
    maxHeight: '77px',
    borderRight: 'none',
    borderBottom: '1px solid #e5e7eb',
    padding: theme.spacing(2, 0),
    overflowX: 'auto',
    overflowY: 'hidden',
    zIndex: 998,
    backgroundColor: '#ffffff',
    '&::-webkit-scrollbar': {
      height: '6px',
      display: 'block',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#f9fafb',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#d4a911',
      borderRadius: '3px',
    },
  },
  [theme.breakpoints.down('sm')]: {
    top:'205px',
    minHeight: '87px',
    maxHeight: '87px',
  },
}));

const SidebarList = styled(List)(({ theme }) => ({
  padding: 0,
  [theme.breakpoints.down('md')]: {
    display: 'flex',
    flexDirection: 'row',
    overflowX: 'auto',
    overflowY: 'hidden',
    padding: theme.spacing(0, 2),
    width: '100%',
    minWidth: 'max-content',
  },
}));

const SidebarItem = styled(ListItem)(({ theme }) => ({
  padding: 0,
  '&.active': {
    '& .MuiListItemButton-root': {
      backgroundColor: '#f3f4f6',
      borderLeft: '3px solid #000000',
      paddingLeft: theme.spacing(2.5),
    },
  },
  [theme.breakpoints.down('md')]: {
    flexShrink: 0,
    width: 'auto',
    minWidth: 'fit-content',
    '&.active': {
      '& .MuiListItemButton-root': {
        borderLeft: 'none',
        borderBottom: '3px solid #000000',
        paddingLeft: theme.spacing(1.5),
      },
    },
  },
}));

const SidebarButton = styled(ListItemButton)(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
  '&:hover': {
    backgroundColor: '#f3f4f6',
  },
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1.5, 2),
    whiteSpace: 'nowrap',
    minHeight: '44px',
  },
}));

const SidebarText = styled(ListItemText)(({ theme }) => ({
  '& .MuiListItemText-primary': {
    fontSize: '14px',
    color: '#000000',
    fontWeight: 400,
    fontFamily: '"Inter", "Roboto", sans-serif',
  },
}));

const PreparedBySection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4, 3),
  marginTop: 'auto',
  borderTop: '1px solid #e5e7eb',
}));

const PreparedByLabel = styled(Typography)(({ theme }) => ({
  fontSize: '12px',
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: theme.spacing(1),
  fontFamily: '"Montserrat", "Inter", sans-serif',
  fontWeight: 500,
}));

const PreparedByName = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  fontWeight: 600,
  color: '#000000',
  marginBottom: theme.spacing(2),
  fontFamily: '"Montserrat", "Inter", sans-serif',
}));

const ContactLink = styled(Box)(({ theme }) => ({
  fontSize: '14px',
  color: '#000000',
  cursor: 'pointer',
  marginBottom: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  fontFamily: '"Inter", "Roboto", sans-serif',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const MainContent = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflowX: 'hidden',
  overflowY: 'auto',
  width: '100%',
  minHeight: '100%',
  paddingBottom: theme.spacing(4),
  [theme.breakpoints.down('md')]: {
    width: '100%',
    overflowX: 'hidden',
    overflowY: 'auto',
    paddingBottom: theme.spacing(3),
    marginTop: '77px', // Space for fixed sidebar
  },
  [theme.breakpoints.down('sm')]: {
    marginTop: '87px', // Space for fixed sidebar on smaller screens
  },
}));

const CoverImageContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '450px',
  position: 'relative',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  [theme.breakpoints.down('md')]: {
    height: '300px',
  },
}));

const CoverImageOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(3, 4),
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(1),
    padding: theme.spacing(2),
  },
}));

const AddressText = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  color: '#000000',
  fontWeight: 500,
  fontFamily: '"Inter", "Roboto", sans-serif',
}));

const ContactInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  fontSize: '14px',
  color: '#6b7280',
  textAlign: 'right',
  fontFamily: '"Inter", "Roboto", sans-serif',
  [theme.breakpoints.down('md')]: {
    textAlign: 'left',
  },
}));

const ContentSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: '1200px',
  margin: '0 auto',
  width: '100%',
  boxSizing: 'border-box',
  display: 'block',
  visibility: 'visible',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
    width: '100%',
    maxWidth: '100%',
    marginTop: '100px',
    boxSizing: 'border-box',
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '28px',
  fontWeight: 700,
  color: '#000000',
  marginBottom: theme.spacing(3),
  fontFamily: '"Montserrat", "Inter", "Roboto", sans-serif',
}));

const InfoCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
}));

const InfoRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1.5, 2),
  borderBottom: '1px solid #e5e7eb',
  '&:last-child': {
    borderBottom: 'none',
  },
  '&:hover': {
    backgroundColor: '#f9fafb',
  },
}));

const InfoLabel = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  color: '#374151',
  fontWeight: 500,
  fontFamily: '"Inter", "Roboto", sans-serif',
  flex: '0 0 40%',
}));

const InfoValue = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  color: '#000000',
  fontWeight: 400,
  fontFamily: '"Inter", "Roboto", sans-serif',
  textAlign: 'right',
  flex: '1 1 60%',
}));

const TableHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(1.5, 2),
  backgroundColor: '#f9fafb',
  borderBottom: '2px solid #e5e7eb',
  fontWeight: 600,
}));

const HeaderLabel = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  color: '#6b7280',
  fontWeight: 600,
  fontFamily: '"Inter", "Roboto", sans-serif',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  flex: '0 0 40%',
}));

const HeaderValue = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  color: '#6b7280',
  fontWeight: 600,
  fontFamily: '"Inter", "Roboto", sans-serif',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  textAlign: 'right',
  flex: '1 1 60%',
}));

const TimelineContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(2, 0),
  position: 'relative',
}));

const TimelineLine = styled(Box)(({ theme }) => ({
  flex: 1,
  height: '4px',
  backgroundColor: '#e5e7eb',
  borderRadius: '2px',
  position: 'relative',
}));

const TimelineMarker = styled(Box)<{ active?: boolean; $position: number }>(({ theme, active, $position }) => ({
  position: 'absolute',
  left: `${$position}%`,
  top: '50%',
  transform: 'translate(-50%, -50%)',
  width: active ? '24px' : '16px',
  height: active ? '24px' : '16px',
  borderRadius: '50%',
  backgroundColor: active ? '#1976d2' : '#9ca3af',
  border: active ? '3px solid #ffffff' : '2px solid #ffffff',
  boxShadow: active ? '0 2px 8px rgba(25, 118, 210, 0.4)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translate(-50%, -50%) scale(1.2)',
  },
}));

const TimelineLabel = styled(Typography)(({ theme }) => ({
  fontSize: '12px',
  color: '#6b7280',
  fontFamily: '"Inter", "Roboto", sans-serif',
  marginTop: theme.spacing(0.5),
  textAlign: 'center',
}));

const SliderContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 0),
}));

// Navigation items
const navigationItems = [
  'Cover',
  'Property Details',
  'EPC',
  'Mortgage Calculator',
  'Amenities Report',
  'Price Prediction',
];

// ----------------------------------------------------------------------

interface ReportData {
  _id: string;
  location: {
    postcode: string;
    address: string;
    propertyType: string;
    valuationType: string;
    input: {
      minimum: number;
      maximum: number;
    };
  };
  propertyDetails?: any;
  epcData?: any;
  aiAnalysis?: any;
  predictedPrice?: any;
  reportOwner?: {
    name?: string;
    email?: string;
  };
}

const ReportDetailedPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('Cover');
  
  // Mortgage calculator state
  const [propertyValue, setPropertyValue] = useState<number>(0);
  const [depositPercent, setDepositPercent] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(5.5);
  const [loanTerm, setLoanTerm] = useState<number>(25);
  const lat = Number(report?.propertyDetails?.latitude);
  const lng = Number(report?.propertyDetails?.longitude);
  
  // Property yield state for sales valuation
  const [selectedYield, setSelectedYield] = useState<number>(5);

  // Unit selection state (sqft or sqm)
  const [unitSelection, setUnitSelection] = useState<'sqft' | 'sqm'>('sqft');

  const [streetImage, setStreetImage] = useState<string | null>(null);

  useEffect(() => {
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

    fetch(
      `https://graph.mapillary.com/images?access_token=MLY|25630934893194419|d984a5c035ef7acd23bc4ae06bf219b1&fields=thumb_1024_url&closeto=${lat},${lng}&radius=500&limit=1`
    )
      .then(res => res.json())
      .then(data => {
        const img = data?.data?.[0]?.thumb_1024_url;
        if (img) setStreetImage(img);
      })
      .catch(() => setStreetImage(null));
  }, [lat, lng]);


  // Fetch report data
  useEffect(() => {
    const fetchReport = async () => {
      if (!id || typeof id !== 'string') {
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await axiosInstance.get(`/api/aical/reports/${id}`);
        
        if (response.data.success && response.data.data) {
          const reportData = response.data.data;
          setReport(reportData);
          
          // Initialize mortgage calculator with predicted price if available
          if (reportData.predictedPrice?.pricingPA) {
            setPropertyValue(reportData.predictedPrice.pricingPA * 20);
          }
        } else {
          throw new Error('Failed to load report data');
        }
      } catch (err: any) {
        console.error('Error fetching report:', err);
        const errorMessage = err?.response?.data?.message || err?.message || 'Failed to load report';
        setError(errorMessage);
        enqueueSnackbar(errorMessage, { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReport();
    }
  }, [id]);

  if (loading) {
    return (
      <PageContainer>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
          }}
        >
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }
  const getPropertyDetailsText = () => {
    if (!report) return '';
    
    const details = [];
    if (report.location.propertyType) {
      details.push(report.location.propertyType);
    }
    if (report.location.input?.minimum && report.location.input?.maximum) {
      details.push(`${report.location.input.minimum}-${report.location.input.maximum} sqft`);
    }
    
    return details.join(' · ');
  };

  const handleShare = async () => {
    try {
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);
      enqueueSnackbar('Link copied to clipboard!', { variant: 'success' });
    } catch (err) {
      console.error('Failed to copy link:', err);
      enqueueSnackbar('Failed to copy link', { variant: 'error' });
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'Cover':
        return (
          <ContentSection>
            <Box
              sx={(theme) => ({
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing(5),
              })}
            >
              {/* Title Section */}
              <Box>
                <Typography
                  variant="h3"
                  sx={(theme) => ({
                    fontSize: { xs: '32px', md: '42px' },
                    fontWeight: 700,
                    color: '#000000',
                    marginBottom: theme.spacing(2),
                    fontFamily: '"Montserrat", "Inter", "Roboto", sans-serif',
                    lineHeight: 1.2,
                  })}
                >
                  Property Valuation Report
                </Typography>
                {report.location.postcode && (
                  <Box sx={(theme) => ({ display: 'flex', alignItems: 'center', gap: 1, marginTop: theme.spacing(1) })}>
                    <LocationOnIcon sx={{ color: '#f2c514', fontSize: '20px' }} />
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: '16px',
                        color: '#6b7280',
                        fontWeight: 500,
                        fontFamily: '"Inter", "Roboto", sans-serif',
                      }}
                    >
                      {report.location.postcode}
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Street View Image */}
          {/* <CoverImageContainer
            sx={{
              backgroundColor: '#e5e7eb',
              overflow: 'hidden',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            }}
          >
              <Box
                component="img"
                  src={`https://maps.googleapis.com/maps/api/streetview?location=${report.propertyDetails?.latitude || ''}%2C${report.propertyDetails?.longitude || ''}&size=800x450&key=AIzaSyBwVM50vU8h-LVENkagwscJbeyT7wC5i4g`}
                alt="Street View"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
          </CoverImageContainer> */}

<CoverImageContainer
  sx={{
    height: 450,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 2,
    backgroundColor: '#e5e7eb',
  }}
>
  {streetImage && (
    <Box
      component="img"
      src={streetImage}
      alt="Street view"
      sx={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        position: 'absolute',
        top: 0,
        left: 0,
      }}
    />
  )}
</CoverImageContainer>




              {/* Property Information Cards */}
              <Box
                sx={(theme) => ({
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                  gap: theme.spacing(3),
                })}
              >
                {/* Property Type */}
                <Paper
                  elevation={2}
                  sx={(theme) => ({
                    p: theme.spacing(3),
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: theme.spacing(1.5),
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                  })}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <HomeIcon sx={{ color: '#f2c514', fontSize: '28px' }} />
                    <Typography
                      sx={{
                        fontSize: '14px',
                        color: '#6b7280',
                        fontWeight: 500,
                        fontFamily: '"Inter", "Roboto", sans-serif',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Property Type
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: '20px',
                      color: '#000000',
                      fontWeight: 700,
                      fontFamily: '"Montserrat", "Inter", sans-serif',
                    }}
                  >
                    {report.location.propertyType || 'N/A'}
                  </Typography>
                </Paper>

                {/* Area Size */}
                {report.location.input?.minimum && report.location.input?.maximum && (
                  <Paper
                    elevation={2}
                    sx={(theme) => ({
                      p: theme.spacing(3),
                      borderRadius: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: theme.spacing(1.5),
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                    })}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <SquareFootIcon sx={{ color: '#f2c514', fontSize: '28px' }} />
                      <Typography
                        sx={{
                          fontSize: '14px',
                          color: '#6b7280',
                          fontWeight: 500,
                          fontFamily: '"Inter", "Roboto", sans-serif',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Area Size
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        fontSize: '20px',
                        color: '#000000',
                        fontWeight: 700,
                        fontFamily: '"Montserrat", "Inter", sans-serif',
                      }}
                    >
                      {report.location.input.minimum} - {report.location.input.maximum} sqft
                    </Typography>
                  </Paper>
                )}

                {/* Valuation Type */}
                <Paper
                  elevation={2}
                  sx={(theme) => ({
                    p: theme.spacing(3),
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: theme.spacing(1.5),
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                  })}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <DescriptionIcon sx={{ color: '#f2c514', fontSize: '28px' }} />
                    <Typography
                      sx={{
                        fontSize: '14px',
                        color: '#6b7280',
                        fontWeight: 500,
                        fontFamily: '"Inter", "Roboto", sans-serif',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Valuation Type
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: '20px',
                      color: '#000000',
                      fontWeight: 700,
                      fontFamily: '"Montserrat", "Inter", sans-serif',
                    }}
                  >
                    {report.location.valuationType || 'N/A'}
                  </Typography>
                </Paper>
              </Box>

              {/* Summary Section */}
              {report.aiAnalysis?.summary && (
                <Paper
                  elevation={1}
                  sx={(theme) => ({
                    p: theme.spacing(4),
                    borderRadius: '12px',
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                  })}
                >
                  <Box sx={(theme) => ({ display: 'flex', alignItems: 'center', gap: 1.5, marginBottom: theme.spacing(2) })}>
                    <DescriptionIcon sx={{ color: '#f2c514', fontSize: '24px' }} />
                    <Typography
                      sx={{
                        fontSize: '20px',
                        color: '#000000',
                        fontWeight: 700,
                        fontFamily: '"Montserrat", "Inter", sans-serif',
                      }}
                    >
                      Property Summary
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: '16px',
                      color: '#374151',
                      fontWeight: 400,
                      lineHeight: 1.8,
                      fontFamily: '"Inter", "Roboto", sans-serif',
                    }}
                  >
                    {report.aiAnalysis.summary 
                      ? (() => {
                          const text = report.aiAnalysis.summary.slice(2);
                          return text.charAt(0).toUpperCase() + text.slice(1);
                        })()
                      : ''}
                  </Typography>
                </Paper>
              )}
            </Box>

          </ContentSection>
        );

      case 'Property Details':
        return (
          <ContentSection>
            <SectionTitle>Property Details</SectionTitle>
            <InfoCard>
              <CardContent sx={{ p: 0 }}>
                <TableHeader>
                  <HeaderLabel>Key</HeaderLabel>
                  <HeaderValue>Value</HeaderValue>
                </TableHeader>
                {report.propertyDetails && (
                  <>
                    <InfoRow>
                      <InfoLabel>Address</InfoLabel>
                      <InfoValue>{report.location.address}</InfoValue>
                    </InfoRow>
                    <InfoRow>
                      <InfoLabel>Postcode</InfoLabel>
                      <InfoValue>{report.propertyDetails.postcode || report.location.postcode || '-'}</InfoValue>
                    </InfoRow>
                    {report.propertyDetails.latitude && report.propertyDetails.longitude && (
                      <>
                        <InfoRow>
                          <InfoLabel>Latitude</InfoLabel>
                          <InfoValue>{report.propertyDetails.latitude}</InfoValue>
                        </InfoRow>
                        <InfoRow>
                          <InfoLabel>Longitude</InfoLabel>
                          <InfoValue>{report.propertyDetails.longitude}</InfoValue>
                        </InfoRow>
                      </>
                    )}
                    {report.propertyDetails.thoroughfare && (
                      <InfoRow>
                        <InfoLabel>Street</InfoLabel>
                        <InfoValue>{report.propertyDetails.thoroughfare}</InfoValue>
                      </InfoRow>
                    )}
                    {report.propertyDetails.town_or_city && (
                      <InfoRow>
                        <InfoLabel>Town/City</InfoLabel>
                        <InfoValue>{report.propertyDetails.town_or_city}</InfoValue>
                      </InfoRow>
                    )}
                    {report.propertyDetails.county && (
                      <InfoRow>
                        <InfoLabel>County</InfoLabel>
                        <InfoValue>{report.propertyDetails.county}</InfoValue>
                      </InfoRow>
                    )}
                    {report.propertyDetails.country && (
                      <InfoRow>
                        <InfoLabel>Country</InfoLabel>
                        <InfoValue>{report.propertyDetails.country}</InfoValue>
                      </InfoRow>
                    )}
                    {report.propertyDetails.district && (
                      <InfoRow>
                        <InfoLabel>District</InfoLabel>
                        <InfoValue>{report.propertyDetails.district}</InfoValue>
                      </InfoRow>
                    )}
                    {report.propertyDetails.residential !== undefined && (
                      <InfoRow>
                        <InfoLabel>Residential</InfoLabel>
                        <InfoValue>{report.propertyDetails.residential ? 'Yes' : 'No'}</InfoValue>
                      </InfoRow>
                    )}
                  </>
                )}
              </CardContent>
            </InfoCard>
          </ContentSection>
        );

      case 'EPC':
        return (
          <ContentSection>
            <SectionTitle>Energy Performance Certificate (EPC)</SectionTitle>
            {report.epcData ? (
              <InfoCard>
                <CardContent sx={{ p: 0 }}>
                  <TableHeader>
                    <HeaderLabel>Key</HeaderLabel>
                    <HeaderValue>Value</HeaderValue>
                  </TableHeader>
                  {report.epcData.address && (
                    <InfoRow>
                      <InfoLabel>EPC Address</InfoLabel>
                      <InfoValue>{report.epcData.address}</InfoValue>
                    </InfoRow>
                  )}
                  {report.epcData['asset-rating'] && (
                    <InfoRow>
                      <InfoLabel>Asset Rating</InfoLabel>
                      <InfoValue>{report.epcData['asset-rating']}</InfoValue>
                    </InfoRow>
                  )}
                  {report.epcData['asset-rating-band'] && (
                    <InfoRow>
                      <InfoLabel>Energy Rating Band</InfoLabel>
                      <InfoValue>{report.epcData['asset-rating-band']}</InfoValue>
                    </InfoRow>
                  )}
                  {report.epcData['floor-area'] && (
                    <InfoRow>
                      <InfoLabel>Floor Area (sqm)</InfoLabel>
                      <InfoValue>{report.epcData['floor-area']}</InfoValue>
                    </InfoRow>
                  )}
                  {report.epcData['property-type'] && (
                    <InfoRow>
                      <InfoLabel>Property Type</InfoLabel>
                      <InfoValue>{report.epcData['property-type']}</InfoValue>
                    </InfoRow>
                  )}
                  {report.epcData['main-heating-fuel'] && (
                    <InfoRow>
                      <InfoLabel>Main Heating Fuel</InfoLabel>
                      <InfoValue>{report.epcData['main-heating-fuel']}</InfoValue>
                    </InfoRow>
                  )}
                  {report.epcData['building-environment'] && (
                    <InfoRow>
                      <InfoLabel>Building Environment</InfoLabel>
                      <InfoValue>{report.epcData['building-environment']}</InfoValue>
                    </InfoRow>
                  )}
                  {report.epcData['inspection-date'] && (
                    <InfoRow>
                      <InfoLabel>Inspection Date</InfoLabel>
                      <InfoValue>{new Date(report.epcData['inspection-date']).toLocaleDateString()}</InfoValue>
                    </InfoRow>
                  )}
                  {report.epcData['lodgement-date'] && (
                    <InfoRow>
                      <InfoLabel>Lodgement Date</InfoLabel>
                      <InfoValue>{new Date(report.epcData['lodgement-date']).toLocaleDateString()}</InfoValue>
                    </InfoRow>
                  )}
                  {report.epcData['primary-energy-value'] && (
                    <InfoRow>
                      <InfoLabel>Primary Energy Value (kWh/m²/year)</InfoLabel>
                      <InfoValue>{report.epcData['primary-energy-value']}</InfoValue>
                    </InfoRow>
                  )}
                  {report.epcData['building-emissions'] && (
                    <InfoRow>
                      <InfoLabel>Building Emissions (kgCO₂/m²/year)</InfoLabel>
                      <InfoValue>{report.epcData['building-emissions']}</InfoValue>
                    </InfoRow>
                  )}
                </CardContent>
              </InfoCard>
            ) : (
              <Alert severity="info">EPC data not available for this property.</Alert>
            )}
          </ContentSection>
        );

      case 'Mortgage Calculator':
        // Calculate mortgage
        const calculateMortgage = () => {
          if (!propertyValue || propertyValue <= 0) return null;
          
          const depositAmount = (propertyValue * depositPercent) / 100;
          const loanAmount = propertyValue - depositAmount;
          const monthlyInterestRate = interestRate / 100 / 12;
          const numberOfPayments = loanTerm * 12;
          
          if (monthlyInterestRate === 0) {
            return {
              monthlyPayment: loanAmount / numberOfPayments,
              totalAmount: loanAmount,
              totalInterest: 0,
              depositAmount,
              loanAmount,
            };
          }
          
          const monthlyPayment = 
            (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
            (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
          
          const totalAmount = monthlyPayment * numberOfPayments;
          const totalInterest = totalAmount - loanAmount;
          
          return {
            monthlyPayment,
            totalAmount,
            totalInterest,
            depositAmount,
            loanAmount,
          };
        };
        
        const mortgageResult = calculateMortgage();
        
        return (
          <ContentSection>
            <SectionTitle>Mortgage Calculator</SectionTitle>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <InfoCard>
                <CardContent>
                  <Typography variant="body1" sx={{ mb: 3, color: '#6b7280', fontFamily: '"Inter", "Roboto", sans-serif', fontSize: '16px' }}>
                    Calculate your mortgage payments based on the property price.
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {/* Property Value */}
                    <Box>
                      <Typography sx={{ mb: 2, fontSize: '16px', fontWeight: 500, color: '#374151', fontFamily: '"Inter", "Roboto", sans-serif' }}>
                        Property Value (£)
                      </Typography>
                      <TextField
                        fullWidth
                        type="number"
                        value={propertyValue || ''}
                        onChange={(e) => setPropertyValue(parseFloat(e.target.value) || 0)}
                        variant="outlined"
                        placeholder="Enter property value"
                        sx={{ 
                          '& .MuiInputBase-input': { 
                            fontFamily: '"Inter", "Roboto", sans-serif',
                            fontSize: '16px',
                          }, 
                          '& .MuiInputLabel-root': { 
                            fontFamily: '"Inter", "Roboto", sans-serif' 
                          } 
                        }}
                      />
                    </Box>

                    {/* Deposit Slider */}
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography sx={{ fontSize: '16px', fontWeight: 500, color: '#374151', fontFamily: '"Inter", "Roboto", sans-serif' }}>
                          Deposit (%)
                        </Typography>
                        <Typography sx={{ fontSize: '18px', fontWeight: 600, color: '#1976d2', fontFamily: '"Inter", "Roboto", sans-serif' }}>
                          {depositPercent}%
                        </Typography>
                      </Box>
                      <SliderContainer>
                        <Slider
                          value={depositPercent}
                          onChange={(_, newValue) => setDepositPercent(newValue as number)}
                          min={1}
                          max={100}
                          step={1}
                          sx={{
                            color: '#1976d2',
                            height: 6,
                            '& .MuiSlider-thumb': {
                              width: 20,
                              height: 20,
                              backgroundColor: '#1976d2',
                              border: '3px solid #ffffff',
                              boxShadow: '0 2px 8px rgba(25, 118, 210, 0.4)',
                            },
                            '& .MuiSlider-track': {
                              height: 6,
                              borderRadius: 3,
                            },
                            '& .MuiSlider-rail': {
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: '#e5e7eb',
                            },
                          }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                          <Typography sx={{ fontSize: '12px', color: '#9ca3af', fontFamily: '"Inter", "Roboto", sans-serif' }}>1%</Typography>
                          <Typography sx={{ fontSize: '12px', color: '#9ca3af', fontFamily: '"Inter", "Roboto", sans-serif' }}>100%</Typography>
                    </Box>
                      </SliderContainer>
                    </Box>

                    {/* Interest Rate */}
                    <Box>
                      <Typography sx={{ mb: 2, fontSize: '16px', fontWeight: 500, color: '#374151', fontFamily: '"Inter", "Roboto", sans-serif' }}>
                        Interest Rate (%)
                      </Typography>
                      <TextField
                        fullWidth
                        type="number"
                        value={interestRate || ''}
                        onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                        variant="outlined"
                        placeholder="Enter interest rate"
                        inputProps={{ min: 0, step: 0.1 }}
                        sx={{ 
                          '& .MuiInputBase-input': { 
                            fontFamily: '"Inter", "Roboto", sans-serif',
                            fontSize: '16px',
                          }, 
                          '& .MuiInputLabel-root': { 
                            fontFamily: '"Inter", "Roboto", sans-serif' 
                          } 
                        }}
                      />
                    </Box>

                    {/* Loan Term Timeline */}
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography sx={{ fontSize: '16px', fontWeight: 500, color: '#374151', fontFamily: '"Inter", "Roboto", sans-serif' }}>
                          Loan Term (years)
                        </Typography>
                        <Typography sx={{ fontSize: '18px', fontWeight: 600, color: '#1976d2', fontFamily: '"Inter", "Roboto", sans-serif' }}>
                          {loanTerm} {loanTerm === 1 ? 'year' : 'years'}
                        </Typography>
                      </Box>
                      <TimelineContainer>
                        <TimelineLine>
                          {Array.from({ length: 40 }, (_, i) => {
                            const year = i + 1;
                            const position = (i / 39) * 100;
                            const isActive = year === loanTerm;
                            const isMajor = year % 5 === 0 || year === 1;
                            return (
                              <TimelineMarker
                                key={year}
                                active={isActive}
                                $position={position}
                                onClick={() => setLoanTerm(year)}
                                sx={{
                                  width: isMajor ? (isActive ? '24px' : '20px') : (isActive ? '20px' : '12px'),
                                  height: isMajor ? (isActive ? '24px' : '20px') : (isActive ? '20px' : '12px'),
                                }}
                              />
                            );
                          })}
                        </TimelineLine>
                      </TimelineContainer>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography sx={{ fontSize: '12px', color: '#9ca3af', fontFamily: '"Inter", "Roboto", sans-serif' }}>1</Typography>
                        <Typography sx={{ fontSize: '12px', color: '#9ca3af', fontFamily: '"Inter", "Roboto", sans-serif' }}>40</Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </InfoCard>
              
              {mortgageResult && propertyValue > 0 && (
                <InfoCard>
                  <CardContent sx={{ p: 0 }}>
                    <TableHeader>
                      <HeaderLabel>Key</HeaderLabel>
                      <HeaderValue>Value</HeaderValue>
                    </TableHeader>
                      <InfoRow>
                        <InfoLabel>Property Value</InfoLabel>
                        <InfoValue>£{propertyValue.toLocaleString()}</InfoValue>
                      </InfoRow>
                      <InfoRow>
                        <InfoLabel>Deposit ({depositPercent}%)</InfoLabel>
                        <InfoValue>£{mortgageResult.depositAmount.toLocaleString()}</InfoValue>
                      </InfoRow>
                      <InfoRow>
                        <InfoLabel>Loan Amount</InfoLabel>
                        <InfoValue>£{mortgageResult.loanAmount.toLocaleString()}</InfoValue>
                      </InfoRow>
                    <InfoRow sx={{ backgroundColor: '#f0f7ff', borderTop: '2px solid #1976d2', borderBottom: '2px solid #1976d2' }}>
                      <InfoLabel sx={{ fontSize: '18px', fontWeight: 600, color: '#1976d2' }}>Monthly Payment</InfoLabel>
                      <InfoValue sx={{ fontSize: '24px', fontWeight: 700, color: '#1976d2' }}>
                          £{mortgageResult.monthlyPayment.toFixed(2)}
                        </InfoValue>
                      </InfoRow>
                      <InfoRow>
                        <InfoLabel>Total Amount Paid</InfoLabel>
                        <InfoValue>£{mortgageResult.totalAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</InfoValue>
                      </InfoRow>
                      <InfoRow>
                        <InfoLabel>Total Interest</InfoLabel>
                        <InfoValue>£{mortgageResult.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 2 })}</InfoValue>
                      </InfoRow>
                  </CardContent>
                </InfoCard>
              )}
              
              {(!mortgageResult || propertyValue <= 0) && (
                <Alert severity="info">
                  Please enter a valid property value to calculate mortgage payments.
                </Alert>
              )}
            </Box>
          </ContentSection>
        );

      case 'Amenities Report':
        return (
          <ContentSection>
            <SectionTitle>Amenities Report</SectionTitle>
            {report.aiAnalysis ? (
              <>
                {report.aiAnalysis.summary && (
                  <InfoCard sx={{ mb: 3 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, fontSize: '18px', fontFamily: '"Montserrat", "Inter", sans-serif' }}>
                      Summary
                    </Typography>
                      <Paper sx={{ p: 3, backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            lineHeight: 1.8, 
                            fontSize: '16px',
                            fontFamily: '"Inter", "Roboto", sans-serif',
                            color: '#374151',
                          }}
                        >
                          {(() => {
                            const text = report.aiAnalysis.summary.slice(2);
                            return text.charAt(0).toUpperCase() + text.slice(1);
                          })()}
                      </Typography>
                    </Paper>
                    </CardContent>
                  </InfoCard>
                )}
                {report.aiAnalysis.points && report.aiAnalysis.points.length > 0 && (
                  <Box>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, fontSize: '18px', fontFamily: '"Montserrat", "Inter", sans-serif' }}>
                      Key Benefits
                    </Typography>
                    {report.aiAnalysis.points.map((point: any, index: number) => (
                      <InfoCard key={index} sx={{ mb: 2 }}>
                        <CardContent>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              mb: 1.5, 
                              fontWeight: 600, 
                              fontSize: '18px',
                              color: '#000000', 
                              fontFamily: '"Montserrat", "Inter", sans-serif' 
                            }}
                          >
                            {point.number}. {point.title}
                          </Typography>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              color: '#374151', 
                              lineHeight: 1.8, 
                              fontSize: '16px',
                              fontFamily: '"Inter", "Roboto", sans-serif' 
                            }}
                          >
                            {(() => {
                              const text = point.content.slice(2);
                              return text.charAt(0).toUpperCase() + text.slice(1);
                            })()}
                          </Typography>
                        </CardContent>
                      </InfoCard>
                    ))}
                  </Box>
                )}
              </>
            ) : (
              <Alert severity="info">Amenities analysis not available for this property.</Alert>
            )}
          </ContentSection>
        );

      case 'Price Prediction':
        return (
          <ContentSection>
            <SectionTitle>Price Prediction</SectionTitle>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel id="unit-select-label">Unit</InputLabel>
                <Select
                  labelId="unit-select-label"
                  id="unit-select"
                  value={unitSelection}
                  label="Unit"
                  onChange={(e) => setUnitSelection(e.target.value as 'sqft' | 'sqm')}
                  sx={{
                    fontFamily: '"Inter", "Roboto", sans-serif',
                  }}
                >
                  <MenuItem value="sqft">Square Feet</MenuItem>
                  <MenuItem value="sqm">Square Meter</MenuItem>
                </Select>
              </FormControl>
            </Box>
            {(() => {
              const valuationType = report.location.valuationType?.toLowerCase() || '';
              const showLetting = valuationType.includes('letting');
              const showSales = valuationType.includes('sales');
              const showBoth = showLetting && showSales;
              
              // Conversion factor: 1 sqft = 0.092903 sqm, so to convert from sqft to sqm, multiply by 0.092903
              // But the user wants to multiply by 10.764, which is actually 1/0.092903 (converting price per sqft to price per sqm)
              const conversionFactor = unitSelection === 'sqm' ? 10.764 : 1;
              const unitLabel = unitSelection === 'sqm' ? 'Sqm' : 'Sqft';
              
              return (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {/* Letting's Valuation Section */}
                  {showLetting && (
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 600, fontSize: '22px', color: '#000000', fontFamily: '"Montserrat", "Inter", sans-serif', mb: 3 }}>
                        {showBoth ? '1. Letting\'s Valuation' : 'Letting\'s Valuation'}
                      </Typography>
                      {report.predictedPrice ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                            <Box sx={{ flex: 1 }}>
                              <InfoCard>
                                <CardContent sx={{ p: 0 }}>
                                  <Box sx={{ p: 3, borderBottom: '1px solid #e5e7eb' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '18px', color: '#000000', fontFamily: '"Montserrat", "Inter", sans-serif' }}>
                                      Annual Pricing
                                    </Typography>
                                  </Box>
                                  <Box sx={{ p: 3 }}>
                                    <InfoRow sx={{ py: 2.5 }}>
                                      <InfoLabel>Total Price (PA)</InfoLabel>
                                      <InfoValue sx={{ color: '#10b981', fontSize: '18px', fontWeight: 700 }}>
                                        £{report.predictedPrice.pricingPA?.toLocaleString() || 'N/A'}
                                      </InfoValue>
                                    </InfoRow>
                                    <InfoRow sx={{ py: 2.5 }}>
                                      <InfoLabel>Price Per {unitLabel} (PA)</InfoLabel>
                                      <InfoValue sx={{ fontSize: '16px', fontWeight: 600 }}>
                                        £{report.predictedPrice.pricePerSqftPA ? (report.predictedPrice.pricePerSqftPA * conversionFactor).toFixed(2) : 'N/A'}
                                      </InfoValue>
                                    </InfoRow>
                                    {report.predictedPrice.effectiveAreaSqft && (
                                      <InfoRow sx={{ py: 2.5 }}>
                                        <InfoLabel>Effective Area ({unitSelection === 'sqm' ? 'Sqm' : 'Sqft'})</InfoLabel>
                                        <InfoValue sx={{ fontSize: '16px' }}>
                                          {unitSelection === 'sqm' 
                                            ? `${(report.predictedPrice.effectiveAreaSqft / 10.764).toFixed(2)} sqm`
                                            : `${report.predictedPrice.effectiveAreaSqft} sqft`
                                          }
                                        </InfoValue>
                                      </InfoRow>
                                    )}
                                  </Box>
                                </CardContent>
                              </InfoCard>
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <InfoCard>
                                <CardContent sx={{ p: 0 }}>
                                  <Box sx={{ p: 3, borderBottom: '1px solid #e5e7eb' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '18px', color: '#000000', fontFamily: '"Montserrat", "Inter", sans-serif' }}>
                                      Monthly Pricing
                                    </Typography>
                                  </Box>
                                  <Box sx={{ p: 3 }}>
                                    <InfoRow sx={{ py: 2.5 }}>
                                      <InfoLabel>Total Price (PCM)</InfoLabel>
                                      <InfoValue sx={{ color: '#10b981', fontSize: '18px', fontWeight: 700 }}>
                                        £{report.predictedPrice.pricingPCM?.toLocaleString() || 'N/A'}
                                      </InfoValue>
                                    </InfoRow>
                                    <InfoRow sx={{ py: 2.5 }}>
                                      <InfoLabel>Price Per {unitLabel} (PCM)</InfoLabel>
                                      <InfoValue sx={{ fontSize: '16px', fontWeight: 600 }}>
                                        £{report.predictedPrice.pricePerSqftPCM ? (report.predictedPrice.pricePerSqftPCM * conversionFactor).toFixed(2) : 'N/A'}
                                      </InfoValue>
                                    </InfoRow>
                                  </Box>
                                </CardContent>
                              </InfoCard>
                            </Box>
                          </Box>
                        </Box>
                      ) : (
                        <Alert severity="info">Letting's valuation not available for this property.</Alert>
                      )}
                    </Box>
                  )}

                  {/* Sales Valuation Section */}
                  {showSales && (
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 600, fontSize: '22px', color: '#000000', fontFamily: '"Montserrat", "Inter", sans-serif', mb: 3 }}>
                        {showBoth ? '2. Sales Valuation' : 'Sales Valuation'}
                      </Typography>
                      {report.predictedPrice ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {/* Three Price Cards */}
                          {(() => {
                            const annualPA = report.predictedPrice.pricingPA || 0;
                            const effectiveArea = report.predictedPrice.effectiveAreaSqft || 0;
                            
                            // Define the three yield options: Lowest (7%), Average (5%), Highest (3%)
                            const priceCards = [
                              { label: 'Lowest Price', yield: 7, multiplier: 14.28 },
                              { label: 'Average Price', yield: 5, multiplier: 20 },
                              { label: 'Highest Price', yield: 3, multiplier: 33.33 },
                            ];

                            return (
                              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                                {priceCards.map((card, index) => {
                                  const calculatedSalesPrice = annualPA * card.multiplier;
                                  const calculatedPricePerSqft = effectiveArea > 0 ? calculatedSalesPrice / effectiveArea : 0;
                                  const isAverage = card.yield === 5;

                                  return (
                                    <Box key={card.yield} sx={{ flex: 1 }}>
                                      <InfoCard
                                        sx={{
                                          border: isAverage ? '3px solid rgb(242, 197, 20)' : '1px solid #e5e7eb',
                                          boxShadow: isAverage ? '0 4px 12px rgba(242, 197, 20, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
                                          backgroundColor: isAverage ? '#fffef5' : '#ffffff',
                                          transform: isAverage ? 'scale(1.02)' : 'scale(1)',
                                          transition: 'all 0.3s ease',
                                        }}
                                      >
                                        <CardContent sx={{ p: 0 }}>
                                          <Box sx={{ p: 3, borderBottom: '1px solid #e5e7eb', backgroundColor: isAverage ? 'rgba(242, 197, 20, 0.1)' : 'transparent' }}>
                                            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '18px', color: '#000000', fontFamily: '"Montserrat", "Inter", sans-serif' }}>
                                              {card.label}
                                            </Typography>
                                            {/* <Typography sx={{ fontSize: '14px', color: '#6b7280', mt: 0.5, fontFamily: '"Inter", "Roboto", sans-serif' }}>
                                              {card.yield}% Yield
                                            </Typography> */}
                                          </Box>
                                          <Box sx={{ p: 3 }}>
                                            <InfoRow sx={{ py: 2.5 }}>
                                              <InfoLabel>Sale Price</InfoLabel>
                                              <InfoValue sx={{ color: '#10b981', fontSize: '18px', fontWeight: 700 }}>
                                                £{calculatedSalesPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                              </InfoValue>
                                            </InfoRow>
                                            {effectiveArea > 0 && (
                                              <InfoRow sx={{ py: 2.5 }}>
                                                <InfoLabel>Price Per {unitLabel}</InfoLabel>
                                                <InfoValue sx={{ fontSize: '16px', fontWeight: 600 }}>
                                                  £{(calculatedPricePerSqft * conversionFactor).toFixed(2)}
                                                </InfoValue>
                                              </InfoRow>
                                            )}
                                            {effectiveArea > 0 && (
                                              <InfoRow sx={{ py: 2.5 }}>
                                                <InfoLabel>Effective Area ({unitSelection === 'sqm' ? 'Sqm' : 'Sqft'})</InfoLabel>
                                                <InfoValue sx={{ fontSize: '16px' }}>
                                                  {unitSelection === 'sqm' 
                                                    ? `${(effectiveArea / 10.764).toFixed(2)} sqm`
                                                    : `${effectiveArea} sqft`
                                                  }
                                                </InfoValue>
                                              </InfoRow>
                                            )}
                                          </Box>
                                        </CardContent>
                                      </InfoCard>
                                    </Box>
                                  );
                                })}
                              </Box>
                            );
                          })()}
                        </Box>
                      ) : (
                        <Alert severity="info">Sales valuation not available for this property.</Alert>
                      )}
                    </Box>
                  )}

                  {/* Note Section */}
                  {(showLetting || showSales) && (
                    <Paper sx={{ p: 4, backgroundColor: '#fef2f2', border: '1px solid #ef4444', borderRadius: '8px' }}>
                      <Typography variant="body1" sx={{ fontSize: '16px', lineHeight: 1.8, fontFamily: '"Inter", "Roboto", sans-serif', color: '#374151' }}>
                        <strong style={{ color: '#dc2626' }}>Note:</strong> These price predictions are based on market analysis and comparable properties in the area. 
                        Actual prices may vary based on negotiation, market conditions, and property-specific factors.
                      </Typography>
                    </Paper>
                  )}

                  {/* Show message if no valuation type matches */}
                  {!showLetting && !showSales && (
                    <Alert severity="info">Price prediction not available for this property.</Alert>
                  )}
                </Box>
              );
            })()}
          </ContentSection>
        );

      default:
        return (
          <ContentSection>
            <SectionTitle>{activeSection}</SectionTitle>
            <Typography sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}>Content for {activeSection} section</Typography>
          </ContentSection>
        );
    }
  };

  if (error || !report) {
    return (
      <PageContainer>
        <Container sx={{ py: 4 }}>
          <Alert severity="error">{error || 'Report not found'}</Alert>
        </Container>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Header */}
      <Header>
        <LogoSection>
          <Box
            component="img"
            src="/images/CommercialUK2.png"
            onClick={() => router.push('/')}
            alt="Commercial UK Logo"
            sx={{
              height: { xs: '32px', md: '40px' },
              width: 'auto',
              objectFit: 'contain',
              cursor: 'pointer',
              display: 'block',
            }}
          />
        </LogoSection>
        <AddressSection>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600, 
              color: '#000000', 
              fontFamily: '"Montserrat", "Inter", sans-serif',
              fontSize: { xs: '14px', sm: '16px', md: '18px' },
              wordBreak: 'break-word',
              display: 'block',
            }}
          >
            {report.location.address}
          </Typography>
        </AddressSection>
        <ShareButton
          variant="outlined"
          startIcon={<ShareIcon />}
          onClick={handleShare}
        >
          Share
        </ShareButton>
      </Header>

      {/* Content Wrapper */}
      <ContentWrapper>
        {/* Sidebar */}
        <Sidebar>
          <SidebarList>
            {navigationItems.map((item) => (
              <SidebarItem
                key={item}
                className={activeSection === item ? 'active' : ''}
              >
                <SidebarButton onClick={() => setActiveSection(item)}>
                  <SidebarText primary={item} />
                </SidebarButton>
              </SidebarItem>
            ))}
          </SidebarList>
        </Sidebar>

        {/* Main Content */}
        <MainContent>
          {renderContent()}
        </MainContent>
      </ContentWrapper>
    </PageContainer>
  );
};

export default ReportDetailedPage;

