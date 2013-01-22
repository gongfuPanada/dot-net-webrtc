namespace WebRTC.Controllers
{
    using System.Net;
    using System.Net.Http;
    using System.Web;
    using System.Web.Http;

    using Microsoft.Web.WebSockets;

    using WebRTC.Handlers;

    public class SignalController : ApiController
    {
        [HttpGet]
        public HttpResponseMessage Connect()
        {
            // Create a handler.
            var handler = new WebRtcWebSocketHandler();

            // Hand off the websocket request to the handler.
            HttpContext.Current.AcceptWebSocketRequest(handler);

            // Switch to websockets.
            return new HttpResponseMessage(HttpStatusCode.SwitchingProtocols);
        }
    }
}