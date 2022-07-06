import { GraphRow } from '@axosoft/gitkraken-components/lib/components/graph/GraphContainer';
import React, { useEffect, useState } from 'react';
import { CommitListCallback, GitCommit, State } from '../../graph/protocol';
import { GKGraph } from './GKGraph';

export interface GraphWrapperProps extends State {
    subscriber: (callback: CommitListCallback) => () => void;
    nonce?: string;
}

const getGraphModel = (gitCommits: GitCommit[]): GraphRow[] => {
    const graphRows: GraphRow[] = [];

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

    return graphRows;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export function GraphWrapper({ subscriber, commits, repositories, selectedRepository, nonce }: GraphWrapperProps) {
    const [graphList, setGraphList] = useState(getGraphModel(commits));
    const [reposList, setReposList] = useState(repositories);
    const [currentRepository, setCurrentRepository] = useState(selectedRepository);

    function transformData(state: State) {
        setGraphList(getGraphModel(state.commits));
        setReposList(state.repositories);
        setCurrentRepository(state.selectedRepository);
    }

    useEffect(() => {
        if (subscriber === undefined) {
            return;
        }
        return subscriber(transformData);
    }, []);

    const graphRows: GraphRow[] = graphList;

    return (
        <>
            {/* <ul>
                {reposList.length ? reposList.map((item, index) => (<li key={`repos-${index}`}>{JSON.stringify(item)}</li>)) : (<li>No repos</li>)}
            </ul> */}
            {/* <ul>
                {graphList.length ? graphList.map((item, index) => (<li key={`commits-${index}`}>{JSON.stringify(item)}</li>)) : (<li>No commits</li>)}
            </ul> */}
            <GKGraph rows={graphRows} repoPath={currentRepository} nonce={nonce} />
        </>
    );
}
