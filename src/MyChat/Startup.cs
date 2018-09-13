using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.StaticFiles;

namespace MyChat
{
    public class Startup
    {
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
             
            // services.AddCors(options=>{
            //     options.AddPolicy("SignalrCore",policy=>{
            //         policy.AllowAnyOrigin();
            //         policy.AllowAnyHeader();
            //         policy.AllowAnyMethod();
            //     });
            // });

            services.AddScoped(typeof(RedisStore));
            services.AddMvc();
            services.AddSignalR();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            var provider = new FileExtensionContentTypeProvider();
            provider.Mappings[".mkv"]="video/x-matroska";
            

            app.UseStaticFiles(new StaticFileOptions{ContentTypeProvider=provider});

            app.UseSignalR(routes=>{
                routes.MapHub<ChatHub>("/chathub");
            });
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });

        }
    }
}