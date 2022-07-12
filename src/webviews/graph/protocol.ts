export type Repository = Record<string, any>;
export type GitCommit = Record<string, any>;
export type GitRemote = Record<string, any>;
export type GitTag = Record<string, any>;
export type GitBranch = Record<string, any>;

export interface State {
    repositories: Repository[];
    selectedRepository?: string;
    commits: GitCommit[];
    remotes: GitRemote[],
	tags: GitTag[],
	branches: GitBranch[]
    nonce?: string;
}

export interface CommitListCallback {
    (state: State): void;
}
