import axios from "axios";

const API = axios.create({
  baseURL: "http://10.201.132.2:8080",
  headers: {
    'Content-Type': 'application/json',
  },
});

// User API calls
export const userAPI = {
  // Register user
  register: (userData) => API.post('/user/add', userData),
  
  // Login user (username/email + password)
  login: (credentials) => API.post('/user/login', credentials),
  
  // Get all users with pagination
  getUsers: (page = 0, size = 10, sortBy = 'id', sortDir = 'asc') => 
    API.get(`/user/get?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`),
  
  // Update user
  updateUser: (id, userData) => API.put(`/user/update/${id}`, userData),
  
  // Delete user
  deleteUser: (id) => API.delete(`/user/del/${id}`),
  
  // Get user by email
  getUserByEmail: (email) => API.get(`/user/get/id/${email}`),
  
  // Search users
  searchUsers: (query) => API.get(`/user/search?query=${encodeURIComponent(query)}`),
};

// Document API calls
export const documentAPI = {
  // Upload document
  uploadDocument: (userId, documentData) => API.post(`/doc/${userId}/upload`, documentData),
  
  // Get user documents
  getUserDocuments: (userId) => API.get(`/doc/get/${userId}`),
  
  // Delete document
  deleteDocument: (docId) => API.delete(`/doc/del/${docId}`),
  
  // Archive/Unarchive document
  toggleArchive: (docId) => API.put(`/doc/archive/${docId}`),
  
  // Download document
  downloadDocument: (docId) => API.get(`/doc/download/${docId}`),
  
  // Get document by ID
  getDocument: (docId) => API.get(`/doc/document/${docId}`),
};

// Folder API calls
export const folderAPI = {
  // Create folder
  createFolder: (userId, folderData) => API.post(`/folder/add/${userId}`, folderData),
  
  // Get user folders
  getUserFolders: (userId) => API.get(`/folder/get/${userId}`),
  
  // Get folder documents
  getFolderDocuments: (folderId) => API.get(`/folder/get/doc/${folderId}`),
  
  // Delete folder
  deleteFolder: (folderId) => API.delete(`/folder/del/${folderId}`),
  
  // Get all folders
  getAllFolders: () => API.get('/folder/get'),
  
  // Move document to folder
  moveDocumentToFolder: (folderId, docId) => API.put(`/folder/movedoc/${folderId}/${docId}`),
  
  // Remove document from folder
  removeDocumentFromFolder: (userId, docId) => API.put(`/folder/removedoc/${userId}/${docId}`),
  
  // Create subfolder
  createSubfolder: (parentId, folderData) => API.post(`/folder/subfolder/${parentId}`, folderData),
};

// Activity Log API calls
export const activityAPI = {
  // Get user activity
  getUserActivity: (userId) => API.get(`/activity/user/${userId}`),
  
  // Get document activity
  getDocumentActivity: (docId) => API.get(`/activity/document/${docId}`),
  
  // Get all activities
  getAllActivities: () => API.get('/activity/all'),
};

export default API;