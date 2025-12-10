import React from 'react';
import Layout from '@theme/Layout';
import Profile from '../components/auth/Profile';

function ProfilePage() {
  return (
    <Layout title="Profile" description="Manage your profile">
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <Profile />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ProfilePage;