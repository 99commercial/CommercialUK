import axiosInstance from './axios';

function decodeJWT(token: string): any | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT token:', error);
    return null;
  }
}

function isTokenNearExpiry(token: string): boolean {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) {
    return true; // If we can't decode or no expiry, consider it expired
  }

  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  const expiryTime = decoded.exp; // Expiry time in seconds
  const timeUntilExpiry = expiryTime - currentTime; // Time remaining in seconds

  // Check if token expires within 2 minutes (120 seconds)
  return timeUntilExpiry <= 120;
}

export function startTokenExpiryMonitor() {
  const checkTokenExpiry = () => {
    const accessToken = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');

    // Only check if user is logged in and has access token
    if (user && accessToken) {
      if (isTokenNearExpiry(accessToken)) {
        console.log('Token is near expiry, refreshing...');
        tokenManager();
      }
    }
  };

  // Check immediately
  checkTokenExpiry();

  // Set up interval to check every minute (60,000 milliseconds)
  const interval = setInterval(checkTokenExpiry, 60 * 1000);

  // Return cleanup function
  return () => clearInterval(interval);
}

export default function tokenManager() {
  // Retrieve tokens from localStorage
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const user = localStorage.getItem('user');

  if(user){// Check if both tokens exist
    if (accessToken && refreshToken ) {
      // Both tokens exist, call refresh API
      refreshAccessToken(refreshToken);
    } else {
      // No refresh token, clear everything and redirect
      handleTokenExpiration();
    }
  }
}

const refreshAccessToken = async (refreshToken: string) => {
  try {
    // Delete existing tokens from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    // Call refresh token API
    const response = await axiosInstance.post('/api/auth/refresh-token', {
      refreshToken
    });

    // Save new access token to localStorage
    if (response.data.status && response.data.accessData) {
      localStorage.setItem('accessToken', response.data.accessData);
      console.log('Token refreshed successfully');
    } else {
      throw new Error('Invalid response from refresh token endpoint');
    }
  } catch (error: any) {
    console.error('Token refresh failed:', error);
    // If refresh fails, clear everything and redirect
    handleTokenExpiration();
  }
};

const handleTokenExpiration = () => {
  // Clear all authentication data
  localStorage.removeItem('user');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  
  // Log the token expiration for debugging
  console.log('Token expired, redirecting to login');

  // Redirect to login page using window.location
  if (typeof window !== 'undefined') {
    window.location.href = '/auth/login';
  }
};