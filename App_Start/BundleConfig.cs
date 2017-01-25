﻿using System.Web;
using System.Web.Optimization;

namespace CD_Library
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js",
                        "~/Scripts/jquery-ui.js",
                         "~/Scripts/jquery.dataTables.min.js",
                         "~/Scripts/jquery.dataTables.select.min.js",
                         "~/Scripts/jquery.qtip.min.js",
                         "~/Scripts/ColReorderWithResize.js",
                         "~/Scripts/selectize.js"));

            bundles.Add(new ScriptBundle("~/bundles/site").Include(
                         "~/Scripts/CD_Library_Obj.js",
                         "~/Scripts/CD_Library_GUI.js",
                         "~/Scripts/CD_Library_Helper.js"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(                      
                      "~/Scripts/respond.js",
                      "~/Scripts/bootstrap.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/selectize.css",
                      "~/Content/bootstrap.css",                      
                      "~/Content/jquery-ui.css",
                      "~/Content/data_tables.css",
                      "~/Content/select.dataTables.min.css",
                      "~/Content/jquery.qtip.css",                      
                      "~/Content/site.css"));
        }
    }
}
