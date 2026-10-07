# 锦的博客网站

> 前言：网上个人博客众多，动效华丽好看，但是作为长期个人网站运营，复杂的动效难以维护，也会与内容喧宾夺主，所以我选择以简约风格部署网站，尽量呈现博客核心内容  
> 原项目由 C# + Avalonia 跨平台框架生成，由于性能问题改为传统技术栈。

- 仓库：<https://github.com/BrocadeHutHost/MyBlog>
- 线上示例：<https://brocadehuthost.github.io/MyBlog/>
- 许可：[MIT](LICENSE)
- 环境：Node 18+

仓库只放源文件：md、7 个手写页面、css、js、KaTeX、生成脚本。生成物见 [生成物不入库](#生成物不入库)

## 如果想要改为自己的博客，请改这几处

| 项目 | 文件位置 |
| --- | --- |
| 站名、作者名 | `tools/build-blog.mjs` 里的 `SITE_NAME`；`site/` 下 7 个手写页面：`index.html`、`articles.html`、`courses.html`、`categories.html`、`tags.html`、`about.html`、`404.html` |
| 头像 | 同上。`tools/build-blog.mjs` 里的 `AVATAR_URL`，页面里的 `avatars.githubusercontent.com/<用户名>?s=256` |
| 页脚 | 同上（`© 2026 锦 · 纯静态站点，托管于 GitHub Pages`） |
| 顶栏栏目 | `tools/build-blog.mjs` 里的 `NAV`，页面里的 `<nav class="topnav">` |
| 示例内容 | 删掉 `site/posts/` 和 `site/files/` 里的东西，换成自己的 |

# **下面的内容由DeepSeek根据项目生成，本人审核并保证内容有效**
## 本地查看

```powershell
git clone https://github.com/BrocadeHutHost/MyBlog.git my-blog
cd my-blog
node tools/build-blog.mjs --watch --serve
```

随后打开 <http://127.0.0.1:8080/>

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

约 1 分钟后刷新 <https://brocadehuthost.github.io/MyBlog/>。
仓库 **Settings → Pages → Build and deployment → Source** 选 **GitHub Actions**。

- 换成自己的仓库，代码不用改，全站相对路径
- 项目页（`<用户名>.github.io/<仓库名>/`）和用户页（`<用户名>.github.io/`）都能用
- 自定义域名：Pages 里填域名，仓库加一个 `CNAME` 文件
- 别写 `/assets/...` 这种开头的路径，项目页下会 404；脚本会把 md 里用绝对路径的图片报错


## 许可

[MIT](LICENSE)
