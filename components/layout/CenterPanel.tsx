
import React from 'react';
import ChatInterface from '../chat/ChatInterface';

const CenterPanel: React.FC = () => {
  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
      <ChatInterface />
    </div>
  );
};

export default CenterPanel;
