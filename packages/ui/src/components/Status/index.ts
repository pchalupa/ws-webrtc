import styles from './index.module.css';

export class Status extends HTMLElement {
	innerText: RTCIceConnectionState;

	constructor() {
		super();

		this.classList.add(styles.container);
		this.innerText = 'disconnected';
	}

	setStatus(status: RTCIceConnectionState) {
		this.innerText = status;
		this.setAttribute('status', status);
	}
}

customElements.define('ui-status', Status);
