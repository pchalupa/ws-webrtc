import styles from './index.module.css';

export class Row extends HTMLElement {
	connectedCallback() {
		this.classList.add(styles.container);
	}
}

customElements.define('ui-row', Row);
