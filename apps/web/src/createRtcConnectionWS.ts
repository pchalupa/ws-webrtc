/*
STEPS:
1. connect to signaling, implement send function
2. create peer connection instance
3. crate data channel
4. connection state change listener
5. define peer id
6. listen for ice candidate
7. listen for negotiationneeded event
8. handle signaling message
9. handle data channel event
10. implement send function
11. listen for message event
12. listen for track event
13. implement call function
*/

const iceServers = [{ urls: 'stun:stun.l.google.com:19302' }];

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

	return { send, stream };
}

async function handleSignalingMessage(message: MessageEvent<string>) {}

function sendToSignaling(data: SignalingMessage) {}
