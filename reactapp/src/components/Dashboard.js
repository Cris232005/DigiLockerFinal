import React, { useState, useEffect } from 'react';
import { userAPI, documentAPI, folderAPI, activityAPI } from '../api';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [folders, setFolders] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    name: '', username: '', email: '', passwordHash: '', role: 'USER'
  });

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await userAPI.login(loginForm);
      if (response.data.success) {
        setUser(response.data);
        loadUserData(response.data.id);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert('Login failed');
    }
  };

  // Register handler
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await userAPI.register(registerForm);
      alert('Registration successful! Please login.');
      setRegisterForm({ name: '', username: '', email: '', passwordHash: '', role: 'USER' });
    } catch (error) {
      alert('Registration failed');
    }
  };

  // Load user data
  const loadUserData = async (userId) => {
    try {
      const [docsRes, foldersRes, activitiesRes] = await Promise.all([
        documentAPI.getUserDocuments(userId),
        folderAPI.getUserFolders(userId),
        activityAPI.getUserActivity(userId)
      ]);
      setDocuments(docsRes.data);
      setFolders(foldersRes.data);
      setActivities(activitiesRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  // Upload document
  const handleUpload = async (docData) => {
    try {
      await documentAPI.uploadDocument(user.id, docData);
      loadUserData(user.id);
      alert('Document uploaded successfully!');
    } catch (error) {
      alert(error.response?.data || 'Upload failed');
    }
  };

  // Download document
  const handleDownload = async (docId, docName) => {
    try {
      const response = await documentAPI.downloadDocument(docId);
      // Create download link
      const link = document.createElement('a');
      link.href = response.data;
      link.download = docName;
      link.click();
    } catch (error) {
      alert('Download failed');
    }
  };

  if (!user) {
    return (
      <div className="auth-container">
        <h1>Digital Locker System</h1>
        
        {/* Login Form */}
        <div className="auth-form">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username or Email"
              value={loginForm.username}
              onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
              required
            />
            <button type="submit">Login</button>
          </form>
        </div>

        {/* Register Form */}
        <div className="auth-form">
          <h2>Register</h2>
          <form onSubmit={handleRegister}>
            <input
              placeholder="Full Name"
              value={registerForm.name}
              onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
              required
            />
            <input
              placeholder="Username"
              value={registerForm.username}
              onChange={(e) => setRegisterForm({...registerForm, username: e.target.value})}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={registerForm.email}
              onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={registerForm.passwordHash}
              onChange={(e) => setRegisterForm({...registerForm, passwordHash: e.target.value})}
              required
            />
            <select
              value={registerForm.role}
              onChange={(e) => setRegisterForm({...registerForm, role: e.target.value})}
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
            <button type="submit">Register</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header>
        <h1>Digital Locker - Welcome {user.username}</h1>
        <div>
          <span>Role: {user.role}</span>
          <span>Storage: {user.storageUsed} bytes</span>
          <button onClick={() => setUser(null)}>Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Upload Section */}
        <section className="upload-section">
          <h2>Upload Document</h2>
          <UploadForm onUpload={handleUpload} />
        </section>

        {/* Documents Section */}
        <section className="documents-section">
          <h2>My Documents ({documents.length})</h2>
          <div className="documents-grid">
            {documents.map(doc => (
              <div key={doc.id} className="document-card">
                <h3>{doc.name}</h3>
                <p>Type: {doc.fileType}</p>
                <p>Size: {doc.size} bytes</p>
                <p>Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                {doc.isArchived && <span className="archived">ARCHIVED</span>}
                <div className="document-actions">
                  <button onClick={() => handleDownload(doc.id, doc.name)}>
                    Download
                  </button>
                  <button onClick={async () => {
                    await documentAPI.toggleArchive(doc.id);
                    loadUserData(user.id);
                  }}>
                    {doc.isArchived ? 'Unarchive' : 'Archive'}
                  </button>
                  <button onClick={async () => {
                    if (window.confirm('Delete this document?')) {
                      await documentAPI.deleteDocument(doc.id);
                      loadUserData(user.id);
                    }
                  }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Folders Section */}
        <section className="folders-section">
          <h2>My Folders ({folders.length})</h2>
          <FolderManager 
            folders={folders} 
            userId={user.id} 
            onUpdate={() => loadUserData(user.id)} 
          />
        </section>

        {/* Activity Log */}
        <section className="activity-section">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {activities.slice(0, 10).map(activity => (
              <div key={activity.id} className="activity-item">
                <span className="action">{activity.action}</span>
                <span className="document">{activity.document?.name}</span>
                <span className="time">{new Date(activity.timestamp).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

// Upload Form Component
const UploadForm = ({ onUpload }) => {
  const [formData, setFormData] = useState({
    name: '', fileType: '', fileUrl: '', size: 0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpload(formData);
    setFormData({ name: '', fileType: '', fileUrl: '', size: 0 });
  };

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <input
        placeholder="Document Name"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        required
      />
      <input
        placeholder="File Type (e.g., PDF, DOC)"
        value={formData.fileType}
        onChange={(e) => setFormData({...formData, fileType: e.target.value})}
        required
      />
      <input
        placeholder="File URL"
        value={formData.fileUrl}
        onChange={(e) => setFormData({...formData, fileUrl: e.target.value})}
        required
      />
      <input
        type="number"
        placeholder="File Size (bytes)"
        value={formData.size}
        onChange={(e) => setFormData({...formData, size: parseInt(e.target.value)})}
        required
      />
      <button type="submit">Upload Document</button>
    </form>
  );
};

// Folder Manager Component
const FolderManager = ({ folders, userId, onUpdate }) => {
  const [newFolderName, setNewFolderName] = useState('');

  const createFolder = async (e) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      try {
        await folderAPI.createFolder(userId, { name: newFolderName });
        setNewFolderName('');
        onUpdate();
      } catch (error) {
        alert('Failed to create folder');
      }
    }
  };

  return (
    <div className="folder-manager">
      <form onSubmit={createFolder} className="create-folder-form">
        <input
          placeholder="Folder Name"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          required
        />
        <button type="submit">Create Folder</button>
      </form>
      
      <div className="folders-grid">
        {folders.map(folder => (
          <div key={folder.id} className="folder-card">
            <h3>📁 {folder.name}</h3>
            <p>Created: {new Date(folder.createdAt).toLocaleDateString()}</p>
            <button onClick={async () => {
              if (window.confirm('Delete this folder?')) {
                await folderAPI.deleteFolder(folder.id);
                onUpdate();
              }
            }}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;