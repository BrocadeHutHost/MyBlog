using System.Collections.Generic;

namespace MyBlog.ViewModels;

/// <summary>页面上的一组文章卡片（按年份 / 分类 / 标签分组）。</summary>
public sealed class CardGroupViewModel
{
    public string Title { get; init; } = "";

    /// <summary>分组容器的锚点。</summary>
    public string Anchor { get; init; } = "";

    public IReadOnlyList<ArticleCardViewModel> Cards { get; init; } = new List<ArticleCardViewModel>();

    public int Count => Cards.Count;
}
