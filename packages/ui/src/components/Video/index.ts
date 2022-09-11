import { Button } from '../Button';
import styles from './index.module.css';

export class Video extends HTMLElement {
	private video: HTMLVideoElement;
	private callButton: Button;
	private mediaStream: MediaStream;
	onCallClick?: () => void;

	constructor() {
		super();

		this.classList.add(styles.container);
		this.mediaStream = new MediaStream();
		this.video = this.createVideo();
		this.callButton = this.createCallButton();

		this.mediaStream.addEventListener('addtrack', () => {
			console.log('AaAS');
			this.callButton.hidden = true;
		});
	}

	private createVideo() {
		const video = document.createElement('video');

		video.srcObject = this.mediaStream;
		video.classList.add(styles.video);
		video.autoplay = true;

		return video;
	}

	private createCallButton() {
		const button = new Button();

		button.classList.add(styles.button);
		button.innerText = '🤙';
		button.addEventListener('click', () => {
			if (this.onCallClick) this.onCallClick();
		});

		return button;
	}

	private render() {
		const fragment = new DocumentFragment();

		fragment.append(this.video);
		fragment.append(this.callButton);
		this.append(fragment);
	}

	connectedCallback() {
		this.render();
	}

	addTrack(track: MediaStreamTrack) {
		this.mediaStream.addTrack(track);
	}
}

customElements.define('ui-video', Video);
