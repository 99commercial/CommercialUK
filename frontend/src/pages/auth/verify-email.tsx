import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { BACKEND_URL } from '../../config';
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  InputAdornment,
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import LoginIcon from '@mui/icons-material/Login';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import axiosInstance from '../../utils/axios';
import { enqueueSnackbar } from 'notistack';

export default function VerifyEmailPage() {
  const router = useRouter();
  const { token } = router.query;

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [emailTouched, setEmailTouched] = useState<boolean>(false);
  const isEmailValid = /^(?:[a-zA-Z0-9_'^&\-]+(?:\.[a-zA-Z0-9_'^&\-]+)*)@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(email);
  

  async function verifyEmailWithToken(token: string) {

    setStatus('loading')

    try {
      let res = await axiosInstance.post(`${BACKEND_URL}/api/auth/verify-email`, { token })
      setStatus('success')
      enqueueSnackbar(res.data.message || "Your email has been verified successfully !" , {variant :'success'})
    } catch (err: any) {
      setStatus('error')
      enqueueSnackbar(err.message || "There is error in verifying email !" , {variant :'error'})
    }
  }
  
  async function resendVerificationEmail(email: string) {
    setResendLoading(true);
    try {
      let res = await axiosInstance.post(`${BACKEND_URL}/api/auth/resend-verification`, { email })

      enqueueSnackbar(res.data.message || "Verification email sent successfully !" , {variant :'success'})
      
    } catch (error: any) {
      enqueueSnackbar(error.message || "There is error in resending verification email !" , {variant :'error'})
    } finally {
      setResendLoading(false);
    }
  }


  useEffect(()=>{
    if (token) {
      verifyEmailWithToken(token as string)
    }
  },[token])

  console.log(token)

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      px={2}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0D47A1 0%, #1B2A4A 40%, #B71C1C 100%)',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          width: 320,
          height: 320,
          top: -80,
          left: -80,
          borderRadius: '50%',
          bgcolor: 'rgba(255,255,255,0.08)',
          filter: 'blur(12px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: 420,
          height: 420,
          bottom: -120,
          right: -120,
          borderRadius: '50%',
          bgcolor: 'rgba(0,0,0,0.12)',
          filter: 'blur(16px)',
        }}
      />

      <Box
        maxWidth={560}
        width="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={2}
        textAlign="center"
        sx={{
          backgroundColor: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.16)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
          backdropFilter: 'blur(8px)',
          borderRadius: 3,
          p: { xs: 3, sm: 4 },
          color: '#E3F2FD',
        }}
      >
        {status === 'loading' && (
          <>
            <CircularProgress />
            <Typography variant="h5" sx={{ color: '#FFFFFF' }}>Verifying your email…</Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)' }}>
              Please wait while we confirm your account.
            </Typography>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircleOutlineIcon color="success" sx={{ fontSize: 72 }} />
            <Typography variant="h4" fontWeight={700} sx={{ color: '#FFFFFF' }}>
              Email verified successfully
            </Typography>
            {message && (
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                {message}
              </Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push('/auth/login')}
              sx={{ mt: 1, bgcolor: '#1565C0', '&:hover': { bgcolor: '#0D47A1' } }}
              startIcon={<LoginIcon />}
            >
              Continue to Login
            </Button>
          </>
        )}

        {status === 'error' && (
          <>
            <ErrorOutlineIcon color="error" sx={{ fontSize: 72 }} />
            <Typography variant="h4" fontWeight={700} sx={{ color: '#FFFFFF' }}>
              Verification issue
            </Typography>

            <Box mt={2} width="100%" display="flex" flexDirection="column" gap={1.5}>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                If your token is expired or the email is already verified, you can resend the verification email.
              </Typography>

              <Box
                display="flex"
                flexDirection={{ xs: 'column', sm: 'row' }}
                gap={1.5}
                justifyContent="center"
                alignItems={{ xs: 'stretch', sm: 'center' }}
                flexWrap="wrap"
                width="100%"
              >
                <TextField
                  fullWidth
                  type="email"
                  label="Email"
                  variant="outlined"
                  size="medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setEmailTouched(true)}
                  error={emailTouched && !isEmailValid}
                  helperText={emailTouched && !isEmailValid ? 'Enter a valid email address' : ' '} 
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlinedIcon sx={{ color: 'rgba(255,255,255,0.9)' }} />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.85)' } }}
                  sx={{
                    minWidth: { sm: 360 },
                    '& .MuiInputBase-input': { color: '#E3F2FD' },
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'rgba(255,255,255,0.10)',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.35)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.55)' },
                      '&.Mui-focused fieldset': { borderColor: '#64B5F6' },
                    },
                    borderRadius: 2,
                  }}
                />
                <Button
                  variant="contained"
                  onClick={() => resendVerificationEmail(email)}
                  disabled={!isEmailValid || resendLoading}
                  size="large"
                  sx={{
                    bgcolor: '#1565C0',
                    '&:hover': { bgcolor: '#0D47A1' },
                    whiteSpace: 'nowrap',
                    px: 3,
                    height: 56,
                  }}
                  startIcon={<MarkEmailReadIcon />}
                >
                  {resendLoading ? 'Sending…' : 'Resend Verification Email'}
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}


