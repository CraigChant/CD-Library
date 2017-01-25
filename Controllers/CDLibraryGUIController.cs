using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CD_Library.Controllers
{
    public class CDLibraryGUIController : Controller
    {
        // GET: CDLibraryGUI
        public ActionResult Index()
        {
            ViewBag.Title = "CD Library";
            return View();
        }
    }
}

