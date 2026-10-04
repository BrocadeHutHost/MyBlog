using System.Collections.Generic;
using System.Windows.Input;

namespace MyBlog.ViewModels;

/// <summary>
/// 左侧目录的一项（两级：目录 → 小节），对应参考站页面左侧的目录。
/// </summary>
public sealed class TocItemViewModel
{
    public string Title { get; init; } = "";

    /// <summary>目标锚点；点击后由外壳滚动到页内对应小节。</summary>
    public string Anchor { get; init; } = "";

    public IReadOnlyList<TocItemViewModel> Children { get; init; } = new List<TocItemViewModel>();

    public ICommand? Jump { get; init; }

    public bool HasChildren => Children.Count > 0;
}
