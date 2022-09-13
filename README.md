# WebRTC

> Imagine a world where your phone, TV, and computer could communicate on a common platform. Imagine it was easy to add video chat and peer-to-peer data sharing to your web app. That's the vision of WebRTC.

## RTCPeerConnection

The RTCPeerConnection interface represents a WebRTC connection between the local computer and a remote peer. It provides methods to connect to a remote peer, maintain and monitor the connection, and close the connection once it's no longer needed.

### Events

| Name                                                                                                                    | Description                                          |
| ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| [connectionstatechange](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/connectionstatechange_event) | Fires when connection state changes                  |
| [negotiationneeded](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/negotiationneeded_event)         | Fires when negotiating of the connection is required |
| [icecandidate](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/icecandidate_event)                   | Fires when ICE candidate is added to local peer      |
| [datachannel](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/datachannel_event)                     | Fires when data channel is added to the connection   |
| [track](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/track_event)                                 | Fires when new track is added to the connection      |

### Properties

| Name                                                                                                  | Description                                        |
| ----------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| [connectionState](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/connectionState) | Indicates the current state of the peer connection |

## RTCDataChannel

The RTCDataChannel interface represents a network channel which can be used for bidirectional peer-to-peer transfers of arbitrary data. Every data channel is associated with an RTCPeerConnection, and each peer connection can have up to a theoretical maximum of 65,534 data channels (the actual limit may vary from browser to browser).

### Events

| name                                                                                     | description                          |
| ---------------------------------------------------------------------------------------- | ------------------------------------ |
| [message](https://developer.mozilla.org/en-US/docs/Web/API/RTCDataChannel/message_event) | Fires when message has been received |

## Steps

-   [ ] Connect to signaling
-   [ ] Implement send to signaling function
-   [ ] Create RTC peer connection instance
-   [ ] Connection state change listener
-   [ ] Define peer id
-   [ ] Listen for ICE candidates
-   [ ] Listen for negotiation needed
-   [ ] Handle signaling messages
-   [ ] Define RTC data channel
-   [ ] Implement send function
-   [ ] Listen for tracks event
-   [ ] Implement stream function

## TODO

-   [ ] shortcuts
