import React, { useEffect, useState } from 'react';
import GitHubAPI from '../utils/github-api';

interface GitHubRepoData {
  name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  updated_at: string;
}

interface GitHubContributor {
  login: string;
  avatar_url: string;
  contributions: number;
}

const GitHubStatus: React.FC = () => {
  const [repoData, setRepoData] = useState<GitHubRepoData | null>(null);
  const [contributors, setContributors] = useState<GitHubContributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        setLoading(true);
        setError(null);

        const githubAPI = new GitHubAPI();

        // Fetch repository information
        const repoInfo = await githubAPI.getRepoInfo('HackathonBookUser', 'HackathonBook');
        if (repoInfo) {
          setRepoData({
            name: repoInfo.name,
            description: repoInfo.description || '',
            stargazers_count: repoInfo.stargazers_count,
            forks_count: repoInfo.forks_count,
            open_issues_count: repoInfo.open_issues_count,
            updated_at: repoInfo.updated_at,
          });
        }

        // Fetch contributors
        const contributorsList = await githubAPI.getContributors('HackathonBookUser', 'HackathonBook');
        setContributors(contributorsList.slice(0, 5)); // Top 5 contributors
      } catch (err) {
        console.error('Error fetching GitHub data:', err);
        setError('Failed to load GitHub repository information');
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '20px 0' }}>
        <h3>GitHub Repository Status</h3>
        <p>Loading repository information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '20px 0' }}>
        <h3>GitHub Repository Status</h3>
        <p style={{ color: 'red' }}>{error}</p>
        <p>Make sure the GitHub token is properly configured.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '20px 0' }}>
      <h3>GitHub Repository Status</h3>
      {repoData && (
        <div>
          <h4>{repoData.name}</h4>
          <p>{repoData.description}</p>
          <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
            <div>
              <strong>Stars:</strong> {repoData.stargazers_count}
            </div>
            <div>
              <strong>Forks:</strong> {repoData.forks_count}
            </div>
            <div>
              <strong>Open Issues:</strong> {repoData.open_issues_count}
            </div>
            <div>
              <strong>Last Updated:</strong> {new Date(repoData.updated_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <h4>Top Contributors</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {contributors.map((contributor, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <img
                src={contributor.avatar_url}
                alt={contributor.login}
                style={{ width: '30px', height: '30px', borderRadius: '50%' }}
              />
              <span>{contributor.login}</span>
              <small>({contributor.contributions})</small>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <a
          href="https://github.com/HackathonBookUser/HackathonBook"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '10px 15px',
            backgroundColor: '#1a1a1a',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px'
          }}
        >
          View on GitHub
        </a>
      </div>
    </div>
  );
};

export default GitHubStatus;