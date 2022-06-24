import React, { useEffect, useState } from 'react';
import { CommitListCallback, GitCommit, State } from '../../graph/protocol';

export interface GraphWrapperProps extends State {
    subscriber: (callback: CommitListCallback) => () => void;
}

// TODO: this needs to be replaced with a function from the Graph repo
const getGraphModel = (data: GitCommit[]) => data;

// eslint-disable-next-line @typescript-eslint/naming-convention
export function GraphWrapper({ subscriber, commits, repositories, selectedRepository }: GraphWrapperProps) {
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

    return (
        <>
            <ul>
                {reposList.length ? reposList.map((item, index) => (<li key={`repos-${index}`}>{JSON.stringify(item)}</li>)) : (<li>No repos</li>)}
            </ul>
            <ul>
                {graphList.length ? graphList.map((item, index) => (<li key={`commits-${index}`}>{JSON.stringify(item)}</li>)) : (<li>No commits</li>)}
            </ul>
        </>
    );
}
