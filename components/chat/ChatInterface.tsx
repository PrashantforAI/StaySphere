import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { extractSearchFiltersFromQuery, generateChatResponse } from '../../services/geminiService';
// FIX: Corrected typo in function import from getAiConversationMessages to getConversationMessages.
import { addMessageToConversation, getConversationMessages, getOrCreateAiConversation } from '../../services/firestoreService';
import { useAuth } from '../../hooks/useAuth';
import { Message, PropertySearchFilters } from '../../types';

interface ChatInterfaceProps {
    onAiSearch: (filters: PropertySearchFilters) => void;
    showHeader?: boolean; // New prop to control header visibility
}

// Defines the structure of a single chat message for local state
interface ChatMessage {
    content: string;
    sender: 'user' | 'ai';
}

const PaperAirplaneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
    </svg>
);

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onAiSearch, showHeader = true }) => {
    // FIX: Destructure userProfile to determine the sender's role for chat messages.
    const { currentUser, userProfile } = useAuth();
    // State to hold the conversation messages
    const [messages, setMessages] = useState<ChatMessage[]>([
        { content: "Welcome to StaySphere AI! How can I help you plan your perfect vacation today?", sender: 'ai' }
    ]);
    // State for the user's current input
    const [inputValue, setInputValue] = useState('');
    // State to track if the bot is "thinking"
    const [isTyping, setIsTyping] = useState(false);
    // State for the Firestore conversation ID
    const [conversationId, setConversationId] = useState<string | null>(null);

    // Ref to the message container for auto-scrolling
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch or create conversation on component mount
    useEffect(() => {
        const setupConversation = async () => {
            if (currentUser) {
                try {
                    const convId = await getOrCreateAiConversation(currentUser.uid);
                    setConversationId(convId);
                    // FIX: Correctly call the imported function 'getConversationMessages'.
                    const history = await getConversationMessages(convId);
                    // Don't override initial welcome message if history is empty
                    if (history.length > 0) {
                        setMessages(history.map(m => ({ content: m.content, sender: m.senderType === 'ai' ? 'ai' : 'user' })));
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
        // FIX: Added userProfile to the guard clause to ensure role is available.
        if (!trimmedInput || !conversationId || !currentUser || !userProfile) return;

        const userMessage: ChatMessage = { content: trimmedInput, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        // FIX: Determine the correct senderType based on user role. 'user' is not a valid senderType.
        // Default to 'guest' for any role that isn't 'host'.
        const userSenderType = userProfile.role === 'host' ? 'host' : 'guest';

        // Save user message to Firestore
        await addMessageToConversation(conversationId, {
            senderId: currentUser.uid,
            senderType: userSenderType,
            content: trimmedInput,
            read: false,
        });
        
        // Create a history snapshot for the Gemini API call
        // FIX: Map the local sender type 'user' to a valid Message senderType ('guest' or 'host').
        const fullHistoryForGemini: Message[] = [...messages, userMessage].map(m => ({
            content: m.content,
            senderType: m.sender === 'user' ? userSenderType : 'ai',
        } as Message));

        try {
            // First, try to extract search filters
            const filters = await extractSearchFiltersFromQuery(trimmedInput);
            let aiResponseText: string;

            if (filters) {
                // If filters are found, trigger the search in the parent component
                onAiSearch(filters);
                aiResponseText = "Great! I've updated the property list based on your request. Let me know if you'd like to make any other changes.";
            } else {
                // If no filters are found, get a general conversational response
                aiResponseText = await generateChatResponse(fullHistoryForGemini);
            }
            
            const aiMessage: ChatMessage = { content: aiResponseText, sender: 'ai' };
            setMessages(prev => [...prev, aiMessage]);

            // Save AI response to Firestore
            await addMessageToConversation(conversationId, {
                senderId: 'ai',
                senderType: 'ai',
                content: aiResponseText,
                read: true,
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
            <p className="text-sm text-gray-500 dark:text-gray-400">Ask me anything about your trip!</p>
        </header>
      )}
      
      {/* Message display area */}
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="flex flex-col space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex items-start ${message.sender === 'user' ? 'justify-end' : ''}`}>
              <div className={`p-3 rounded-lg max-w-xs lg:max-w-md shadow-sm ${
                  message.sender === 'ai'
                    ? 'bg-primary-100 dark:bg-primary-900/50'
                    : 'bg-white dark:bg-gray-700'
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
          {/* Empty div to act as a scroll target */}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input form */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
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