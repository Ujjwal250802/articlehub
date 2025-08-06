import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import PublicArticles from './pages/PublicArticles';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Categories from './pages/Categories';
import Branch from './pages/Branch';
import Articles from './pages/Articles';
import Help from './pages/Help';
import PrivateRoute from './components/PrivateRoute';
import AdminLayout from './components/AdminLayout';
import StudentLogin from './pages/StudentLogin';
import StudentRoute from './components/StudentRoute';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/student-login" />} />
            <Route path="/student-login" element={<StudentLogin />} />
            <Route 
              path="/student-articles" 
              element={
                <StudentRoute>
                  <PublicArticles />
                </StudentRoute>
              } 
            />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <AdminLayout>
                    <Dashboard />
                  </AdminLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/users"
              element={
                <PrivateRoute>
                  <AdminLayout>
                    <Users />
                  </AdminLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/categories"
              element={
                <PrivateRoute>
                  <AdminLayout>
                    <Categories />
                  </AdminLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/branch"
              element={
                <PrivateRoute>
                  <AdminLayout>
                    <Branch />
                  </AdminLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/articles"
              element={
                <PrivateRoute>
                  <AdminLayout>
                    <Articles />
                  </AdminLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/help"
              element={
                <PrivateRoute>
                  <AdminLayout>
                    <Help />
                  </AdminLayout>
                </PrivateRoute>
              }
            />
          </Routes>
          <Toaster position="top-right" />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
