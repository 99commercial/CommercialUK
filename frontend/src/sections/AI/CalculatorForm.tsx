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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { enqueueSnackbar } from 'notistack';
import Loader from '../../components/Loader';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LockIcon from '@mui/icons-material/Lock';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AssignmentIcon from '@mui/icons-material/Assignment';
import axiosInstance from '../../utils/axios';
import { useRouter } from 'next/router';

// ----------------------------------------------------------------------

const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  height: '100%',
  minHeight: '100vh',
  backgroundColor: '#ffffff',
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
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
    width: '100%',
    borderRight: 'none',
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
    padding: theme.spacing(0),
    maxHeight: 'none',
    overflowY: 'visible',
    position: 'relative',
    minHeight: '120px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  [theme.breakpoints.down('sm')]: {
    minHeight: '110px',
  },
}));

const SidebarTitle = styled(Typography)(({ theme }) => ({
  fontSize: '20px',
  fontWeight: 600,
  color: '#1a1a1a',
  padding: theme.spacing(0, 3),
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('md')]: {
    fontSize: '18px',
    padding: theme.spacing(2, 2, 0, 2),
    marginBottom: 0,
    paddingBottom: theme.spacing(1),
    textAlign: 'center',
    alignSelf: 'center',
    flex: '0 0 auto',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '16px',
    padding: theme.spacing(1.5, 1.5, 0, 1.5),
    paddingBottom: theme.spacing(0.5),
  },
}));

const NavList = styled(List)(({ theme }) => ({
  padding: 0,
  flex: 1,
  [theme.breakpoints.down('md')]: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    marginTop: 'auto',
    overflowX: 'auto',
    overflowY: 'hidden',
    flexWrap: 'nowrap',
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
    position: 'relative',
    flex: '0 0 auto',
    scrollBehavior: 'smooth',
    WebkitOverflowScrolling: 'touch',
    '&::-webkit-scrollbar': {
      height: '4px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#c1c1c1',
      borderRadius: '3px',
      '&:hover': {
        background: '#a8a8a8',
      },
    },
  },
  [theme.breakpoints.down('sm')]: {
    padding: 0,
    paddingBottom: 0,
    marginBottom: '0px',
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
  },
}));

const NavItem = styled(ListItem)<{ active?: boolean; completed?: boolean; unlocked?: boolean }>(({ theme, active, completed, unlocked }) => ({
  padding: 0,
  marginBottom: theme.spacing(1),
  opacity: unlocked ? 1 : 0.5,
  cursor: unlocked ? 'pointer' : 'not-allowed',
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  '&:hover': {
    backgroundColor: unlocked 
      ? (active ? 'rgba(242, 197, 20, 0.1)' : 'rgba(0, 0, 0, 0.04)')
      : 'transparent',
  },
  [theme.breakpoints.down('md')]: {
    flex: '1 1 auto',
    minWidth: 'auto',
    width: 'auto',
    padding: 0,
    paddingBottom: 0,
    display: 'flex',
    alignItems: 'flex-end',
    marginBottom: '1px',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: 'auto',
    width: 'auto',
    marginBottom: '1px',
  },
}));

const NavButton = styled(ListItemButton)<{ active?: boolean; completed?: boolean; unlocked?: boolean }>(({ theme, active, completed, unlocked }) => ({
  padding: theme.spacing(1.5, 3),
  borderRadius: '0 24px 24px 0',
  marginRight: theme.spacing(2),
  backgroundColor: active ? '#f2c514' : 'transparent',
  color: active ? '#000000' : completed ? '#4caf50' : unlocked ? '#666666' : '#999999',
  fontWeight: active ? 600 : completed ? 500 : 400,
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  transition: unlocked ? 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
  cursor: unlocked ? 'pointer' : 'not-allowed',
  pointerEvents: unlocked ? 'auto' : 'none',
  position: 'relative',
  '&:hover': {
    backgroundColor: unlocked
      ? (active ? '#f2c514' : '#f2c514')
      : 'transparent',
    color: unlocked ? (active ? '#000000' : '#000000') : '#999999',
    transform: unlocked ? 'translateY(-1px)' : 'none',
    boxShadow: unlocked && !active ? '0 4px 12px rgba(242, 197, 20, 0.3)' : 'none',
  },
  '&:active': {
    transform: unlocked ? 'translateY(0)' : 'none',
  },
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  [theme.breakpoints.down('md')]: {
    borderRadius: 0,
    marginRight: 0,
    padding: active 
      ? `${theme.spacing(1.25)} ${theme.spacing(1.5)} 0 ${theme.spacing(1.5)}`
      : theme.spacing(1.25, 1.5),
    whiteSpace: 'nowrap',
    width: 'auto',
    minWidth: '80px',
    flex: '1 1 auto',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    color: active ? '#000000' : (completed ? '#4caf50' : unlocked ? '#1a1a1a' : '#999999'),
    fontWeight: active ? 700 : unlocked ? 500 : 400,
    fontSize: '15px',
    border: 'none',
    borderBottom: active ? '3px solid #f2c514' : 'none',
    boxShadow: 'none',
    background: active 
      ? 'linear-gradient(to bottom, rgba(242, 197, 20, 0.1) 0%, rgba(242, 197, 20, 0.05) 100%)'
      : 'transparent',
    marginBottom: active ? '-1px' : '0px',
    position: 'relative',
    zIndex: active ? 2 : 1,
    '&:hover': {
      backgroundColor: 'transparent',
      background: unlocked 
        ? 'linear-gradient(to bottom, rgba(242, 197, 20, 0.15) 0%, rgba(242, 197, 20, 0.08) 100%)'
        : 'transparent',
      color: unlocked ? '#000000' : '#999999',
      borderBottom: unlocked ? '3px solid #f2c514' : 'none',
      paddingBottom: unlocked ? 0 : theme.spacing(1.25),
      marginBottom: unlocked ? '-1px' : '0px',
      zIndex: unlocked ? 2 : 1,
      transform: 'none',
      boxShadow: 'none',
    },
  },
  [theme.breakpoints.down('sm')]: {
    borderRadius: 0,
    marginRight: 0,
    padding: active 
      ? `${theme.spacing(1)} ${theme.spacing(1.25)} 0 ${theme.spacing(1.25)}`
      : theme.spacing(1, 1.25),
    width: 'auto',
    minWidth: '70px',
    flex: '1 1 auto',
    fontSize: '14px',
    marginBottom: active ? '-1px' : '0px',
    position: 'relative',
    zIndex: active ? 2 : 1,
  },
}));

const NavText = styled(ListItemText)<{ active?: boolean }>(({ theme, active }) => ({
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  '& .MuiListItemText-primary': {
    fontSize: '15px',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    letterSpacing: '-0.01em',
    [theme.breakpoints.down('md')]: {
      fontSize: '15px',
      lineHeight: 1.4,
      fontWeight: active ? 700 : 500,
      color: active ? '#000000' : '#1a1a1a',
      letterSpacing: '-0.01em',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '14px',
      lineHeight: 1.4,
      letterSpacing: '-0.005em',
    },
  },
  '& .MuiListItemText-secondary': {
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
  [theme.breakpoints.down('md')]: {
    margin: 0,
    padding: 0,
    flex: 'none',
    '& .MuiListItemText-primary': {
      margin: 0,
      padding: 0,
    },
  },
}));

const StepIcon = styled(Box)<{ active?: boolean }>(({ theme, active }) => ({
  marginRight: theme.spacing(1.5),
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
  [theme.breakpoints.down('md')]: {
    marginRight: active ? theme.spacing(0.75) : theme.spacing(0.5),
    '& svg': {
      fontSize: active ? '16px !important' : '14px !important',
      color: active ? '#000000 !important' : 'inherit',
    },
  },
  [theme.breakpoints.down('sm')]: {
    marginRight: active ? theme.spacing(0.625) : theme.spacing(0.4),
    '& svg': {
      fontSize: active ? '15px !important' : '13px !important',
      color: active ? '#000000 !important' : 'inherit',
    },
  },
}));

const FormContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    minHeight: 0,
  },
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
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(3),
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
  width: '100%',
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
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
    padding: theme.spacing(0, 1),
  },
  [theme.breakpoints.down('sm')]: {
    padding: 0,
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
  [theme.breakpoints.down('md')]: {
    fontSize: '15px',
    marginBottom: theme.spacing(3),
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '14px',
    marginBottom: theme.spacing(2.5),
  },
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
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(2.5),
    '& .MuiOutlinedInput-root': {
      fontSize: '15px',
    },
    '& .MuiInputBase-input': {
      padding: theme.spacing(1.25, 1.75),
    },
  },
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(2),
    '& .MuiOutlinedInput-root': {
      fontSize: '14px',
    },
    '& .MuiInputBase-input': {
      padding: theme.spacing(1.25, 1.5),
    },
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
  [theme.breakpoints.down('md')]: {
    fontSize: '14px',
    padding: theme.spacing(1.25, 1.75),
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '13px',
    padding: theme.spacing(1, 1.5),
  },
}));

const QuickReplyContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down('md')]: {
    gap: theme.spacing(1.25),
    marginBottom: theme.spacing(2.5),
  },
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
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
  [theme.breakpoints.down('md')]: {
    maxHeight: '450px',
    marginBottom: theme.spacing(2.5),
  },
  [theme.breakpoints.down('sm')]: {
    maxHeight: '350px',
    marginBottom: theme.spacing(2),
    borderRadius: '8px',
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
  [theme.breakpoints.down('md')]: {
    marginTop: theme.spacing(3),
  },
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    marginTop: theme.spacing(2.5),
    gap: theme.spacing(1.5),
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
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1.25, 3),
    fontSize: '15px',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.25, 2.5),
    fontSize: '14px',
    width: '100%',
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
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1.75, 3),
    fontSize: '17px',
    marginTop: theme.spacing(1.5),
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5, 2.5),
    fontSize: '16px',
    marginTop: theme.spacing(1.5),
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

export interface AddressSuggestion {
  postcode: string;
  postcode_inward: string;
  postcode_outward: string;
  post_town: string;
  dependant_locality?: string;
  thoroughfare?: string;
  building_number?: string;
  building_name?: string;
  organisation_name?: string;
  line_1: string;
  line_2?: string;
  line_3?: string;
  udprn: number;
  longitude?: number;
  latitude?: number;
  eastings?: number;
  northings?: number;
  [key: string]: any;
}

function formatAddress(addr: AddressSuggestion): string {
  const parts: string[] = [];
  if (addr.line_1) parts.push(addr.line_1);
  if (addr.line_2) parts.push(addr.line_2);
  if (addr.line_3) parts.push(addr.line_3);
  if (addr.post_town) parts.push(addr.post_town);
  if (addr.postcode) parts.push(addr.postcode);
  return parts.filter(Boolean).join(', ');
}

function getAddressString(addr: AddressSuggestion | string | null | undefined): string {
  if (!addr) return '';
  if (typeof addr === 'string') return addr;
  return formatAddress(addr);
}

interface CalculatorFormData {
  postcode: string;
  address: AddressSuggestion | string;
  addressDetails: AddressSuggestion | null; // Full address object when selected
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
    addressDetails: null,
    propertyType: '',
    input: {
      minimum: 0,
      maximum: 0
    },
    valuationType: '',
    id: '',
    epcData: null,
  });
  const [addresses, setAddresses] = useState<AddressSuggestion[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
  const [commandState, setCommandState] = useState<'entering' | 'active' | 'exiting'>('entering');
  const [dots] = useState(generateDots());
  
  // Subscription check state
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false);
  const [subscriptionDialogUserRole, setSubscriptionDialogUserRole] = useState<'agent' | 'user' | null>(null);

  const fetchCommercialPlaces = useCallback(async (postcode: string) => {
    setLoadingAddresses(true);
    try {
      const inputPostcode = String(postcode).trim().toUpperCase();
      const response = await axiosInstance.get('/api/aical/commercial-places', {
        params: { postcode: inputPostcode },
      });
      const data = response.data;

      if (data.suggestions?.length > 0) {
        setAddresses(data.suggestions as AddressSuggestion[]);
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

  // Check subscription status (only when user is logged in; parent AICalculator shows Login when not)
  const checkSubscription = () => {
    if (typeof window === 'undefined') return;

    try {
      const userString = localStorage.getItem('user');
      if (!userString) {
        setSubscriptionDialogOpen(false);
        return;
      }

      const user = JSON.parse(userString);
      const subscription = user?.subscription || null;
      const role = user?.role === 'agent' ? 'agent' : 'user';

      // If subscription is null, show dialog
      if (subscription === null) {
        setSubscriptionDialogUserRole(role);
        setSubscriptionDialogOpen(true);
        return;
      }

      // If subscription exists, check isExpired
      if (subscription.isExpired === true) {
        setSubscriptionDialogUserRole(role);
        setSubscriptionDialogOpen(true);
        return;
      }

      // If not expired, check reportCount
      const reportCount = subscription?.reportCount ?? 0;
      if (reportCount <= 0) {
        setSubscriptionDialogUserRole(role);
        setSubscriptionDialogOpen(true);
        return;
      }

      // If reportCount > 0, allow access (don't show dialog)
      setSubscriptionDialogUserRole(null);
      setSubscriptionDialogOpen(false);
    } catch (error) {
      console.error('Error checking subscription:', error);
      setSubscriptionDialogUserRole('user');
      setSubscriptionDialogOpen(true);
    }
  };

  useEffect(() => {
    checkSubscription();

    // Listen for storage changes (e.g., when subscription is updated)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user') {
        checkSubscription();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also check periodically in case localStorage is updated in the same tab
    const interval = setInterval(checkSubscription, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

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
      const tokenEnglandWales = process.env.NEXT_PUBLIC_TOKEN_ENGLAND_WALES;
      const tokenScotland = process.env.NEXT_PUBLIC_TOKEN_SCOT;
      
      const token = isScottishPostcode ? tokenScotland : tokenEnglandWales;
      
      const headers = {
        'Accept': 'application/json',
        'Authorization': `Basic ${token}`
      };
      
      const baseUrlForScot = process.env.NEXT_PUBLIC_BASE_URL_SCOT;
      const baseUrlForEnglandWales = process.env.NEXT_PUBLIC_BASE_URL_ENGLAND_WALES;
      
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
        const addressStr = getAddressString(formData.address);
        if (responseBody.rows && Array.isArray(responseBody.rows) && addressStr) {
          // Normalize addresses for comparison (lowercase, remove extra spaces)
          const normalizedFormAddress = addressStr.toLowerCase().trim().split(/\s+/);
          
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
          address: getAddressString(formData.address),
          addressDetails: formData.addressDetails ?? (typeof formData.address === 'object' ? formData.address : undefined),
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

        let user = localStorage.getItem('user');
        user = JSON.parse(user);
        
        if (user.role === 'user') {
          user.report_count = user.report_count - 1;
          localStorage.setItem('user', JSON.stringify(user));
        }
        
        
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
        return !!formData.addressDetails || (!!formData.address && (typeof formData.address === 'string' ? formData.address.length > 0 : true));
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
          <Divider sx={{ mb: 2, display: { xs: 'none', md: 'block' } }} />
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
                    <StepIcon active={active}>
                      {completed && !active ? (
                        <CheckCircleIcon sx={{ 
                          color: { xs: '#4caf50', md: '#4caf50' }, 
                          fontSize: { xs: 14, md: 20 },
                          display: { xs: 'none', md: 'block' },
                        }} />
                      ) : active ? (
                        <CheckCircleIcon sx={{ 
                          color: { xs: '#000000', md: '#4caf50' }, 
                          fontSize: { xs: 16, md: 20 },
                        }} />
                      ) : (
                        <RadioButtonUncheckedIcon 
                          sx={{ 
                            fontSize: { xs: 14, md: 20 },
                            color: { xs: 'transparent', md: unlocked ? 'inherit' : '#999999' },
                            display: { xs: 'none', md: 'block' },
                          }} 
                        />
                      )}
                    </StepIcon>
                    <NavText
                      active={active}
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
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    postcode: e.target.value,
                    address: '',
                    addressDetails: null,
                    id: '',
                  })
                }
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
                    {addresses.map((addr, index) => (
                      <ListItem key={addr.udprn ?? index} disablePadding>
                        <AddressListItem
                          selected={
                            typeof formData.address === 'object'
                              ? formData.address?.udprn === addr.udprn
                              : false
                          }
                          onClick={() =>
                            setFormData({
                              ...formData,
                              address: addr,
                              addressDetails: addr,
                              id: String(addr.udprn ?? ''),
                            })
                          }
                          disableRipple
                        >
                          <AddressText>{formatAddress(addr)}</AddressText>
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

      {/* Subscription Dialog */}
      <Dialog
        open={subscriptionDialogOpen}
        onClose={() => {}}
        maxWidth="md"
        fullWidth
        disableEscapeKeyDown
        PaperProps={{
          sx: {
            borderRadius: '24px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            overflow: 'hidden',
            position: 'relative',
            minHeight: { xs: 380, sm: 460 },
          },
        }}
      >
        {/* Decorative background gradient */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '120px',
            background: 'linear-gradient(135deg, rgba(242, 197, 20, 0.1) 0%, rgba(242, 197, 20, 0.05) 100%)',
            zIndex: 0,
          }}
        />
        
        <DialogTitle
          sx={{
            pt: 4,
            pb: 2,
            px: 4,
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f2c514 0%, #f4d03f 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(242, 197, 20, 0.4)',
              }}
            >
              <LockIcon sx={{ fontSize: 40, color: '#000' }} />
            </Box>
          </Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '28px', sm: '32px' },
              color: '#1a1a1a',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            {subscriptionDialogUserRole === 'agent' ? 'Subscription Required' : 'Insufficient Credits'}
          </Typography>
        </DialogTitle>
        
        <DialogContent
          sx={{
            px: 4,
            pb: 2,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {subscriptionDialogUserRole === 'user' ? (
            <>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: '18px',
                    fontWeight: 500,
                    color: '#333333',
                    lineHeight: 1.6,
                  }}
                >
                  You don&apos;t have enough credits for evaluation report generation.
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '15px',
                    color: '#666666',
                    mt: 1,
                    lineHeight: 1.6,
                  }}
                >
                  Credits are used each time you generate a property evaluation report.
                </Typography>
              </Box>

              {/* About credits - user */}
              <Box
                sx={{
                  mt: 2,
                  p: 2.5,
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(242, 197, 20, 0.06) 0%, rgba(242, 197, 20, 0.02) 100%)',
                  border: '1px solid rgba(242, 197, 20, 0.15)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <InfoOutlinedIcon sx={{ fontSize: 24, color: '#f2c514', mr: 1.5 }} />
                  <Typography
                    variant="body2"
                    sx={{ fontSize: '15px', fontWeight: 600, color: '#1a1a1a' }}
                  >
                    About your credits
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{ fontSize: '14px', color: '#666666', lineHeight: 1.6, pl: 5 }}
                >
                  Check your account dashboard to view your credit balance. Contact your account administrator or upgrade your plan to get more evaluation reports.
                </Typography>
              </Box>

              {/* What reports give you */}
              <Box
                sx={{
                  mt: 2,
                  p: 2.5,
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(242, 197, 20, 0.06) 0%, rgba(242, 197, 20, 0.02) 100%)',
                  border: '1px solid rgba(242, 197, 20, 0.15)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <AssignmentIcon sx={{ fontSize: 24, color: '#f2c514', mr: 1.5 }} />
                  <Typography
                    variant="body2"
                    sx={{ fontSize: '15px', fontWeight: 600, color: '#1a1a1a' }}
                  >
                    What evaluation reports include
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{ fontSize: '14px', color: '#666666', lineHeight: 1.6, pl: 5 }}
                >
                  Property valuations, market analysis, and insights to help you make informed decisions.
                </Typography>
              </Box>
            </>
          ) : (
            <>
              <Box sx={{ textAlign: 'center', mb: 1 }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: '18px',
                    fontWeight: 500,
                    color: '#333333',
                    mb: 2,
                    lineHeight: 1.6,
                  }}
                >
                  You need an active subscription to generate reports.
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '16px',
                    color: '#666666',
                    lineHeight: 1.6,
                  }}
                >
                  Please subscribe to a plan to access this feature.
                </Typography>
              </Box>
              
              {/* Feature highlights - agent only */}
              <Box
                sx={{
                  mt: 3,
                  p: 2.5,
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(242, 197, 20, 0.08) 0%, rgba(242, 197, 20, 0.03) 100%)',
                  border: '1px solid rgba(242, 197, 20, 0.2)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <CreditCardIcon sx={{ fontSize: 24, color: '#f2c514', mr: 1.5 }} />
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '15px',
                      fontWeight: 600,
                      color: '#1a1a1a',
                    }}
                  >
                    Unlock Premium Features
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '14px',
                    color: '#666666',
                    pl: 5,
                    lineHeight: 1.5,
                  }}
                >
                  Get property reports and access to all CommercialUK features
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>
        
        {/* {subscriptionDialogUserRole === 'user' && (
        <DialogActions
          sx={{
            p: 4,
            pt: 2,
            position: 'relative',
            zIndex: 1,
            justifyContent: 'center',
          }}
        >
          <Button
            onClick={() => setSubscriptionDialogOpen(false)}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #f2c514 0%, #f4d03f 100%)',
              color: '#000',
              fontWeight: 600,
              fontSize: '15px',
              textTransform: 'none',
              padding: '12px 32px',
              borderRadius: '12px',
              boxShadow: '0 6px 20px rgba(242, 197, 20, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #f4d03f 0%, #f2c514 100%)',
                boxShadow: '0 8px 24px rgba(242, 197, 20, 0.4)',
              },
            }}
          >
            Got it
          </Button>
        </DialogActions>
        )} */}
        {subscriptionDialogUserRole === 'agent' && (
        <DialogActions
          sx={{
            p: 4,
            pt: 2,
            position: 'relative',
            zIndex: 1,
            justifyContent: 'center',
          }}
        >
          <Button
            onClick={() => {
              router.push('/agent/payment/plans-page');
            }}
            variant="contained"
            fullWidth
            sx={{
              background: 'linear-gradient(135deg, #f2c514 0%, #f4d03f 100%)',
              color: '#000',
              fontWeight: 700,
              fontSize: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              padding: '16px 32px',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(242, 197, 20, 0.4)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #f4d03f 0%, #f2c514 100%)',
                boxShadow: '0 12px 32px rgba(242, 197, 20, 0.5)',
                transform: 'translateY(-2px)',
              },
              '&:active': {
                transform: 'translateY(0)',
              },
            }}
            endIcon={
              <ArrowForwardIcon
                sx={{
                  fontSize: 20,
                  fontWeight: 'bold',
                }}
              />
            }
          >
            Buy Subscription
          </Button>
        </DialogActions>
        )}
      </Dialog>
    </>
  );
}
