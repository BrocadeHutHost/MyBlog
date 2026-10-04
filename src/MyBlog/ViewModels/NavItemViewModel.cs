using System.Windows.Input;
using CommunityToolkit.Mvvm.ComponentModel;
using MyBlog.Models;

namespace MyBlog.ViewModels;

/// <summary>顶栏的一个栏目。按钮的选中样式由 IsSelected 驱动。</summary>
public partial class NavItemViewModel : ObservableObject
{
    public NavItemViewModel(NavItem item, ICommand select)
    {
        Key = item.Key;
        Title = item.Title;
        Select = select;
    }

    public string Key { get; }

    public string Title { get; }

    public ICommand Select { get; }

    [ObservableProperty]
    private bool _isSelected;
}
