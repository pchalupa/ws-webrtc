const iceServers = [{ urls: 'stun:stun.l.google.com:19302' }];
const signalingServer = new WebSocket('ws://localhost:8080');
const peerConnection = new RTCPeerConnection({ iceServers });
let dataChannel = peerConnection.createDataChannel(crypto.randomUUID());
const id = crypto.randomUUID();

export function createRtcConnection({
	onConnectionStatusChange,
	onMessage,
	onCall,
	onError,
}: {
	onConnectionStatusChange: (status: RTCIceConnectionState) => void;
	onMessage: (data: string) => void;
	onCall: (track: MediaStreamTrack) => void;
	onError: (error: unknown) => void;
}) {
	const send = (data: string) => dataChannel.send(data);
	const call = async (stream: MediaStream) => {
		const tracks = stream.getTracks();

		tracks.forEach((track) => peerConnection.addTrack(track));
	};

	signalingServer.addEventListener('message', handleSignalingMessage);

	peerConnection.addEventListener('icecandidate', (event) => {
		sendToSignaling(JSON.stringify({ id, ice: event.candidate }));
	});

	peerConnection.addEventListener('negotiationneeded', async () => {
		try {
			await peerConnection.setLocalDescription(await peerConnection.createOffer());
			sendToSignaling(JSON.stringify({ id, sdp: peerConnection.localDescription }));
		} catch (error) {
			onError(error);
		}
	});

	peerConnection.addEventListener('connectionstatechange', () => {
		const { iceConnectionState: state } = peerConnection;

		onConnectionStatusChange(state);
		console.log('state', state);
	});

	peerConnection.addEventListener('datachannel', (event) => {
		dataChannel = event.channel;
	});

	peerConnection.addEventListener('track', (event) => {
		console.log(event.track);
		onCall(event.track);
	});

	dataChannel.addEventListener('message', (event) => onMessage(event.data));

	return { send, call };
}

async function handleSignalingMessage(message: MessageEvent) {
	try {
		const data = JSON.parse(message.data);

		if (data.id === id) return;
		if ('sdp' in data) {
			if (data.sdp.type === 'offer') {
				await peerConnection.setRemoteDescription(data.sdp);
				await peerConnection.setLocalDescription(await peerConnection.createAnswer());
				sendToSignaling(JSON.stringify({ id, sdp: peerConnection.localDescription }));
			} else if (data.sdp.type === 'answer') {
				await peerConnection.setRemoteDescription(data.sdp);
			}
		}
		if ('ice' in data && data.ice && peerConnection.remoteDescription)
			await peerConnection.addIceCandidate(new RTCIceCandidate(data.ice));
	} catch (error) {
		// TODO: on error
	}
}

function sendToSignaling(message: string) {
	signalingServer.send(message);
}
