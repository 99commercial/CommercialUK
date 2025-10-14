import React, { useEffect, useState } from 'react';
import {
  Box,
  useMediaQuery,
  useTheme,
  Container,
  Card,
  Chip,
  CircularProgress,
  Typography,
  Button,
} from '@mui/material';
import { Page } from '../../../components';
import BusinessDetailsEdit from '../../../sections/user/BusinessDetailsEdit';
import HeaderCard from '../../../components/HeaderCard'; 
import axiosInstance from '@/utils/axios';
import { enqueueSnackbar } from 'notistack';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CreateBusinessForm from '@/sections/user/CreateBusinessForm';

const MyBusinessAccount: React.FC = () => {
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [businessData, setBusinessData] = useState<any | null>(null);
  const [openCreate, setOpenCreate] = useState<boolean>(false);

  const handleBusinessDetailsSave = (updatedData: any) => {
    setBusinessData((prev: any) => ({ ...(prev || {}), ...updatedData }));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  useEffect(()=>{

    async function fetchBusinessData() {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get('/api/user/users/profile');
        setBusinessData(res?.data?.data?.business_details);
        
      } catch (error: any) {
        // Silent error handling
        setBusinessData(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBusinessData();
  },[])

  return (
    <Page title="Business Account">
      <Box>
        {/* Business Header */}
        <HeaderCard
            title="Business Account"
            breadcrumbs={['Dashboard', 'Business', `${businessData?.business_name || '—'}`]}
          />

        {isLoading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 10 }}>
            <CircularProgress />
          </Box>
        ) : businessData ? (
          <BusinessDetailsEdit 
              businessData={businessData}
          />
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, textAlign: 'center' }}>
              <Typography
                variant="h6"
                sx={{
                  color: 'error.main',
                  fontWeight: 700,
                  lineHeight: 1.35,
                  fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
                }}
              >
                No business details found
              </Typography>
              <Button variant="contained" color="success" onClick={() => setOpenCreate(true)}>
                Create Business
              </Button>
            </Box>
          </Box>
        )}

        <Dialog open={openCreate} onClose={() => setOpenCreate(false)} fullWidth maxWidth="md">
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            Create Business
            <IconButton onClick={() => setOpenCreate(false)} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <CreateBusinessForm />
          </DialogContent>
        </Dialog>
      </Box>
    </Page>
  );
};

export default MyBusinessAccount;
