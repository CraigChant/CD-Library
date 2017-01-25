using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.Entity;
using System.Diagnostics;

namespace CD_Library.Models
{
    public class CDLibraryRepo : IDisposable, ICDLibraryRepo
    {

        // DB context
        private CDLibraryDBEntities db = new CDLibraryDBEntities();

        // get all CDs in library
        public IEnumerable<CD> GetLibrary()
        {
            return db.CDs;
        }

        // add a CD to DB
        public Result AddCD(CD cd)
        {
            Result result = new Result();
            foreach (Label lb in cd.Labels)
            {
                Debug.WriteLine(lb.label);
                Debug.WriteLine(lb.barcode);
                Debug.WriteLine(lb.CD);
            }
            try
            {
                    db.CDs.Add(cd);
                    db.SaveChanges();
                    result.msg = "CD added to database.";
            }
            catch(DataException e)
            {
                result.ok = false;
                result.msg = e.InnerException.ToString();
            }

            return result;

        }

        // delete CD from DB
        public Result DelCD(string barcode)
        {
            Result result = new Result();

            try
            {

                // check length of barcode
                if (barcode.Length > 15)
                {
                    throw new DataException("Invalid barcode.");
                }
                else
                {

                    CD cd = this.GetCD(barcode);

                    if (cd == null)
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