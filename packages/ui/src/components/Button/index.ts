import styles from './index.module.css';

export class Button extends HTMLButtonElement {
	connectedCallback() {
		this.classList.add(styles.container);
	}
}

customElements.define('ui-button', Button, { extends: 'button' });
