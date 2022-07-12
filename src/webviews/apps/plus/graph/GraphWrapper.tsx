import { GraphRow } from '@axosoft/gitkraken-components/lib/components/graph/GraphContainer';
import React, { useEffect, useState } from 'react';
import {
	CommitListCallback,
	GitBranch,
	GitCommit,
	GitRemote,
	GitTag,
	GraphColumnConfig,
	Repository,
	State,
} from '../../../../plus/webviews/graph/protocol';
import { GKGraph } from './GKGraph';

export interface GraphWrapperProps extends State {
	subscriber: (callback: CommitListCallback) => () => void;
	onSelectRepository?: (repository: Repository) => void;
	onColumnChange?: (name: string, settings: GraphColumnConfig) => void;
}

const getGraphModel = (
	gitCommits: GitCommit[] = [],
	gitRemotes: GitRemote[] = [],
	gitTags: GitTag[] = [],
	gitBranches: GitBranch[] = []
): GraphRow[] => {
    const graphRows: GraphRow[] = [];

	// console.log('gitRemotes -> ', gitRemotes);
	// console.log('gitTags -> ', gitTags);
	// console.log('gitBranches -> ', gitBranches);

	for (const gitCommit of gitCommits) {
		// TODO: finish code logic to retrieve branches, tags and remotes for th GK graph
		const commitBranch = gitBranches.find(b => b.sha === gitCommit.sha);
		let branchInfo = {} as any;
		if (commitBranch != null) {
			branchInfo = {
				remotes: [
					{
						name: commitBranch.name,
						url: commitBranch.id
					}
				]
			};
			if (commitBranch.current) {
				branchInfo.heads = [
					{
						name: commitBranch.name,
						isCurrentHead: true
					}
				];
			}
		}
		const commitTag = gitTags.find(t => t.sha === gitCommit.sha);
		let tagInfo = {} as any;
		if (commitTag != null) {
			tagInfo = {
				tags: [
					{
						name: commitTag.name,
					}
				]
			};
		}

		graphRows.push({
			sha: gitCommit.sha,
			parents: gitCommit.parents,
			author: gitCommit.author.name,
			email: gitCommit.author.email,
			date: new Date(gitCommit.committer.date).getTime(),
			message: gitCommit.message,
			type: 'commit-node',
			...branchInfo,
			...tagInfo
		});
	}

    return graphRows;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export function GraphWrapper({
	subscriber,
	commits = [],
	repositories = [],
	remotes = [],
	tags = [],
	branches = [],
	selectedRepository,
	config,
	nonce,
	onSelectRepository,
	onColumnChange,
}: GraphWrapperProps) {
	const [graphList, setGraphList] = useState(getGraphModel(commits, remotes, tags, branches));
	const [reposList, setReposList] = useState(repositories);
	const [currentRepository, setCurrentRepository] = useState(selectedRepository);
	const [settings, setSettings] = useState(config);

	function transformData(state: State) {
		setGraphList(getGraphModel(state.commits, state.remotes, state.tags, state.branches));
		setReposList(state.repositories ?? []);
		setCurrentRepository(state.selectedRepository);
		setSettings(state.config);
	}

	useEffect(() => {
		if (subscriber === undefined) {
			return;
		}
		return subscriber(transformData);
	}, []);

	const handleSelectRepository = (item: GitCommit) => {
		if (onSelectRepository !== undefined) {
			onSelectRepository(item);
		}
	};

	const graphRows: GraphRow[] = graphList;

	return (
		<>
			{/* <ul>
				{reposList.length ? (
					reposList.map((item, index) => (
						<li onClick={() => handleSelectRepository(item)} key={`repos-${index}`}>
							{item.path === currentRepository ? '(selected)' : ''}
							{JSON.stringify(item)}
						</li>
					))
				) : (
					<li>No repos</li>
				)}
			</ul>
			{currentRepository !== undefined ? (
				<ul>
					{graphList.length ? (
						graphList.map((item, index) => <li key={`commits-${index}`}>{JSON.stringify(item)}</li>)
					) : (
						<li>No commits</li>
					)}
				</ul>
			) : (
				<p>No repository is selected</p>
			)} */}
			<GKGraph rows={graphRows} repoPath={currentRepository} nonce={nonce} />
		</>
	);
}
