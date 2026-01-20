import React, { useState, useEffect, useRef } from 'react';
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
  Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { enqueueSnackbar } from 'notistack';
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';
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
import ArticleIcon from '@mui/icons-material/Article';
import CalculateIcon from '@mui/icons-material/Calculate';
import PeopleIcon from '@mui/icons-material/People';
import PsychologyIcon from '@mui/icons-material/Psychology';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import InfoIcon from '@mui/icons-material/Info';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import BoltIcon from '@mui/icons-material/Bolt';
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
  '@media print': {
    minHeight: 'auto',
    '& *': {
      printColorAdjust: 'exact',
      WebkitPrintColorAdjust: 'exact',
    },
    '& table': {
      pageBreakInside: 'avoid',
      breakInside: 'avoid',
    },
    '& tr': {
      pageBreakInside: 'avoid',
      breakInside: 'avoid',
    },
    '& img': {
      pageBreakInside: 'avoid',
      breakInside: 'avoid',
      maxWidth: '100%',
    },
    // Prevent specific card types from splitting
    '& > * > * > .MuiPaper-root': {
      pageBreakInside: 'avoid',
      breakInside: 'avoid',
    },
    // Grid containers should allow breaks but items inside shouldn't split
    '& [style*="display: grid"] > *': {
      pageBreakInside: 'avoid',
      breakInside: 'avoid',
    },
    '& [style*="display: flex"][style*="flex-direction: column"] > *': {
      pageBreakInside: 'avoid',
      breakInside: 'avoid',
    },
  },
}));

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2.5, 4),
  borderBottom: '2px solid #e8ebed',
  backgroundColor: '#ffffff',
  fontFamily: '"Inter", sans-serif',
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  width: '100%',
  boxSizing: 'border-box',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
  '@media print': {
    display: 'none',
  },
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
  padding: theme.spacing(0, 3),
  [theme.breakpoints.down('md')]: {
    textAlign: 'left',
    width: '100%',
    display: 'block',
    visibility: 'visible',
    padding: 0,
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

const ActionButtonsGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  flexShrink: 0,
  [theme.breakpoints.down('md')]: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontSize: '14px',
  fontFamily: '"Inter", sans-serif',
  fontWeight: 600,
  padding: theme.spacing(1, 2.5),
  borderRadius: '8px',
  transition: 'all 0.2s ease',
  '&.share-button': {
    color: '#374151',
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    '&:hover': {
      borderColor: '#9ca3af',
    backgroundColor: '#f9fafb',
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    },
  },
  '&.download-button': {
    color: '#ffffff',
    backgroundColor: '#f2c514',
    border: '1px solid #f2c514',
    '&:hover': {
      backgroundColor: '#d4a911',
      borderColor: '#d4a911',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(242, 197, 20, 0.3)',
    },
  },
  [theme.breakpoints.down('md')]: {
    flex: 1,
  },
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flex: 1,
  marginTop: '73px',
  paddingLeft: '360px', // Account for fixed sidebar on large screens
  width: '100%',
  minHeight: 'calc(100vh - 73px)',
  overflowX: 'hidden',
  overflowY: 'visible',
  position: 'relative',
  zIndex: 1,
  '@media print': {
    marginTop: 0,
    paddingLeft: 0,
    width: '100%',
  },
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
  width: 360,
  minWidth: 280,
  backgroundColor: '#ffffff',
  borderRight: '1px solid #e5e7eb',
  padding: 0,
  position: 'fixed',
  top: '73px',
  left: 0,
  alignSelf: 'flex-start',
  height: 'calc(100vh - 73px)',
  overflowY: 'auto',
  zIndex: 999,
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '2px 0 10px rgba(0, 0, 0, 0.05)',
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f9fafb',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#d1d5db',
    borderRadius: '10px',
    '&:hover': {
      background: '#9ca3af',
    },
  },
  '@media print': {
    display: 'none',
  },
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
    flexDirection: 'row',
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

const SidebarHeader = styled(Box)(({ theme }) => ({
  height: '15%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4, 3),
  flexShrink: 0,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0) 100%)',
    pointerEvents: 'none',
  },
  [theme.breakpoints.down('md')]: {
    height: 'auto',
    minHeight: 'auto',
    width: '200px',
    padding: theme.spacing(2, 3),
  },
}));

const SidebarTitle = styled(Typography)(({ theme }) => ({
  fontSize: '24px',
  fontWeight: 900,
  color: '#000000',
  textAlign: 'center',
  fontFamily: '"Poppins", "Montserrat", sans-serif',
  letterSpacing: '1px',
  textTransform: 'uppercase',
  lineHeight: 1.3,
  position: 'relative',
  zIndex: 1,
  textShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  [theme.breakpoints.down('md')]: {
    fontSize: '16px',
    letterSpacing: '0.5px',
  },
}));

const SidebarList = styled(List)(({ theme }) => ({
  marginTop: '0px',
  padding: theme.spacing(3, 2),
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  overflowY: 'auto',
  [theme.breakpoints.down('md')]: {
    display: 'flex',
    flexDirection: 'row',
    overflowX: 'auto',
    overflowY: 'hidden',
    padding: theme.spacing(0, 2),
    width: '100%',
    minWidth: 'max-content',
    flex: 1,
    gap: theme.spacing(1),
    marginTop: '0px',
  },
}));

const SidebarItem = styled(ListItem)(({ theme }) => ({
  padding: 0,
  marginBottom: theme.spacing(0.5),
  '&.active': {
    '& .MuiListItemButton-root': {
      backgroundColor: 'rgba(242, 197, 20, 0.15)',
      borderLeft: '4px solid #f2c514',
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(242, 197, 20, 0.2)',
      '& .MuiListItemText-primary': {
        fontWeight: 700,
        color: '#000000',
      },
      '& .sidebar-icon': {
        color: '#f2c514',
        transform: 'scale(1.1)',
      },
    },
  },
  [theme.breakpoints.down('md')]: {
    flexShrink: 0,
    width: 'auto',
    minWidth: 'fit-content',
    marginBottom: 0,
    '&.active': {
      '& .MuiListItemButton-root': {
        borderLeft: 'none',
        borderBottom: '4px solid #f2c514',
        paddingLeft: theme.spacing(1.5),
      },
    },
  },
}));

const SidebarButton = styled(ListItemButton)(({ theme }) => ({
  padding: theme.spacing(1.2, 2),
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  borderLeft: '4px solid transparent',
  position: 'relative',
  minHeight: '48px',
  '&:hover': {
    backgroundColor: 'rgba(242, 197, 20, 0.08)',
    borderLeftColor: '#f2c514',
    transform: 'translateX(2px)',
    '& .MuiListItemText-primary': {
      color: '#000000',
      fontWeight: 600,
    },
    '& .sidebar-icon': {
      color: '#f2c514',
      transform: 'scale(1.05)',
    },
  },
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1.5, 2),
    whiteSpace: 'nowrap',
    minHeight: '44px',
    borderLeft: 'none',
    '&:hover': {
      transform: 'none',
    },
  },
}));

const SidebarText = styled(ListItemText)(({ theme }) => ({
  margin: 0,
  '& .MuiListItemText-primary': {
    fontSize: '14.5px',
    color: '#374151',
    fontWeight: 500,
    fontFamily: '"Inter", sans-serif',
    letterSpacing: '0.01em',
    transition: 'all 0.3s ease',
    lineHeight: 1.4,
  },
}));

const SidebarIcon = styled(Box)(({ theme }) => ({
  width: '24px',
  height: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#6b7280',
  transition: 'all 0.3s ease',
  flexShrink: 0,
  '& svg': {
    fontSize: '22px',
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
  overflowY: 'visible',
  width: '100%',
  minHeight: '100%',
  paddingBottom: theme.spacing(4),
  scrollBehavior: 'smooth',
  '@media print': {
    width: '100%',
    marginTop: 0,
    paddingBottom: 0,
    overflow: 'visible',
    minHeight: 'auto',
  },
  [theme.breakpoints.down('md')]: {
    width: '100%',
    overflowX: 'hidden',
    overflowY: 'visible',
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
  '@media print': {
    pageBreakInside: 'auto',
    breakInside: 'auto',
    height: '350px',
  },
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
  '@media print': {
    padding: theme.spacing(3),
  },
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
  '@media print': {
    pageBreakAfter: 'avoid',
    breakAfter: 'avoid',
    fontSize: '24px',
    marginBottom: theme.spacing(2),
  },
}));

const InfoCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  '@media print': {
    pageBreakInside: 'auto',
    breakInside: 'auto',
    boxShadow: 'none',
    border: '1px solid #e5e7eb',
    marginBottom: theme.spacing(1.5),
  },
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
  'Legal Section',
  'Mortgage Calculator',
  'Demographics Findings',
  'Psychographics Analysis',
  'Price Prediction',
  'Area Details',
  'About us',
  'Data Sources',
];

// Icon mapping for navigation items
const navigationIcons: Record<string, React.ReactNode> = {
  'Cover': <ArticleIcon sx={{ fontSize: 22 }} />,
  'Property Details': <HomeIcon sx={{ fontSize: 22 }} />,
  'EPC': <BoltIcon sx={{ fontSize: 22 }} />,
  'Legal Section': <DescriptionIcon sx={{ fontSize: 22 }} />,
  'Mortgage Calculator': <CalculateIcon sx={{ fontSize: 22 }} />,
  'Demographics Findings': <PeopleIcon sx={{ fontSize: 22 }} />,
  'Psychographics Analysis': <PsychologyIcon sx={{ fontSize: 22 }} />,
  'Price Prediction': <ShowChartIcon sx={{ fontSize: 22 }} />,
  'Area Details': <LocationCityIcon sx={{ fontSize: 22 }} />,
  'About us': <InfoIcon sx={{ fontSize: 22 }} />,
  'Data Sources': <DataUsageIcon sx={{ fontSize: 22 }} />,
};

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
  psychographicsAnalysis?: {
    points: Array<{
      number: number;
      title: string;
      content: string;
      raw: string;
      summary: string;
    }>;
    summary: string;
    raw: string;
  } | null;
  predictedPrice?: any;
  reportOwner?: {
    name?: string;
    email?: string;
  };
  crimeData?: CrimeData | null;
  article4Data?: Article4Data | null;
  brmaLhaData?: BRMALHAData | null;
  demographicsData?: DemographicsData | null;
}

interface CrimeData {
  postcode: string;
  data: {
    population: number;
    crime_rating: string;
    crimes_last_12m: {
      [key: string]: number;
      total: number;
      per_thousand: number;
    };
    above_national_average: string[];
    below_national_average: string[];
  };
  status: string;
}

interface Article4Area {
  local_authority: string;
  electoral_ward: string;
  information_url: string;
  notes: string;
}

interface Article4Data {
  postcode: string;
  data: {
    article4_areas: Article4Area[];
  };
  status: string;
  response_time: number;
}

interface LHARate {
  year: number;
  beds: number;
  lha_rate: number;
}

interface BRMALHAData {
  postcode: string;
  data: {
    brma_code: number;
    brma_name: string;
    rates: LHARate[];
  };
  status: string;
}

interface DemographicsData {
  postcode: string;
  data: {
    qualifications: { [key: string]: number };
    health: { [key: string]: number };
    relationships: { [key: string]: number };
    social_grade: { [key: string]: number };
    economic_activity: { [key: string]: number };
    industry: { [key: string]: number };
    housing_types: { [key: string]: number };
    housing_tenure: { [key: string]: number };
    housing_occupancy: { [key: string]: number };
  };
  status: string;
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

  // Unit selection state (sqft or sqm)
  const [unitSelection, setUnitSelection] = useState<'sqft' | 'sqm'>('sqft');

  // Land Registry data state
  const [landRegistryData, setLandRegistryData] = useState<any>(null);
  const [landRegistryLoading, setLandRegistryLoading] = useState(false);

  // Get area details data from report
  const crimeData = report?.crimeData || null;
  const article4Data = report?.article4Data || null;
  const brmaLhaData = report?.brmaLhaData || null;
  const demographicsData = report?.demographicsData || null;

  const [streetImage, setStreetImage] = useState<string | null>(null);
  const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const SCROLL_DAMPING = 0.35; // lower = heavier/slower scroll 

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

  // Fetch Land Registry data
  useEffect(() => {
    const fetchLandRegistryData = async () => {
      if (!report?.location?.postcode) return;

      try {
        setLandRegistryLoading(true);
        const postcode = encodeURIComponent(report.location.postcode);
        const response = await fetch(
          `https://landregistry.data.gov.uk/data/ppi/transaction-record.json?propertyAddress.postcode=${postcode}`
        );
        
        if (response.ok) {
          const data = await response.json();
          setLandRegistryData(data);
        }
      } catch (err) {
        console.error('Error fetching Land Registry data:', err);
      } finally {
        setLandRegistryLoading(false);
      }
    };

    if (report) {
      fetchLandRegistryData();
    }
  }, [report]);

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


  const scrollToSection = (section: string) => {
    setActiveSection(section);
    const target = sectionRefs.current.get(section);
    if (target) {
      const headerOffset = isMobile ? 190 : 110;
      const elementPosition = target.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - headerOffset,
        behavior: 'smooth',
      });
    }
  };

  const lastActiveRef = useRef(activeSection);
  useEffect(() => {
    lastActiveRef.current = activeSection;
  }, [activeSection]);

  // Scroll-based active section detection (more reliable for short sections)
  useEffect(() => {
    let rafId: number | null = null;

    const detectSection = () => {
      rafId = null;
      const headerOffset = isMobile ? 190 : 110;
      const viewportHeight = window.innerHeight;
      let activeCandidate: string | null = null;

      // Find the section that is currently most visible in the viewport
      // We check which section's top is at or above the header offset line
      // and whose bottom is still below the header offset line
      for (let i = navigationItems.length - 1; i >= 0; i--) {
        const name = navigationItems[i];
        const el = sectionRefs.current.get(name);
        if (!el) continue;
        
        const rect = el.getBoundingClientRect();
        
        // Check if this section's top has scrolled past (or reached) the header offset
        // This means this section is currently at or above the visible area threshold
        if (rect.top <= headerOffset + 50) {
          activeCandidate = name;
          break;
        }
      }

      // Fallback: if no section found (we're at the very top), use first section
      if (!activeCandidate) {
        activeCandidate = navigationItems[0];
      }

      if (activeCandidate && activeCandidate !== lastActiveRef.current) {
        lastActiveRef.current = activeCandidate;
        setActiveSection(activeCandidate);
      }
    };

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(detectSection);
    };

    // Run once on mount and when layout may change
    detectSection();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile, report]); // re-evaluate when layout/content changes

  // Make vertical scroll feel heavier by damping wheel delta
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey) return; // allow zoom gestures
      event.preventDefault();
      const adjustedDelta = event.deltaY * SCROLL_DAMPING;
      window.scrollBy({ top: adjustedDelta, behavior: 'auto' });
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

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

  const handleDownload = () => {
    try {
      enqueueSnackbar('Preparing report for download...', { variant: 'info' });
      
      // Add print-specific class to body
      document.body.classList.add('printing');
      
      // Trigger print dialog
      window.print();
      
      // Remove class after print dialog closes
      setTimeout(() => {
        document.body.classList.remove('printing');
      }, 1000);
    } catch (err) {
      console.error('Failed to download report:', err);
      enqueueSnackbar('Failed to download report', { variant: 'error' });
      document.body.classList.remove('printing');
    }
  };

  const renderSectionContent = (sectionName: string) => {
    // Debug log
    console.log('Rendering section:', sectionName);
    
    switch (sectionName) {
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
              {/* Title Section with Golden Accent */}
              <Box
                sx={{
                  position: 'relative',
                  paddingLeft: 3,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '6px',
                    backgroundColor: '#f2c514',
                    borderRadius: '3px',
                  },
                }}
              >
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
                  border: '3px solid #f2c514',
                  boxShadow: '0 4px 20px rgba(242, 197, 20, 0.2)',
                }}
              >
                {report.location?.address ? (
                  <Box
                    component="iframe"
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(report.location.address)}&zoom=20&maptype=satellite`}
                    sx={{
                      width: '100%',
                      height: '100%',
                      border: 0,
                      position: 'absolute',
                      top: 0,
                      left: 0,
                    }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : streetImage ? (
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
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#f3f4f6',
                    }}
                  >
                    <Typography sx={{ color: '#6b7280', fontFamily: '"Inter", sans-serif' }}>
                      Map not available
                    </Typography>
                  </Box>
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
                    border: '2px solid #f2c514',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 8px 24px rgba(242, 197, 20, 0.3)',
                      transform: 'translateY(-2px)',
                    },
                  })}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '8px',
                        backgroundColor: 'rgba(242, 197, 20, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <HomeIcon sx={{ color: '#f2c514', fontSize: '24px' }} />
                    </Box>
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
                      border: '2px solid #f2c514',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 8px 24px rgba(242, 197, 20, 0.3)',
                        transform: 'translateY(-2px)',
                      },
                    })}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '8px',
                          backgroundColor: 'rgba(242, 197, 20, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <SquareFootIcon sx={{ color: '#f2c514', fontSize: '24px' }} />
                      </Box>
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
                    border: '2px solid #f2c514',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 8px 24px rgba(242, 197, 20, 0.3)',
                      transform: 'translateY(-2px)',
                    },
                  })}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '8px',
                        backgroundColor: 'rgba(242, 197, 20, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <DescriptionIcon sx={{ color: '#f2c514', fontSize: '24px' }} />
                    </Box>
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
                    backgroundColor: '#fffbf0',
                    border: '2px solid #f2c514',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: 'linear-gradient(90deg, #f2c514 0%, #fbbf24 100%)',
                    },
                  })}
                >
                  <Box sx={(theme) => ({ display: 'flex', alignItems: 'center', gap: 1.5, marginBottom: theme.spacing(2) })}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '8px',
                        backgroundColor: 'rgba(242, 197, 20, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                    <DescriptionIcon sx={{ color: '#f2c514', fontSize: '24px' }} />
                    </Box>
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
            <SectionTitle
              sx={{
                position: 'relative',
                paddingLeft: 3,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '6px',
                  backgroundColor: '#f2c514',
                  borderRadius: '10px',
                },
              }}
            >
              Property Details
            </SectionTitle>
            
                {report.propertyDetails && (
              <Box>
                {/* Featured Address Card */}
                <Box
                  sx={{
                    background: 'linear-gradient(135deg, rgba(242, 197, 20, 0.1) 0%, rgba(251, 191, 36, 0.05) 100%)',
                    borderRadius: '16px',
                    p: 4,
                    mb: 4,
                    border: '2px solid #f2c514',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #f2c514 0%, #fbbf24 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 4px 12px rgba(242, 197, 20, 0.3)',
                      }}
                    >
                      <HomeIcon sx={{ color: '#000000', fontSize: '32px' }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        sx={{
                          fontSize: '13px',
                          fontWeight: 600,
                          color: '#9ca3af',
                          fontFamily: '"Inter", sans-serif',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          mb: 1,
                        }}
                      >
                        Property Address
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '22px',
                          fontWeight: 700,
                          color: '#111827',
                          fontFamily: '"Poppins", sans-serif',
                          lineHeight: 1.4,
                        }}
                      >
                        {report.location.address}
                      </Typography>
                      {(report.propertyDetails.postcode || report.location.postcode) && (
                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 1,
                            backgroundColor: '#ffffff',
                            borderRadius: '8px',
                            px: 2,
                            py: 1,
                            mt: 2,
                            border: '1px solid #f2c514',
                          }}
                        >
                          <LocationOnIcon sx={{ color: '#f2c514', fontSize: '18px' }} />
                          <Typography sx={{ fontSize: '15px', fontWeight: 600, color: '#111827', fontFamily: '"Inter", sans-serif' }}>
                            {report.propertyDetails.postcode || report.location.postcode}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>

                {/* Location Details Grid */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    sx={{
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#111827',
                      fontFamily: '"Poppins", sans-serif',
                      mb: 3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        backgroundColor: '#f2c514',
                        borderRadius: '50%',
                      }}
                    />
                    Location Information
                  </Typography>
                  
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
                    {report.propertyDetails.thoroughfare && (
                      <Box
                        sx={{
                          background: '#ffffff',
                          borderRadius: '12px',
                          p: 2.5,
                          border: '1px solid #e5e7eb',
                          borderLeft: '4px solid #f2c514',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(242, 197, 20, 0.2)',
                            transform: 'translateX(4px)',
                          },
                        }}
                      >
                        <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#9ca3af', fontFamily: '"Inter", sans-serif', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Street
                        </Typography>
                        <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#111827', fontFamily: '"Inter", sans-serif' }}>
                          {report.propertyDetails.thoroughfare}
                        </Typography>
                      </Box>
                    )}

                    {report.propertyDetails.town_or_city && (
                      <Box
                        sx={{
                          background: '#ffffff',
                          borderRadius: '12px',
                          p: 2.5,
                          border: '1px solid #e5e7eb',
                          borderLeft: '4px solid #f2c514',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(242, 197, 20, 0.2)',
                            transform: 'translateX(4px)',
                          },
                        }}
                      >
                        <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#9ca3af', fontFamily: '"Inter", sans-serif', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Town/City
                        </Typography>
                        <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#111827', fontFamily: '"Inter", sans-serif' }}>
                          {report.propertyDetails.town_or_city}
                        </Typography>
                      </Box>
                    )}

                    {report.propertyDetails.county && (
                      <Box
                        sx={{
                          background: '#ffffff',
                          borderRadius: '12px',
                          p: 2.5,
                          border: '1px solid #e5e7eb',
                          borderLeft: '4px solid #f2c514',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(242, 197, 20, 0.2)',
                            transform: 'translateX(4px)',
                          },
                        }}
                      >
                        <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#9ca3af', fontFamily: '"Inter", sans-serif', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          County
                        </Typography>
                        <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#111827', fontFamily: '"Inter", sans-serif' }}>
                          {report.propertyDetails.county}
                        </Typography>
                      </Box>
                    )}

                    {report.propertyDetails.district && (
                      <Box
                        sx={{
                          background: '#ffffff',
                          borderRadius: '12px',
                          p: 2.5,
                          border: '1px solid #e5e7eb',
                          borderLeft: '4px solid #f2c514',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(242, 197, 20, 0.2)',
                            transform: 'translateX(4px)',
                          },
                        }}
                      >
                        <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#9ca3af', fontFamily: '"Inter", sans-serif', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          District
                        </Typography>
                        <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#111827', fontFamily: '"Inter", sans-serif' }}>
                          {report.propertyDetails.district}
                        </Typography>
                      </Box>
                    )}

                    {report.propertyDetails.country && (
                      <Box
                        sx={{
                          background: '#ffffff',
                          borderRadius: '12px',
                          p: 2.5,
                          border: '1px solid #e5e7eb',
                          borderLeft: '4px solid #f2c514',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(242, 197, 20, 0.2)',
                            transform: 'translateX(4px)',
                          },
                        }}
                      >
                        <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#9ca3af', fontFamily: '"Inter", sans-serif', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Country
                        </Typography>
                        <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#111827', fontFamily: '"Inter", sans-serif' }}>
                          {report.propertyDetails.country}
                        </Typography>
                      </Box>
                    )}

                    {report.propertyDetails.residential !== undefined && (
                      <Box
                        sx={{
                          background: '#ffffff',
                          borderRadius: '12px',
                          p: 2.5,
                          border: '1px solid #e5e7eb',
                          borderLeft: '4px solid #f2c514',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(242, 197, 20, 0.2)',
                            transform: 'translateX(4px)',
                          },
                        }}
                      >
                        <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#9ca3af', fontFamily: '"Inter", sans-serif', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Property Type
                        </Typography>
                        <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#111827', fontFamily: '"Inter", sans-serif' }}>
                          {report.propertyDetails.residential ? 'Residential' : 'Commercial'}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>

                {/* Geographic Coordinates */}
                {report.propertyDetails.latitude && report.propertyDetails.longitude && (
                  <Box
                    sx={{
                      background: 'linear-gradient(135deg, #fffbf0 0%, #fef3c7 100%)',
                      borderRadius: '16px',
                      p: 4,
                      border: '2px solid #f2c514',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #f2c514 0%, #fbbf24 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 12px rgba(242, 197, 20, 0.3)',
                        }}
                      >
                        <LocationOnIcon sx={{ color: '#000000', fontSize: '28px' }} />
                      </Box>
                      <Typography
                        sx={{
                          fontSize: '20px',
                          fontWeight: 700,
                          color: '#92400e',
                          fontFamily: '"Poppins", sans-serif',
                        }}
                      >
                        Geographic Coordinates
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                      <Box
                        sx={{
                          background: 'rgba(255, 255, 255, 0.7)',
                          borderRadius: '12px',
                          p: 3,
                          border: '1px solid rgba(242, 197, 20, 0.3)',
                        }}
                      >
                        <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#92400e', fontFamily: '"Inter", sans-serif', mb: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Latitude
                        </Typography>
                        <Typography sx={{ fontSize: '20px', fontWeight: 700, color: '#78350f', fontFamily: '"Poppins", sans-serif' }}>
                          {report.propertyDetails.latitude}
                        </Typography>
                      </Box>
                      
                      <Box
                        sx={{
                          background: 'rgba(255, 255, 255, 0.7)',
                          borderRadius: '12px',
                          p: 3,
                          border: '1px solid rgba(242, 197, 20, 0.3)',
                        }}
                      >
                        <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#92400e', fontFamily: '"Inter", sans-serif', mb: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Longitude
                        </Typography>
                        <Typography sx={{ fontSize: '20px', fontWeight: 700, color: '#78350f', fontFamily: '"Poppins", sans-serif' }}>
                          {report.propertyDetails.longitude}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </ContentSection>
        );

      case 'EPC':
        return (
          <ContentSection>
            <SectionTitle
              sx={{
                position: 'relative',
                paddingLeft: 3,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '6px',
                  backgroundColor: '#f2c514',
                  borderRadius: '10px',
                },
              }}
            >
              Energy Performance Certificate (EPC)
            </SectionTitle>
            {report.epcData ? (
              <Box>
                {/* Energy Rating Hero Card */}
                {report.epcData['asset-rating-band'] && (
                  <Box
                    sx={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      borderRadius: '16px',
                      p: 4,
                      mb: 4,
                      position: 'relative',
                      overflow: 'hidden',
                      border: '3px solid #f2c514',
                      boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                      <Box>
                        <Typography
                          sx={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontFamily: '"Inter", sans-serif',
                            letterSpacing: '1.5px',
                            textTransform: 'uppercase',
                            mb: 1,
                          }}
                        >
                          Energy Rating
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '72px',
                            fontWeight: 900,
                            color: '#ffffff',
                            fontFamily: '"Poppins", sans-serif',
                            lineHeight: 1,
                            textShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                          }}
                        >
                          {report.epcData['asset-rating-band']}
                        </Typography>
                  {report.epcData['asset-rating'] && (
                          <Typography
                            sx={{
                              fontSize: '18px',
                              fontWeight: 600,
                              color: 'rgba(255, 255, 255, 0.95)',
                              fontFamily: '"Inter", sans-serif',
                              mt: 1,
                            }}
                          >
                            Score: {report.epcData['asset-rating']}
                          </Typography>
                        )}
                      </Box>
                      <Box
                        sx={{
                          width: 120,
                          height: 120,
                          backgroundColor: 'rgba(242, 197, 20, 0.25)',
                          borderRadius: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '2px solid rgba(242, 197, 20, 0.5)',
                          backdropFilter: 'blur(10px)',
                        }}
                      >
                        <BoltIcon sx={{ color: '#f2c514', fontSize: '64px' }} />
                      </Box>
                    </Box>
                  </Box>
                )}

                {/* Property Information Grid */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    sx={{
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#111827',
                      fontFamily: '"Poppins", sans-serif',
                      mb: 3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        backgroundColor: '#f2c514',
                        borderRadius: '50%',
                      }}
                    />
                    Property Information
                  </Typography>
                  
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
                    {report.epcData.address && (
                      <Box
                        sx={{
                          background: '#ffffff',
                          borderRadius: '12px',
                          p: 2.5,
                          border: '1px solid #e5e7eb',
                          borderLeft: '4px solid #f2c514',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(242, 197, 20, 0.2)',
                            transform: 'translateX(4px)',
                          },
                        }}
                      >
                        <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#9ca3af', fontFamily: '"Inter", sans-serif', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Address
                        </Typography>
                        <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#111827', fontFamily: '"Inter", sans-serif' }}>
                          {report.epcData.address}
                        </Typography>
                      </Box>
                    )}

                  {report.epcData['property-type'] && (
                      <Box
                        sx={{
                          background: '#ffffff',
                          borderRadius: '12px',
                          p: 2.5,
                          border: '1px solid #e5e7eb',
                          borderLeft: '4px solid #f2c514',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(242, 197, 20, 0.2)',
                            transform: 'translateX(4px)',
                          },
                        }}
                      >
                        <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#9ca3af', fontFamily: '"Inter", sans-serif', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Property Type
                        </Typography>
                        <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#111827', fontFamily: '"Inter", sans-serif' }}>
                          {report.epcData['property-type']}
                        </Typography>
                      </Box>
                    )}

                    {report.epcData['floor-area'] && (
                      <Box
                        sx={{
                          background: '#ffffff',
                          borderRadius: '12px',
                          p: 2.5,
                          border: '1px solid #e5e7eb',
                          borderLeft: '4px solid #f2c514',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(242, 197, 20, 0.2)',
                            transform: 'translateX(4px)',
                          },
                        }}
                      >
                        <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#9ca3af', fontFamily: '"Inter", sans-serif', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Floor Area
                        </Typography>
                        <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#111827', fontFamily: '"Inter", sans-serif' }}>
                          {report.epcData['floor-area']} m²
                        </Typography>
                      </Box>
                    )}

                  {report.epcData['building-environment'] && (
                      <Box
                        sx={{
                          background: '#ffffff',
                          borderRadius: '12px',
                          p: 2.5,
                          border: '1px solid #e5e7eb',
                          borderLeft: '4px solid #f2c514',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(242, 197, 20, 0.2)',
                            transform: 'translateX(4px)',
                          },
                        }}
                      >
                        <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#9ca3af', fontFamily: '"Inter", sans-serif', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Building Environment
                        </Typography>
                        <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#111827', fontFamily: '"Inter", sans-serif' }}>
                          {report.epcData['building-environment']}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>

                {/* Energy Performance Details */}
                <Box
                  sx={{
                    background: 'linear-gradient(135deg, #fffbf0 0%, #fef3c7 100%)',
                    borderRadius: '16px',
                    p: 4,
                    mb: 4,
                    border: '2px solid #f2c514',
                    '@media print': {
                      pageBreakInside: 'avoid',
                      breakInside: 'avoid',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #f2c514 0%, #fbbf24 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(242, 197, 20, 0.3)',
                      }}
                    >
                      <BoltIcon sx={{ color: '#000000', fontSize: '28px' }} />
                    </Box>
                    <Typography
                      sx={{
                        fontSize: '20px',
                        fontWeight: 700,
                        color: '#92400e',
                        fontFamily: '"Poppins", sans-serif',
                      }}
                    >
                      Energy & Environmental Performance
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                    {report.epcData['main-heating-fuel'] && (
                      <Box
                        sx={{
                          background: 'rgba(255, 255, 255, 0.7)',
                          borderRadius: '12px',
                          p: 3,
                          border: '1px solid rgba(242, 197, 20, 0.3)',
                        }}
                      >
                        <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#92400e', fontFamily: '"Inter", sans-serif', mb: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Main Heating Fuel
                        </Typography>
                        <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#78350f', fontFamily: '"Poppins", sans-serif' }}>
                          {report.epcData['main-heating-fuel']}
                        </Typography>
                      </Box>
                    )}

                  {report.epcData['primary-energy-value'] && (
                      <Box
                        sx={{
                          background: 'rgba(255, 255, 255, 0.7)',
                          borderRadius: '12px',
                          p: 3,
                          border: '1px solid rgba(242, 197, 20, 0.3)',
                        }}
                      >
                        <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#92400e', fontFamily: '"Inter", sans-serif', mb: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Primary Energy Value
                        </Typography>
                        <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#78350f', fontFamily: '"Poppins", sans-serif' }}>
                          {report.epcData['primary-energy-value']} kWh/m²/year
                        </Typography>
                      </Box>
                    )}

                  {report.epcData['building-emissions'] && (
                      <Box
                        sx={{
                          background: 'rgba(255, 255, 255, 0.7)',
                          borderRadius: '12px',
                          p: 3,
                          border: '1px solid rgba(242, 197, 20, 0.3)',
                        }}
                      >
                        <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#92400e', fontFamily: '"Inter", sans-serif', mb: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Building Emissions
                        </Typography>
                        <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#78350f', fontFamily: '"Poppins", sans-serif' }}>
                          {report.epcData['building-emissions']} kgCO₂/m²/year
                        </Typography>
                      </Box>
                    )}

                    {report.epcData['inspection-date'] && (
                      <Box
                        sx={{
                          background: 'rgba(255, 255, 255, 0.7)',
                          borderRadius: '12px',
                          p: 3,
                          border: '1px solid rgba(242, 197, 20, 0.3)',
                        }}
                      >
                        <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#92400e', fontFamily: '"Inter", sans-serif', mb: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Inspection Date
                        </Typography>
                        <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#78350f', fontFamily: '"Poppins", sans-serif' }}>
                          {new Date(report.epcData['inspection-date']).toLocaleDateString()}
                        </Typography>
                      </Box>
                    )}

                    {report.epcData['lodgement-date'] && (
                      <Box
                        sx={{
                          background: 'rgba(255, 255, 255, 0.7)',
                          borderRadius: '12px',
                          p: 3,
                          border: '1px solid rgba(242, 197, 20, 0.3)',
                        }}
                      >
                        <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#92400e', fontFamily: '"Inter", sans-serif', mb: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Lodgement Date
                        </Typography>
                        <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#78350f', fontFamily: '"Poppins", sans-serif' }}>
                          {new Date(report.epcData['lodgement-date']).toLocaleDateString()}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            ) : (
              <Alert severity="info" sx={{ borderRadius: '12px', fontSize: '15px' }}>
                EPC data not available for this property.
              </Alert>
            )}
          </ContentSection>
        );

      case 'Legal Section':
        return (
          <ContentSection>
            <SectionTitle
              sx={{
                position: 'relative',
                paddingLeft: 3,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '6px',
                  backgroundColor: '#f2c514',
                  borderRadius: '10px',
                },
              }}
            >
              Legal Section
            </SectionTitle>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {/* Land Registry Transaction History */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      backgroundColor: '#f2c514',
                      borderRadius: '50%',
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: '20px',
                      fontWeight: 700,
                      color: '#111827',
                      fontFamily: '"Poppins", "Montserrat", sans-serif',
                    }}
                  >
                    HM Land Registry - Transaction History
                  </Typography>
                </Box>

                {landRegistryLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress sx={{ color: '#f2c514' }} />
                  </Box>
                ) : landRegistryData?.result?.items && landRegistryData.result.items.length > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {landRegistryData.result.items
                      .sort((a: any, b: any) => {
                        const dateA = new Date(a.transactionDate);
                        const dateB = new Date(b.transactionDate);
                        return dateB.getTime() - dateA.getTime();
                      })
                      .map((transaction: any, index: number) => {
                        const isLatest = index === 0;
                        return (
                          <Box
                            key={transaction.transactionId}
                            sx={{
                              p: 3,
                              borderRadius: '12px',
                              backgroundColor: isLatest ? '#fffbf0' : '#ffffff',
                              border: isLatest ? '2px solid #f2c514' : '2px solid #e5e7eb',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                borderColor: '#f2c514',
                                transform: 'translateX(4px)',
                                boxShadow: '0 4px 12px rgba(242, 197, 20, 0.2)',
                              },
                            }}
                          >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                              <Box sx={{ flex: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                  <Typography
                                    sx={{
                                      fontSize: '18px',
                                      fontWeight: 700,
                                      color: '#111827',
                                      fontFamily: '"Poppins", sans-serif',
                                    }}
                                  >
                                    {transaction.propertyAddress.paon}
                                    {transaction.propertyAddress.saon ? ` ${transaction.propertyAddress.saon}` : ''}
                                  </Typography>
                                  {isLatest && (
                                    <Box
                                      sx={{
                                        px: 1.5,
                                        py: 0.5,
                                        borderRadius: '6px',
                                        backgroundColor: '#f2c514',
                                      }}
                                    >
                                      <Typography
                                        sx={{
                                          fontSize: '11px',
                                          fontWeight: 700,
                                          color: '#000000',
                                          fontFamily: '"Inter", sans-serif',
                                          textTransform: 'uppercase',
                                          letterSpacing: '0.5px',
                                        }}
                                      >
                                        Latest
                                      </Typography>
                                    </Box>
                                  )}
                                </Box>
                                <Typography
                                  sx={{
                                    fontSize: '14px',
                                    color: '#6b7280',
                                    fontFamily: '"Inter", sans-serif',
                                  }}
                                >
                                  {transaction.propertyAddress.street}, {transaction.propertyAddress.town}
                                </Typography>
                              </Box>
                              <Box sx={{ textAlign: 'right' }}>
                                <Typography
                                  sx={{
                                    fontSize: '24px',
                                    fontWeight: 700,
                                    color: '#10b981',
                                    fontFamily: '"Poppins", sans-serif',
                                  }}
                                >
                                  £{transaction.pricePaid.toLocaleString()}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: '13px',
                                    color: '#6b7280',
                                    fontFamily: '"Inter", sans-serif',
                                  }}
                                >
                                  {new Date(transaction.transactionDate).toLocaleDateString('en-GB', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  })}
                                </Typography>
                              </Box>
                            </Box>

                            {/* Transaction Details Grid */}
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2.5, mt: 3 }}>
                              {/* Transaction ID */}
                              <Box>
                                <Typography
                                  sx={{
                                    fontSize: '11px',
                                    color: '#9ca3af',
                                    fontFamily: '"Inter", sans-serif',
                                    mb: 0.5,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    fontWeight: 600,
                                  }}
                                >
                                  Transaction ID
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    color: '#111827',
                                    fontFamily: '"Courier New", monospace',
                                    wordBreak: 'break-all',
                                  }}
                                >
                                  {transaction.transactionId}
                                </Typography>
                              </Box>

                              {/* New Build */}
                              <Box>
                                <Typography
                                  sx={{
                                    fontSize: '11px',
                                    color: '#9ca3af',
                                    fontFamily: '"Inter", sans-serif',
                                    mb: 0.5,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    fontWeight: 600,
                                  }}
                                >
                                  New Build
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: '#111827',
                                    fontFamily: '"Inter", sans-serif',
                                  }}
                                >
                                  {transaction.newBuild ? 'Yes' : 'No'}
                                </Typography>
                              </Box>

                              {/* Transaction Date */}
                              <Box>
                                <Typography
                                  sx={{
                                    fontSize: '11px',
                                    color: '#9ca3af',
                                    fontFamily: '"Inter", sans-serif',
                                    mb: 0.5,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    fontWeight: 600,
                                  }}
                                >
                                  Transaction Date
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: '#111827',
                                    fontFamily: '"Inter", sans-serif',
                                  }}
                                >
                                  {new Date(transaction.transactionDate).toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                  })}
                                </Typography>
                              </Box>

                              {/* Price Paid */}
                              <Box>
                                <Typography
                                  sx={{
                                    fontSize: '11px',
                                    color: '#9ca3af',
                                    fontFamily: '"Inter", sans-serif',
                                    mb: 0.5,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    fontWeight: 600,
                                  }}
                                >
                                  Price Paid
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: '#111827',
                                    fontFamily: '"Inter", sans-serif',
                                  }}
                                >
                                  £{transaction.pricePaid.toLocaleString()}
                                </Typography>
                              </Box>

                              {/* Type */}
                              <Box>
                                <Typography
                                  sx={{
                                    fontSize: '11px',
                                    color: '#9ca3af',
                                    fontFamily: '"Inter", sans-serif',
                                    mb: 0.5,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    fontWeight: 600,
                                  }}
                                >
                                  Type
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: '#111827',
                                    fontFamily: '"Inter", sans-serif',
                                  }}
                                >
                                  TransactionRecord
                                </Typography>
                              </Box>

                              {/* Estate Type */}
                              <Box>
                                <Typography
                                  sx={{
                                    fontSize: '11px',
                                    color: '#9ca3af',
                                    fontFamily: '"Inter", sans-serif',
                                    mb: 0.5,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    fontWeight: 600,
                                  }}
                                >
                                  Estate Type
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: '#111827',
                                    fontFamily: '"Inter", sans-serif',
                                  }}
                                >
                                  {transaction.estateType.label[0]._value}
                                </Typography>
                              </Box>

                              {/* Has Transaction */}
                              <Box>
                                <Typography
                                  sx={{
                                    fontSize: '11px',
                                    color: '#9ca3af',
                                    fontFamily: '"Inter", sans-serif',
                                    mb: 0.5,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    fontWeight: 600,
                                  }}
                                >
                                  Has Transaction
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    color: '#111827',
                                    fontFamily: '"Courier New", monospace',
                                    wordBreak: 'break-all',
                                  }}
                                >
                                  {transaction.transactionId}
                                </Typography>
                              </Box>
                            </Box>

                            {/* Property Address Section */}
                            <Box sx={{ mt: 3, p: 2.5, backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                              <Typography
                                sx={{
                                  fontSize: '11px',
                                  color: '#9ca3af',
                                  fontFamily: '"Inter", sans-serif',
                                  mb: 1.5,
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px',
                                  fontWeight: 600,
                                }}
                              >
                                Property Address
                              </Typography>
                              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                                {/* County */}
                                <Box>
                                  <Typography
                                    sx={{
                                      fontSize: '11px',
                                      color: '#9ca3af',
                                      fontFamily: '"Inter", sans-serif',
                                      mb: 0.5,
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.5px',
                                      fontWeight: 600,
                                    }}
                                  >
                                    County
                                  </Typography>
                                  <Typography
                                    sx={{
                                      fontSize: '14px',
                                      fontWeight: 600,
                                      color: '#111827',
                                      fontFamily: '"Inter", sans-serif',
                                    }}
                                  >
                                    {transaction.propertyAddress.county || 'N/A'}
                                  </Typography>
                                </Box>

                                {/* District */}
                                <Box>
                                  <Typography
                                    sx={{
                                      fontSize: '11px',
                                      color: '#9ca3af',
                                      fontFamily: '"Inter", sans-serif',
                                      mb: 0.5,
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.5px',
                                      fontWeight: 600,
                                    }}
                                  >
                                    District
                                  </Typography>
                                  <Typography
                                    sx={{
                                      fontSize: '14px',
                                      fontWeight: 600,
                                      color: '#111827',
                                      fontFamily: '"Inter", sans-serif',
                                    }}
                                  >
                                    {transaction.propertyAddress.district || 'N/A'}
                                  </Typography>
                                </Box>

                                {/* PAON */}
                                <Box>
                                  <Typography
                                    sx={{
                                      fontSize: '11px',
                                      color: '#9ca3af',
                                      fontFamily: '"Inter", sans-serif',
                                      mb: 0.5,
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.5px',
                                      fontWeight: 600,
                                    }}
                                  >
                                    PAON
                                  </Typography>
                                  <Typography
                                    sx={{
                                      fontSize: '14px',
                                      fontWeight: 600,
                                      color: '#111827',
                                      fontFamily: '"Inter", sans-serif',
                                    }}
                                  >
                                    {transaction.propertyAddress.paon}
                                  </Typography>
                                </Box>

                                {/* Postcode */}
                                <Box>
                                  <Typography
                                    sx={{
                                      fontSize: '11px',
                                      color: '#9ca3af',
                                      fontFamily: '"Inter", sans-serif',
                                      mb: 0.5,
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.5px',
                                      fontWeight: 600,
                                    }}
                                  >
                                    Postcode
                                  </Typography>
                                  <Typography
                                    sx={{
                                      fontSize: '14px',
                                      fontWeight: 600,
                                      color: '#111827',
                                      fontFamily: '"Inter", sans-serif',
                                    }}
                                  >
                                    {transaction.propertyAddress.postcode}
                                  </Typography>
                                </Box>

                                {/* Street */}
                                <Box>
                                  <Typography
                                    sx={{
                                      fontSize: '11px',
                                      color: '#9ca3af',
                                      fontFamily: '"Inter", sans-serif',
                                      mb: 0.5,
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.5px',
                                      fontWeight: 600,
                                    }}
                                  >
                                    Street
                                  </Typography>
                                  <Typography
                                    sx={{
                                      fontSize: '14px',
                                      fontWeight: 600,
                                      color: '#111827',
                                      fontFamily: '"Inter", sans-serif',
                                    }}
                                  >
                                    {transaction.propertyAddress.street}
                                  </Typography>
                                </Box>

                                {/* Town */}
                                <Box>
                                  <Typography
                                    sx={{
                                      fontSize: '11px',
                                      color: '#9ca3af',
                                      fontFamily: '"Inter", sans-serif',
                                      mb: 0.5,
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.5px',
                                      fontWeight: 600,
                                    }}
                                  >
                                    Town
                                  </Typography>
                                  <Typography
                                    sx={{
                                      fontSize: '14px',
                                      fontWeight: 600,
                                      color: '#111827',
                                      fontFamily: '"Inter", sans-serif',
                                    }}
                                  >
                                    {transaction.propertyAddress.town}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>

                            {/* Property Type, Record Status, Transaction Category */}
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2.5, mt: 2.5 }}>
                              {/* Property Type */}
                              <Box>
                                <Typography
                                  sx={{
                                    fontSize: '11px',
                                    color: '#9ca3af',
                                    fontFamily: '"Inter", sans-serif',
                                    mb: 0.5,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    fontWeight: 600,
                                  }}
                                >
                                  Property Type
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: '#111827',
                                    fontFamily: '"Inter", sans-serif',
                                  }}
                                >
                                  {transaction.propertyType.label[0]._value}
                                </Typography>
                              </Box>

                              {/* Record Status */}
                              <Box>
                                <Typography
                                  sx={{
                                    fontSize: '11px',
                                    color: '#9ca3af',
                                    fontFamily: '"Inter", sans-serif',
                                    mb: 0.5,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    fontWeight: 600,
                                  }}
                                >
                                  Record Status
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: '#111827',
                                    fontFamily: '"Inter", sans-serif',
                                  }}
                                >
                                  {transaction.recordStatus?.label?.[0]?._value || 'Add'}
                                </Typography>
                              </Box>

                              {/* Transaction Category */}
                              <Box>
                                <Typography
                                  sx={{
                                    fontSize: '11px',
                                    color: '#9ca3af',
                                    fontFamily: '"Inter", sans-serif',
                                    mb: 0.5,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    fontWeight: 600,
                                  }}
                                >
                                  Transaction Category
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: '#111827',
                                    fontFamily: '"Inter", sans-serif',
                                  }}
                                >
                                  {transaction.transactionCategory.label[0]._value}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        );
                      })}
                    
                    {/* Data Source Attribution */}
                    <Box
                      sx={{
                        p: 2.5,
                        borderRadius: '10px',
                        backgroundColor: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        mt: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '12px',
                          color: '#6b7280',
                          fontFamily: '"Inter", sans-serif',
                          lineHeight: 1.6,
                        }}
                      >
                        Data source: Contains HM Land Registry data © Crown copyright and database right {new Date().getFullYear()}. This data is licensed under the{' '}
                        <Typography
                          component="a"
                          href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: '#f2c514',
                            textDecoration: 'underline',
                            fontWeight: 600,
                            '&:hover': {
                              color: '#d4a911',
                            },
                          }}
                        >
                          Open Government Licence v3.0
                        </Typography>
                        .
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      p: 4,
                      borderRadius: '12px',
                      backgroundColor: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      textAlign: 'center',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '15px',
                        color: '#6b7280',
                        fontFamily: '"Inter", sans-serif',
                      }}
                    >
                      No transaction history available for this postcode in the HM Land Registry Price Paid Data.
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Important Notice */}
              <Box
                sx={{
                  p: 4,
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                  border: '2px solid #ef4444',
                  mt: 4,
                }}
              >
                <Box sx={{ display: 'flex', gap: 2.5 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '10px',
                      backgroundColor: '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                    }}
                  >
                    <Typography sx={{ fontSize: '24px' }}>⚠️</Typography>
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: '16px',
                        fontWeight: 700,
                        color: '#dc2626',
                        fontFamily: '"Poppins", sans-serif',
                        mb: 1,
                      }}
                    >
                      Professional Legal Advice Required
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '15px',
                        lineHeight: 1.8,
                        fontFamily: '"Inter", sans-serif',
                        color: '#7f1d1d',
                      }}
                    >
                      This section provides general information only. Always seek professional legal advice from a qualified solicitor or conveyancer before proceeding with any property transaction. They will conduct thorough due diligence and ensure all legal requirements are met.
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
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
            <SectionTitle sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <Box
                sx={{
                  width: 6,
                  height: 48,
                  backgroundColor: '#f2c514',
                  borderRadius: '3px',
                }}
              />
              Mortgage Calculator
            </SectionTitle>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #fefce8 100%)',
                  borderRadius: '16px',
                  p: 4,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #fde68a',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      backgroundColor: '#f2c514',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(242, 197, 20, 0.3)',
                    }}
                  >
                    <Typography sx={{ fontSize: '24px' }}>🏠</Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#78350f',
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '15px',
                      fontWeight: 500,
                    }}
                  >
                    Calculate your mortgage payments based on the property price
                  </Typography>
                </Box>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {/* Property Value */}
                    <Box>
                      <Typography sx={{ mb: 2, fontSize: '15px', fontWeight: 600, color: '#111827', fontFamily: '"Poppins", sans-serif' }}>
                        Property Value
                      </Typography>
                      <TextField
                        fullWidth
                        type="number"
                        value={propertyValue || ''}
                        onChange={(e) => setPropertyValue(parseFloat(e.target.value) || 0)}
                        variant="outlined"
                        placeholder="Enter property value"
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            backgroundColor: '#ffffff',
                            '& fieldset': {
                              borderColor: '#e5e7eb',
                              borderWidth: '2px',
                            },
                            '&:hover fieldset': {
                              borderColor: '#fbbf24',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#f2c514',
                              borderWidth: '2px',
                            },
                          },
                          '& .MuiInputBase-input': { 
                            fontFamily: '"Inter", sans-serif',
                            fontSize: '18px',
                            fontWeight: 600,
                            color: '#111827',
                            padding: '16px',
                          }, 
                        }}
                      />
                    </Box>

                    {/* Deposit Slider */}
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography sx={{ fontSize: '15px', fontWeight: 600, color: '#111827', fontFamily: '"Poppins", sans-serif' }}>
                          💳 Deposit
                        </Typography>
                        <Box
                          sx={{
                            backgroundColor: '#fef3c7',
                            borderRadius: '8px',
                            px: 2,
                            py: 0.5,
                            border: '2px solid #fbbf24',
                          }}
                        >
                          <Typography sx={{ fontSize: '20px', fontWeight: 700, color: '#d97706', fontFamily: '"Poppins", sans-serif' }}>
                          {depositPercent}%
                        </Typography>
                        </Box>
                      </Box>
                      <SliderContainer>
                        <Slider
                          value={depositPercent}
                          onChange={(_, newValue) => setDepositPercent(newValue as number)}
                          min={1}
                          max={100}
                          step={1}
                          sx={{
                            color: '#f2c514',
                            height: 8,
                            '& .MuiSlider-thumb': {
                              width: 24,
                              height: 24,
                              backgroundColor: '#f2c514',
                              border: '3px solid #ffffff',
                              boxShadow: '0 4px 12px rgba(242, 197, 20, 0.5)',
                              '&:hover': {
                                boxShadow: '0 6px 16px rgba(242, 197, 20, 0.6)',
                              },
                            },
                            '& .MuiSlider-track': {
                              height: 8,
                              borderRadius: 4,
                              background: 'linear-gradient(90deg, #f2c514 0%, #fbbf24 100%)',
                            },
                            '& .MuiSlider-rail': {
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: '#e5e7eb',
                            },
                          }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                          <Typography sx={{ fontSize: '12px', color: '#9ca3af', fontFamily: '"Inter", sans-serif', fontWeight: 500 }}>1%</Typography>
                          <Typography sx={{ fontSize: '12px', color: '#9ca3af', fontFamily: '"Inter", sans-serif', fontWeight: 500 }}>100%</Typography>
                    </Box>
                      </SliderContainer>
                    </Box>

                    {/* Interest Rate */}
                    <Box>
                      <Typography sx={{ mb: 2, fontSize: '15px', fontWeight: 600, color: '#111827', fontFamily: '"Poppins", sans-serif' }}>
                        📊 Interest Rate
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
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            backgroundColor: '#ffffff',
                            '& fieldset': {
                              borderColor: '#e5e7eb',
                              borderWidth: '2px',
                            },
                            '&:hover fieldset': {
                              borderColor: '#fbbf24',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#f2c514',
                              borderWidth: '2px',
                            },
                          },
                          '& .MuiInputBase-input': { 
                            fontFamily: '"Inter", sans-serif',
                            fontSize: '18px',
                            fontWeight: 600,
                            color: '#111827',
                            padding: '16px',
                          }, 
                        }}
                      />
                    </Box>

                    {/* Loan Term Timeline */}
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography sx={{ fontSize: '15px', fontWeight: 600, color: '#111827', fontFamily: '"Poppins", sans-serif' }}>
                          ⏱️ Loan Term
                        </Typography>
                        <Box
                          sx={{
                            backgroundColor: '#fef3c7',
                            borderRadius: '8px',
                            px: 2,
                            py: 0.5,
                            border: '2px solid #fbbf24',
                          }}
                        >
                          <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#d97706', fontFamily: '"Poppins", sans-serif' }}>
                          {loanTerm} {loanTerm === 1 ? 'year' : 'years'}
                        </Typography>
                        </Box>
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
                </Box>
              
              {mortgageResult && propertyValue > 0 && (
                <Box
                  sx={{
                    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 24px rgba(242, 197, 20, 0.25)',
                    border: '2px solid #fbbf24',
                  }}
                >
                  <Box sx={{ p: 4 }}>
                    <Typography
                      sx={{
                        fontSize: '18px',
                        fontWeight: 700,
                        color: '#92400e',
                        fontFamily: '"Poppins", sans-serif',
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                       Mortgage Breakdown
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          p: 2,
                          backgroundColor: 'rgba(255, 255, 255, 0.6)',
                          borderRadius: '10px',
                        }}
                      >
                        <Typography sx={{ fontSize: '15px', fontWeight: 500, color: '#78350f', fontFamily: '"Inter", sans-serif' }}>
                          Property Value
                        </Typography>
                        <Typography sx={{ fontSize: '16px', fontWeight: 700, color: '#78350f', fontFamily: '"Poppins", sans-serif' }}>
                          £{propertyValue.toLocaleString()}
                        </Typography>
                      </Box>
                      
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          p: 2,
                          backgroundColor: 'rgba(255, 255, 255, 0.6)',
                          borderRadius: '10px',
                        }}
                      >
                        <Typography sx={{ fontSize: '15px', fontWeight: 500, color: '#78350f', fontFamily: '"Inter", sans-serif' }}>
                          Deposit ({depositPercent}%)
                        </Typography>
                        <Typography sx={{ fontSize: '16px', fontWeight: 700, color: '#78350f', fontFamily: '"Poppins", sans-serif' }}>
                          £{mortgageResult.depositAmount.toLocaleString()}
                        </Typography>
                      </Box>
                      
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          p: 2,
                          backgroundColor: 'rgba(255, 255, 255, 0.6)',
                          borderRadius: '10px',
                        }}
                      >
                        <Typography sx={{ fontSize: '15px', fontWeight: 500, color: '#78350f', fontFamily: '"Inter", sans-serif' }}>
                          Loan Amount
                        </Typography>
                        <Typography sx={{ fontSize: '16px', fontWeight: 700, color: '#78350f', fontFamily: '"Poppins", sans-serif' }}>
                          £{mortgageResult.loanAmount.toLocaleString()}
                        </Typography>
                      </Box>
                      
                      {/* Highlight Monthly Payment */}
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          p: 3,
                          backgroundColor: '#f2c514',
                          borderRadius: '12px',
                          boxShadow: '0 6px 16px rgba(242, 197, 20, 0.4)',
                          mt: 1,
                        }}
                      >
                        <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#000000', fontFamily: '"Poppins", sans-serif' }}>
                          Monthly Payment
                        </Typography>
                        <Typography sx={{ fontSize: '28px', fontWeight: 900, color: '#000000', fontFamily: '"Poppins", sans-serif' }}>
                          £{mortgageResult.monthlyPayment.toFixed(2)}
                        </Typography>
                      </Box>
                      
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          p: 2,
                          backgroundColor: 'rgba(255, 255, 255, 0.6)',
                          borderRadius: '10px',
                        }}
                      >
                        <Typography sx={{ fontSize: '15px', fontWeight: 500, color: '#78350f', fontFamily: '"Inter", sans-serif' }}>
                          Total Amount Paid
                        </Typography>
                        <Typography sx={{ fontSize: '16px', fontWeight: 700, color: '#78350f', fontFamily: '"Poppins", sans-serif' }}>
                          £{mortgageResult.totalAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </Typography>
                      </Box>
                      
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          p: 2,
                          backgroundColor: 'rgba(255, 255, 255, 0.6)',
                          borderRadius: '10px',
                        }}
                      >
                        <Typography sx={{ fontSize: '15px', fontWeight: 500, color: '#78350f', fontFamily: '"Inter", sans-serif' }}>
                          Total Interest
                        </Typography>
                        <Typography sx={{ fontSize: '16px', fontWeight: 700, color: '#78350f', fontFamily: '"Poppins", sans-serif' }}>
                          £{mortgageResult.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}
              
              {(!mortgageResult || propertyValue <= 0) && (
                <Alert severity="info">
                  Please enter a valid property value to calculate mortgage payments.
                </Alert>
              )}
            </Box>
          </ContentSection>
        );

      case 'Demographics Findings':
        return (
          <ContentSection>
            <SectionTitle sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <Box
                sx={{
                  width: 6,
                  height: 48,
                  backgroundColor: '#f2c514',
                  borderRadius: '3px',
                }}
              />
              Demographics Findings
            </SectionTitle>
            {report.aiAnalysis ? (
              <>
                {report.aiAnalysis.summary && (
                  <Box sx={{ mb: 4 }}>
                    <Box
                      sx={{
                        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                        borderRadius: '16px',
                        p: 4,
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(251, 191, 36, 0.15)',
                        border: '1px solid #fbbf24',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          width: '200px',
                          height: '200px',
                          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.2) 0%, transparent 70%)',
                          borderRadius: '50%',
                          transform: 'translate(30%, -30%)',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            backgroundColor: '#f2c514',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(242, 197, 20, 0.3)',
                          }}
                        >
                          <Typography sx={{ fontSize: '24px', fontWeight: 700, color: '#000' }}>
                            📊
                    </Typography>
                        </Box>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 700,
                            fontSize: '22px',
                            fontFamily: '"Poppins", sans-serif',
                            color: '#92400e',
                            letterSpacing: '-0.02em',
                          }}
                        >
                          Executive Summary
                        </Typography>
                      </Box>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            lineHeight: 1.8, 
                            fontSize: '16px',
                          fontFamily: '"Inter", sans-serif',
                          color: '#78350f',
                          position: 'relative',
                          zIndex: 1,
                          }}
                        >
                          {(() => {
                            const text = report.aiAnalysis.summary.slice(2);
                            return text.charAt(0).toUpperCase() + text.slice(1);
                          })()}
                      </Typography>
                    </Box>
                  </Box>
                )}
                {report.aiAnalysis.points && report.aiAnalysis.points.length > 0 && (
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        mb: 3,
                        fontWeight: 700,
                        fontSize: '20px',
                        fontFamily: '"Poppins", sans-serif',
                        color: '#111827',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          backgroundColor: '#f2c514',
                          borderRadius: '50%',
                        }}
                      />
                      Key Benefits & Insights
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {report.aiAnalysis.points.map((point: any, index: number) => (
                        <Box
                          key={index}
                          sx={{
                            background: '#ffffff',
                            borderRadius: '12px',
                            p: 3,
                            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
                            border: '1px solid #e5e7eb',
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            overflow: 'hidden',
                            '&:hover': {
                              boxShadow: '0 8px 24px rgba(242, 197, 20, 0.15)',
                              borderColor: '#fbbf24',
                              transform: 'translateY(-2px)',
                            },
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              width: '4px',
                              height: '100%',
                              background: 'linear-gradient(180deg, #f2c514 0%, #d4a911 100%)',
                            },
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'start', gap: 2 }}>
                            <Box
                              sx={{
                                minWidth: 40,
                                height: 40,
                                backgroundColor: '#fef3c7',
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                fontSize: '18px',
                                color: '#d97706',
                                fontFamily: '"Poppins", sans-serif',
                                boxShadow: '0 2px 8px rgba(251, 191, 36, 0.2)',
                              }}
                            >
                              {point.number}
                            </Box>
                            <Box sx={{ flex: 1 }}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              mb: 1.5, 
                                  fontWeight: 700,
                              fontSize: '18px',
                                  color: '#111827',
                                  fontFamily: '"Poppins", sans-serif',
                                  letterSpacing: '-0.01em',
                            }}
                          >
                                {point.title}
                          </Typography>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                                  color: '#4b5563',
                              lineHeight: 1.8, 
                                  fontSize: '15px',
                                  fontFamily: '"Inter", sans-serif',
                            }}
                          >
                            {(() => {
                              const text = point.content.slice(2);
                              return text.charAt(0).toUpperCase() + text.slice(1);
                            })()}
                          </Typography>
                            </Box>
                          </Box>
                        </Box>
                    ))}
                    </Box>
                  </Box>
                )}
              </>
            ) : (
              <Alert severity="info" sx={{ borderRadius: '12px', fontSize: '15px' }}>
                Amenities analysis not available for this property.
              </Alert>
            )}
          </ContentSection>
        );

      case 'Psychographics Analysis':
        return (
          <ContentSection>
            <SectionTitle
              sx={{
                position: 'relative',
                paddingLeft: 3,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '6px',
                  backgroundColor: '#f2c514',
                  borderRadius: '10px',
                },
              }}
            >
              Psychographics Analysis
            </SectionTitle>
            {report.psychographicsAnalysis ? (
              <>
                {/* Hero Section with Golden Theme */}
                <Box 
                  sx={{ 
                    mb: 4, 
                    p: 4, 
                    background: 'linear-gradient(135deg, rgba(242, 197, 20, 0.15) 0%, rgba(251, 191, 36, 0.1) 100%)',
                    borderRadius: '16px',
                    border: '2px solid #f2c514',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, #f2c514 0%, #fbbf24 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 8px 24px rgba(242, 197, 20, 0.4)',
                      }}
                    >
                      <PsychologyIcon sx={{ color: '#000000', fontSize: '36px' }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 700, 
                      fontSize: '24px', 
                          fontFamily: '"Poppins", "Montserrat", sans-serif',
                          mb: 1.5,
                          color: '#111827',
                    }}
                  >
                    Understanding Your Target Market
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontSize: '16px', 
                      lineHeight: 1.8,
                          fontFamily: '"Inter", sans-serif',
                          color: '#4b5563',
                    }}
                  >
                    Comprehensive psychographic insights into customer behaviors, values, lifestyles, and purchasing motivations for this commercial property location.
                  </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Summary Section */}
                {report.psychographicsAnalysis.summary && (
                  <Box 
                    sx={{ 
                      mb: 4, 
                      overflow: 'hidden',
                      background: 'linear-gradient(135deg, #fffbf0 0%, #fef3c7 100%)',
                      borderRadius: '16px',
                      border: '2px solid #f2c514',
                    }}
                  >
                    <Box sx={{ 
                      p: 3, 
                      borderBottom: '2px solid #f2c514',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}>
                      <Box
                        sx={{ 
                          width: 40,
                          height: 40,
                          borderRadius: '10px',
                          background: 'linear-gradient(135deg, #f2c514 0%, #fbbf24 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 12px rgba(242, 197, 20, 0.3)',
                        }}
                      >
                        <DescriptionIcon sx={{ color: '#000000', fontSize: '22px' }} />
                      </Box>
                      <Typography 
                        variant="h6" 
                          sx={{ 
                          fontWeight: 700, 
                          fontSize: '20px', 
                          fontFamily: '"Poppins", "Montserrat", sans-serif',
                          color: '#92400e',
                        }}
                      >
                        Executive Summary
                      </Typography>
                    </Box>
                    <Box sx={{ p: 4 }}>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          lineHeight: 1.9, 
                          fontSize: '16px',
                          fontFamily: '"Inter", sans-serif',
                          color: '#78350f',
                        }}
                      >
                        {report.psychographicsAnalysis.summary}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* Key Insights Grid */}
                {report.psychographicsAnalysis.points && report.psychographicsAnalysis.points.length > 0 && (
                  <Box>
                    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          backgroundColor: '#f2c514',
                          borderRadius: '50%',
                        }}
                      />
                    <Typography 
                      variant="h6" 
                      sx={{ 
                          fontWeight: 700, 
                        fontSize: '20px', 
                          fontFamily: '"Poppins", "Montserrat", sans-serif',
                          color: '#111827',
                      }}
                    >
                      Key Psychographic Insights
                    </Typography>
                    </Box>
                    
                    <Box 
                      sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                        gap: 3,
                      }}
                    >
                      {report.psychographicsAnalysis.points.map((point: any, index: number) => {
                        // Define diverse gradient colors for each card
                        const gradients = [
                          { bg: '#fef3c7', border: '#f59e0b', textColor: '#92400e', icon: '👥' }, // Warm Yellow
                          { bg: '#dbeafe', border: '#3b82f6', textColor: '#1e40af', icon: '💡' }, // Blue
                          { bg: '#d1fae5', border: '#10b981', textColor: '#065f46', icon: '🛒' }, // Green
                          { bg: '#fce7f3', border: '#ec4899', textColor: '#9f1239', icon: '⚖️' }, // Pink
                          { bg: '#e0e7ff', border: '#6366f1', textColor: '#3730a3', icon: '🏷️' }, // Indigo
                          { bg: '#fed7aa', border: '#f97316', textColor: '#9a3412', icon: '🤝' }, // Orange
                          { bg: '#ccfbf1', border: '#14b8a6', textColor: '#115e59', icon: '📱' }, // Teal
                          { bg: '#fef9c3', border: '#eab308', textColor: '#854d0e', icon: '💰' }, // Yellow
                          { bg: '#e9d5ff', border: '#a855f7', textColor: '#6b21a8', icon: '⏰' }, // Purple
                          { bg: '#cffafe', border: '#06b6d4', textColor: '#155e75', icon: '📈' }, // Cyan
                        ];
                        const gradient = gradients[index % gradients.length];
                        
                        return (
                          <Box
                            key={index} 
                            sx={{ 
                              overflow: 'hidden',
                              borderRadius: '12px',
                              border: `2px solid ${gradient.border}`,
                              backgroundColor: '#ffffff',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: `0 12px 32px ${gradient.border}40`,
                              },
                            }}
                          >
                            {/* Card Header */}
                            <Box 
                              sx={{ 
                                p: 2.5, 
                                backgroundColor: gradient.bg,
                                borderBottom: `2px solid ${gradient.border}`,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                              }}
                            >
                              <Box 
                                sx={{ 
                                  width: 48, 
                                  height: 48, 
                                  borderRadius: '12px',
                                  backgroundColor: '#ffffff',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '24px',
                                  boxShadow: `0 4px 12px ${gradient.border}30`,
                                }}
                              >
                                {gradient.icon}
                              </Box>
                              <Box sx={{ flex: 1 }}>
                                <Typography 
                                  sx={{ 
                                    fontSize: '12px', 
                                    fontWeight: 700, 
                                    color: gradient.textColor,
                                    fontFamily: '"Inter", sans-serif',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    mb: 0.5,
                                  }}
                                >
                                  Point {point.number}
                                </Typography>
                                <Typography 
                                  variant="h6" 
                                  sx={{ 
                                    fontWeight: 700, 
                                    fontSize: '16px',
                                    color: '#111827', 
                                    fontFamily: '"Poppins", "Montserrat", sans-serif',
                                    lineHeight: 1.3,
                                  }}
                                >
                                  {point.title || `Insight ${point.number}`}
                                </Typography>
                              </Box>
                            </Box>
                            
                            {/* Card Content */}
                            <Box sx={{ p: 3 }}>
                              <Typography 
                                variant="body1" 
                                sx={{ 
                                  color: '#4b5563', 
                                  lineHeight: 1.8, 
                                  fontSize: '15px',
                                  fontFamily: '"Inter", sans-serif',
                                }}
                              >
                                {point.content || point.raw || ''}
                              </Typography>
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                )}

                {/* Property Context Footer */}
                <Box 
                  sx={{ 
                    mt: 4, 
                    p: 3, 
                    background: 'linear-gradient(135deg, rgba(242, 197, 20, 0.08) 0%, rgba(251, 191, 36, 0.05) 100%)',
                    borderRadius: '12px',
                    border: '1px solid rgba(242, 197, 20, 0.3)',
                  }}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#6b7280',
                      fontSize: '14px',
                      fontFamily: '"Inter", sans-serif',
                      textAlign: 'center',
                      lineHeight: 1.6,
                    }}
                  >
                    This psychographics analysis is tailored for <Box component="strong" sx={{ color: '#92400e', fontWeight: 700 }}>{report.location?.propertyType || 'commercial'}</Box> properties 
                    in the <Box component="strong" sx={{ color: '#92400e', fontWeight: 700 }}>{report.location?.postcode || ''}</Box> area, helping you understand your potential customer base.
                  </Typography>
                </Box>
              </>
            ) : (
              <Alert 
                severity="info" 
                sx={{ 
                  borderRadius: '12px',
                  fontSize: '15px',
                  '& .MuiAlert-message': {
                    fontFamily: '"Inter", sans-serif',
                  },
                }}
              >
                Psychographics analysis is not available for this property. This feature provides insights into target customer behaviors, values, and purchasing motivations.
              </Alert>
            )}
          </ContentSection>
        );

      case 'Price Prediction':
        return (
          <ContentSection>
            <SectionTitle
              sx={{
                position: 'relative',
                paddingLeft: 3,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '6px',
                  backgroundColor: '#f2c514',
                  borderRadius: '10px',
                },
              }}
            >
              Price Prediction
            </SectionTitle>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <FormControl 
                sx={{ 
                  minWidth: 200,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    '&:hover fieldset': {
                      borderColor: '#f2c514',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#f2c514',
                      borderWidth: '2px',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#f2c514',
                  },
                }}
              >
                <InputLabel id="unit-select-label">Unit</InputLabel>
                <Select
                  labelId="unit-select-label"
                  id="unit-select"
                  value={unitSelection}
                  label="Unit"
                  onChange={(e) => setUnitSelection(e.target.value as 'sqft' | 'sqm')}
                  sx={{
                    fontFamily: '"Inter", "Roboto", sans-serif',
                    fontWeight: 500,
                  }}
                >
                  <MenuItem value="sqft" sx={{ fontFamily: '"Inter", sans-serif' }}>Square Feet</MenuItem>
                  <MenuItem value="sqm" sx={{ fontFamily: '"Inter", sans-serif' }}>Square Meter</MenuItem>
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
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            backgroundColor: '#f2c514',
                            borderRadius: '50%',
                          }}
                        />
                        <Typography variant="h5" sx={{ fontWeight: 700, fontSize: '22px', color: '#111827', fontFamily: '"Poppins", "Montserrat", sans-serif' }}>
                        {showBoth ? '1. Letting\'s Valuation' : 'Letting\'s Valuation'}
                      </Typography>
                      </Box>
                      {report.predictedPrice ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                            <Box sx={{ flex: 1 }}>
                              <Box
                                sx={{
                                  borderRadius: '16px',
                                  border: '2px solid #10b981',
                                  overflow: 'hidden',
                                  backgroundColor: '#ffffff',
                                  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.15)',
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 8px 24px rgba(16, 185, 129, 0.25)',
                                  },
                                }}
                              >
                                <Box sx={{ p: 3, background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)', borderBottom: '2px solid #10b981', display: 'flex', alignItems: 'center', gap: 2 }}>
                                  <Box
                                    sx={{
                                      width: 40,
                                      height: 40,
                                      borderRadius: '10px',
                                      backgroundColor: '#10b981',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                                    }}
                                  >
                                    <Typography sx={{ fontSize: '20px' }}>📅</Typography>
                                  </Box>
                                  <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '18px', color: '#065f46', fontFamily: '"Poppins", "Montserrat", sans-serif' }}>
                                      Annual Pricing
                                    </Typography>
                                  </Box>
                                  <Box sx={{ p: 3 }}>
                                  <Box sx={{ py: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0fdf4' }}>
                                    <Typography sx={{ fontSize: '14px', color: '#6b7280', fontWeight: 500, fontFamily: '"Inter", sans-serif', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Price (PA)</Typography>
                                    <Typography sx={{ color: '#10b981', fontSize: '20px', fontWeight: 700, fontFamily: '"Poppins", sans-serif' }}>
                                        £{report.predictedPrice.pricingPA?.toLocaleString() || 'N/A'}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ py: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0fdf4' }}>
                                    <Typography sx={{ fontSize: '14px', color: '#6b7280', fontWeight: 500, fontFamily: '"Inter", sans-serif', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Price Per {unitLabel} (PA)</Typography>
                                    <Typography sx={{ fontSize: '17px', fontWeight: 600, color: '#111827', fontFamily: '"Inter", sans-serif' }}>
                                        £{report.predictedPrice.pricePerSqftPA ? (report.predictedPrice.pricePerSqftPA * conversionFactor).toFixed(2) : 'N/A'}
                                    </Typography>
                                  </Box>
                                    {report.predictedPrice.effectiveAreaSqft && (
                                    <Box sx={{ py: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <Typography sx={{ fontSize: '14px', color: '#6b7280', fontWeight: 500, fontFamily: '"Inter", sans-serif', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Effective Area ({unitSelection === 'sqm' ? 'Sqm' : 'Sqft'})</Typography>
                                      <Typography sx={{ fontSize: '17px', fontWeight: 600, color: '#111827', fontFamily: '"Inter", sans-serif' }}>
                                          {unitSelection === 'sqm' 
                                            ? `${(report.predictedPrice.effectiveAreaSqft / 10.764).toFixed(2)} sqm`
                                            : `${report.predictedPrice.effectiveAreaSqft} sqft`
                                          }
                                      </Typography>
                                    </Box>
                                    )}
                                  </Box>
                              </Box>
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Box
                                sx={{
                                  borderRadius: '16px',
                                  border: '2px solid #10b981',
                                  overflow: 'hidden',
                                  backgroundColor: '#ffffff',
                                  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.15)',
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 8px 24px rgba(16, 185, 129, 0.25)',
                                  },
                                }}
                              >
                                <Box sx={{ p: 3, background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)', borderBottom: '2px solid #10b981', display: 'flex', alignItems: 'center', gap: 2 }}>
                                  <Box
                                    sx={{
                                      width: 40,
                                      height: 40,
                                      borderRadius: '10px',
                                      backgroundColor: '#10b981',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                                    }}
                                  >
                                    <Typography sx={{ fontSize: '20px' }}>📆</Typography>
                                  </Box>
                                  <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '18px', color: '#065f46', fontFamily: '"Poppins", "Montserrat", sans-serif' }}>
                                      Monthly Pricing
                                    </Typography>
                                  </Box>
                                  <Box sx={{ p: 3 }}>
                                  <Box sx={{ py: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0fdf4' }}>
                                    <Typography sx={{ fontSize: '14px', color: '#6b7280', fontWeight: 500, fontFamily: '"Inter", sans-serif', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Price (PCM)</Typography>
                                    <Typography sx={{ color: '#10b981', fontSize: '20px', fontWeight: 700, fontFamily: '"Poppins", sans-serif' }}>
                                        £{report.predictedPrice.pricingPCM?.toLocaleString() || 'N/A'}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ py: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography sx={{ fontSize: '14px', color: '#6b7280', fontWeight: 500, fontFamily: '"Inter", sans-serif', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Price Per {unitLabel} (PCM)</Typography>
                                    <Typography sx={{ fontSize: '17px', fontWeight: 600, color: '#111827', fontFamily: '"Inter", sans-serif' }}>
                                        £{report.predictedPrice.pricePerSqftPCM ? (report.predictedPrice.pricePerSqftPCM * conversionFactor).toFixed(2) : 'N/A'}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      ) : (
                        <Alert severity="info" sx={{ borderRadius: '12px', fontSize: '15px' }}>Letting's valuation not available for this property.</Alert>
                      )}
                    </Box>
                  )}

                  {/* Sales Valuation Section */}
                  {showSales && (
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            backgroundColor: '#f2c514',
                            borderRadius: '50%',
                          }}
                        />
                        <Typography variant="h5" sx={{ fontWeight: 700, fontSize: '22px', color: '#111827', fontFamily: '"Poppins", "Montserrat", sans-serif' }}>
                        {showBoth ? '2. Sales Valuation' : 'Sales Valuation'}
                      </Typography>
                      </Box>
                      {report.predictedPrice ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {/* Three Price Cards */}
                          {(() => {
                            const annualPA = report.predictedPrice.pricingPA || 0;
                            const effectiveArea = report.predictedPrice.effectiveAreaSqft || 0;
                            
                            // Generate random yields for each card (2 decimal places)
                            // Helper function to generate random number between min and max with 2 decimal places
                            const randomYield = (min: number, max: number) => {
                              return Math.round((Math.random() * (max - min) + min) * 100) / 100;
                            };
                            
                            // Generate random yields for each price card
                            const highestYield = randomYield(3.00, 4.50); // Highest Price: 3% to 4.5%
                            const averageYield = randomYield(4.50, 5.50); // Average Price: 4.5% to 5.5%
                            const lowestYield = randomYield(5.50, 7.00); // Lowest Price: 5.5% to 7%
                            
                            // Calculate multipliers from yields (multiplier = 100 / yield)
                            const highestMultiplier = 100 / highestYield;
                            const averageMultiplier = 100 / averageYield;
                            const lowestMultiplier = 100 / lowestYield;
                            
                            // Define the three yield options with random yields and calculated multipliers
                            const priceCards = [
                              { label: 'Lowest Price', yield: lowestYield, multiplier: lowestMultiplier, emoji: '📉' },
                              { label: 'Average Price', yield: averageYield, multiplier: averageMultiplier, emoji: '£' },
                              { label: 'Highest Price', yield: highestYield, multiplier: highestMultiplier, emoji: '📈' },
                            ];

                            return (
                              <Box sx={{ 
                                display: 'flex', 
                                flexDirection: { xs: 'column', md: 'row' }, 
                                gap: 3,
                                '@media print': {
                                  pageBreakInside: 'avoid',
                                  breakInside: 'avoid',
                                },
                              }}>
                                {priceCards.map((card, index) => {
                                  const calculatedSalesPrice = annualPA * card.multiplier;
                                  const calculatedPricePerSqft = effectiveArea > 0 ? calculatedSalesPrice / effectiveArea : 0;
                                  const isAverage = card.label === 'Average Price';

                                  return (
                                    <Box key={card.label} sx={{ 
                                      flex: 1,
                                      '@media print': {
                                        pageBreakInside: 'avoid',
                                        breakInside: 'avoid',
                                      },
                                    }}>
                                      <Box
                                        sx={{
                                          borderRadius: '16px',
                                          border: isAverage ? '3px solid #f2c514' : '2px solid #e5e7eb',
                                          overflow: 'hidden',
                                          backgroundColor: '#ffffff',
                                          boxShadow: isAverage ? '0 8px 24px rgba(242, 197, 20, 0.35)' : '0 4px 12px rgba(0, 0, 0, 0.08)',
                                          transform: isAverage ? 'scale(1.05)' : 'scale(1)',
                                          transition: 'all 0.3s ease',
                                          '&:hover': {
                                            transform: isAverage ? 'scale(1.05) translateY(-4px)' : 'translateY(-4px)',
                                            boxShadow: isAverage ? '0 12px 32px rgba(242, 197, 20, 0.45)' : '0 8px 20px rgba(0, 0, 0, 0.15)',
                                          },
                                          '@media print': {
                                            pageBreakInside: 'avoid',
                                            breakInside: 'avoid',
                                            transform: 'none',
                                          },
                                        }}
                                      >
                                        <Box sx={{ 
                                          p: 3, 
                                          background: isAverage 
                                            ? 'linear-gradient(135deg, rgba(242, 197, 20, 0.15) 0%, rgba(251, 191, 36, 0.1) 100%)' 
                                            : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                                          borderBottom: isAverage ? '2px solid #f2c514' : '2px solid #e5e7eb',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: 2,
                                        }}>
                                          <Box
                                            sx={{
                                              width: 40,
                                              height: 40,
                                              borderRadius: '10px',
                                              background: isAverage 
                                                ? 'linear-gradient(135deg, #f2c514 0%, #fbbf24 100%)' 
                                                : '#ffffff',
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              boxShadow: isAverage ? '0 4px 12px rgba(242, 197, 20, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
                                            }}
                                          >
                                            <Typography sx={{ fontSize: '20px' }}>{card.emoji}</Typography>
                                          </Box>
                                          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '18px', color: isAverage ? '#92400e' : '#374151', fontFamily: '"Poppins", "Montserrat", sans-serif' }}>
                                              {card.label}
                                            </Typography>
                                          </Box>
                                          <Box sx={{ p: 3 }}>
                                          <Box sx={{ py: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6' }}>
                                            <Typography sx={{ fontSize: '14px', color: '#6b7280', fontWeight: 500, fontFamily: '"Inter", sans-serif', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sale Price</Typography>
                                            <Typography sx={{ color: isAverage ? '#f2c514' : '#10b981', fontSize: '20px', fontWeight: 700, fontFamily: '"Poppins", sans-serif' }}>
                                                £{calculatedSalesPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                            </Typography>
                                          </Box>
                                            {effectiveArea > 0 && (
                                            <Box sx={{ py: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6' }}>
                                              <Typography sx={{ fontSize: '14px', color: '#6b7280', fontWeight: 500, fontFamily: '"Inter", sans-serif', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Price Per {unitLabel}</Typography>
                                              <Typography sx={{ fontSize: '17px', fontWeight: 600, color: '#111827', fontFamily: '"Inter", sans-serif' }}>
                                                  £{(calculatedPricePerSqft * conversionFactor).toFixed(2)}
                                              </Typography>
                                            </Box>
                                            )}
                                            {effectiveArea > 0 && (
                                            <Box sx={{ py: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                              <Typography sx={{ fontSize: '14px', color: '#6b7280', fontWeight: 500, fontFamily: '"Inter", sans-serif', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Effective Area ({unitSelection === 'sqm' ? 'Sqm' : 'Sqft'})</Typography>
                                              <Typography sx={{ fontSize: '17px', fontWeight: 600, color: '#111827', fontFamily: '"Inter", sans-serif' }}>
                                                  {unitSelection === 'sqm' 
                                                    ? `${(effectiveArea / 10.764).toFixed(2)} sqm`
                                                    : `${effectiveArea} sqft`
                                                  }
                                              </Typography>
                                            </Box>
                                            )}
                                          </Box>
                                      </Box>
                                    </Box>
                                  );
                                })}
                              </Box>
                            );
                          })()}
                        </Box>
                      ) : (
                        <Alert severity="info" sx={{ borderRadius: '12px', fontSize: '15px' }}>Sales valuation not available for this property.</Alert>
                      )}
                    </Box>
                  )}

                  {/* Note Section */}
                  {(showLetting || showSales) && (
                    <Box 
                      sx={{ 
                        p: 4, 
                        background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                        border: '2px solid #ef4444', 
                        borderRadius: '16px',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: '10px',
                            backgroundColor: '#ef4444',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                          }}
                        >
                          <Typography sx={{ fontSize: '24px' }}>⚠️</Typography>
                        </Box>
                        <Box>
                          <Typography 
                            sx={{ 
                              fontSize: '16px', 
                              fontWeight: 700, 
                              color: '#dc2626', 
                              fontFamily: '"Poppins", sans-serif',
                              mb: 1,
                            }}
                          >
                            Important Note
                          </Typography>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              fontSize: '15px', 
                              lineHeight: 1.8, 
                              fontFamily: '"Inter", sans-serif', 
                              color: '#7f1d1d',
                            }}
                          >
                            These price predictions are based on market analysis and comparable properties in the area. 
                        Actual prices may vary based on negotiation, market conditions, and property-specific factors.
                      </Typography>
                        </Box>
                      </Box>
                    </Box>
                  )}

                  {/* Show message if no valuation type matches */}
                  {!showLetting && !showSales && (
                    <Alert severity="info" sx={{ borderRadius: '12px', fontSize: '15px' }}>Price prediction not available for this property.</Alert>
                  )}
                </Box>
              );
            })()}
          </ContentSection>
        );

      case 'Area Details':
        return (
          <ContentSection
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <SectionTitle
              sx={{
                position: 'relative',
                paddingLeft: 3,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '6px',
                  backgroundColor: '#f2c514',
                  borderRadius: '10px',
                },
              }}
            >
              Area Details
            </SectionTitle>
            
            {crimeData && (
              <Box>
                {/* Crime Overview Section */}
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        backgroundColor: '#f2c514',
                        borderRadius: '50%',
                      }}
                    />
                  <Typography
                    variant="h6"
                    sx={{
                        fontSize: '20px',
                        fontWeight: 700,
                        color: '#111827',
                        fontFamily: '"Poppins", "Montserrat", sans-serif',
                    }}
                  >
                    Crime Statistics for {crimeData.postcode}
                  </Typography>
                  </Box>

                  {/* Summary Cards */}
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
                      gap: 2,
                      mb: 4,
                    }}
                  >
                    {/* Crime Rating Card */}
                    <Box
                      sx={{
                        borderRadius: '16px',
                        background: crimeData.data.crime_rating === 'Very high' 
                          ? 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)'
                          : crimeData.data.crime_rating === 'High'
                          ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'
                          : 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                        border: crimeData.data.crime_rating === 'Very high' 
                          ? '2px solid #fca5a5'
                          : crimeData.data.crime_rating === 'High'
                          ? '2px solid #fcd34d'
                          : '2px solid #6ee7b7',
                        p: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                        },
                      }}
                    >
                        <Typography
                          sx={{
                          fontSize: '13px',
                            color: '#6b7280',
                            fontFamily: '"Inter", sans-serif',
                            mb: 1,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          fontWeight: 600,
                          }}
                        >
                          Crime Rating
                        </Typography>
                        <Typography
                          sx={{
                          fontSize: '28px',
                            fontWeight: 700,
                            color: crimeData.data.crime_rating === 'Very high' 
                              ? '#dc2626'
                              : crimeData.data.crime_rating === 'High'
                              ? '#d97706'
                              : '#059669',
                          fontFamily: '"Poppins", sans-serif',
                          }}
                        >
                          {crimeData.data.crime_rating}
                        </Typography>
                    </Box>

                    {/* Population Card */}
                    <Box
                      sx={{
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, rgba(242, 197, 20, 0.1) 0%, rgba(251, 191, 36, 0.05) 100%)',
                        boxShadow: '0 4px 16px rgba(242, 197, 20, 0.15)',
                        border: '2px solid #f2c514',
                        p: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 24px rgba(242, 197, 20, 0.25)',
                        },
                      }}
                    >
                        <Typography
                          sx={{
                          fontSize: '13px',
                            color: '#6b7280',
                            fontFamily: '"Inter", sans-serif',
                            mb: 1,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          fontWeight: 600,
                          }}
                        >
                          Population
                        </Typography>
                        <Typography
                          sx={{
                          fontSize: '28px',
                            fontWeight: 700,
                          color: '#d4a911',
                          fontFamily: '"Poppins", sans-serif',
                          }}
                        >
                          {crimeData.data.population.toLocaleString()}
                        </Typography>
                    </Box>

                    {/* Total Crimes Card */}
                    <Box
                      sx={{
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
                        boxShadow: '0 4px 16px rgba(124, 58, 237, 0.15)',
                        border: '2px solid #c4b5fd',
                        p: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 24px rgba(124, 58, 237, 0.25)',
                        },
                      }}
                    >
                        <Typography
                          sx={{
                          fontSize: '13px',
                            color: '#6b7280',
                            fontFamily: '"Inter", sans-serif',
                            mb: 1,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          fontWeight: 600,
                          }}
                        >
                          Total Crimes (12 months)
                        </Typography>
                        <Typography
                          sx={{
                          fontSize: '28px',
                            fontWeight: 700,
                            color: '#7c3aed',
                          fontFamily: '"Poppins", sans-serif',
                          }}
                        >
                          {crimeData.data.crimes_last_12m.total.toLocaleString()}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '12px',
                            color: '#9ca3af',
                            fontFamily: '"Inter", sans-serif',
                            mt: 0.5,
                          }}
                        >
                          {crimeData.data.crimes_last_12m.per_thousand.toFixed(1)} per 1,000 residents
                        </Typography>
                    </Box>
                  </Box>

                  {/* Crime Breakdown */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        backgroundColor: '#f2c514',
                        borderRadius: '50%',
                      }}
                    />
                  <Typography
                    variant="h6"
                    sx={{
                        fontSize: '18px',
                        fontWeight: 700,
                        color: '#111827',
                        fontFamily: '"Poppins", "Montserrat", sans-serif',
                    }}
                  >
                    Crime Breakdown (Last 12 Months)
                  </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                      gap: 2,
                      mb: 4,
                    }}
                  >
                    {Object.entries(crimeData.data.crimes_last_12m)
                      .filter(([key]) => key !== 'total' && key !== 'per_thousand')
                      .sort(([, a], [, b]) => (b as number) - (a as number))
                      .map(([crimeType, count]) => {
                        const isAboveAverage = crimeData.data.above_national_average.includes(crimeType);
                        const percentage = ((count as number) / crimeData.data.crimes_last_12m.total) * 100;
                        
                        return (
                          <Box
                            key={crimeType}
                            sx={{
                              p: 2.5,
                              borderRadius: '12px',
                              backgroundColor: '#ffffff',
                              border: '2px solid #e5e7eb',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                borderColor: '#f2c514',
                                transform: 'translateX(4px)',
                                boxShadow: '0 4px 12px rgba(242, 197, 20, 0.15)',
                              },
                            }}
                          >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                              <Typography
                                sx={{
                                  fontSize: '15px',
                                  fontWeight: 600,
                                  color: '#374151',
                                  fontFamily: '"Inter", sans-serif',
                                }}
                              >
                                {crimeType}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Typography
                                  sx={{
                                    fontSize: '16px',
                                    fontWeight: 700,
                                    color: '#111827',
                                    fontFamily: '"Poppins", sans-serif',
                                  }}
                                >
                                  {(count as number).toLocaleString()}
                                </Typography>
                                <Box
                                  sx={{
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: '6px',
                                    backgroundColor: isAboveAverage ? '#fef2f2' : '#f0fdf4',
                                    border: `1px solid ${isAboveAverage ? '#fca5a5' : '#86efac'}`,
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontSize: '11px',
                                      fontWeight: 700,
                                      color: isAboveAverage ? '#dc2626' : '#16a34a',
                                      fontFamily: '"Inter", sans-serif',
                                    }}
                                  >
                                    {isAboveAverage ? 'Above Avg' : 'Below Avg'}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                            <Box
                              sx={{
                                width: '100%',
                                height: '8px',
                                backgroundColor: '#f3f4f6',
                                borderRadius: '4px',
                                overflow: 'hidden',
                              }}
                            >
                              <Box
                                sx={{
                                  width: `${Math.min(percentage * 2, 100)}%`,
                                  height: '100%',
                                  backgroundColor: isAboveAverage ? '#f87171' : '#4ade80',
                                  borderRadius: '4px',
                                  transition: 'width 0.6s ease-out',
                                }}
                              />
                            </Box>
                          </Box>
                        );
                      })}
                  </Box>

                  {/* Above/Below National Average Summary */}
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                      gap: 3,
                    }}
                  >
                    {/* Above Average */}
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: '12px',
                        backgroundColor: '#fef2f2',
                        border: '1px solid #fecaca',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#dc2626',
                          fontFamily: '"Montserrat", sans-serif',
                          mb: 2,
                        }}
                      >
                        Above National Average ({crimeData.data.above_national_average.length})
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {crimeData.data.above_national_average.map((crime) => (
                          <Box
                            key={crime}
                            sx={{
                              px: 2,
                              py: 0.5,
                              borderRadius: '16px',
                              backgroundColor: '#ffffff',
                              border: '1px solid #fca5a5',
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: '12px',
                                color: '#b91c1c',
                                fontFamily: '"Inter", sans-serif',
                              }}
                            >
                              {crime}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>

                    {/* Below Average */}
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: '12px',
                        backgroundColor: '#f0fdf4',
                        border: '1px solid #bbf7d0',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#16a34a',
                          fontFamily: '"Montserrat", sans-serif',
                          mb: 2,
                        }}
                      >
                        Below National Average ({crimeData.data.below_national_average.length})
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {crimeData.data.below_national_average.map((crime) => (
                          <Box
                            key={crime}
                            sx={{
                              px: 2,
                              py: 0.5,
                              borderRadius: '16px',
                              backgroundColor: '#ffffff',
                              border: '1px solid #86efac',
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: '12px',
                                color: '#15803d',
                                fontFamily: '"Inter", sans-serif',
                              }}
                            >
                              {crime}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}

            {!crimeData && (
              <Alert severity="info">
                Crime data is not available for this location.
              </Alert>
            )}

            {/* Article 4 Section */}
            <Divider sx={{ my: 4, borderColor: 'rgba(242, 197, 20, 0.2)' }} />
            
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    backgroundColor: '#f2c514',
                    borderRadius: '50%',
                  }}
                />
              <Typography
                variant="h6"
                sx={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#111827',
                    fontFamily: '"Poppins", "Montserrat", sans-serif',
                }}
              >
                Article 4 Directions
              </Typography>
              </Box>
              
              <Typography
                variant="body2"
                sx={{
                  fontSize: '14px',
                  color: '#6b7280',
                  fontFamily: '"Inter", sans-serif',
                  mb: 3,
                }}
              >
                Article 4 Directions remove permitted development rights in specific areas, meaning planning permission is required for certain changes that would otherwise be allowed.
              </Typography>

              {article4Data && (
                <Box>
                  {article4Data.data.article4_areas.length > 0 ? (
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: '12px',
                        backgroundColor: '#fef3c7',
                        border: '1px solid #fcd34d',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#92400e',
                          fontFamily: '"Montserrat", sans-serif',
                          mb: 2,
                        }}
                      >
                        This property is within Article 4 Direction area(s)
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {article4Data.data.article4_areas.map((area, index) => (
                          <Box
                            key={index}
                            sx={{
                              p: 2.5,
                              borderRadius: '8px',
                              backgroundColor: '#ffffff',
                              border: '1px solid #f59e0b',
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: '14px',
                                color: '#b45309',
                                fontFamily: '"Inter", sans-serif',
                                fontWeight: 600,
                                mb: 1,
                              }}
                            >
                              {area.local_authority} - {area.electoral_ward}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: '13px',
                                color: '#92400e',
                                fontFamily: '"Inter", sans-serif',
                                mb: 1.5,
                                lineHeight: 1.6,
                              }}
                            >
                              {area.notes}
                            </Typography>
                            {area.information_url && (
                              <Typography
                                component="a"
                                href={area.information_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                  fontSize: '13px',
                                  color: '#b45309',
                                  fontFamily: '"Inter", sans-serif',
                                  textDecoration: 'underline',
                                  fontWeight: 500,
                                  '&:hover': {
                                    color: '#92400e',
                                  },
                                }}
                              >
                                More Information →
                              </Typography>
                            )}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: '12px',
                        backgroundColor: '#f0fdf4',
                        border: '1px solid #bbf7d0',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#16a34a',
                          fontFamily: '"Montserrat", sans-serif',
                        }}
                      >
                        ✓ No Article 4 Directions apply to this postcode
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '13px',
                          color: '#15803d',
                          fontFamily: '"Inter", sans-serif',
                          mt: 1,
                        }}
                      >
                        Standard permitted development rights apply in this area.
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}

              {!article4Data && (
                <Alert severity="info">
                  Article 4 data is not available for this location.
                </Alert>
              )}
            </Box>

            {/* BRMA/LHA Section */}
            <Divider sx={{ my: 4, borderColor: 'rgba(242, 197, 20, 0.2)' }} />
            
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    backgroundColor: '#f2c514',
                    borderRadius: '50%',
                  }}
                />
              <Typography
                variant="h6"
                sx={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#111827',
                    fontFamily: '"Poppins", "Montserrat", sans-serif',
                }}
              >
                Local Housing Allowance (LHA) Rates
              </Typography>
              </Box>
              
              <Typography
                variant="body2"
                sx={{
                  fontSize: '14px',
                  color: '#6b7280',
                  fontFamily: '"Inter", sans-serif',
                  mb: 3,
                }}
              >
                LHA rates are used to calculate Housing Benefit for tenants renting from private landlords. Rates are set by the Broad Rental Market Area (BRMA).
              </Typography>

              {brmaLhaData && (
                <Box>
                  {/* BRMA Info Card */}
                  <Box
                    sx={{
                      p: 4,
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, rgba(242, 197, 20, 0.1) 0%, rgba(251, 191, 36, 0.05) 100%)',
                      border: '2px solid #f2c514',
                      mb: 3,
                      boxShadow: '0 4px 16px rgba(242, 197, 20, 0.15)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 8px 24px rgba(242, 197, 20, 0.25)',
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '13px',
                        color: '#92400e',
                        fontFamily: '"Inter", sans-serif',
                        mb: 1,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        fontWeight: 600,
                      }}
                    >
                      Broad Rental Market Area
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '24px',
                        fontWeight: 700,
                        color: '#d4a911',
                        fontFamily: '"Poppins", "Montserrat", sans-serif',
                      }}
                    >
                      {brmaLhaData.data.brma_name}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '13px',
                        color: '#9ca3af',
                        fontFamily: '"Inter", sans-serif',
                        mt: 1,
                      }}
                    >
                      BRMA Code: {brmaLhaData.data.brma_code}
                    </Typography>
                  </Box>

                  {/* LHA Rates Table */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        backgroundColor: '#f2c514',
                        borderRadius: '50%',
                      }}
                    />
                  <Typography
                    sx={{
                        fontSize: '18px',
                        fontWeight: 700,
                        color: '#111827',
                        fontFamily: '"Poppins", "Montserrat", sans-serif',
                    }}
                  >
                    Weekly LHA Rates ({brmaLhaData.data.rates[0]?.year || 'Current'})
                  </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3, 1fr)', md: 'repeat(5, 1fr)' },
                      gap: 2,
                      '@media print': {
                        pageBreakInside: 'avoid',
                        breakInside: 'avoid',
                      },
                    }}
                  >
                    {brmaLhaData.data.rates.map((rate) => (
                      <Box
                        key={rate.beds}
                        sx={{
                          p: 3,
                          borderRadius: '14px',
                          backgroundColor: '#ffffff',
                          border: '2px solid #e5e7eb',
                          textAlign: 'center',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            borderColor: '#f2c514',
                            transform: 'translateY(-4px)',
                            boxShadow: '0 8px 20px rgba(242, 197, 20, 0.2)',
                          },
                          '@media print': {
                            pageBreakInside: 'avoid',
                            breakInside: 'avoid',
                            transform: 'none',
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: '12px',
                            color: '#6b7280',
                            fontFamily: '"Inter", sans-serif',
                            mb: 1.5,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            fontWeight: 600,
                          }}
                        >
                          {rate.beds === 0 ? 'Shared' : rate.beds === 1 ? '1 Bed' : `${rate.beds} Beds`}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '26px',
                            fontWeight: 700,
                            color: '#f2c514',
                            fontFamily: '"Poppins", "Montserrat", sans-serif',
                          }}
                        >
                          £{rate.lha_rate.toFixed(2)}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '11px',
                            color: '#9ca3af',
                            fontFamily: '"Inter", sans-serif',
                            mt: 0.5,
                          }}
                        >
                          per week
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '13px',
                            color: '#6b7280',
                            fontFamily: '"Inter", sans-serif',
                            mt: 1.5,
                            pt: 1.5,
                            borderTop: '1px solid #f3f4f6',
                            fontWeight: 600,
                          }}
                        >
                          £{(rate.lha_rate * 52 / 12).toFixed(0)}/month
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {!brmaLhaData && (
                <Alert severity="info">
                  LHA rate data is not available for this location.
                </Alert>
              )}
            </Box>

            {/* Demographics Section */}
            <Divider sx={{ my: 4, borderColor: 'rgba(242, 197, 20, 0.2)' }} />
            
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    backgroundColor: '#f2c514',
                    borderRadius: '50%',
                  }}
                />
              <Typography
                variant="h6"
                sx={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#111827',
                    fontFamily: '"Poppins", "Montserrat", sans-serif',
                }}
              >
                Area Demographics
              </Typography>
              </Box>
              
              <Typography
                variant="body2"
                sx={{
                  fontSize: '14px',
                  color: '#6b7280',
                  fontFamily: '"Inter", sans-serif',
                  mb: 3,
                }}
              >
                Detailed demographic breakdown of the local population based on census data.
              </Typography>

              {demographicsData && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {(() => {
                    // Pie Chart Component - Enhanced with larger size and hover effects
                    const renderPieChart = (
                      title: string,
                      data: { [key: string]: number },
                      colorScheme: string[]
                    ) => {
                      const entries = Object.entries(data).filter(([, value]) => value > 0);
                      const total = entries.reduce((sum, [, value]) => sum + value, 0);
                      
                      // Calculate pie slices
                      let currentAngle = 0;
                      const slices = entries.map(([label, value], index) => {
                        const percentage = (value / total) * 100;
                        const angle = (value / total) * 360;
                        const startAngle = currentAngle;
                        currentAngle += angle;
                        return {
                          label,
                          value,
                          percentage,
                          startAngle,
                          endAngle: currentAngle,
                          color: colorScheme[index % colorScheme.length],
                        };
                      });

                      // SVG path for pie slice with configurable center
                      const getSlicePath = (startAngle: number, endAngle: number, radius: number, cx: number = 150, cy: number = 150) => {
                        const startRad = (startAngle - 90) * (Math.PI / 180);
                        const endRad = (endAngle - 90) * (Math.PI / 180);
                        const x1 = cx + radius * Math.cos(startRad);
                        const y1 = cy + radius * Math.sin(startRad);
                        const x2 = cx + radius * Math.cos(endRad);
                        const y2 = cy + radius * Math.sin(endRad);
                        const largeArc = endAngle - startAngle > 180 ? 1 : 0;
                        return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
                      };

                      return (
                        <Box
                          sx={{
                            p: 4,
                            borderRadius: '20px',
                            backgroundColor: '#ffffff',
                            border: '1px solid #e5e7eb',
                            boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.12)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              boxShadow: '0 12px 32px -4px rgba(0, 0, 0, 0.18)',
                            },
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: '22px',
                              fontWeight: 700,
                              color: '#1f2937',
                              fontFamily: '"Montserrat", sans-serif',
                              mb: 4,
                              textAlign: 'center',
                            }}
                          >
                            {title}
                          </Typography>
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: 4,
                            }}
                          >
                            {/* Pie Chart SVG - Larger size with tooltips */}
                            <Box sx={{ flexShrink: 0, position: 'relative' }}>
                              <svg width="280" height="280" viewBox="0 0 300 300" style={{ overflow: 'visible' }}>
                                <style>
                                  {`
                                    .pie-slice {
                                      transition: transform 0.3s ease, filter 0.3s ease;
                                      transform-origin: 150px 150px;
                                      cursor: pointer;
                                    }
                                    .pie-slice:hover {
                                      transform: scale(1.08);
                                      filter: drop-shadow(0 4px 12px rgba(0,0,0,0.25));
                                    }
                                  `}
                                </style>
                                {slices.map((slice, index) => (
                                  <Tooltip
                                    key={index}
                                    title={
                                      <Box sx={{ p: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
                                          <Box
                                            sx={{
                                              width: 16,
                                              height: 16,
                                              borderRadius: '4px',
                                              backgroundColor: slice.color,
                                              flexShrink: 0,
                                              mt: 0.25,
                                            }}
                                          />
                                          <Typography
                                            sx={{
                                              fontSize: '15px',
                                              fontWeight: 700,
                                              color: '#ffffff',
                                              fontFamily: '"Montserrat", sans-serif',
                                              lineHeight: 1.4,
                                              wordBreak: 'break-word',
                                            }}
                                          >
                                            {slice.label}
                                          </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3, mb: 1 }}>
                                          <Typography sx={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontFamily: '"Inter", sans-serif', flexShrink: 0 }}>
                                            Count:
                                          </Typography>
                                          <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#ffffff', fontFamily: '"Montserrat", sans-serif' }}>
                                            {slice.value.toLocaleString()}
                                          </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3 }}>
                                          <Typography sx={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontFamily: '"Inter", sans-serif', flexShrink: 0 }}>
                                            Percentage:
                                          </Typography>
                                          <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#ffffff', fontFamily: '"Montserrat", sans-serif' }}>
                                            {slice.percentage.toFixed(1)}%
                                          </Typography>
                                        </Box>
                                        <Box 
                                          sx={{ 
                                            mt: 1.5, 
                                            pt: 1.5, 
                                            borderTop: '1px solid rgba(255,255,255,0.2)',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            gap: 3,
                                          }}
                                        >
                                          <Typography sx={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontFamily: '"Inter", sans-serif', flexShrink: 0 }}>
                                            of Total:
                                          </Typography>
                                          <Typography sx={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.9)', fontFamily: '"Inter", sans-serif' }}>
                                            {total.toLocaleString()}
                                          </Typography>
                                        </Box>
                                      </Box>
                                    }
                                    arrow
                                    placement="top"
                                    componentsProps={{
                                      tooltip: {
                                        sx: {
                                          bgcolor: 'rgba(31, 41, 55, 0.95)',
                                          backdropFilter: 'blur(8px)',
                                          borderRadius: '12px',
                                          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                          maxWidth: 320,
                                          '& .MuiTooltip-arrow': {
                                            color: 'rgba(31, 41, 55, 0.95)',
                                          },
                                        },
                                      },
                                    }}
                                  >
                                    <path
                                      className="pie-slice"
                                      d={getSlicePath(slice.startAngle, slice.endAngle, 120, 150, 150)}
                                      fill={slice.color}
                                      stroke="#ffffff"
                                      strokeWidth="3"
                                    />
                                  </Tooltip>
                                ))}
                                {/* Center circle for donut effect */}
                                <circle cx="150" cy="150" r="60" fill="#ffffff" />
                                <text
                                  x="150"
                                  y="140"
                                  textAnchor="middle"
                                  style={{
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    fill: '#6b7280',
                                    fontFamily: 'Inter, sans-serif',
                                  }}
                                >
                                  Total
                                </text>
                                <text
                                  x="150"
                                  y="168"
                                  textAnchor="middle"
                                  style={{
                                    fontSize: '24px',
                                    fontWeight: 700,
                                    fill: '#1f2937',
                                    fontFamily: 'Montserrat, sans-serif',
                                  }}
                                >
                                  {total.toLocaleString()}
                                </text>
                              </svg>
                            </Box>
                            {/* Legend - Full width below chart */}
                            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                              {slices.map((slice, index) => (
                                <Box
                                  key={index}
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    p: 1.5,
                                    borderRadius: '10px',
                                    backgroundColor: '#f9fafb',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                      backgroundColor: '#f3f4f6',
                                      transform: 'translateX(4px)',
                                    },
                                  }}
                                >
                                  <Box
                                    sx={{
                                      width: 18,
                                      height: 18,
                                      borderRadius: '6px',
                                      backgroundColor: slice.color,
                                      flexShrink: 0,
                                      boxShadow: `0 2px 4px ${slice.color}40`,
                                    }}
                                  />
                                  <Typography
                                    sx={{
                                      fontSize: '15px',
                                      color: '#374151',
                                      fontFamily: '"Inter", sans-serif',
                                      flex: 1,
                                      fontWeight: 500,
                                    }}
                                  >
                                    {slice.label}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      fontSize: '15px',
                                      fontWeight: 700,
                                      color: '#1f2937',
                                      fontFamily: '"Montserrat", sans-serif',
                                    }}
                                  >
                                    {slice.percentage.toFixed(1)}%
                                  </Typography>
                                </Box>
                              ))}
                            </Box>
                          </Box>
                        </Box>
                      );
                    };

                    // Bar Chart Component - Enhanced with larger fonts
                    const renderBarChart = (
                      title: string,
                      data: { [key: string]: number },
                      colorScheme: string[]
                    ) => {
                      const entries = Object.entries(data).filter(([, value]) => value > 0);
                      const total = entries.reduce((sum, [, value]) => sum + value, 0);
                      const maxValue = Math.max(...entries.map(([, value]) => value));

                      return (
                        <Box
                          sx={{
                            p: 4,
                            borderRadius: '20px',
                            backgroundColor: '#ffffff',
                            border: '1px solid #e5e7eb',
                            boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.12)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              boxShadow: '0 12px 32px -4px rgba(0, 0, 0, 0.18)',
                            },
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: '22px',
                              fontWeight: 700,
                              color: '#1f2937',
                              fontFamily: '"Montserrat", sans-serif',
                              mb: 1,
                            }}
                          >
                            {title}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: '16px',
                              color: '#6b7280',
                              fontFamily: '"Inter", sans-serif',
                              mb: 4,
                            }}
                          >
                            Total: {total.toLocaleString()} people
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {entries.map(([label, value], index) => {
                              const percentage = ((value / total) * 100).toFixed(1);
                              const barWidth = (value / maxValue) * 100;
                              const color = colorScheme[index % colorScheme.length];

                              return (
                                <Box 
                                  key={label}
                                  sx={{
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                      transform: 'translateX(4px)',
                                    },
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      mb: 1,
                                    }}
                                  >
                                    <Typography
                                      sx={{
                                        fontSize: '16px',
                                        fontWeight: 500,
                                        color: '#374151',
                                        fontFamily: '"Inter", sans-serif',
                                        maxWidth: '55%',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                      }}
                                      title={label}
                                    >
                                      {label}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                      <Typography
                                        sx={{
                                          fontSize: '16px',
                                          fontWeight: 700,
                                          color: '#1f2937',
                                          fontFamily: '"Montserrat", sans-serif',
                                        }}
                                      >
                                        {value.toLocaleString()}
                                      </Typography>
                                      <Box
                                        sx={{
                                          backgroundColor: `${color}20`,
                                          px: 1.5,
                                          py: 0.5,
                                          borderRadius: '8px',
                                          minWidth: '60px',
                                          textAlign: 'center',
                                        }}
                                      >
                                        <Typography
                                          sx={{
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            color: color,
                                            fontFamily: '"Inter", sans-serif',
                                          }}
                                        >
                                          {percentage}%
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </Box>
                                  <Box
                                    sx={{
                                      width: '100%',
                                      height: '16px',
                                      backgroundColor: '#f3f4f6',
                                      borderRadius: '8px',
                                      overflow: 'hidden',
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        width: `${barWidth}%`,
                                        height: '100%',
                                        background: `linear-gradient(90deg, ${color} 0%, ${color}cc 100%)`,
                                        borderRadius: '8px',
                                        transition: 'width 0.6s ease-out',
                                      }}
                                    />
                                  </Box>
                                </Box>
                              );
                            })}
                          </Box>
                        </Box>
                      );
                    };

                    // Color schemes for different categories
                    const healthColors = ['#10b981', '#34d399', '#6ee7b7', '#fbbf24', '#ef4444'];
                    const qualificationColors = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#7c3aed', '#6d28d9', '#5b21b6', '#4c1d95'];
                    const economicColors = ['#3b82f6', '#60a5fa', '#93c5fd', '#f59e0b', '#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#6b7280'];
                    const industryColors = ['#0ea5e9', '#06b6d4', '#14b8a6', '#10b981', '#22c55e', '#84cc16', '#eab308', '#f59e0b', '#f97316', '#ef4444', '#ec4899', '#d946ef', '#a855f7', '#8b5cf6', '#6366f1', '#3b82f6', '#0284c7', '#0891b2'];
                    const housingColors = ['#f59e0b', '#fbbf24', '#fcd34d', '#d97706', '#b45309', '#92400e', '#78350f', '#451a03'];
                    const tenureColors = ['#10b981', '#34d399', '#6ee7b7', '#3b82f6', '#60a5fa', '#f59e0b', '#fbbf24', '#6b7280'];
                    const socialColors = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'];
                    const relationshipColors = ['#ec4899', '#f472b6', '#f9a8d4', '#fbcfe8', '#be185d', '#9d174d', '#831843', '#500724', '#fce7f3'];
                    const occupancyColors = ['#0ea5e9', '#06b6d4', '#14b8a6', '#10b981', '#22c55e', '#84cc16', '#eab308', '#f59e0b'];

                    return (
                      <>
                        {/* Row 1: Health (Pie) and Social Grade (Pie) */}
                        <Box
                          sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
                            gap: 3,
                          }}
                        >
                          {renderPieChart('Health Status', demographicsData.data.health, healthColors)}
                          {renderPieChart('Social Grade', demographicsData.data.social_grade, socialColors)}
                        </Box>

                        {/* Row 2: Qualifications (Bar) */}
                        {renderBarChart('Qualifications', demographicsData.data.qualifications, qualificationColors)}

                        {/* Row 3: Economic Activity (Bar) */}
                        {renderBarChart('Economic Activity', demographicsData.data.economic_activity, economicColors)}

                        {/* Row 4: Housing Types (Pie) and Housing Tenure (Pie) */}
                        <Box
                          sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
                            gap: 3,
                          }}
                        >
                          {renderPieChart('Housing Types', demographicsData.data.housing_types, housingColors)}
                          {renderPieChart('Housing Tenure', demographicsData.data.housing_tenure, tenureColors)}
                        </Box>

                        {/* Row 5: Industry Sectors (Bar) */}
                        {renderBarChart('Industry Sectors', demographicsData.data.industry, industryColors)}

                        {/* Row 6: Relationships (Pie) and Occupancy (Pie) */}
                        <Box
                          sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
                            gap: 3,
                          }}
                        >
                          {renderPieChart('Relationship Status', demographicsData.data.relationships, relationshipColors)}
                          {renderPieChart('Housing Occupancy', demographicsData.data.housing_occupancy, occupancyColors)}
                        </Box>
                      </>
                    );
                  })()}
                </Box>
              )}

              {!demographicsData && (
                <Alert severity="info">
                  Demographics data is not available for this location.
                </Alert>
              )}
            </Box>
          </ContentSection>
        );

      case 'About us':
        return (
          <ContentSection
            sx={{
              // minHeight: { xs: 'auto', md: '100vh' },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: { xs: 'flex-start', md: 'center' },
              position: 'relative',
              zIndex: 10,
              backgroundColor: '#ffffff',
              '@media print': {
                minHeight: 'auto',
                display: 'block',
                justifyContent: 'flex-start',
                pageBreakBefore: 'auto',
                position: 'relative',
                zIndex: 10,
                overflow: 'visible',
              },
            }}
          >
            <Box sx={{ mx: 'auto', position: 'relative', zIndex: 2 }}>
              {/* Primary About block */}
              <Box sx={{ mb: 6 }}>
                <SectionTitle
                  sx={{
                    position: 'relative',
                    paddingLeft: 3,
                    mb: 4,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '6px',
                      backgroundColor: '#f2c514',
                      borderRadius: '10px',
                    },
                  }}
                >
                  About us
                </SectionTitle>
                
                {/* Hero Card with Company Name */}
                <Box
                  sx={{
                    p: 4,
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(242, 197, 20, 0.1) 0%, rgba(251, 191, 36, 0.05) 100%)',
                    border: '2px solid #f2c514',
                    mb: 4,
                    boxShadow: '0 4px 16px rgba(242, 197, 20, 0.15)',
                    '@media print': {
                      pageBreakInside: 'avoid',
                      breakInside: 'avoid',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #f2c514 0%, #fbbf24 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(242, 197, 20, 0.3)',
                      }}
                    >
                      <Typography sx={{ fontSize: '24px' }}>🏢</Typography>
                    </Box>
                <Typography
                      variant="h4"
                  sx={{
                        fontSize: '28px',
                        fontWeight: 700,
                        color: '#d4a911',
                        fontFamily: '"Poppins", "Montserrat", sans-serif',
                        letterSpacing: '-0.02em',
                  }}
                >
                  CommercialUK Ltd
                </Typography>
                  </Box>
                <Typography
                  variant="body1"
                  sx={{
                      fontSize: '17px',
                      color: '#4b5563',
                    fontWeight: 400,
                      lineHeight: 1.9,
                      fontFamily: '"Inter", sans-serif',
                  }}
                >
                  At CommercialUK, we believe great property experiences go far beyond listings. Our team is dedicated to
                  providing clear, informed guidance, responsive support, and a seamless digital journey for every client
                  – whether you are a landlord, investor, developer, or business owner searching for the right space.
                  We combine local market expertise with technology to create a smooth, trustworthy process from first
                  enquiry through to completion.
                </Typography>
                </Box>
              </Box>

              {/* Secondary story / mission block */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      backgroundColor: '#f2c514',
                      borderRadius: '50%',
                    }}
                  />
                <Typography
                    variant="h5"
                  sx={{
                      fontSize: '22px',
                      fontWeight: 700,
                      color: '#111827',
                      fontFamily: '"Poppins", "Montserrat", sans-serif',
                  }}
                >
                  A little bit about CommercialUK
                </Typography>
                </Box>
                
                {/* Mission Cards */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box
                    sx={{
                      p: 4,
                      borderRadius: '16px',
                      backgroundColor: '#ffffff',
                      border: '2px solid #e5e7eb',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: '#f2c514',
                        transform: 'translateX(4px)',
                        boxShadow: '0 8px 20px rgba(242, 197, 20, 0.2)',
                      },
                      '@media print': {
                        pageBreakInside: 'avoid',
                        breakInside: 'avoid',
                        transform: 'none',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '10px',
                          backgroundColor: 'rgba(242, 197, 20, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          mt: 0.5,
                        }}
                      >
                        <Typography sx={{ fontSize: '20px' }}>🎯</Typography>
                      </Box>
                <Typography
                  variant="body1"
                  sx={{
                          fontSize: '17px',
                          color: '#4b5563',
                    fontWeight: 400,
                          lineHeight: 1.9,
                          fontFamily: '"Inter", sans-serif',
                  }}
                >
                  Our platform is built specifically for the UK commercial property market, bringing together offices,
                  retail, industrial, leisure, and mixed‑use opportunities in one place. By partnering with experienced
                  agents and owners, we ensure every listing is accurate, well‑presented, and supported by the right
                  documentation so that buyers and tenants can act with confidence.
                </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      p: 4,
                      borderRadius: '16px',
                      backgroundColor: '#ffffff',
                      border: '2px solid #e5e7eb',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: '#f2c514',
                        transform: 'translateX(4px)',
                        boxShadow: '0 8px 20px rgba(242, 197, 20, 0.2)',
                      },
                      '@media print': {
                        pageBreakInside: 'avoid',
                        breakInside: 'avoid',
                        transform: 'none',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '10px',
                          backgroundColor: 'rgba(242, 197, 20, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          mt: 0.5,
                        }}
                      >
                        <Typography sx={{ fontSize: '20px' }}>🚀</Typography>
                      </Box>
                <Typography
                  variant="body1"
                  sx={{
                          fontSize: '17px',
                          color: '#4b5563',
                    fontWeight: 400,
                          lineHeight: 1.9,
                          fontFamily: '"Inter", sans-serif',
                  }}
                >
                  From detailed digital brochures and reporting to tools that help you understand pricing, demand, and
                  local demographics, CommercialUK is designed to simplify complex decisions. Our mission is to make
                  commercial real estate more accessible, transparent, and efficient – so you can focus on what matters
                  most: growing your business and maximising the value of your property.
                </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </ContentSection>
        );

      case 'Data Sources':
          return (
            <ContentSection
              sx={{
                position: 'relative',
                zIndex: 10,
                backgroundColor: '#ffffff',
                '@media print': {
                  pageBreakBefore: 'auto',
                  position: 'relative',
                  zIndex: 10,
                  overflow: 'visible',
                },
              }}
            >
              <SectionTitle
                sx={{
                  position: 'relative',
                  paddingLeft: 3,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '6px',
                    backgroundColor: '#f2c514',
                    borderRadius: '10px',
                  },
                }}
              >
                Data sources
              </SectionTitle>
              
              {/* Introduction Card */}
              <Box
                sx={{
                  p: 4,
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #fffbf0 0%, #fef3c7 100%)',
                  border: '2px solid #f2c514',
                  mb: 5,
                  boxShadow: '0 4px 16px rgba(242, 197, 20, 0.15)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #f2c514 0%, #fbbf24 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(242, 197, 20, 0.3)',
                      flexShrink: 0,
                      mt: 0.5,
                    }}
                  >
                    <Typography sx={{ fontSize: '24px' }}>📊</Typography>
                  </Box>
              <Typography
                variant="body1"
                sx={{
                      fontSize: '17px',
                      color: '#78350f',
                  fontWeight: 400,
                      lineHeight: 1.9,
                      fontFamily: '"Inter", sans-serif',
                }}
              >
                We believe in making property information more freely available to the buyers, sellers, landlords and tenants we 
                work closely with. That is why we aggregate data from a variety of different public and licenced sources to include 
                in guides such as this one. Please find a list of our data partners below.
              </Typography>
                </Box>
              </Box>
  
              {/* Section Header for Partners */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    backgroundColor: '#f2c514',
                    borderRadius: '50%',
                  }}
                />
                <Typography
                  sx={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#111827',
                    fontFamily: '"Poppins", "Montserrat", sans-serif',
                  }}
                >
                  Our Data Partners
                </Typography>
              </Box>
  
              {/* Logo Grid */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                  gap: { xs: 4, md: 5 },
                  mb: 8,
                  '@media print': {
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: 3,
                    pageBreakInside: 'avoid',
                  },
                }}
              >
                {/* GOV.UK Logo */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: { xs: 120, md: 140 },
                    p: 3,
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    border: '2px solid #e5e7eb',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 12px 28px rgba(242, 197, 20, 0.25)',
                      borderColor: '#f2c514',
                    },
                  }}
                >
                  <Box
                    component="img"
                    src="https://www.publictechnology.net/wp-content/uploads/2025/06/GOV.UK_updated_brand_logo_lock_up.jpg"
                    alt="GOV.UK"
                    sx={{
                      maxWidth: '90%',
                      maxHeight: '90%',
                      objectFit: 'contain',
                    }}
                  />
                </Box>
  
                {/* Google Maps Logo */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: { xs: 120, md: 140 },
                    p: 3,
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    border: '2px solid #e5e7eb',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 12px 28px rgba(242, 197, 20, 0.25)',
                      borderColor: '#f2c514',
                    },
                  }}
                >
                  <Box
                    component="img"
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Google_Maps_Logo_2020.svg/1137px-Google_Maps_Logo_2020.svg.png"
                    alt="Google Maps"
                    sx={{
                      maxWidth: '90%',
                      maxHeight: '90%',
                      objectFit: 'contain',
                    }}
                  />
                </Box>
  
                {/* getAddress.io Logo */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: { xs: 120, md: 140 },
                    p: 3,
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    border: '2px solid #e5e7eb',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 12px 28px rgba(242, 197, 20, 0.25)',
                      borderColor: '#f2c514',
                    },
                  }}
                >
                  <Box
                    component="img"
                    src="https://avatars.githubusercontent.com/u/8994465?s=280&v=4"
                    alt="getAddress.io"
                    sx={{
                      maxWidth: '90%',
                      maxHeight: '90%',
                      objectFit: 'contain',
                    }}
                  />
                </Box>
  
                {/* ChatGPT Logo */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: { xs: 120, md: 140 },
                    p: 3,
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    border: '2px solid #e5e7eb',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 12px 28px rgba(242, 197, 20, 0.25)',
                      borderColor: '#f2c514',
                    },
                  }}
                >
                  <Box
                    component="img"
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/ChatGPT-Logo.svg/1024px-ChatGPT-Logo.svg.png"
                    alt="ChatGPT"
                    sx={{
                      maxWidth: '90%',
                      maxHeight: '90%',
                      objectFit: 'contain',
                    }}
                  />
                </Box>
              </Box>
  
              {/* Disclaimer Section */}
              <Box sx={{ mt: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      backgroundColor: '#f2c514',
                      borderRadius: '50%',
                    }}
                  />
                <Typography
                  sx={{
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#111827',
                      fontFamily: '"Poppins", "Montserrat", sans-serif',
                    }}
                  >
                    Legal Disclaimer
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 4,
                    borderRadius: '16px',
                    backgroundColor: '#f9fafb',
                    border: '2px solid #e5e7eb',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    '@media print': {
                      pageBreakInside: 'avoid',
                      breakInside: 'avoid',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {/* <Box
                      sx={{
                        width: 6,
                        backgroundColor: '#f2c514',
                        borderRadius: '3px',
                        flexShrink: 0,
                      }}
                    /> */}
                    <Typography
                      sx={{
                        fontSize: '14px',
                    color: '#6b7280',
                        lineHeight: 1.9,
                        fontFamily: '"Inter", sans-serif',
                  }}
                >
                      <Box component="strong" sx={{ color: '#111827', fontWeight: 700 }}>Disclaimer:</Box> Whilst all reasonable effort is made to ensure the information in this publication is current, CommercialUK does not warrant the accuracy or completeness 
                  (including reliability, currency or suitability) of the data and information contained in this report and accepts no liability (including without limitation, liability in negligence) 
                  for any loss or damage or costs (including consequential damage) arising in connection with the data and information contained in this report.
                </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {/* <Box
                      sx={{
                        width: 6,
                        backgroundColor: '#f2c514',
                        borderRadius: '3px',
                        flexShrink: 0,
                      }}
                    /> */}
                <Typography
                  sx={{
                        fontSize: '14px',
                    color: '#6b7280',
                        lineHeight: 1.9,
                        fontFamily: '"Inter", sans-serif',
                  }}
                >
                  The estimate of current value potentially contained in the report may have been manually provided by the Agent; or may be based on a proprietary automated valuation 
                  estimate provided by CommercialUK (the CommercialUK Estimate™). Any estimated values are current at the date of the publication only. It is computer generated and is not a 
                  professional appraisal of the subject property and should not be relied upon in lieu of appropriate professional advice.
                </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {/* <Box
                      sx={{
                        width: 6,
                        backgroundColor: '#f2c514',
                        borderRadius: '3px',
                        flexShrink: 0,
                      }}
                    /> */}
                <Typography
                  sx={{
                        fontSize: '14px',
                    color: '#6b7280',
                        lineHeight: 1.9,
                        fontFamily: '"Inter", sans-serif',
                  }}
                >
                  The accuracy of the methodology used to develop the CommercialUK Estimate™, the existence of the subject property, and the accuracy of the CommercialUK Estimate™ and 
                  all rule sets provided are estimates based on available data and are not guaranteed or warranted. CommercialUK excludes all liability for any loss or damage arising in 
                  connection with the CommercialUK Estimate™.
                </Typography>
                  </Box>
                </Box>
              </Box>
            </ContentSection>
          );

      default:
        return (
          <ContentSection>
            <SectionTitle>{sectionName}</SectionTitle>
            <Typography sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}>Content for {sectionName} section</Typography>
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
              fontWeight: 100, 
              color: '#111827', 
              fontFamily: '"Inter", "Helvetica Neue", sans-serif',
              fontSize: { xs: '20px', sm: '23px', md: '25px' },
              wordBreak: 'break-word',
              display: 'block',
              letterSpacing: '-0.02em',
              lineHeight: 1.5,
              textTransform: 'capitalize',
            }}
          >
            {report.location.address}
          </Typography>
        </AddressSection>
        <ActionButtonsGroup>
          <ActionButton
          variant="outlined"
            className="share-button"
            startIcon={<ShareIcon sx={{ fontSize: 18 }} />}
          onClick={handleShare}
        >
          Share
          </ActionButton>
          <ActionButton
            variant="contained"
            className="download-button"
            startIcon={<DownloadIcon sx={{ fontSize: 18 }} />}
            onClick={handleDownload}
          >
            Download
          </ActionButton>
        </ActionButtonsGroup>
      </Header>

      {/* Content Wrapper */}
      <ContentWrapper>
        {/* Sidebar */}
        <Sidebar>
          {/* <SidebarHeader>
            <SidebarTitle>Property Report</SidebarTitle>
          </SidebarHeader> */}
          <SidebarList>
            {navigationItems.map((item) => (
              <SidebarItem
                key={item}
                className={activeSection === item ? 'active' : ''}
              >
                <SidebarButton onClick={() => scrollToSection(item)}>
                  <SidebarIcon className="sidebar-icon">
                    {navigationIcons[item]}
                  </SidebarIcon>
                  <SidebarText primary={item} />
                </SidebarButton>
              </SidebarItem>
            ))}
          </SidebarList>
        </Sidebar>

        {/* Main Content */}
        <MainContent>
          {navigationItems.map((section) => (
            <Box
              key={section}
              ref={(el: HTMLDivElement | null) => {
                if (el) {
                  sectionRefs.current.set(section, el);
                } else {
                  sectionRefs.current.delete(section);
                }
              }}
              data-section={section}
              sx={{
                position: 'relative',
                clear: 'both',
                '@media print': {
                  display: section === 'Mortgage Calculator' ? 'none !important' : 'block !important',
                  visibility: section === 'Mortgage Calculator' ? 'hidden !important' : 'visible !important',
                  pageBreakInside: 'auto',
                  breakInside: 'auto',
                  pageBreakBefore: section === 'Cover' ? 'auto' : 'auto',
                  pageBreakAfter: 'auto',
                  marginBottom: '0',
                  paddingBottom: '20px',
                  opacity: 1,
                  position: 'relative',
                  clear: 'both',
                  overflow: 'visible',
                },
              }}
            >
              {renderSectionContent(section)}
            </Box>
          ))}
        </MainContent>
      </ContentWrapper>
    </PageContainer>
  );
};

export default ReportDetailedPage;

