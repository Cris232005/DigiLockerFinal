import React, { useState } from 'react';
import { documentAPI } from '../api';
import '../styles/DocumentUpload.css';

const DocumentUpload = ({ userId, onClose, onUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    fileType: '',
    fileUrl: '',
    size: 0,
    description: '',
    tags: ''
  });

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFormData({
        ...formData,
        name: file.name,
        fileType: file.name.split('.').pop().toUpperCase(),
        size: file.size,
        fileUrl: URL.createObjectURL(file)
      });
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        name: file.name,
        fileType: file.name.split('.').pop().toUpperCase(),
        size: file.size,
        fileUrl: URL.createObjectURL(file)
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await documentAPI.uploadDocument(userId, {
        name: formData.name,
        fileType: formData.fileType,
        fileUrl: formData.fileUrl,
        size: formData.size
      });
      onUpload();
    } catch (error) {
      alert(error.response?.data || 'Upload failed');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="modal-overlay">
      <div className="upload-modal">
        <div className="modal-header">
          <h2>Upload Document</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="upload-form">
          {/* Drag & Drop Area */}
          <div 
            className={`drop-zone ${dragActive ? 'active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="drop-content">
              <div className="upload-icon">📁</div>
              <p>Drag and drop your file here</p>
              <p className="or-text">or</p>
              <label className="file-select-btn">
                Choose File
                <input
                  type="file"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>

          {/* File Preview */}
          {formData.name && (
            <div className="file-preview">
              <div className="preview-icon">📄</div>
              <div className="preview-info">
                <h4>{formData.name}</h4>
                <p>{formData.fileType} • {formatFileSize(formData.size)}</p>
              </div>
              <button 
                type="button" 
                className="remove-file"
                onClick={() => setFormData({...formData, name: '', fileUrl: '', size: 0})}
              >
                ×
              </button>
            </div>
          )}

          {/* Form Fields */}
          <div className="form-fields">
            <div className="field-group">
              <label>Document Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>

            <div className="field-group">
              <label>File Type</label>
              <input
                type="text"
                value={formData.fileType}
                onChange={(e) => setFormData({...formData, fileType: e.target.value})}
                placeholder="e.g., PDF, DOC, JPG"
              />
            </div>

            <div className="field-group">
              <label>File URL</label>
              <input
                type="url"
                value={formData.fileUrl}
                onChange={(e) => setFormData({...formData, fileUrl: e.target.value})}
                placeholder="https://example.com/file.pdf"
              />
            </div>

            <div className="field-group">
              <label>File Size (bytes)</label>
              <input
                type="number"
                value={formData.size}
                onChange={(e) => setFormData({...formData, size: parseInt(e.target.value)})}
              />
            </div>

            <div className="field-group">
              <label>Description (Optional)</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Brief description of the document..."
                rows="3"
              />
            </div>

            <div className="field-group">
              <label>Tags (Optional)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                placeholder="work, important, project (comma separated)"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn" disabled={!formData.name}>
              Save Document
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentUpload;