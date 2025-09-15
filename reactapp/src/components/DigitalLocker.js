import React, { useState, useEffect } from 'react';
import { userAPI, documentAPI, folderAPI, activityAPI } from '../api';

const DigitalLocker = () => {
  const [user, setUser] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [folders, setFolders] = useState([]);
  const [activities, setActivities] = useState([]);

  // Login function
  const handleLogin = async (email, password) => {
    try {
      const response = await userAPI.login({ email, password });
      if (response.data.success) {
        setUser(response.data);
        loadUserData(response.data.id);
      }
    } catch (error) {
      console.error('Login failed:', error);
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
      console.error('Failed to load user data:', error);
    }
  };

  // Upload document
  const handleUploadDocument = async (documentData) => {
    try {
      await documentAPI.uploadDocument(user.id, documentData);
      loadUserData(user.id); // Refresh data
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  // Create folder
  const handleCreateFolder = async (folderName) => {
    try {
      await folderAPI.createFolder(user.id, { name: folderName });
      loadUserData(user.id); // Refresh data
    } catch (error) {
      console.error('Folder creation failed:', error);
    }
  };

  return (
    <div className="digital-locker">
      <h1>Digital Locker System</h1>
      
      {!user ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <div>
          <h2>Welcome, {user.name}</h2>
          
          <div className="section">
            <h3>Documents ({documents.length})</h3>
            <DocumentList 
              documents={documents} 
              onUpload={handleUploadDocument}
            />
          </div>
          
          <div className="section">
            <h3>Folders ({folders.length})</h3>
            <FolderList 
              folders={folders} 
              onCreate={handleCreateFolder}
            />
          </div>
          
          <div className="section">
            <h3>Recent Activity</h3>
            <ActivityList activities={activities.slice(0, 5)} />
          </div>
        </div>
      )}
    </div>
  );
};

// Login Form Component
const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

// Document List Component
const DocumentList = ({ documents, onUpload }) => {
  const [showUpload, setShowUpload] = useState(false);

  return (
    <div>
      <button onClick={() => setShowUpload(!showUpload)}>
        {showUpload ? 'Cancel' : 'Upload Document'}
      </button>
      
      {showUpload && <UploadForm onUpload={onUpload} />}
      
      <ul>
        {documents.map(doc => (
          <li key={doc.id}>
            {doc.name} ({doc.fileType}) - {doc.size} bytes
            {doc.isArchived && <span> [ARCHIVED]</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Upload Form Component
const UploadForm = ({ onUpload }) => {
  const [formData, setFormData] = useState({
    name: '',
    fileType: '',
    fileUrl: '',
    size: 0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpload(formData);
    setFormData({ name: '', fileType: '', fileUrl: '', size: 0 });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Document Name"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        required
      />
      <input
        placeholder="File Type"
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
        placeholder="Size (bytes)"
        value={formData.size}
        onChange={(e) => setFormData({...formData, size: parseInt(e.target.value)})}
        required
      />
      <button type="submit">Upload</button>
    </form>
  );
};

// Folder List Component
const FolderList = ({ folders, onCreate }) => {
  const [folderName, setFolderName] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    if (folderName.trim()) {
      onCreate(folderName);
      setFolderName('');
    }
  };

  return (
    <div>
      <form onSubmit={handleCreate}>
        <input
          placeholder="Folder Name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          required
        />
        <button type="submit">Create Folder</button>
      </form>
      
      <ul>
        {folders.map(folder => (
          <li key={folder.id}>
            📁 {folder.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Activity List Component
const ActivityList = ({ activities }) => (
  <ul>
    {activities.map(activity => (
      <li key={activity.id}>
        {activity.action} - {activity.document?.name} 
        <small> ({new Date(activity.timestamp).toLocaleString()})</small>
      </li>
    ))}
  </ul>
);

export default DigitalLocker;