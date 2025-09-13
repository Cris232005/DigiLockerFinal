import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Modal.css';
import '../styles/globals.css';

export const CreateFolder = ({ onclose, id , onCreate}) => {
    const [folderName, setFolderName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCreate = () => {
        if (!folderName.trim()) return;
        
        setLoading(true);
        
        const folder = {
            name: folderName,
            ownerId: id,
            parentFolderId: null
        };

        axios.post(`https://8080-ffbaeebdacbaeabecfcdcbcbcbccaa.premiumproject.examly.io/folder/add/${encodeURIComponent(id)}`, folder, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then((response) => {
            console.log("Folder created successfully");
            console.log("Trigger the parent folder");
            if(onCreate) onCreate();
            onclose();
        })
        .catch((error) => {
            console.log("Error creating folder", error);
        })
        .finally(() => {
            setLoading(false);
        });
    };

    return (
        <div className="modal-overlay" onClick={onclose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">Create New Folder</h3>
                    <button className="modal-close" onClick={onclose}>
                        ✕
                    </button>
                </div>
                
                <div className="modal-body">
                    <div className="form-group">
                        <label className="form-label" htmlFor="folder-name">
                            Folder Name
                        </label>
                        <input
                            id="folder-name"
                            className="form-input"
                            type="text"
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            placeholder="Enter folder name"
                            autoFocus
                        />
                    </div>
                </div>
                
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onclose}>
                        Cancel
                    </button>
                    <button 
                        className="btn btn-primary" 
                        onClick={handleCreate}
                        disabled={!folderName.trim() || loading}
                    >
                        {loading ? 'Creating...' : 'Create Folder'}
                    </button>
                </div>
            </div>
        </div>
    );
};