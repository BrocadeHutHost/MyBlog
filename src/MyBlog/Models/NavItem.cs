namespace MyBlog.Models;

/// <summary>顶部导航栏的一个栏目（对应参考站顶栏的并列页面）。</summary>
public sealed class NavItem
{
    public string Key { get; init; } = "";

    public string Title { get; init; } = "";
}
