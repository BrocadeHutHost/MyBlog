using System.Collections.Generic;

namespace MyBlog.Models;

/// <summary>
/// 一篇文章。Sections 是正文小节，左侧目录与页内锚点都由它生成，
/// 层级上对应参考站「一个页面 → 若干带锚点的小节」。
/// </summary>
public sealed class Article
{
    /// <summary>URL 友好的标识，同时用于锚点（post-{Id}）。</summary>
    public string Id { get; init; } = "";

    public string Title { get; init; } = "";

    public string Excerpt { get; init; } = "";

    public string Category { get; init; } = "";

    public IReadOnlyList<string> Tags { get; init; } = new List<string>();

    public string Date { get; init; } = "";

    public int ReadMinutes { get; init; }

    /// <summary>正文尚未写完（对应参考站的 To Be Done 标记）。</summary>
    public bool IsTodo { get; init; }

    public IReadOnlyList<ArticleSection> Sections { get; init; } = new List<ArticleSection>();

    /// <summary>列表页按年份分组用。</summary>
    public string Year => Date.Length >= 4 ? Date[..4] : "";
}
