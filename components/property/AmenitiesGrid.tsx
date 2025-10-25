import React from 'react';

interface AmenitiesGridProps {
  amenities: string[];
}

// A simple mapping of amenity names to icons
const amenityIcons: { [key: string]: React.ReactNode } = {
  pool: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" /></svg>,
  wifi: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.045A9.75 9.75 0 0 1 12 15m0 0a9.75 9.75 0 0 1 3.712.045m-3.712.045a9.75 9.75 0 0 0-3.712.045m0 0A9.754 9.754 0 0 0 12 3c-1.354 0-2.65.292-3.84.811m0 0a9.75 9.75 0 0 1-3.712-.045m0 0A9.754 9.754 0 0 1 4.16 3.811m11.854 11.234a9.754 9.754 0 0 1 0 2.91m0 0a9.754 9.754 0 0 0 0 2.91m0 0a9.75 9.75 0 0 0 3.712-.045m0 0a9.75 9.75 0 0 1 3.712-.045m0 0a9.75 9.75 0 0 1-3.712-.045m0 0a9.75 9.75 0 0 0-3.712-.045m5.654-14.158a9.75 9.75 0 0 0-2.91 0m0 0a9.75 9.75 0 0 1-2.91 0" /></svg>,
  ac: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>,
  parking: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5v-1.875a3.375 3.375 0 0 1 3.375-3.375h9.75a3.375 3.375 0 0 1 3.375 3.375v1.875" /></svg>,
  kitchen: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" /></svg>,
  gym: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5M15 15l5.25 5.25" /></svg>,
  tv: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.375 .565L3 21.75" /></svg>,
  heating: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" /></svg>,
  // Add more as needed
};

const AmenitiesGrid: React.FC<AmenitiesGridProps> = ({ amenities }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">What this place offers</h2>
      <div className="grid grid-cols-2 gap-4">
        {amenities.slice(0, 10).map((amenity, index) => (
          <div key={index} className="flex items-center">
            <div className="text-gray-700 dark:text-gray-300">
                {amenityIcons[amenity.toLowerCase().split(' ')[0]] || amenityIcons['heating']}
            </div>
            <span className="ml-3 text-gray-800 dark:text-gray-200 capitalize">{amenity}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AmenitiesGrid;
