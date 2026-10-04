using System.Collections.Generic;

namespace MyBlog.Models;

/// <summary>标签及其下的文章（标签页的分组）。</summary>
public sealed class TagGroup
{
    /// <summary>锚点用标识（ASCII）。</summary>
    public string Key { get; init; } = "";

    public string Name { get; init; } = "";

    public IReadOnlyList<Article> Articles { get; init; } = new List<Article>();

    public int Count => Articles.Count;
}
