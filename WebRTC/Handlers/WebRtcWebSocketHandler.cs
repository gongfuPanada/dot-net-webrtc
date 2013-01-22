namespace WebRTC.Handlers
{
    using System;
    using System.Collections.Generic;
    using System.Web.Helpers;
    using System.Linq;

    using Microsoft.Web.WebSockets;

    /// <summary>
    /// Implements WebRTC signalling using web sockets.
    /// </summary>
    public class WebRtcWebSocketHandler : WebSocketHandler
    {
        /// <summary>
        /// The current web socket sessions.
        /// </summary>
        private static WebSocketCollection sessions = new WebSocketCollection();

        public String PeerId{ get; set; }

        /// <summary>
        /// New web socket connection.
        /// </summary>
        public override void OnOpen()
        {
            // Assign an ID
            this.PeerId = Guid.NewGuid().ToString("N");

            // Send join message.
            SendToAll(this.PeerId, SignalMessageType.Join, string.Empty);
            
            // Add this peer to the peer collection.
            sessions.Add(this);
        }

        protected void SendToAll(string fromPeerId, SignalMessageType messageType, string description)
        {
            // Tell all the other connected peers about this.
            var message = new { type = messageType, peerId = fromPeerId, description = description };
            sessions.Broadcast(Json.Encode(message));
        }

        protected void SendToPeer(string toPeerId, string fromPeerId, SignalMessageType messageType, string description)
        {
            WebRtcWebSocketHandler peer = sessions.Cast<WebRtcWebSocketHandler>().FirstOrDefault(wsh => wsh.PeerId == toPeerId);

            if (peer == null)
            {
                throw new Exception("Peer not found");
            }

            var message = new { type = messageType, peerId = fromPeerId, description = description };
            peer.Send(Json.Encode(message));
        }

        public override void OnMessage(string message)
        {
            var obj = Json.Decode(message);

            var messageType = (SignalMessageType)obj.type;
            string description = obj.description;
            string toPeerId = obj.peerId;

            switch (messageType)
            {
                case SignalMessageType.Offer:
                case SignalMessageType.Answer:
                case SignalMessageType.Candidate:
                    this.SendToPeer(toPeerId, this.PeerId, messageType, description);
                    break;
            }
        }
    }

    public enum SignalMessageType
    {
        Join,
        Leave,
        Offer,
        Answer,
        Candidate
    }
}