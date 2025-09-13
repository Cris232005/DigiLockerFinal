import React ,{useEffect,useState} from 'react';
import axios from 'axios';
import '../styles/FileGrid.css'
import '../styles/globals.css'
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export const FolderDocs=()=>{
    const {id} = useParams();
    const [documents,setDocument] = useState([]);
    const location = useLocation();
    const userId = location.state?.userId;
    const navigate = useNavigate();
    
    useEffect(()=>{
        if(id){
            axios.get(`https://8080-ffbaeebdacbaeabecfcdcbcbcbccaa.premiumproject.examly.io/folder/get/doc/${encodeURIComponent(id)}`)
            .then((response)=>{
                setDocument(response.data||[]);
                console.log("The document information has been successfully got");
            })
            .catch((error)=>{
                console.log("Error fetching documents",error)
            });
        }
    },[id]);

    const handleRemoveFolder=(docId)=>{
        axios.put(`https://8080-ffbaeebdacbaeabecfcdcbcbcbccaa.premiumproject.examly.io/folder/removedoc/${encodeURIComponent(userId)}/${encodeURIComponent(docId)}`)
        .then((res)=>{
            console.log("Removed folder");
            setDocument((p)=>{
                const u = p.filter((doc)=> doc.id!== docId);
                console.log('Updated',u);
                return u;
               });
        })
        .catch((error)=>{
            console.log("Error",error);
        })
    }

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
   const getFileIcon = (fileType) => {
        if (fileType.includes('pdf')) return '📄';
        if (fileType.includes('image')) return '🖼️';
        if (fileType.includes('video')) return '🎥';
        if (fileType.includes('audio')) return '🎵';
        if (fileType.includes('text')) return '📝';
        if (fileType.includes('zip') || fileType.includes('rar')) return '📦';
        return '📎';
    };

    return(
        <div className="folder-docs-container">
            <header className="folder-docs-header">
                <div className="container">
                    <div className="header-content">
                        <div className="folder-info">
                            <h1 className="folder-title">Folder Documents</h1>
                            <p className="folder-subtitle">
                                {documents.length} {documents.length === 1 ? 'document' : 'documents'}
                            </p>
                        </div>
                        
                        <button 
                            className="btn btn-secondary"
                            onClick={() => navigate(-1)}
                        >
                            ← Back to Dashboard
                        </button>
                    </div>
                </div>
            </header>

            <main className="folder-docs-main">
                <div className="container">
                    <div className="file-section">
                        {documents.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">📂</div>
                                <h3 className="empty-title">No documents in this folder</h3>
                                <p className="empty-description">
                                    Drag and drop documents from the main dashboard to organize them here
                                </p>
                            </div>
                        ) : (
                                            <div className='file-grid'>
                                {documents.map((doc)=> (
                                    <div
                                        key={doc.id}
                                        className='file-card'
                                        draggable
                                        onDragStart={(e) => e.dataTransfer.setData("docId",doc.id)} 
                                        onClick={()=> window.open(doc.path,"_blank")}
                                    >
                                        <div className="file-card-header">
                                            <div className="file-icon">
                                                {getFileIcon(doc.fileType)}
                                            </div>
                                            <button 
                                                className="file-action-btn remove-btn"
                                                onClick={(e)=>{
                                                    e.stopPropagation();
                                                    handleRemoveFolder(doc.id);
                                                }}
                                                aria-label="Remove from folder"
                                                title="Remove from folder"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                        
                                                                      
                                        <div className="file-card-body">
                                            <h4 className="file-name" title={doc.name}>
                                                {doc.name.length > 20 ? `${doc.name.substring(0, 20)}...` : doc.name}
                                            </h4>
                                            <div className="file-meta">
                                                <span className="file-type">{doc.fileType.split('/')[1] || 'Unknown'}</span>
                                                <span className="file-size">{formatFileSize(doc.size)}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="file-card-footer">
                                            <div className="file-actions">
                                                <span className="action-hint">Click to view</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}