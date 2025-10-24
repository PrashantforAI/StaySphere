import React, { useState, FormEvent, useRef, useEffect } from 'react';

// Defines the structure of a single chat message
interface ChatMessage {
    text: string;
    sender: 'user' | 'ai';
}

const PaperAirplaneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
    </svg>
);

const ChatInterface: React.FC = () => {
    // State to hold the conversation messages
    const [messages, setMessages] = useState<ChatMessage[]>([
        { text: "Welcome to StaySphere AI! How can I help you plan your perfect vacation today?", sender: 'ai' }
    ]);
    // State for the user's current input
    const [inputValue, setInputValue] = useState('');
    // State to track if the bot is "thinking"
    const [isTyping, setIsTyping] = useState(false);

    // Ref to the message container for auto-scrolling
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Effect to scroll to the bottom whenever messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const trimmedInput = inputValue.trim();
        if (!trimmedInput) return;

        // Add user's message to the chat
        const userMessage: ChatMessage = { text: trimmedInput, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInputValue(''); // Clear the input field

        // Simulate AI "thinking" then responding
        setIsTyping(true);
        setTimeout(() => {
            // This is a simple "echo bot". It just repeats the user's message.
            // In the future, this is where you would call the Gemini API.
            const aiResponse: ChatMessage = { text: `You said: "${trimmedInput}"`, sender: 'ai' };
            setMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);
        }, 1000); // 1-second delay to simulate thinking
    };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <h2 className="font-bold text-lg">AI Assistant</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Ask me anything about your trip!</p>
      </header>
      
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
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-start">
              <div className="p-3 rounded-lg bg-primary-100 dark:bg-primary-900/50">
                <p className="text-sm italic">AI is typing...</p>
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
          />
          <button type="submit" className="p-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50" disabled={isTyping || !inputValue.trim()}>
            <PaperAirplaneIcon />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
