import React from 'react';
import ChatInterface from '../chat/ChatInterface';
import { PropertySearchFilters } from '../../types';

interface CenterPanelProps {
  onAiSearch: (filters: PropertySearchFilters) => void;
}

const CenterPanel: React.FC<CenterPanelProps> = ({ onAiSearch }) => {
  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
      <ChatInterface onAiSearch={onAiSearch} />
    </div>
  );
};

export default CenterPanel;
