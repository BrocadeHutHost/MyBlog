using System.Collections.Generic;
using System.Linq;
using System.Windows.Input;
using MyBlog.Data;
using MyBlog.Models;

namespace MyBlog.ViewModels;

/// <summary>
/// 关于页：目录结构与参考站首页完全对应——
/// 关于作者（作者简介 / 联系作者）、关于本站（使用指南 / 制作方法 / 更新日志）。
/// </summary>
public sealed class AboutPageViewModel : PageViewModelBase
{
    private static readonly string[] AuthorAnchors = { "about-me", "about-contact" };
    private static readonly string[] SiteAnchors = { "about-guide", "about-make", "about-log" };

    public AboutPageViewModel(ICommand jump)
    {
        AllSections = BlogContent.AboutSections;
        AuthorSections = AllSections.Where(s => AuthorAnchors.Contains(s.Anchor)).ToList();
        SiteSections = AllSections.Where(s => SiteAnchors.Contains(s.Anchor)).ToList();

        Toc = new List<TocItemViewModel>
        {
            new()
            {
                Title = "关于作者",
                Anchor = "about-author",
                Jump = jump,
                Children = AuthorSections
                    .Select(s => new TocItemViewModel { Title = s.Title, Anchor = s.Anchor, Jump = jump })
                    .ToList()
            },
            new()
            {
                Title = "关于本站",
                Anchor = "about-site",
                Jump = jump,
                Children = SiteSections
                    .Select(s => new TocItemViewModel { Title = s.Title, Anchor = s.Anchor, Jump = jump })
                    .ToList()
            }
        };
    }

    public override string Title => "关于";

    public override IReadOnlyList<TocItemViewModel> Toc { get; }

    public IReadOnlyList<ArticleSection> AllSections { get; }

    /// <summary>「关于作者」分组下的小节。</summary>
    public IReadOnlyList<ArticleSection> AuthorSections { get; }

    /// <summary>「关于本站」分组下的小节。</summary>
    public IReadOnlyList<ArticleSection> SiteSections { get; }
}
