import { createTheme } from '@mui/material/styles';

// Create a theme instance with red, white, and black color scheme.
const theme = createTheme({
  palette: {
    primary: {
      main: '#dc2626', // Red-600
      light: '#fca5a5', // Red-300
      dark: '#991b1b', // Red-800
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#000000', // Black
      light: '#374151', // Gray-700
      dark: '#000000', // Black
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff', // White
      paper: '#f9fafb', // Gray-50
    },
    text: {
      primary: '#000000', // Black
      secondary: '#6b7280', // Gray-500
    },
    error: {
      main: '#dc2626', // Red-600
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
      color: '#000000',
    },
    h2: {
      fontWeight: 600,
      color: '#000000',
    },
    h3: {
      fontWeight: 600,
      color: '#000000',
    },
    h4: {
      fontWeight: 500,
      color: '#000000',
    },
    h5: {
      fontWeight: 500,
      color: '#000000',
    },
    h6: {
      fontWeight: 500,
      color: '#000000',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          fontWeight: 500,
        },
        contained: {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#dc2626',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#dc2626',
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
});

export default theme;
