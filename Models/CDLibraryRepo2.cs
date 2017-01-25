using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.Entity;


namespace CD_Library.Models
{
    public class CDLibraryRepo2 : IDisposable, ICDLibraryRepo
    {

        // DB context
        private CDLibraryDBEntities db = new CDLibraryDBEntities();

        private static IList<CD> CDs = new List<CD>();
        /*
        {
            new CD()
            {
                title="hi",
                barcode=1223,
                catno="cno123",
                year=1999,
                Labels = new List<Label>()
                    {
                        new Label(){
                                barcode=1223,
                                label ="test label - 1",
                             },
                        new Label(){
                                barcode=1223,
                                label ="test label - 2",
                             }
                }                
            }
        };*/

        // get all CDs in library
        public IEnumerable<CD> GetLibrary()
        {
            return CDs;
        }

        // add a CD to DB
        public Result AddCD(CD cd)
        {
            Result result = new Result();

            try
            {
                    db.CDs.Add(cd);
                    db.SaveChanges();
                    result.msg = "CD added to database.";
            }
            catch(DataException e)
            {
                result.ok = false;
                result.msg = e.Message;
            }

            return result;

        }

        // delete CD from DB
        public Result DelCD(string barcode)
        {
            Result result = new Result();

            try
            {
                CD cd = this.GetCD(barcode);

                if(cd == null)
                {
                    result.ok = false;
                    result.msg = String.Format("CD not found with barcode : {1}", barcode);
                }
                else
                {
                    db.CDs.Remove(cd);
                    db.SaveChanges();
                    result.msg = "CD deleted from database.";
                }

            }
            catch (DataException e)
            {
                result.ok = false;
                result.msg = e.Message;
            }

            return result;
        }

        // get CD from DB
        public CD GetCD(string barcode)
        {
            return db.CDs.FirstOrDefault(cd => cd.barcode == barcode);
        }

        // update a CD in the DB
        public Result UpdCD(CD cd)
        {
            Result result = new Result();

            try
            {
                db.Entry(cd).State = EntityState.Modified;
                db.SaveChanges();
                result.msg = "CD updated in database.";
            }
            catch (DataException e)
            {
                result.ok = false;
                result.msg = e.Message;
            }

            return result;

        }

        // DB dispose methods
        protected void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (db != null)
                {
                    db.Dispose();
                    db = null;
                }
            }
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }


    }
}