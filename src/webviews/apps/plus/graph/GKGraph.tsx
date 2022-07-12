import GraphContainer, { GraphRow } from '@axosoft/gitkraken-components/lib/components/graph/GraphContainer';
import * as React from 'react';

interface GKProps {
  rows?: GraphRow[];
  repoPath?: string;
  nonce?: string;
}

interface GKState {
  rows: GraphRow[];
  repoPath: string;
}

export class GKGraph extends React.Component<GKProps, GKState> {

  constructor(props: GKProps) {
    super(props);

    this.state = {
      rows: props.rows !== undefined ? props.rows : [],
      repoPath: props.repoPath !== undefined ? props.repoPath : '',
    };
  }

  override componentWillReceiveProps(nextProps: GKProps): void {
    if (this.props.rows !== nextProps.rows) {
      this.setState({
        rows: nextProps.rows !== undefined ? nextProps.rows : []
      });
    }

    if (this.props.repoPath !== nextProps.repoPath) {
      this.setState({
        repoPath: nextProps.repoPath !== undefined ? nextProps.repoPath : ''
      });
    }
  }

  override render(): JSX.Element {
    const {
      nonce
    } = this.props;

    const {
      rows,
      repoPath
    } = this.state;

    return (
      <div className="GKGraph">
        <h2>Repository: {repoPath}</h2>
        <GraphContainer
          graphRows={rows}
          useAuthorInitialsForAvatars={false}
          nonce={nonce}
        />
      </div>
    );
  }
}
