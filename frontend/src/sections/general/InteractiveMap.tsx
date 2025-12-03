import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, CircularProgress, Button, IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { LocationOn, RadioButtonUnchecked, Clear } from '@mui/icons-material';
import { Property } from '../../components/PropertyCard';
import dynamic from 'next/dynamic';

// Dynamically import Leaflet to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

// Import Leaflet CSS and Draw CSS
if (typeof window !== 'undefined') {
  require('leaflet/dist/leaflet.css');
  require('leaflet-draw/dist/leaflet.draw.css');
  // Fix for default marker icon in Leaflet
  const L = require('leaflet');
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
}

// ----------------------------------------------------------------------

const MapWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  borderRadius: 0,
  overflow: 'hidden',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(15px)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  '& .leaflet-container': {
    height: '100%',
    width: '100%',
    flex: 1,
    backgroundColor: '#2c3e50',
  },
  '& .leaflet-popup-content-wrapper': {
    backgroundColor: '#ffffff',
    borderRadius: theme.spacing(1),
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
  },
  '& .leaflet-popup-content': {
    margin: theme.spacing(1.5),
    minWidth: '200px',
  },
}));

const MapHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '500px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: theme.spacing(1.5),
  border: '1px solid rgba(255, 255, 255, 0.2)',
  gap: theme.spacing(2),
  color: '#ffffff',
}));

const MapControls = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  zIndex: 1000,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1),
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
}));

const ControlButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'rgba(242, 197, 20, 0.1)',
  color: '#f2c514',
  '&:hover': {
    backgroundColor: 'rgba(242, 197, 20, 0.2)',
  },
  '&.active': {
    backgroundColor: '#f2c514',
    color: '#ffffff',
  },
}));

// Component to handle drawing functionality
const DrawControl: React.FC<{ 
  isDrawingMode: boolean; 
  onCircleDrawn: (circle: any) => void;
  onCircleDeleted: () => void;
  drawnLayerRef: React.MutableRefObject<any>;
}> = ({ isDrawingMode, onCircleDrawn, onCircleDeleted, drawnLayerRef }) => {
  const [DrawControlInner, setDrawControlInner] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('react-leaflet').then((mod) => {
        const { useMap } = mod;
        const InnerComponent = ({ isDrawingMode, onCircleDrawn, onCircleDeleted, drawnLayerRef }: any) => {
          const map = useMap();
          const controlRef = React.useRef<any>(null);

          useEffect(() => {
            const L = require('leaflet');
            const Draw = require('leaflet-draw');

            // Create or get the feature group for drawn items
            if (!drawnLayerRef.current) {
              drawnLayerRef.current = new L.FeatureGroup();
              map.addLayer(drawnLayerRef.current);
            }

            const drawnItems = drawnLayerRef.current;
            
            // Ensure the feature group is always on the map (in case it was removed)
            if (!map.hasLayer(drawnItems)) {
              map.addLayer(drawnItems);
            }

            // Only allow circle drawing
            const drawControl = new L.Control.Draw({
              draw: {
                circle: true,
                circlemarker: false,
                rectangle: false,
                polygon: false,
                polyline: false,
                marker: false,
              },
              edit: {
                featureGroup: drawnItems,
                remove: true,
              },
            });

            controlRef.current = drawControl;

            if (isDrawingMode) {
              map.addControl(drawControl);
            }

            // Handle circle creation
            const handleDrawCreated = (e: any) => {
              const layer = e.layer;
              // Clear previous circles
              drawnItems.eachLayer((existingLayer: any) => {
                drawnItems.removeLayer(existingLayer);
              });
              
              // Style the circle to make it visible (blue with border)
              layer.setStyle({
                color: '#3388ff',        // Blue border color
                fillColor: '#3388ff',    // Blue fill color
                fillOpacity: 0.2,        // Semi-transparent fill
                weight: 3,               // Border width
                opacity: 0.8             // Border opacity
              });
              
              drawnItems.addLayer(layer);
              
              // Ensure the feature group remains on the map
              if (!map.hasLayer(drawnItems)) {
                map.addLayer(drawnItems);
              }
              
              onCircleDrawn(layer);
            };

            // Handle circle deletion
            const handleDrawDeleted = () => {
              onCircleDeleted();
            };

            map.on(L.Draw.Event.CREATED, handleDrawCreated);
            map.on(L.Draw.Event.DELETED, handleDrawDeleted);

            return () => {
              map.off(L.Draw.Event.CREATED, handleDrawCreated);
              map.off(L.Draw.Event.DELETED, handleDrawDeleted);
              if (controlRef.current && isDrawingMode) {
                try {
                  map.removeControl(controlRef.current);
                } catch (e) {
                  // Control might already be removed
                }
              }
              // Don't remove the drawnItems layer - keep circles visible
            };
          }, [map, isDrawingMode]);

          return null;
        };
        setDrawControlInner(() => InnerComponent);
      });
    }
  }, []);

  if (!DrawControlInner) return null;
  return <DrawControlInner isDrawingMode={isDrawingMode} onCircleDrawn={onCircleDrawn} onCircleDeleted={onCircleDeleted} drawnLayerRef={drawnLayerRef} />;
};

// Component to set map bounds based on markers - must be inside MapContainer
const MapBoundsSetter: React.FC<{ properties: Property[] }> = ({ properties }) => {
  // Dynamic import to get useMap hook
  const [MapBoundsSetterInner, setMapBoundsSetterInner] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('react-leaflet').then((mod) => {
        const { useMap } = mod;
        const InnerComponent = ({ properties }: { properties: Property[] }) => {
          const map = useMap();
          
          useEffect(() => {
            if (map && properties.length > 0) {
              const L = require('leaflet');
              const bounds = properties
                .filter(prop => prop.location_id?.coordinates?.latitude && prop.location_id?.coordinates?.longitude)
                .map(prop => [
                  prop.location_id!.coordinates.latitude,
                  prop.location_id!.coordinates.longitude
                ] as [number, number]);

              if (bounds.length > 0) {
                const latLngBounds = L.latLngBounds(bounds);
                map.fitBounds(latLngBounds, { padding: [50, 50] });
              }
            }
          }, [map, properties]);

          return null;
        };
        setMapBoundsSetterInner(() => InnerComponent);
      });
    }
  }, []);

  if (!MapBoundsSetterInner) return null;
  return <MapBoundsSetterInner properties={properties} />;
};

// ----------------------------------------------------------------------

interface InteractiveMapProps {
  properties: Property[];
  onPropertyClick?: (propertyId: string) => void;
  onAreaSearch?: (filteredProperties: Property[]) => void;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ 
  properties, 
  onPropertyClick,
  onAreaSearch 
}) => {
  const [isClient, setIsClient] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [drawnCircle, setDrawnCircle] = useState<any>(null);
  const mapRef = useRef<any>(null);
  const drawControlRef = useRef<any>(null);
  const drawnLayerRef = useRef<any>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Function to check if a point is within a circle
  const isPointInCircle = (pointLat: number, pointLng: number, circleLat: number, circleLng: number, radiusMeters: number): boolean => {
    if (typeof window === 'undefined') return false;
    const L = require('leaflet');
    const point = L.latLng(pointLat, pointLng);
    const center = L.latLng(circleLat, circleLng);
    const distance = center.distanceTo(point);
    return distance <= radiusMeters;
  };

  // Filter properties based on drawn circle
  const filterPropertiesByCircle = (circle: any): Property[] => {
    if (!circle) return properties;

    const L = require('leaflet');
    const circleLatLng = circle.getLatLng();
    const circleRadius = circle.getRadius();

    return properties.filter(property => {
      if (!property.location_id?.coordinates?.latitude || !property.location_id?.coordinates?.longitude) {
        return false;
      }
      return isPointInCircle(
        property.location_id.coordinates.latitude,
        property.location_id.coordinates.longitude,
        circleLatLng.lat,
        circleLatLng.lng,
        circleRadius
      );
    });
  };

  // Handle circle drawn
  const handleCircleDrawn = (circle: any) => {
    setDrawnCircle(circle);
    const filteredProperties = filterPropertiesByCircle(circle);
    if (onAreaSearch) {
      onAreaSearch(filteredProperties);
    }
  };

  // Handle circle deleted
  const handleCircleDeleted = () => {
    setDrawnCircle(null);
    if (onAreaSearch) {
      onAreaSearch(properties); // Return all properties when circle is removed
    }
  };

  // Toggle drawing mode
  const toggleDrawingMode = () => {
    setIsDrawingMode(!isDrawingMode);
  };

  // Clear drawn circle
  const clearCircle = () => {
    if (drawnCircle && typeof window !== 'undefined') {
      const L = require('leaflet');
      if (drawnLayerRef.current) {
        drawnLayerRef.current.removeLayer(drawnCircle);
      }
      handleCircleDeleted();
    }
  };

  // Filter properties with valid coordinates
  const propertiesWithLocation = properties.filter(
    prop => prop.location_id?.coordinates?.latitude && 
            prop.location_id?.coordinates?.longitude
  );

  // Default center (UK center if no properties)
  const defaultCenter: [number, number] = propertiesWithLocation.length > 0 
    ? [
        propertiesWithLocation[0].location_id!.coordinates.latitude,
        propertiesWithLocation[0].location_id!.coordinates.longitude
      ]
    : [54.7024, -3.2766]; // UK center coordinates

  if (!isClient) {
    return (
      <LoadingContainer>
        <CircularProgress sx={{ color: '#ffffff' }} />
        <Typography variant="body1">Loading map...</Typography>
      </LoadingContainer>
    );
  }

  if (propertiesWithLocation.length === 0) {
    return (
      <MapWrapper>
        <LoadingContainer sx={{ height: 'calc(100% - 73px)' }}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
            No Properties with Location Data
          </Typography>
          <Typography variant="body2" sx={{ color: '#cccccc' }}>
            Properties with location coordinates will appear on the map
          </Typography>
        </LoadingContainer>
      </MapWrapper>
    );
  }

  return (
    <MapWrapper>
      <MapControls>
        <Tooltip title={isDrawingMode ? "Exit drawing mode" : "Draw circle to search area"}>
          <ControlButton 
            className={isDrawingMode ? 'active' : ''}
            onClick={toggleDrawingMode}
            size="small"
          >
            <RadioButtonUnchecked />
          </ControlButton>
        </Tooltip>
        {drawnCircle && (
          <Tooltip title="Clear search area">
            <ControlButton 
              onClick={clearCircle}
              size="small"
            >
              <Clear />
            </ControlButton>
          </Tooltip>
        )}
      </MapControls>
      
      <MapContainer
        center={defaultCenter}
        zoom={propertiesWithLocation.length === 1 ? 13 : 6}
        style={{ height: 'calc(100% - 73px)', width: '100%', zIndex: 0, flex: 1 }}
        whenReady={() => setIsMapReady(true)}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {isMapReady && !drawnCircle && <MapBoundsSetter properties={propertiesWithLocation} />}
        {isMapReady && drawnCircle && (
          <MapBoundsSetter 
            properties={propertiesWithLocation.filter((property) => {
              const L = require('leaflet');
              const circleLatLng = drawnCircle.getLatLng();
              const circleRadius = drawnCircle.getRadius();
              const propertyLat = property.location_id!.coordinates.latitude;
              const propertyLng = property.location_id!.coordinates.longitude;
              
              const point = L.latLng(propertyLat, propertyLng);
              const center = L.latLng(circleLatLng.lat, circleLatLng.lng);
              const distance = center.distanceTo(point);
              
              return distance <= circleRadius;
            })} 
          />
        )}
        {isMapReady && (
          <DrawControl 
            isDrawingMode={isDrawingMode}
            onCircleDrawn={handleCircleDrawn}
            onCircleDeleted={handleCircleDeleted}
            drawnLayerRef={drawnLayerRef}
          />
        )}
        
        {propertiesWithLocation
          .filter((property) => {
            // If no circle is drawn, show all properties
            if (!drawnCircle) return true;
            
            // Check if property is within the circle
            const L = require('leaflet');
            const circleLatLng = drawnCircle.getLatLng();
            const circleRadius = drawnCircle.getRadius();
            const propertyLat = property.location_id!.coordinates.latitude;
            const propertyLng = property.location_id!.coordinates.longitude;
            
            const point = L.latLng(propertyLat, propertyLng);
            const center = L.latLng(circleLatLng.lat, circleLatLng.lng);
            const distance = center.distanceTo(point);
            
            // Only show markers within the circle
            return distance <= circleRadius;
          })
          .map((property) => {
          const L = require('leaflet');
          const position: [number, number] = [
            property.location_id!.coordinates.latitude,
            property.location_id!.coordinates.longitude
          ];

          // Create custom icon
          const customIcon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
            shadowSize: [41, 41],
          });

          const handlePropertyClick = () => {
            if (onPropertyClick) {
              onPropertyClick(property._id);
            }
          };

          const capitalizeFirstLetter = (str: string) => {
            if (!str || str.length === 0) return str;
            return str.charAt(0).toUpperCase() + str.slice(1);
          };

          const formatPrice = () => {
            if (property.sale_types_id && property.sale_types_id.sale_types.length > 0) {
              const saleType = property.sale_types_id.sale_types[0];
              const { price_currency, price_value, price_unit, sale_type } = saleType;
              const currencySymbol = price_currency === 'GBP' ? '£' : price_currency;
              return `${currencySymbol}${price_value.toLocaleString()}/${price_unit} (${sale_type})`;
            }
            if (property.business_rates_id) {
              const { rateable_value_gbp, rates_payable_gbp } = property.business_rates_id;
              if (rates_payable_gbp) {
                return `£${rates_payable_gbp.toLocaleString()}/year`;
              }
              if (rateable_value_gbp) {
                return `£${rateable_value_gbp.toLocaleString()}/year`;
              }
            }
            return 'Price on request';
          };

          return (
            <Marker
              key={property._id}
              position={position}
              icon={customIcon}
            >
              <Popup>
                <Box sx={{ minWidth: '200px' }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 1, 
                      fontWeight: 700,
                      fontSize: '1rem',
                      color: '#000000'
                    }}
                  >
                    {capitalizeFirstLetter(property.general_details.building_name)}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 1, 
                      color: '#666666',
                      fontWeight: 500
                    }}
                  >
                    {capitalizeFirstLetter(property.general_details.property_sub_type)}
                  </Typography>
                  
                  {property.location_id?.formatted_address && (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 1, 
                        color: '#666666',
                        fontSize: '0.875rem'
                      }}
                    >
                      📍 {property.location_id.formatted_address}
                    </Typography>
                  )}
                  
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 1.5, 
                      color: '#333333',
                      fontWeight: 600
                    }}
                  >
                    💰 {formatPrice()}
                  </Typography>
                  
                  <Button
                    variant="contained"
                    size="small"
                    fullWidth
                    onClick={handlePropertyClick}
                    sx={{
                      backgroundColor: '#f2c514',
                      color: '#ffffff',
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: '#c9a010',
                      },
                      textTransform: 'none',
                      fontSize: '0.875rem',
                    }}
                  >
                    View Details
                  </Button>
                </Box>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </MapWrapper>
  );
};

export default InteractiveMap;

