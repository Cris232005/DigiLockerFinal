import React,{useState,useEffect}from "react";
import axios from 'axios';
import '../styles/FileGrid.css'
import '../styles/globals.css'
import { useNavigate } from "react-router-dom";

export const Folder=({id,onMove,refresh})=>{
    const [folders,setFolders] = useState([]);
    const navigate = useNavigate();
    
    useEffect(()=>{
        if(id){
            axios.get(`https://8080-ffbaeebdacbaeabecfcdcbcbcbccaa.premiumproject.examly.io/folder/get/${encodeURIComponent(id)}`)
            .then((response)=>{
                setFolders(response.data||[]);
                console.log("The folder information has been successfully got");
            })
            .catch((error)=>{
                console.log("Error fetching folders",error)
            });
        }
    },[id,refresh]);
    
    const handleDrop=(e,folderId)=>{
        e.preventDefault();
        const docId = e.dataTransfer.getData("docId");
        if(!docId) return;
        
        axios.put(`https://8080-ffbaeebdacbaeabecfcdcbcbcbccaa.premiumproject.examly.io/folder/movedoc/${encodeURIComponent(folderId)}/${encodeURIComponent(docId)}`)
        .then((res)=>{
            console.log("Moved folder");
            if(onMove) onMove();
        })
        .catch((error)=>{
            console.log("Error",error);
        })
    }
    
    const handleDelete=(foldId)=>{
        axios.delete(`https://8080-ffbaeebdacbaeabecfcdcbcbcbccaa.premiumproject.examly.io/folder/del/${encodeURIComponent(foldId)}`)
        .then((res)=>{
            console.log(res.data);
            setFolders((p)=>{
             const u = p.filter((fold)=> fold.id!== foldId);
             console.log('Updated',u);
             return u;
            });
        })
        .catch((error)=>{
            console.log(error);
        })
    }
       
    return(
        <div className="file-section">
            {folders.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📂</div>
                    <h3 className="empty-title">No folders yet</h3>
                    <p className="empty-description">Create your first folder to organize documents</p>
                </div>
            ) : (
                <div className='file-grid'>
                    {folders.map((fold)=> (
                        <div 
                            key={fold.id} 
                            className='file-card folder-card'
                            onClick={()=> navigate(`/folderDocs/${fold.id}`,{state : {userId : id}})}
                            onDragOver={(e)=> e.preventDefault()}
                            onDrop={(e)=> handleDrop(e,fold.id)}
                        >
                            <div className="file-card-header">
                                <div className="file-icon folder-icon">
                                    📁
                                </div>
                                <button 
                                    className="file-action-btn delete-btn"
                                    onClick={(e)=>{
                                        e.stopPropagation();
                                        handleDelete(fold.id);
                                    }}
                                    aria-label="Delete folder"
                                >
                                    🗑️
                                </button>
                            </div>
                                              
                            <div className="file-card-body">
                                <h4 className="file-name" title={fold.name}>
                                    {fold.name.length > 20 ? `${fold.name.substring(0, 20)}...` : fold.name}
                                </h4>
                                <div className="file-meta">
                                    <span className="folder-type">Folder</span>
                                </div>
                            </div>
                            
                            <div className="file-card-footer">
                                <div className="folder-drop-zone">
                                    <span>Drop files here</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}