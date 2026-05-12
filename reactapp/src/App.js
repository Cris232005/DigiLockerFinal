import React, { useState } from 'react';
import LoginRegister from './components/LoginRegister';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import AuditLog from './components/AuditLog';
import './styles/LoginRegister.css';
import './styles/UserDashboard.css';
import './styles/DocumentUpload.css';
import './styles/DocumentDetails.css';
import './styles/AdminDashboard.css';
import './styles/AuditLog.css';

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('dashboard');
  };

  const renderCurrentView = () => {
    if (!user) {
      return <LoginRegister onLogin={handleLogin} />;
    }

    switch (currentView) {
      case 'dashboard':
        return user.role === 'ADMIN' ? (
          <AdminDashboard 
            user={user} 
            onLogout={handleLogout}
            onViewAuditLog={() => setCurrentView('audit')}
          />
        ) : (
          <UserDashboard 
            user={user} 
            onLogout={handleLogout}
            onViewAuditLog={() => setCurrentView('audit')}
          />
        );
      case 'audit':
        return (
          <AuditLog 
            user={user} 
            onBack={() => setCurrentView('dashboard')}
          />
        );
      default:
        return user.role === 'ADMIN' ? (
          <AdminDashboard user={user} onLogout={handleLogout} />
        ) : (
          <UserDashboard user={user} onLogout={handleLogout} />
        );
    }
  };

  return (
    <div className="App" style={{ fontSize: '18px' }}>
      {renderCurrentView()}
    </div>
  );
}

export default App;