const iceServers = [{ urls: 'stun:stun.l.google.com:19302' }];
const signalingServer = new WebSocket('ws://localhost:8080');
const peerConnection = new RTCPeerConnection({ iceServers });
let dataChannel = peerConnection.createDataChannel(crypto.randomUUID());
const id = crypto.randomUUID();
const sendButton = document.getElementById('send-button');

export function createRtcConnection() {
	sendButton?.addEventListener('click', () => dataChannel.send('TEST'));

	signalingServer.addEventListener('message', handleSignalingMessage);

	peerConnection.addEventListener('icecandidate', (event) => {
		sendToSignaling(JSON.stringify({ id, ice: event.candidate }));
	});

	peerConnection.addEventListener('negotiationneeded', async () => {
		try {
			await peerConnection.setLocalDescription(await peerConnection.createOffer());
			sendToSignaling(JSON.stringify({ id, sdp: peerConnection.localDescription }));
		} catch (error) {
			handleError(error);
		}
	});

	peerConnection.addEventListener('connectionstatechange', () => {
		console.log('state', peerConnection.iceConnectionState);
	});

	peerConnection.addEventListener('datachannel', (event) => {
		dataChannel = event.channel;
	});

	dataChannel.addEventListener('message', (event) => console.log('message', event.data));

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
			handleError(error);
		}
	}

	function sendToSignaling(message: string) {
		signalingServer.send(message);
	}

	function handleError(error: unknown) {
		console.error(error);
	}
}
