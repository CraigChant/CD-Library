using System;
using System.Collections.Generic;
using System.Web.Http;
using CD_Library.Models;

namespace CD_Library.Controllers
{
    public class CDLibraryAPIController : ApiController
    {
        // CD Library repository
        private ICDLibraryRepo _repository;

        // Dependency Injection constructor
        public CDLibraryAPIController(ICDLibraryRepo repository) { _repository = repository; }

        // REST API

        // GET : Get CD Library
        [HttpGet]
        public IEnumerable<CD> Get() {
            return _repository.GetLibrary();
        }

        // DELETE : Remove a CD from the DB
        [HttpDelete]
        public IHttpActionResult Delete(string id) {

            // try delete
            Result result = result = _repository.DelCD(id);

            if (result.ok)
            {
                return Ok(result.msg); // 200 OK
            }
            else
            {
                return BadRequest(result.msg); // 400 error
            }

        }

        // POST : Add a CD to the DB
        [HttpPost]
        public IHttpActionResult Post([FromBody] CD cd)
        {

            // try insert
            Result result = _repository.AddCD(cd);

            if (result.ok)
            {
                return Ok(result.msg); // 200 OK
            }
            else
            {
                return BadRequest(result.msg); // 400 error
            }

        }

        // PUT : Update a CD in the DB
        [HttpPut]
        public IHttpActionResult Put([FromBody] CD cd)
        {

            // try update
            Result result = _repository.UpdCD(cd);

            if (result.ok)
            {
                return Ok(result.msg); // 200 OK
            }
            else
            {
                return BadRequest(result.msg); // 400 error
            }

        }

    }
}
