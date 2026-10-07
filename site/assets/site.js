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
    function slugOf(prefix, name) {
        var h = 5381;
        for (var i = 0; i < name.length; i++) {
            h = ((h << 5) + h + name.charCodeAt(i)) >>> 0;
        }
        return prefix + "-" + h.toString(36);
    }

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
            var noteList = c.noteList || [];
            var html = '<section class="group course">';
            html += '<h2 id="' + esc(id) + '" data-toc-text="' + esc(c.name) + '">' + esc(c.name) +
                (c.term ? ' <span class="term">' + esc(c.term) + "</span>" : "") + "</h2>";
            if (c.intro) { html += "<p>" + esc(c.intro) + "</p>"; }
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
            if (el && el.getClientRects().length && el.getBoundingClientRect().top <= line) { active = item; }
        });
        tocLinks.forEach(function (item) {
            item.el.classList.toggle("active", item === active);
        });
    }

    renderViews();
    buildToc();
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
        } catch (e) {  }
    }
    var FOLD_OPEN_BY_DEFAULT = true;  

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
                if (/^H[2-6]$/.test(el.tagName) && headingLevel(el) <= level) { break; }
                nodes.push(el);
                el = el.nextElementSibling;
            }
            if (!nodes.length) { return; }        

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

    function revealFromHash() {
        var id = location.hash ? decodeURIComponent(location.hash.slice(1)) : "";
        if (!id) { return; }
        var el = document.getElementById(id);
        if (!el) { return; }
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

    /* ==========================================================================
       复制正文时带上出处：选中的文字后面补一段「来源：页面标题 + 当前地址」。
       复制代码块里的内容不加，免得代码粘出去带尾巴。
       ========================================================================== */
    var COPY_SOURCE = true;   // 想关掉改成 false

    document.addEventListener("copy", function (e) {
        if (!COPY_SOURCE || !e.clipboardData) { return; }
        var sel = window.getSelection();
        if (!sel || sel.isCollapsed || !sel.rangeCount) { return; }
        var text = String(sel.toString());
        if (!text.replace(/\s/g, "")) { return; }

        var node = sel.getRangeAt(0).commonAncestorContainer;
        var el = node && node.nodeType === 1 ? node : (node ? node.parentElement : null);
        var box = document.getElementById("content") || document.body;
        if (el && !box.contains(el)) { return; }
        if (el && el.closest("pre, code")) { return; }

        var head = document.querySelector(".page-title") ||
            document.querySelector(".hero-title") ||
            document.querySelector(".toc-page");
        var title = head ? head.textContent.trim() : document.title;
        var url = location.href.split("#")[0];

        e.clipboardData.setData("text/plain", text + "\n\n来源：" + title + "\n" + url);
        e.preventDefault();
    });

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
