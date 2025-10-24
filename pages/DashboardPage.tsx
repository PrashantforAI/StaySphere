
import React from 'react';
import LeftPanel from '../components/layout/LeftPanel';
import CenterPanel from '../components/layout/CenterPanel';
import RightPanel from '../components/layout/RightPanel';
import MobileNav from '../components/layout/MobileNav';

const ChatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.455.09-.934.09-1.425v-2.134c0-2.639 2.11-4.75 4.75-4.75h4.134c2.64 0 4.75 2.111 4.75 4.75Z" /></svg>


const DashboardPage: React.FC = () => {
  return (
    <div className="h-screen w-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      {/* Desktop Layout: 3-panel */}
      <div className="hidden md:grid md:grid-cols-10 h-full">
        <div className="md:col-span-2">
          <LeftPanel />
        </div>
        <div className="md:col-span-4">
          <CenterPanel />
        </div>
        <div className="md:col-span-4">
          <RightPanel />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden h-full flex flex-col">
        <div className="flex-grow overflow-y-auto pb-16">
          {/* On mobile, we can show one panel at a time, RightPanel is the default */}
          <RightPanel />
        </div>
        <MobileNav />
        <button className="fixed bottom-20 right-4 bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
            <ChatIcon />
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
