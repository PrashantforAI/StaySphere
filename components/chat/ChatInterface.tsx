
import React from 'react';

const ChatInterface: React.FC = () => {

    const PaperAirplaneIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
        </svg>
    )

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="font-bold text-lg">AI Assistant</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Ask me anything about your trip!</p>
      </header>
      
      {/* Message display area */}
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="flex flex-col space-y-4">
          {/* Example AI message */}
          <div className="flex items-start">
            <div className="p-3 rounded-lg bg-primary-100 dark:bg-primary-900/50 max-w-xs lg:max-w-md">
              <p className="text-sm">Welcome to StaySphere AI! How can I help you plan your perfect vacation today?</p>
            </div>
          </div>
          {/* Example User message */}
          <div className="flex items-start justify-end">
            <div className="p-3 rounded-lg bg-white dark:bg-gray-700 shadow-sm max-w-xs lg:max-w-md">
              <p className="text-sm">I'm looking for a pet-friendly villa in Goa for 4 people next month.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Input form */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <form className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button type="submit" className="p-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
            <PaperAirplaneIcon />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
