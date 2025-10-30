// scripts/features/maps/mapManager.ts
import { elements } from '../../dom/elements.js';
import { GOOGLE_MAPS_BROWSER_KEY } from '../../app/configAPI.js';
import { SearchResponse } from '../../app/types.js';
import { darkModeMapStyle, lightModeMapStyle, currTheme } from '../darkMode.js';

// Google Maps
declare const google: any;
let map: any = null;
let markers: any[] = [];
let searchCircle: any = null;
let googleMapsLoaded = false;

//Map Load
export async function loadGoogleMap(): Promise<void> {
  try {
    // Prevent loading multiple times
    if (document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]')) {
      console.log('Google Maps already loaded — skipping duplicate load');
      if (!googleMapsLoaded && typeof google !== 'undefined') {
        googleMapsLoaded = true;
        initializeMap();
      }
      return;
    }

    console.log('Loading Google Maps API...');

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_BROWSER_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      console.log('Google Maps API loaded successfully');
      googleMapsLoaded = true;
      initializeMap();
    };

    script.onerror = () => {
      console.error('Failed to load Google Maps script');
      if (elements.mapPlaceholder) {
        elements.mapPlaceholder.innerHTML = `
          <h2>Map Loading Error</h2>
          <p>Please ensure the API key and domain restrictions are correct.</p>
        `;
      }
    };

    document.head.appendChild(script);
  } catch (error) {
    console.error('Failed to load Google Maps:', error);

    if (elements.mapPlaceholder) {
      elements.mapPlaceholder.innerHTML = `
        <svg class="map-placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        <h2>Map Loading Error</h2>
        <p>Please ensure the backend server is running</p>
      `;
    }
  }
}

function initializeMap(): void {
  if (!googleMapsLoaded || typeof google === 'undefined') {
    console.error('Google Maps not loaded');
    return;
  }

  const isDarkMode = document.body.classList.contains('dark-mode');
  map = new google.maps.Map(elements.googleMapDiv, {
    center: { lat: 38.7946, lng: -106.5348 },
    zoom: 5,
    styles: isDarkMode ? darkModeMapStyle : lightModeMapStyle
  });

  console.log('Google Map initialized with', isDarkMode ? 'dark' : 'light', 'mode');
}

//Display Results on Map
export function displayOnMap(data: SearchResponse): void {
    if (!map || !googleMapsLoaded) {
        console.error('Map not initialized yet');
        return;
    }

    clearMapMarkers();

    const center = {
        lat: data.searchLocation.lat,
        lng: data.searchLocation.lng
    };

    // Center map on search location
    map.setCenter(center);

    // Add center marker
    const centerMarker = new google.maps.Marker({
        position: center,
        map: map,
        title: 'Search Center',
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#4285f4',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2
        }
    });
    markers.push(centerMarker);

    // Draw search radius circle
    searchCircle = new google.maps.Circle({
        map: map,
        center: center,
        radius: data.radius * 1609.34, // Convert miles to meters
        fillColor: '#4285f4',
        fillOpacity: 0.1,
        strokeColor: '#4285f4',
        strokeOpacity: 0.4,
        strokeWeight: 2
    });

    // Color coding for categories
    const categoryColors: { [key: string]: string } = {
        dailyLiving: '#34a853',
        food: '#ea4335',
        lifestyle: '#fbbc04',
        transportation: '#4285f4',
        community: '#9c27b0',
        healthcare: '#ff6d00'
    };

    // Add markers for all places
    for (const result of data.results) {
        const color = categoryColors[result.category] || '#666666';
        
        for (const place of result.places) {
            const marker = new google.maps.Marker({
                position: place.location,
                map: map,
                title: place.name,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 6,
                    fillColor: color,
                    fillOpacity: 0.9,
                    strokeColor: '#ffffff',
                    strokeWeight: 1
                }
            });

            const isDarkTheme = currTheme(); //true if dark
            const textColor = isDarkTheme ? 'white' : 'black';
            const bgColor = isDarkTheme ? '#2d2d2d' : 'white';
            // Add info window
            const infoWindow = new google.maps.InfoWindow({  
              content: `
                    <div style="padding: 8px; max-width: 200px; background-color: ${bgColor}; color: ${textColor}; border-radius: 8px;">
                    <strong>${place.name}</strong><br>
                    <span style="font-size: 12px;">${place.address}</span>
                    ${place.rating ? `<br><span style="color: #f4b400;">★ ${place.rating.toFixed(1)}</span>` : ''}
                </div>`
            });

            marker.addListener('click', () => {
                infoWindow.open(map, marker);
            });

            markers.push(marker);
        }
    }

    // Fit map to show all markers
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(center);
    for (const result of data.results) {
        for (const place of result.places) {
            bounds.extend(place.location);
        }
    }
    map.fitBounds(bounds);

    // Ensure minimum zoom level
    const listener = google.maps.event.addListener(map, 'idle', () => {
        if (map.getZoom() > 15) map.setZoom(15);
        google.maps.event.removeListener(listener);
    });
}

function clearMapMarkers(): void {
    // Remove all existing markers
    for (const marker of markers) {
        marker.setMap(null);
    }
    markers = [];

    // Remove search circle
    if (searchCircle) {
        searchCircle.setMap(null);
        searchCircle = null;
    }
}

export function addMarker(lat: number, lng: number, title: string): void {
  if (!map || !googleMapsLoaded) return;
  new google.maps.Marker({
    position: { lat, lng },
    map,
    title
  });
}

export function setMapCenter(lat: number, lng: number, zoom: number = 13): void {
  if (map && googleMapsLoaded) {
    map.setCenter({ lat, lng });
    map.setZoom(zoom);
  }
}

// Exported utility
export function applyMapStyle(styles: any[]): void {
  if (map && googleMapsLoaded) {
    map.setOptions({ styles });
  }
}

export function readyForStyle(): boolean {
  return !!(map && googleMapsLoaded);
}
