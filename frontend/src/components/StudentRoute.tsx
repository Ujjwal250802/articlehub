import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

interface StudentRouteProps {
  children: React.ReactNode;
}

const StudentRoute: React.FC<StudentRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Check if student token exists
    const token = localStorage.getItem('studentToken');
    if (token) {
      setAuthenticated(true);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/student-login" />;
  }

  return <>{children}</>;
};

export default StudentRoute;