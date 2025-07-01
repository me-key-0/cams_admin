import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ModernSidebar } from './ModernSidebar';
import { ModernHeader } from './ModernHeader';

export const ModernLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <ModernSidebar isCollapsed={isSidebarCollapsed} />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <ModernHeader onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};