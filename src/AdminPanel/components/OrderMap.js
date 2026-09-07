// src/components/OrderMap.jsx
import { useEffect, useState, useCallback, useMemo } from 'react';
import { 
  GoogleMap, 
  Marker, 
  InfoWindow, 
  useJsApiLoader,
  MarkerClusterer 
} from '@react-google-maps/api';
import { formatCurrency } from '../utils/formatCurrency';
import API from '../api';

const libraries = ['places', 'geometry'];

const containerStyle = {
  width: '100%',
  height: '600px'
};

const center = {
  lat: 39.8283,
  lng: -98.5795
};

// Custom marker options for better visibility
const markerOptions = {
  animation: window.google?.maps?.Animation?.DROP,
  optimized: true,
};

// Clustering options for better performance with many markers
const clusterOptions = {
  imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
  gridSize: 60,
  maxZoom: 15,
};

const OrderMap = () => {
  const [locations, setLocations] = useState([]);
  const [geocodedLocations, setGeocodedLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [geocodingProgress, setGeocodingProgress] = useState(0);
  const [error, setError] = useState(null);

  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: googleMapsApiKey,
    libraries,
    version: 'weekly', // Use the latest version
  });

  // Geocoding function with rate limiting and error handling
  const geocodeAddress = useCallback(async (address, geocoder, retryCount = 0) => {
    return new Promise((resolve) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results[0]) {
          resolve({
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
            formattedAddress: results[0].formatted_address,
            placeId: results[0].place_id,
          });
        } else if (status === 'OVER_QUERY_LIMIT' && retryCount < 3) {
          // Retry with exponential backoff
          setTimeout(() => {
            resolve(geocodeAddress(address, geocoder, retryCount + 1));
          }, Math.pow(2, retryCount) * 1000);
        } else {
          console.warn(`Geocoding failed for address: ${address}, Status: ${status}`);
          resolve(null);
        }
      });
    });
  }, []);

  // Batch geocoding with progress tracking
  const geocodeLocations = useCallback(async (locationData) => {
    if (!isLoaded) return;

    const geocoder = new window.google.maps.Geocoder();
    const geocodedResults = [];
    
    for (let i = 0; i < locationData.length; i++) {
      const location = locationData[i];
      setGeocodingProgress(Math.round(((i + 1) / locationData.length) * 100));
      
      try {
        const geocodedData = await geocodeAddress(location.address, geocoder);
        
        if (geocodedData) {
          geocodedResults.push({
            ...location,
            ...geocodedData,
            originalAddress: location.address,
          });
        }
        
        // Rate limiting - pause between requests
        if (i < locationData.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.error(`Error geocoding ${location.address}:`, error);
      }
    }
    
    return geocodedResults;
  }, [isLoaded, geocodeAddress]);

  // Fetch locations and geocode them
  useEffect(() => {
    const fetchAndGeocodeLocations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await API.get('/orders/locations');
        const locationData = response.data;
        setLocations(locationData);
        
        if (isLoaded && locationData.length > 0) {
          const geocoded = await geocodeLocations(locationData);
          setGeocodedLocations(geocoded);
        }
      } catch (err) {
        console.error('Failed to fetch locations:', err);
        setError('Failed to load order locations. Please try again.');
      } finally {
        setLoading(false);
        setGeocodingProgress(0);
      }
    };

    if (isLoaded) {
      fetchAndGeocodeLocations();
    }
  }, [isLoaded, geocodeLocations]);

  // Map options with modern styling
  const mapOptions = useMemo(() => ({
    disableDefaultUI: false,
    clickableIcons: true,
    scrollwheel: true,
    disableDoubleClickZoom: false,
    mapTypeControl: true,
    scaleControl: true,
    streetViewControl: true,
    rotateControl: true,
    fullscreenControl: true,
    mapTypeControlOptions: {
      style: window.google?.maps?.MapTypeControlStyle?.HORIZONTAL_BAR,
      position: window.google?.maps?.ControlPosition?.TOP_RIGHT,
    },
    zoomControlOptions: {
      position: window.google?.maps?.ControlPosition?.RIGHT_CENTER,
    },
    streetViewControlOptions: {
      position: window.google?.maps?.ControlPosition?.RIGHT_CENTER,
    },
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'on' }]
      },
      {
        featureType: 'transit',
        elementType: 'labels',
        stylers: [{ visibility: 'on' }]
      }
    ]
  }), []);

  // Auto-fit map bounds to show all markers
  const onMapLoad = useCallback((map) => {
    if (geocodedLocations.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      geocodedLocations.forEach(location => {
        bounds.extend({ lat: location.lat, lng: location.lng });
      });
      map.fitBounds(bounds);
      
      // Ensure minimum zoom level
      const listener = window.google.maps.event.addListener(map, 'bounds_changed', () => {
        if (map.getZoom() > 15) map.setZoom(15);
        window.google.maps.event.removeListener(listener);
      });
    }
  }, [geocodedLocations]);

  if (loadError) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="text-center text-red-600">
          <h2 className="text-xl font-semibold mb-2">Map Loading Error</h2>
          <p>Failed to load Google Maps. Please check your API key and try again.</p>
        </div>
      </div>
    );
  }

  if (loading || !isLoaded) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Order Locations</h1>
        <div className="flex flex-col justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600 mb-2">
            {!isLoaded ? 'Loading map...' : 'Loading locations...'}
          </p>
          {geocodingProgress > 0 && (
            <div className="w-64 bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${geocodingProgress}%` }}
              ></div>
            </div>
          )}
          {geocodingProgress > 0 && (
            <p className="text-sm text-gray-500">
              Geocoding addresses... {geocodingProgress}%
            </p>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="text-center text-red-600">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Order Locations</h1>
        <div className="text-sm text-gray-600">
          {geocodedLocations.length} of {locations.length} locations mapped
        </div>
      </div>
      
      <div className="relative rounded-lg overflow-hidden">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={4}
          options={mapOptions}
          onLoad={onMapLoad}
        >
          {geocodedLocations.length > 10 ? (
            // Use clustering for many markers
            <MarkerClusterer options={clusterOptions}>
              {(clusterer) =>
                geocodedLocations.map((location, index) => (
                  <Marker
                    key={`${location.placeId || index}`}
                    position={{ lat: location.lat, lng: location.lng }}
                    clusterer={clusterer}
                    onClick={() => setSelectedLocation(location)}
                    options={{
                      ...markerOptions,
                      title: location.formattedAddress || location.originalAddress,
                    }}
                  />
                ))
              }
            </MarkerClusterer>
          ) : (
            // Regular markers for fewer locations
            geocodedLocations.map((location, index) => (
              <Marker
                key={`${location.placeId || index}`}
                position={{ lat: location.lat, lng: location.lng }}
                onClick={() => setSelectedLocation(location)}
                options={{
                  ...markerOptions,
                  title: location.formattedAddress || location.originalAddress,
                }}
              />
            ))
          )}

          {selectedLocation && (
            <InfoWindow
              position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
              onCloseClick={() => setSelectedLocation(null)}
              options={{
                pixelOffset: new window.google.maps.Size(0, -40),
              }}
            >
              <div className="p-3 max-w-xs">
                <h3 className="font-semibold text-gray-800 mb-2">
                  {selectedLocation.formattedAddress || selectedLocation.originalAddress}
                </h3>
                <div className="space-y-1 text-sm">
                  <p className="flex justify-between">
                    <span className="text-gray-600">Orders:</span>
                    <span className="font-medium">{selectedLocation.orderCount}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Revenue:</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(selectedLocation.totalAmount) || '0.00'}
                    </span>
                  </p>
                  {selectedLocation.originalAddress !== selectedLocation.formattedAddress && (
                    <p className="text-xs text-gray-500 mt-2 border-t pt-2">
                      Original: {selectedLocation.originalAddress}
                    </p>
                  )}
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
      
      {geocodedLocations.length === 0 && locations.length > 0 && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800">
            No locations could be geocoded. Please check that the addresses in your data are valid.
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderMap;