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
});

// Extend AppProps to include getLayout
type NextPageWithLayout = {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Set up token expiry monitor that checks every minute
  useEffect(() => {
    // Start the token expiry monitor
    const cleanup = startTokenExpiryMonitor();

    // Cleanup on component unmount
    return cleanup;
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
