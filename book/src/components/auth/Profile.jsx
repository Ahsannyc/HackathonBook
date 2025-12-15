import React, { useState, useEffect } from 'react';
import { authApi } from './api';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    software_experience: '',
    hardware_experience: '',
  });

  // Check if user is authenticated and fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authApi.getProfile();
        setProfile(data);

        // Set form data for editing
        if (data.onboarding_profile) {
          setFormData({
            software_experience: data.onboarding_profile.software_experience || '',
            hardware_experience: data.onboarding_profile.hardware_experience || '',
          });
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const updatedProfile = await authApi.updateProfile(formData);

      // Update local state
      setProfile(prev => ({
        ...prev,
        onboarding_profile: {
          software_experience: formData.software_experience,
          hardware_experience: formData.hardware_experience,
          created_at: prev.onboarding_profile?.created_at || new Date().toISOString(),
        }
      }));
      setEditMode(false);
    } catch (err) {
      setError(err.message || 'An error occurred while updating profile');
    }
  };

  if (loading) {
    return <div className="profile-container">Loading...</div>;
  }

  if (error) {
    return <div className="profile-container">Error: {error}</div>;
  }

  if (!profile) {
    return <div className="profile-container">No profile found</div>;
  }

  return (
    <div className="profile-container">
      <h2>User Profile</h2>

      <div className="profile-info">
        <h3>Account Information</h3>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Member since:</strong> {new Date(profile.created_at).toLocaleDateString()}</p>
      </div>

      <div className="onboarding-info">
        <h3>Experience Profile</h3>
        {profile.onboarding_profile ? (
          editMode ? (
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label htmlFor="software_experience">Software Experience Level:</label>
                <select
                  id="software_experience"
                  name="software_experience"
                  value={formData.software_experience}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select your level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="hardware_experience">Hardware Experience Level:</label>
                <select
                  id="hardware_experience"
                  name="hardware_experience"
                  value={formData.hardware_experience}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select your level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <button type="submit">Save Changes</button>
              <button type="button" onClick={handleEditToggle} style={{ marginLeft: '10px' }}>
                Cancel
              </button>
            </form>
          ) : (
            <div>
              <p><strong>Software Experience:</strong> {profile.onboarding_profile.software_experience || 'Not specified'}</p>
              <p><strong>Hardware Experience:</strong> {profile.onboarding_profile.hardware_experience || 'Not specified'}</p>
              <button onClick={handleEditToggle}>Edit Profile</button>
            </div>
          )
        ) : (
          <div>
            <p>You haven't completed your experience profile yet.</p>
            <a href="/onboarding">Complete your profile</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;