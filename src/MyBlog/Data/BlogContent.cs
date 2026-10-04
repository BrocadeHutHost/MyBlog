using System;
using System.Collections.Generic;
using System.Linq;
using MyBlog.Models;

namespace MyBlog.Data;

/// <summary>
/// 全站内容源（先写死在这里，后续可换成 JSON / API）。
/// 层级对照参考站 https://archaeus13.github.io/index.html：
/// 顶栏是 5 个并列栏目，每个栏目页都有自己的两级左侧目录（目录 → 小节，小节带锚点）。
/// </summary>
public static class BlogContent
{
    public const string SiteName = "Zoo 的技术随笔";
    public const string Greeting = "你好，欢迎来到我的博客";
    public const string Tagline = "WPF / Avalonia 桌面与跨平台开发 · 记录工程实践";

    public const string Bio =
        "这里沉淀我在日常开发中写下的笔记与复盘：偏向工程化、可直接运行的方案，" +
        "偶尔也聊工具链、性能与部署。不堆概念，只给能落地的代码。";

    public const string Footer = "© 2026 Zoo · 基于 Avalonia 构建，托管于 GitHub Pages";

    /// <summary>顶栏的 5 个栏目。</summary>
    public static IReadOnlyList<NavItem> Nav { get; } = new List<NavItem>
    {
        new() { Key = "home", Title = "首页" },
        new() { Key = "archive", Title = "文章" },
        new() { Key = "categories", Title = "分类" },
        new() { Key = "tags", Title = "标签" },
        new() { Key = "about", Title = "关于" },
    };

    /// <summary>全部文章，第一条是《Hello World》。</summary>
    public static IReadOnlyList<Article> Articles { get; } = BuildArticles();

    public static IReadOnlyList<CategoryGroup> Categories { get; } = BuildCategories();

    public static IReadOnlyList<TagGroup> Tags { get; } = BuildTags();

    /// <summary>首页正文小节。</summary>
    public static IReadOnlyList<ArticleSection> HomeSections { get; } = new List<ArticleSection>
    {
        new()
        {
            Anchor = "home-what",
            Title = "本站做什么",
            Paragraphs = new[] { Bio }
        },
        new()
        {
            Anchor = "home-how",
            Title = "怎么读",
            Bullets = new[]
            {
                "顶部导航切换栏目，左侧目录跳转到本页的小节。",
                "文章卡片可以点开读全文；标着「待补充」的是还没写完的。",
                "每篇文章的目录由它自己的小节生成，切页会同步刷新。"
            }
        }
    };

    /// <summary>关于页：结构直接对应参考站的「关于作者 / 关于主页」。</summary>
    public static IReadOnlyList<ArticleSection> AboutSections { get; } = new List<ArticleSection>
    {
        new()
        {
            Anchor = "about-me",
            Title = "作者简介",
            Paragraphs = new[]
            {
                "Zoo，.NET 开发者，日常在做 WPF / Avalonia 的桌面与跨平台应用。",
                "把工作里觉得值得记录的东西整理在这里：控件与样式的用法、工程组织的取舍、部署与性能上的取舍。"
            }
        },
        new()
        {
            Anchor = "about-contact",
            Title = "联系作者",
            IsTodo = true,
            Paragraphs = new[] { "把下面几项换成你自己的账号即可，这里先留占位。" },
            Bullets = new[]
            {
                "GitHub：待补充",
                "邮箱：待补充",
                "微信：待补充"
            }
        },
        new()
        {
            Anchor = "about-guide",
            Title = "使用指南",
            Paragraphs = new[] { "点击顶部导航栏切换栏目，点击左侧目录跳转到本页的不同小节。" },
            Bullets = new[]
            {
                "左侧目录只列出当前页面的小节，换栏目会一起刷新。",
                "正文里标着「待补充」的部分是还没写完的内容。",
                "文章按年份归档，也可以从分类或标签进入。"
            }
        },
        new()
        {
            Anchor = "about-make",
            Title = "制作方法",
            Paragraphs = new[]
            {
                "站点用 Avalonia 编写，编译成 WebAssembly 后就是纯静态文件，托管在 GitHub Pages 上，不需要服务器。",
                "界面与内容在 src/MyBlog，浏览器宿主在 src/MyBlog.Browser，推送后由 GitHub Actions 自动构建发布。"
            },
            Bullets = new[]
            {
                "构建：dotnet publish src/MyBlog.Browser -c Release -o published",
                "产物：published/wwwroot（含 .nojekyll，否则 _framework 会被 Jekyll 忽略）",
                "流水线：.github/workflows/deploy.yml"
            }
        },
        new()
        {
            Anchor = "about-log",
            Title = "更新日志",
            Bullets = new[]
            {
                "2026/10/04 站点骨架完成：顶栏导航 + 每页两级左侧目录。",
                "2026/10/04 发布第一篇文章《Hello World》。"
            }
        }
    };

    private static List<Article> BuildArticles() => new()
    {
        new Article
        {
            Id = "hello-world",
            Title = "Hello World",
            Excerpt = "博客的第一篇文章：为什么要写、第一行代码，以及这个站点是怎么搭起来的。",
            Category = "随笔",
            Tags = new[] { "入门", "博客", "Avalonia" },
            Date = "2026-10-04",
            ReadMinutes = 4,
            Sections = new List<ArticleSection>
            {
                new()
                {
                    Anchor = "why",
                    Title = "为什么要写博客",
                    Paragraphs = new[]
                    {
                        "把日常开发里踩过的坑、验证过的方案写下来，是最省事的复习方式：写的时候逼自己把话说清楚，回头读的时候又能一眼想起当初为什么那样做。",
                        "所以这里的定位很明确——偏工程、可落地，少谈概念，多给能跑起来的代码。"
                    }
                },
                new()
                {
                    Anchor = "first-code",
                    Title = "第一行代码",
                    Paragraphs = new[]
                    {
                        "按惯例，第一个程序总要打印一句话。这篇《Hello World》本身，就是这个博客的第一行。"
                    },
                    CodeLanguage = "csharp",
                    Code = "Console.WriteLine(\"Hello, World!\");"
                },
                new()
                {
                    Anchor = "how",
                    Title = "这个站是怎么搭起来的",
                    Paragraphs = new[]
                    {
                        "界面用 Avalonia 写：XAML 描述布局，CommunityToolkit.Mvvm 管状态，编译成 WebAssembly 之后就是一堆静态文件，丢到 GitHub Pages 上即可。",
                        "没有服务器，也不需要数据库——更新内容就是改代码、推分支。"
                    },
                    Bullets = new[]
                    {
                        "界面：Avalonia + XAML，同一套代码还能跑在桌面上。",
                        "状态：[ObservableProperty] / [RelayCommand]，省掉大量样板代码。",
                        "部署：GitHub Actions 自动 dotnet publish，push 到 main 即上线。"
                    }
                },
                new()
                {
                    Anchor = "next",
                    Title = "接下来写什么",
                    Paragraphs = new[]
                    {
                        "先把结构立住：顶栏分栏目，每页左侧一个两级目录，和参考的站保持一致。之后按主题慢慢补文章。"
                    },
                    Bullets = new[]
                    {
                        "桌面开发：WPF 与 Avalonia 的控件、样式和迁移。",
                        "跨平台：多端 Head 的拆分与共享工程的组织方式。",
                        "部署与性能：WASM 体积、构建流水线与静态站点。"
                    }
                }
            }
        },

        Placeholder("avalonia-github-pages", "用 Avalonia 把 XAML 项目部署到 GitHub Pages",
            "不碰 HTML 与 Markdown，直接把 .axaml 编译成静态 WebAssembly，配合 .nojekyll 一键上线。",
            "部署", new[] { "Avalonia", "部署" }, "2026-07-18", 6),

        Placeholder("wpf-to-avalonia-styles", "从 WPF 迁移到 Avalonia 的样式与控件映射",
            "把 MaterialDesign 主题与 Avalonia FluentTheme 做对照，理顺 Brush / Style / 控件命名差异。",
            "桌面开发", new[] { "WPF", "Avalonia", "XAML" }, "2026-07-12", 9),

        Placeholder("avalonia-project-layout", "Avalonia 跨平台工程的目录该怎么拆",
            "共享工程 + 各端 Head（Browser / Desktop / Mobile）的结构，以及什么时候该抽抽象层。",
            "跨平台", new[] { "跨平台", "Avalonia" }, "2026-07-05", 7),

        Placeholder("wasm-size-optimization", "WASM 体积优化：裁剪、AOT 与按需加载",
            "记录一次把首屏体积从 12MB 压到 4MB 的实操，重点在 TrimMode 与运行时引用。",
            "性能", new[] { "WASM", "性能" }, "2026-06-28", 8),

        Placeholder("github-actions-pages", "GitHub Actions 自动发布静态站点",
            "actions/upload-pages-artifact 与 deploy-pages 的组合，push 到 main 即上线。",
            "部署", new[] { "GitHub Actions", "部署" }, "2026-06-21", 5),

        Placeholder("testable-viewmodel", "用 CommunityToolkit.Mvvm 写可测试 ViewModel",
            "[ObservableProperty] 与 [RelayCommand] 如何减少样板代码，并让逻辑脱离 UI 单测。",
            "工程实践", new[] { "MVVM", "工程实践" }, "2026-06-15", 6),
    };

    /// <summary>正文待补充的占位文章。</summary>
    private static Article Placeholder(string id, string title, string excerpt, string category,
        string[] tags, string date, int minutes) => new()
    {
        Id = id,
        Title = title,
        Excerpt = excerpt,
        Category = category,
        Tags = tags,
        Date = date,
        ReadMinutes = minutes,
        IsTodo = true,
        Sections = new List<ArticleSection>
        {
            new()
            {
                Anchor = "todo",
                Title = "正文",
                IsTodo = true,
                Paragraphs = new[] { "这篇的正文还没写完，先占个位置——对应参考站里标注的 To Be Done。" }
            }
        }
    };

    private static IReadOnlyList<CategoryGroup> BuildCategories() =>
        Articles
            .GroupBy(a => a.Category)
            .Select(g => new CategoryGroup
            {
                Key = CategorySlug(g.Key),
                Name = g.Key,
                Articles = g.ToList()
            })
            .OrderByDescending(g => g.Count)
            .ThenBy(g => g.Name, StringComparer.Ordinal)
            .ToList();

    private static IReadOnlyList<TagGroup> BuildTags()
    {
        var map = new Dictionary<string, List<Article>>();
        foreach (var article in Articles)
        {
            foreach (var tag in article.Tags)
            {
                if (!map.TryGetValue(tag, out var list))
                {
                    list = new List<Article>();
                    map[tag] = list;
                }

                list.Add(article);
            }
        }

        return map
            .OrderByDescending(kv => kv.Value.Count)
            .ThenBy(kv => kv.Key, StringComparer.Ordinal)
            .Select(kv => new TagGroup
            {
                Key = TagSlug(kv.Key),
                Name = kv.Key,
                Articles = kv.Value
            })
            .ToList();
    }

    private static string CategorySlug(string name) => name switch
    {
        "随笔" => "essay",
        "部署" => "deploy",
        "桌面开发" => "desktop",
        "跨平台" => "cross",
        "工程实践" => "practice",
        "性能" => "perf",
        _ => "misc"
    };

    private static string TagSlug(string name) => name switch
    {
        "入门" => "intro",
        "博客" => "blog",
        "Avalonia" => "avalonia",
        "WPF" => "wpf",
        "XAML" => "xaml",
        "部署" => "deploy",
        "跨平台" => "cross",
        "性能" => "perf",
        "工程实践" => "practice",
        "WASM" => "wasm",
        "GitHub Actions" => "actions",
        "MVVM" => "mvvm",
        _ => "tag"
    };
}
