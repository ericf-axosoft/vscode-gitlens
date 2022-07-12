import { Commands } from '../../constants';
import type { Container } from '../../container';
import { WebviewBase } from '../webviewBase';
import type { GitBranch, GitCommit, GitRemote, GitTag, Repository, State } from './protocol';

export class GraphWebview extends WebviewBase<State> {
	private selectedRepository?: string;

	constructor(container: Container) {
		super(
			container,
			'gitlens.graph',
			'graph.html',
			'images/gitlens-icon.png',
			'Graph',
			Commands.ShowGraphPage,
		);
	}

	private getRepos(): Repository[] {
		return this.container.git.openRepositories;
	}

	private async getCommits(repo?: string | Repository): Promise<GitCommit[]> {
		if (repo === undefined) {
			return [];
		}

		const repository = typeof repo === 'string' ? this.container.git.getRepository(repo) : repo;
		if (repository === undefined) {
			return [];
		}

		const log = await this.container.git.getLog(repository.uri);
		if (log?.commits === undefined) {
			return [];
		}

		return Array.from(log.commits.values());
	}

	private async getRemotes(repo?: string | Repository): Promise<GitRemote[]> {
		if (repo === undefined) {
			return [];
		}

		const repository = typeof repo === 'string' ? this.container.git.getRepository(repo) : repo;
		if (repository === undefined) {
			return [];
		}

		const remotes = await this.container.git.getRemotes(repository.uri);
		if (remotes === undefined) {
			return [];
		}

		return Array.from(remotes.values());
	}

	private async getTags(repo?: string | Repository): Promise<GitTag[]> {
		if (repo === undefined) {
			return [];
		}

		const repository = typeof repo === 'string' ? this.container.git.getRepository(repo) : repo;
		if (repository === undefined) {
			return [];
		}

		const tags = await this.container.git.getTags(repository.uri);
		if (tags === undefined) {
			return [];
		}

		return Array.from(tags.values);
	}

	private async getBranches(repo?: string | Repository): Promise<GitBranch[]> {
		if (repo === undefined) {
			return [];
		}

		const repository = typeof repo === 'string' ? this.container.git.getRepository(repo) : repo;
		if (repository === undefined) {
			return [];
		}

		const branches = await this.container.git.getBranches(repository.uri);
		if (branches === undefined) {
			return [];
		}

		return Array.from(branches.values);
	}

	private async getState(): Promise<State> {
		const repositories = this.getRepos();
		if (repositories.length === 0) {
			return {
				repositories: [],
				commits: [],
				remotes: [],
				tags: [],
				branches: []
			};
		}

		if (this.selectedRepository === undefined) {
			this.selectedRepository = repositories[0].path;
		}

		const commits = await this.getCommits(this.selectedRepository);
		const remotes = await this.getRemotes(this.selectedRepository);
		const branches = await this.getBranches(this.selectedRepository);
		const tags = await this.getTags(this.selectedRepository);

		return {
			repositories: formatRepositories(repositories),
			selectedRepository: this.selectedRepository,
			commits: formatCommits(commits),
			remotes: remotes,
			branches: branches,
			tags: tags,
			nonce: super.getCSPNonce()
		};
	}

	protected override async includeBootstrap(): Promise<State> {
		return this.getState();
	}
}

function formatCommits(commits: GitCommit[]): GitCommit[] {
	return commits.map(({ sha, author, message, parents, committer }) => ({
		sha: sha,
		author: author,
		message: message,
		parents: parents,
		committer: committer
	}));
}

function formatRepositories(repositories: Repository[]): Repository[] {
	if (repositories.length === 0) {
		return repositories;
	}

	return repositories.map(({ formattedName, id, name, path }) => ({ formattedName: formattedName, id: id, name: name, path: path }));
}
