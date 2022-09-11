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

function handleMessage(data: string) {
	chat.appendMessage(data);
}

function handleConnectionStatusChange(status: RTCIceConnectionState) {
	if (status === 'connected') connectionStatus.setAttribute('status', 'connected');
}

async function handleCall(track: MediaStreamTrack) {
	video.addTrack(track);
}

async function getStream() {
	return navigator.mediaDevices.getUserMedia({ audio: false, video: true });
}

function handleError(error: unknown) {
	console.error(error);
}

video.onCallClick = async () => {
	try {
		const stream = await getStream();

		call(stream);
	} catch (error) {
		handleError(error);
	}
};

chat.onSend = (text: string) => {
	send(text);
};
