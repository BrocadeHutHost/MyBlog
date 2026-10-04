using System.Runtime.Versioning;
using System.Threading.Tasks;
using Avalonia;
using Avalonia.Browser;
using MyBlog;

[assembly: SupportedOSPlatform("browser")]

internal sealed partial class Program
{
    // Avalonia 12 的 Browser 入口：Configure -> WithInterFont -> StartBrowserAppAsync("out")
    // "out" 对应 wwwroot/index.html 中承载画布的 <div id="out">
    private static Task Main(string[] args) => BuildAvaloniaApp()
        .WithInterFont()
        .StartBrowserAppAsync("out");

    public static AppBuilder BuildAvaloniaApp()
        => AppBuilder.Configure<App>();
}
