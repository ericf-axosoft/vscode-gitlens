import { Commands } from '../../constants';
import type { Container } from '../../container';
import { WebviewBase } from '../webviewBase';
import type { GitCommit, Repository, State } from './protocol';

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

	private async getState(): Promise<State> {
		const repositories = this.getRepos();
		if (repositories.length === 0) {
			return {
				repositories: [],
				commits: [],
			};
		}

		if (this.selectedRepository === undefined) {
			this.selectedRepository = repositories[0].path;
		}

		const commits = await this.getCommits(this.selectedRepository);

		return {
			repositories: formatRepositories(repositories),
			selectedRepository: this.selectedRepository,
			commits: formatCommits(commits)
		};
	}

	protected override async includeBootstrap(): Promise<State> {
		return this.getState();
	}
}

function formatCommits(commits: GitCommit[]): GitCommit[] {
	return commits.map(({ sha, author, message }) => ({
		sha: sha,
		author: author,
		message: message
	}));
}

function formatRepositories(repositories: Repository[]): Repository[] {
	if (repositories.length === 0) {
		return repositories;
	}

	return repositories.map(({ formattedName, id, name, path }) => ({ formattedName: formattedName, id: id, name: name, path: path }));
}
