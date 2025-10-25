import React from 'react';
import { dummyProperties } from '../../data/dummyData';

type PropertyType = typeof dummyProperties[0];

interface MapViewProps {
  properties: PropertyType[];
}

// Map dimensions and boundaries for a rough map of India
const MAP_WIDTH = 500;
const MAP_HEIGHT = 550;
const INDIA_BOUNDS = {
  latMin: 6.5,
  latMax: 35.5,
  lngMin: 68.0,
  lngMax: 97.5,
};

// Function to convert GPS coordinates to pixel coordinates on our map image
const convertCoordsToPixels = (lat: number, lng: number) => {
  const latRange = INDIA_BOUNDS.latMax - INDIA_BOUNDS.latMin;
  const lngRange = INDIA_BOUNDS.lngMax - INDIA_BOUNDS.lngMin;

  const y = MAP_HEIGHT - ((lat - INDIA_BOUNDS.latMin) / latRange) * MAP_HEIGHT;
  const x = ((lng - INDIA_BOUNDS.lngMin) / lngRange) * MAP_WIDTH;

  return { x, y };
};

const MapView: React.FC<MapViewProps> = ({ properties }) => {
  return (
    <div className="h-96 w-full bg-gray-300 dark:bg-gray-700 rounded-lg mb-6 overflow-hidden relative shadow-inner">
      <img
        src="https://vemaps.com/uploads/img/in-02.png" // A simple, clean map of India
        alt="Map of India"
        className="absolute inset-0 w-full h-full object-cover opacity-30 dark:opacity-20"
      />
      
      {properties.map(prop => {
        const { x, y } = convertCoordsToPixels(prop.location.coordinates.lat, prop.location.coordinates.lng);
        
        // Ensure markers are within the map boundaries
        if (x < 0 || x > MAP_WIDTH || y < 0 || y > MAP_HEIGHT) {
            return null;
        }

        return (
          <div
            key={prop.propertyId}
            className="absolute -translate-x-1/2 -translate-y-full group cursor-pointer"
            style={{ left: `${x}px`, top: `${y}px` }}
            title={`${prop.title} - ₹${prop.pricing.basePrice.toLocaleString('en-IN')}`}
          >
            <div className="px-2 py-1 bg-primary-600 text-white text-xs font-bold rounded-md shadow-lg transform group-hover:scale-110 transition-transform duration-200">
              {`₹${(prop.pricing.basePrice / 1000).toFixed(0)}k`}
            </div>
            <div className="w-2 h-2 bg-primary-700 rounded-full mx-auto mt-1 shadow-md"></div>
          </div>
        );
      })}
    </div>
  );
};

export default MapView;
