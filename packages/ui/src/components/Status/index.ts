import styles from './index.module.css';

export class Status extends HTMLElement {
	innerText: RTCIceConnectionState;

	constructor() {
		super();

		this.innerText = 'disconnected';
	}

	connectedCallback() {
		this.classList.add(styles.container);
	}

	setStatus(status: RTCIceConnectionState) {
		this.innerText = status;
		this.setAttribute('status', status);
	}
}

customElements.define('ui-status', Status);
