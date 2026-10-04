using System.Collections.Generic;
using System.Linq;
using System.Windows.Input;
using MyBlog.Data;

namespace MyBlog.ViewModels;

/// <summary>
/// 文章页：按年份归档的全部文章。
/// 左侧目录的第一级是年份，第二级是该年的每一篇。
/// </summary>
public sealed class ArchivePageViewModel : PageViewModelBase
{
    public ArchivePageViewModel(ICommand openArticle, ICommand jump)
    {
        Years = BlogContent.Articles
            .GroupBy(a => a.Year)
            .OrderByDescending(g => g.Key)
            .Select(g => new CardGroupViewModel
            {
                Title = g.Key + " 年",
                Anchor = "year-" + g.Key,
                Cards = g.Select(a => new ArticleCardViewModel(a, openArticle, "archive-" + a.Id)).ToList()
            })
            .ToList();

        var toc = Years
            .Select(y => new TocItemViewModel
            {
                Title = y.Title,
                Anchor = y.Anchor,
                Jump = jump,
                Children = y.Cards
                    .Select(c => new TocItemViewModel { Title = c.Title, Anchor = c.Anchor, Jump = jump })
                    .ToList()
            })
            .ToList();

        toc.Add(new TocItemViewModel { Title = "归档说明", Anchor = "archive-note", Jump = jump });

        Toc = toc;
    }

    public override string Title => "文章";

    public override IReadOnlyList<TocItemViewModel> Toc { get; }

    public IReadOnlyList<CardGroupViewModel> Years { get; }
}
