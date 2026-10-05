/* ==========================================================================
   ⚠ 这个文件由 tools/build-blog.mjs 自动生成，不要手改。
   要改内容请动源文件，然后重新跑：node tools/build-blog.mjs
   ========================================================================== */

/* 原标题、日期、分类、标签、摘要、阅读时长都从 site/posts/<slug>/index.md 的 front matter 来，
   摘要和阅读时长不写也会自动算出来。 */
window.POSTS = [
    {
        slug: "markdown-guide",
        title: "用 Markdown 写博客：这里支持哪些写法",
        date: "2026-10-05",
        category: "随笔",
        tags: ["Markdown","写作"],
        excerpt: "每篇文章就是一个 index.md，图片跟它放一起、用相对路径引用；页面、文章清单、图片尺寸和图注都由脚本自动生成。",
        minutes: 2,
        draft: false
    },
    {
        slug: "hello-world",
        title: "Hello World",
        date: "2026-10-04",
        category: "随笔",
        tags: ["入门","博客"],
        excerpt: "博客的第一篇文章：为什么要写、第一行代码，以及这个站是怎么搭起来的。",
        minutes: 1,
        draft: false
    }
];
