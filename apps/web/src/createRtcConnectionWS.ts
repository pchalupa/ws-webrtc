const iceServers = [{ urls: 'stun:stun.l.google.com:19302' }];

/*
1. connect to signaling + send function
2. create peer connection instance
3. connection state change listener
4. peer id
5. ice candidate
6. negotiationneeded listener
7. handle signaling message
8. dataChannel
9. tracks
*/

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
	const send = (data: string) => {};

	const stream = async (stream: MediaStream) => {};

	async function handleSignalingMessage(message: MessageEvent) {}

	return { send, stream };
}

function sendToSignaling(data: SignalingMessage) {}
