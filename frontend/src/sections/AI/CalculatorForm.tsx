import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { enqueueSnackbar } from 'notistack';
import Loader from '../../components/Loader';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import axios from 'axios';
import axiosInstance from '../../utils/axios';
import { useRouter } from 'next/router';

// ----------------------------------------------------------------------

const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  height: '100%',
  minHeight: '100vh',
  backgroundColor: '#ffffff',
  overflow: 'hidden',
}));

const Sidebar = styled(Box)(({ theme }) => ({
  width: '280px',
  backgroundColor: '#f8f9fa',
  borderRight: '1px solid #e0e0e0',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(3, 0),
  flexShrink: 0,
  [theme.breakpoints.down('md')]: {
    width: '240px',
  },
  [theme.breakpoints.down('sm')]: {
    width: '200px',
  },
}));

const SidebarTitle = styled(Typography)(({ theme }) => ({
  fontSize: '20px',
  fontWeight: 600,
  color: '#1a1a1a',
  padding: theme.spacing(0, 3),
  marginBottom: theme.spacing(2),
}));

const NavList = styled(List)(({ theme }) => ({
  padding: 0,
  flex: 1,
}));

const NavItem = styled(ListItem)<{ active?: boolean; completed?: boolean; unlocked?: boolean }>(({ theme, active, completed, unlocked }) => ({
  padding: 0,
  marginBottom: theme.spacing(0.5),
  opacity: unlocked ? 1 : 0.5,
  cursor: unlocked ? 'pointer' : 'not-allowed',
  '&:hover': {
    backgroundColor: unlocked 
      ? (active ? 'rgba(242, 197, 20, 0.1)' : 'rgba(0, 0, 0, 0.04)')
      : 'transparent',
  },
}));

const NavButton = styled(ListItemButton)<{ active?: boolean; completed?: boolean; unlocked?: boolean }>(({ theme, active, completed, unlocked }) => ({
  padding: theme.spacing(1.5, 3),
  borderRadius: '0 24px 24px 0',
  marginRight: theme.spacing(2),
  backgroundColor: active ? '#f2c514' : 'transparent',
  color: active ? '#000000' : completed ? '#4caf50' : unlocked ? '#666666' : '#999999',
  fontWeight: active ? 600 : completed ? 500 : 400,
  transition: unlocked ? 'all 0.2s ease' : 'none',
  cursor: unlocked ? 'pointer' : 'not-allowed',
  pointerEvents: unlocked ? 'auto' : 'none',
  '&:hover': {
    backgroundColor: unlocked
      ? (active ? '#f2c514' : 'rgba(242, 197, 20, 0.1)')
      : 'transparent',
    color: unlocked ? (active ? '#000000' : '#1a1a1a') : '#999999',
  },
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
}));

const NavText = styled(ListItemText)(({ theme }) => ({
  '& .MuiListItemText-primary': {
    fontSize: '15px',
  },
}));

const StepIcon = styled(Box)(({ theme }) => ({
  marginRight: theme.spacing(1.5),
  display: 'flex',
  alignItems: 'center',
}));

const FormContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}));

const FormContent = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: theme.spacing(4),
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#c1c1c1',
    borderRadius: '4px',
    '&:hover': {
      background: '#a8a8a8',
    },
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const FormSection = styled(Box)<{ active?: boolean }>(({ theme, active }) => ({
  display: active ? 'flex' : 'none',
  flexDirection: 'column',
  maxWidth: '700px',
  margin: '0 auto',
  animation: active ? 'fadeIn 0.3s ease-in' : 'none',
  '@keyframes fadeIn': {
    from: {
      opacity: 0,
      transform: 'translateY(10px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
}));

const FormTitle = styled(Typography)(({ theme }) => ({
  fontSize: '32px',
  fontWeight: 600,
  color: '#1a1a1a',
  marginBottom: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    fontSize: '24px',
  },
}));

const FormDescription = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  color: '#666666',
  marginBottom: theme.spacing(4),
  lineHeight: 1.6,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(3),
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    fontSize: '16px',
    '& fieldset': {
      borderColor: '#e0e0e0',
      borderWidth: '2px',
    },
    '&:hover fieldset': {
      borderColor: '#b0b0b0',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#f2c514',
      borderWidth: '2px',
    },
  },
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.5, 2),
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  width: '100%',
  borderRadius: '12px',
  backgroundColor: '#ffffff',
  fontSize: '16px',
  marginBottom: theme.spacing(3),
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#e0e0e0',
    borderWidth: '2px',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#b0b0b0',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#f2c514',
    borderWidth: '2px',
  },
  '& .MuiSelect-select': {
    padding: theme.spacing(1.5, 2),
  },
}));

const OptionChip = styled(Chip)<{ selected?: boolean }>(({ theme, selected }) => ({
  cursor: 'pointer',
  backgroundColor: selected ? '#f2c514' : '#ffffff',
  color: selected ? '#000000' : '#1a1a1a',
  border: `2px solid ${selected ? '#f2c514' : '#e0e0e0'}`,
  fontWeight: selected ? 600 : 400,
  fontSize: '15px',
  padding: theme.spacing(1.5, 2),
  height: 'auto',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: selected ? '#f2c514' : '#f9f9f9',
    borderColor: '#f2c514',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
}));

const QuickReplyContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(3),
}));

const AddressListContainer = styled(Paper)(({ theme }) => ({
  width: '100%',
  maxHeight: '500px',
  overflowY: 'auto',
  marginBottom: theme.spacing(3),
  border: '2px solid #e0e0e0',
  borderRadius: '12px',
  backgroundColor: '#ffffff',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#c1c1c1',
    borderRadius: '4px',
    '&:hover': {
      background: '#a8a8a8',
    },
  },
  [theme.breakpoints.down('sm')]: {
    maxHeight: '400px',
  },
}));

const AddressListItem = styled(ListItemButton)<{ selected?: boolean }>(({ theme, selected }) => ({
  padding: theme.spacing(2),
  borderBottom: '1px solid #f0f0f0',
  backgroundColor: selected ? '#f2c514' : 'transparent',
  color: selected ? '#000000' : '#000000',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: '#f2c514',
    '@media (hover: none)': {
      backgroundColor: selected ? '#f2c514' : 'transparent',
    },
  },
  '&.Mui-focusVisible': {
    backgroundColor: '#f2c514',
  },
  '&.Mui-selected': {
    backgroundColor: '#f2c514',
    color: '#000000',
    '&:hover': {
      backgroundColor: '#f2c514',
    },
  },
  '&.Mui-active': {
    backgroundColor: '#f2c514',
  },
  '& .MuiTouchRipple-root': {
    display: 'none',
  },
  // Override MUI's default styles more forcefully
  '&.MuiListItemButton-root': {
    backgroundColor: selected ? '#f2c514' : 'transparent',
    '&:hover': {
      backgroundColor: '#f2c514',
    },
  },
  '&:last-child': {
    borderBottom: 'none',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5),
  },
}));

const AddressText = styled(Typography)(({ theme }) => ({
  fontSize: '15px',
  lineHeight: 1.5,
  fontWeight: 400,
  [theme.breakpoints.down('sm')]: {
    fontSize: '14px',
  },
}));

const EmptyState = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  color: '#666666',
}));

const ActionButtons = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginTop: theme.spacing(4),
  justifyContent: 'flex-end',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 4),
  borderRadius: '12px',
  fontSize: '16px',
  fontWeight: 600,
  textTransform: 'none',
  backgroundColor: '#000000',
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#1a1a1a',
  },
  '&:disabled': {
    backgroundColor: '#9e9e9e',
  },
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 4),
  borderRadius: '12px',
  fontSize: '16px',
  fontWeight: 600,
  textTransform: 'none',
  backgroundColor: 'transparent',
  color: '#666666',
  border: '2px solid #e0e0e0',
  '&:hover': {
    backgroundColor: '#f9f9f9',
    borderColor: '#b0b0b0',
  },
}));

const MagicButton = styled(Button)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2, 4),
  marginTop: theme.spacing(2),
  borderRadius: '16px',
  fontSize: '18px',
  fontWeight: 600,
  textTransform: 'none',
  backgroundColor: '#000000',
  color: '#ffffff',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#1a1a1a',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
  },
  '&:disabled': {
    backgroundColor: '#9e9e9e',
  },
}));

const LoadingOverlay = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: '#ffffff',
  zIndex: 10000,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(3),
  '& > *': {
    position: 'relative',
    zIndex: 2,
  },
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(6),
}));

const LoadingText = styled(Typography)(({ theme }) => ({
  fontSize: '42px',
  fontWeight: 700,
  color: '#1a1a1a',
  textAlign: 'center',
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  letterSpacing: '-0.02em',
  [theme.breakpoints.down('sm')]: {
    fontSize: '32px',
  },
}));

const CommandsContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  maxWidth: '800px',
  height: '120px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    maxWidth: '90%',
    height: '100px',
  },
}));

const CommandLine = styled(Box)<{ state?: 'entering' | 'active' | 'exiting' }>(({ theme, state }) => {
  let animation = 'none';
  let opacity = 0;
  let transform = 'translateX(100%)';

  if (state === 'entering') {
    animation = 'slideInFromRight 0.6s ease-out forwards';
    opacity = 0;
    transform = 'translateX(100%)';
  } else if (state === 'active') {
    opacity = 1;
    transform = 'translateX(0)';
  } else if (state === 'exiting') {
    animation = 'slideOutToLeft 0.6s ease-in forwards';
    opacity = 1;
    transform = 'translateX(0)';
  }

  return {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(3),
    padding: theme.spacing(2, 4),
    opacity,
    transform,
    animation,
    width: '100%',
    justifyContent: 'center',
    '@keyframes slideInFromRight': {
      '0%': {
        opacity: 0,
        transform: 'translateX(100%)',
      },
      '100%': {
        opacity: 1,
        transform: 'translateX(0)',
      },
    },
    '@keyframes slideOutToLeft': {
      '0%': {
        opacity: 1,
        transform: 'translateX(0)',
      },
      '100%': {
        opacity: 0,
        transform: 'translateX(-100%)',
      },
    },
    [theme.breakpoints.down('sm')]: {
      gap: theme.spacing(2),
      padding: theme.spacing(1.5, 2),
    },
  };
});

const CommandIcon = styled(Box)(({ theme }) => ({
  fontSize: '48px',
  minWidth: '48px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  animation: 'pulse 2s ease-in-out infinite',
  '@keyframes pulse': {
    '0%, 100%': {
      transform: 'scale(1)',
    },
    '50%': {
      transform: 'scale(1.1)',
    },
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '36px',
    minWidth: '36px',
  },
}));

const CommandText = styled(Typography)(({ theme }) => ({
  fontSize: '28px',
  fontWeight: 500,
  color: '#333333',
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  letterSpacing: '-0.01em',
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: {
    fontSize: '20px',
  },
}));

const ProgressBar = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '4px',
  backgroundColor: '#f0f0f0',
  borderRadius: '2px',
  overflow: 'hidden',
  marginTop: theme.spacing(3),
}));

const ProgressFill = styled(Box)<{ progress?: number }>(({ theme, progress = 0 }) => ({
  height: '100%',
  backgroundColor: '#f2c514',
  width: `${progress}%`,
  transition: 'width 0.5s ease',
  borderRadius: '2px',
}));

const DottedBackground = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  overflow: 'hidden',
  zIndex: 1,
  display: 'grid',
  gridTemplateColumns: 'repeat(50, 1fr)',
  gridTemplateRows: 'repeat(30, 1fr)',
  padding: '20px',
  gap: 0,
}));

const FlickerDot = styled(Box)<{ delay?: number; duration?: number; colorDelay?: number }>(({ theme, delay = 0, duration = 3, colorDelay = 0 }) => ({
  width: '2px',
  height: '2px',
  borderRadius: '50%',
  backgroundColor: 'rgba(180, 180, 180, 0.5)',
  justifySelf: 'center',
  alignSelf: 'center',
  animation: `blip ${duration}s ease-in-out infinite, colorChange ${duration * 2}s ease-in-out infinite`,
  animationDelay: `${delay}s, ${colorDelay}s`,
  '@keyframes blip': {
    '0%, 100%': {
      opacity: 0.4,
      transform: 'scale(1)',
    },
    '50%': {
      opacity: 0.8,
      transform: 'scale(1.3)',
    },
  },
  '@keyframes colorChange': {
    '0%, 100%': {
      backgroundColor: 'rgba(180, 180, 180, 0.5)',
    },
    '33%': {
      backgroundColor: 'rgba(150, 150, 200, 0.6)',
    },
    '66%': {
      backgroundColor: 'rgba(200, 150, 200, 0.6)',
    },
  },
}));

// Property types from the codebase
const PROPERTY_TYPES = [
  'Office',
  'Retail',
  'Industrial',
  'Warehouse',
  'Land',
  'Leisure',
  'Healthcare',
  'Education',
  'Hotel',
  'Restaurant',
  'Student Accommodation',
  'Car Park',
  'Data Centre',
  'Other',
];

const VALUATION_TYPES = [
  { label: 'Sales', value: 'Sales' },
  { label: 'Letting', value: 'Letting' },
  { label: 'Sales and Letting', value: 'Sales and Letting' },
];

const STEPS = [
  { id: 1, title: 'Postcode', description: 'Enter your postcode' },
  { id: 2, title: 'Address', description: 'Select your address' },
  { id: 3, title: 'Property Type', description: 'Choose property type' },
  { id: 4, title: 'Sqft Range', description: 'Enter sqft range' },
  { id: 5, title: 'Valuation', description: 'Select valuation type' },
];

// ----------------------------------------------------------------------

interface CalculatorFormData {
  postcode: string;
  address: string;
  propertyType: string;
  input: {
    minimum: number;
    maximum: number;
  },
  valuationType: string;
  id: string;
  epcData: any;
}

const AI_COMMANDS = [
  { icon: '🔍', text: 'Starting property evaluation...' },
  { icon: '📍', text: 'Analyzing location and postcode data...' },
  { icon: '🏢', text: 'Fetching similar properties in the area...' },
  { icon: '📊', text: 'Checking current market rates...' },
  { icon: '📏', text: 'Evaluating property size and specifications...' },
  { icon: '💷', text: 'Calculating lettings price...' },
  { icon: '£', text: 'Calculating sales price...' },
  { icon: '📈', text: 'Analyzing market trends...' },
  { icon: '🎯', text: 'Generating comprehensive valuation report...' },
  { icon: '✅', text: 'Finalizing your report...' },
];

// Generate dots for background - structured grid pattern
const generateDots = () => {
  const dots = [];
  const rows = 30;
  const cols = 50;
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = (col * 100) / (cols - 1);
      const y = (row * 100) / (rows - 1);
      const delay = Math.random() * 5; // Random animation start delay (0-5s)
      const duration = 2 + Math.random() * 3; // Random duration (2-5s)
      const colorDelay = Math.random() * 3; // Random color change delay (0-3s)
      
      dots.push({
        id: `dot-${row}-${col}`,
        x: `${x}%`,
        y: `${y}%`,
        delay,
        duration,
        colorDelay,
      });
    }
  }
  
  return dots;
};

export default function CalculatorForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CalculatorFormData>({
    postcode: '',
    address: '',
    propertyType: '',
    input: {
      minimum: 0,
      maximum: 0
    },
    valuationType: '',
    id: '',
    epcData: null,
  });
  const [addresses, setAddresses] = useState<string[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
  const [commandState, setCommandState] = useState<'entering' | 'active' | 'exiting'>('entering');
  const [dots] = useState(generateDots());

  const fetchCommercialPlaces = useCallback(async (postcode: string) => {
    setLoadingAddresses(true);
    try {

      const inputPostcode = String(postcode).toUpperCase();
      
      const url = `https://api.getAddress.io/autocomplete/${inputPostcode}?api-key=Sy8w71kY8UCbOPT16f8Vsw49379`;
      
      const response = await axios.get(url);
      const data = response.data;

      if(data.suggestions.length > 0) {
        setAddresses(data.suggestions.map((suggestion: any) => suggestion));
      } else {
        setAddresses([]);
      }

    } catch (error) {
      console.error('Error fetching commercial places:', error);
      enqueueSnackbar('Failed to fetch commercial properties. Please try again.', { variant: 'error' });
      setAddresses([]);
    } finally {
      setLoadingAddresses(false);
    }
  }, []);

  // Activate fetchCommercialPlaces when on step 2 (address selection)


  useEffect(() => {
    if (currentStep === 2 && formData.postcode) {
      fetchCommercialPlaces(formData.postcode);
    }
  }, [currentStep, formData.postcode, fetchCommercialPlaces]);

  // Animate through commands when submitting - 40 seconds total
  useEffect(() => {
    if (!isSubmitting) return;

    // If we're at the last command, stay there until API responds
    if (currentCommandIndex >= AI_COMMANDS.length - 1) {
      setCommandState('active');
      return;
    }

    // Reset to entering state when command changes
    setCommandState('entering');

    // Entering animation: 0.6s
    const enterTimer = setTimeout(() => {
      setCommandState('active');
    }, 600);

    // Active state duration: 2.8s (showing the message)
    const activeTimer = setTimeout(() => {
      setCommandState('exiting');
    }, 3400); // 600ms + 2800ms

    // Exiting animation: 0.6s, then move to next command
    const exitTimer = setTimeout(() => {
      if (currentCommandIndex < AI_COMMANDS.length - 1) {
        setCurrentCommandIndex(prev => prev + 1);
      }
    }, 4000); // 600ms + 2800ms + 600ms = 4000ms (4 seconds per command)

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(activeTimer);
      clearTimeout(exitTimer);
    };
  }, [isSubmitting, currentCommandIndex]);

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const fetchEPC = async (postcode:string) => {
    try {
      if (!postcode || !postcode.trim()) {
        return { message: 'no epc data available for this property' };
      }

      // Scottish postcode prefixes
      const scottishPostcodePrefixes = ['AB', 'DD', 'DG', 'EH', 'FK', 'G', 'HS', 'IV', 'KA', 'KW', 'KY', 'ML', 'PA', 'PH', 'TD', 'ZE'];
      
      // Check if postcode starts with any Scottish prefix
      const trimmedPostcode = postcode.trim().toUpperCase();
      const isScottishPostcode = scottishPostcodePrefixes.some(prefix => trimmedPostcode.startsWith(prefix));
      
      // Different API credentials for Scottish vs England/Wales
      const tokenEnglandWales = "c2hhcmR1bEBjb21tZXJjaWFsdWsuY28udWs6ODU3ZjkyMjlhZGZiYmVmMWE2YWNkNjk5MTUyNmNkM2U3NDQyMGNmZQ==";
      const tokenScotland = "MzExZDI3ZTUtOTM0YS00OThiLWEzOGMtYzk1OWMzNmE1MjFlOmRkMDc1Njc3LTI0ZGItNDE0MC1iZWVlLWMzOGFiYWNiZDJm";
      
      const token = isScottishPostcode ? tokenScotland : tokenEnglandWales;
      
      const headers = {
        'Accept': 'application/json',
        'Authorization': `Basic ${token}`
      };
      
      const baseUrlForScot = 'https://api.epcdata.scot/ew-compatible';
      const baseUrlForEnglandWales = 'https://epc.opendatacommunities.org/api/v1/non-domestic/search';
      
      // Use Scottish URL if postcode is Scottish, otherwise use England & Wales URL
      const baseUrl = isScottishPostcode ? baseUrlForScot : baseUrlForEnglandWales;
      
      const queryParams = {
        'postcode': postcode.trim(),
      };
      
      const params = new URLSearchParams(queryParams);
      const encodedParams = params.toString();
      
      const fullUrl = encodedParams ? `${baseUrl}?${encodedParams}` : baseUrl;
    
      
      try {
        const epcResponse = await fetch(fullUrl, {
          method: 'GET',
          headers: headers,
        });

        const responseBody = await epcResponse.json();

        // Match address from responseBody.rows with formData.address
        if (responseBody.rows && Array.isArray(responseBody.rows) && formData.address) {
          // Normalize addresses for comparison (lowercase, remove extra spaces)
          const normalizedFormAddress = formData.address.toLowerCase().trim().split(/\s+/);
          
          // Check each row for address matches
          for (const row of responseBody.rows) {
            if (row.address) {
              const normalizedRowAddress = row.address.toLowerCase().trim().split(/\s+/);
              
              // Count matching terms
              let matchCount = 0;
              for (const formTerm of normalizedFormAddress) {
                if (normalizedRowAddress.includes(formTerm)) {
                  matchCount++;
                }
              }
              
              // If multiple terms match (2 or more), return this row
              if (matchCount >= 3) {
                return row;
              }
            }
          }
        }
        
        // No matching row found
        return null;
        
        
      } catch (fetchError) {
        
        if (fetchError.name === 'AbortError') {
          throw new Error('Request timeout: EPC API did not respond within 10 seconds');
        }
        throw fetchError;
      }

    } catch (error) {
      console.error('Error fetching EPC data:', error.message || error);
      
      // Return message object instead of throwing errors
      return { message: 'no epc data available for this property' };
    }
  };

  const handleMagicAI = async () => {
    if (!formData.postcode || !formData.address || !formData.propertyType || !formData.input.minimum || !formData.input.maximum || !formData.valuationType) {
      enqueueSnackbar('Please complete all fields', { variant: 'error' });
      return;
    }

    setIsSubmitting(true);
    setCurrentCommandIndex(0); // Reset command animation
    setCommandState('entering'); // Reset animation state

    let data = await fetchEPC(formData.postcode);

    if(data && data.address) { 
      setFormData({ ...formData, epcData: data });
    }

    try {
      // Prepare the form data to send to the API
      const reportData = {
        formData: {
          postcode: formData.postcode,
          address: formData.address,
          propertyType: formData.propertyType,
          input: {
            minimum: formData.input.minimum,
            maximum: formData.input.maximum
          },
          valuationType: formData.valuationType,
          id: formData.id,
          epcData: formData.epcData
        }
      };

      // Call the generate report API with extended timeout
      // Note: This request can take a long time due to AI processing
      const response = await axiosInstance.post('/api/aical/generate-report', reportData, {
        timeout: 300000, // 5 minutes timeout for report generation
      });

      if (response.data && response.data.success && response.data.data) {
        const reportId = response.data.data.id;
        
        if (reportId) {
          // Redirect to report page
          router.push(`/report/${reportId}`);
          enqueueSnackbar('Report generated successfully!', { variant: 'success' });
        } else {
          enqueueSnackbar('Report generated but ID not found', { variant: 'warning' });
        }
      } else {
        enqueueSnackbar(response.data?.message || 'Failed to generate report', { variant: 'error' });
      }
    } catch (error: any) {
      console.error('Error generating report:', error);
      
      // Handle timeout/cancellation errors specifically
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout') || error.message?.includes('canceled') || error.message?.includes('aborted')) {
        enqueueSnackbar('Request timeout: Report generation is taking longer than expected. The backend may still be processing. Please wait a moment and check your reports.', { variant: 'warning' });
      } else if (error.response) {
        // Server responded with error status
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to generate report. Please try again.';
        enqueueSnackbar(errorMessage, { variant: 'error' });
      } else if (error.request) {
        // Request was made but no response received
        enqueueSnackbar('No response from server. Please check your connection and try again.', { variant: 'error' });
      } else {
        // Something else happened
        const errorMessage = error?.message || 'Failed to generate report. Please try again.';
        enqueueSnackbar(errorMessage, { variant: 'error' });
      }
    } finally {
      setIsSubmitting(false);
    }

  };

  const isStepCompleted = (step: number) => {
    switch (step) {
      case 1:
        return formData.postcode.length >= 5;
      case 2:
        return formData.address.length > 0;
      case 3:
        return formData.propertyType.length > 0;
      case 4:
        return formData.input.minimum > 0 && formData.input.maximum > 0 &&
               !isNaN(formData.input.minimum) && !isNaN(formData.input.maximum) &&
               formData.input.minimum <= formData.input.maximum;
      case 5:
        return formData.valuationType.length > 0;
      default:
        return false;
    }
  };

  const isStepUnlocked = (step: number) => {
    if (step === 1) return true; // First step is always unlocked
    // A step is unlocked if the previous step is completed
    return isStepCompleted(step - 1);
  };

  const canProceed = () => {
    return isStepCompleted(currentStep);
  };

  const handleStepClick = (step: number) => {
    if (isStepUnlocked(step)) {
      setCurrentStep(step);
    }

    console.log(formData);
  };


  return (
    <>
      <Container>
        <Sidebar>
          <SidebarTitle>Property Valuation</SidebarTitle>
          <Divider sx={{ mb: 2 }} />
          <NavList>
            {STEPS.map((step) => {
              const completed = isStepCompleted(step.id);
              const active = currentStep === step.id;
              const unlocked = isStepUnlocked(step.id);
              
              return (
                <NavItem
                  key={step.id}
                  active={active}
                  completed={completed}
                  unlocked={unlocked}
                >
                  <NavButton
                    active={active}
                    completed={completed}
                    unlocked={unlocked}
                    onClick={() => handleStepClick(step.id)}
                    disabled={!unlocked}
                  >
                    <StepIcon>
                      {completed ? (
                        <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                      ) : (
                        <RadioButtonUncheckedIcon 
                          sx={{ 
                            fontSize: 20,
                            color: unlocked ? 'inherit' : '#999999'
                          }} 
                        />
                      )}
                    </StepIcon>
                    <NavText
                      primary={step.title}
                      secondary={step.description}
                    />
                  </NavButton>
                </NavItem>
              );
            })}
          </NavList>
        </Sidebar>

        <FormContainer>
          <FormContent>
            {/* Step 1: Postcode */}
            <FormSection active={currentStep === 1}>
              <FormTitle>Enter Your Postcode</FormTitle>
              <FormDescription>
                Please enter your UK postcode to begin the property valuation process.
              </FormDescription>
              
              <StyledTextField
                placeholder="e.g., SW1A 1AA"
                value={formData.postcode}
                onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                label="Postcode"
                variant="outlined"
                autoFocus
              />

              <ActionButtons>
                <PrimaryButton
                  onClick={handleNext}
                  disabled={!canProceed()}
                >
                  Continue <ArrowForwardIcon />
                </PrimaryButton>
              </ActionButtons>
            </FormSection>

            {/* Step 2: Address */}
            <FormSection active={currentStep === 2}>
              <FormTitle>Select Your Address</FormTitle>
              <FormDescription>
                We found {addresses.length} {addresses.length === 1 ? 'address' : 'addresses'} for your postcode. Please select the correct one.
              </FormDescription>
              
              {loadingAddresses ? (
                <Box display="flex" justifyContent="center" alignItems="center" py={4}>
                  <CircularProgress />
                </Box>
              ) : addresses.length > 0 ? (
                <AddressListContainer>
                  <List disablePadding>
                    {addresses.map((addr: any , index: number) => (
                      <ListItem key={index} disablePadding>
                        <AddressListItem
                          selected={formData.address === addr.address}
                          onClick={() => setFormData({ ...formData, address: addr.address, id: addr.id })}
                          disableRipple
                        >
                          <AddressText>{addr.address}</AddressText>
                        </AddressListItem>
                      </ListItem>
                    ))}
                  </List>
                </AddressListContainer>
              ) : (
                <EmptyState>
                  <Typography variant="body1" color="text.secondary">
                    No addresses found for this postcode. Please try a different postcode.
                  </Typography>
                </EmptyState>
              )}

              <ActionButtons>
                {/* <SecondaryButton onClick={handleBack}>
                  Back
                </SecondaryButton> */}
                <PrimaryButton
                  onClick={handleNext}
                  disabled={!canProceed()}
                >
                  Continue <ArrowForwardIcon sx={{ ml: 1 }} />
                </PrimaryButton>
              </ActionButtons>
            </FormSection>

            {/* Step 3: Property Type */}
            <FormSection active={currentStep === 3}>
              <FormTitle>Property Type</FormTitle>
              <FormDescription>
                What type of property are you looking to value?
              </FormDescription>
              
              <QuickReplyContainer>
                {PROPERTY_TYPES.map((type) => (
                  <OptionChip
                    key={type}
                    label={type}
                    selected={formData.propertyType === type}
                    onClick={() => setFormData({ ...formData, propertyType: type })}
                  />
                ))}
              </QuickReplyContainer>

              <ActionButtons>
                {/* <SecondaryButton onClick={handleBack}>
                  Back
                </SecondaryButton> */}
                <PrimaryButton
                  onClick={handleNext}
                  disabled={!canProceed()}
                >
                  Continue
                </PrimaryButton>
              </ActionButtons>
            </FormSection>

            {/* Step 4: Sqft Range */}
            <FormSection active={currentStep === 4}>
              <FormTitle>Property Size Range</FormTitle>
              <FormDescription>
                Please enter the minimum and maximum square footage (sqft) for the property.
              </FormDescription>
              
              <StyledTextField
                placeholder="e.g., 1000"
                value={formData.input.minimum === 0 ? '' : formData.input.minimum.toString()}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setFormData({ ...formData, input: { ...formData.input, minimum: value === '' ? 0 : Number(value) } });
                }}
                label="Minimum Sqft"
                variant="outlined"
                type="number"
                required
                error={formData.input.minimum !== 0 && (isNaN(formData.input.minimum) || formData.input.minimum <= 0)}
                helperText={formData.input.minimum !== 0 && (isNaN(formData.input.minimum) || formData.input.minimum <= 0) ? 'Please enter a valid positive number' : ''}
              />

              <StyledTextField
                placeholder="e.g., 5000"
                value={formData.input.maximum === 0 ? '' : formData.input.maximum.toString()}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setFormData({ ...formData, input: { ...formData.input, maximum: value === '' ? 0 : Number(value) } });
                }}
                label="Maximum Sqft"
                variant="outlined"
                type="number"
                required
                error={formData.input.maximum !== 0 && (
                  isNaN(formData.input.maximum) || 
                  formData.input.maximum <= 0 || 
                  (formData.input.minimum > 0 && formData.input.maximum < formData.input.minimum)
                )}
                helperText={
                  formData.input.maximum !== 0 && (
                    isNaN(formData.input.maximum) || formData.input.maximum <= 0
                      ? 'Please enter a valid positive number'
                      : formData.input.minimum > 0 && formData.input.maximum < formData.input.minimum
                      ? 'Maximum must be greater than or equal to minimum'
                      : ''
                  )
                }
              />

              <ActionButtons>
                {/* <SecondaryButton onClick={handleBack}>
                  Back
                </SecondaryButton> */}
                <PrimaryButton
                  onClick={handleNext}
                  disabled={!canProceed()}
                >
                  Continue <ArrowForwardIcon sx={{ ml: 1 }} />
                </PrimaryButton>
              </ActionButtons>
            </FormSection>

            {/* Step 5: Valuation Type */}
            <FormSection active={currentStep === 5}>
              <FormTitle>Valuation Type</FormTitle>
              <FormDescription>
                What type of valuation are you looking for?
              </FormDescription>
              
              <QuickReplyContainer>
                {VALUATION_TYPES.map((type) => (
                  <OptionChip
                    key={type.value}
                    label={type.label}
                    selected={formData.valuationType === type.value}
                    onClick={() => setFormData({ ...formData, valuationType: type.value })}
                  />
                ))}
              </QuickReplyContainer>

              <ActionButtons>
                {/* <SecondaryButton onClick={handleBack}>
                  Back
                </SecondaryButton> */}
              </ActionButtons>

              {formData.valuationType && (
                <MagicButton
                  onClick={() => handleMagicAI()}
                  disabled={isSubmitting}

                >
                  ✨ Magic AI
                </MagicButton>
              )}
            </FormSection>
          </FormContent>
        </FormContainer>
      </Container>

      {isSubmitting && (
        <LoadingOverlay>
          <DottedBackground>
            {dots.map((dot) => (
              <FlickerDot
                key={dot.id}
                delay={dot.delay}
                duration={dot.duration}
                colorDelay={dot.colorDelay}
              />
            ))}
          </DottedBackground>
          
          <LoadingContainer>

            <Box component="img" src={'/images/loader-img.png'} alt="Loading" sx={{ width: '100px', height: '100px', marginBottom: '20px' }} ></Box>
            
            <LoadingText>AI is Generating Your Report</LoadingText>
            
            <CommandsContainer>
              {AI_COMMANDS.map((command, index) => {
                // Only render the current command
                if (index !== currentCommandIndex) return null;
                
                return (
                  <CommandLine 
                    key={`${index}-${currentCommandIndex}`} 
                    state={commandState}
                  >
                    <CommandIcon>
                      {command.icon}
                    </CommandIcon>
                    <CommandText>
                      {command.text}
                    </CommandText>
                  </CommandLine>
                );
              })}
            </CommandsContainer>
            
            <ProgressBar>
              <ProgressFill 
                progress={
                  currentCommandIndex >= AI_COMMANDS.length - 1 
                    ? 85 
                    : ((currentCommandIndex + 1) / AI_COMMANDS.length) * 100
                } 
              />
            </ProgressBar>
          </LoadingContainer>
        </LoadingOverlay>
      )}
    </>
  );
}
