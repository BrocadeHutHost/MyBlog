using System.Collections.Generic;
using System.Linq;
using System.Windows.Input;
using MyBlog.Data;

namespace MyBlog.ViewModels;

/// <summary>分类页：按分类分组列出文章。左侧目录第一级是「全部分类」，第二级是各个分类。</summary>
public sealed class CategoriesPageViewModel : PageViewModelBase
{
    public CategoriesPageViewModel(ICommand openArticle, ICommand jump)
    {
        Groups = BlogContent.Categories
            .Select(c => new CardGroupViewModel
            {
                Title = c.Name,
                Anchor = "cat-" + c.Key,
                Cards = c.Articles
                    .Select(a => new ArticleCardViewModel(a, openArticle, "cat-" + c.Key + "-" + a.Id))
                    .ToList()
            })
            .ToList();

        Toc = new List<TocItemViewModel>
        {
            new()
            {
                Title = "全部分类",
                Anchor = "cat-all",
                Jump = jump,
                Children = Groups
                    .Select(g => new TocItemViewModel
                    {
                        Title = g.Title + "（" + g.Count + "）",
                        Anchor = g.Anchor,
                        Jump = jump
                    })
                    .ToList()
            }
        };
    }

    public override string Title => "分类";

    public override IReadOnlyList<TocItemViewModel> Toc { get; }

    public IReadOnlyList<CardGroupViewModel> Groups { get; }

    public int Total => Groups.Sum(g => g.Count);
}
