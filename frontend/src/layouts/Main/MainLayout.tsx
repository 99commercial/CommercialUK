import { ReactNode } from 'react';
import { Box } from '@mui/material';
import { Navbar } from '../../components';

// ----------------------------------------------------------------------

interface Props {
  children: ReactNode;
}

export default function MainLayout({ children }: Props) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Navbar />
      <Box sx={{ flex: 1 }}>
        {children}
      </Box>
    </Box>
  );
}
