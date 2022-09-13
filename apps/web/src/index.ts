import 'ui';
import type { Status, Video, Chat } from 'ui';
import { createRtcConnection } from './createRtcConnection';

document.addEventListener('DOMContentLoaded', () => {
	const connectionStatus = document.getElementById('status') as Status;
	const video = document.getElementById('video') as Video;
	const chat = document.getElementById('chat') as Chat;

	const { send, stream } = createRtcConnection({
		onConnectionStatusChange: handleConnectionStatusChange,
		onMessage: handleMessage,
		onCall: handleCall,
		onError: handleError,
	});

	video.onCallClick = handleStreamClick;
	chat.onSend = handleSend;

	function handleConnectionStatusChange(status: RTCPeerConnectionState) {
		connectionStatus.setStatus(status);
	}

	function handleMessage(message: string) {
		appendMessage('Friend', message);
	}

	async function handleCall(track: MediaStreamTrack) {
		video.addTrack(track);
	}

	async function handleStreamClick() {
		try {
			stream(await getStream(false, true));
		} catch (error) {
			handleError(error);
		}
	}

	function handleSend(message: string) {
		send(message);
		appendMessage('Me', message);
	}

	function appendMessage(sender: string, message: string) {
		chat.appendMessage(`${sender}: ${message}`);
	}

	function handleError(error: unknown) {
		console.error(error);
	}

	async function getStream(audio: boolean, video: boolean) {
		return navigator.mediaDevices.getUserMedia({
			audio,
			video,
		});
	}
});
