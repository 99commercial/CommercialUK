import React, { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { Box, CircularProgress, Typography } from '@mui/material';

interface AuthGuardProps {
  children: ReactNode;
}

// AuthGuard Component
export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    // Set a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // 5 second timeout

    const checkAuthentication = () => {
      try {
        // Check if we're on the client side
        if (typeof window === 'undefined') {
          setIsLoading(false);
          clearTimeout(timeout);
          return;
        }

        // Use asPath/pathname for early route check (available before isReady)
        const currentPath = router.asPath || router.pathname || '';
        const pathnameOnly = currentPath.split('?')[0];
        const isProtectedRoute =
          pathnameOnly.includes('/agent') ||
          pathnameOnly.includes('/user') ||
          pathnameOnly.includes('/admin');
        const isAuthRoute =
          pathnameOnly.includes('/auth/login') ||
          pathnameOnly.includes('/auth/register') ||
          pathnameOnly.includes('/auth/forget-password') ||
          pathnameOnly.includes('/auth/reset-password') ||
          pathnameOnly.includes('/auth/verify-email');

        // When router isn't ready yet: allow public routes immediately so they don't stay on loader
        // (fixes stuck loader on /property/[id] etc. in production where isReady can be delayed)
        if (!router.isReady) {
          if (!isProtectedRoute && !isAuthRoute) {
            setHasAccess(true);
            setIsLoading(false);
            clearTimeout(timeout);
          }
          return;
        }

        // Get user and accessToken from localStorage
        const userString = localStorage.getItem('user');
        const accessToken = localStorage.getItem('accessToken');

        // Parse user data if exists
        let userData = null;
        if (userString) {
          try {
            userData = JSON.parse(userString);
          } catch (error) {
            console.error('Error parsing user data:', error);
            userData = null;
          }
        }

        // POINT 1: Check if user and accessToken exist
        if (!userString || !accessToken) {
          // No authentication - check if current URL has agent or user
          if (currentPath.includes('/agent') || currentPath.includes('/user') || currentPath.includes('/admin')) {
            // Trying to access protected route without auth - redirect to access denied
            router.push('/access-denied');
            setHasAccess(false);
          } else {
            // Public route - allow access
            setHasAccess(true);
          }
          setIsLoading(false);
          return;
        }

        // POINT 2: User and accessToken exist - check role-based access
        if (currentPath.includes('/agent')) {
          // Agent route - check if user role is agent
          if (userData?.role === 'agent') {
            setHasAccess(true);
          } else {
            // User role is not agent - redirect to access denied
            router.push('/access-denied');
            setHasAccess(false);
          }
        } else if (currentPath.includes('/user')) {
          // User route - check if user role is user
          if (userData?.role === 'user') {
            setHasAccess(true);
          } else {
            // User role is not user - redirect to access denied
            router.push('/access-denied');
            setHasAccess(false);
          }
        } else if (currentPath.includes('/admin')) {
          // Admin route - check if user role is admin
          if (userData?.role === 'admin') {
            setHasAccess(true);
          } else {
            // User role is not admin - redirect to access denied
            router.push('/access-denied');
            setHasAccess(false);
          }
        } else if (currentPath.includes('/auth/login') || currentPath.includes('/auth/register') || currentPath.includes('/auth/forget-password') || currentPath.includes('/auth/reset-password') || currentPath.includes('/auth/verify-email')) {
          // POINT 3: Auth pages - redirect based on user role
          if (userData?.role === 'agent') {
            router.push('/agent');
            setHasAccess(false);
          } else if (userData?.role === 'user') {
            router.push('/user');
            setHasAccess(false);
          } else if (userData?.role === 'admin') {
            router.push('/admin');
            setHasAccess(false);
          } else {
            // Invalid role - allow access to auth pages
            setHasAccess(true);
          }
        } else {
          // Public route or other routes - allow access
          setHasAccess(true);
        }

        setIsLoading(false);
        clearTimeout(timeout);
      } catch (error) {
        console.error('Authentication check error:', error);
        // On error, allow access to public routes, deny access to protected routes
        const currentPath = router.asPath;
        if (currentPath.includes('/agent') || currentPath.includes('/user')) {
          router.push('/access-denied');
          setHasAccess(false);
        } else {
          setHasAccess(true);
        }
        setIsLoading(false);
        clearTimeout(timeout);
      }
    };

    checkAuthentication();

    // Cleanup timeout on unmount
    return () => clearTimeout(timeout);
  }, [router.asPath, router.isReady]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        gap={2}
      >
        <CircularProgress size={40} />
        <Typography variant="body2" color="text.secondary">
          Checking authentication...
        </Typography>
      </Box>
    );
  }

  // If user doesn't have access, don't render children
  if (!hasAccess) {
    return null;
  }

  // Render children if user has access
  return <>{children}</>;
}
