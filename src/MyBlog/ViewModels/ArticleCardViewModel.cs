using System.Windows.Input;
using MyBlog.Models;

namespace MyBlog.ViewModels;

/// <summary>文章卡片（首页 / 归档 / 分类 / 标签页共用同一份模板）。</summary>
public sealed class ArticleCardViewModel
{
    public ArticleCardViewModel(Article article, ICommand open, string anchor)
    {
        Article = article;
        Open = open;
        Anchor = anchor;
    }

    public Article Article { get; }

    public ICommand Open { get; }

    /// <summary>卡片容器的锚点，供左侧目录直接跳到某篇。</summary>
    public string Anchor { get; }

    public string Title => Article.Title;

    public string Excerpt => Article.Excerpt;

    public string Category => Article.Category;

    public string Date => Article.Date;

    public int ReadMinutes => Article.ReadMinutes;

    public bool IsTodo => Article.IsTodo;
}
