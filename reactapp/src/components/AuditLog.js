import React, { useState, useEffect, useCallback } from 'react';
import { activityAPI } from '../api';
import '../styles/AuditLog.css';

const AuditLog = ({ user, onBack }) => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(20);
  const [filters, setFilters] = useState({
    action: '',
    dateFrom: '',
    dateTo: '',
    search: ''
  });

  const loadActivities = useCallback(async () => {
    try {
      let response;
      if (user.role === 'ADMIN') {
        response = await activityAPI.getAllActivities();
      } else {
        response = await activityAPI.getUserActivity(user.id);
      }
      setActivities(response.data);
    } catch (error) {
      console.error('Failed to load activities:', error);
    }
  }, [user.role, user.id]);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  const applyFilters = useCallback(() => {
    let filtered = [...activities];

    // Filter by action
    if (filters.action) {
      filtered = filtered.filter(activity => activity.action === filters.action);
    }

    // Filter by date range
    if (filters.dateFrom) {
      filtered = filtered.filter(activity => 
        new Date(activity.timestamp) >= new Date(filters.dateFrom)
      );
    }
    if (filters.dateTo) {
      filtered = filtered.filter(activity => 
        new Date(activity.timestamp) <= new Date(filters.dateTo)
      );
    }

    // Filter by search term
    if (filters.search) {
      filtered = filtered.filter(activity =>
        activity.document?.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        activity.user?.username?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredActivities(filtered);
    setCurrentPage(0);
  }, [activities, filters]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);





  const getActionIcon = (action) => {
    const icons = {
      'UPLOAD': '⬆️',
      'DOWNLOAD': '⬇️',
      'DELETE': '🗑️',
      'ARCHIVE': '📦',
      'UNARCHIVE': '📤',
      'VIEW': '👁️'
    };
    return icons[action] || '📄';
  };

  const getActionColor = (action) => {
    const colors = {
      'UPLOAD': 'success',
      'DOWNLOAD': 'info',
      'DELETE': 'danger',
      'ARCHIVE': 'warning',
      'UNARCHIVE': 'warning',
      'VIEW': 'secondary'
    };
    return colors[action] || 'primary';
  };

  const exportToCSV = () => {
    const headers = ['Timestamp', 'User', 'Action', 'Document', 'Document ID'];
    const csvContent = [
      headers.join(','),
      ...filteredActivities.map(activity => [
        new Date(activity.timestamp).toLocaleString(),
        activity.user?.username || 'Unknown',
        activity.action,
        activity.document?.name || 'N/A',
        activity.document?.id || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_log_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const paginatedActivities = filteredActivities.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  const totalPages = Math.ceil(filteredActivities.length / pageSize);

  return (
    <div className="audit-log-container">
      {/* Header */}
      <div className="audit-header">
        <div className="header-left">
          <button className="back-btn" onClick={onBack}>
            ← Back
          </button>
          <div>
            <h1>File History & Audit Log</h1>
            <p>Track all system activities and document operations</p>
          </div>
        </div>
        <div className="header-right">
          <button className="export-btn" onClick={exportToCSV}>
            📊 Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-grid">
          <div className="filter-group">
            <label>Action:</label>
            <select
              value={filters.action}
              onChange={(e) => setFilters({...filters, action: e.target.value})}
            >
              <option value="">All Actions</option>
              <option value="UPLOAD">Upload</option>
              <option value="DOWNLOAD">Download</option>
              <option value="DELETE">Delete</option>
              <option value="ARCHIVE">Archive</option>
              <option value="UNARCHIVE">Unarchive</option>
            </select>
          </div>

          <div className="filter-group">
            <label>From Date:</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
            />
          </div>

          <div className="filter-group">
            <label>To Date:</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
            />
          </div>

          <div className="filter-group">
            <label>Search:</label>
            <input
              type="text"
              placeholder="Search user or document..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
            />
          </div>
        </div>

        <div className="filter-actions">
          <button 
            className="clear-filters-btn"
            onClick={() => setFilters({ action: '', dateFrom: '', dateTo: '', search: '' })}
          >
            Clear Filters
          </button>
          <span className="results-count">
            {filteredActivities.length} activities found
          </span>
        </div>
      </div>

      {/* Activity Table */}
      <div className="activities-table-container">
        <table className="activities-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Action</th>
              <th>Document Name</th>
              <th>Document ID</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {paginatedActivities.map(activity => (
              <tr key={activity.id}>
                <td className="timestamp-cell">
                  <div className="timestamp">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </div>
                  <div className="time">
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </div>
                </td>
                <td className="user-cell">
                  <div className="user-info">
                    <div className="user-avatar">
                      {activity.user?.username?.[0]?.toUpperCase() || '?'}
                    </div>
                    <span>{activity.user?.username || 'Unknown'}</span>
                  </div>
                </td>
                <td className="action-cell">
                  <span className={`action-badge ${getActionColor(activity.action)}`}>
                    {getActionIcon(activity.action)} {activity.action}
                  </span>
                </td>
                <td className="document-cell">
                  <div className="document-info">
                    <span className="document-name">
                      {activity.document?.name || 'N/A'}
                    </span>
                    {activity.document?.fileType && (
                      <span className="file-type">
                        {activity.document.fileType}
                      </span>
                    )}
                  </div>
                </td>
                <td className="id-cell">
                  {activity.document?.id || 'N/A'}
                </td>
                <td className="details-cell">
                  <button 
                    className="details-btn"
                    onClick={() => alert(`Activity ID: ${activity.id}\nTimestamp: ${activity.timestamp}`)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {paginatedActivities.length === 0 && (
          <div className="no-activities">
            <div className="no-activities-icon">📋</div>
            <h3>No activities found</h3>
            <p>Try adjusting your filters or check back later.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="page-btn"
            onClick={() => setCurrentPage(0)}
            disabled={currentPage === 0}
          >
            First
          </button>
          <button 
            className="page-btn"
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
          >
            Previous
          </button>
          
          <div className="page-info">
            <span>Page {currentPage + 1} of {totalPages}</span>
            <span>({filteredActivities.length} total activities)</span>
          </div>
          
          <button 
            className="page-btn"
            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage === totalPages - 1}
          >
            Next
          </button>
          <button 
            className="page-btn"
            onClick={() => setCurrentPage(totalPages - 1)}
            disabled={currentPage === totalPages - 1}
          >
            Last
          </button>
        </div>
      )}
    </div>
  );
};

export default AuditLog;