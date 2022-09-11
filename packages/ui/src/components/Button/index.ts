import styles from './index.module.css';

export class Button extends HTMLButtonElement {
	constructor() {
		super();

		this.classList.add(styles.container);
	}
}

customElements.define('ui-button', Button, { extends: 'button' });
