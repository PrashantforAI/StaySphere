import React from 'react';
import { Property, PropertyType } from '../../../types';
import PropertyFormSection from './PropertyFormSection';

interface PropertyFormBasicsProps {
    property: Partial<Property>;
    onUpdate: (update: Partial<Property>) => void;
}

const commonInputClasses = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 sm:text-sm";

const PropertyFormBasics: React.FC<PropertyFormBasicsProps> = ({ property, onUpdate }) => {
    
    return (
        <PropertyFormSection title="The Basics">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Property Title</label>
                <input
                    type="text"
                    id="title"
                    value={property.title || ''}
                    onChange={(e) => onUpdate({ title: e.target.value })}
                    className={commonInputClasses}
                    placeholder="e.g., Serene Beachfront Villa"
                />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea
                    id="description"
                    rows={4}
                    value={property.description || ''}
                    onChange={(e) => onUpdate({ description: e.target.value })}
                    className={commonInputClasses}
                    placeholder="Describe what makes your place special."
                />
            </div>
            <div>
                <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Property Type</label>
                <select
                    id="propertyType"
                    value={property.propertyType || ''}
                    onChange={(e) => onUpdate({ propertyType: e.target.value as PropertyType })}
                    className={commonInputClasses}
                >
                    <option value="">Select a type</option>
                    <option value={PropertyType.VILLA}>Villa</option>
                    <option value={PropertyType.APARTMENT}>Apartment</option>
                    <option value={PropertyType.COTTAGE}>Cottage</option>
                    <option value={PropertyType.UNIQUE}>Unique Stay</option>
                </select>
            </div>
        </PropertyFormSection>
    );
};

export default PropertyFormBasics;