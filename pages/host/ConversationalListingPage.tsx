import React, { useState, useEffect, FormEvent, useRef, ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getPropertyById, addProperty, updateProperty } from '../../services/firestoreService';
import { guidePropertyListing, analyzePropertyImage } from '../../services/geminiService';
import { Property, PropertyStatus, Message, UserRole, AiImageAnalysis, PropertyImage } from '../../types';
import Spinner from '../../components/ui/Spinner';
import { ROUTES } from '../../constants';
import { v4 as uuidv4 } from 'uuid';
import { uploadImage } from '../../services/storageService';
import PropertyForm from '../../components/host/listing-form/PropertyForm';

const PaperAirplaneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
    </svg>
);
const CameraIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.776 48.776 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" /></svg>;

const fileToB64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
});

const ConversationalListingPage: React.FC = () => {
    const { propertyId } = useParams<{ propertyId: string }>();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [property, setProperty] = useState<Partial<Property>>({ images: [], amenities: {} });
    const [conversation, setConversation] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    
    const [loading, setLoading] = useState(true);
    const [isTyping, setIsTyping] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const [isListingComplete, setIsListingComplete] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isEditMode = !!propertyId;

    // Check for completion status whenever property data changes
    useEffect(() => {
        const checkCompletion = () => {
            const p = property;
            const complete = !!(p.title && p.propertyType && p.location?.city && p.capacity?.maxGuests != null && p.description && p.pricing?.basePrice != null);
            setIsListingComplete(complete);
        };
        checkCompletion();
    }, [property]);


    useEffect(() => {
        const initialize = async () => {
            if (isEditMode) {
                try {
                    const propData = await getPropertyById(propertyId);
                    if (propData) {
                        setProperty(propData);
                        setConversation([{
                            messageId: uuidv4(), senderId: 'ai', senderType: 'ai',
                            content: `Welcome back! Let's continue editing '${propData.title}'. You can either update the form on the left or continue chatting with me.`,
                            timestamp: { seconds: Date.now() / 1000, nanoseconds: 0 } as any, read: true,
                        }]);
                    } else { setError('Property not found.'); }
                } catch (err) { setError('Failed to fetch property details.'); }
            } else {
                setProperty({ status: PropertyStatus.IN_PROGRESS, images: [], amenities: {} });
                setConversation([{
                    messageId: uuidv4(), senderId: 'ai', senderType: 'ai',
                    content: "Hi! I'm Sphere, your AI assistant. Let's list your property. You can either fill out the form on the left, or just talk to me. To start, what would you call your place?",
                    timestamp: { seconds: Date.now() / 1000, nanoseconds: 0 } as any, read: true,
                }]);
            }
            setLoading(false);
        };
        initialize();
    }, [propertyId, isEditMode]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [conversation]);

    const handleSendMessage = async (e: FormEvent) => {
        e.preventDefault();
        const trimmedInput = inputValue.trim();
        if (!trimmedInput || isTyping) return;

        const userMessage: Message = {
            messageId: uuidv4(), senderId: currentUser!.uid, senderType: UserRole.HOST,
            content: trimmedInput, timestamp: { seconds: Date.now() / 1000, nanoseconds: 0 } as any, read: true,
        };

        const newConversation = [...conversation, userMessage];
        setConversation(newConversation);
        setInputValue('');
        setIsTyping(true);

        try {
            const response = await guidePropertyListing(newConversation, property);
            
            setProperty(prev => ({ ...prev, ...response.updatedData }));

            const aiMessage: Message = {
                messageId: uuidv4(), senderId: 'ai', senderType: 'ai',
                content: response.nextQuestion, timestamp: { seconds: Date.now() / 1000, nanoseconds: 0 } as any, read: true,
            };
            if (response.nextQuestion) {
                setConversation(prev => [...prev, aiMessage]);
            }

        } catch (err) {
            console.error(err);
             const errorMessage: Message = {
                 messageId: uuidv4(), senderId: 'ai', senderType: 'ai',
                 content: "Sorry, I had trouble processing that. Can we try again?",
                 timestamp: { seconds: Date.now() / 1000, nanoseconds: 0 } as any, read: true,
            };
            setConversation(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            // 1. Add AI message that it's processing
            const processingMessage: Message = {
                messageId: uuidv4(), senderId: 'ai', senderType: 'ai',
                content: `Great photo! I'm analyzing it now to suggest a caption and find amenities...`,
                timestamp: { seconds: Date.now() / 1000, nanoseconds: 0 } as any, read: true,
            };
            setConversation(prev => [...prev, processingMessage]);

            // 2. Upload to storage & analyze with Gemini
            const [imageUrl, b64Image] = await Promise.all([
                uploadImage(file, `property-images/${currentUser?.uid}`),
                fileToB64(file),
            ]);
            const analysis = await analyzePropertyImage(b64Image, file.type);
            
            // 3. Update property state
            const newImage: PropertyImage = {
                url: imageUrl,
                caption: analysis.suggestedCaption,
                order: (property.images?.length || 0) + 1,
                aiAnalysis: analysis,
            };
            setProperty(prev => ({...prev, images: [...(prev.images || []), newImage]}));

            // 4. Add AI response message
            const analysisMessage: Message = {
                messageId: uuidv4(), senderId: 'ai', senderType: 'ai',
                content: `Okay, I've analyzed the photo. I think it's a ${analysis.roomType}. I've added my suggested caption: "${analysis.suggestedCaption}". I also spotted these features: ${analysis.detectedFeatures.join(', ')}. You can edit this in the form. Feel free to upload another!`,
                timestamp: { seconds: Date.now() / 1000, nanoseconds: 0 } as any, read: true,
            };
            setConversation(prev => [...prev, analysisMessage]);

        } catch (err) {
            console.error(err);
             const errorMessage: Message = {
                 messageId: uuidv4(), senderId: 'ai', senderType: 'ai',
                 content: "I'm sorry, I had trouble uploading or analyzing that image. Please try again.",
                 timestamp: { seconds: Date.now() / 1000, nanoseconds: 0 } as any, read: true,
            };
            setConversation(prev => [...prev, errorMessage]);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSaveAndExit = async () => {
        if (!currentUser || !property) return;
        const dataToSave = { ...property, hostId: currentUser.uid };
        try {
            if (isEditMode) {
                await updateProperty(propertyId, dataToSave);
            } else {
                if(!dataToSave.title) dataToSave.title = "Untitled Listing";
                await addProperty(dataToSave);
            }
            navigate(ROUTES.HOST_PROPERTIES);
        } catch(err) { setError("Failed to save progress."); }
    };
    
    const handlePublish = async () => {
        if (!currentUser || !property) return;
        const dataToSave = { 
            ...property, 
            hostId: currentUser.uid,
            status: PropertyStatus.ACTIVE // Set status to active
        };
        try {
            if (isEditMode) {
                await updateProperty(propertyId, dataToSave);
            } else {
                if(!dataToSave.title) dataToSave.title = "Untitled Listing";
                await addProperty(dataToSave);
            }
            alert("Listing published successfully!");
            navigate(ROUTES.HOST_PROPERTIES);
        } catch(err) { setError("Failed to publish listing."); }
    };

    const handleFormUpdate = (updatedProperty: Partial<Property>) => {
        setProperty(prev => ({ ...prev, ...updatedProperty }));
    };

    if (loading) return <div className="h-full flex items-center justify-center"><Spinner /></div>;
    if (error) return <div className="text-red-500 text-center p-8">{error}</div>;

    return (
        <div className="h-full flex flex-col overflow-hidden">
            <div className="flex-grow p-4 flex flex-col md:flex-row gap-4 overflow-hidden">
                {/* Left Panel: Visual Form */}
                <div className="w-full md:w-1/2 lg:w-3/5 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-1 flex-shrink-0 overflow-y-auto">
                    <PropertyForm property={property} onUpdate={handleFormUpdate} />
                </div>
                
                {/* Right Panel: Chat Interface */}
                <main className="flex-grow flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    <header className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="font-bold text-lg">Sphere AI Assistant</h2>
                    </header>
                    <div className="flex-grow p-4 overflow-y-auto">
                        <div className="flex flex-col space-y-4">
                            {conversation.map((message) => (
                                <div key={message.messageId} className={`flex flex-col ${message.senderType === 'host' ? 'items-end' : 'items-start'}`}>
                                <div className={`p-3 rounded-lg max-w-xs lg:max-w-md shadow-sm ${
                                    message.senderType === 'ai' ? 'bg-primary-100 dark:bg-primary-900/50' : 'bg-gray-200 dark:bg-gray-700'
                                    }`}>
                                    <p className="text-sm">{message.content}</p>
                                </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex items-start">
                                    <div className="p-3 rounded-lg bg-primary-100 dark:bg-primary-900/50">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                                            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" style={{animationDelay: '200ms'}}></div>
                                            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" style={{animationDelay: '400ms'}}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                    
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50" disabled={isUploading}>
                            {isUploading ? <Spinner/> : <CameraIcon/>}
                            </button>
                            <input
                                type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Type your answer or ask a question..."
                                className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                disabled={isTyping || isUploading} aria-label="Chat input"
                            />
                            <button type="submit" className="p-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50" disabled={isTyping || isUploading || !inputValue.trim()} aria-label="Send message">
                                <PaperAirplaneIcon />
                            </button>
                        </form>
                    </div>
                </main>
            </div>
            <footer className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-end items-center gap-4">
                <button 
                    onClick={handleSaveAndExit} 
                    className="px-6 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                    Save & Exit
                </button>
                <button 
                    onClick={handlePublish} 
                    disabled={!isListingComplete}
                    className="px-6 py-2 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Publish Listing
                </button>
            </footer>
        </div>
    );
};

export default ConversationalListingPage;