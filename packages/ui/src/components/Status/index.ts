import { Status as ConnectionStatus } from 'types';

import styles from './index.module.css';

enum Attributes {
	Status = 'status',
}

export class Status extends HTMLElement {
	status = ConnectionStatus.Disconnected;

	static get observedAttributes() {
		return Object.values(Attributes);
	}

	constructor() {
		super();

		this.classList.add(styles.container);
	}

	private render() {
		this.innerText = this.status;
	}

	attributeChangedCallback(name: string, _previous: string, next: string) {
		switch (name) {
			case Attributes.Status:
				if (next === ConnectionStatus.Connected) this.status = ConnectionStatus.Connected;
				else if (next === ConnectionStatus.Disconnected) this.status = ConnectionStatus.Disconnected;
				break;
		}

		this.render();
	}

	connectedCallback() {
		this.render();
	}
}

customElements.define('ui-status', Status);
