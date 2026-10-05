# MyBlog

一个纯静态的个人博客：**Markdown 写文章** + 一个零依赖的生成脚本 + 手写的页面外壳，
推送到 `main` 分支就自动发布到 GitHub Pages。

- 仓库：<https://github.com/BrocadeHutHost/MyBlog>
- 线上地址：<https://brocadehuthost.github.io/MyBlog/>

## 栏目

| 顶栏栏目 | 文件 | 页面内容 | 左侧目录 |
| --- | --- | --- | --- |
| 首页 | `site/index.html` | 站点介绍 + 最新文章 | 最新文章（→ 每篇）、关于本站（→ 本站做什么 / 怎么读） |
| 文章 | `site/articles.html` | 按年份归档的全部文章 | 年份（→ 该年每一篇）、归档说明 |
| 课程 | `site/courses.html` | 按课程放的资料（PPT / PDF / Word / 压缩包）+ 感悟笔记 | 课程名（→ 资料 / 感悟与笔记） |
| 分类 | `site/categories.html` | 按分类分组的文章 | 全部分类（→ 每个分类） |
| 标签 | `site/tags.html` | 标签云 + 按标签分组 | 标签云、按标签浏览（→ 每个标签） |
| 关于 | `site/about.html` | 作者与站点说明 | 关于作者（作者简介 / 联系作者）、关于本站（使用指南 / 制作方法 / 更新日志） |

第一篇文章是 **《Hello World》**：源文件 `site/posts/hello-world/index.md`，
生成的页面是 `site/hello-world.html`。

## 头像与站名

顶栏的小圆头像、首页的大圆头像、浏览器标签页上的图标，用的是同一个地址——直接引用 GitHub 头像，
**仓库里不放图片**：你换了 GitHub 头像，刷新页面就跟着变（浏览器会缓存一份）。

```text
https://avatars.githubusercontent.com/BrocadeHutHost?s=256
```

要换成别的图、或者改站名（「锦 的博客」）：手写的页面在 `site/*.html` 里改；
每篇文章页面在 `tools/build-blog.mjs` 顶部的 `AVATAR_URL` 和 `SITE_NAME` 改，然后重新生成。

## 写一篇文章

1. 建文件夹 `site/posts/<短名>/`——`<短名>` 就是 URL（例如 `wpf-to-avalonia`）；
2. 里面写一个 `index.md`，开头一段 front matter 写标题、日期这些：

```markdown
---
title: 从 WPF 迁移到 Avalonia 的样式与控件映射
date: 2026-10-06
category: 桌面开发
tags: [WPF, Avalonia]
excerpt: 一句话摘要，显示在卡片上；不写就自动取正文第一段。
lead: 标题下面那句引言，可以不写。
# minutes: 9      # 不写就按正文字数自动算
# draft: true     # 还没写完，列表里会显示「待补充」
---

## 第一个小节

正文写在这里。`##` 是左侧目录的一级，`###` 是二级，锚点自动生成，
也能自己指定：`## 小节名 {#custom-id}`。
```

3. 跑一遍生成：

```powershell
node tools/build-blog.mjs
```

它会生成 `site/<短名>.html`，并重写文章清单 `site/assets/posts.js`。
首页的「最新文章」、文章页的归档、分类页、标签页都跟着自动更新。

`site/posts/_template/` 里有一份可以直接照抄的模板（`_` 开头的文件夹不会被生成）。

## 图片

图片跟 `index.md` 放在同一个文件夹里，正文用**相对路径**引用：

```markdown
![图片说明](cover.png)
```

生成时脚本会读图片的真实像素尺寸和文件大小，输出成 `<figure>` + `<figcaption>`：
`width`/`height` 让浏览器在图片加载前就留好位置（正文不会跳），图注自动是
「文件名 · 大小 · 尺寸」。**尺寸和图注都不用自己写**，图片放在哪就引用哪，不用搬家。

## 支持的 Markdown 写法

小标题（`##`/`###`/`####`）、段落、**粗体**、*斜体*、`行内代码`、~~删除线~~、
有序 / 无序（可嵌套）列表、引用、围栏代码块（标了语言就显示语言名）、GFM 表格、
分隔线、链接、图片、行内 HTML 直接透传。

链接指向站内另一篇 md（比如 `hello-world.md`）时，生成时自动换成生成后的地址，
不用管页面文件名。

## 课程资料（PPT / PDF / Word / 压缩包）

一门课在「课程」页上是一节，里面分「资料」和「感悟与笔记」两块。左侧目录会自动列出
「课程名 → 资料 / 感悟与笔记」，不用手工维护。

**加一门课，只做一件事就够了：**

1. 在 `site/files/` 下建一个文件夹，比如 `site/files/ml/`，把文件丢进去
   （文件夹名就是课程名；子文件夹也会被递归扫到）；
2. 推上去（或者本地跑一遍 `node tools/build-blog.mjs`）。

脚本会递归扫这个文件夹，把**每个文件的名字和体积**（`12.5 MB` 这种）自动写进
`site/assets/courses.js`，页面上直接就是可下载的清单——不用手算大小，不用手敲清单。
`course.json`、`.gitkeep` 这类文件会被跳过。

**`course.json` 是可选的**，想多写点东西时才加（放在同一个文件夹里）：

```json
{
    "name": "机器学习",
    "term": "2026 秋",
    "intro": "一句话介绍这门课。",
    "fileNotes": { "hw01.pdf": "必做", "lecture01.pptx": "考试重点" },
    "links": [
        { "name": "往年题合集", "url": "https://pan.baidu.com/s/xxxx", "size": "120 MB", "note": "网盘" }
    ],
    "notes": [
        "感悟写在这里，一段一个字符串。"
    ],
    "order": 1
}
```

| 字段 | 作用 | 不写会怎样 |
| --- | --- | --- |
| `name` | 页面上显示的课程名 | 用文件夹名 |
| `term` | 学期，显示在课程名旁边 | 不显示 |
| `intro` | 课程名下面的一句话 | 不显示 |
| `fileNotes` | 给具体文件加备注（键是文件名或相对路径） | 没有备注 |
| `links` | 外部链接（网盘等大文件），不做大小检查 | 不显示 |
| `notes` | 「感悟与笔记」的段落 | 显示「还没写」 |
| `order` | 课程之间的排序（越小越前） | 按文件夹名排 |

**别在 `course.json` 里列文件**——文件清单是扫出来的，列了也不看。

`files` 一项都没有、`notes` 是空数组时，页面上会显示「待补充」，不会有死链。

**文件大小要注意：** GitHub 对**超过 100 MB 的单个文件直接拒绝推送**，50 MB 以上会警告；
GitHub Pages 也不适合放大文件（站点总体积也有限制）。所以单个文件尽量压在 50 MB 以内，
更大的（录屏、几百 MB 的压缩包）放网盘，用 `links` 字段链接过来。生成脚本会把超标的文件
直接点出来（超过 50 MB 警告，超过 100 MB 直接算错误）。另外**不要用 Git LFS**——
Pages 不会解析 LFS，下载到的是指针文件而不是真文件。

> 早先的 `tools/scan-files.ps1` 只干「列一遍文件大小」这件事，现在用不上了，
> 留着当参考。

## 目录结构

```
site/                     ← 整个网站就是这一个目录，GitHub Pages 发布的就是它
  index.html              首页（手写）
  articles.html           文章（归档）
  courses.html            课程（资料 + 笔记）
  categories.html         分类
  tags.html               标签
  about.html              关于
  404.html                找不到页面时的兜底页
  <短名>.html             ★ 每篇文章（由 md 生成，不要手改）
  posts/                  ★ 文章源文件：posts/<短名>/index.md，图片就放它旁边
    _template/index.md    新文章模板（_ 开头，不参与生成）
  files/                  课程资料（files/<课程>/，course.json 可选）
  assets/
    site.css              全站样式（配色、顶栏、左侧目录、卡片、代码块、图片、表格）
    site.js               渲染文章列表 / 课程资料 + 生成左侧目录 + 当前小节高亮（手写）
    posts.js              ★ 文章清单（生成物，不要手改）
    courses.js            ★ 课程资料清单（生成物，不要手改）
tools/
  build-blog.mjs          ★ 生成脚本：md → 页面 + 清单，顺手读图片尺寸和文件大小
  scan-files.ps1          旧的小工具：列一遍 files/ 下的文件大小
.github/workflows/deploy.yml   推送到 main 后发布 site/ 到 Pages
```

带 ★ 的文件都是**自动生成**的：改 `site/posts/` 或 `site/files/` 里的源文件，
推上去就行（工作流会现场生成一遍）；想在本地先看效果就自己跑一下脚本。

## 生成命令

需要 **Node 18+**（没有任何 npm 依赖，不用 `npm install`）：

```powershell
node tools/build-blog.mjs            # 生成一次
node tools/build-blog.mjs --watch    # 改 md / 课程资料就自动重新生成
node tools/build-blog.mjs --serve    # 顺手起本地服务器（默认 8080，用 --port 换）
node tools/build-blog.mjs --check    # 只看产物是不是最新的，不写文件（落后就退出码 1）
```

脚本会打印每次生成了哪些文件，以及所有警告 / 错误：比如图片路径写错、front matter
里有看不懂的行、文件超过 100 MB，都会直接点出来。有错误时退出码是 1。

## 本地预览

```powershell
node tools/build-blog.mjs --watch --serve
# 然后打开 http://127.0.0.1:8080/
```

也可以直接用浏览器打开 `site/index.html`（全站都是相对路径），或者用任意静态服务器：

```powershell
python -m http.server 8080 --directory site
```

## 部署

推送到 `main` 即可。工作流会先用 md 和课程资料**现场生成一遍**（所以本地没跑过脚本也不会漏页面），
再把 `site/` 目录作为 Pages 产物发布：

```powershell
git add -A
git commit -m "写点什么"
git push
```

约 1 分钟后刷新 <https://brocadehuthost.github.io/MyBlog/>。
仓库的 **Settings → Pages → Build and deployment → Source** 需要是 **GitHub Actions**（已配好）。

> 站点部署在 `/MyBlog/` 这个子路径下，所以全站链接都用**相对路径**（`assets/site.css`、`articles.html`），
> 不要写成 `/assets/...` 这样的绝对路径，否则子路径下会 404。生成脚本会把
> md 里的绝对路径图片直接报成错误。

## 关于旧版本

这个仓库早先有一版用 C# / Avalonia 编译成 WebAssembly 的博客（`src/`、`MyBlog.slnx`），
因为依赖 .NET SDK 与 wasm-tools、首屏要下载十几 MB、还容易被运行时环境卡住，已经移除，
改成现在这套纯 HTML 方案。旧代码仍留在 git 历史里（提交 `a27694a` 及之前），需要时可以找回：

```powershell
git checkout a27694a -- src MyBlog.slnx
```

`MyBlog/` 是最早的 WPF 占位工程，没有动它。
