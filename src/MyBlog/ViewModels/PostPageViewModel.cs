using System.Collections.Generic;
using System.Linq;
using System.Windows.Input;
using MyBlog.Models;

namespace MyBlog.ViewModels;

/// <summary>
/// 文章详情页：左侧目录直接由这篇文章的小节生成，
/// 也就是参考站「页面左侧目录 = 页面内小节」的那一层。
/// </summary>
public sealed class PostPageViewModel : PageViewModelBase
{
    public PostPageViewModel(Article article, ICommand jump)
    {
        Article = article;
        Toc = article.Sections
            .Select(s => new TocItemViewModel { Title = s.Title, Anchor = s.Anchor, Jump = jump })
            .ToList();
    }

    public Article Article { get; }

    public override string Title => Article.Title;

    public override IReadOnlyList<TocItemViewModel> Toc { get; }

    public IReadOnlyList<ArticleSection> Sections => Article.Sections;

    public string TagsText => string.Join(" · ", Article.Tags);
}
