import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Property } from '../../components/PropertyCard';
import { useRouter } from 'next/router';
import axiosInstance from '../../utils/axios';
import { enqueueSnackbar } from 'notistack';
import ListAllProperties from '../../sections/general/list_all_properties';
import InteractiveMap from '../../sections/general/InteractiveMap';

// ----------------------------------------------------------------------

const PageContainer = styled(Box)(({ theme }) => ({
  padding: 0,
  background: 'transparent',
  color: '#000',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  margin: 0,
}));

const MainContent = styled(Box)(({ theme }) => ({
  flex: 1,
  width: '100%',
  margin: 0,
  padding: 0,
  position: 'relative',
  zIndex: 2,
}));




// ----------------------------------------------------------------------


const AllPropertiesPage: React.FC = () => {
  const router = useRouter();

  // State management
  const [properties, setProperties] = useState<Property[]>([]);
  const [displayProperties, setDisplayProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [favoriteProperties, setFavoriteProperties] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isAreaFiltered, setIsAreaFiltered] = useState(false);

  // Check user authentication
  const checkUserAuth = () => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          return parsedUser;
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('user');
          return null;
        }
      }
    }
    return null;
  };

  // Fetch user's favorite properties
  const fetchFavorites = async () => {
    const currentUser = checkUserAuth();
    if (!currentUser) return;

    try {
      const endpoint = currentUser.role === 'user' 
        ? '/api/user/favorites' 
        : '/api/agent/favorites';
      
      const response = await axiosInstance.get(endpoint);
      
      if (response.data.success) {
        // Now response.data.data is directly an array of property IDs
        setFavoriteProperties(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  // Add property to favorites
  const addToFavorites = async (propertyId: string) => {
    const currentUser = checkUserAuth();
    if (!currentUser) {
      enqueueSnackbar('Please login to add favorites', { variant: 'warning' });
      return;
    }

    try {
      const endpoint = currentUser.role === 'user' 
        ? `/api/user/favorites/${propertyId}` 
        : `/api/agent/favorites/${propertyId}`;
      
      const response = await axiosInstance.post(endpoint);
      
      if (response.data.success) {
        setFavoriteProperties(prev => [...prev, propertyId]);
        enqueueSnackbar('Added to favorites', { variant: 'success' });
      }
    } catch (error: any) {
      console.error('Error adding to favorites:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add to favorites';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };

  // Remove property from favorites
  const removeFromFavorites = async (propertyId: string) => {
    const currentUser = checkUserAuth();
    if (!currentUser) return;

    try {
      const endpoint = currentUser.role === 'user' 
        ? `/api/user/favorites/${propertyId}` 
        : `/api/agent/favorites/${propertyId}`;
      
      const response = await axiosInstance.delete(endpoint);
      
      if (response.data.success) {
        setFavoriteProperties(prev => prev.filter(id => id !== propertyId));
        enqueueSnackbar('Removed from favorites', { variant: 'success' });
      }
    } catch (error: any) {
      console.error('Error removing from favorites:', error);
      const errorMessage = error.response?.data?.message || 'Failed to remove from favorites';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };

  // Helper function to filter properties by location
  const filterPropertiesByLocation = (properties: Property[], location: string): Property[] => {
    if (!location || location.trim() === '') {
      return properties;
    }

    try {
      // Try to parse location as JSON first
      let locationData: any = null;
      try {
        locationData = JSON.parse(location);
      } catch {
        // If not JSON, treat as plain string
        locationData = location;
      }

      const searchTerms: string[] = [];
      
      if (typeof locationData === 'object' && locationData !== null) {
        // Extract searchable fields from location object
        if (locationData.building_name) searchTerms.push(locationData.building_name.toLowerCase());
        if (locationData.address) searchTerms.push(locationData.address.toLowerCase());
        if (locationData.town_city) searchTerms.push(locationData.town_city.toLowerCase());
        if (locationData.postcode) searchTerms.push(locationData.postcode.toLowerCase());
        if (locationData.country_region) searchTerms.push(locationData.country_region.toLowerCase());
      } else if (typeof locationData === 'string') {
        // If it's a string, split by spaces and use all parts
        searchTerms.push(...locationData.toLowerCase().split(/\s+/).filter(term => term.length > 0));
      }

      if (searchTerms.length === 0) {
        return properties;
      }

      // Filter properties that match any of the search terms in any address field
      return properties.filter(property => {
        const { general_details } = property;
        if (!general_details) return false;

        const searchableText = [
          general_details.building_name || '',
          general_details.address || '',
          general_details.town_city || '',
          general_details.postcode || '',
          general_details.country_region || '',
        ]
          .join(' ')
          .toLowerCase();

        // Check if any search term matches the searchable text
        return searchTerms.some(term => searchableText.includes(term));
      });
    } catch (error) {
      console.error('Error filtering properties by location:', error);
      return properties;
    }
  };

  // fetchProperty function that fetches ALL properties
  const fetchProperty = async (page: number = currentPage) => {
    setLoading(true);
    setError(null);

    try {
      // Get URL query parameters
      const { location, forSale, toLet } = router.query;

      console.log('location', location);
      console.log('forSale', forSale);
      console.log('toLet', toLet);
      
      // Determine sale_status filter based on forSale and toLet
      let saleStatus: string | undefined = undefined;
      const forSaleValue = forSale === 'true' || (Array.isArray(forSale) && forSale[0] === 'true');
      const toLetValue = toLet === 'true' || (Array.isArray(toLet) && toLet[0] === 'true');

      if (toLetValue && !forSaleValue) {
        // Only toLet is true - filter for 'Let' status
        saleStatus = 'To Let';
      } else if (forSaleValue && !toLetValue) {
        // Only forSale is true - filter for sale properties
        // Send 'Available' status to backend (most common status for properties for sale)
        saleStatus = 'For Sale';
      } else if (forSaleValue && toLetValue) {
        // Both are true - show both (no filter)
        saleStatus = undefined;
      } else {
        // Both are false - show both (no filter)
        saleStatus = undefined;
      }

      // Build API params
      const apiParams: any = {
        page: page,
        limit: 12, // Match backend limit
      };

      // Add sale_status parameter to backend API
      if (saleStatus) {
        apiParams.sale_status = saleStatus;
      }

      // Extract postcode from location query parameter
      const locationStr = Array.isArray(location) ? location[0] : location;
      if (locationStr && typeof locationStr === 'string' && locationStr.trim() !== '') {
        try {
          // Try to parse as JSON first (in case location is a JSON object)
          const locationData = JSON.parse(locationStr);
          if (locationData.postcode) {
            apiParams.postcode = locationData.postcode;
          }
        } catch {
          // If not JSON, treat location as postcode directly or try to extract postcode pattern
          const postcodeMatch = locationStr.match(/\b[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}\b/i);
          if (postcodeMatch) {
            apiParams.postcode = postcodeMatch[0].trim();
          } else {
            // If no pattern match, use the location string as postcode
            apiParams.postcode = locationStr.trim();
          }
        }
      }

      // Make API call to fetch all properties (public endpoint)
      console.log('API params being sent:', apiParams);
      const response = await axiosInstance.get('/api/agent/properties/all', {
        params: apiParams,
      });

      if (response.data.success) {
        let fetchedProperties = response.data.data.properties || [];
        const pagination = response.data.data.pagination || {};
        
        // Apply location filtering on frontend
        const locationStr = Array.isArray(location) ? location[0] : location;
        if (locationStr && typeof locationStr === 'string' && locationStr.trim() !== '') {
          fetchedProperties = filterPropertiesByLocation(fetchedProperties, locationStr);
        }
        
        setProperties(fetchedProperties);
        setDisplayProperties(fetchedProperties);
        // Update pagination from API response to keep it in sync
        setCurrentPage(pagination.current_page || page);
        setTotalPages(pagination.total_pages || 1);
        setTotalCount(pagination.total_documents || 0); // Use API total count
      } else {
        throw new Error(response.data.message || 'Failed to load properties');
      }
    } catch (error: any) {
      console.error('Error fetching properties:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load properties';
      setError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Pass the new page number directly to fetchProperty
    fetchProperty(page);
  };

  // Handle favorite toggle
  const handleFavorite = async (propertyId: string) => {
    const currentUser = checkUserAuth();
    
    if (!currentUser) {
      enqueueSnackbar('Please login to add properties to your favorites', { variant: 'warning' });
      router.push('/auth/login');
      return;
    }

    const isCurrentlyFavorite = favoriteProperties.includes(propertyId);
    
    if (isCurrentlyFavorite) {
      removeFromFavorites(propertyId);
    } else {
      addToFavorites(propertyId);
    }
  };

  // Handle view details
  const handleViewDetails = (propertyId: string) => {
    router.push(`/property/${propertyId}`);
  };

  // Handle area search (filtered properties from map)
  const handleAreaSearch = (filteredProperties: Property[]) => {
    setDisplayProperties(filteredProperties);
    setIsAreaFiltered(filteredProperties.length !== properties.length);
    // Reset pagination when filtering
    setCurrentPage(1);
  };

  // Load properties and check user auth on component mount
  useEffect(() => {
    fetchProperty(1);
    const currentUser = checkUserAuth();
    if (currentUser) {
      fetchFavorites();
    }
  }, []);

  // Re-fetch properties when query parameters change
  useEffect(() => {
    if (router.isReady) {
      setIsAreaFiltered(false); // Reset area filter when query params change
      fetchProperty(1);
    }
  }, [router.query.location, router.query.forSale, router.query.toLet]);

  return (
    <PageContainer>
      <MainContent>
        {/* Title Header - Always Visible */}
        <Box
          sx={{
            backgroundColor: '#f2c514',
            boxShadow: '0 2px 8px rgba(242, 198, 20, 0.1)',
            padding: 2,
            textAlign: 'center',
            margin: 0,
            width: '100%',
          }}
        >
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              fontWeight: 700, 
              mb: 1,
              color: '#000',
              fontSize: '1.5rem',
              margin: 0,
            }}
          >
            All Properties
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#000',
              fontSize: '0.875rem',
              margin: 0,
            }}
          >
            Discover commercial properties across the UK
          </Typography>
          {/* <Typography variant="h6" sx={{ fontWeight: 600, color: '#f2c514' }}>
            ({totalCount} Properties Found)
          </Typography> */}
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 0,
            flexDirection: 'row',
            height: 'calc(100vh - 120px)',
            width: '100%',
            margin: 0,
            padding: 0,
          }}
        >
          {/* Map Section */}
          <Box
            sx={{
              width: '40%',
              position: 'sticky',
              top: 0,
              height: '100%',
              display: 'block',
              zIndex: 10,
              backgroundColor: 'transparent',
            }}
          >
            <InteractiveMap
              properties={properties}
              onPropertyClick={handleViewDetails}
              onAreaSearch={handleAreaSearch}
            />
          </Box>

          <Box
            sx={{
              width: '60%',
              flexDirection: 'column',
              overflow: 'auto',
              height: '100%',
              backgroundColor: 'transparent',
            }}
          >
                <ListAllProperties
                  properties={displayProperties}
                  loading={loading}
                  error={error}
                  totalCount={isAreaFiltered ? displayProperties.length : totalCount}
                  currentPage={currentPage}
                  totalPages={isAreaFiltered ? 1 : totalPages}
                  favoriteProperties={favoriteProperties}
                  handlePageChange={handlePageChange}
                  handleFavorite={handleFavorite}
                  handleViewDetails={handleViewDetails}
                />
              </Box>
        </Box>
      </MainContent>
    </PageContainer>
  );
};

export default AllPropertiesPage;