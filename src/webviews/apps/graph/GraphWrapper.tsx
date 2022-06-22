import React, { useEffect, useState } from 'react';

export interface GraphWrapperProps {
    subscriber: (callback: (data: unknown[]) => void) => void;
    data: unknown[];
}

const getGraphModel = (data: unknown[]) => data;

// eslint-disable-next-line @typescript-eslint/naming-convention
export function GraphWrapper({ subscriber, data }: GraphWrapperProps) {
    const [count, setCount] = useState(0);
    const [graphList, setGraphList] = useState<unknown[]>(getGraphModel(data));

    function transformData(newData: unknown[]) {
        setGraphList(getGraphModel(newData));
    }

    useEffect(() => {
        return subscriber(transformData);
    });

    return (
        <div>
            <p>This is the graph wrapper. Counter: {count}</p>
            <button type="button" onClick={() => setCount(count + 1)}>Increment</button>
            <ul>
                {graphList.map((item, index) => (<li key={index}>{JSON.stringify(item)}</li>))}
            </ul>
        </div>
    );
}
