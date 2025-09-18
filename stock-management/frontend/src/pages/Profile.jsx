import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../assets/profile.css';

function Profile() {
   const apiUrl = import.meta.env.VITE_API_URL;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${apiUrl}/me`, {
          withCredentials: true, // include session cookie
        });

        if (res.data?.success && res.data?.data) {
          setUser(res.data.data);
        } else {
          setError("No user data found");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`${apiUrl}/logout`, {}, {
        withCredentials: true,
      });
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  if (loading) return (
    <div className="profile-container">
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="profile-container">
      <div className="error-state">
        <div className="error-icon">⚠️</div>
        <p>{error}</p>
      </div>
    </div>
  );

  if (!user) return (
    <div className="profile-container">
      <div className="no-data-state">
        <p>No profile data available</p>
      </div>
    </div>
  );

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {getInitials(user.name)}
          </div>
          <h1 className="profile-title">Profile</h1>
          <p className="profile-subtitle">Your account information</p>
        </div>
        
        <div className="profile-content">
          <div className="profile-info">
            <div className="info-group">
              <span className="info-label">Name:</span>
              <span className="info-value">{user.name || "N/A"}</span>
            </div>
            
            <div className="info-group">
              <span className="info-label">Email:</span>
              <span className="info-value">{user.email || "N/A"}</span>
            </div>
            
            <div className="info-group">
              <span className="info-label">Role:</span>
              <span className="info-value">
                <span className="role-badge">{user.role || "N/A"}</span>
              </span>
            </div>
          </div>
          
          <div className="profile-actions">
            <button 
              className="action-button logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;