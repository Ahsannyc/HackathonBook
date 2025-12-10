import React from 'react';
import Layout from '@theme/Layout';
import Onboarding from '../components/auth/Onboarding';

function OnboardingPage() {
  return (
    <Layout title="Onboarding" description="Complete your profile">
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--6 col--offset-3">
            <Onboarding />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default OnboardingPage;