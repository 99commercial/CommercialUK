import { AppProps } from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme } from '@mui/material/styles';
import { ReactElement, ReactNode, useEffect } from 'react';
import Layout from '../layouts';
import AuthGuard from '@/guards/AuthGaurd';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { startTokenExpiryMonitor } from '@/utils/tokenVerification';

// Create a simple theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#d32f2f',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Playfair Display", "Montserrat", "Inter", serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Playfair Display", "Montserrat", "Inter", serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Playfair Display", "Montserrat", "Inter", serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Playfair Display", "Montserrat", "Inter", serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Montserrat", "Inter", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Montserrat", "Inter", sans-serif',
      fontWeight: 600,
    },
    body1: {
      fontFamily: '"Inter", "Roboto", sans-serif',
    },
    body2: {
      fontFamily: '"Inter", "Roboto", sans-serif',
    },
    button: {
      fontFamily: '"Montserrat", "Inter", sans-serif',
      fontWeight: 500,
    },
  },
});

// Extend AppProps to include getLayout
type NextPageWithLayout = {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getReadableErrorMessage = (input: any) => {
    if (!input) return 'Something went wrong.';
    if (typeof input === 'string') return input;
    if (input?.response?.data?.message) return input.response.data.message;
    if (input?.message) return input.message;
    return 'Something went wrong.';
  };

  // Set up token expiry monitor that checks every minute
  useEffect(() => {
    // Start the token expiry monitor
    const cleanup = startTokenExpiryMonitor();

    // Cleanup on component unmount
    return cleanup;
  }, []);

  // Global runtime error handling: prefer snackbar over browser overlays
  // for uncaught async errors in app code.
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const message = getReadableErrorMessage(event.reason);
      enqueueSnackbar(message, { variant: 'error' });
      event.preventDefault();
    };

    const handleWindowError = (event: ErrorEvent) => {
      const message = getReadableErrorMessage(event.error || event.message);
      enqueueSnackbar(message, { variant: 'error' });
      event.preventDefault();
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleWindowError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleWindowError);
    };
  }, []);

  return (
    <AuthGuard>
      <SnackbarProvider 
        maxSnack={3}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        autoHideDuration={5000}
        preventDuplicate={true}
      >
      <Head>
        <title>One-Stop Solution for Buying, Selling & Letting Commercial Properties| CommercialUK</title>
        <meta name="description" content="Find CommercialUK, the trusted marketplace to sell, buy & let offices, retail, industrial & land. Get the right audience & complete deals quicker." />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {Layout({ children: <Component {...pageProps} /> })}
      </ThemeProvider>
      </SnackbarProvider>
    </AuthGuard>
  );
}
