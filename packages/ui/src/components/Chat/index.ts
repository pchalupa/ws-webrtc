import { Input } from '../Input';
import { Textarea } from '../Textarea';
import styles from './index.module.css';

export class Chat extends HTMLElement {
	private form: HTMLFormElement;
	private textarea: Textarea;
	onSend?: (text: string) => void;

	constructor() {
		super();

		this.textarea = this.createTextarea();
		this.form = this.createForm();
	}

	private createTextarea() {
		const textarea = new Textarea();

		textarea.classList.add(styles.textarea);

		return textarea;
	}

	private createForm() {
		const form = document.createElement('form');
		const input = new Input();
		const submit = new Input();

		form.classList.add(styles.form);
		input.classList.add(styles.input);
		submit.classList.add(styles.submit);

		form.append(input);
		form.append(submit);

		input.type = 'text';
		submit.type = 'submit';

		submit.value = 'send';

		form.addEventListener('submit', (event) => {
			event.preventDefault();

			if (this.onSend) {
				this.onSend(input.value);
				input.value = '';
			}
		});

		return form;
	}

	private render() {
		const fragment = new DocumentFragment();

		fragment.append(this.textarea);
		fragment.append(this.form);

		this.append(fragment);
	}

	connectedCallback() {
		this.classList.add(styles.container);
		this.render();
	}

	appendMessage(message: string) {
		this.textarea.appendLine(message);
	}
}

customElements.define('ui-chat', Chat);
