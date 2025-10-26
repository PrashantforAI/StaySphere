import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { generateChatResponse, AiChatResponse } from '../../services/geminiService';
import { addMessageToConversation, getConversationMessages, getOrCreateAiConversation, getPropertiesByIds } from '../../services/firestoreService';
import { useAuth } from '../../hooks/useAuth';
import { Message, Property, PropertySearchFilters, UserRole } from '../../types';
import ChatPropertyCard from './ChatPropertyCard';

interface ChatInterfaceProps {
    onAiSearch?: (filters: any) => void; // Kept for potential future use, but now handled internally
    showHeader?: boolean;
}

// Defines the structure of a single chat message for local state, now with properties and filters
interface ChatMessage {
    content: string;
    sender: 'user' | 'ai';
    properties?: Property[];
    inferredFilters?: PropertySearchFilters;
}

const PaperAirplaneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
    </svg>
);

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onAiSearch, showHeader = true }) => {
    const { currentUser, userProfile } = useAuth();
    const [messages, setMessages] = useState<ChatMessage[]>([
        { content: "Welcome to StaySphere AI! How can I help you plan your perfect vacation today? You can ask me to find a place, for example: 'Find me a villa in Lonavala for 4 people'.", sender: 'ai' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [conversationId, setConversationId] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch or create conversation on component mount
    useEffect(() => {
        const setupConversation = async () => {
            if (currentUser) {
                try {
                    const convId = await getOrCreateAiConversation(currentUser.uid);
                    setConversationId(convId);
                    const history = await getConversationMessages(convId);
                    
                    if (history.length > 0) {
                        const richHistory = await Promise.all(history.map(async (msg) => {
                            const chatMsg: ChatMessage = {
                                content: msg.content,
                                sender: msg.senderType === 'ai' ? 'ai' : 'user',
                            };
                            if (msg.propertyIds && msg.propertyIds.length > 0) {
                                chatMsg.properties = await getPropertiesByIds(msg.propertyIds);
                            }
                            return chatMsg;
                        }));
                        setMessages(richHistory);
                    }
                } catch (error) {
                    console.error("Error setting up conversation:", error);
                }
            }
        };
        setupConversation();
    }, [currentUser]);

    // Effect to scroll to the bottom whenever messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const trimmedInput = inputValue.trim();
        if (!trimmedInput || !conversationId || !currentUser || !userProfile) return;

        const userMessage: ChatMessage = { content: trimmedInput, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        const userSenderType = userProfile.role === UserRole.HOST ? UserRole.HOST : UserRole.GUEST;

        // Save user message to Firestore
        await addMessageToConversation(conversationId, {
            senderId: currentUser.uid,
            senderType: userSenderType,
            content: trimmedInput,
            read: false,
        });
        
        // Create a history snapshot for the Gemini API call
        const fullHistoryForGemini: Message[] = [...messages, userMessage].map(m => ({
            content: m.content,
            senderType: m.sender === 'user' ? userSenderType : 'ai',
        } as Message));

        try {
            const aiResponse = await generateChatResponse(fullHistoryForGemini);
            let suggestedProperties: Property[] = [];
            
            if (aiResponse.propertyIds && aiResponse.propertyIds.length > 0) {
                suggestedProperties = await getPropertiesByIds(aiResponse.propertyIds);
            }
            
            const aiMessage: ChatMessage = { 
                content: aiResponse.text, 
                sender: 'ai',
                properties: suggestedProperties,
                inferredFilters: aiResponse.inferredFilters,
            };
            setMessages(prev => [...prev, aiMessage]);

            // Save AI text response to Firestore, including propertyIds for persistence
            await addMessageToConversation(conversationId, {
                senderId: 'ai',
                senderType: 'ai',
                content: aiResponse.text,
                read: true,
                propertyIds: aiResponse.propertyIds,
            });

        } catch (error) {
            console.error("Error handling chat submit:", error);
            const errorMessage: ChatMessage = { content: "Sorry, I'm having trouble connecting right now. Please try again in a moment.", sender: 'ai' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {showHeader && (
        <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <h2 className="font-bold text-lg">AI Assistant</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Your personal vacation planner!</p>
        </header>
      )}
      
      {/* Message display area */}
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="flex flex-col space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`p-3 rounded-lg max-w-xs lg:max-w-md shadow-sm ${
                  message.sender === 'ai'
                    ? 'bg-primary-100 dark:bg-primary-900/50'
                    : 'bg-white dark:bg-gray-700'
                }`}>
                <p className="text-sm">{message.content}</p>
              </div>
               {message.properties && message.properties.length > 0 && (
                <div className="mt-2 w-full max-w-md lg:max-w-xl">
                    <div className="flex gap-4 overflow-x-auto p-2 -mx-2 snap-x snap-mandatory">
                        {message.properties.map(prop => <ChatPropertyCard key={prop.propertyId} property={prop} filters={message.inferredFilters} />)}
                    </div>
                </div>
              )}
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
      
      {/* Input form */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-800">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={isTyping}
            aria-label="Chat input"
          />
          <button type="submit" className="p-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50" disabled={isTyping || !inputValue.trim()} aria-label="Send message">
            <PaperAirplaneIcon />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;