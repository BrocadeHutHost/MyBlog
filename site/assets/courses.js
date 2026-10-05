/* ==========================================================================
   ⚠ 这个文件由 tools/build-blog.mjs 自动生成，不要手改。
   要改内容请动源文件，然后重新跑：node tools/build-blog.mjs
   ========================================================================== */

/* 这门课的资料清单是扫 site/files/<slug>/ 自动生成的：只要建好文件夹、把文件丢进去，文件名和大小都会自动读出来。
   课程名默认就是文件夹名；学期、简介、资料备注想写才写，放在 site/files/<slug>/course.json 里。
   感悟与笔记：一篇笔记一个 md，文件名 note_<课程>_<笔记名>.md，放 site/files/<slug>/ 里或统一的 site/notes/ 里都行（笔记里引用的图片不算资料）。
   也可以只用 site/files/<slug>/notes.md 一篇，或者 course.json 的 notes 数组（纯文本）。 */
window.COURSES = [
    {
        slug: "SM",
        name: "高等数学",
        term: "2025 秋-2026春",
        files: [
            {"name":"高等数学 上册 第八版 (同济大学版).pdf","file":"files/SM/高等数学 上册 第八版 (同济大学版).pdf","size":"85.27 MB"},
            {"name":"高等数学 下册 第八版 (同济大学版).pdf","file":"files/SM/高等数学 下册 第八版 (同济大学版).pdf","size":"76.04 MB"}
        ],
        notes: [],
        notesHtml: "<ul class=\"note-index\"><li><a href=\"#course-SM-note-1\">第8章 向量代数与空间解析几何</a> <span class=\"todo-note\">待补充</span></li></ul><article class=\"note note-item\" id=\"course-SM-note-1\"><h3 class=\"note-title\" id=\"course-SM-note-1-title\">第8章 向量代数与空间解析几何 <span class=\"todo-note\">待补充</span></h3><div class=\"note-body\" data-no-toc><h2 id=\"第一节向量及其线性运算\">第一节向量及其线性运算</h2>\n<h3 id=\"简单概念\">简单概念</h3>\n<blockquote>\n<p>矢量：既有大小又有方向的量两向量的夹角：规定以不超过π的角度为向量a，b的夹角,记作<img src=\"files/SM/image.png\" alt=\"alt text\" width=\"53\" height=\"41\" loading=\"lazy\" decoding=\"async\">向量平行：终点和公共起点应在一条直线向量共面：起点放在同一点，如果k个终点和公共起点在一个平面上，就称这k个向量共面向量加减：省略</p>\n</blockquote>\n<h3 id=\"二级小节\">二级小节</h3>\n<p>左侧目录的二级。</p>\n<h2 id=\"第二个小节\">第二个小节</h2>\n<ul class=\"bullets\">\n<li>列表项</li>\n<li>列表项</li>\n</ul></div></article>"
    },
    {
        slug: "SS",
        name: "语义通讯",
        term: "2026 秋",
        files: [
            {"name":"Semantic_Communication_Based_on_Large_Language_Model_for_Underwater_Image_Transmission.pdf","file":"files/SS/Semantic_Communication_Based_on_Large_Language_Model_for_Underwater_Image_Transmission.pdf","size":"2.75 MB"},
            {"name":"语义引导的水下带噪语音通信.pdf","file":"files/SS/语义引导的水下带噪语音通信.pdf","size":"3.87 MB"}
        ],
        notes: []
    }
];
