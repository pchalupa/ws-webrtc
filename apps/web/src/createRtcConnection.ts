const iceServers = [{ urls: 'stun:stun.l.google.com:19302' }];
const signalingServer = new WebSocket(
	import.meta.env.VITE_SIGNALING_SERVER_URL
);
const peerConnection = new RTCPeerConnection({ iceServers });
const id = crypto.randomUUID();

interface SignalingMessage {
	id: string;
	sdp?: RTCSessionDescriptionInit;
	ice?: RTCIceCandidate;
}

export function createRtcConnection({
	onConnectionStatusChange: handleConnectionStatusChange,
	onMessage: handleMessage,
	onCall: handleCall,
	onError: handleError,
}: {
	onConnectionStatusChange: (status: RTCPeerConnectionState) => void;
	onMessage: (data: string) => void;
	onCall: (track: MediaStreamTrack) => void;
	onError: (error: unknown) => void;
}) {
	let dataChannel = peerConnection.createDataChannel(crypto.randomUUID());

	const send = (data: string) => {
		if (dataChannel.readyState === 'open') dataChannel.send(data);
	};

	const stream = async (stream: MediaStream) => {
		const tracks = stream.getTracks();

		tracks.forEach((track) => peerConnection.addTrack(track));
	};

	signalingServer.addEventListener('message', handleSignalingMessage);

	peerConnection.addEventListener('icecandidate', (event) => {
		if (event.candidate) sendToSignaling({ id, ice: event.candidate });
	});

	peerConnection.addEventListener('negotiationneeded', async () => {
		try {
			const offer = await peerConnection.createOffer();

			await peerConnection.setLocalDescription(offer);
			sendToSignaling({ id, sdp: offer });
		} catch (error) {
			handleError(error);
		}
	});

	peerConnection.addEventListener('connectionstatechange', () => {
		const { connectionState } = peerConnection;

		handleConnectionStatusChange(connectionState);
	});

	peerConnection.addEventListener('datachannel', (event) => {
		const { channel } = event;

		channel.addEventListener('message', (event) =>
			handleMessage(event.data)
		);

		dataChannel = channel;
	});

	peerConnection.addEventListener('track', (event) => {
		handleCall(event.track);
	});

	dataChannel.addEventListener('message', (event) =>
		handleMessage(event.data)
	);

	return { send, stream };
}

async function handleSignalingMessage(message: MessageEvent<string>) {
	try {
		const data: SignalingMessage = JSON.parse(message.data);

		if (data.id === id) return;
		if ('sdp' in data) {
			if (data.sdp?.type === 'offer') {
				await peerConnection.setRemoteDescription(data.sdp);

				const answer = await peerConnection.createAnswer();

				await peerConnection.setLocalDescription(answer);
				sendToSignaling({
					id,
					sdp: answer,
				});
			} else if (data.sdp?.type === 'answer') {
				await peerConnection.setRemoteDescription(data.sdp);
			}
		}
		if ('ice' in data && data.ice && peerConnection.remoteDescription)
			await peerConnection.addIceCandidate(new RTCIceCandidate(data.ice));
	} catch (error) {
		throw error;
	}
}

function sendToSignaling(data: SignalingMessage) {
	try {
		if (signalingServer.readyState === signalingServer.OPEN)
			signalingServer.send(JSON.stringify(data));
	} catch (error) {
		throw error;
	}
}
