import React, { useState, useEffect, useCallback } from 'react';
import { documentAPI, folderAPI } from '../api';
import DocumentUpload from './DocumentUpload';
import DocumentDetails from './DocumentDetails';
import '../styles/UserDashboard.css';

const UserDashboard = ({ user, onLogout }) => {
  const [documents, setDocuments] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [activeFilter, setActiveFilter] = useState('all');

  const loadUserData = useCallback(async () => {
    try {
      const [docsRes, foldersRes] = await Promise.all([
        documentAPI.getUserDocuments(user.id),
        folderAPI.getUserFolders(user.id)
      ]);
      setDocuments(docsRes.data);
      setFolders(foldersRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  }, [user.id]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);



  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (activeFilter) {
      case 'archived':
        return matchesSearch && doc.isArchived;
      case 'recent':
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        return matchesSearch && new Date(doc.uploadedAt) > threeDaysAgo;
      case 'trash':
        return matchesSearch && doc.isDeleted;
      default:
        return matchesSearch && !doc.isDeleted;
    }
  });

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    const icons = {
      'PDF': '📄', 'DOC': '📝', 'DOCX': '📝', 'XLS': '📊', 'XLSX': '📊',
      'PPT': '📊', 'PPTX': '📊', 'TXT': '📄', 'JPG': '🖼️', 'PNG': '🖼️',
      'GIF': '🖼️', 'MP4': '🎥', 'AVI': '🎥', 'MP3': '🎵', 'WAV': '🎵'
    };
    return icons[fileType?.toUpperCase()] || '📄';
  };

  const createFolder = async () => {
    const name = prompt('Enter folder name:');
    if (name) {
      try {
        await folderAPI.createFolder(user.id, { name });
        loadUserData();
      } catch (error) {
        alert('Failed to create folder');
      }
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Digital Locker</h2>
          <div className="user-info">
            <div className="avatar">{user.username[0].toUpperCase()}</div>
            <div>
              <p className="username">{user.username}</p>
              <p className="role">{user.role}</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            <i className="icon-folder"></i> My Files
          </button>
          <button 
            className={`nav-item ${activeFilter === 'archived' ? 'active' : ''}`}
            onClick={() => setActiveFilter('archived')}
          >
            <i className="icon-archive"></i> Archived
          </button>
          <button 
            className={`nav-item ${activeFilter === 'recent' ? 'active' : ''}`}
            onClick={() => setActiveFilter('recent')}
          >
            <i className="icon-clock"></i> Recent
          </button>
          <button 
            className={`nav-item ${activeFilter === 'trash' ? 'active' : ''}`}
            onClick={() => setActiveFilter('trash')}
          >
            <i className="icon-trash"></i> Trash
          </button>
        </nav>

        <div className="storage-info">
          <h4>Storage Usage</h4>
          <div className="storage-bar">
            <div 
              className="storage-used" 
              style={{width: `${(user.storageUsed / 1073741824) * 100}%`}}
            ></div>
          </div>
          <p>{formatFileSize(user.storageUsed)} / 1 GB</p>
        </div>

        <button className="logout-btn" onClick={onLogout}>
          <i className="icon-logout"></i> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Action Bar */}
        <div className="action-bar">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <i className="icon-search"></i>
          </div>
          
          <div className="action-buttons">
            <button className="action-btn primary" onClick={() => setShowUpload(true)}>
              <i className="icon-upload"></i> Upload Document
            </button>
            <button className="action-btn" onClick={createFolder}>
              <i className="icon-folder-plus"></i> New Folder
            </button>
            <div className="view-toggle">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <i className="icon-grid"></i>
              </button>
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <i className="icon-list"></i>
              </button>
            </div>
          </div>
        </div>

        {/* File Browser */}
        <div className="file-browser">
          <div className="breadcrumb">
            <span>
              {activeFilter === 'all' && 'My Files'}
              {activeFilter === 'archived' && 'Archived Files'}
              {activeFilter === 'recent' && 'Recent Files'}
              {activeFilter === 'trash' && 'Trash'}
            </span>
            {currentFolder && <span> / {currentFolder.name}</span>}
          </div>

          {/* Folders */}
          {folders.length > 0 && (
            <div className="folders-section">
              <h3>Folders</h3>
              <div className={`items-container ${viewMode}`}>
                {folders.map(folder => (
                  <div key={folder.id} className="folder-item">
                    <div className="item-icon">📁</div>
                    <div className="item-info">
                      <h4>{folder.name}</h4>
                      <p>Created: {new Date(folder.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="item-actions">
                      <button onClick={() => setCurrentFolder(folder)}>Open</button>
                      <button onClick={async () => {
                        if (window.confirm('Delete folder?')) {
                          await folderAPI.deleteFolder(folder.id);
                          loadUserData();
                        }
                      }}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          <div className="documents-section">
            <h3>Documents ({filteredDocuments.length})</h3>
            <div className={`items-container ${viewMode}`}>
              {filteredDocuments.map(doc => (
                <div key={doc.id} className="document-item">
                  <div className="item-icon">{getFileIcon(doc.fileType)}</div>
                  <div className="item-info">
                    <h4>{doc.name}</h4>
                    <p>{formatFileSize(doc.size)} • {doc.fileType}</p>
                    <p>Modified: {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                    {doc.isArchived && <span className="archived-badge">ARCHIVED</span>}
                  </div>
                  <div className="item-actions">
                    <button onClick={() => setSelectedDoc(doc)}>View</button>
                    <button onClick={async () => {
                      const response = await documentAPI.downloadDocument(doc.id);
                      window.open(response.data, '_blank');
                    }}>Download</button>
                    {activeFilter !== 'trash' && (
                      <>
                        <button onClick={async () => {
                          await documentAPI.toggleArchive(doc.id);
                          loadUserData();
                        }}>
                          {doc.isArchived ? 'Unarchive' : 'Archive'}
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={async () => {
                            if (window.confirm('Move to trash?')) {
                              await documentAPI.deleteDocument(doc.id);
                              loadUserData();
                            }
                          }}
                        >
                          Delete
                        </button>
                      </>
                    )}
                    {activeFilter === 'trash' && (
                      <button 
                        className="restore-btn"
                        onClick={async () => {
                          // Add restore functionality if needed
                          alert('Restore functionality not implemented yet');
                        }}
                      >
                        Restore
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showUpload && (
        <DocumentUpload
          userId={user.id}
          onClose={() => setShowUpload(false)}
          onUpload={() => {
            loadUserData();
            setShowUpload(false);
          }}
        />
      )}

      {selectedDoc && (
        <DocumentDetails
          document={selectedDoc}
          onClose={() => setSelectedDoc(null)}
          onUpdate={loadUserData}
        />
      )}
    </div>
  );
};

export default UserDashboard;