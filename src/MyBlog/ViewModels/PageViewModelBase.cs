using System.Collections.Generic;
using MyBlog.Data;

namespace MyBlog.ViewModels;

/// <summary>
/// 顶栏里的一个栏目页 = 一份内容 + 一份自己的两级目录。
/// 命名约定 XXXPageViewModel → XXXPageView（见 ViewLocator）。
/// </summary>
public abstract class PageViewModelBase : ViewModelBase
{
    /// <summary>栏目名，显示在左侧目录面板顶部。</summary>
    public abstract string Title { get; }

    /// <summary>本页左侧目录。</summary>
    public abstract IReadOnlyList<TocItemViewModel> Toc { get; }

    /// <summary>页脚文案，所有页面共用。</summary>
    public string Footer => BlogContent.Footer;
}
