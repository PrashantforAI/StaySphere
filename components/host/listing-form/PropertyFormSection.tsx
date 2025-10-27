import React from 'react';

interface PropertyFormSectionProps {
    title: string;
    children: React.ReactNode;
}

const PropertyFormSection: React.FC<PropertyFormSectionProps> = ({ title, children }) => {
    return (
        <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{title}</h2>
            <div className="space-y-4">
                {children}
            </div>
        </section>
    );
};

export default PropertyFormSection;