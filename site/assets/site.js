/* ==========================================================================
   站点脚本：只干三件事
     1. 按页面上的 data-view 渲染内容（文章卡片 / 课程资料）
     2. 从正文的小标题自动生成左侧两级目录
     3. 滚动时高亮目录里当前的小节
   页面导航、正文、页脚都是写死在 HTML 里的，禁用 JS 也能读。
   ========================================================================== */
(function () {
    "use strict";

    var POSTS = (window.POSTS || []).slice().sort(function (a, b) {
        return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
    });
    var COURSES = window.COURSES || [];

    function esc(s) {
        return String(s).replace(/[&<>"]/g, function (c) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
        });
    }

    /* 中文分类/标签名生成稳定的 ASCII 锚点（同名永远同一个 id） */
    function slugOf(prefix, name) {
        var h = 5381;
        for (var i = 0; i < name.length; i++) {
            h = ((h << 5) + h + name.charCodeAt(i)) >>> 0;
        }
        return prefix + "-" + h.toString(36);
    }

    /* ---------------- 文章 ---------------- */

    function card(p) {
        var chips = '<span class="chip">' + esc(p.category) + "</span>";
        if (p.draft) {
            chips += '<span class="chip chip-todo">待补充</span>';
        }
        return (
            '<article class="card">' +
            '<div class="card-top">' + chips + '<span class="card-date">' + esc(p.date) + "</span></div>" +
            '<h3 class="card-title" id="post-' + esc(p.slug) + '">' +
            '<a href="' + esc(p.slug) + '.html">' + esc(p.title) + "</a></h3>" +
            '<p class="card-excerpt">' + esc(p.excerpt) + "</p>" +
            '<p class="card-meta">约 ' + esc(p.minutes) + " 分钟阅读 · " +
            '<a href="' + esc(p.slug) + '.html">阅读全文 →</a></p>' +
            "</article>"
        );
    }

    function cards(list) {
        return '<div class="cards">' + list.map(card).join("") + "</div>";
    }

    function viewLatest(root) {
        var limit = Number(root.dataset.limit || 3);
        root.innerHTML = cards(POSTS.slice(0, limit));
    }

    function viewArchive(root) {
        var years = [];
        POSTS.forEach(function (p) {
            var y = p.date.slice(0, 4);
            var g = years.filter(function (x) { return x.year === y; })[0];
            if (!g) { g = { year: y, posts: [] }; years.push(g); }
            g.posts.push(p);
        });
        root.innerHTML = years.map(function (g) {
            return '<section class="group">' +
                '<h2 id="year-' + esc(g.year) + '" data-toc-text="' + esc(g.year) + ' 年">' + esc(g.year) + " 年</h2>" +
                cards(g.posts) +
                "</section>";
        }).join("");
    }

    function groupBy(list, key) {
        var groups = [];
        list.forEach(function (p) {
            key(p).forEach(function (name) {
                var g = groups.filter(function (x) { return x.name === name; })[0];
                if (!g) { g = { name: name, posts: [] }; groups.push(g); }
                g.posts.push(p);
            });
        });
        return groups.sort(function (a, b) {
            return b.posts.length - a.posts.length || (a.name < b.name ? -1 : 1);
        });
    }

    function viewCategories(root) {
        var groups = groupBy(POSTS, function (p) { return [p.category]; });
        var html = '<h2 id="cat-all">全部分类</h2><p class="page-sub">共 ' + POSTS.length + " 篇文章，按分类归拢。</p>";
        html += groups.map(function (g) {
            return '<section class="group">' +
                '<div class="indent-3">' +
                '<h3 id="' + slugOf("cat", g.name) + '">' + esc(g.name) + "（" + g.posts.length + "）</h3>" +
                '<div data-no-toc>' + cards(g.posts) + "</div>" +
                "</div></section>";
        }).join("");
        root.innerHTML = html;
    }

    function viewTags(root) {
        var groups = groupBy(POSTS, function (p) { return p.tags || []; });
        var cloud = groups.map(function (g) {
            return '<a class="tag-chip" href="#' + slugOf("tag", g.name) + '">' + esc(g.name) +
                '<span class="count">' + g.posts.length + "</span></a>";
        }).join("");
        var html = '<h2 id="tag-cloud">标签云</h2><div data-no-toc>' + cloud + "</div>";
        html += '<h2 id="tag-browse">按标签浏览</h2>';
        html += groups.map(function (g) {
            return '<section class="group">' +
                '<div class="indent-3">' +
                '<h3 id="' + slugOf("tag", g.name) + '">' + esc(g.name) + "（" + g.posts.length + "）</h3>" +
                '<div data-no-toc>' + cards(g.posts) + "</div>" +
                "</div></section>";
        }).join("");
        root.innerHTML = html;
    }

    /* ---------------- 课程资料 ---------------- */

    function fileType(name) {
        var ext = String(name || "").split(".").pop().toLowerCase();
        if (ext === "ppt" || ext === "pptx") { return "PPT"; }
        if (ext === "pdf") { return "PDF"; }
        if (ext === "doc" || ext === "docx") { return "Word"; }
        if (ext === "xls" || ext === "xlsx") { return "Excel"; }
        if (ext === "zip" || ext === "7z" || ext === "rar") { return "压缩包"; }
        if (ext === "md" || ext === "txt") { return "文本"; }
        if (ext === "mp4" || ext === "mkv" || ext === "mov") { return "视频"; }
        return "文件";
    }

    function typeClass(name) {
        var t = fileType(name);
        if (t === "PPT") { return "ppt"; }
        if (t === "PDF") { return "pdf"; }
        if (t === "Word" || t === "Excel") { return "doc"; }
        if (t === "压缩包" || t === "视频") { return "zip"; }
        return "other";
    }

    function fileRow(f) {
        var path = f.file || f.url || "";
        var label = f.name || path.split("/").pop();
        var href = f.url || f.file;
        var attrs = f.url ? ' target="_blank" rel="noopener"' : " download";
        return '<li class="file-row">' +
            '<span class="filetype ' + typeClass(label || path) + '">' + esc(fileType(label || path)) + "</span>" +
            '<a class="file-name" href="' + esc(href) + '"' + attrs + ">" + esc(label) + "</a>" +
            (f.size ? '<span class="file-size">' + esc(f.size) + "</span>" : "") +
            (f.note ? '<span class="file-note">' + esc(f.note) + "</span>" : "") +
            "</li>";
    }

    function fileList(files) {
        return '<ul class="files">' + files.map(fileRow).join("") + "</ul>";
    }

    function viewCourses(root) {
        if (!COURSES.length) {
            root.innerHTML = '<p class="page-sub">还没有课程。</p>';
            return;
        }
        root.innerHTML = COURSES.map(function (c) {
            var id = "course-" + c.slug;
            var files = c.files || [];
            var notes = c.notes || [];
            /* noteList 是课程笔记（每篇一个独立页面）；没有笔记时才退回 notes 的纯文本段落 */
            var noteList = c.noteList || [];
            var html = '<section class="group course">';
            html += '<h2 id="' + esc(id) + '" data-toc-text="' + esc(c.name) + '">' + esc(c.name) +
                (c.term ? ' <span class="term">' + esc(c.term) + "</span>" : "") + "</h2>";
            if (c.intro) { html += "<p>" + esc(c.intro) + "</p>"; }

            /* h3 和它下面的内容一起包进 .indent-3，跟正文里的层级缩进保持一致 */
            html += '<div class="indent-3">' +
                '<h3 id="' + esc(id) + '-files" data-toc-text="资料">资料' +
                (files.length ? "" : ' <span class="todo-note">待补充</span>') + "</h3>";
            html += files.length
                ? fileList(files)
                : '<p class="page-sub">资料还没整理上来，先空着。</p>';
            html += "</div>";

            html += '<div class="indent-3">' +
                '<h3 id="' + esc(id) + '-notes" data-toc-text="感悟与笔记">感悟与笔记' +
                (noteList.length || notes.length ? "" : ' <span class="todo-note">待补充</span>') + "</h3>";
            if (noteList.length) {
                /* 只列笔记目录，正文在各自的页面里，课程页不铺开 */
                html += '<ul class="note-index">' + noteList.map(function (n) {
                    return '<li><a href="notes/' + esc(n.slug) + '.html">' + esc(n.title) + "</a>" +
                        (n.draft ? ' <span class="todo-note">待补充</span>' : "") + "</li>";
                }).join("") + "</ul>";
            } else if (notes.length) {
                html += notes.map(function (t) { return "<p>" + esc(t) + "</p>"; }).join("");
            } else {
                html += '<p class="page-sub">还没写。</p>';
            }
            html += "</div>";

            return html + "</section>";
        }).join("");
    }

    function renderViews() {
        var views = {
            latest: viewLatest,
            archive: viewArchive,
            categories: viewCategories,
            tags: viewTags,
            courses: viewCourses
        };
        document.querySelectorAll("[data-view]").forEach(function (root) {
            var fn = views[root.dataset.view];
            if (fn) { fn(root); }
        });
    }

    /* ---- 左侧目录：正文里的 h2 = 一级，h3 = 二级 ---- */

    var tocLinks = [];

    function tocText(h) {
        return (h.dataset.tocText || h.textContent).trim().replace(/\s*待补充$/, "");
    }

    function buildToc() {
        var toc = document.getElementById("toc");
        if (!toc) { return; }

        var pageName = document.getElementById("toc-page");
        var heading = document.querySelector(".page-title");
        if (pageName && heading) { pageName.textContent = heading.textContent.trim(); }

        var nodes = [].slice.call(document.querySelectorAll("#content h2[id], #content h3[id]"))
            .filter(function (h) { return !h.closest("[data-no-toc]"); });

        var items = [];
        var current = null;
        nodes.forEach(function (h) {
            var entry = { id: h.id, text: tocText(h) };
            if (h.tagName === "H2" || !current) {
                current = { id: entry.id, text: entry.text, children: [] };
                items.push(current);
            } else {
                current.children.push(entry);
            }
        });

        toc.innerHTML = items.map(function (it) {
            var sub = it.children.length
                ? '<div class="toc-sub">' + it.children.map(function (c) {
                      return '<a class="toc-sublink" href="#' + esc(c.id) + '">' + esc(c.text) + "</a>";
                  }).join("") + "</div>"
                : "";
            return '<div class="toc-group">' +
                '<a class="toc-link" href="#' + esc(it.id) + '">' + esc(it.text) + "</a>" + sub +
                "</div>";
        }).join("");

        tocLinks = [].slice.call(toc.querySelectorAll(".toc-link, .toc-sublink")).map(function (a) {
            return { id: a.getAttribute("href").slice(1), el: a };
        });
    }

    function highlightToc() {
        if (!tocLinks.length) { return; }
        var bar = document.querySelector(".topbar");
        var line = (bar ? bar.offsetHeight : 56) + 24;
        var active = tocLinks[0];
        tocLinks.forEach(function (item) {
            var el = document.getElementById(item.id);
            /* 折叠起来的小节不参与高亮（display:none 时 boundingRect 全是 0） */
            if (el && el.getClientRects().length && el.getBoundingClientRect().top <= line) { active = item; }
        });
        tocLinks.forEach(function (item) {
            item.el.classList.toggle("active", item === active);
        });
    }

    renderViews();
    buildToc();

    /* 页面里有公式时，生成器会引入 KaTeX；这里把 \(…\) 和 \[…\] 排成真正的公式。
       没引入（页面里没公式）或加载失败时，就保留原始 LaTeX 文本，不影响阅读。 */
    if (window.renderMathInElement) {
        try {
            window.renderMathInElement(document.getElementById("content") || document.body, {
                delimiters: [
                    { left: "$$", right: "$$", display: true },
                    { left: "\\(", right: "\\)", display: false },
                    { left: "\\[", right: "\\]", display: true }
                ],
                ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code", "option"],
                throwOnError: false
            });
        } catch (e) { /* 排版失败就算了，公式源码还在 */ }
    }

    /* ==========================================================================
       按标题展开 / 收起正文：点标题就把它下面的内容折起来（再点展开）。
       折叠是靠给内容加 .fold-hidden 实现的，所以：
         · 禁用 JS 时什么都不会折叠，页面照常完整可读；
         · 从左侧目录跳到被折叠的小节时，会自动把沿途展开。
       ========================================================================== */
    var FOLD_OPEN_BY_DEFAULT = true;   // 想默认全部收起（只看到标题），把它改成 false

    var folds = [];

    function headingLevel(el) { return Number(el.tagName.charAt(1)); }

    function setFold(entry, open) {
        entry.open = open;
        entry.nodes.forEach(function (n) { n.classList.toggle("fold-hidden", !open); });
        entry.head.classList.toggle("collapsed", !open);
        entry.head.setAttribute("aria-expanded", open ? "true" : "false");
    }

    function setupFolds() {
        var heads = [].slice.call(document.querySelectorAll("#content h2[id], #content h3[id], #content h4[id]"))
            .filter(function (h) { return !h.closest("[data-no-toc]"); });

        heads.forEach(function (h) {
            var level = headingLevel(h);
            var nodes = [];
            var el = h.nextElementSibling;
            while (el) {
                /* 遇到同级或更高级的标题就停：那已经不属于这个小节了 */
                if (/^H[2-6]$/.test(el.tagName) && headingLevel(el) <= level) { break; }
                nodes.push(el);
                el = el.nextElementSibling;
            }
            if (!nodes.length) { return; }        // 底下没内容的标题不折

            var entry = { head: h, nodes: nodes, open: FOLD_OPEN_BY_DEFAULT };
            folds.push(entry);
            h.classList.add("fold-head");
            h.setAttribute("tabindex", "0");
            setFold(entry, FOLD_OPEN_BY_DEFAULT);

            h.addEventListener("click", function () { setFold(entry, !entry.open); });
            h.addEventListener("keydown", function (e) {
                if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
                    e.preventDefault();
                    setFold(entry, !entry.open);
                }
            });
        });
    }

    /* 跳到某个锚点（目录链接）时，把它所在的折叠小节逐层展开 */
    function revealFromHash() {
        var id = location.hash ? decodeURIComponent(location.hash.slice(1)) : "";
        if (!id) { return; }
        var el = document.getElementById(id);
        if (!el) { return; }
        /* 从目标一路往上找：只要某一层被折叠藏着，就把那一层展开 */
        while (el && el !== document.body) {
            folds.forEach(function (f) {
                if (f.head === el || f.nodes.indexOf(el) >= 0) { setFold(f, true); }
            });
            el = el.parentElement;
        }
    }

    setupFolds();
    revealFromHash();
    window.addEventListener("hashchange", revealFromHash);

    var ticking = false;
    window.addEventListener("scroll", function () {
        if (ticking) { return; }
        ticking = true;
        window.requestAnimationFrame(function () {
            highlightToc();
            ticking = false;
        });
    }, { passive: true });
    highlightToc();
})();
