import { Commands } from '../../constants';
import type { Container } from '../../container';
import { WebviewBase } from '../webviewBase';
import type { State } from './protocol';

export class GraphWebview extends WebviewBase<State> {
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

	protected override includeBootstrap(): State {
		return {
			commits: [],
		};
	}
}
