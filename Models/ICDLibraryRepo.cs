using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CD_Library.Models
{
    public interface ICDLibraryRepo
    {
        IEnumerable<CD> GetLibrary();
        Result AddCD(CD cd);
        Result DelCD(string barcode);
        CD GetCD(string barcode);
        Result UpdCD(CD cd);
    }
}
