
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getPropertyById, addProperty, updateProperty } from '../../services/firestoreService';
import { Property, PropertyStatus } from '../../types';
import Spinner from '../../components/ui/Spinner';
import Header from '../../components/layout/Header';
import { ROUTES } from '../../constants';
// Import wizard steps (placeholders for now)
// import Step1Basics from '../../components/host/add-property/Step1_Basics';

const PropertyEditorPage: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Partial<Property> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const isEditMode = !!propertyId;

  useEffect(() => {
    if (isEditMode) {
      const fetchProperty = async () => {
        try {
          const propData = await getPropertyById(propertyId);
          if (propData) {
            setProperty(propData);
          } else {
            setError('Property not found.');
          }
        } catch (err) {
          setError('Failed to fetch property details.');
        } finally {
          setLoading(false);
        }
      };
      fetchProperty();
    } else {
      // Initialize a new property object for creation
      setProperty({
        status: PropertyStatus.DRAFT,
        images: [],
        amenities: [],
        rules: {},
        pricing: {},
        capacity: {},
        location: {},
        availability: { blockedDates: [] },
      });
      setLoading(false);
    }
  }, [propertyId, isEditMode]);

  const handleSave = async (newStatus: PropertyStatus) => {
    if (!currentUser || !property) return;
    
    const dataToSave = {
        ...property,
        status: newStatus,
        hostId: currentUser.uid,
    };

    try {
        if (isEditMode) {
            await updateProperty(propertyId, dataToSave);
        } else {
            const newId = await addProperty(dataToSave);
            // In a real app, you would navigate to the edit page for the new ID
            // navigate(ROUTES.HOST_EDIT_PROPERTY.replace(':propertyId', newId));
        }
        alert(`Property saved successfully as ${newStatus}!`);
        navigate(ROUTES.HOST_PROPERTIES);
    } catch (err) {
        setError('Failed to save property.');
        console.error(err);
    }
  };


  if (loading) {
    return <div className="h-screen flex items-center justify-center"><Spinner /></div>;
  }
  
  if (error) {
    return <div className="text-red-500 text-center p-8">{error}</div>;
  }
  
  // This is a placeholder for the multi-step wizard UI
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-6">{isEditMode ? 'Edit Property' : 'Add New Property'}</h1>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Property Wizard (Under Construction)</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
                This area will contain the multi-step form for adding and editing property details. Each step will validate input and contribute to the complete property profile.
            </p>
            <div className="space-y-4">
                 <label className="block">
                    <span className="text-gray-700 dark:text-gray-300">Title</span>
                    <input 
                        type="text" 
                        value={property?.title || ''}
                        onChange={(e) => setProperty(p => ({...p, title: e.target.value}))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600"
                    />
                </label>
                 <label className="block">
                    <span className="text-gray-700 dark:text-gray-300">Description</span>
                    <textarea 
                        value={property?.description || ''}
                        onChange={(e) => setProperty(p => ({...p, description: e.target.value}))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600"
                    />
                </label>
            </div>
            <div className="mt-8 flex justify-end gap-4">
                <button 
                    onClick={() => handleSave(PropertyStatus.DRAFT)}
                    className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                    Save as Draft
                </button>
                 <button 
                    onClick={() => handleSave(PropertyStatus.ACTIVE)}
                    className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                    {isEditMode ? 'Update & Publish' : 'Publish Listing'}
                </button>
            </div>
        </div>
      </main>
    </div>
  );
};

export default PropertyEditorPage;
