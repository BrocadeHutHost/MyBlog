using System.Collections.Generic;

namespace MyBlog.Models;

/// <summary>分类及其下的文章（分类页的分组）。</summary>
public sealed class CategoryGroup
{
    /// <summary>锚点用标识（ASCII）。</summary>
    public string Key { get; init; } = "";

    public string Name { get; init; } = "";

    public IReadOnlyList<Article> Articles { get; init; } = new List<Article>();

    public int Count => Articles.Count;
}
