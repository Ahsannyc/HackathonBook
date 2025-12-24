import React from 'react';
import Layout from '@theme/Layout';
import { Signup } from '../components/auth';

function SignupPage() {
  return (
    <Layout title="Sign Up" description="Create your account">
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--6 col--offset-3">
            <Signup />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default SignupPage;