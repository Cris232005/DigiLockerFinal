import React, { useState, useEffect, useCallback } from 'react';
import { userAPI, activityAPI } from '../api';
import '../styles/AdminDashboard.css';

const AdminDashboard = ({ user, onLogout }) => {
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    totalDocuments: 0,
    totalStorage: 0
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [editingUser, setEditingUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '', username: '', email: '', passwordHash: '', role: 'USER'
  });

  const loadAdminData = useCallback(async () => {
    try {
      console.log('Loading admin data...');
      const [usersRes, activitiesRes] = await Promise.all([
        userAPI.getUsers(currentPage, 10),
        activityAPI.getAllActivities()
      ]);
      
      console.log('Users response:', usersRes.data);
      console.log('Activities response:', activitiesRes.data);
      
      // Handle different response formats
      const usersData = usersRes.data.content || usersRes.data || [];
      const activitiesData = activitiesRes.data || [];
      
      setUsers(usersData);
      setActivities(activitiesData);
      
      // Calculate system stats
      const totalStorage = usersData.reduce((sum, user) => sum + (user.storageUsed || 0), 0) || 0;
      setSystemStats({
        totalUsers: usersRes.data.totalElements || usersData.length,
        totalDocuments: activitiesData.filter(a => a.action === 'UPLOAD').length,
        totalStorage
      });
    } catch (error) {
      console.error('Failed to load admin data:', error);
      alert('Failed to load admin data: ' + error.message);
    }
  }, [currentPage]);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);



  const handleEditUser = (user) => {
    setEditingUser({...user});
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await userAPI.updateUser(editingUser.id, editingUser);
      setEditingUser(null);
      loadAdminData();
      alert('User updated successfully!');
    } catch (error) {
      alert('Update failed');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userAPI.deleteUser(userId);
        loadAdminData();
        alert('User deleted successfully!');
      } catch (error) {
        alert('Delete failed');
      }
    }
  };
  
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        const response = await userAPI.searchUsers(query);
        const searchResults = response.data || [];
        setUsers(searchResults);
      } catch (error) {
        console.error('Search failed:', error);
        // If search fails, filter locally
        const allUsersRes = await userAPI.getUsers(0, 100);
        const allUsers = allUsersRes.data.content || allUsersRes.data || [];
        const filtered = allUsers.filter(user => 
          user.name?.toLowerCase().includes(query.toLowerCase()) ||
          user.username?.toLowerCase().includes(query.toLowerCase()) ||
          user.email?.toLowerCase().includes(query.toLowerCase())
        );
        setUsers(filtered);
      }
    } else {
      loadAdminData();
    }
  };
  
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await userAPI.register(newUser);
      setShowAddUser(false);
      setNewUser({ name: '', username: '', email: '', passwordHash: '', role: 'USER' });
      loadAdminData();
      alert('User added successfully!');
    } catch (error) {
      alert('Failed to add user');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <div className="header-left">
          <h1>Admin Dashboard</h1>
          <p>Digital Locker System Management</p>
        </div>
        <div className="header-right">
          <div className="admin-info">
            <span>Welcome, {user.username}</span>
            <span className="admin-badge">ADMIN</span>
          </div>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </div>

      {/* System Health Widget */}
      <div className="system-health">
        <h2>System Overview</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>{systemStats.totalUsers}</h3>
              <p>Total Users</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📄</div>
            <div className="stat-info">
              <h3>{systemStats.totalDocuments}</h3>
              <p>Total Documents</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💾</div>
            <div className="stat-info">
              <h3>{formatFileSize(systemStats.totalStorage)}</h3>
              <p>Storage Used</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>{activities.length}</h3>
              <p>Total Activities</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Management */}
      <div className="users-section">
        <div className="section-header">
          <h2>User Management</h2>
          <div className="section-actions">
            <input 
              type="text" 
              placeholder="Search users..." 
              className="search-input"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <button className="add-user-btn" onClick={() => setShowAddUser(true)}>Add New User</button>
          </div>
        </div>

        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Storage Used</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role.toLowerCase()}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{formatFileSize(user.storageUsed || 0)}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="edit-btn"
                        onClick={() => handleEditUser(user)}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
          >
            Previous
          </button>
          <span>Page {currentPage + 1}</span>
          <button 
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="modal-overlay">
          <div className="edit-user-modal">
            <div className="modal-header">
              <h3>Edit User</h3>
              <button onClick={() => setEditingUser(null)}>×</button>
            </div>
            <form onSubmit={handleUpdateUser}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Username:</label>
                <input
                  type="text"
                  value={editingUser.username}
                  onChange={(e) => setEditingUser({...editingUser, username: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Role:</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setEditingUser(null)}>Cancel</button>
                <button type="submit">Update User</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Add User Modal */}
      {showAddUser && (
        <div className="modal-overlay">
          <div className="edit-user-modal">
            <div className="modal-header">
              <h3>Add New User</h3>
              <button onClick={() => setShowAddUser(false)}>×</button>
            </div>
            <form onSubmit={handleAddUser}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Username:</label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  value={newUser.passwordHash}
                  onChange={(e) => setNewUser({...newUser, passwordHash: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Role:</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddUser(false)}>Cancel</button>
                <button type="submit">Add User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;