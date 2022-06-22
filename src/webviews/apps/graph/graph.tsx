/*global*/
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { State } from '../../graph/protocol';
import { App } from '../shared/appBase';
import { GraphWrapper } from './GraphWrapper';
import './graph.scss';

export class GraphApp extends App<State> {
	constructor() {
		super('GraphApp');
	}

	protected override onBind() {
		const disposables = super.onBind?.() ?? [];

		const $root = document.getElementById('root');
		if ($root != null) {
			render(
				<GraphWrapper subscriber={this.registerEvents} data={this.state.commits} />,
				$root
			);
			disposables.push({
				dispose: () => unmountComponentAtNode($root)
			});
		}

		return disposables;
	}

	registerEvents(callback: (data: unknown[]) => void): () => void {
		return () => {};
	}
}

new GraphApp();
