using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using MyBlog.Data;
using MyBlog.Models;

namespace MyBlog.ViewModels;

/// <summary>
/// 站点外壳：顶栏栏目 + 当前页 + 该页的左侧目录。
/// 层级关系对照参考站 https://archaeus13.github.io/index.html：
/// 顶栏切换栏目，左侧目录在栏目页内跳转小节。
/// </summary>
public partial class MainViewModel : ViewModelBase
{
    /// <summary>请求滚动到某个锚点；null 或空串表示回到页面顶部。</summary>
    public event Action<string?>? JumpRequested;

    private readonly Dictionary<string, PageViewModelBase> _pageCache = new();
    private readonly Dictionary<string, PostPageViewModel> _postCache = new();

    public MainViewModel()
    {
        foreach (var nav in BlogContent.Nav)
        {
            NavItems.Add(new NavItemViewModel(nav, SelectNavCommand));
        }

        SelectNav(NavItems[0]);
    }

    [ObservableProperty]
    private PageViewModelBase? _currentPage;

    [ObservableProperty]
    private string _siteName = BlogContent.SiteName;

    /// <summary>顶栏的 5 个栏目。</summary>
    public ObservableCollection<NavItemViewModel> NavItems { get; } = new();

    /// <summary>当前页面的左侧目录。</summary>
    public ObservableCollection<TocItemViewModel> Toc { get; } = new();

    /// <summary>顶栏切换栏目。</summary>
    [RelayCommand]
    private void SelectNav(NavItemViewModel? item)
    {
        if (item is null)
        {
            return;
        }

        foreach (var nav in NavItems)
        {
            nav.IsSelected = ReferenceEquals(nav, item);
        }

        CurrentPage = GetPage(item.Key);
        JumpRequested?.Invoke(null);
    }

    /// <summary>点开一篇文章（详情页归在「文章」栏目下）。</summary>
    [RelayCommand]
    private void OpenArticle(Article? article)
    {
        if (article is null)
        {
            return;
        }

        foreach (var nav in NavItems)
        {
            nav.IsSelected = nav.Key == "archive";
        }

        CurrentPage = GetPostPage(article);
        JumpRequested?.Invoke(null);
    }

    /// <summary>左侧目录点击：滚到对应小节。</summary>
    [RelayCommand]
    private void JumpTo(string? anchor) => JumpRequested?.Invoke(anchor);

    partial void OnCurrentPageChanged(PageViewModelBase? value)
    {
        Toc.Clear();
        if (value is null)
        {
            return;
        }

        foreach (var node in value.Toc)
        {
            Toc.Add(node);
        }
    }

    private PageViewModelBase GetPage(string key)
    {
        if (_pageCache.TryGetValue(key, out var cached))
        {
            return cached;
        }

        PageViewModelBase page = key switch
        {
            "archive" => new ArchivePageViewModel(OpenArticleCommand, JumpToCommand),
            "categories" => new CategoriesPageViewModel(OpenArticleCommand, JumpToCommand),
            "tags" => new TagsPageViewModel(OpenArticleCommand, JumpToCommand),
            "about" => new AboutPageViewModel(JumpToCommand),
            _ => new HomePageViewModel(OpenArticleCommand, JumpToCommand)
        };

        _pageCache[key] = page;
        return page;
    }

    private PostPageViewModel GetPostPage(Article article)
    {
        if (!_postCache.TryGetValue(article.Id, out var page))
        {
            page = new PostPageViewModel(article, JumpToCommand);
            _postCache[article.Id] = page;
        }

        return page;
    }
}
