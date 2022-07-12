import { GraphRow } from '@axosoft/gitkraken-components/lib/components/graph/GraphContainer';
import React, { useEffect, useState } from 'react';
import {
	CommitListCallback,
	GitCommit,
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

const getGraphModel = (gitCommits?: GitCommit[]): GraphRow[] => {
    const graphRows: GraphRow[] = [];

	if (gitCommits !== undefined) {
		for (const gitCommit of gitCommits) {
			graphRows.push({
				sha: gitCommit.sha,
				parents: gitCommit.parents,
				author: gitCommit.author.name,
				email: gitCommit.author.email,
				date: new Date(gitCommit.committer.date).getTime(),
				message: gitCommit.message,
				type: 'commit-node'
			});
		}
	}

    return graphRows;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export function GraphWrapper({
	subscriber,
	commits = [],
	repositories = [],
	selectedRepository,
	config,
	nonce,
	onSelectRepository,
	onColumnChange,
}: GraphWrapperProps) {
	const [graphList, setGraphList] = useState(getGraphModel(commits));
	const [reposList, setReposList] = useState(repositories);
	const [currentRepository, setCurrentRepository] = useState(selectedRepository);
	const [settings, setSettings] = useState(config);

	function transformData(state: State) {
		setGraphList(getGraphModel(state.commits));
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
