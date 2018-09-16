using System;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;

namespace MyChat
{
    class Program
    {
        static void Main(string[] args)
        {
            BuildWebHost(args).Run();
        }

         public static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>()
                .UseKestrel()
                .UseUrls("http://0.0.0.0:9090")
                //.UseUrls("http://192.168.0.101:9090")
                .Build();
        
    }
}
