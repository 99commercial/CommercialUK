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
  InputBase,
  Slider,
  Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { enqueueSnackbar } from 'notistack';
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import DescriptionIcon from '@mui/icons-material/Description';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import ArticleIcon from '@mui/icons-material/Article';
import CalculateIcon from '@mui/icons-material/Calculate';
import PeopleIcon from '@mui/icons-material/People';
import PsychologyIcon from '@mui/icons-material/Psychology';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import InfoIcon from '@mui/icons-material/Info';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import BoltIcon from '@mui/icons-material/Bolt';
import CheckIcon from '@mui/icons-material/Check';
import axiosInstance from '../../utils/axios';

// Two-font system: titles = Plus Jakarta Sans, text = Inter (straight, modern)
const FONT_TITLE = '"Plus Jakarta Sans", sans-serif';
const FONT_TEXT = '"Inter", sans-serif';

// ----------------------------------------------------------------------

const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: '#ffffff',
  display: 'flex',
  flexDirection: 'column',
  fontFamily: FONT_TEXT,
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
  fontFamily: FONT_TEXT,
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
  fontSize: '16px',
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
  fontSize: '16px',
  fontFamily: FONT_TEXT,
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
  minWidth: 360,
  backgroundColor: '#ffffff',
  border: '2px solid #0a0a0a',
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
  boxShadow: 'none',
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
    top: '195px',
    left: 0,
    right: 0,
    width: '100%',
    height: 'auto',
    minHeight: '77px',
    maxHeight: '77px',
    border: '2px solid #0a0a0a',
    borderTop: 'none',
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
    top: '205px',
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
  fontSize: '22px',
  fontWeight: 800,
  color: '#000000',
  textAlign: 'center',
  fontFamily: FONT_TITLE,
  letterSpacing: '0.02em',
  textTransform: 'uppercase',
  lineHeight: 1.3,
  position: 'relative',
  zIndex: 1,
  [theme.breakpoints.down('md')]: {
    fontSize: '19px',
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
    fontSize: '16px',
    color: '#374151',
    fontWeight: 500,
    fontFamily: FONT_TEXT,
    letterSpacing: '0.01em',
    transition: 'all 0.3s ease',
    lineHeight: 1.45,
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
  letterSpacing: '0.08em',
  marginBottom: theme.spacing(1),
  fontFamily: FONT_TEXT,
  fontWeight: 600,
}));

const PreparedByName = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  fontWeight: 700,
  color: '#000000',
  marginBottom: theme.spacing(2),
  fontFamily: FONT_TITLE,
}));

const ContactLink = styled(Box)(({ theme }) => ({
  fontSize: '16px',
  color: '#000000',
  cursor: 'pointer',
  marginBottom: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  fontFamily: FONT_TEXT,
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
    marginTop: '115px', // Space for fixed sidebar and progress
  },
  [theme.breakpoints.down('sm')]: {
    marginTop: '135px', // Extra space for sidebar on smaller screens
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
  fontWeight: 600,
  fontFamily: FONT_TEXT,
}));

const ContactInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  fontSize: '16px',
  color: '#6b7280',
  textAlign: 'right',
  fontFamily: FONT_TEXT,
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
  fontWeight: 800,
  color: '#000000',
  marginBottom: theme.spacing(3),
  fontFamily: FONT_TITLE,
  letterSpacing: '-0.02em',
  '@media print': {
    pageBreakAfter: 'avoid',
    breakAfter: 'avoid',
    fontSize: '26px',
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
  fontFamily: FONT_TEXT,
  flex: '0 0 40%',
}));

const InfoValue = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  color: '#000000',
  fontWeight: 500,
  fontFamily: FONT_TEXT,
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
  fontSize: '16px',
  color: '#6b7280',
  fontWeight: 600,
  fontFamily: FONT_TEXT,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  flex: '0 0 40%',
}));

const HeaderValue = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  color: '#6b7280',
  fontWeight: 600,
  fontFamily: FONT_TEXT,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
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
  fontSize: '16px',
  color: '#6b7280',
  fontFamily: FONT_TEXT,
  marginTop: theme.spacing(0.5),
  textAlign: 'center',
}));

const SliderContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 0),
}));

// Navigation items
const navigationItems = [
  'Cover',
  'Price Analysis',
  'Property Details',
  'EPC',
  'Accommodation (historic data)',
  'Mortgage Calculator',
  'Demographics Findings',
  'Psychographics Analysis',
  'Area Details',
  'About us',
  'Data Sources',
];

// Icon mapping for navigation items
const navigationIcons: Record<string, React.ReactNode> = {
  'Cover': <ArticleIcon sx={{ fontSize: 22 }} />,
  'Property Details': <HomeIcon sx={{ fontSize: 22 }} />,
  'EPC': <BoltIcon sx={{ fontSize: 22 }} />,
  'Accommodation (historic data)': <DescriptionIcon sx={{ fontSize: 22 }} />,
  'Mortgage Calculator': <CalculateIcon sx={{ fontSize: 22 }} />,
  'Demographics Findings': <PeopleIcon sx={{ fontSize: 22 }} />,
  'Psychographics Analysis': <PsychologyIcon sx={{ fontSize: 22 }} />,
  'Price Analysis': <ShowChartIcon sx={{ fontSize: 22 }} />,
  'Area Details': <LocationCityIcon sx={{ fontSize: 22 }} />,
  'About us': <InfoIcon sx={{ fontSize: 22 }} />,
  'Data Sources': <DataUsageIcon sx={{ fontSize: 22 }} />,
};

// ----------------------------------------------------------------------

interface ReportData {
  _id: string;
  id?: string;
  createdAt?: string;
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
    switch (sectionName) {
      case 'Cover':
        const reportDate = report?.createdAt
          ? new Date(report.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
          : new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
        const reportRef = report?.id || report?._id || (typeof id === 'string' ? id : '');
        const refDisplay = reportRef
          ? `REF: PVR-${new Date(report?.createdAt || Date.now()).getFullYear()}-${String(new Date(report?.createdAt || Date.now()).getMonth() + 1).padStart(2, '0')}${String(new Date(report?.createdAt || Date.now()).getDate()).padStart(2, '0')}`
          : 'REF: PVR';
        return (
          <Box sx={{ background: '#f7f6f2', minHeight: '100vh' }}>
            {/* Top stripe */}
            <Box sx={{ background: '#0a0a0a', height: 6, width: '100%' }} />
            {/* Header — black */}
            <Box
              sx={{
                background: '#0a0a0a',
                padding: { xs: '32px 24px 28px', md: '48px 64px 40px' },
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                gap: 2,
                flexWrap: 'wrap',
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Box
                  sx={{
                    fontFamily: FONT_TEXT,
                    fontSize: 14,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: '#f2c514',
                    mb: 1.75,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.25,
                  }}
                >
                  <Box sx={{ width: 28, height: 2, background: '#f2c514' }} />
                  Confidential Document
                </Box>
                <Typography
                  component="h1"
                  sx={{
                    fontFamily: FONT_TITLE,
                    fontSize: { xs: 'clamp(34px, 5.5vw, 44px)', md: 'clamp(38px, 5vw, 56px)' },
                    fontWeight: 800,
                    color: '#ffffff',
                    lineHeight: 1.08,
                    letterSpacing: '-0.02em',
                  }}
                >
                  Property
                  <br />
                  Valuation <Box component="span" sx={{ color: '#f2c514' }}>Report</Box>
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                <Typography
                  sx={{
                    fontFamily: FONT_TEXT,
                    fontSize: 14,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#ffffff',
                  }}
                >
                  {reportDate}
                </Typography>
                {/* <Box
                  sx={{
                    fontFamily: FONT_TEXT,
                    fontSize: 13,
                    color: '#ffffff',
                    background: 'rgba(255,255,255,0.08)',
                    padding: '6px 14px',
                    border: '1px solid rgba(255,255,255,0.12)',
                  }}
                >
                  {refDisplay}
                </Box> */}
              </Box>

              {/* Postcode + location inside the same black header card */}
              <Box
                sx={{
                  width: '100%',
                  mt: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: "start",
                  gap: 2,
                  flexWrap: 'wrap',
                }}
              >
                <Typography
                  component="span"
                  sx={{
                    fontFamily: FONT_TEXT,
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#ffffff',
                    opacity: 0.9,
                    textAlign: { xs: 'left', md: 'right' },
                  }}
                >
                  {report.location?.address || ''}
                </Typography>
              </Box>
            </Box>
            {/* Main content */}
            <ContentSection sx={{ padding: { xs: 3, md: '56px 64px' }, maxWidth: 1200, margin: '0 auto' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {/* Location Overview label */}
                <SectionTitle
                  sx={{
                    position: 'relative',
                    paddingLeft: 3,
                    marginTop: 1,
                    marginBottom: 2,
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
                  Location Overview
                </SectionTitle>
                {/* Map frame */}
                <Box
                  sx={{
                    position: 'relative',
                    border: '3px solid #0a0a0a',
                    overflow: 'hidden',
                    background: '#d4cfc5',
                    height: { xs: 280, sm: 360 },
                    mb: { xs: 4, md: 6.5 },
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
                        display: 'block',
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
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #c8c3b5 0%, #b8b2a5 40%, #a8a298 100%)',
                      }}
                    >
                      <Typography sx={{ color: '#666', fontFamily: FONT_TEXT }}>
                        Map not available
                      </Typography>
                    </Box>
                  )}
                  {/* <Box
                    sx={{
                      position: 'absolute',
                      top: 20,
                      left: 20,
                      background: '#0a0a0a',
                      color: '#f2c514',
                      fontFamily: FONT_TEXT,
                      fontSize: 14,
                      letterSpacing: '0.12em',
                      padding: '8px 14px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {report.location?.postcode || '—'} · {report.location?.address?.split(',')[0] || 'UK'}
                  </Box> */}
                </Box>
                {/* Stats grid — 3 cards */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                    border: '3px solid #0a0a0a',
                    mb: { xs: 4, md: 6.5 },
                  }}
                >
                  {[
                    {
                      icon: <HomeIcon sx={{ width: 18, height: 18, color: '#0a0a0a' }} />,
                      label: 'Property Type',
                      value: report.location?.propertyType || 'N/A',
                    },
                    {
                      icon: <SquareFootIcon sx={{ width: 18, height: 18, color: '#0a0a0a' }} />,
                      label: 'Area Size',
                      value:
                        report.location?.input?.minimum != null && report.location?.input?.maximum != null
                          ? `${report.location.input.minimum}–${report.location.input.maximum} sqft`
                          : 'N/A',
                    },
                    {
                      icon: <DescriptionIcon sx={{ width: 18, height: 18, color: '#0a0a0a' }} />,
                      label: 'Valuation Type',
                      value: report.location?.valuationType || 'N/A',
                    },
                  ].map((stat, index) => (
                    <Box
                      key={stat.label}
                      sx={(theme) => ({
                        p: theme.spacing(3, 3.5, 3.5),
                        borderRight: { xs: 'none', sm: index < 2 ? '2px solid #0a0a0a' : 'none' },
                        borderBottom: { xs: '2px solid #0a0a0a', sm: 'none' },
                        background: '#ffffff',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'background 0.2s',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: 4,
                          background: '#f2c514',
                          transform: 'scaleX(0)',
                          transformOrigin: 'left',
                          transition: 'transform 0.3s ease',
                        },
                        '&:hover': { background: '#fafaf7', '&::before': { transform: 'scaleX(1)' } },
                        '&:last-of-type': { borderRight: 'none', borderBottom: 'none' },
                      })}
                    >
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          background: '#f2c514',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2.25,
                        }}
                      >
                        {stat.icon}
                      </Box>
                      <Typography
                        sx={{
                          fontFamily: FONT_TEXT,
                          fontSize: 9,
                          letterSpacing: '0.2em',
                          textTransform: 'uppercase',
                          color: '#888',
                          mb: 1.25,
                        }}
                      >
                        {stat.label}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: FONT_TITLE,
                          fontSize: 26,
                          fontWeight: 700,
                          color: '#0a0a0a',
                          lineHeight: 1.1,
                        }}
                      >
                        {stat.value}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                {/* Summary — notes block */}
                {report.aiAnalysis?.summary && (
                  <Box
                    sx={{
                      background: '#ffffff',
                      border: '2px solid #0a0a0a',
                      borderLeft: '6px solid #f2c514',
                      padding: '28px 32px',
                      mb: 0,
                    }}
                  >
                    <Typography
                      component="h3"
                      sx={{
                        fontFamily: FONT_TITLE,
                        fontSize: 20,
                        fontWeight: 700,
                        mb: 1.75,
                      }}
                    >
                      Property Summary
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 16,
                        lineHeight: 1.75,
                        color: '#333',
                        fontWeight: 500,
                        fontFamily: FONT_TEXT,
                      }}
                    >
                      {report.aiAnalysis.summary
                        ? (() => {
                            const text = report.aiAnalysis.summary.slice(2);
                            return text.charAt(0).toUpperCase() + text.slice(1);
                          })()
                        : ''}
                    </Typography>
                  </Box>
                )}
              </Box>
            </ContentSection>
          </Box>
        );

      case 'Price Analysis': {
          const valuationType = report.location.valuationType?.toLowerCase() || '';
          const showLetting = valuationType.includes('letting');
          const showSales = valuationType.includes('sales');
          const showBoth = showLetting && showSales;
          const conversionFactor = unitSelection === 'sqm' ? 10.764 : 1;
          const unitDisplay = unitSelection === 'sqm' ? 'm²' : 'sqft';
          const pred = report.predictedPrice;
          const effectiveArea = pred?.effectiveAreaSqft || 0;
  
          const randomYield = (min: number, max: number) => Math.round((Math.random() * (max - min) + min) * 100) / 100;
          const annualPA = pred?.pricingPA || 0;
          const highestYield = randomYield(3, 4.5);
          const averageYield = randomYield(4.5, 5.5);
          const lowestYield = randomYield(5.5, 7);
          const priceCards = [
            { label: 'Lowest Price', mult: 100 / lowestYield },
            { label: 'Average Price', mult: 100 / averageYield, featured: true },
            { label: 'Highest Price', mult: 100 / highestYield },
          ];
  
          const calendarSvg = (w: number, h: number) => (
            <svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          );
          const chartDownSvg = (w: number, h: number) => (
            <svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
          );
          const chartAvgSvg = (w: number, h: number) => (
            <svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <text
                x="12"
                y="15"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="24"
                fontFamily="Arial, sans-serif"
                fill="currentColor"
              >
                £
              </text>
            </svg>
          );
          const chartUpSvg = (w: number, h: number) => (
            <svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
              <polyline points="17 18 23 18 23 12" />
            </svg>
          );
          const alertSvg = () => (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          );
  
          return (
            <ContentSection sx={{ pt: 5, pb: 7 }}>
              <SectionTitle
                sx={{
                  position: 'relative',
                  paddingLeft: 3,
                  fontFamily: FONT_TITLE,
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
                Price Analysis
              </SectionTitle>
              <Box sx={{ display: 'flex', justifyContent:"flex-end", alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 4.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', border: '2px solid #0a0a0a', overflow: 'hidden' }}>
                  <Box sx={{ py: 1.25, px: 2, fontFamily: FONT_TEXT, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#888', bgcolor: '#fff', borderRight: '2px solid #0a0a0a' }}>
                    Unit
                  </Box>
                  <Button
                    onClick={() => setUnitSelection('sqft')}
                    disableRipple
                    sx={{
                      fontFamily: FONT_TEXT,
                      fontSize: 14,
                      letterSpacing: '0.08em',
                      py: 1.25,
                      px: 2.25,
                      bgcolor: unitSelection === 'sqft' ? '#0a0a0a' : '#fff',
                      color: unitSelection === 'sqft' ? '#f2c514' : '#888',
                      fontWeight: unitSelection === 'sqft' ? 500 : 400,
                      borderRadius: 0,
                      borderRight: '1px solid #e8e6df',
                      '&:hover': { bgcolor: unitSelection === 'sqft' ? '#0a0a0a' : '#f7f6f2' },
                    }}
                  >
                    Square Feet
                  </Button>
                  <Button
                    onClick={() => setUnitSelection('sqm')}
                    disableRipple
                    sx={{
                      fontFamily: FONT_TEXT,
                      fontSize: 14,
                      letterSpacing: '0.08em',
                      py: 1.25,
                      px: 2.25,
                      bgcolor: unitSelection === 'sqm' ? '#0a0a0a' : '#fff',
                      color: unitSelection === 'sqm' ? '#f2c514' : '#888',
                      fontWeight: unitSelection === 'sqm' ? 500 : 400,
                      borderRadius: 0,
                      '&:hover': { bgcolor: unitSelection === 'sqm' ? '#0a0a0a' : '#f7f6f2' },
                    }}
                  >
                    Square Metres
                  </Button>
                </Box>
              </Box>
  
              {showLetting && (
                <Box sx={{ mb: 5.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2.5, fontFamily: FONT_TITLE, fontSize: 18, fontWeight: 700, color: '#0a0a0a' }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#f2c514', flexShrink: 0 }} />
                    {showBoth ? "1. Letting's Valuation" : "Letting's Valuation"}
                  </Box>
                  {pred ? (
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5, mb: 5.5 }}>
                      <Box sx={{ border: '2px solid #0a0a0a', bgcolor: '#fff', overflow: 'hidden', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75, p: '20px 24px', borderBottom: '2px solid #0a0a0a', bgcolor: '#0a0a0a' }}>
                          <Box sx={{ width: 38, height: 38, bgcolor: '#f2c514', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} style={{ color: '#0a0a0a' }}>{calendarSvg(20, 20)}</Box>
                          <Typography sx={{ fontFamily: FONT_TITLE, fontSize: 17, fontWeight: 700, color: '#fff' }}>Annual Pricing</Typography>
                        </Box>
                        <Box sx={{ px: 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2, borderBottom: '1px solid #e8e6df', gap: 1.5 }}>
                            <Typography sx={{ fontFamily: FONT_TEXT, fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888' }}>Total Price (PA)</Typography>
                            <Typography sx={{ fontFamily: FONT_TITLE, fontSize: 22, fontWeight: 900, color: '#f2c514' }}>£{pred.pricingPA?.toLocaleString() || 'N/A'}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2, borderBottom: '1px solid #e8e6df', gap: 1.5 }}>
                            <Typography sx={{ fontFamily: FONT_TEXT, fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888' }}>Price per {unitDisplay} (PA)</Typography>
                            <Typography sx={{ fontFamily: FONT_TITLE, fontSize: 16, fontWeight: 700, color: '#0a0a0a' }}>{pred.pricePerSqftPA ? '£' + (pred.pricePerSqftPA * conversionFactor).toFixed(2) : 'N/A'}</Typography>
                          </Box>
                          {effectiveArea > 0 && (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2, gap: 1.5 }}>
                              <Typography sx={{ fontFamily: FONT_TEXT, fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888' }}>Effective Area ({unitDisplay})</Typography>
                              <Typography sx={{ fontFamily: FONT_TITLE, fontSize: 16, fontWeight: 700, color: '#0a0a0a' }}>
                                {unitSelection === 'sqm' ? (effectiveArea / 10.764).toFixed(2) + ' m²' : effectiveArea + ' sqft'}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                      <Box sx={{ border: '2px solid #0a0a0a', bgcolor: '#fff', overflow: 'hidden', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75, p: '20px 24px', borderBottom: '2px solid #0a0a0a', bgcolor: '#0a0a0a' }}>
                          <Box sx={{ width: 38, height: 38, bgcolor: '#f2c514', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} style={{ color: '#0a0a0a' }}>{calendarSvg(20, 20)}</Box>
                          <Typography sx={{ fontFamily: FONT_TITLE, fontSize: 17, fontWeight: 700, color: '#fff' }}>Monthly Pricing</Typography>
                        </Box>
                        <Box sx={{ px: 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2, borderBottom: '1px solid #e8e6df', gap: 1.5 }}>
                            <Typography sx={{ fontFamily: FONT_TEXT, fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888' }}>Total Price (PCM)</Typography>
                            <Typography sx={{ fontFamily: FONT_TITLE, fontSize: 22, fontWeight: 900, color: '#f2c514' }}>£{pred.pricingPCM?.toLocaleString() || 'N/A'}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2, gap: 1.5 }}>
                            <Typography sx={{ fontFamily: FONT_TEXT, fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888' }}>Price per {unitDisplay} (PCM)</Typography>
                            <Typography sx={{ fontFamily: FONT_TITLE, fontSize: 16, fontWeight: 700, color: '#0a0a0a' }}>{pred.pricePerSqftPCM ? '£' + (pred.pricePerSqftPCM * conversionFactor).toFixed(2) : 'N/A'}</Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  ) : (
                    <Alert severity="info" sx={{ borderRadius: 0, fontSize: '16px' }}>Letting's valuation not available for this property.</Alert>
                  )}
                </Box>
              )}
  
              {showSales && (
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2.5, fontFamily: FONT_TITLE, fontSize: 20, fontWeight: 700, color: '#0a0a0a' }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#f2c514', flexShrink: 0 }} />
                    {showBoth ? '2. Sales Valuation' : 'Sales Valuation'}
                  </Box>
                  {pred ? (
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, border: '2px solid #0a0a0a', bgcolor: '#fff', overflow: 'hidden', mb: 3 }}>
                      {priceCards.map((card) => {
                        const salePrice = annualPA * card.mult;
                        const pricePerUnit = effectiveArea > 0 ? (salePrice / effectiveArea) * conversionFactor : 0;
                        const featured = !!card.featured;
                        const Icon = card.label === 'Lowest Price' ? chartDownSvg : card.label === 'Average Price' ? chartAvgSvg : chartUpSvg;
                        return (
                          <Box
                            key={card.label}
                            sx={{
                              position: 'relative',
                              borderRight: { md: '2px solid #0a0a0a' },
                              bgcolor: featured ? '#0a0a0a' : 'transparent',
                              '&:last-child': { borderRight: 'none' },
                            }}
                          >
                            {featured && (
                              <Box sx={{ position: 'absolute', top: 0, right: 0, bgcolor: '#f2c514', color: '#0a0a0a', fontFamily: FONT_TEXT, fontSize: 12, letterSpacing: '0.1em', py: 0.6, px: 1.5, textTransform: 'uppercase', fontWeight: 600 }}>
                                Average
                              </Box>
                            )}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: '20px 24px', borderBottom: '2px solid #0a0a0a', bgcolor: featured ? '#f2c514' : 'transparent', borderBottomColor: featured ? 'rgba(0,0,0,0.2)' : '#0a0a0a' }}>
                              <Box sx={{ width: 34, height: 34, bgcolor: featured ? '#0a0a0a' : '#f7f6f2', border: '1px solid #e8e6df', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} style={{ color: featured ? '#f2c514' : '#888' }}>{Icon(16, 16)}</Box>
                              <Typography sx={{ fontFamily: FONT_TITLE, fontSize: featured ? 19 : 18, fontWeight: 700, color: featured ? '#0a0a0a' : '#0a0a0a' }}>{card.label}</Typography>
                            </Box>
                            <Box sx={{ px: 3, '& .row': { borderBottom: featured ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e8e6df' } }}>
                              <Box className="row" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.9, gap: 1.5 }}>
                                <Typography sx={{ fontFamily: FONT_TEXT, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, color: featured ? 'rgba(255,255,255,0.6)' : '#888' }}>Sale Price</Typography>
                                <Typography sx={{ fontFamily: FONT_TITLE, fontSize: featured ? 22 : 20, fontWeight: 900, color: '#f2c514' }}>£{Math.round(salePrice).toLocaleString()}</Typography>
                              </Box>
                              {effectiveArea > 0 && (
                                <Box className="row" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.9, gap: 1.5 }}>
                                  <Typography sx={{ fontFamily: FONT_TEXT, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, color: featured ? 'rgba(255,255,255,0.6)' : '#888' }}>Price per {unitDisplay}</Typography>
                                  <Typography sx={{ fontFamily: FONT_TITLE, fontSize: 16, fontWeight: 700, color: featured ? '#fff' : '#0a0a0a' }}>£{pricePerUnit.toFixed(2)}</Typography>
                                </Box>
                              )}
                              {effectiveArea > 0 && (
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.9, gap: 1.5 }}>
                                  <Typography sx={{ fontFamily: FONT_TEXT, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, color: featured ? 'rgba(255,255,255,0.6)' : '#888' }}>Effective Area ({unitDisplay})</Typography>
                                  <Typography sx={{ fontFamily: FONT_TITLE, fontSize: 16, fontWeight: 700, color: featured ? '#fff' : '#0a0a0a' }}>
                                    {unitSelection === 'sqm' ? (effectiveArea / 10.764).toFixed(2) + ' m²' : effectiveArea + ' sqft'}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  ) : (
                    <Alert severity="info" sx={{ borderRadius: 0, fontSize: '16px' }}>Sales valuation not available for this property.</Alert>
                  )}
                </Box>
              )}
  
              {(showLetting || showSales) && (
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, bgcolor: '#fff5f5', border: '2px solid #c0392b', borderLeft: '6px solid #c0392b', p: '20px 24px' }}>
                  <Box sx={{ width: 36, height: 36, bgcolor: '#c0392b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} style={{ color: '#fff' }}>{alertSvg()}</Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontFamily: FONT_TITLE, fontSize: 18, fontWeight: 700, color: '#c0392b', mb: 0.75 }}>Important Note</Typography>
                    <Typography sx={{ fontSize: 16, lineHeight: 1.7, color: '#555', fontWeight: 500, fontFamily: FONT_TEXT }}>
                      These price predictions are based on market analysis and comparable properties in the area. Actual prices may vary based on negotiation, market conditions, and property-specific factors.
                    </Typography>
                  </Box>
                </Box>
              )}
  
              {!showLetting && !showSales && (
                <Alert severity="info" sx={{ borderRadius: 0, fontSize: '16px' }}>Price prediction not available for this property.</Alert>
              )}
            </ContentSection>
          );
      }

      case 'Property Details': {
        const pd = report.propertyDetails || {};
        const epcRating = report.epcData?.data?.current_energy_rating || report.epcData?.current_energy_rating;
        const epcScore = report.epcData?.data?.current_energy_efficiency || report.epcData?.current_energy_efficiency;
        const detailRows: Array<{ key: string; value: React.ReactNode; isBadge?: boolean }> = [];
        if (report.location?.address) detailRows.push({ key: 'Address', value: report.location.address });
        if (pd.postcode || report.location?.postcode) detailRows.push({ key: 'Postcode', value: pd.postcode || report.location?.postcode || '' });
        if (pd.thoroughfare) detailRows.push({ key: 'Street', value: pd.thoroughfare });
        if (pd.town_or_city) detailRows.push({ key: 'Town / City', value: pd.town_or_city });
        if (pd.county) detailRows.push({ key: 'County', value: pd.county });
        if (pd.district) detailRows.push({ key: 'District', value: pd.district });
        if (pd.country) detailRows.push({ key: 'Country', value: pd.country });
        if (pd.residential !== undefined) detailRows.push({ key: 'Property Type', value: pd.residential ? 'Residential' : 'Commercial' });
        detailRows.push({ key: 'Status', value: 'Active Listing', isBadge: true });
        if (pd.tenure) detailRows.push({ key: 'Tenure', value: pd.tenure });
        if (pd.year_built != null) detailRows.push({ key: 'Year Built', value: String(pd.year_built) });
        if (pd.floors != null) detailRows.push({ key: 'Floors', value: pd.floors });
        if (pd.car_parking) detailRows.push({ key: 'Car Parking', value: pd.car_parking });
        if (epcRating != null) detailRows.push({ key: 'EPC Rating', value: epcScore != null ? `${epcRating} (${epcScore})` : String(epcRating) });
        if (pd.latitude != null && pd.longitude != null) {
          detailRows.push({ key: 'Latitude', value: String(pd.latitude) });
          detailRows.push({ key: 'Longitude', value: String(pd.longitude) });
        }
        return (
          <ContentSection>
            <Box
              sx={{
                background: '#ffffff',
                border: '2px solid #0a0a0a',
                padding: 3,
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
                Property Details
              </SectionTitle>
              {detailRows.map((row, index) => (
                <Box
                  key={row.key}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    padding: '12px 0',
                    borderBottom: index < detailRows.length - 1 ? '1px solid #e8e6df' : 'none',
                    gap: 2,
                  }}
                >
                  <Typography
                    component="span"
                    sx={{
                      fontFamily: FONT_TEXT,
                      fontSize: 13,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: '#888',
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {row.key}
                  </Typography>
                  <Typography
                    component="span"
                    sx={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: '#0a0a0a',
                      textAlign: 'right',
                      fontFamily: FONT_TEXT,
                    }}
                  >
                    {row.isBadge ? (
                      <Box
                        component="span"
                        sx={{
                          display: 'inline-block',
                          background: '#f2c514',
                          color: '#0a0a0a',
                          fontFamily: FONT_TEXT,
                          fontSize: 13,
                          letterSpacing: '0.08em',
                          padding: '5px 12px',
                          textTransform: 'uppercase',
                          fontWeight: 600,
                        }}
                      >
                        {row.value}
                      </Box>
                    ) : (
                      row.value
                    )}
                  </Typography>
                </Box>
              ))}
            </Box>
          </ContentSection>
        );
      }

      case 'EPC': {
        const epc = report.epcData?.data || report.epcData;
        const grade = epc?.['asset-rating-band'] || epc?.current_energy_rating || report.epcData?.['asset-rating-band'];
        const score = epc?.['asset-rating'] ?? epc?.current_energy_efficiency ?? report.epcData?.['asset-rating'];
        const EPC_BARS = [
          { letter: 'A', w: 40, c: '#2d9a4e', range: '1–25' },
          { letter: 'B', w: 55, c: '#6abf44', range: '26–50' },
          { letter: 'C', w: 65, c: '#b5d334', range: '51–75' },
          { letter: 'D', w: 75, c: '#f2c514', range: '76–100' },
          { letter: 'E', w: 82, c: '#f4973a', range: '101–125' },
          { letter: 'F', w: 90, c: '#e8502a', range: '126–150' },
          { letter: 'G', w: 100, c: '#c0392b', range: '150+' },
        ];
        const currentGrade = (typeof grade === 'string' ? grade.toUpperCase() : String(grade)).charAt(0);
        return (
          <ContentSection>
            <SectionTitle
              sx={{
                position: 'relative',
                paddingLeft: 3,
                marginTop: 1,
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
              Energy Performance Certificate
            </SectionTitle>
            {report.epcData || grade ? (
              <Box>
                {/* EPC banner — black with grade + bar stack */}
                <Box
                  sx={{
                    background: '#0a0a0a',
                    border: '2px solid #0a0a0a',
                    display: 'flex',
                    alignItems: 'stretch',
                    overflow: 'hidden',
                    minHeight: 180,
                    flexDirection: { xs: 'column', sm: 'row' },
                  }}
                >
                  <Box
                    sx={{
                      padding: '32px 36px',
                      flexShrink: 0,
                      borderRight: { xs: 'none', sm: '2px solid rgba(255,255,255,0.1)' },
                      borderBottom: { xs: '2px solid rgba(255,255,255,0.1)', sm: 'none' },
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 0.75,
                      minWidth: { sm: 180 },
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: FONT_TEXT,
                        fontSize: 12,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: '#f2c514',
                        fontWeight: 600,
                      }}
                    >
                      Energy Rating
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: FONT_TITLE,
                        fontSize: 80,
                        fontWeight: 900,
                        color: '#ffffff',
                        lineHeight: 1,
                        margin: '4px 0',
                      }}
                    >
                      {currentGrade || '—'}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: FONT_TEXT,
                        fontSize: 14,
                        color: 'rgba(255,255,255,0.5)',
                        letterSpacing: '0.06em',
                        fontWeight: 500,
                      }}
                    >
                      {score != null ? `Score: ${score}` : '—'}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      flex: 1,
                      padding: '24px 32px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3,
                      flexWrap: 'wrap',
                    }}
                  >
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        background: '#f2c514',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <BoltIcon sx={{ width: 28, height: 28, color: '#0a0a0a' }} />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 200, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      {EPC_BARS.map((bar, idx) => (
                        <Box
                          key={bar.letter}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            fontFamily: FONT_TEXT,
                            fontSize: 13,
                            color: 'rgba(255,255,255,0.6)',
                            fontWeight: 500,
                          }}
                        >
                          <Box component="span" sx={{ width: 14, textAlign: 'center', flexShrink: 0, fontWeight: 600 }}>
                            {bar.letter}
                          </Box>
                          <Box
                            sx={{
                              height: 14,
                              width: `${bar.w}%`,
                              background: bar.c,
                              opacity: currentGrade === bar.letter ? 1 : 0.35,
                              flex: '0 0 auto',
                              maxWidth: '100%',
                            }}
                          />
                          <Box
                            component="span"
                            sx={{
                              fontSize: 12,
                              color: currentGrade === bar.letter ? '#f2c514' : 'rgba(255,255,255,0.4)',
                              fontWeight: currentGrade === bar.letter ? 500 : 400,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {bar.range}
                            {currentGrade === bar.letter ? ' ◀' : ''}
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>

                {/* Property Information */}
                <Typography
                  sx={{
                    fontFamily: FONT_TITLE,
                    fontSize: 19,
                    fontWeight: 700,
                    color: '#0a0a0a',
                    margin: '28px 0 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Box sx={{ width: 8, height: 8, background: '#f2c514', flexShrink: 0 }} />
                  Property Information
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                    border: '2px solid #0a0a0a',
                    background: '#ffffff',
                    mb: 3.5,
                  }}
                >
                  {(epc?.address ?? report.epcData?.address ?? report.location?.address) && (
                    <Box
                      sx={{
                        padding: '20px 24px',
                        borderRight: { md: '1px solid #e8e6df' },
                        borderBottom: '1px solid #e8e6df',
                        borderLeft: '4px solid #f2c514',
                        gridColumn: { md: 'span 2' },
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: FONT_TEXT,
                          fontSize: 12,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: '#888',
                          fontWeight: 600,
                          mb: 0.75,
                        }}
                      >
                        Address
                      </Typography>
                      <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#0a0a0a', fontFamily: FONT_TEXT }}>
                        {epc?.address || report.epcData?.address || report.location?.address}
                      </Typography>
                    </Box>
                  )}
                  {(epc?.['property-type'] ?? report.epcData?.['property-type']) && (
                    <Box
                      sx={{
                        padding: '20px 24px',
                        borderRight: '1px solid #e8e6df',
                        borderBottom: '1px solid #e8e6df',
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: FONT_TEXT,
                          fontSize: 12,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: '#888',
                          fontWeight: 600,
                          mb: 0.75,
                        }}
                      >
                        Property Type
                      </Typography>
                      <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#0a0a0a', fontFamily: FONT_TEXT }}>
                        {epc?.['property-type'] || report.epcData?.['property-type']}
                      </Typography>
                    </Box>
                  )}
                  {(epc?.['floor-area'] ?? report.epcData?.['floor-area']) && (
                    <Box
                      sx={{
                        padding: '20px 24px',
                        borderRight: '1px solid #e8e6df',
                        borderBottom: '1px solid #e8e6df',
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: FONT_TEXT,
                          fontSize: 12,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: '#888',
                          fontWeight: 600,
                          mb: 0.75,
                        }}
                      >
                        Floor Area
                      </Typography>
                      <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#0a0a0a', fontFamily: FONT_TEXT }}>
                        {epc?.['floor-area'] || report.epcData?.['floor-area']} m²
                      </Typography>
                    </Box>
                  )}
                  {(epc?.['building-environment'] ?? report.epcData?.['building-environment']) && (
                    <Box
                      sx={{
                        padding: '20px 24px',
                        borderRight: '1px solid #e8e6df',
                        borderBottom: '1px solid #e8e6df',
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: FONT_TEXT,
                          fontSize: 12,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: '#888',
                          fontWeight: 600,
                          mb: 0.75,
                        }}
                      >
                        Building Environment
                      </Typography>
                      <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#0a0a0a', fontFamily: FONT_TEXT }}>
                        {epc?.['building-environment'] || report.epcData?.['building-environment']}
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Energy & Environmental Performance */}
                <Box
                  sx={{
                    background: '#fffde8',
                    border: '2px solid #0a0a0a',
                    overflow: 'hidden',
                    mb: 1,
                    '@media print': { pageBreakInside: 'avoid', breakInside: 'avoid' },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.75,
                    padding: '18px 24px',
                    borderBottom: '2px solid #0a0a0a',
                    fontFamily: FONT_TITLE,
                    fontSize: 19,
                    fontWeight: 700,
                    color: '#0a0a0a',
                  }}
                >
                  <Box
                    sx={{
                      width: 34,
                      height: 34,
                      background: '#f2c514',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <BoltIcon sx={{ width: 17, height: 17, color: '#0a0a0a' }} />
                  </Box>
                  Energy & Environmental Performance
                </Box>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                    }}
                  >
                    {(epc?.['main-heating-fuel'] ?? report.epcData?.['main-heating-fuel']) && (
                      <Box
                        sx={{
                          padding: '20px 24px',
                          borderRight: '1px solid rgba(0,0,0,0.08)',
                          borderBottom: '1px solid rgba(0,0,0,0.08)',
                          background: '#ffffff',
                        }}
                      >
                        <Typography
                          sx={{
                          fontFamily: FONT_TEXT,
                          fontSize: 12,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: '#888',
                          fontWeight: 600,
                          mb: 1,
                        }}
                      >
                        Main Heating Fuel
                        </Typography>
                        <Typography sx={{ fontSize: 19, fontWeight: 700, color: '#0a0a0a', fontFamily: FONT_TITLE }}>
                          {epc?.['main-heating-fuel'] || report.epcData?.['main-heating-fuel']}
                        </Typography>
                      </Box>
                    )}
                    {(epc?.['primary-energy-value'] ?? report.epcData?.['primary-energy-value']) && (
                      <Box
                        sx={{
                          padding: '20px 24px',
                          borderRight: '1px solid rgba(0,0,0,0.08)',
                          borderBottom: '1px solid rgba(0,0,0,0.08)',
                          background: '#ffffff',
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: FONT_TEXT,
                            fontSize: 9,
                            letterSpacing: '0.16em',
                            textTransform: 'uppercase',
                            color: '#888',
                            mb: 1,
                          }}
                        >
                          Primary Energy Value
                        </Typography>
                        <Typography sx={{ fontSize: 19, fontWeight: 700, color: '#0a0a0a', fontFamily: FONT_TITLE }}>
                          {epc?.['primary-energy-value'] || report.epcData?.['primary-energy-value']} kWh/m²/year
                        </Typography>
                      </Box>
                    )}
                    {(epc?.['building-emissions'] ?? report.epcData?.['building-emissions']) && (
                      <Box
                        sx={{
                          padding: '20px 24px',
                          borderRight: { md: '1px solid rgba(0,0,0,0.08)' },
                          borderBottom: '1px solid rgba(0,0,0,0.08)',
                          background: '#ffffff',
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: FONT_TEXT,
                            fontSize: 9,
                            letterSpacing: '0.16em',
                            textTransform: 'uppercase',
                            color: '#888',
                            mb: 1,
                          }}
                        >
                          Building Emissions
                        </Typography>
                        <Typography sx={{ fontSize: 19, fontWeight: 700, color: '#0a0a0a', fontFamily: FONT_TITLE }}>
                          {epc?.['building-emissions'] || report.epcData?.['building-emissions']} kgCO₂/m²/year
                        </Typography>
                      </Box>
                    )}
                    {(epc?.['inspection-date'] ?? report.epcData?.['inspection-date']) && (
                      <Box
                        sx={{
                          padding: '20px 24px',
                          borderRight: '1px solid rgba(0,0,0,0.08)',
                          borderBottom: '1px solid rgba(0,0,0,0.08)',
                          background: '#ffffff',
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: FONT_TEXT,
                            fontSize: 9,
                            letterSpacing: '0.16em',
                            textTransform: 'uppercase',
                            color: '#888',
                            mb: 1,
                          }}
                        >
                          Inspection Date
                        </Typography>
                        <Typography sx={{ fontSize: 19, fontWeight: 700, color: '#0a0a0a', fontFamily: FONT_TITLE }}>
                          {new Date(epc?.['inspection-date'] || report.epcData?.['inspection-date']).toLocaleDateString('en-GB')}
                        </Typography>
                      </Box>
                    )}
                    {(epc?.['lodgement-date'] ?? report.epcData?.['lodgement-date']) && (
                      <Box
                        sx={{
                          padding: '20px 24px',
                          borderRight: '1px solid rgba(0,0,0,0.08)',
                          borderBottom: '1px solid rgba(0,0,0,0.08)',
                          background: '#ffffff',
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: FONT_TEXT,
                            fontSize: 9,
                            letterSpacing: '0.16em',
                            textTransform: 'uppercase',
                            color: '#888',
                            mb: 1,
                          }}
                        >
                          Lodgement Date
                        </Typography>
                        <Typography sx={{ fontSize: 19, fontWeight: 700, color: '#0a0a0a', fontFamily: FONT_TITLE }}>
                          {new Date(epc?.['lodgement-date'] || report.epcData?.['lodgement-date']).toLocaleDateString('en-GB')}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            ) : (
              <Alert severity="info" sx={{ borderRadius: '12px', fontSize: '16px' }}>
                EPC data not available for this property.
              </Alert>
            )}
          </ContentSection>
        );
      }

      case 'Accommodation (historic data)': {
        const legalItems = landRegistryData?.result?.items
          ? [...landRegistryData.result.items].sort((a: any, b: any) =>
              new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
            )
          : [];
        const getVal = (t: any, path: string) => {
          const parts = path.split('.');
          let v: any = t;
          for (const p of parts) {
            v = v?.[p];
            if (Array.isArray(v) && v[0]?._value != null) return v[0]._value;
          }
          return v;
        };
        return (
          <ContentSection>
            <SectionTitle
              sx={{
                position: 'relative',
                paddingLeft: 3,
                marginTop: 1,
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
              HM Land Registry – Transaction History
            </SectionTitle>
            {/* <Typography
              sx={{
                fontFamily: FONT_TITLE,
                fontSize: 17,
                fontWeight: 700,
                color: '#0a0a0a',
                mb: 2.5,
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
              }}
            >
              <Box
                component="svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                sx={{ width: 18, height: 18, color: '#f2c514', flexShrink: 0 }}
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </Box>
            </Typography> */}

            {landRegistryLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress sx={{ color: '#f2c514' }} />
              </Box>
            ) : legalItems.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {legalItems.map((transaction: any, index: number) => {
                  const addr = transaction.propertyAddress || {};
                  const isLatest = index === 0;
                  const unitLabel = [addr.paon, addr.saon].filter(Boolean).join(' ').toUpperCase() || '—';
                  const addressSub = [addr.street, addr.town].filter(Boolean).join(', ').toUpperCase() || '—';
                  const priceDate = new Date(transaction.transactionDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                  const estateType = getVal(transaction, 'estateType.label.0._value') ?? '—';
                  const recordStatus = getVal(transaction, 'recordStatus.label.0._value') ?? 'Add';
                  const transCat = getVal(transaction, 'transactionCategory.label.0._value') ?? '—';
                  const propType = getVal(transaction, 'propertyType.label.0._value') ?? '—';
                  return (
                    <Box
                      key={transaction.transactionId}
                      sx={{
                        border: '2px solid #0a0a0a',
                        background: '#ffffff',
                        overflow: 'hidden',
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          p: '24px 28px 20px',
                          borderBottom: '2px solid #0a0a0a',
                          background: '#0a0a0a',
                          gap: 2.5,
                          flexWrap: 'wrap',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.25 }}>
                          <Typography sx={{ fontFamily: FONT_TITLE, fontSize: 22, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.01em' }}>
                            {unitLabel}
                          </Typography>
                          {isLatest && (
                            <Box
                              sx={{
                                background: '#f2c514',
                                color: '#0a0a0a',
                                fontFamily: FONT_TEXT,
                                fontSize: 9,
                                letterSpacing: '0.14em',
                                padding: '4px 10px',
                                fontWeight: 500,
                                alignSelf: 'center',
                              }}
                            >
                              LATEST
                            </Box>
                          )}
                          <Typography sx={{ width: '100%', fontFamily: FONT_TEXT, fontSize: 13, letterSpacing: '0.06em', color: 'rgba(255,255,255,0.5)', fontWeight: 500, textTransform: 'uppercase', mt: 0.25 }}>
                            {addressSub}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                          <Typography sx={{ fontFamily: FONT_TITLE, fontSize: 28, fontWeight: 900, color: '#f2c514', lineHeight: 1 }}>
                            £{Number(transaction.pricePaid).toLocaleString('en-GB')}
                          </Typography>
                          <Typography sx={{ fontFamily: FONT_TEXT, fontSize: 14, color: 'rgba(255,255,255,0.4)', mt: 0.5, letterSpacing: '0.06em' }}>
                            {priceDate}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, padding: 0 }}>
                        {[
                          { key: 'New Build', val: transaction.newBuild ? 'Yes' : 'No', mono: false, wide: false },
                          { key: 'Transaction Date', val: new Date(transaction.transactionDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }), mono: false, wide: false },
                          { key: 'Price Paid', val: `£${Number(transaction.pricePaid).toLocaleString('en-GB')}`, mono: false, highlight: true, wide: false },
                          { key: 'Estate Type', val: estateType, pill: true, wide: false },
                        ].map((field) => (
                          <Box
                            key={field.key}
                            sx={{
                              padding: '18px 24px',
                              borderRight: field.wide ? 'none' : '1px solid #e8e6df',
                              borderBottom: '1px solid #e8e6df',
                              gridColumn: field.wide ? 'span 2' : 'auto',
                            }}
                          >
                            <Typography
                              sx={{
                                fontFamily: FONT_TEXT,
                                fontSize: 9,
                                letterSpacing: '0.18em',
                                textTransform: 'uppercase',
                                color: '#888',
                                mb: 0.75,
                              }}
                            >
                              {field.key}
                            </Typography>
                            <Typography
                              sx={{
                                fontFamily: field.highlight ? FONT_TITLE : (field.mono ? FONT_TEXT : undefined),
                                fontSize: field.highlight ? 18 : (field.mono ? 12 : 14),
                                fontWeight: field.highlight ? 700 : (field.mono ? 400 : 600),
                                color: field.mono ? '#555' : '#0a0a0a',
                                wordBreak: 'break-all',
                              }}
                            >
                              {field.pill ? (
                                <Box
                                  component="span"
                                  sx={{
                                    display: 'inline-block',
                                    background: '#f2c514',
                                    color: '#0a0a0a',
                                    fontFamily: FONT_TEXT,
                                    fontSize: 13,
                                    letterSpacing: '0.08em',
                                    padding: '3px 10px',
                                    fontWeight: 500,
                                  }}
                                >
                                  {field.val}
                                </Box>
                              ) : (
                                field.val
                              )}
                            </Typography>
                          </Box>
                        ))}
                      </Box>

                      <Box sx={{ borderTop: '2px solid #0a0a0a', background: '#f9f8f3' }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            padding: '14px 24px',
                            fontFamily: FONT_TEXT,
                            fontSize: 13,
                            letterSpacing: '0.16em',
                            textTransform: 'uppercase',
                            color: '#888',
                            borderBottom: '1px solid #e8e6df',
                          }}
                        >
                          <LocationOnIcon sx={{ width: 14, height: 14, color: '#f2c514' }} />
                          Property Address
                        </Box>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                          {[
                            { key: 'County', val: addr.county || 'N/A' },
                            { key: 'District', val: addr.district || 'N/A' },
                            { key: 'PAON', val: addr.paon || 'N/A' },
                            { key: 'Postcode', val: addr.postcode ? (
                              <Box component="span" sx={{ display: 'inline-block', background: '#f2c514', color: '#0a0a0a', fontFamily: FONT_TEXT, fontSize: 12, letterSpacing: '0.06em', padding: '4px 12px', fontWeight: 500 }}>{addr.postcode}</Box>
                            ) : 'N/A' },
                            { key: 'Street', val: addr.street || 'N/A' },
                            { key: 'Town', val: addr.town || 'N/A' },
                          ].map((row) => (
                            <Box
                              key={row.key}
                              sx={{ padding: '18px 24px', borderRight: '1px solid #e8e6df', borderBottom: '1px solid #e8e6df', '&:nth-of-type(even)': { borderRight: 'none' } }}
                            >
                              <Typography sx={{ fontFamily: FONT_TEXT, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', fontWeight: 600, mb: 0.75 }}>{row.key}</Typography>
                              <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#0a0a0a', fontFamily: FONT_TEXT }}>{row.val}</Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    </Box>
                  );
                })}

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, fontFamily: FONT_TEXT, fontSize: 13, letterSpacing: '0.04em', color: '#888', lineHeight: 1.6, fontWeight: 500, padding: '14px 4px 32px' }}>
                  <Box
                    component="svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    sx={{ width: 14, height: 14, flexShrink: 0, mt: 0.3 }}
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </Box>
                  <Typography component="span">
                    Data source: Contains HM Land Registry data © Crown copyright and database right {new Date().getFullYear()}. Licensed under the{' '}
                    <Typography
                      component="a"
                      href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ color: '#f2c514', textDecoration: 'none', borderBottom: '1px solid #f2c514' }}
                    >
                      Open Government Licence v3.0
                    </Typography>
                    .
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box sx={{ p: 4, border: '2px solid #e8e6df', background: '#f9f8f3', textAlign: 'center' }}>
                <Typography sx={{ fontSize: 16, color: '#888', fontFamily: FONT_TEXT }}>
                  No transaction history available for this postcode in the HM Land Registry Price Paid Data.
                </Typography>
              </Box>
            )}
          </ContentSection>
        );
      }

      case 'Mortgage Calculator': {
        const calculateMortgage = () => {
          if (!propertyValue || propertyValue <= 0) return null;
          const depositAmount = (propertyValue * depositPercent) / 100;
          const loanAmount = propertyValue - depositAmount;
          const monthlyInterestRate = interestRate / 100 / 12;
          const numberOfPayments = loanTerm * 12;
          if (monthlyInterestRate === 0) {
            return { monthlyPayment: loanAmount / numberOfPayments, totalAmount: loanAmount, totalInterest: 0, depositAmount, loanAmount };
          }
          const monthlyPayment =
            (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
            (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
          const totalAmount = monthlyPayment * numberOfPayments;
          const totalInterest = totalAmount - loanAmount;
          return { monthlyPayment, totalAmount, totalInterest, depositAmount, loanAmount };
        };
        const mortgageResult = calculateMortgage();
        const loanAmt = mortgageResult?.loanAmount ?? 0;
        const totalInt = mortgageResult?.totalInterest ?? 0;
        const fmt = (n: number) => '£' + Math.round(n).toLocaleString('en-GB');
        return (
          <ContentSection>
            <SectionTitle
              sx={{
                position: 'relative',
                paddingLeft: 3,
                marginTop: 0,
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
              Mortgage Calculator
            </SectionTitle>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                border: '2px solid #0a0a0a',
                bgcolor: '#fff',
                overflow: 'hidden',
              }}
            >
              {/* Left: inputs */}
              <Box sx={{ borderRight: { md: '2px solid #0a0a0a' }, display: 'flex', flexDirection: 'column' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    p: '20px 24px',
                    bgcolor: '#fffde8',
                    borderBottom: '2px solid #0a0a0a',
                    fontFamily: FONT_TEXT,
                    fontSize: 15,
                    letterSpacing: '0.04em',
                    color: '#7a5c00',
                    fontWeight: 500,
                  }}
                >
                  <Box sx={{ width: 34, height: 34, bgcolor: '#f2c514', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                  </Box>
                  <span>Calculate your mortgage payments based on the property price</span>
                </Box>
                <Box sx={{ py: 0, borderBottom: '1px solid #e8e6df' }}>
                  <Typography component="label" sx={{ fontFamily: FONT_TEXT, fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', fontWeight: 600, display: 'block', mb: 1.25, px: 3, pt: 2.5 }}>
                    Property Value
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', border: '2px solid #0a0a0a', bgcolor: '#fff', mx: 3, mb: 2 }}>
                    <Box component="span" sx={{ py: 1.25, px: 1.75, fontFamily: FONT_TEXT, fontSize: 16, fontWeight: 600, bgcolor: '#0a0a0a', color: '#f2c514', flexShrink: 0 }}>
                      £
                    </Box>
                    <InputBase
                      type="number"
                      value={propertyValue || ''}
                      onChange={(e) => setPropertyValue(parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      inputProps={{ min: 0, step: 1000 }}
                      sx={{ flex: 1, border: 'none', outline: 'none', py: 1.25, px: 1.75, fontFamily: FONT_TITLE, fontSize: 22, fontWeight: 700, color: '#0a0a0a', '& input': { textAlign: 'left' } }}
                    />
                  </Box>
                </Box>
                <Box sx={{ py: 0, borderBottom: '1px solid #e8e6df' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.25, px: 3, pt: 2.5 }}>
                    <Typography component="label" sx={{ fontFamily: FONT_TEXT, fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', fontWeight: 600, mb: 0 }}>
                      Deposit
                    </Typography>
                    <Box sx={{ bgcolor: '#f2c514', color: '#0a0a0a', fontFamily: FONT_TEXT, fontSize: 14, fontWeight: 600, letterSpacing: '0.06em', py: 0.5, px: 1.5, border: '2px solid #0a0a0a' }}>
                      {depositPercent}%
                    </Box>
                  </Box>
                  <Box sx={{ px: 3, pb: 1 }}>
                    <Slider
                      value={depositPercent}
                      onChange={(_, v) => setDepositPercent(v as number)}
                      min={1}
                      max={100}
                      step={1}
                      sx={{
                        color: '#f2c514',
                        height: 4,
                        '& .MuiSlider-thumb': { width: 20, height: 20, bgcolor: '#f2c514', border: '2px solid #0a0a0a', borderRadius: 0 },
                        '& .MuiSlider-rail': { opacity: 1 },
                      }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT_TEXT, fontSize: 12, color: '#888', letterSpacing: '0.06em', fontWeight: 500 }}>
                      <span>1%</span>
                      <span>100%</span>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ py: 0, borderBottom: '1px solid #e8e6df' }}>
                  <Typography component="label" sx={{ fontFamily: FONT_TEXT, fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', fontWeight: 600, display: 'block', mb: 1.25, px: 3, pt: 2.5 }}>
                    Interest Rate
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', border: '2px solid #0a0a0a', bgcolor: '#fff', mx: 3, mb: 2 }}>
                    <InputBase
                      type="number"
                      value={interestRate ?? ''}
                      onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                      inputProps={{ min: 0, step: 0.1 }}
                      sx={{ flex: 1, border: 'none', outline: 'none', py: 1.25, px: 1.75, fontFamily: FONT_TITLE, fontSize: 22, fontWeight: 700, color: '#0a0a0a' }}
                    />
                    <Box component="span" sx={{ py: 1.25, px: 1.75, fontFamily: FONT_TEXT, fontSize: 16, fontWeight: 600, bgcolor: '#0a0a0a', color: '#f2c514', flexShrink: 0 }}>
                      %
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ py: 0 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.25, px: 3, pt: 2.5 }}>
                    <Typography component="label" sx={{ fontFamily: FONT_TEXT, fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', fontWeight: 600, mb: 0 }}>
                      Loan Term
                    </Typography>
                    <Box sx={{ bgcolor: '#f2c514', color: '#0a0a0a', fontFamily: FONT_TEXT, fontSize: 14, fontWeight: 600, letterSpacing: '0.06em', py: 0.5, px: 1.5, border: '2px solid #0a0a0a' }}>
                      {loanTerm} {loanTerm === 1 ? 'year' : 'years'}
                    </Box>
                  </Box>
                  <Box sx={{ px: 3, pb: 2 }}>
                    <Slider
                      value={loanTerm}
                      onChange={(_, v) => setLoanTerm(v as number)}
                      min={1}
                      max={40}
                      step={1}
                      sx={{
                        color: '#f2c514',
                        height: 4,
                        '& .MuiSlider-thumb': { width: 20, height: 20, bgcolor: '#f2c514', border: '2px solid #0a0a0a', borderRadius: 0 },
                        '& .MuiSlider-rail': { opacity: 1 },
                      }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT_TEXT, fontSize: 12, color: '#888', letterSpacing: '0.06em', fontWeight: 500 }}>
                      <span>1 yr</span>
                      <span>40 yrs</span>
                    </Box>
                  </Box>
                </Box>
              </Box>
              {/* Right: breakdown */}
              <Box sx={{ display: 'flex', flexDirection: 'column', bgcolor: '#0a0a0a' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, p: '20px 24px', fontFamily: FONT_TITLE, fontSize: 20, fontWeight: 700, color: '#fff', borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ color: '#f2c514', flexShrink: 0 }}>
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                  Mortgage Breakdown
                </Box>
                <Box sx={{ px: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.75, borderBottom: '1px solid rgba(255,255,255,0.08)', gap: 1.5 }}>
                    <Typography sx={{ fontFamily: FONT_TEXT, fontSize: 14, letterSpacing: '0.06em', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Property Value</Typography>
                    <Typography sx={{ fontFamily: FONT_TEXT, fontSize: 16, fontWeight: 600, color: '#fff' }}>{propertyValue > 0 ? fmt(propertyValue) : '—'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.75, borderBottom: '1px solid rgba(255,255,255,0.08)', gap: 1.5 }}>
                    <Typography sx={{ fontFamily: FONT_TEXT, fontSize: 14, letterSpacing: '0.06em', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Deposit ({depositPercent}%)</Typography>
                    <Typography sx={{ fontFamily: FONT_TEXT, fontSize: 16, fontWeight: 600, color: '#fff' }}>{mortgageResult ? fmt(mortgageResult.depositAmount) : '—'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.75, borderBottom: '1px solid rgba(255,255,255,0.08)', gap: 1.5 }}>
                    <Typography sx={{ fontFamily: FONT_TEXT, fontSize: 14, letterSpacing: '0.06em', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Loan Amount</Typography>
                    <Typography sx={{ fontFamily: FONT_TEXT, fontSize: 16, fontWeight: 600, color: '#fff' }}>{mortgageResult ? fmt(mortgageResult.loanAmount) : '—'}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', m: '0 24px', p: '18px 20px', bgcolor: '#f2c514', borderTop: '2px solid rgba(255,255,255,0.15)', borderBottom: '2px solid rgba(255,255,255,0.15)', gap: 1.5 }}>
                  <Typography sx={{ fontFamily: FONT_TEXT, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#0a0a0a', fontWeight: 600 }}>Monthly Payment</Typography>
                  <Typography sx={{ fontFamily: FONT_TITLE, fontSize: 28, fontWeight: 900, color: '#0a0a0a', lineHeight: 1 }}>
                    {mortgageResult ? '£' + mortgageResult.monthlyPayment.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'}
                  </Typography>
                </Box>
                <Box sx={{ px: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.75, borderBottom: '1px solid rgba(255,255,255,0.08)', gap: 1.5 }}>
                    <Typography sx={{ fontFamily: FONT_TEXT, fontSize: 14, letterSpacing: '0.06em', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Total Amount Paid</Typography>
                    <Typography sx={{ fontFamily: FONT_TEXT, fontSize: 16, fontWeight: 600, color: '#fff' }}>{mortgageResult ? fmt(mortgageResult.totalAmount) : '—'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.75, gap: 1.5 }}>
                    <Typography sx={{ fontFamily: FONT_TEXT, fontSize: 14, letterSpacing: '0.06em', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Total Interest</Typography>
                    <Typography sx={{ fontFamily: FONT_TEXT, fontSize: 16, fontWeight: 600, color: 'rgba(242,197,20,0.9)' }}>{mortgageResult ? fmt(mortgageResult.totalInterest) : '—'}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', height: 6, m: '16px 24px 8px', overflow: 'hidden' }}>
                  <Box sx={{ bgcolor: '#f2c514', flex: loanAmt || 1, transition: 'flex 0.4s ease' }} />
                  <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', flex: totalInt || 0, transition: 'flex 0.4s ease' }} />
                </Box>
                <Box sx={{ display: 'flex', gap: 2, px: 3, pb: 2.5, fontFamily: FONT_TEXT, fontSize: 12, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 500 }}>
                  <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <Box sx={{ width: 8, height: 8, flexShrink: 0, bgcolor: '#f2c514' }} />
                    Principal
                  </Box>
                  <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <Box sx={{ width: 8, height: 8, flexShrink: 0, bgcolor: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }} />
                    Interest
                  </Box>
                </Box>
              </Box>
            </Box>
            {(!mortgageResult || propertyValue <= 0) && (
              <Alert severity="info" sx={{ mt: 2, borderRadius: 0, fontSize: '16px' }}>
                Please enter a valid property value to calculate mortgage payments.
              </Alert>
            )}
          </ContentSection>
        );
      }

      case 'Demographics Findings': {
        const demoPeopleSvg = (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ flexShrink: 0 }}>
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        );
        const demoClockSvg = (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        );
        return (
          <ContentSection sx={{ pt: 1, pb: 7 }}>
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
              Demographics Findings
            </SectionTitle>
            {report.aiAnalysis ? (
              <>
                {report.aiAnalysis.summary && (
                  <Box sx={{ bgcolor: '#fff', border: '2px solid #0a0a0a', borderLeft: '6px solid #f2c514', p: '28px 32px', mb: 4 }}>
                    <Typography sx={{ fontFamily: FONT_TITLE, fontSize: 20, fontWeight: 700, mb: 1.75 }}>Executive Summary</Typography>
                    <Typography sx={{ fontSize: 14, lineHeight: 1.8, color: '#333', fontWeight: 300 }}>
                      {(() => { const t = report.aiAnalysis!.summary!.slice(2); return t ? t.charAt(0).toUpperCase() + t.slice(1) : ''; })()}
                    </Typography>
                  </Box>
                )}
                {report.aiAnalysis.points && report.aiAnalysis.points.length > 0 && (
                  <>
                    <Box sx={{ display: 'flex', flexDirection: 'column', border: '2px solid #0a0a0a', bgcolor: '#fff', overflow: 'hidden' }}>
                      {report.aiAnalysis.points.map((point: any, index: number) => {
                        const isLast = index === report.aiAnalysis!.points!.length - 1;
                        const numStr = String(point.number ?? index + 1).padStart(2, '0');
                        const contentText = point.content ? (() => { const t = point.content.slice(2); return t ? t.charAt(0).toUpperCase() + t.slice(1) : point.content; })() : '';
                        return (
                          <Box
                            key={index}
                            sx={{
                              display: 'flex',
                              alignItems: 'stretch',
                              borderBottom: isLast ? 'none' : '2px solid #0a0a0a',
                            }}
                          >
                            <Box sx={{ width: 72, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 3.5, borderRight: '2px solid #0a0a0a', bgcolor: '#0a0a0a' }}>
                              <Typography sx={{ fontFamily: FONT_TITLE, fontSize: 24, fontWeight: 900, color: '#f2c514', lineHeight: 1, mb: 1.75 }}>{numStr}</Typography>
                              <Box sx={{ flex: 1, width: 2, bgcolor: 'rgba(242,197,20,0.2)' }} />
                            </Box>
                            <Box sx={{ flex: 1, py: 3.5, px: 4 }}>
                              <Typography sx={{ fontFamily: FONT_TITLE, fontSize: 22, fontWeight: 700, color: '#0a0a0a', mb: 1.5, lineHeight: 1.2 }}>{point.title}</Typography>
                              <Typography sx={{ fontSize: 16, lineHeight: 1.75, color: '#444', fontWeight: 500, mb: 2.25 }}>{contentText}</Typography>
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  </>
                )}
              </>
            ) : (
              <Alert severity="info" sx={{ borderRadius: 0, fontSize: '16px' }}>
                Amenities analysis not available for this property.
              </Alert>
            )}
          </ContentSection>
        );
      }

      case 'Psychographics Analysis': {
        const psychoPeopleSvg = (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ flexShrink: 0 }}>
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        );
        const psychoTagSvg = (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        );
        return (
          <ContentSection sx={{ pt: 1, pb: 7 }}>
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
                {report.psychographicsAnalysis.summary && (
                  <Box sx={{ bgcolor: '#fff', border: '2px solid #0a0a0a', borderLeft: '6px solid #f2c514', p: '28px 32px', mb: 4 }}>
                    <Typography sx={{ fontFamily: FONT_TITLE, fontSize: 20, fontWeight: 700, mb: 1.75 }}>Executive Summary</Typography>
                    <Typography sx={{ fontSize: 14, lineHeight: 1.8, color: '#333', fontWeight: 300 }}>{report.psychographicsAnalysis.summary}</Typography>
                  </Box>
                )}
                {report.psychographicsAnalysis.points && report.psychographicsAnalysis.points.length > 0 && (
                  <>
                    <Box sx={{ display: 'flex', flexDirection: 'column', border: '2px solid #0a0a0a', bgcolor: '#fff', overflow: 'hidden' }}>
                      {report.psychographicsAnalysis.points.map((point: any, index: number) => {
                        const isLast = index === report.psychographicsAnalysis!.points!.length - 1;
                        const numStr = String(point.number ?? index + 1).padStart(2, '0');
                        const contentText = point.content || point.raw || '';
                        return (
                          <Box
                            key={index}
                            sx={{
                              display: 'flex',
                              alignItems: 'stretch',
                              borderBottom: isLast ? 'none' : '2px solid #0a0a0a',
                            }}
                          >
                            <Box sx={{ width: 72, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 3.5, borderRight: '2px solid #0a0a0a', bgcolor: '#0a0a0a' }}>
                              <Typography sx={{ fontFamily: FONT_TITLE, fontSize: 24, fontWeight: 900, color: '#f2c514', lineHeight: 1, mb: 1.75 }}>{numStr}</Typography>
                              <Box sx={{ flex: 1, width: 2, bgcolor: 'rgba(242,197,20,0.2)' }} />
                            </Box>
                            <Box sx={{ flex: 1, py: 3.5, px: 4 }}>
                              <Typography sx={{ fontFamily: FONT_TITLE, fontSize: 22, fontWeight: 700, color: '#0a0a0a', mb: 1.5, lineHeight: 1.2 }}>{point.title || `Insight ${point.number}`}</Typography>
                              <Typography sx={{ fontSize: 16, lineHeight: 1.75, color: '#444', fontWeight: 500, mb: 2.25 }}>{contentText}</Typography>
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  </>
                )}
                <Box sx={{ mt: 4, p: 3, bgcolor: 'rgba(242,197,20,0.08)', border: '1px solid rgba(242,197,20,0.3)' }}>
                  <Typography sx={{ color: '#6b7280', fontSize: 14, fontFamily: FONT_TEXT, textAlign: 'center', lineHeight: 1.6 }}>
                    This psychographics analysis is tailored for <Box component="strong" sx={{ color: '#92400e', fontWeight: 700 }}>{report.location?.propertyType || 'commercial'}</Box> properties
                    in the <Box component="strong" sx={{ color: '#92400e', fontWeight: 700 }}>{report.location?.postcode || ''}</Box> area, helping you understand your potential customer base.
                  </Typography>
                </Box>
              </>
            ) : (
              <Alert severity="info" sx={{ borderRadius: 0, fontSize: '16px' }}>
                Psychographics analysis is not available for this property. This feature provides insights into target customer behaviors, values, and purchasing motivations.
              </Alert>
            )}
          </ContentSection>
        );
      }

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
              <Box sx={{ mb: 5 }}>
                {/* Crime Statistics headline */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      backgroundColor: '#f2c514',
                      borderRadius: '50%',
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: '20px',
                      fontWeight: 700,
                      color: '#0a0a0a',
                      letterSpacing: '-0.01em',
                      fontFamily: FONT_TITLE,
                    }}
                  >
                    Crime Statistics for {crimeData.postcode}
                  </Typography>
                </Box>

                {/* Top three stat cards – crime rating / population / total crimes */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                    border: '2px solid #0a0a0a',
                    mb: 3,
                  }}
                >
                  {/* Crime Rating */}
                  <Box
                    sx={{
                      p: 3.5,
                      borderRight: { xs: 'none', md: '2px solid #0a0a0a' },
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: FONT_TEXT,
                        fontSize: '14px',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: '#888888',
                        fontWeight: 600,
                        mb: 1.5,
                      }}
                    >
                      Crime Rating
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: FONT_TITLE,
                        fontSize: '32px',
                        fontWeight: 800,
                        lineHeight: 1,
                        color:
                          crimeData.data.crime_rating?.toLowerCase().includes('very high') ||
                          crimeData.data.crime_rating?.toLowerCase().includes('high')
                            ? '#c0392b'
                            : '#0a0a0a',
                      }}
                    >
                      {crimeData.data.crime_rating || 'N/A'}
                    </Typography>
                  </Box>

                  {/* Population */}
                  <Box
                    sx={{
                      p: 3.5,
                      borderRight: { xs: 'none', md: '2px solid #0a0a0a' },
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: FONT_TEXT,
                        fontSize: '14px',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: '#888888',
                        fontWeight: 600,
                        mb: 1.5,
                      }}
                    >
                      Population
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: FONT_TITLE,
                        fontSize: '32px',
                        fontWeight: 800,
                        lineHeight: 1,
                        color: '#f2c514',
                      }}
                    >
                      {crimeData.data.population.toLocaleString()}
                    </Typography>
                  </Box>

                  {/* Total Crimes */}
                  <Box
                    sx={{
                      p: 3.5,
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: FONT_TEXT,
                        fontSize: '14px',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: '#888888',
                        fontWeight: 600,
                        mb: 1.5,
                      }}
                    >
                      Total Crimes (12 Months)
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: FONT_TITLE,
                        fontSize: '32px',
                        fontWeight: 800,
                        lineHeight: 1,
                        color: '#0a0a0a',
                        mb: 0.75,
                      }}
                    >
                      {crimeData.data.crimes_last_12m.total.toLocaleString()}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: FONT_TEXT,
                        fontSize: '15px',
                        color: '#888888',
                        letterSpacing: '0.04em',
                        fontWeight: 500,
                      }}
                    >
                      {crimeData.data.crimes_last_12m.per_thousand.toFixed(1)} per 1,000 residents
                    </Typography>
                  </Box>
                </Box>

                {/* Crime Breakdown heading */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      backgroundColor: '#f2c514',
                      borderRadius: '50%',
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: '20px',
                      fontWeight: 700,
                      color: '#0a0a0a',
                      letterSpacing: '-0.01em',
                      fontFamily: FONT_TITLE,
                    }}
                  >
                    Crime Breakdown (Last 12 Months)
                  </Typography>
                </Box>

                {/* Crime breakdown grid */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                    gap: 1.5,
                    mb: 2,
                  }}
                >
                  {Object.entries(crimeData.data.crimes_last_12m)
                    .filter(([key]) => key !== 'total' && key !== 'per_thousand')
                    .sort(([, a], [, b]) => (b as number) - (a as number))
                    .map(([crimeType, count]) => {
                      const isAboveAverage = crimeData.data.above_national_average.includes(crimeType);
                      const percentage =
                        typeof count === 'number' && crimeData.data.crimes_last_12m.total > 0
                          ? (count / crimeData.data.crimes_last_12m.total) * 100
                          : 0;

                      return (
                        <Box
                          key={crimeType}
                          sx={{
                            backgroundColor: '#ffffff',
                            border: '2px solid #0a0a0a',
                            p: 2,
                            pt: 2.25,
                            pb: 1.75,
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              mb: 1,
                              gap: 1.25,
                            }}
                          >
                            <Typography
                              sx={{
                                fontFamily: FONT_TEXT,
                                fontSize: '16px',
                                fontWeight: 500,
                                color: '#0a0a0a',
                              }}
                            >
                              {crimeType}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography
                                sx={{
                                  fontFamily: FONT_TEXT,
                                  fontSize: '16px',
                                  fontWeight: 700,
                                  color: '#0a0a0a',
                                }}
                              >
                                {(count as number).toLocaleString()}
                              </Typography>
                              <Box
                                sx={{
                                  fontFamily: FONT_TEXT,
                                  fontSize: '12px',
                                  letterSpacing: '0.1em',
                                  px: 1.25,
                                  py: 0.5,
                                  border: '1px solid',
                                  borderColor: isAboveAverage ? '#c0392b' : '#2d7a4e',
                                  color: isAboveAverage ? '#c0392b' : '#2d7a4e',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {isAboveAverage ? 'Above Avg' : 'Below Avg'}
                              </Box>
                            </Box>
                          </Box>
                          <Box
                            sx={{
                              width: '100%',
                              height: '4px',
                              backgroundColor: '#e8e6df',
                            }}
                          >
                            <Box
                              sx={{
                                width: `${Math.min(percentage * 3, 100)}%`,
                                height: '100%',
                                backgroundColor: isAboveAverage ? '#c0392b' : '#2d7a4e',
                                transition: 'width 0.4s ease',
                              }}
                            />
                          </Box>
                        </Box>
                      );
                    })}
                </Box>

                {/* Above / Below national average summary */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                    gap: 1.5,
                  }}
                >
                  {/* Above national average */}
                  <Box
                    sx={{
                      border: '2px solid #0a0a0a',
                      backgroundColor: '#fff5f5',
                      borderLeft: '4px solid #c0392b',
                      p: 2.75,
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: FONT_TEXT,
                        fontSize: '16px',
                        fontWeight: 700,
                        mb: 1.5,
                        color: '#c0392b',
                      }}
                    >
                      Above National Average ({crimeData.data.above_national_average.length})
                    </Typography>
                    {crimeData.data.above_national_average.length === 0 && (
                      <Typography
                        sx={{
                          fontFamily: FONT_TEXT,
                          fontSize: '16px',
                          fontWeight: 300,
                          color: '#555555',
                        }}
                      >
                        No crime categories are currently above the national average for this postcode.
                      </Typography>
                    )}
                  </Box>

                  {/* Below national average */}
                  <Box
                    sx={{
                      border: '2px solid #0a0a0a',
                      backgroundColor: '#f3fff7',
                      borderLeft: '4px solid #2d7a4e',
                      p: 2.75,
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: FONT_TEXT,
                        fontSize: '16px',
                        fontWeight: 700,
                        mb: 1.5,
                        color: '#2d7a4e',
                      }}
                    >
                      Below National Average ({crimeData.data.below_national_average.length})
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {crimeData.data.below_national_average.map((crime) => (
                        <Box
                          key={crime}
                          sx={{
                            fontFamily: FONT_TEXT,
                            fontSize: '16px',
                            letterSpacing: '0.06em',
                            px: 1.25,
                            py: 0.75,
                            border: '1px solid #e8e6df',
                            backgroundColor: '#ffffff',
                            color: '#0a0a0a',
                          }}
                        >
                          {crime}
                        </Box>
                      ))}
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
            <Divider sx={{ my: 4, borderColor: '#e8e6df' }} />
            
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
                  sx={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#0a0a0a',
                    letterSpacing: '-0.01em',
                    fontFamily: FONT_TITLE,
                  }}
                >
                  Article 4 Directions
                </Typography>
              </Box>
              
              <Typography
                variant="body2"
                sx={{
                  fontSize: '17px',
                  color: '#6b7280',
                  fontFamily: FONT_TEXT,
                  fontWeight: 500,
                  mb: 3,
                  lineHeight: 1.6,
                }}
              >
                Article 4 Directions remove permitted development rights in specific areas, meaning planning permission is required for certain changes that would otherwise be allowed.
              </Typography>

              {article4Data && (
                <Box>
                  {article4Data.data.article4_areas.length > 0 ? (
                    <Box
                      sx={{
                        border: '2px solid #f2c514',
                        backgroundColor: '#fffde8',
                        p: 3,
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: FONT_TITLE,
                          fontSize: '18px',
                          fontWeight: 700,
                          color: '#7a5c00',
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
                              backgroundColor: '#ffffff',
                              border: '2px solid #0a0a0a',
                              p: 2.5,
                            }}
                          >
                            <Typography
                              sx={{
                                fontFamily: FONT_TEXT,
                                fontSize: '16px',
                                fontWeight: 700,
                                color: '#7a5c00',
                                mb: 1,
                              }}
                            >
                              {area.local_authority} - {area.electoral_ward}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: '16px',
                                color: '#444444',
                                fontFamily: FONT_TEXT,
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
                                  fontFamily: FONT_TEXT,
                                  fontSize: '14px',
                                  fontWeight: 600,
                                  color: '#7a5c00',
                                  textDecoration: 'none',
                                  letterSpacing: '0.04em',
                                  borderBottom: '1px solid #7a5c00',
                                  '&:hover': {
                                    color: '#5c4300',
                                    borderBottomColor: '#5c4300',
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
                        border: '2px solid #0a0a0a',
                        backgroundColor: '#f3fff7',
                        borderLeft: '4px solid #2d7a4e',
                        p: 3,
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: FONT_TEXT,
                          fontSize: '16px',
                          fontWeight: 600,
                          color: '#2d7a4e',
                        }}
                      >
                        ✓ No Article 4 Directions apply to this postcode
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '16px',
                          color: '#15803d',
                          fontFamily: FONT_TEXT,
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
            <Divider sx={{ my: 4, borderColor: '#e8e6df' }} />
            
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
                  sx={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#0a0a0a',
                    letterSpacing: '-0.01em',
                    fontFamily: FONT_TITLE,
                  }}
                >
                  Local Housing Allowance (LHA) Rates
                </Typography>
              </Box>
              
              <Typography
                variant="body2"
                sx={{
                  fontSize: '17px',
                  color: '#6b7280',
                  fontFamily: FONT_TEXT,
                  fontWeight: 500,
                  mb: 3,
                  lineHeight: 1.6,
                }}
              >
                LHA rates are used to calculate Housing Benefit for tenants renting from private landlords. Rates are set by the Broad Rental Market Area (BRMA).
              </Typography>

              {brmaLhaData && (
                <Box>
                  {/* BRMA Info Card */}
                  <Box
                    sx={{
                      border: '2px solid #f2c514',
                      backgroundColor: '#fffde8',
                      p: 3,
                      mb: 3,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '14px',
                        color: '#7a5c00',
                        fontFamily: FONT_TEXT,
                        mb: 1,
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        fontWeight: 600,
                      }}
                    >
                      Broad Rental Market Area
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '26px',
                        fontWeight: 700,
                        color: '#7a5c00',
                        fontFamily: FONT_TITLE,
                      }}
                    >
                      {brmaLhaData.data.brma_name}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '16px',
                        color: 'rgba(122,92,0,0.6)',
                        fontFamily: FONT_TEXT,
                        mt: 1,
                        letterSpacing: '0.06em',
                        fontWeight: 500,
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
                        color: '#0a0a0a',
                        fontFamily: FONT_TITLE,
                      }}
                    >
                      Weekly LHA Rates ({brmaLhaData.data.rates[0]?.year || 'Current'})
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3, 1fr)', md: 'repeat(5, 1fr)' },
                      border: '2px solid #0a0a0a',
                      backgroundColor: '#ffffff',
                      overflow: 'hidden',
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
                          textAlign: 'center',
                          borderRight: { xs: 'none', md: '2px solid #0a0a0a' },
                          '&:last-of-type': {
                            borderRight: 'none',
                          },
                          '@media print': {
                            pageBreakInside: 'avoid',
                            breakInside: 'avoid',
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: '14px',
                            color: '#888888',
                            fontFamily: FONT_TEXT,
                            mb: 1.5,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            fontWeight: 600,
                          }}
                        >
                          {rate.beds === 0 ? 'Shared' : rate.beds === 1 ? '1 Bed' : `${rate.beds} Beds`}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '22px',
                            fontWeight: 800,
                            color: '#f2c514',
                            fontFamily: FONT_TITLE,
                            mb: 0.5,
                          }}
                        >
                          £{rate.lha_rate.toFixed(2)}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '14px',
                            color: '#888888',
                            fontFamily: FONT_TEXT,
                            letterSpacing: '0.06em',
                            fontWeight: 500,
                            mb: 1.25,
                          }}
                        >
                          per week
                        </Typography>
                        <Box
                          sx={{
                            height: '1px',
                            backgroundColor: '#e8e6df',
                            my: 1,
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: '14px',
                            color: '#0a0a0a',
                            fontFamily: FONT_TEXT,
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
            <Divider sx={{ my: 4, borderColor: '#e8e6df' }} />

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
                    color: '#0a0a0a',
                    letterSpacing: '-0.01em',
                    fontFamily: FONT_TITLE,
                  }}
                >
                  Area Demographics
                </Typography>
              </Box>

              <Typography
                variant="body2"
                sx={{
                  fontSize: '17px',
                  color: '#6b7280',
                  fontFamily: FONT_TEXT,
                  fontWeight: 500,
                  mb: 3,
                  lineHeight: 1.6,
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
                          p: 3.5,
                          borderRadius: 0,
                          backgroundColor: '#ffffff',
                          border: '2px solid #0a0a0a',
                          boxShadow: 'none',
                          '@media print': {
                            boxShadow: 'none',
                          },
                          }}
                        >
                          <Typography
                            sx={{
                            fontSize: '16px',
                              fontWeight: 700,
                            color: '#0a0a0a',
                            fontFamily: FONT_TEXT,
                            mb: 3,
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
                              gap: 3,
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
                                      transform: scale(1.03);
                                      filter: drop-shadow(0 3px 8px rgba(0,0,0,0.25));
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
                                              fontSize: '16px',
                                              fontWeight: 700,
                                              color: '#ffffff',
                                              fontFamily: FONT_TEXT,
                                              lineHeight: 1.4,
                                              wordBreak: 'break-word',
                                            }}
                                          >
                                            {slice.label}
                                          </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3, mb: 1 }}>
                                          <Typography sx={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)', fontFamily: FONT_TEXT, flexShrink: 0 }}>
                                            Count:
                                          </Typography>
                                          <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#ffffff', fontFamily: FONT_TITLE }}>
                                            {slice.value.toLocaleString()}
                                          </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3 }}>
                                          <Typography sx={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)', fontFamily: FONT_TEXT, flexShrink: 0 }}>
                                            Percentage:
                                          </Typography>
                                          <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#ffffff', fontFamily: FONT_TITLE }}>
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
                                          <Typography sx={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontFamily: FONT_TEXT, flexShrink: 0 }}>
                                            of Total:
                                          </Typography>
                                          <Typography sx={{ fontSize: '16px', fontWeight: 500, color: 'rgba(255,255,255,0.9)', fontFamily: FONT_TEXT }}>
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
                                  fontSize: '12px',
                                  fontWeight: 500,
                                  letterSpacing: '0.14em',
                                  textTransform: 'uppercase',
                                  fill: '#9ca3af',
                                  fontFamily: FONT_TEXT,
                                }}
                                >
                                  Total
                                </text>
                                <text
                                  x="150"
                                  y="168"
                                  textAnchor="middle"
                                  style={{
                                  fontSize: '22px',
                                  fontWeight: 800,
                                  fill: '#0a0a0a',
                                  fontFamily: FONT_TEXT,
                                  }}
                                >
                                  {total.toLocaleString()}
                                </text>
                              </svg>
                            </Box>
                            {/* Legend - Full width below chart */}
                            <Box
                              sx={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 0,
                              }}
                            >
                              {slices.map((slice, index) => (
                                <Box
                                  key={index}
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 2,
                                    py: 1.25,
                                    borderBottom: '1px solid #e8e6df',
                                  }}
                                >
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0 }}>
                                    <Box
                                      sx={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: '50%',
                                        backgroundColor: slice.color,
                                        flexShrink: 0,
                                      }}
                                    />
                                    <Typography
                                      sx={{
                                        fontSize: '16px',
                                        color: '#333333',
                                        fontFamily: FONT_TEXT,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                      }}
                                      title={slice.label}
                                    >
                                      {slice.label}
                                    </Typography>
                                  </Box>
                                  <Typography
                                    sx={{
                                      fontSize: '12px',
                                      fontWeight: 500,
                                      color: '#0a0a0a',
                                      fontFamily: FONT_TEXT,
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
                          p: 3.5,
                          borderRadius: 0,
                          backgroundColor: '#ffffff',
                          border: '2px solid #0a0a0a',
                          boxShadow: 'none',
                          '@media print': {
                            boxShadow: 'none',
                          },
                          }}
                        >
                          <Typography
                            sx={{
                            fontSize: '16px',
                              fontWeight: 700,
                            color: '#0a0a0a',
                            fontFamily: FONT_TEXT,
                            mb: 0.5,
                            }}
                          >
                            {title}
                          </Typography>
                          <Typography
                            sx={{
                            fontSize: '16px',
                            color: '#9ca3af',
                            fontFamily: FONT_TEXT,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            mb: 3,
                            }}
                          >
                            Total: {total.toLocaleString()} people
                          </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {entries.map(([label, value], index) => {
                              const percentage = ((value / total) * 100).toFixed(1);
                              const barWidth = (value / maxValue) * 100;
                              const color = colorScheme[index % colorScheme.length];

                              return (
                                <Box 
                                  key={label}
                                  sx={{
                                    mb: 1,
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
                                        fontWeight: 400,
                                        color: '#0a0a0a',
                                        fontFamily: FONT_TEXT,
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
                                          color: '#0a0a0a',
                                          fontFamily: FONT_TEXT,
                                        }}
                                      >
                                        {value.toLocaleString()}
                                      </Typography>
                                      <Box
                                        sx={{
                                          backgroundColor: '#f7f6f2',
                                          px: 1,
                                          py: 0.5,
                                          borderRadius: 0,
                                          minWidth: '52px',
                                          textAlign: 'center',
                                          border: '1px solid #e8e6df',
                                        }}
                                      >
                                        <Typography
                                          sx={{
                                            fontSize: '16px',
                                            fontWeight: 500,
                                            color: '#0a0a0a',
                                            fontFamily: FONT_TEXT,
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
                                      height: '6px',
                                      backgroundColor: '#e8e6df',
                                      borderRadius: 0,
                                      overflow: 'hidden',
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        width: `${barWidth}%`,
                                        height: '100%',
                                        background: color,
                                        borderRadius: 0,
                                        transition: 'width 0.5s ease-out',
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
                {/* Section label */}
                <SectionTitle
                  sx={{
                    position: 'relative',
                    paddingLeft: 3,
                    mb: 4,
                    fontFamily: FONT_TITLE,
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
  
                {/* Primary company card */}
                <Box
                  sx={{
                    mb: 4,
                    border: '2px solid #f2c514',
                    backgroundColor: '#fffde8',
                    p: 3.5,
                    '@media print': {
                      pageBreakInside: 'avoid',
                      breakInside: 'avoid',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box
                      sx={{
                        width: 46,
                        height: 46,
                        borderRadius: '12px',
                        backgroundColor: '#f2c514',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Typography sx={{ fontSize: '24px' }}>🏢</Typography>
                    </Box>
                    <Typography
                      sx={{
                        fontFamily: FONT_TITLE,
                        fontSize: '22px',
                        fontWeight: 800,
                        color: '#7a5c00',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      CommercialUK Ltd
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: FONT_TEXT,
                      fontSize: '17px',
                      fontWeight: 500,
                      color: '#5a4200',
                      lineHeight: 1.85,
                    }}
                  >
                    At CommercialUK, we believe great property experiences go far beyond listings. Our team is dedicated to
                    providing clear, informed guidance, responsive support, and a seamless digital journey for every client –
                    whether you are a landlord, investor, developer, or business owner searching for the right space. We combine
                    local market expertise with technology to create a smooth, trustworthy process from first enquiry through to
                    completion.
                  </Typography>
                </Box>
  
                {/* Sub-heading */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      backgroundColor: '#f2c514',
                      borderRadius: '50%',
                    }}
                  />
                  <Typography
                    sx={{
                      fontFamily: FONT_TITLE,
                      fontSize: '20px',
                      fontWeight: 700,
                      color: '#0a0a0a',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    A little bit about CommercialUK
                  </Typography>
                </Box>
  
                {/* Two about cards */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box
                    sx={{
                      border: '2px solid #0a0a0a',
                      backgroundColor: '#ffffff',
                      p: 3,
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 2.5,
                      '@media print': {
                        pageBreakInside: 'avoid',
                        breakInside: 'avoid',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        backgroundColor: '#f2c514',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        mt: 0.5,
                      }}
                    >
                      <Typography sx={{ fontSize: '20px' }}>➜</Typography>
                    </Box>
                    <Typography
                      sx={{
                        fontFamily: FONT_TEXT,
                        fontSize: '17px',
                        fontWeight: 500,
                        color: '#444444',
                        lineHeight: 1.85,
                      }}
                    >
                      Our platform is built specifically for the UK commercial property market, bringing together offices, retail,
                      industrial, leisure, and mixed‑use opportunities in one place. By partnering with experienced agents and
                      owners, we ensure every listing is accurate, well‑presented, and supported by the right documentation so that
                      buyers and tenants can act with confidence.
                    </Typography>
                  </Box>
  
                  <Box
                    sx={{
                      border: '2px solid #0a0a0a',
                      backgroundColor: '#ffffff',
                      p: 3,
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 2.5,
                      '@media print': {
                        pageBreakInside: 'avoid',
                        breakInside: 'avoid',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        backgroundColor: '#f2c514',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        mt: 0.5,
                      }}
                    >
                      <Typography sx={{ fontSize: '20px' }}>⚡</Typography>
                    </Box>
                    <Typography
                      sx={{
                        fontFamily: FONT_TEXT,
                        fontSize: '17px',
                        fontWeight: 500,
                        color: '#444444',
                        lineHeight: 1.85,
                      }}
                    >
                      From detailed digital brochures and reporting to tools that help you understand pricing, demand, and local
                      demographics, CommercialUK is designed to simplify complex decisions. Our mission is to make commercial real
                      estate more accessible, transparent, and efficient – so you can focus on what matters most: growing your
                      business and maximising the value of your property.
                    </Typography>
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
                {/* Section title */}
                <SectionTitle
                  sx={{
                    position: 'relative',
                    paddingLeft: 3,
                    fontFamily: FONT_TITLE,
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
    
                {/* Intro card */}
                <Box
                  sx={{
                    mt: 3,
                    mb: 4,
                    border: '2px solid #f2c514',
                    backgroundColor: '#fffde8',
                    p: 3.5,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        backgroundColor: '#f2c514',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        mt: 0.5,
                      }}
                    >
                      <Typography sx={{ fontSize: '20px' }}>📊</Typography>
                    </Box>
                    <Typography
                      sx={{
                        fontFamily: FONT_TEXT,
                        fontSize: '17px',
                        fontWeight: 500,
                        color: '#5a4200',
                        lineHeight: 1.85,
                      }}
                    >
                      We believe in making property information more freely available to the buyers, sellers, landlords and tenants
                      we work closely with. That is why we aggregate data from a variety of different public and licenced sources to
                      include in guides such as this one. Please find a list of our data partners below.
                    </Typography>
                  </Box>
                </Box>
    
                {/* Our Data Partners */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      backgroundColor: '#f2c514',
                      borderRadius: '50%',
                    }}
                  />
                  <Typography
                    sx={{
                      fontFamily: FONT_TITLE,
                      fontSize: '20px',
                      fontWeight: 700,
                      color: '#0a0a0a',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    Our Data Partners
                  </Typography>
                </Box>
    
                {/* Partners grid (simple, flat) */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                    border: '2px solid #0a0a0a',
                    backgroundColor: '#ffffff',
                    mb: 4,
                  }}
                >
                  {[
                    'GOV.UK',
                    'Google Maps',
                    'Google Analytics',
                    'OpenAI / ChatGPT',
                  ].map((name, idx) => (
                    <Box
                      key={name}
                      sx={{
                        p: 3,
                        borderRight: idx === 3 ? 'none' : '2px solid #0a0a0a',
                        borderBottom: { xs: idx < 2 ? '2px solid #0a0a0a' : 'none', md: idx < 2 ? 'none' : 'none' },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        minHeight: 110,
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: FONT_TITLE,
                          fontSize: '18px',
                          fontWeight: 700,
                          color: '#0a0a0a',
                          textAlign: 'center',
                        }}
                      >
                        {name}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: FONT_TEXT,
                          fontSize: '14px',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          color: '#888888',
                          fontWeight: 600,
                        }}
                      >
                        Data Partner
                      </Typography>
                    </Box>
                  ))}
                </Box>
    
                {/* Legal Disclaimer */}
                <Box sx={{ mt: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        backgroundColor: '#f2c514',
                        borderRadius: '50%',
                      }}
                    />
                    <Typography
                      sx={{
                        fontFamily: FONT_TITLE,
                        fontSize: '20px',
                        fontWeight: 700,
                        color: '#0a0a0a',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      Legal Disclaimer
                    </Typography>
                  </Box>
    
                  <Box
                    sx={{
                      border: '2px solid #0a0a0a',
                      borderLeft: '6px solid #0a0a0a',
                      backgroundColor: '#ffffff',
                      p: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      '@media print': {
                        pageBreakInside: 'avoid',
                        breakInside: 'avoid',
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: FONT_TEXT,
                        fontSize: '17px',
                        fontWeight: 500,
                        color: '#444444',
                        lineHeight: 1.85,
                      }}
                    >
                      <Box component="strong" sx={{ fontWeight: 700, color: '#0a0a0a' }}>
                        Disclaimer:
                      </Box>{' '}
                      Whilst all reasonable effort is made to ensure the information in this publication is current, CommercialUK
                      does not warrant the accuracy or completeness (including reliability, currency or suitability) of the data and
                      information contained in this report and accepts no liability (including without limitation, liability in
                      negligence) for any loss or damage or costs (including consequential damage) arising in connection with the
                      data and information contained in this report.
                    </Typography>
    
                    <Typography
                      sx={{
                        fontFamily: FONT_TEXT,
                        fontSize: '16px',
                        fontWeight: 300,
                        color: '#444444',
                        lineHeight: 1.85,
                      }}
                    >
                      The estimate of current value potentially contained in the report may have been manually provided by the Agent;
                      or may be based on a proprietary automated valuation estimate provided by CommercialUK (the CommercialUK
                      Estimate™). Any estimated values are current at the date of the publication only. It is computer generated and
                      is not a professional appraisal of the subject property and should not be relied upon in lieu of appropriate
                      professional advice.
                    </Typography>
    
                    <Typography
                      sx={{
                        fontFamily: FONT_TEXT,
                        fontSize: '16px',
                        fontWeight: 300,
                        color: '#444444',
                        lineHeight: 1.85,
                      }}
                    >
                      The accuracy of the methodology used to develop the CommercialUK Estimate™, the existence of the subject
                      property, and the accuracy of the CommercialUK Estimate™ and all rule sets provided are estimates based on
                      available data and are not guaranteed or warranted. CommercialUK excludes all liability for any loss or damage
                      arising in connection with the CommercialUK Estimate™.
                    </Typography>
                  </Box>
                </Box>
              </ContentSection>
            );
      
      default:
        return (
          <ContentSection>
            <SectionTitle>{sectionName}</SectionTitle>
            <Typography sx={{ fontFamily: FONT_TEXT }}>Content for {sectionName} section</Typography>
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
      <Header
        sx={{
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: { xs: 1.5, sm: 2 },
        }}
      >
        <LogoSection
          sx={{
            mb: { xs: 0.5, sm: 0 },
          }}
        >
          <Box
            component="img"
            src="/images/CUKLogo.png"
            onClick={() => router.push('/')}
            alt="Commercial UK Logo"
            sx={{
              height: { xs: '34px', sm: '40px', md: '50px' },
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
              color: '#111827',
              fontFamily: FONT_TITLE,
              fontSize: { xs: '17px', sm: '19px', md: '22px' },
              wordBreak: 'break-word',
              display: 'block',
              letterSpacing: '-0.02em',
              lineHeight: 1.45,
              textTransform: 'capitalize',
              textAlign: { xs: 'left', sm: 'left' },
            }}
          >
            {report.location.address}
          </Typography>
        </AddressSection>
        <ActionButtonsGroup
          sx={{
            flexDirection: { xs: 'row', sm: 'row', md: 'row' },
            gap: { xs: 1, sm: 1.5, md: 2 },
            '& .MuiButton-root': {
              fontSize: { xs: '11px', sm: '12px', md: '13px' },
              padding: { xs: '4px 10px', sm: '5px 12px', md: '6px 14px' },
              minWidth: { xs: 'auto', sm: 0 },
            },
          }}
        >
          <ActionButton
            variant="outlined"
            className="share-button"
            startIcon={<ShareIcon sx={{ fontSize: { xs: 16, sm: 17, md: 18 } }} />}
            onClick={handleShare}
          >
            Share
          </ActionButton>
          <ActionButton
            variant="contained"
            className="download-button"
            startIcon={<DownloadIcon sx={{ fontSize: { xs: 16, sm: 17, md: 18 } }} />}
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
          {/* Progress bar */}
          <Box
            sx={{
              px: 2.5,
              pt: 1.5,
              pb: 1.75,
              mt: 3,
              borderBottom: '1px solid #e8e6df',
              // Hide progress bar on mobile and tablet; show on larger screens only
              display: { xs: 'none', sm: 'none', md: 'none', lg: 'block' },
            }}
          >
            <Box
              sx={{
                fontFamily: FONT_TEXT,
                fontSize: '11px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#888888',
                fontWeight: 600,
                display: 'flex',
                justifyContent: 'space-between',
                mb: 1,
              }}
            >
              <span>Report Progress</span>
              <span>
                {navigationItems.length} sections
              </span>
            </Box>
            <Box sx={{ height: 2, backgroundColor: '#e8e6df' }}>
              <Box
                sx={{
                  height: '100%',
                  backgroundColor: '#f2c514',
                  width: '100%',
                  transition: 'width 0.3s ease',
                }}
              />
            </Box>
          </Box>

          {/* Nav list */}
          <SidebarList sx={{ flex: 1, py: 1 }}>

            {/* helper renderer */}
            {(() => {
              const renderNavItem = (label: string, opts?: { badge?: string }) => {
                const isActive = activeSection === label;
                const itemIndex = navigationItems.indexOf(label as any);
                const activeIndex = navigationItems.indexOf(activeSection as any);
                const isCompleted =
                  activeIndex > -1 && itemIndex > -1 && itemIndex < activeIndex;

                return (
                  <SidebarItem
                    key={label}
                    onClick={() => scrollToSection(label)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.75,
                      px: 2.5,
                      py: 1.25,
                      cursor: 'pointer',
                      borderLeft: '3px solid',
                      borderLeftColor: isActive ? '#f2c514' : 'transparent',
                      backgroundColor: isActive ? '#fffde8' : 'transparent',
                      '&:hover': {
                        backgroundColor: '#f7f6f2',
                      },
                    }}
                  >
                    <SidebarIcon
                      sx={{
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        color: isCompleted ? '#2d9a6e' : isActive ? '#f2c514' : '#888888',
                      }}
                    >
                      {navigationIcons[label]}
                    </SidebarIcon>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontFamily: FONT_TEXT,
                          fontSize: '16px',
                          fontWeight: isActive ? 700 : 500,
                          color: isCompleted ? '#888888' : '#333333',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {label}
                      </Typography>
                    </Box>
                    {opts?.badge && (
                      <Box
                        sx={{
                          fontFamily: FONT_TEXT,
                          fontSize: '12px',
                          fontWeight: 500,
                          letterSpacing: '0.06em',
                          px: 1,
                          py: 0.4,
                          backgroundColor: '#f2c514',
                          color: '#0a0a0a',
                          flexShrink: 0,
                        }}
                      >
                        {opts.badge}
                      </Box>
                    )}
                    {isCompleted && !opts?.badge && (
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          backgroundColor: '#2d9a6e',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <CheckIcon sx={{ fontSize: 12, color: '#ffffff' }} />
                      </Box>
                    )}
                  </SidebarItem>
                );
              };

              return (
                <>
                  {/* Property group */}
                  <Box
                    sx={{
                      fontFamily: FONT_TITLE,
                      fontSize: '11px',
                      letterSpacing: '0.12em',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: '#888888',
                      px: 2.5,
                      pt: 1,
                      pb: 0.5,
                      display: { xs: 'none', sm: 'none', md: 'none', lg: 'block' },
                    }}
                  >
                    Property
                  </Box>
                  {['Cover', 'Price Analysis', 'Property Details', 'EPC', 'Accommodation (historic data)']
                    .filter((label) => navigationItems.includes(label as any))
                    .map((label) => renderNavItem(label))}

                  <Box
                    sx={{
                      height: 1,
                      backgroundColor: '#e8e6df',
                      my: 0.5,
                      mx: 2.5,
                      // Hide divider on mobile/tablet
                      display: { xs: 'none', sm: 'none', md: 'none', lg: 'block' },
                    }}
                  />

                  {/* Analysis */}
                  <Box
                    sx={{
                      fontFamily: FONT_TITLE,
                      fontSize: '11px',
                      letterSpacing: '0.12em',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: '#888888',
                      px: 2.5,
                      pt: 1,
                      pb: 0.5,
                      display: { xs: 'none', sm: 'none', md: 'none', lg: 'block' },
                    }}
                  >
                    Analysis
                  </Box>
                  {['Mortgage Calculator', 'Demographics Findings', 'Psychographics Analysis']
                    .filter((label) => navigationItems.includes(label as any))
                    .map((label) => renderNavItem(label))}

                  <Box
                    sx={{
                      height: 1,
                      backgroundColor: '#e8e6df',
                      my: 0.5,
                      mx: 2.5,
                      display: { xs: 'none', sm: 'none', md: 'none', lg: 'block' },
                    }}
                  />

                  {/* Local Intelligence */}
                  <Box
                    sx={{
                      fontFamily: FONT_TITLE,
                      fontSize: '11px',
                      letterSpacing: '0.12em',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: '#888888',
                      px: 2.5,
                      pt: 1,
                      pb: 0.5,
                      display: { xs: 'none', sm: 'none', md: 'none', lg: 'block' },
                    }}
                  >
                    Local Intelligence
                  </Box>
                  {navigationItems.includes('Area Details' as any) &&
                    renderNavItem('Area Details', {
                      badge: activeSection === 'Area Details' ? 'Now' : undefined,
                    })}

                  <Box
                    sx={{
                      height: 1,
                      backgroundColor: '#e8e6df',
                      my: 0.5,
                      mx: 2.5,
                      display: { xs: 'none', sm: 'none', md: 'none', lg: 'block' },
                    }}
                  />

                  {/* Appendix */}
                  <Box
                    sx={{
                      fontFamily: FONT_TITLE,
                      fontSize: '11px',
                      letterSpacing: '0.12em',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: '#888888',
                      px: 2.5,
                      pt: 1,
                      pb: 0.5,
                      display: { xs: 'none', sm: 'none', md: 'none', lg: 'block' },
                    }}
                  >
                    Appendix
                  </Box>
                  {['About us', 'Data Sources']
                    .filter((label) => navigationItems.includes(label as any))
                    .map((label) => renderNavItem(label))}
                </>
              );
            })()}
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

