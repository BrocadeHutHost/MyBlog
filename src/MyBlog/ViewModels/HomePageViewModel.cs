using System.Collections.Generic;
using System.Linq;
using System.Windows.Input;
using MyBlog.Data;
using MyBlog.Models;

namespace MyBlog.ViewModels;

/// <summary>
/// 首页：站点介绍 + 最新文章。
/// 左侧目录（最新文章 / 关于本站）与参考站首页的目录结构一致。
/// </summary>
public sealed class HomePageViewModel : PageViewModelBase
{
    public HomePageViewModel(ICommand openArticle, ICommand jump)
    {
        Latest = BlogContent.Articles
            .Take(3)
            .Select(a => new ArticleCardViewModel(a, openArticle, "post-" + a.Id))
            .ToList();

        Sections = BlogContent.HomeSections;

        Toc = new List<TocItemViewModel>
        {
            new()
            {
                Title = "最新文章",
                Anchor = "home-latest",
                Jump = jump,
                Children = Latest
                    .Select(c => new TocItemViewModel { Title = c.Title, Anchor = c.Anchor, Jump = jump })
                    .ToList()
            },
            new()
            {
                Title = "关于本站",
                Anchor = "home-about",
                Jump = jump,
                Children = Sections
                    .Select(s => new TocItemViewModel { Title = s.Title, Anchor = s.Anchor, Jump = jump })
                    .ToList()
            }
        };
    }

    public override string Title => "首页";

    public override IReadOnlyList<TocItemViewModel> Toc { get; }

    /// <summary>最新文章卡片（第一篇是《Hello World》）。</summary>
    public IReadOnlyList<ArticleCardViewModel> Latest { get; }

    public IReadOnlyList<ArticleSection> Sections { get; }

    public string SiteName => BlogContent.SiteName;

    public string Greeting => BlogContent.Greeting;

    public string Tagline => BlogContent.Tagline;

    public string Bio => BlogContent.Bio;

    public int ArticleCount => BlogContent.Articles.Count;
}
