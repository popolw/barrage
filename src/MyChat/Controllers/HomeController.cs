using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace MyChat.Controllers
{
    public class HomeController:Controller
    {
        private RedisStore _store;
        public HomeController(RedisStore store)
        {
            this._store=store;
        }
        
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Get()
        {
            var array = this._store.Get();
            return Json(array);
        }
    }
}