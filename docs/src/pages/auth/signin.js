import React from 'react';
import Layout from '@theme/Layout';
import Signin from '../components/auth/Signin';

function SigninPage() {
  return (
    <Layout title="Sign In" description="Sign in to your account">
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--6 col--offset-3">
            <Signin />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default SigninPage;