/*global*/
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { CommitListCallback, State } from '../../graph/protocol';
import { App } from '../shared/appBase';
import { GraphWrapper } from './GraphWrapper';
import './graph.scss';

export class GraphApp extends App<State> {
	private callback?: CommitListCallback;

	constructor() {
		super('GraphApp');
	}

	protected override onBind() {
		const disposables = super.onBind?.() ?? [];

		const $root = document.getElementById('root');
		if ($root != null) {
			render(
				<GraphWrapper subscriber={(callback: CommitListCallback) => this.registerEvents(callback)} {...this.state} />,
				$root
			);
			disposables.push({
				dispose: () => unmountComponentAtNode($root)
			});
		}

		return disposables;
	}


	protected override onMessageReceived(e: MessageEvent) {
		console.log('onMessageReceived', e);
	}

	registerEvents(callback: CommitListCallback): () => void {
		this.callback = callback;

		return () => {
			this.callback = undefined;
		};
	}
}

new GraphApp();
