import React from 'react';
import { Property, PropertyImage } from '../../../types';
import PropertyFormSection from './PropertyFormSection';

interface PropertyFormPhotosProps {
    property: Partial<Property>;
    onUpdate: (update: Partial<Property>) => void;
}

const commonInputClasses = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 sm:text-sm";

const PropertyFormPhotos: React.FC<PropertyFormPhotosProps> = ({ property, onUpdate }) => {
    
    const handleCaptionChange = (index: number, caption: string) => {
        const newImages = [...(property.images || [])];
        newImages[index].caption = caption;
        onUpdate({ images: newImages });
    };

    const handleDelete = (index: number) => {
        const newImages = (property.images || []).filter((_, i) => i !== index);
        onUpdate({ images: newImages });
    };

    return (
        <PropertyFormSection title="Photos">
            <p className="text-sm text-gray-500 dark:text-gray-400 -mt-2 mb-2">
                Upload photos via the AI chat. You can edit the details here.
            </p>
            {property.images && property.images.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {property.images.map((image, index) => (
                        <div key={image.url} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                            <img src={image.url} alt={image.caption} className="w-full h-40 object-cover rounded-md mb-3" />
                            <div>
                                <label htmlFor={`caption-${index}`} className="text-xs font-medium text-gray-500 dark:text-gray-400">Caption</label>
                                <input
                                    type="text"
                                    id={`caption-${index}`}
                                    value={image.caption}
                                    onChange={(e) => handleCaptionChange(index, e.target.value)}
                                    className={commonInputClasses}
                                />
                            </div>
                            {image.aiAnalysis && (
                                <div className="mt-2">
                                     <p className="text-xs font-medium text-gray-500 dark:text-gray-400">AI Analysis:</p>
                                     <div className="flex flex-wrap gap-1 mt-1">
                                        <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 px-2 py-0.5 rounded-full">{image.aiAnalysis.roomType}</span>
                                        {image.aiAnalysis.detectedFeatures.slice(0, 3).map(feature => (
                                             <span key={feature} className="text-xs bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200 px-2 py-0.5 rounded-full">{feature}</span>
                                        ))}
                                     </div>
                                </div>
                            )}
                             <button onClick={() => handleDelete(index)} className="text-xs text-red-500 hover:underline mt-3">
                                Remove Photo
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Your photos will appear here.</p>
                </div>
            )}
        </PropertyFormSection>
    );
};

export default PropertyFormPhotos;