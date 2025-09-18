import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Wallets from './pages/Wallets';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

// App Layout Component
function AppLayout({ children, showNavbar = true, showContainer = true }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 transition-all duration-500">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="relative z-10">
        {showNavbar && <Navbar />}
        {showContainer ? (
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/" 
              element={
                <AppLayout showNavbar={false} showContainer={false}>
                  <Landing />
                </AppLayout>
              } 
            />
            <Route 
              path="/login" 
              element={
                <AppLayout showNavbar={true} showContainer={true}>
                  <Login />
                </AppLayout>
              } 
            />
            <Route 
              path="/signup" 
              element={
                <AppLayout showNavbar={true} showContainer={true}>
                  <Signup />
                </AppLayout>
              } 
            />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <AppLayout showNavbar={true} showContainer={true}>
                    <Dashboard />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/wallets" 
              element={
                <ProtectedRoute>
                  <AppLayout showNavbar={true} showContainer={true}>
                    <Wallets />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/transactions" 
              element={
                <ProtectedRoute>
                  <AppLayout showNavbar={true} showContainer={true}>
                    <Transactions />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/budgets" 
              element={
                <ProtectedRoute>
                  <AppLayout showNavbar={true} showContainer={true}>
                    <Budgets />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
