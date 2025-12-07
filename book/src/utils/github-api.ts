// GitHub API utility for the textbook project
import { Octokit } from "@octokit/rest";

// Initialize Octokit with personal access token
const GITHUB_TOKEN = process.env.GITHUB_PERSONAL_ACCESS_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN;

class GitHubAPI {
  private octokit: Octokit;

  constructor() {
    if (!GITHUB_TOKEN) {
      console.warn("GitHub token not found. Some GitHub features may not work.");
    }

    this.octokit = new Octokit({
      auth: GITHUB_TOKEN,
    });
  }

  async getRepoInfo(owner: string, repo: string) {
    try {
      const response = await this.octokit.repos.get({
        owner,
        repo,
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching repo info for ${owner}/${repo}:`, error);
      return null;
    }
  }

  async getIssues(owner: string, repo: string) {
    try {
      const response = await this.octokit.issues.listForRepo({
        owner,
        repo,
        state: 'open',
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching issues for ${owner}/${repo}:`, error);
      return [];
    }
  }

  async getContributors(owner: string, repo: string) {
    try {
      const response = await this.octokit.repos.listContributors({
        owner,
        repo,
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching contributors for ${owner}/${repo}:`, error);
      return [];
    }
  }

  async getRecentCommits(owner: string, repo: string, limit: number = 10) {
    try {
      const response = await this.octokit.repos.listCommits({
        owner,
        repo,
        per_page: limit,
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching commits for ${owner}/${repo}:`, error);
      return [];
    }
  }
}

export default GitHubAPI;