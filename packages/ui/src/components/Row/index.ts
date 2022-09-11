import styles from './index.module.css';

export class Row extends HTMLElement {
	constructor() {
		super();

		this.classList.add(styles.container);
	}
}

customElements.define('ui-row', Row);
