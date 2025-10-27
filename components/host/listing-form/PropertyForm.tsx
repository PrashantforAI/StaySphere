import React from 'react';
import { Property } from '../../../types';
import PropertyFormBasics from './PropertyFormBasics';
import PropertyFormPhotos from './PropertyFormPhotos';

interface PropertyFormProps {
    property: Partial<Property>;
    onUpdate: (update: Partial<Property>) => void;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ property, onUpdate }) => {
    
    return (
        <div className="p-6 space-y-8">
            <PropertyFormBasics property={property} onUpdate={onUpdate} />
            <PropertyFormPhotos property={property} onUpdate={onUpdate} />
            {/* Other sections like Location, Amenities, Pricing will go here */}
        </div>
    );
};

export default PropertyForm;