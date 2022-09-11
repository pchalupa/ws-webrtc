import 'ui';
import type { Status, Video, Chat } from 'ui';
import { createRtcConnection } from './rtcConnection';

const connectionStatus = document.getElementById('status') as Status;
const video = document.getElementById('video') as Video;
const chat = document.getElementById('chat') as Chat;

const { send, call } = createRtcConnection({
	onConnectionStatusChange: handleConnectionStatusChange,
	onMessage: handleMessage,
	onCall: handleCall,
	onError: handleError,
});

video.onCallClick = handleCallClick;
chat.onSend = send;

function handleConnectionStatusChange(status: RTCIceConnectionState) {
	connectionStatus.setStatus(status);
}

function handleMessage(data: string) {
	chat.appendMessage(data);
}

async function handleCall(track: MediaStreamTrack) {
	video.addTrack(track);
}

async function handleCallClick() {
	try {
		const stream = await getStream();

		call(stream);
	} catch (error) {
		handleError(error);
	}
}

function handleError(error: unknown) {
	console.error(error);
}

async function getStream() {
	return navigator.mediaDevices.getUserMedia({ audio: false, video: true });
}
