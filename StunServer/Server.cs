using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StunServer
{
    using System.Net;
    using System.Net.Sockets;

    class Server
    {
        private const int Port = 3478;

        public Server()
        {
            byte[] data = new byte[1024];
            IPEndPoint localEndPoint = new IPEndPoint(IPAddress.Any, Port);
            IPEndPoint remoteEndPoint = new IPEndPoint(IPAddress.Any, 0);

            UdpClient client = new UdpClient(localEndPoint);

            while (true)
            {
                data = client.Receive(ref remoteEndPoint);

                Console.WriteLine(Encoding.ASCII.GetString(data, 0, data.Length));
                client.Send(data, data.Length, remoteEndPoint);
            }
        }
    }
}
