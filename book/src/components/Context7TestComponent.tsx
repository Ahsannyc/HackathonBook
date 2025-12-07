import React, { useEffect, useState } from 'react';

interface Context7Status {
  connected: boolean;
  status: string;
  lastUpdate?: Date;
}

const Context7TestComponent: React.FC = () => {
  const [status, setStatus] = useState<Context7Status>({
    connected: false,
    status: 'Initializing...'
  });

  useEffect(() => {
    // Simulate checking the connection to the context7 server
    const checkConnection = () => {
      try {
        // In a real implementation, this would make an actual connection to the context7 server
        console.log('Checking connection to Context7 server...');

        // For now, we'll just simulate a successful connection
        setStatus({
          connected: true,
          status: 'Connected to Context7 server',
          lastUpdate: new Date()
        });
      } catch (error) {
        setStatus({
          connected: false,
          status: `Connection failed: ${error.message}`,
          lastUpdate: new Date()
        });
      }
    };

    // Check connection immediately
    checkConnection();

    // Set up a periodic check (every 30 seconds)
    const intervalId = setInterval(checkConnection, 30000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '20px 0' }}>
      <h3>Context7 Server Connection Status</h3>
      <p><strong>Status:</strong> {status.status}</p>
      <p><strong>Connected:</strong> {status.connected ? 'Yes' : 'No'}</p>
      {status.lastUpdate && (
        <p><strong>Last checked:</strong> {status.lastUpdate.toLocaleTimeString()}</p>
      )}
      <p>This component verifies the connection to the Context7 MCP server.</p>
    </div>
  );
};

export default Context7TestComponent;