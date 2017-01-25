using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CD_Library.Models
{
    public class Result
    {
        public bool ok { get; set; }
        public string msg { get; set; }   
        
        public Result()
        {
            ok = true;
            msg = "";
        }
    }
}