using Avalonia.Controls;

namespace MyBlog.Behaviors;

/// <summary>
/// 页内锚点约定：把锚点标识写在控件的 Tag 上（XAML 里写 Tag="home-latest"）。
/// 左侧目录点击后，MainView 在可视树里按这个标识找到目标控件再滚过去。
/// 之所以用 Tag 而不是自定义附加属性，是因为它足够直白，也不依赖额外的属性注册。
/// </summary>
public static class Anchor
{
    public static string? GetId(Control control) => control.Tag as string;
}
