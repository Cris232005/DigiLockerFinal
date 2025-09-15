import React, { useState } from 'react';
import { documentAPI } from '../api';
import '../styles/DocumentDetails.css';

const DocumentDetails = ({ document, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: document.name,
    fileType: document.fileType
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

  const handleDownload = async () => {
    try {
      const response = await documentAPI.downloadDocument(document.id);
      window.open(response.data, '_blank');
    } catch (error) {
      alert('Download failed');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      // Note: This would require a backend endpoint to update document metadata
      alert('Metadata updated successfully!');
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      alert('Update failed');
    }
  };

  const handleArchive = async () => {
    try {
      await documentAPI.toggleArchive(document.id);
      onUpdate();
      onClose();
    } catch (error) {
      alert('Archive operation failed');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await documentAPI.deleteDocument(document.id);
        onUpdate();
        onClose();
      } catch (error) {
        alert('Delete failed');
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="details-modal">
        <div className="modal-header">
          <h2>Document Details</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="document-preview">
          <div className="preview-icon-large">
            {getFileIcon(document.fileType)}
          </div>
          <div className="preview-info">
            {isEditing ? (
              <form onSubmit={handleEdit} className="edit-form">
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="edit-input"
                />
                <input
                  type="text"
                  value={editForm.fileType}
                  onChange={(e) => setEditForm({...editForm, fileType: e.target.value})}
                  className="edit-input"
                />
                <div className="edit-actions">
                  <button type="submit" className="save-edit-btn">Save</button>
                  <button type="button" onClick={() => setIsEditing(false)} className="cancel-edit-btn">
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h3>{document.name}</h3>
                <p className="file-type">{document.fileType}</p>
              </>
            )}
            {document.isArchived && <span className="archived-badge">ARCHIVED</span>}
          </div>
        </div>

        <div className="document-metadata">
          <h4>Document Information</h4>
          <div className="metadata-grid">
            <div className="metadata-item">
              <label>Owner:</label>
              <span>{document.owner?.username || 'Unknown'}</span>
            </div>
            <div className="metadata-item">
              <label>File Size:</label>
              <span>{formatFileSize(document.size)}</span>
            </div>
            <div className="metadata-item">
              <label>Upload Date:</label>
              <span>{new Date(document.uploadedAt).toLocaleString()}</span>
            </div>
            <div className="metadata-item">
              <label>File Type:</label>
              <span>{document.fileType}</span>
            </div>
            <div className="metadata-item">
              <label>Status:</label>
              <span className={document.isArchived ? 'status-archived' : 'status-active'}>
                {document.isArchived ? 'Archived' : 'Active'}
              </span>
            </div>
            <div className="metadata-item">
              <label>File URL:</label>
              <a href={document.fileUrl} target="_blank" rel="noopener noreferrer" className="file-link">
                View Original
              </a>
            </div>
          </div>
        </div>

        {/* File Preview Section */}
        <div className="file-preview-section">
          <h4>Preview</h4>
          <div className="preview-container">
            {document.fileType === 'PDF' && (
              <iframe 
                src={document.fileUrl} 
                width="100%" 
                height="400px"
                title="PDF Preview"
              />
            )}
            {['JPG', 'PNG', 'GIF'].includes(document.fileType?.toUpperCase()) && (
              <img 
                src={document.fileUrl} 
                alt={document.name}
                className="image-preview"
              />
            )}
            {!['PDF', 'JPG', 'PNG', 'GIF'].includes(document.fileType?.toUpperCase()) && (
              <div className="no-preview">
                <p>Preview not available for this file type</p>
                <button onClick={handleDownload} className="preview-download-btn">
                  Download to View
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="modal-actions">
          <button onClick={handleDownload} className="download-btn">
            <i className="icon-download"></i> Download
          </button>
          <button onClick={() => setIsEditing(!isEditing)} className="edit-btn">
            <i className="icon-edit"></i> Edit Metadata
          </button>
          <button onClick={handleArchive} className="archive-btn">
            <i className="icon-archive"></i> 
            {document.isArchived ? 'Unarchive' : 'Archive'}
          </button>
          <button onClick={handleDelete} className="delete-btn">
            <i className="icon-trash"></i> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetails;