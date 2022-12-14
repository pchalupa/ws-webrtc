import styles from './index.module.css';

export class Textarea extends HTMLTextAreaElement {
	disabled = true;

	connectedCallback() {
		this.classList.add(styles.container);
	}

	appendLine(text: string) {
		this.value += `${text}\n`;
	}
}

customElements.define('ui-textarea', Textarea, { extends: 'textarea' });
