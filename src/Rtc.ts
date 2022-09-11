class Rtc {
	iceServers = [{ urls: 'stun:stun.l.google.com:19302' }];
	signalingServer = new WebSocket('ws://localhost:8080');
	peerConnection = new RTCPeerConnection({ iceServers });
	dataChannel = peerConnection.createDataChannel('test');
	id = crypto.randomUUID();

	constructor() {
		document.addEventListener('DOMContentLoaded', () => {
			const joinButton = document.getElementById('join-button');
			const sendButton = document.getElementById('send-button');

			joinButton?.addEventListener('click', createConnection);
			sendButton?.addEventListener('click', () => dataChannel.send('TEST'));
		});

		this.signalingServer.addEventListener('message', handleSignalingMessage);

		this.peerConnection.addEventListener('icecandidate', (event) => {
			sendToSignaling(JSON.stringify({ id, ice: event.candidate }));
		});

		this.peerConnection.addEventListener('negotiationneeded', async () => {
			try {
				await peerConnection.setLocalDescription(await peerConnection.createOffer());
				sendToSignaling(JSON.stringify({ ...peerConnection.localDescription }));
			} catch (error) {
				handleError(error);
			}
		});

		peerConnection.addEventListener('connectionstatechange', () => {
			console.log('connectionstatechange', peerConnection.iceConnectionState);
		});

		dataChannel.addEventListener('message', (event) => console.log('message', event.data));
	}

	createConnection() {
		createOffer(peerConnection);
	}

	async handleSignalingMessage(message: MessageEvent) {
		try {
			const data = JSON.parse(message.data);

			if (data.id === id) return;
			if ('sdp' in data) {
				if (data.sdp.type === 'offer') {
					await peerConnection.setRemoteDescription(data.sdp);
					await peerConnection.setLocalDescription(await peerConnection.createAnswer());
					sendToSignaling(JSON.stringify({ id, ...peerConnection.localDescription }));
				} else if (data.sdp.type === 'answer') {
					await peerConnection.setRemoteDescription(data.sdp);
				}
			}
			if ('ice' in data) {
				await peerConnection.addIceCandidate(new RTCIceCandidate(data.ice));
			}
		} catch (error) {
			handleError(error);
		}
	}

	async createOffer(peerConnection: RTCPeerConnection) {
		try {
			await peerConnection.setLocalDescription();
			sendToSignaling(JSON.stringify({ id, sdp: peerConnection.localDescription }));
		} catch (error) {
			handleError(error);
		}
	}

	sendToSignaling(message: string) {
		signalingServer.send(message);
	}

	handleError(error: unknown) {
		console.error(error);
	}
}
