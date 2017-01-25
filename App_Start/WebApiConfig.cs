using System;
using System.Linq;
using System.Web.Http;
using CD_Library.Models;
using Microsoft.Practices.Unity;

namespace CD_Library
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services


            // Configure Web API to use only bearer token authentication.
            //config.SuppressDefaultHostAuthentication(); // No authentication required!
            //config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType)); // No authentication required!

            // Dependency Injection with Unity
            var container = new UnityContainer();
            container.RegisterType<ICDLibraryRepo, CDLibraryRepo>(new HierarchicalLifetimeManager());
            config.DependencyResolver = new CD_Library.Resolver.UnityResolver(container);

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            // force JSON output by removing XML MIME
            var appXmlType = config.Formatters.XmlFormatter.SupportedMediaTypes.FirstOrDefault(t => t.MediaType == "application/xml");
            config.Formatters.XmlFormatter.SupportedMediaTypes.Remove(appXmlType);

            // ensure JSON ignores loop reference and doesn't serialize
            config.Formatters.JsonFormatter.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
        }

    }
}
