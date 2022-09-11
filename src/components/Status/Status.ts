import styles from './index.module.css';

export class Status extends HTMLElement {
	status: string;
	constructor() {
		super();
	}

	static get observedAttributes() {
		return ['status'];
	}

	attributeChangedCallback(name: string, previous: string, next: string) {
		switch (name) {
			case 'status':
				if (next === 'connected') console.log('OK');
				break;
		}
	}

	connectedCallback() {
		this.render();
	}

	disconnectedCallback() {}

	render() {
		this.className = styles.container;

		this.innerText = 'connected';
	}
}

window.customElements.define('connection-status', Status);
