using Avalonia.Controls;
using Avalonia.Controls.Templates;
using MyBlog.ViewModels;
using MyBlog.Views;

namespace MyBlog;

/// <summary>
/// 把栏目页 ViewModel 映射到对应视图，命名约定是 XXXPageViewModel → XXXPageView。
/// 这里用显式映射而不是反射：一是 WASM 发布默认开启裁剪，反射查找容易被裁掉；
/// 二是显式映射出错时编译期就能发现。
/// </summary>
public class ViewLocator : IDataTemplate
{
    public Control? Build(object? param) => param switch
    {
        HomePageViewModel => new HomePageView(),
        ArchivePageViewModel => new ArchivePageView(),
        PostPageViewModel => new PostPageView(),
        CategoriesPageViewModel => new CategoriesPageView(),
        TagsPageViewModel => new TagsPageView(),
        AboutPageViewModel => new AboutPageView(),
        _ => new TextBlock { Text = "未找到视图：" + param?.GetType().Name }
    };

    public bool Match(object? data) => data is PageViewModelBase;
}
