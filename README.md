# MyBlog

一个用 Avalonia 写的个人博客，编译成 WebAssembly 后作为纯静态站点部署在 GitHub Pages 上。

站点的层级关系参考 [archaeus13.github.io](https://archaeus13.github.io/index.html)：

- **顶部导航栏**：5 个并列栏目，切换栏目 = 换页面；
- **左侧目录**：两级（目录 → 小节），小节带锚点，点击跳转到本页对应位置；
- **正文小节**：每个栏目页 / 文章页的正文由若干小节组成，左侧目录就是它们的投影。

## 栏目与目录

| 顶栏栏目 | 页面内容 | 左侧目录（两级） |
| --- | --- | --- |
| 首页 | 站点介绍 + 最新文章 | 最新文章（→ 每篇文章）、关于本站（→ 本站做什么 / 怎么读） |
| 文章 | 按年份归档的全部文章 | 年份（→ 该年每一篇）、归档说明 |
| 分类 | 按分类分组的文章 | 全部分类（→ 每个分类） |
| 标签 | 标签云 + 按标签分组 | 标签云、按标签浏览（→ 每个标签） |
| 关于 | 作者与站点说明 | 关于作者（作者简介 / 联系作者）、关于本站（使用指南 / 制作方法 / 更新日志） |

第一篇文章是 **《Hello World》**（`src/MyBlog/Data/BlogContent.cs` 里 `Articles` 的第一项）。

## 目录结构

```
src/
  MyBlog/                      界面与内容（Avalonia 类库）
    App.axaml                  配色、样式，以及共用的两个 DataTemplate：
                               ArticleSection（正文小节）与 ArticleCardViewModel（文章卡片）
    Behaviors/Anchor.cs        页内锚点约定：锚点写在控件的 Tag 上
    Data/BlogContent.cs        全站内容源（文章、分类、标签、关于页小节）
    Models/                    Article / ArticleSection / NavItem / CategoryGroup / TagGroup
    ViewModels/                MainViewModel（外壳：顶栏 + 目录）+ 6 个栏目页 ViewModel
    Views/                     MainView（外壳）+ 6 个页面视图
  MyBlog.Browser/              浏览器宿主（WASM）
    wwwroot/index.html         承载画布的页面（<div id="out">）
.github/workflows/deploy.yml   推送到 main 后自动构建并发布到 Pages
```

顶栏栏目与页面 ViewModel 的关系写在 `MainViewModel.GetPage`；左侧目录由每个
`PageViewModelBase.Toc` 提供，点击后走 `MainViewModel.JumpToCommand` →
`MainView` 在可视树里按锚点找到控件并滚动。

## 本地构建

```powershell
# 需要 .NET 10 SDK 与 wasm-tools 工作负载
dotnet workload install wasm-tools
dotnet publish src/MyBlog.Browser/MyBlog.Browser.csproj -c Release -o published
```

产物在 `published/wwwroot`，用任意静态服务器打开 `index.html` 即可：

```powershell
python -m http.server 8080 --directory published/wwwroot
```

> 根目录下的 `publish/` 是早期版本的产物，可以直接删掉；现在统一输出到 `published/`
> （与 `.github/workflows/deploy.yml` 保持一致）。
> `_framework` 目录必须保持原样，且需要 `.nojekyll`，否则 GitHub Pages 会忽略它。

## 改内容

日常只需要动 `src/MyBlog/Data/BlogContent.cs`：

- 加文章：往 `Articles` 里加一项。`Sections` 里的每个 `Anchor` 会成为左侧目录的第二级；
  写 `IsTodo = true` 就显示「待补充」标记（对应参考站的 To Be Done）。
- 换导航：改 `Nav`，并在 `MainViewModel.GetPage` 里补上对应页面。
- 关于页：`AboutSections` 按 `Anchor` 分成「关于作者 / 关于本站」两组。
