# 锦的博客网站

> 前言：网上个人博客众多，动效华丽好看，但是作为长期个人网站运营，复杂的动效难以维护，也会与内容喧宾夺主，所以我选择以简约风格部署网站，尽量呈现博客核心内容  
> 原项目由 C# + Avalonia 跨平台框架生成，由于性能问题改为传统技术栈。

- 非常简单简约，源代码只包含13个文件，而其中10个文件都是html
- 仓库：<https://github.com/BrocadeHutHost/MyBlog>
- 线上示例（作者自己的站，可以点开看效果）：<https://brocadehuthost.github.io/MyBlog/>
- 许可：[MIT](LICENSE)
- 环境：Node 18+

仓库仅需放源文件。生成物见 [生成物不入库](#生成物不入库)

## 如果想要改为自己的博客，请改这几处

# **！！下面的内容由DeepSeek根据项目生成！！，本人审核并保证内容有效**

### 0. 先分清源文件和生成物

| 路径 | 是什么 | 能不能手改 |
| --- | --- | --- |
| `site/index.html`、`articles.html`、`courses.html`、`categories.html`、`tags.html`、`about.html`、`404.html` | 7 个手写页面 | 能改，要改 |
| `tools/build-blog.mjs` | 生成脚本 | 能改，顶部常量要改 |
| `site/posts/**` | 文章源文件（md 和图片） | 换成自己的 |
| `site/files/**` | 课程资料源文件 | 换成自己的 |
| `site/assets/site.css` | 样式 | 按需改 |
| `site/assets/site.js` | 列表、左侧目录、折叠正文 | 按需改 |
| `site/assets/katex/` | 数学公式引擎 | 别动 |
| `site/<短名>.html` | 每篇文章的页面 | 生成物，别手改 |
| `site/notes/*.html` | 每篇笔记的页面 | 生成物，别手改 |
| `site/assets/posts.js` | 文章清单 | 生成物，别手改 |
| `site/assets/courses.js` | 课程清单 | 生成物，别手改 |

生成物由 `tools/build-blog.mjs` 生成，`.gitignore` 第 14 到 25 行已经排除，不入库。
脚本清理失效页面时只删带生成标记的 html（`tools/build-blog.mjs` 第 1115 到 1131 行），手写页面不会被碰。

### 1. 一次性全局替换

顺序有讲究：长的先替换，短的后替换。
`锦 的博客` 里含 `锦`，页脚 `© 2026 锦 · …` 里也含 `锦`。先替换整串，最后再收拾剩下的单个 `锦`。
反过来做，替换完站名会把页脚改成半新半旧。

#### 第 1 步：头像地址

搜：`https://avatars.githubusercontent.com/BrocadeHutHost?s=256`
换成：`https://avatars.githubusercontent.com/<你的GitHub用户名>?s=256`

命中 23 处，8 个文件：

| 文件 | 处数 | 行号 |
| --- | --- | --- |
| `site/index.html` | 4 | 8、9、16、42 |
| `site/404.html` | 3 | 7、8、50 |
| `site/about.html` | 3 | 7、8、15 |
| `site/articles.html` | 3 | 7、8、15 |
| `site/courses.html` | 3 | 7、8、15 |
| `site/categories.html` | 3 | 7、8、15 |
| `site/tags.html` | 3 | 7、8、15 |
| `tools/build-blog.mjs` | 1 | 45 |

这个地址既是 favicon 也是 apple-touch-icon（`tools/build-blog.mjs` 第 48 到 50 行），一并换掉。
换完从头像地址里拿到用户名，第 6 步还要用。

#### 第 2 步：站名

搜：`锦 的博客`
换成：你自己的站名。

命中 17 处，8 个文件：

| 文件 | 处数 | 行号 |
| --- | --- | --- |
| `site/index.html` | 4 | 6、7、16、40 |
| `site/404.html` | 2 | 6、50 |
| `site/about.html` | 2 | 6、15 |
| `site/articles.html` | 2 | 6、15 |
| `site/courses.html` | 2 | 6、15 |
| `site/categories.html` | 2 | 6、15 |
| `site/tags.html` | 2 | 6、15 |
| `tools/build-blog.mjs` | 1 | 42（`SITE_NAME`） |

文章页和笔记页的标题、顶栏站名都从这里取（第 1053、1105、1263 行）。改常量，生成出来的页面就跟着变。

#### 第 3 步：页脚版权

搜：`© 2026 锦 · 纯静态站点，托管于 GitHub Pages`
换成：你自己的版权行，比如 `© 2026 你的名字 · 纯静态站点，托管于 GitHub Pages`。

命中 10 处：

| 文件 | 行号 |
| --- | --- |
| `site/index.html` | 50 |
| `site/articles.html` | 41 |
| `site/courses.html` | 40 |
| `site/categories.html` | 41 |
| `site/tags.html` | 41 |
| `site/about.html` | 59 |
| `site/404.html` | 68（这里是 `<p class="foot">`，不是 `.site-footer`） |
| `tools/build-blog.mjs` | 1075（文章页）、1283（笔记页），2 处 |

本文件里也有一处，是上面第 3 步的搜索示例，不用改。

#### 第 4 步：首页问候和头像说明

- 搜 `你好，我是 锦`，换成你的问候。`site/index.html` 第 39 行，1 处。
- 搜 `锦 的头像`，换成你的名字。`site/index.html` 第 42 行，1 处。

这两处不在第 2 步的命中范围里，因为中间没有「的博客」。

#### 第 5 步：剩下的单个「锦」

全仓库再搜一次 `锦`。做完第 1 到 4 步，应该只剩一处：

- `README.md` 第 1 行 `# 锦的博客网站`（这里没有空格）

还有别的命中，说明前几步漏了，回去补。

#### 第 6 步：剩下的用户名

搜 `BrocadeHutHost`，区分大小写。做完第 1 步，应该只剩 5 处，4 个文件：

| 文件 | 行号 | 是什么 |
| --- | --- | --- |
| `LICENSE` | 3 | `Copyright (c) 2026 BrocadeHutHost` |
| `README.md` | 6 | 仓库地址 |
| `README.md` | 「本地查看」一节 | clone 命令 |
| `site/posts/dgut/index.md` | 12、47 | 示例文章里指向另一个仓库的链接 |

`site/posts/dgut/index.md` 是示例文章。按第 5 节把那篇删掉，这两处就不用管。
第 7 步的仓库地址替换会覆盖 `README.md` 那两处。

再搜一次小写 `brocadehuthost`。本文件第 7 行（线上示例）和「部署」一节里的 Pages 地址是全小写。

#### 第 7 步：仓库地址

- 搜 `BrocadeHutHost/MyBlog`，换成 `<你的用户名>/<你的仓库名>`。本文件第 6 行，和[本地查看](#本地查看)一节的 clone 命令。
- 搜 `brocadehuthost.github.io/MyBlog`，换成你的 Pages 地址。本文件第 7 行，和[部署](#部署)一节。

代码里没有写死仓库路径（`.github/workflows/deploy.yml` 里也没有），换成什么仓库名都能跑。
Pages 的地址里用户名是全小写，仓库名保留大小写。

### 2. 逐文件清单

全局替换之后，剩下的内容要手改。每个文件一行。

| 文件 | 位置 | 改成什么 |
| --- | --- | --- |
| `site/index.html` | 第 6 行 `<title>`、第 7 行 description | 站名和一句话介绍 |
| `site/index.html` | 第 8、9 行图标，第 16 行 `.brand` 里的 `<span>` | 头像地址、站名 |
| `site/index.html` | 第 17 到 24 行 `<nav class="topnav">` | 6 个栏目，见第 3 节 |
| `site/index.html` | 第 39 行问候、第 40 行 `<h1 class="hero-title">`、第 42 行头像 `alt` | 你的名字和签名 |
| `site/index.html` | 第 50 行 `<footer class="site-footer">` | 页脚 |
| `site/articles.html` | 第 6、7、8、15 行 | 标题栏那条「文章」相关的站名和图标 |
| `site/articles.html` | 第 16 到 23 行 `<nav>` | 6 个栏目，当前页那行带 `aria-current="page"` |
| `site/articles.html` | 第 37 行 `page-sub`、第 41 行页脚 | 副标题、页脚 |
| `site/courses.html` | 第 6、7、8、15 行 | 同上 |
| `site/courses.html` | 第 16 到 23 行 `<nav>`、第 40 行页脚 | 栏目、页脚 |
| `site/categories.html` | 第 6、7、8、15 行 | 同上 |
| `site/categories.html` | 第 16 到 23 行 `<nav>`、第 37 行 `page-sub`、第 41 行页脚 | 栏目、副标题、页脚 |
| `site/tags.html` | 第 6、7、8、15 行 | 同上 |
| `site/tags.html` | 第 16 到 23 行 `<nav>`、第 37 行 `page-sub`、第 41 行页脚 | 栏目、副标题、页脚 |
| `site/about.html` | 第 6、7、8、15 行 | 同上 |
| `site/about.html` | 第 16 到 23 行 `<nav>` | 6 个栏目 |
| `site/about.html` | 第 36 行 `<h1 class="page-title">` | 页面标题 |
| `site/about.html` | 第 39 到 43 行「关于作者」 | 你的简介 |
| `site/about.html` | 第 47 到 56 行「关于本站」和更新日志 | 你的说明。更新日志那两条是示例，删掉换成自己的 |
| `site/about.html` | 第 59 行页脚 | 页脚 |
| `site/404.html` | 第 6、7、8 行 | 标题和图标 |
| `site/404.html` | 第 11 行 `:root` 颜色变量 | 主题色，见第 4 节 |
| `site/404.html` | 第 50 行 `.brand` | 头像地址、站名 |
| `site/404.html` | 第 51 到 58 行 `<nav>` | 6 个栏目 |
| `site/404.html` | 第 68 行 `<p class="foot">` | 页脚 |
| `site/404.html` | 第 78 行 `var ROOT = "";` | 部署在子路径又不想自动推断时写死 `"/<仓库名>/"`，见第 4 节 |
| `tools/build-blog.mjs` | 第 42 行 `SITE_NAME` | 站名 |
| `tools/build-blog.mjs` | 第 45 行 `AVATAR_URL` | 头像地址 |
| `tools/build-blog.mjs` | 第 66 到 73 行 `NAV` | 6 个栏目，见第 3 节 |
| `tools/build-blog.mjs` | 第 1075、1283 行页脚字符串 | 文章页和笔记页的页脚 |
| `tools/build-blog.mjs` | 第 1098 到 1109 行 `pageHeader`，第 1105 行 brand | 不用改。它用上面三个常量拼生成页面的顶栏 |
| `README.md` | 第 1 行标题 | 你的博客名 |
| `README.md` | 第 6、7 行仓库和线上示例 | 你的地址 |
| `README.md` | 「本地查看」一节里的 clone 命令 | 你的地址 |
| `README.md` | 「部署」一节里的 Pages 地址 | 你的地址 |
| `LICENSE` | 第 3 行 | 换成你的名字或昵称 |
| `site/posts/_template/index.md` | 第 2 到 10 行 front matter | 把示例分类、标签换成你常用的；这个文件不生成页面，留着当模板（`tools/build-blog.mjs` 第 928 行跳过 `_` 开头的目录） |
| `site/assets/site.js` | 第 276 行 `FOLD_OPEN_BY_DEFAULT` | 可选，见第 4 节 |
| `site/assets/site.css` | 第 2 到 17 行 `:root`、第 264 行 `.indent-*` | 可选，见第 4 节 |
| `.github/workflows/deploy.yml` | 不用改 | 里面没有用户名和仓库名 |

`site/index.html` 第 17 到 24 行、其余 6 个页面第 16 到 23 行是顶栏，位置随页面长度略有差别，按 `<nav class="topnav">` 搜更稳。
`site/about.html` 第 39 到 57 行的小标题 id（`about-author`、`about-site`、`make`、`log`）不用动，改文字就行。

### 3. 顶栏栏目

顶栏有 6 个 `<a>`。手写页面各写一份，生成的文章页和笔记页由 `NAV` 拼出来（`tools/build-blog.mjs` 第 1100 到 1102 行）。
改栏目两边都要动。漏一边，点进文章页看到的栏目和首页不一样。

#### 改名字

1. 改 `tools/build-blog.mjs` 第 66 到 73 行 `NAV` 数组里的文字。
2. 改 7 个手写页面 `<nav class="topnav">` 里对应的 `<a>` 文字。

栏目名和 href 的对应关系在 `NAV` 里是 `["articles.html", "文章"]` 这种形式。
第 1101 行按 href 决定哪个高亮，href 别写错。

#### 改顺序

1. 调 `NAV` 数组里 6 行的顺序。
2. 调 7 个手写页面里 6 个 `<a>` 的顺序。

两边顺序不一致，文章页和首页的栏目次序就会打架。

#### 加栏目

1. 复制一份手写页面当模板，比如把 `site/articles.html` 复制成 `site/<新页面>.html`。
2. 新页面里改 `<title>`、`<h1 class="page-title">`、`<nav>`、页脚。
3. 在 `NAV` 第 66 到 73 行加一行，形如 `["<新页面>.html", "栏目名"],`。
4. 在 `tools/build-blog.mjs` 第 82 行 `RESERVED_SLUGS` 里加上新页面的短名，免得某篇文章的短名把页面覆盖掉。
5. 7 个手写页面的 `<nav>` 里各加一个 `<a>`。

`site/404.html` 的顶栏用的是 `<a href="#" data-root="articles.html">文章</a>` 这种写法，第 81 到 83 行的脚本按 `data-root` 补路径。
加栏目时照抄这个写法，别写成普通 href。

#### 删栏目

1. 从 `NAV` 和 7 个手写页面的 `<nav>` 里删掉对应的 `<a>`。
2. 删掉页面文件。
3. 从 `RESERVED_SLUGS` 第 82 行删掉它的短名。留着也能用，只是白占一个名字。
4. 删 `site/categories.html` 或 `site/tags.html` 不用改 `site/assets/site.js`。`data-view` 的映射在第 189 到 199 行，页面没了就没人调用。

删掉「文章」栏目要改一处额外的地方：生成的文章页固定高亮 `articles.html`（`tools/build-blog.mjs` 第 1061 行）。

#### aria-current

当前页高亮靠 `aria-current="page"`。
手写页面各自标在自己那一行，比如 `site/articles.html` 第 18 行。
新加的栏目也要在它自己的页面里标一行，不标顶栏就没有高亮。
笔记页不高亮（`tools/build-blog.mjs` 第 1271 行传的是 `null`），这是原样，不用改。

### 4. 可选开关

#### 正文默认折叠

`site/assets/site.js` 第 276 行：

```javascript
var FOLD_OPEN_BY_DEFAULT = true;
```

改成 `false`，正文默认收起，点小标题展开。折叠是 js 加的，禁用 js 时内容照常显示。

#### 缩进深度

`site/assets/site.css` 第 264 行：

```css
.indent-3, .indent-4, .indent-5, .indent-6 { margin-left: 16px; }
```

`16px` 就是每层缩进的宽度。脚本用 `.indent-N` 把正文一层层包起来（`tools/build-blog.mjs` 第 969 到 983 行）。

标题自己还有一套左边距，在 `site/assets/site.css` 第 261 到 263 行：`h3` 16px、`h4` 32px、`h5`/`h6` 48px。改缩进时这套一起对齐。

[Markdown 支持](#markdown-支持)一节也讲了这件事：`##` 顶格，`###` 和 `####` 连正文一起缩进。

#### 主题色

`site/assets/site.css` 第 2 到 17 行 `:root` 里的变量，`--accent` 是主色。

`site/404.html` 第 11 行有一份自己的颜色变量。404 页不依赖 assets 目录，改主题色要同步改这一份。

#### 头像尺寸

- 取图尺寸：地址里的 `?s=256`（`tools/build-blog.mjs` 第 45 行）。改大改小不影响布局。
- 顶栏小头像：`site/assets/site.css` 第 62 行 24px；`site/404.html` 第 22 行 28px。
- 首页大头像：`site/assets/site.css` 第 126 行 150px，窄屏第 307 行 104px。

#### KaTeX

数学公式用自托管的 KaTeX，文件在 `site/assets/katex/`。
只有页面里真有公式才引入（`tools/build-blog.mjs` 第 1057、1079、1267、1286 行）。不用公式就什么都不用改。
升级方法见[数学公式](#数学公式)。

#### 自定义域名和仓库名

- 发布目录是 `site/`（`.github/workflows/deploy.yml` 第 35 行 `path: site`），所以 `CNAME` 要放 `site/CNAME`。放仓库根目录不会进产物。
- 域名在仓库 Settings → Pages 里填（见[部署](#部署)）。
- 改仓库名不影响页面。全站相对路径，代码里没有写死仓库路径。
- `site/404.html` 第 78 到 83 行按地址第一段推断站点根，项目页和用户页都能用。已知子路径要写死，就改第 78 行的 `var ROOT = "";`。
- 本文件的仓库地址和线上地址按第 1 节第 7 步替换。Pages 地址里的用户名是全小写。

### 5. 删掉示例内容

删示例文章：删掉整个 `site/posts/dgut/` 目录。

下次生成时 `site/dgut.html` 会被自动删掉（`tools/build-blog.mjs` 第 1510 行调用清理）。脚本只删带生成标记的页面（第 1115 到 1131 行），手写页面不动。

`site/posts/_template/` 留着当模板。`_` 开头的目录不生成页面（第 928 行）。

删示例课程：删掉整个 `site/files/SM/` 目录。

里面两个 PDF 是 85 MB 和 76 MB（脚本按 1 MB = 1048576 字节算）。GitHub 对 50 MB 以上的文件警告，100 MB 以上直接拒收（见[文件大小](#文件大小)）。

删完跑一次生成，`site/assets/courses.js` 和 `site/notes/` 下对应的笔记页会一起清掉（第 1516、1522 行）。

加自己的东西看[写文章](#写文章)、[课程资料](#课程资料)、[笔记](#笔记)几节。

### 6. 改完核对

改完逐条勾。命令都在仓库根目录跑。

- [ ] `node tools/build-blog.mjs` 退出码 0，输出里没有 `✗ 错误`
- [ ] 再跑一次 `node tools/build-blog.mjs --check`，没有列出过期产物
- [ ] 搜 `锦`，没有残留（本文件标题按需保留）
- [ ] 搜 `BrocadeHutHost`，没有残留
- [ ] 搜 `MyBlog`，没有残留
- [ ] 打开 `site/index.html`：站名、头像、页脚都是你的
- [ ] 首页文章列表有卡片，不是空白
- [ ] 7 个手写页面的顶栏 6 个条目都能点，当前页高亮
- [ ] 点开一篇生成的文章页（`site/<短名>.html`），顶栏栏目和首页一致
- [ ] 笔记页（`site/notes/*.html`）顶栏正常，「← 回到课程」能跳回课程页
- [ ] `site/404.html` 直接打开正常；部署后在子路径下随便敲一个不存在的地址，顶栏链接不跑偏
- [ ] 点小标题能折叠展开，点左侧目录能跳，跳到收起的小节会先展开
- [ ] 含公式的页面公式正常渲染；不含公式的页面没有多余的 KaTeX 请求
- [ ] 图片显示出来，图注是「文件名 · 大小 · 尺寸」
- [ ] `git status` 里没有生成物（`site/<短名>.html`、`site/notes/*.html`、`site/assets/posts.js`、`site/assets/courses.js`）

## 本地查看

```powershell
git clone https://github.com/BrocadeHutHost/MyBlog.git my-blog
cd my-blog
node tools/build-blog.mjs --watch --serve
```

随后打开 <http://127.0.0.1:8080/>

改之前先 `git add -A && git commit -m "原样存一份"`，改坏了能看 diff、能回滚。

## 写文章

1. 建文件夹 `site/posts/<短名>/`。短名就是文件名，例如 `wpf-to-avalonia`。
2. 在里面建 `index.md`：
```markdown
---
title: 从 WPF 迁移到 Avalonia 的样式与控件映射
date: 2026-10-06
category: 桌面开发
tags: [WPF, Avalonia]
excerpt: 卡片上的一句话摘要。不写就取正文第一段。
lead: 标题下面的引言。不写就没有。
# minutes: 9      不写就按正文字数算
# draft: true     没写完就打开，列表里显示「待补充」
---

## 小节标题

正文。`##` 是左侧目录一级，`###` 是二级，锚点自动生成。
想自己指定锚点：`## 小节标题 {#custom-id}`。
```

3. 跑 `node tools/build-blog.mjs`，生成 `site/<短名>.html` 和文章清单 `site/assets/posts.js`。

首页、文章页、分类页、标签页都读 `posts.js`，不用动。

`site/posts/_template/index.md` 可以照抄。`_` 开头的文件夹不生成。
短名用中文也行，URL 会变成 `%E4%B8%9C…`；想短一点就在 front matter 里写 `slug: 英文短名`。

## 图片

图片和 `index.md` 放一起，正文写相对路径：

```markdown
![图片说明](cover.png)
```

生成时脚本读图片的像素尺寸和体积，输出 `<figure>`，图注是「文件名 · 大小 · 尺寸」：

```html
<figure class="fig">
  <img src="posts/my-post/cover.png" alt="图片说明" width="720" height="405" loading="lazy">
  <figcaption>图片说明 <span class="fig-meta">cover.png · 10 KB · 720×405</span></figcaption>
</figure>
```

图片路径写错脚本会报错，退出码 1，CI 也会红。

## Markdown 支持

小标题、段落、粗体、斜体、行内代码、删除线、有序和无序列表（可嵌套）、引用、围栏代码块、表格、分隔线、链接、图片、行内 HTML。

`##` 顶格，`###` 和 `####` 连下面的正文一起缩进，一级 16px。改缩进改 `site/assets/site.css` 里 `.indent-3` 那几行。

站内链接写 md 路径，例如 `dgut/index.md`，生成时换成对应页面地址。

## 折叠正文

点小标题收起或展开下面的正文，标题左边的小三角跟着变。点左侧目录跳到被收起的小节时，会先展开。

默认全部展开。想默认收起，把 `site/assets/site.js` 里的 `FOLD_OPEN_BY_DEFAULT` 改成 `false`。
折叠是 js 加的，浏览器禁用 JS 时内容照常显示。

## 数学公式

用 KaTeX，文件在 `site/assets/katex/`，只有含公式的页面才加载。

| 写法 | 效果 |
| --- | --- |
| `$E = mc^2$`、`\(E = mc^2\)` | 行内公式 |
| `$$…$$`、`\[…\]` | 独占一行，可以跨多行 |

```markdown
行内 $a_i^2 * b_j^2$，分数 $\frac{a}{b}$

$$
\begin{aligned}
(a+b)^2 &= a^2 + 2ab + b^2 \\
(a-b)^2 &= a^2 - 2ab + b^2
\end{aligned}
$$
```

- 公式里的 `_` `*` `\` 不会被 Markdown 处理
- `$$…$$` 顶格、跟在句子后面、跨多行、写在列表项里都认
- 矩阵换行写 `\\`，不是 `\`
- 代码块和行内代码里的 `$$`、`\(` 不排版
- 公式里别写中文全角标点，KaTeX 会警告
- 禁用 JS 或公式写错时显示原始 LaTeX，不会空白
- 升级 KaTeX：替换 `site/assets/katex/` 里的 `katex.min.css`、`katex.min.js`、`auto-render.min.js` 和 `fonts/*.woff2`

## 课程资料

「课程」页上一门课一节，分「资料」和「感悟与笔记」，左侧目录自动列。

1. `site/files/` 下建文件夹，比如 `site/files/ml/`，文件丢进去。文件夹名就是课程名，子文件夹也会扫。
2. 推上去，或者本地跑 `node tools/build-blog.mjs`。

脚本递归扫这个文件夹，把文件名和体积写进 `site/assets/courses.js`。
`course.json`、`note_*.md`、`notes.md`、`.gitkeep` 不当资料。

`course.json` 可选，放同一个文件夹里：

```json
{
    "name": "机器学习",
    "term": "2026 秋",
    "intro": "一句话介绍。",
    "fileNotes": { "hw01.pdf": "必做" },
    "links": [
        { "name": "往年题合集", "url": "https://pan.baidu.com/s/xxxx", "size": "120 MB", "note": "网盘" }
    ],
    "notes": [ "感悟写这里，一段一个字符串。" ],
    "order": 1
}
```

| 字段 | 作用 | 不写会怎样 |
| --- | --- | --- |
| `name` | 课程名 | 用文件夹名 |
| `term` | 学期 | 不显示 |
| `intro` | 一句话介绍 | 不显示 |
| `fileNotes` | 给文件加备注，键是文件名或相对路径 | 没备注 |
| `links` | 外部链接，不检查大小 | 不显示 |
| `notes` | 感悟，纯文本段落 | 显示「还没写」 |
| `order` | 课程排序，越小越前 | 按文件夹名排 |
| `exclude` | 不算资料的文件，写文件名或相对路径 | 全都当资料 |

资料清单是扫出来的，不用在 `course.json` 里列。

### 笔记

文件名 `note_<课程>_<笔记名>.md`，例如 `note_SM_第八章笔记.md`。一篇笔记一个文件，生成一个页面
`site/notes/<课程>-<笔记名>.html`。课程页只列笔记标题，点进去看正文。

放两个地方都认：

```text
site/files/SM/               放课程文件夹里
    note_SM_第八章笔记.md     文件名里的课程名可写可不写
    note_第九章.md
    course.json
    高等数学 上册.pdf         资料

site/notes/                  或者统一放这里，这时要写课程名
    note_SM_第八章笔记.md
    note_SS_第一次课.md
```

- 课程页一篇笔记一行，只有一篇也是列表
- 笔记页有自己的左侧目录和正文，还有一条「← 回到课程」
- 笔记里小标题、列表、表格、链接、图片、代码块、公式都能用
- 笔记里引用的图片不算资料，图片和笔记放一起，写相对路径
- 笔记开头可以写 front matter：`title:` 笔记名、`date:` 日期；`draft: true` 或正文为空会标「待补充」
- 删掉或改名源 md，跑一遍脚本，旧页面自动删
- 只有一篇 `site/files/<课程>/notes.md` 也支持，笔记名默认「笔记」
- 一篇笔记 md 都没有时，用 `course.json` 里的 `notes`

资料为空、`notes` 为空数组时，页面显示「待补充」，不会有死链。

### 文件大小

GitHub 单个文件超过 100 MB 拒绝推送，50 MB 以上警告。Pages 也不适合放大文件。
单个文件压在 50 MB 以内，大的放网盘，用 `links` 字段链过来。
脚本会把超标的文件点出来：50 MB 以上警告，100 MB 以上算错误。
不要用 Git LFS，Pages 不解析 LFS，下载到的是指针文件。

## 目录结构

```
site/                     GitHub Pages 发布的就是这个目录
  index.html              首页
  articles.html           文章归档
  courses.html            课程
  categories.html         分类
  tags.html               标签
  about.html              关于
  404.html                兜底页
  posts/                  文章源文件：posts/<短名>/index.md，图片放旁边
    _template/index.md    模板，_ 开头不生成
  files/                  课程资料：files/<课程>/，可放 course.json、note_*.md
  notes/                  笔记源文件可以统一放这里，生成的笔记页也在这（不入库）
  assets/
    site.css              样式
    site.js               渲染列表、左侧目录、折叠正文
    posts.js              ★ 生成物，不入库
    courses.js            ★ 生成物，不入库
    katex/                数学公式引擎
tools/
  build-blog.mjs          生成脚本
  scan-files.ps1          旧工具，列一遍 files/ 下文件大小
.github/workflows/deploy.yml   推送到 main 后发布 site/
```

## 生成物不入库

这些由脚本生成，`.gitignore` 里已排除：

- `site/<短名>.html`，每篇文章
- `site/notes/*.html`，每篇笔记
- `site/assets/posts.js`，文章清单
- `site/assets/courses.js`，课程清单

线上由工作流现场生成（`.github/workflows/deploy.yml` 里那一步）。
本地 clone 之后要预览，先跑一次 `node tools/build-blog.mjs`。
删掉源文件再跑脚本，对应页面自动删，不留死链。

## 生成命令

Node 18+，无第三方依赖。

```powershell
node tools/build-blog.mjs            生成一次
node tools/build-blog.mjs --watch    改 md 就重新生成
node tools/build-blog.mjs --serve    起本地服务器，默认 8080，用 --port 换端口
node tools/build-blog.mjs --check    列出和当前源文件不一致的产物，不写文件
node tools/build-blog.mjs --help     用法
```

脚本打印生成了哪些文件，以及警告和错误：图片路径写错、front matter 有看不懂的行、文件超过 100 MB。有错误时退出码 1。

不想跑脚本也可以直接开 `site/index.html`，全站都是相对路径。或者：

```powershell
python -m http.server 8080 --directory site
```

## 部署

推送到 `main`。工作流先生成一遍，再把 `site/` 发布到 Pages：

```powershell
git add -A
git commit -m "写点什么"
git push
```

仓库 **Settings → Pages → Build and deployment → Source** 选 **GitHub Actions**。
约 1 分钟后打开你自己的 Pages 地址，形如 `https://<用户名>.github.io/<仓库名>/`。

- 换成自己的仓库，代码不用改，全站相对路径
- 项目页（`<用户名>.github.io/<仓库名>/`）和用户页（`<用户名>.github.io/`）都能用
- 自定义域名：Pages 里填域名，`CNAME` 文件要放在发布目录里，也就是 `site/CNAME`；放仓库根目录不会进产物
- 别写 `/assets/...` 这种开头的路径，项目页下会 404；脚本会把 md 里用绝对路径的图片报错

## 出错了

生成那一步退出码不是 0，工作流在这一步停下，后面的上传和发布不执行，线上还是上一版。
脚本有错误时退出码 1（`tools/build-blog.mjs` 第 1550 行）。先去仓库 Actions 看那一跑是不是绿的。

| 现象 | 原因 | 怎么办 |
| --- | --- | --- |
| Actions 红在生成那一步 | md 里图片路径写错，或图片不存在 | 看日志里的 `✗` 行，路径按 md 所在目录算 |
| 同上 | md 里图片写了 `/assets/...` 这种绝对路径 | 改成相对路径。项目页在子路径下，绝对路径会 404（`tools/build-blog.mjs` 第 456 到 458 行） |
| 同上 | 课程资料超过 100 MB | 放网盘，用 `course.json` 的 `links` 链过来（第 1384 到 1390 行） |
| 同上 | 两篇文章短名撞了，或撞了保留名 | 换文件夹名，或在 front matter 写 `slug:`（第 1017 到 1020 行） |
| 有警告但发布了 | 50 到 100 MB 的文件，或 front matter 有看不懂的行 | 警告不拦发布，按需处理（见[文件大小](#文件大小)） |
| 页面能开但样式没了 | 上传的不是 `site/` 目录 | 检查 `deploy.yml` 第 35 行 `path: site` |
| 线上 404 | Settings → Pages 的 Source 没选 GitHub Actions | 重新选一次，再推一版触发 |
| 栏目点了 404 | `NAV` 里的 href 指向的页面不存在 | 对比 7 个手写页面的文件名 |
| 工作流没有 pages 权限 | 仓库把 Pages 关了，或权限被改过 | `deploy.yml` 第 8 到 11 行要 `contents: read`、`pages: write`、`id-token: write` |

页面没更新但 Actions 是绿的：Pages 的缓存。线上返回的响应头里有 `cache-control: max-age=600`，浏览器最多缓存 10 分钟。
等一会儿，或者按 Ctrl+Shift+R 硬刷新。仓库里没有缓存的配置，这是 Pages 的行为。

## 许可

[MIT](LICENSE)
