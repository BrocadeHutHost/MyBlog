using System.Collections.Generic;
using System.Linq;
using System.Windows.Input;
using MyBlog.Data;

namespace MyBlog.ViewModels;

/// <summary>标签云里的一枚标签。</summary>
public sealed class TagChipViewModel
{
    public string Name { get; init; } = "";

    public int Count { get; init; }

    /// <summary>点击后跳到「按标签浏览」里对应的分组。</summary>
    public string Anchor { get; init; } = "";

    public ICommand? Jump { get; init; }
}

/// <summary>标签页：标签云 + 按标签分组的文章。</summary>
public sealed class TagsPageViewModel : PageViewModelBase
{
    public TagsPageViewModel(ICommand openArticle, ICommand jump)
    {
        Chips = BlogContent.Tags
            .Select(t => new TagChipViewModel
            {
                Name = t.Name,
                Count = t.Count,
                Anchor = "tag-" + t.Key,
                Jump = jump
            })
            .ToList();

        Groups = BlogContent.Tags
            .Select(t => new CardGroupViewModel
            {
                Title = t.Name,
                Anchor = "tag-" + t.Key,
                Cards = t.Articles
                    .Select(a => new ArticleCardViewModel(a, openArticle, "tag-" + t.Key + "-" + a.Id))
                    .ToList()
            })
            .ToList();

        Toc = new List<TocItemViewModel>
        {
            new() { Title = "标签云", Anchor = "tag-cloud", Jump = jump },
            new()
            {
                Title = "按标签浏览",
                Anchor = "tag-browse",
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

    public override string Title => "标签";

    public override IReadOnlyList<TocItemViewModel> Toc { get; }

    public IReadOnlyList<TagChipViewModel> Chips { get; }

    public IReadOnlyList<CardGroupViewModel> Groups { get; }
}
