using System.Web;
using System.Web.Mvc;

namespace WebRTC.Controllers
{
    using System.Net;
    using System.Net.Http;
    using System.Web.Http;

    using WebRTC.Handlers;

    public class HomeController : Controller
    {
        //
        // GET: /Home/

        public ActionResult Index()
        {
            return View();
        }
    }
}
