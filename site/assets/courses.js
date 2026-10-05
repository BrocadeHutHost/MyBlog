/* ==========================================================================
   ⚠ 这个文件由 tools/build-blog.mjs 自动生成，不要手改。
   要改内容请动源文件，然后重新跑：node tools/build-blog.mjs
   ========================================================================== */

/* 这门课的资料清单是扫 site/files/<slug>/ 自动生成的：只要建好文件夹、把文件丢进去，文件名和大小都会自动读出来。
   课程名默认就是文件夹名；学期、简介、资料备注想写才写，放在 site/files/<slug>/course.json 里。
   感悟与笔记：一篇笔记一个 md，文件名 note_<课程>_<笔记名>.md，放 site/files/<slug>/ 里或统一的 site/notes/ 里都行（笔记里引用的图片不算资料）。
   每篇笔记会生成一个独立页面 site/notes/<短名>.html，这里只留笔记目录。
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
        noteList: [{"title":"第8章 向量代数与空间解析几何","slug":"SM-第8章向量代数与空间解析几何","draft":true}]
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
