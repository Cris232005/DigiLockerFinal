// DocumentList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/FileGrid.css';
import '../styles/globals.css';

export const DocumentList = ({ refresh, onUploadComplete }) => {
  const [documents, setDocuments] = useState([]);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [userId, setUserId] = useState(null);

  // ✅ Get userId from localStorage when component loads
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.id) {
      setUserId(storedUser.id);
    }
  }, []);

  // ✅ Fetch documents when userId changes
  useEffect(() => {
    if (!userId) return;

    axios.get(`http://localhost:8080/doc/get/${userId}`)
      .then(res => setDocuments(res.data || []))
      .catch(err => console.error("Fetch error:", err));
  }, [userId, refresh]);

  // ✅ Delete document
  const handleDelete = (docId) => {
    axios.delete(`http://localhost:8080/doc/del/${docId}`)
      .then(() => setDocuments(prev => prev.filter(doc => doc.id !== docId)))
      .catch(err => console.error("Delete error:", err));
  };

  // ✅ Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
  };

  // ✅ File icon helper
  const getFileIcon = (fileType) => {
    if (!fileType) return '📎';
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('video')) return '🎥';
    if (fileType.includes('audio')) return '🎵';
    if (fileType.includes('text')) return '📝';
    if (fileType.includes('zip') || fileType.includes('rar')) return '📦';
    return '📎';
  };

  // ✅ Handle file "upload" (metadata only)
  const handleFileUpload = async (event) => {
    if (!userId) {
      alert("User not logged in!");
      return;
    }

    const file = event.target.files[0];
    if (!file) return;

    setUploadedFileName(file.name);

    const documentData = {
      name: file.name,
      fileType: file.type,
      size: file.size,
      isArchived: 0
    };

    try {
      const res = await axios.post(
        `http://localhost:8080/doc/${userId}/add`,
        documentData,
        { headers: { "Content-Type": "application/json" } }
      );

      setDocuments(prev => [...prev, res.data]);

      if (onUploadComplete) onUploadComplete();
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  return (
    <div className="file-grid-wrapper">
      {/* Empty state */}
      {documents.length === 0 && !uploadedFileName && (
        <div className="empty-state">
          <div className="empty-icon">📁</div>
          <h3 className="empty-title">No documents yet</h3>
          <p className="empty-description">Click the + button below to upload your first file</p>
        </div>
      )}

      {/* Documents grid */}
      <div className="file-grid">
        {documents.map(doc => (
          <div key={doc.id} className="file-card">
            <div className="file-card-header">
              <div className="file-icon">{getFileIcon(doc.fileType)}</div>
              <button
                className="file-action-btn delete-btn"
                onClick={() => handleDelete(doc.id)}
              >
                🗑️
              </button>
            </div>
            <div className="file-card-body">
              <h4 className="file-name" title={doc.name}>
                {doc.name.length > 20 ? `${doc.name.substring(0, 20)}...` : doc.name}
              </h4>
              <div className="file-meta">
                <span className="file-type">{doc.fileType?.split('/')[1] || 'Unknown'}</span>
                <span className="file-size">{formatFileSize(doc.size)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Centered + Upload Button */}
      <div className="center-upload-wrapper">
        <input
          type="file"
          id="center-upload"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
        <label htmlFor="center-upload" className="center-plus-btn">+</label>
        {uploadedFileName && <p className="uploaded-filename">{uploadedFileName}</p>}
      </div>
    </div>
  );
};
