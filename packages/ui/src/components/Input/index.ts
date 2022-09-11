import styles from './index.module.css';

export class Input extends HTMLInputElement {
	constructor() {
		super();

		this.classList.add(styles.container);
	}
}

customElements.define('ui-input', Input, { extends: 'input' });
