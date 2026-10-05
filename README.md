# MyBlog

一个纯静态的个人博客：手写 HTML + 一个 CSS + 一点点 JavaScript，**没有构建步骤**，
推送到 `main` 分支就自动发布到 GitHub Pages。

- 仓库：<https://github.com/BrocadeHutHost/MyBlog>
- 线上地址：<https://brocadehuthost.github.io/MyBlog/>

站点的层级关系参考 [archaeus13.github.io](https://archaeus13.github.io/index.html)：

- **顶部导航栏**：5 个并列栏目，切换栏目 = 换页面；
- **左侧目录**：两级（目录 → 小节），点击跳到本页对应位置，滚动时高亮当前小节；
- **正文小节**：正文的 `h2` 是目录一级，`h3` 是二级，**目录由脚本自动生成**，不用手工维护。

## 栏目

| 顶栏栏目 | 文件 | 页面内容 | 左侧目录 |
| --- | --- | --- | --- |
| 首页 | `site/index.html` | 站点介绍 + 最新文章 | 最新文章（→ 每篇）、关于本站（→ 本站做什么 / 怎么读） |
| 文章 | `site/articles.html` | 按年份归档的全部文章 | 年份（→ 该年每一篇）、归档说明 |
| 分类 | `site/categories.html` | 按分类分组的文章 | 全部分类（→ 每个分类） |
| 标签 | `site/tags.html` | 标签云 + 按标签分组 | 标签云、按标签浏览（→ 每个标签） |
| 关于 | `site/about.html` | 作者与站点说明 | 关于作者（作者简介 / 联系作者）、关于本站（使用指南 / 制作方法 / 更新日志） |

第一篇文章是 **《Hello World》**（`site/hello-world.html`，清单里的第一条）。

## 目录结构

```
site/                     ← 整个网站就是这一个目录，GitHub Pages 发布的就是它
  index.html              首页
  articles.html           文章（归档）
  categories.html         分类
  tags.html               标签
  about.html              关于
  hello-world.html        第一篇文章（每篇文章一个 HTML 文件）
  404.html                找不到页面时的兜底页
  assets/
    site.css              全站样式（配色、顶栏、左侧目录、卡片、代码块）
    site.js               渲染文章列表 + 生成左侧目录 + 当前小节高亮
    posts.js              ★ 文章清单，加文章只改这里 + 新增一个 HTML
.github/workflows/deploy.yml   推送到 main 后发布 site/ 到 Pages
```

## 加一篇文章

1. 复制 `site/hello-world.html`，改名成新文章的 `slug`（例如 `site/wpf-to-avalonia.html`），把正文换成你的内容：
   - 标题用 `<h1 class="page-title">`；
   - 每个小节用 `<h2 id="...">`，子小节用 `<h3 id="...">`——`id` 就是左侧目录的锚点，**目录会自动出现**；
   - 代码块用 `<pre class="code"><code>…</code></pre>`。
2. 在 `site/assets/posts.js` 里加一条记录，`slug` 要和文件名一致（不带 `.html`）：

```js
{
    slug: "wpf-to-avalonia",
    title: "从 WPF 迁移到 Avalonia 的样式与控件映射",
    date: "2026-10-06",
    category: "桌面开发",
    tags: ["WPF", "Avalonia"],
    excerpt: "一句话摘要，显示在卡片上。",
    minutes: 9,
    draft: false        // true 会显示「待补充」标记（对应参考站的 To Be Done）
}
```

首页的「最新文章」、文章页的归档、分类页、标签页都会自动更新。

## 本地预览

直接用浏览器打开 `site/index.html` 也行（全站都是相对路径）；
想更接近线上，用任意静态服务器：

```powershell
python -m http.server 8080 --directory site
# 然后打开 http://localhost:8080/
```

## 部署

推送到 `main` 即可，工作流会把 `site/` 目录作为 Pages 产物发布：

```powershell
git add -A
git commit -m "写点什么"
git push
```

约 1 分钟后刷新 <https://brocadehuthost.github.io/MyBlog/>。
仓库的 **Settings → Pages → Build and deployment → Source** 需要是 **GitHub Actions**（已配好）。

> 站点部署在 `/MyBlog/` 这个子路径下，所以全站链接都用**相对路径**（`assets/site.css`、`articles.html`），
> 不要写成 `/assets/...` 这样的绝对路径，否则子路径下会 404。

## 关于旧版本

这个仓库早先有一版用 C# / Avalonia 编译成 WebAssembly 的博客（`src/`、`MyBlog.slnx`），
因为依赖 .NET SDK 与 wasm-tools、首屏要下载十几 MB、还容易被运行时环境卡住，已经移除，
改成现在这套纯 HTML 方案。旧代码仍留在 git 历史里（提交 `a27694a` 及之前），需要时可以找回：

```powershell
git checkout a27694a -- src MyBlog.slnx
```

`MyBlog/` 是最早的 WPF 占位工程，没有动它。
