//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace CD_Library.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class Label
    {
        public string barcode { get; set; }
        public string label { get; set; }
    
        public virtual CD CD { get; set; }
    }
}
