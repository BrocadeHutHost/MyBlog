using System;
using Avalonia;
using Avalonia.Controls;
using Avalonia.Threading;
using Avalonia.VisualTree;
using MyBlog.Behaviors;
using MyBlog.ViewModels;

namespace MyBlog.Views;

public partial class MainView : UserControl
{
    private MainViewModel? _viewModel;

    public MainView()
    {
        InitializeComponent();
    }

    protected override void OnDataContextChanged(EventArgs e)
    {
        base.OnDataContextChanged(e);

        if (_viewModel is not null)
        {
            _viewModel.JumpRequested -= OnJumpRequested;
        }

        _viewModel = DataContext as MainViewModel;

        if (_viewModel is not null)
        {
            _viewModel.JumpRequested += OnJumpRequested;
        }
    }

    private void OnJumpRequested(string? anchor)
    {
        // 等这一轮布局跑完再定位：切换页面时目标控件可能还没量好尺寸。
        Dispatcher.UIThread.Post(() => ScrollTo(anchor), DispatcherPriority.Background);
    }

    private void ScrollTo(string? anchor)
    {
        var scroller = this.FindControl<ScrollViewer>("ContentScroller");
        if (scroller is null)
        {
            return;
        }

        if (string.IsNullOrWhiteSpace(anchor))
        {
            scroller.Offset = new Vector(0, 0);
            return;
        }

        var target = FindByAnchor(this, anchor);
        if (target is null)
        {
            return;
        }

        var point = target.TranslatePoint(new Point(0, 0), scroller);
        if (point is null)
        {
            return;
        }

        var y = scroller.Offset.Y + point.Value.Y - 12;
        scroller.Offset = new Vector(scroller.Offset.X, Math.Max(0, y));
    }

    /// <summary>按锚点标识在可视树里找目标控件（锚点由 bh:Anchor.Id 挂在控件上）。</summary>
    private static Control? FindByAnchor(Visual root, string anchor)
    {
        if (root is Control control &&
            string.Equals(Anchor.GetId(control), anchor, StringComparison.Ordinal))
        {
            return control;
        }

        foreach (var child in root.GetVisualChildren())
        {
            var found = FindByAnchor(child, anchor);
            if (found is not null)
            {
                return found;
            }
        }

        return null;
    }
}
