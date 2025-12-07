import React from 'react';
import Layout from '@theme/Layout';

function SignUpForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
    console.log('Signup form submitted');
  };

  return (
    <Layout title="Sign Up" description="Sign up for Physical AI & Humanoid Robotics Textbook">
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div style={{ width: '400px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h1>Sign Up</h1>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="software_background" style={{ display: 'block', marginBottom: '5px' }}>
                Software Background:
              </label>
              <select
                id="software_background"
                name="software_background"
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="hardware_background" style={{ display: 'block', marginBottom: '5px' }}>
                Hardware Background:
              </label>
              <select
                id="hardware_background"
                name="hardware_background"
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              >
                <option value="None">None</option>
                <option value="Basic">Basic</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default SignUpForm;
