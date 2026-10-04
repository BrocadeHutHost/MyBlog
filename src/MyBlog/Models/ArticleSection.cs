using System.Collections.Generic;

namespace MyBlog.Models;

/// <summary>
/// 正文里的一个小节：一个标题 + 若干段落 / 列表 / 代码块。
/// 参考站每个页面左侧的目录，就是这些小节的两级层级。
/// </summary>
public sealed class ArticleSection
{
    /// <summary>页内锚点标识（ASCII，供左侧目录跳转）。</summary>
    public string Anchor { get; init; } = "";

    public string Title { get; init; } = "";

    public IReadOnlyList<string> Paragraphs { get; init; } = new List<string>();

    public IReadOnlyList<string> Bullets { get; init; } = new List<string>();

    public string? CodeLanguage { get; init; }

    public string? Code { get; init; }

    /// <summary>本节内容待补充。</summary>
    public bool IsTodo { get; init; }

    public bool HasBullets => Bullets.Count > 0;

    public bool HasCode => !string.IsNullOrWhiteSpace(Code);

    public bool HasCodeLanguage => !string.IsNullOrWhiteSpace(CodeLanguage);
}
