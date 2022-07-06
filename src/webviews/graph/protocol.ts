export type Repository = Record<string, any>;
export type GitCommit = Record<string, any>;

export interface State {
    repositories: Repository[];
    selectedRepository?: string;
    commits: GitCommit[];
    nonce?: string;
}

export interface CommitListCallback {
    (state: State): void;
}
