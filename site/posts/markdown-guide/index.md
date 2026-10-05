---
title: 用 Markdown 写博客：用于我备忘
date: 2026-10-05
category: 随笔
tags: [Markdown, 写作]
excerpt: 每篇文章就是一个 index.md，图片跟它放一起、用相对路径引用；页面、文章清单、图片尺寸和图注都由脚本自动生成。
---

这个站现在用 Markdown 写文章。你只需要在 `site/posts/` 下建一个以短名命名的文件夹，
里面放一个 `index.md`，剩下的（页面、左侧目录、文章清单、图片尺寸）都交给脚本。

## 一篇文章长什么样

```text
site/posts/my-post/           ← 文件夹名就是 URL 里的短名
    index.md                  ← 正文，front matter 写标题 / 日期 / 分类 / 标签
    cover.png                 ← 图片跟 md 放一起，正文里写 cover.png 就行
```

生成出来的页面是 `site/my-post.html`，文章清单 `site/assets/posts.js` 会自动更新。

## 图片：相对路径就够，别的脚本自己读

正文里用相对路径引用图片（相对的是这个 md 所在的文件夹）：

```markdown
![图片说明](cover.png)
```

脚本会自动读图片的文件名、大小和真实像素尺寸，输出成这样：

![示例图片：图注里的文件名、大小和尺寸都是脚本自己读出来的](cover.png)

有了真实尺寸，图片加载前浏览器就能先把位置留出来，正文不会跳一下；
图注里的这三样信息也都是脚本从磁盘上读的，不用手写。

## 小标题就是左侧目录

`##` 是目录一级，`###` 是目录二级，页面加载时由 `assets/site.js` 生成，不用手工维护。
本文左边的目录就是这几行生成的。

### 二级小节长这样

标题里带中文也没关系，锚点会自动生成；想自己指定锚点，就在标题末尾写 `{#自定义-id}`。

## 列表、表格、引用、代码

无序列表（可以嵌套）：

- 第一项
- 第二项
    - 嵌套的第二层
    - 再一条
- 第三项

有序列表：

1. 第一步
2. 第二步
3. 第三步

表格：

| 写法 | 效果 | 备注 |
| --- | :--: | ---: |
| `**粗体**` | **粗体** | 斜体用 `*斜体*` |
| `~~删除~~` | ~~删除~~ | 也有 `行内代码` |
| `> 引用` | 见下面的引用块 | 支持多段 |

> 引用块用来放提醒、原文摘录之类的。
> 里面也能放 `行内代码` 和**强调**。

代码块标明语言，第一行会显示语言名：

```javascript
const posts = fs.readdirSync("site/posts");
console.log(posts.length + " 个文件夹");
```

分隔线：

---

链接写法照旧，指向别的 md 时脚本会自动换成生成后的地址：

- [回到 Hello World](hello-world.md)
- [GitHub 仓库](https://github.com/BrocadeHutHost/MyBlog)

## 生成命令

```powershell
node tools/build-blog.mjs            # 生成
node tools/build-blog.mjs --watch    # 边写边生成
node tools/build-blog.mjs --serve    # 顺手起个本地服务器
```

`site/assets/posts.js`、`site/assets/courses.js` 和 `site/<短名>.html` 都是生成物，
不要手改；改 md 后重新跑一遍就行。
