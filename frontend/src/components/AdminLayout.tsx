import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { ChatWidget } from './ChatWidget';

interface AdminLayoutProps {
  children: React.ReactNode;
}
const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main className={`pt-14 transition-all duration-300 ${isCollapsed ? 'pl-0' : 'pl-64'}`}>
        <div className="p-6">
          {children}
        </div>
      </main>
      <ChatWidget isAdmin={true} />
    </div>
  );
};
export default AdminLayout;