/* ==========================================================================
   博客生成器（零依赖，Node 18+）
   --------------------------------------------------------------------------
   把 Markdown 变成静态页面，把「文件名 / 大小」这类能自动读的东西都自动读掉：

     site/posts/<slug>/index.md   ──▶  site/<slug>.html        （文章页面）
                                     ──▶  site/assets/posts.js （文章清单）
     site/files/<课程>/           ──▶  site/assets/courses.js （资料清单，含大小）

   md 里的图片用相对路径引用（图片跟 md 放一起即可），生成时会自动补上
   真实像素尺寸（防抖动）、alt、以及「文件名 · 大小 · 尺寸」图注。

   用法（在仓库根目录）：
     node tools/build-blog.mjs             生成
     node tools/build-blog.mjs --check     只检查产物是否最新（CI 用，落后则退出码 1）
     node tools/build-blog.mjs --watch     监听 md / 课程资料改动，自动重新生成
     node tools/build-blog.mjs --serve     顺带起一个本地静态服务器（默认 8080）
     node tools/build-blog.mjs --help      看这份说明

   ⚠ site/assets/posts.js、site/assets/courses.js、site/<slug>.html 都是
     「自动生成」的产物，不要手改，改 md / course.json 后重新跑一遍即可。
   ========================================================================== */

import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

/* ======================== 路径与常量 ======================== */

const TOOL_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(TOOL_DIR, "..");
const SITE = path.join(ROOT, "site");
const POSTS_SRC = path.join(SITE, "posts");
const FILES_SRC = path.join(SITE, "files");
const ASSETS = path.join(SITE, "assets");
const NOTES_DIR = path.join(SITE, "notes");   // 课程笔记页面生成到这里
const POSTS_JS = path.join(ASSETS, "posts.js");
const COURSES_JS = path.join(ASSETS, "courses.js");

const SITE_NAME = "锦 的博客";

/** 头像直接用 GitHub 上的地址（实时取，仓库里不放图片）：换了 GitHub 头像，页面跟着变 */
const AVATAR_URL = "https://avatars.githubusercontent.com/BrocadeHutHost?s=256";

/** 标签页图标 / 添加到主屏幕时用的图，和头像同一个地址，浏览器只会缓存一份 */
const ICON_LINKS =
    '    <link rel="icon" href="' + AVATAR_URL + '">\n' +
    '    <link rel="apple-touch-icon" href="' + AVATAR_URL + '">\n';

/** 数学公式用自托管的 KaTeX（site/assets/katex/），只有页面里真有公式时才引入 */
const KATEX_CSS = "assets/katex/katex.min.css";
const KATEX_SCRIPTS = ["assets/katex/katex.min.js", "assets/katex/auto-render.min.js"];

function katexCssTag(base) {
    return '    <link rel="stylesheet" href="' + (base || "") + KATEX_CSS + '">\n';
}

function katexScriptTags(base) {
    return KATEX_SCRIPTS
        .map((f) => '<script src="' + (base || "") + f + '"></script>')
        .join("\n") + "\n";
}

const NAV = [
    ["index.html", "首页"],
    ["articles.html", "文章"],
    ["courses.html", "课程"],
    ["categories.html", "分类"],
    ["tags.html", "标签"],
    ["about.html", "关于"]
];

/** 生成页面的标记（只删带这个标记的 html，手写的页面绝不碰） */
const BANNER_MARK = "本页面由 tools/build-blog.mjs 从 ";

/** 笔记页面放在 site/notes/ 里，所以它里面的相对路径都要退一级 */
const NOTES_BASE = "../";

/** 手写的页面，文章短名不能占用这些名字（否则会把页面覆盖掉） */
const RESERVED_SLUGS = new Set(["index", "articles", "courses", "categories", "tags", "about", "404", "assets", "posts", "files", "notes"]);

/** 正文里每个小标题前面插的哨兵（带层级），最后据此把正文包成一层层缩进 */
const headMark = (level) => "\u0000H" + level + "\u0000";

const GEN_JS_BANNER =
    "/* ==========================================================================\n" +
    "   ⚠ 这个文件由 tools/build-blog.mjs 自动生成，不要手改。\n" +
    "   要改内容请动源文件，然后重新跑：node tools/build-blog.mjs\n" +
    "   ========================================================================== */\n";

/* ======================== 命令行参数 ======================== */

const ARGS = process.argv.slice(2);

const OPT = {
    check: ARGS.includes("--check"),
    watch: ARGS.includes("--watch"),
    serve: ARGS.includes("--serve"),
    port: (() => {
        const i = ARGS.indexOf("--port");
        const v = i >= 0 ? Number(ARGS[i + 1]) : NaN;
        return Number.isInteger(v) && v > 0 && v < 65536 ? v : 8080;
    })()
};

if (ARGS.includes("--help") || ARGS.includes("-h")) {
    const self = fs.readFileSync(fileURLToPath(import.meta.url), "utf8");
    console.log(self.slice(self.indexOf("/* ===="), self.indexOf("===== */") + 9));
    process.exit(0);
}

/* ======================== 日志 / 结果 ======================== */

const report = {
    written: [],
    stale: [],
    warnings: [],
    errors: [],
    stats: { posts: 0, images: 0, courses: 0, files: 0, notes: 0 }
};

function warn(msg) {
    report.warnings.push(msg);
    console.log("  \u26a0 " + msg);
}

function fail(msg) {
    report.errors.push(msg);
    console.log("  \u2717 " + msg);
}

/** 提示（不算警告，也不影响退出码）：只是告诉你可以再做点什么 */
function info(msg) {
    console.log("  \u00b7 " + msg);
}

function relOf(file) {
    return path.relative(ROOT, file).split(path.sep).join("/");
}

/* ======================== 小工具 ======================== */

function esc(s) {
    return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function readText(file) {
    return fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
}

/** 和 tools/scan-files.ps1 保持一致的写法：1.50 MB / 800 KB / 512 B */
function formatSize(bytes) {
    if (bytes >= 1024 ** 3) { return (bytes / 1024 ** 3).toFixed(2) + " GB"; }
    if (bytes >= 1024 ** 2) { return (bytes / 1024 ** 2).toFixed(2) + " MB"; }
    if (bytes >= 1024) { return Math.round(bytes / 1024) + " KB"; }
    return bytes + " B";
}

const COLLATOR = new Intl.Collator("en", { numeric: true, sensitivity: "base" });
function naturalCompare(a, b) {
    return COLLATOR.compare(a, b);
}

const isCjk = (ch) => /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff00-\uffef]/.test(ch);

/** 段落里的软换行：中文之间直接接上，英文之间留一个空格 */
function joinSoft(a, b) {
    if (!a) { return b; }
    if (!b) { return a; }
    const l = a[a.length - 1];
    const r = b[0];
    if (isCjk(l) || isCjk(r)) { return a + b; }
    return a + " " + b;
}

/** 只写「内容真的变了」的文件；--check 模式下只记录，不落盘 */
function writeIfChanged(file, content) {
    const rel = relOf(file);
    let old = null;
    try { old = fs.readFileSync(file, "utf8"); } catch { /* 不存在 */ }
    // 生成物一律写 LF；比较时忽略 CRLF/LF 的差别，
    // 免得仓库开了 core.autocrlf 之后本地每次都误判成「不是最新」
    if (old !== null && old.replace(/\r\n/g, "\n") === content) { return false; }
    if (OPT.check) {
        report.stale.push(rel);
        return false;
    }
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content, "utf8");
    report.written.push(rel);
    return true;
}

/** 生成 .js 之前先过一遍语法，免得写出一个让整页脚本都挂掉的文件 */
function writeJs(file, content) {
    try {
        new vm.Script(content, { filename: relOf(file) });
    } catch (e) {
        fail("生成的 " + relOf(file) + " 语法不通，已跳过写入：" + e.message);
        return false;
    }
    return writeIfChanged(file, content);
}

/* ======================== 读图片的尺寸（不依赖任何库） ======================== */

function imageDimensions(buf, ext) {
    try {
        if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) {
            return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };   // PNG
        }
        if (buf.length > 10 && buf.slice(0, 3).toString("latin1") === "GIF") {
            return { w: buf.readUInt16LE(6), h: buf.readUInt16LE(8) };      // GIF
        }
        if (buf.length > 26 && buf[0] === 0x42 && buf[1] === 0x4d) {
            return { w: buf.readInt32LE(18), h: buf.readInt32LE(22) };      // BMP
        }
        if (buf.length > 30 && buf.slice(0, 4).toString("latin1") === "RIFF" &&
            buf.slice(8, 12).toString("latin1") === "WEBP") {
            const fourcc = buf.slice(12, 16).toString("latin1");
            if (fourcc === "VP8X") {
                const w = 1 + (buf[24] | (buf[25] << 8) | (buf[26] << 16));
                const h = 1 + (buf[27] | (buf[28] << 8) | (buf[29] << 16));
                return { w, h };
            }
            if (fourcc === "VP8L") {
                const b = buf.readUInt32LE(21);
                return { w: (b & 0x3fff) + 1, h: ((b >> 14) & 0x3fff) + 1 };
            }
            if (fourcc === "VP8 ") {
                return { w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff };
            }
            return null;
        }
        if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {          // JPEG
            let i = 2;
            while (i + 9 < buf.length) {
                if (buf[i] !== 0xff) { i++; continue; }
                const marker = buf[i + 1];
                if (marker === 0xff) { i++; continue; }
                const len = buf.readUInt16BE(i + 2);
                const isSof = marker >= 0xc0 && marker <= 0xcf &&
                    marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
                if (isSof) { return { w: buf.readUInt16BE(i + 7), h: buf.readUInt16BE(i + 5) }; }
                i += 2 + len;
            }
            return null;
        }
        if (ext === ".svg") {
            const text = buf.toString("utf8");
            const wAttr = /\bwidth\s*=\s*["']?([\d.]+)/i.exec(text);
            const hAttr = /\bheight\s*=\s*["']?([\d.]+)/i.exec(text);
            if (wAttr && hAttr) { return { w: Math.round(+wAttr[1]), h: Math.round(+hAttr[1]) }; }
            const vb = /viewBox\s*=\s*["']\s*[-\d.]+\s+[-\d.]+\s+([\d.]+)\s+([\d.]+)/i.exec(text);
            if (vb) { return { w: Math.round(+vb[1]), h: Math.round(+vb[2]) }; }
        }
    } catch { /* 认不出来就算了 */ }
    return null;
}

/* ======================== front matter ======================== */

function scalarOf(v) {
    const s = v.trim();
    if (/^".*"$/.test(s) || /^'.*'$/.test(s)) { return s.slice(1, -1); }
    if (/^(true|yes|on)$/i.test(s)) { return true; }
    if (/^(false|no|off)$/i.test(s)) { return false; }
    if (/^-?\d+(\.\d+)?$/.test(s)) { return Number(s); }
    return s;
}

/**
 * 解析开头的 YAML 风格 front matter（只实现博客用得到的子集）：
 *   title: 标题
 *   tags: [A, B]     或  tags:\n  - A\n  - B
 * 不认识的行只警告，不炸。
 */
function parseFrontMatter(text, label) {
    const m = /^(?:---|\+\+\+)\n([\s\S]*?)\n(?:---|\.\.\.)[ \t]*(?:\n|$)/.exec(text);
    if (!m) { return { data: {}, body: text, hasFm: false }; }

    const data = {};
    let key = null;
    for (const raw of m[1].split("\n")) {
        if (!raw.trim() || /^\s*#/.test(raw)) { continue; }
        const item = /^\s*[-*]\s+(.*)$/.exec(raw);
        if (item && key) {
            if (!Array.isArray(data[key])) { data[key] = []; }
            data[key].push(scalarOf(item[1]));
            continue;
        }
        const kv = /^([A-Za-z_][\w-]*)\s*:\s*(.*)$/.exec(raw);
        if (!kv) {
            warn(label + " front matter 这行看不懂，已忽略：" + raw.trim());
            continue;
        }
        key = kv[1];
        let value = kv[2].trim();
        // 去掉行尾注释：draft: true   # 还没写完 → true（引号里的 # 不算）
        if (!/^["']/.test(value)) {
            const hash = value.search(/\s#/);
            if (hash >= 0) { value = value.slice(0, hash).trim(); }
        }
        if (value === "") { data[key] = ""; }
        else if (/^\[.*\]$/.test(value)) {
            data[key] = value.slice(1, -1).split(",").map((s) => scalarOf(s)).filter((s) => s !== "");
        } else { data[key] = scalarOf(value); }
    }
    return { data, body: text.slice(m[0].length), hasFm: true };
}

/* ======================== Markdown：正文渲染 ======================== */

function plainText(md) {
    return md
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/<[^>]+>/g, " ")
        .replace(/[#>*_~`|:-]/g, " ");
}

function readingMinutes(md) {
    const text = plainText(md);
    const cjk = (text.match(/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/g) || []).length;
    const words = (text.match(/[A-Za-z0-9][A-Za-z0-9'-]*/g) || []).length;
    return Math.max(1, Math.round(cjk / 350 + words / 200));
}

function firstParagraph(md) {
    const lines = md.split("\n");
    let i = 0;
    while (i < lines.length) {
        const line = lines[i];
        if (!line.trim()) { i++; continue; }
        if (/^\s*(#{1,6}\s|```|~~~|>|\||<)/.test(line)) { i++; continue; }
        if (/^\s*([-*+]|\d+[.)])\s+/.test(line)) { i++; continue; }
        const buf = [];
        while (i < lines.length && lines[i].trim() && !/^\s*(#{1,6}\s|```|~~~)/.test(lines[i])) {
            buf.push(lines[i].trim());
            i++;
        }
        return plainText(buf.join(" ")).replace(/\s+/g, " ").trim();
    }
    return "";
}

function truncate(text, max) {
    const t = text.trim();
    return t.length <= max ? t : t.slice(0, max).replace(/[\s，。、,.]*$/, "") + "…";
}

/** 小标题 → 锚点 id：ASCII 转小写连字符，中文原样保留 */
function headingId(text, used) {
    let base = text
        .replace(/`([^`]*)`/g, "$1")
        .replace(/\*\*|__|\*|_|~~/g, "")
        .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/[^\p{L}\p{N}\s-]/gu, "")
        .trim()
        .replace(/\s+/g, "-")
        .toLowerCase();
    if (!base) { base = "section"; }
    let id = base;
    let n = 2;
    while (used.has(id)) { id = base + "-" + n++; }
    used.add(id);
    return id;
}

/**
 * 行内语法。思路：把「生成好的 HTML」和「原样透传的 HTML」先塞进占位符，
 * 再把剩下的纯文本整体转义，最后做粗体/斜体，并还原占位符。
 */
function inline(text, ctx, blockImage) {
    const tokens = [];
    const stash = (html) => "\u0000" + (tokens.push(html) - 1) + "\u0001";

    let s = String(text);

    // 0. 数学公式先抠出来：里面的 _ * \ 都是 LaTeX 语法，不能被 Markdown 当成强调/转义吃掉。
    //    $$…$$ 和 \[…\] 是独立公式，$…$ 和 \(…\) 是行内公式；
    //    这里只把公式包成 span，真正排版交给页面里的 KaTeX。
    const mathToken = (tex, display) => {
        ctx.hasMath = true;
        const body = esc(String(tex).trim());
        return display
            ? stash('<span class="math-block">\\[' + body + '\\]</span>')
            : stash('<span class="math">\\(' + body + '\\)</span>');
    };
    s = s.replace(/\$\$([\s\S]+?)\$\$/g, (m, tex) => mathToken(tex, true));
    s = s.replace(/\\\[([\s\S]+?)\\\]/g, (m, tex) => mathToken(tex, true));
    // 行内 $…$：前面不能是数字/美元符号、后面不能紧跟数字，
    // 免得「价格 $5 和 $10」这种被当成公式（这是各家 Markdown 的常见约定）
    s = s.replace(/(^|[^\d$])\$([^\s$][^$\n]*?)\$(?!\d)/g, (m, pre, tex) => pre + mathToken(tex, false));
    s = s.replace(/\\\(([\s\S]+?)\\\)/g, (m, tex) => mathToken(tex, false));

    // 1. 原样透传的 HTML 标签 / 注释
    s = s.replace(/<!--[\s\S]*?-->/g, (m) => stash(m));
    s = s.replace(/<\/?[A-Za-z][\w:-]*(?:"[^"]*"|'[^']*'|[^>"'])*\/?>/g, (m) => stash(m));

    // 2. 反斜杠转义
    s = s.replace(/\\([\\`*_{}\[\]()#+\-.!>~|])/g, (m, ch) => stash(esc(ch)));

    // 3. 行内代码
    s = s.replace(/(\x60+)([\s\S]*?)\1/g, (m, ticks, code) => stash("<code>" + esc(code.trim()) + "</code>"));

    // 4. 图片（相对路径在这里解析成从站点根出发的路径）
    s = s.replace(/!\[([^\]]*)\]\(\s*(?:<([^>\n]+)>|([^)\s]+))(?:\s+["']([^"']*)["'])?\s*\)/g,
        (m, alt, angled, bare, title) => stash(renderImage(alt, angled || bare, title, ctx, blockImage)));

    // 5. 链接（指向某篇 md 的会自动换成那篇的 html）
    s = s.replace(/\[([^\]]*)\]\(\s*(?:<([^>\n]+)>|([^)\s]+))(?:\s+["']([^"']*)["'])?\s*\)/g,
        (m, label, angled, bare, title) => {
            const href = linkTarget(angled || bare, ctx);
            const t = title ? ' title="' + esc(title) + '"' : "";
            const outer = /^[a-z]+:|^\/\//i.test(href)
                ? ' target="_blank" rel="noopener"'
                : "";
            return stash('<a href="' + esc(href) + '"' + t + outer + ">" + inline(label, ctx) + "</a>");
        });

    // 6. 尖括号自动链接
    s = s.replace(/<((?:https?|ftp):[^<>\s]+)>/g,
        (m, url) => stash('<a href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(url) + "</a>"));
    s = s.replace(/<([\w.+-]+@[\w-]+\.[\w.-]+)>/g,
        (m, mail) => stash('<a href="mailto:' + esc(mail) + '">' + esc(mail) + "</a>"));

    // 7. 剩下的纯文本整体转义
    s = esc(s);

    // 8. 粗体 / 斜体 / 删除线（此时占位符里的 HTML 不会被误伤）
    s = s.replace(/\*\*([^\s*](?:[\s\S]*?[^\s*])?)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/__([^\s_](?:[\s\S]*?[^\s_])?)__/g, "<strong>$1</strong>");
    s = s.replace(/~~([^\s~](?:[\s\S]*?[^\s~])?)~~/g, "<del>$1</del>");
    s = s.replace(/\*([^\s*](?:[\s\S]*?[^\s*])?)\*/g, "<em>$1</em>");
    s = s.replace(/(^|[\s(（])_([^\s_](?:[\s\S]*?[^\s_])?)_(?=[\s)）,.!?;:，。！？；：]|$)/g, "$1<em>$2</em>");

    // 9. 还原占位符
    return s.replace(/\u0000(\d+)\u0001/g, (m, i) => tokens[Number(i)] ?? m);
}

/** 图片 → <figure>，自动补 alt、像素尺寸，以及「文件名 · 大小」图注 */
function renderImage(alt, rawSrc, title, ctx, blockImage) {
    const src = String(rawSrc || "").trim();
    const remote = /^(https?:)?\/\//i.test(src) || /^data:/i.test(src);
    const altText = (alt || "").trim();
    const baseName = (src.split(/[?#]/)[0].split("/").pop() || "").trim();

    if (!remote && src.startsWith("/")) {
        fail(ctx.label + " 图片用了绝对路径 " + src + "，站点在子路径下会 404，请改成相对路径");
    }

    let url = src;
    let bytes = null;
    let dims = null;
    // 页面不在站点根目录时（比如 site/notes/xxx.html），相对路径要多退一级
    const base = ctx.base || "";

    if (!remote) {
        let decoded = src;
        try { decoded = decodeURIComponent(src); } catch { /* 保持原样 */ }
        const abs = path.resolve(ctx.dir, decoded);
        if (fs.existsSync(abs) && fs.statSync(abs).isFile()) {
            const stat = fs.statSync(abs);
            bytes = stat.size;
            dims = imageDimensions(fs.readFileSync(abs), path.extname(abs).toLowerCase());
            if (abs.startsWith(SITE + path.sep)) {
                url = base + path.relative(SITE, abs).split(path.sep).join("/");
            } else {
                warn(ctx.label + " 图片 " + src + " 不在 site/ 目录里，页面可能读不到");
            }
            report.stats.images++;
            if (ctx.images) { ctx.images.add(abs); }   // 记下来，别让笔记配图混进资料列表
        } else {
            fail(ctx.label + " 图片不存在：" + src + "（按相对 " + relOf(ctx.dir) + "/ 找的）");
            // 报错的同时，把「这个文件本该放哪」写进 src，补上图片就能直接好
            const shouldBe = path.relative(SITE, abs).split(path.sep).join("/");
            url = (shouldBe && !shouldBe.startsWith("..") && !path.isAbsolute(shouldBe))
                ? base + shouldBe
                : src;
        }
    }

    const finalAlt = altText || (baseName ? baseName.replace(/\.[^.]+$/, "") : "图片");
    const attrs = [
        'src="' + esc(url) + '"',
        'alt="' + esc(finalAlt) + '"'
    ];
    if (title) { attrs.push('title="' + esc(title) + '"'); }
    if (dims && dims.w > 0 && dims.h > 0) {
        attrs.push('width="' + dims.w + '"');
        attrs.push('height="' + dims.h + '"');
    }
    attrs.push('loading="lazy"');
    attrs.push('decoding="async"');

    const meta = [];
    if (baseName) { meta.push(baseName); }
    if (bytes !== null) { meta.push(formatSize(bytes)); }
    if (dims) { meta.push(dims.w + "×" + dims.h); }

    let caption = "";
    if (altText || meta.length) {
        caption = "<figcaption>" +
            (altText ? '<span class="fig-cap">' + inline(altText, ctx) + "</span>" : "") +
            (meta.length ? '<span class="fig-meta">' + esc(meta.join(" · ")) + "</span>" : "") +
            "</figcaption>";
    }

    const imgTag = "<img " + attrs.join(" ") + ">";
    // 单独占一行的图片 → 段落级 <figure>（带图注）；夹在文字里的 → 行内 <img>。
    // 否则 <figure> 会被塞进 <p> 里，HTML 直接是坏的
    if (!blockImage) { return imgTag; }
    return '<figure class="fig">' + imgTag + caption + "</figure>";
}

/** 站内链接：写成别的文章的 md 时，自动指向生成出来的 html */
function linkTarget(rawHref, ctx) {
    const href = String(rawHref || "").trim();
    if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith("//") ||
        href.startsWith("#") || href.startsWith("/")) {
        return href;
    }
    const [p, hash = ""] = href.split(/(?=#)/);
    if (!/\.(md|markdown)$/i.test(p)) { return href; }

    const slug = slugForMdLink(p, ctx);
    if (!slug) {
        warn(ctx.label + " 链接 " + p + " 找不到对应的文章，按原样保留");
        return href;
    }
    return (ctx.base || "") + slug + ".html" + hash;
}

/**
 * 把「指向某篇 md 的链接」换算成文章短名。依次试三种写法：
 *   hello-world.md            （同目录、或相对 site/posts/）
 *   hello-world/index.md      （相对 md 所在目录、或相对 site/posts/）
 *   posts/hello-world/index.md（相对 site/）
 */
function slugForMdLink(relHref, ctx) {
    const clean = relHref.replace(/^\.\//, "");
    const candidates = [
        path.resolve(ctx.dir, clean),
        path.resolve(POSTS_SRC, clean),
        path.resolve(SITE, clean)
    ];
    for (const abs of candidates) {
        if (!fs.existsSync(abs)) { continue; }
        const slug = slugFromPostPath(abs);
        if (slug) { return slug; }
    }

    // 只写了文件名、而且 source 确实存在时才认；index 这类站点页面名不能当文章短名
    const base = path.basename(clean).replace(/\.(md|markdown)$/i, "");
    if (!clean.includes("/") && !RESERVED_SLUGS.has(base) &&
        (fs.existsSync(path.join(POSTS_SRC, base, "index.md")) ||
            fs.existsSync(path.join(POSTS_SRC, base + ".md")))) {
        return base;
    }
    return null;
}

/** site/posts/foo.md → foo；site/posts/foo/index.md → foo；别的不算文章 */
function slugFromPostPath(abs) {
    const rel = path.relative(POSTS_SRC, abs).split(path.sep).join("/");
    if (rel.startsWith("..") || !/\.(md|markdown)$/i.test(rel)) { return null; }
    const parts = rel.replace(/\.(md|markdown)$/i, "").split("/");
    if (parts.length === 1) { return parts[0]; }
    if (parts.length === 2 && parts[1] === "index") { return parts[0]; }
    return null;
}

/* ---------------- 块级语法 ---------------- */

const RE_FENCE = /^(\s*)(\x60{3,}|~{3,})\s*([^`~]*)$/;
const RE_HEADING = /^(#{1,6})\s+(.*?)\s*$/;
const RE_HR = /^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/;
const RE_QUOTE = /^\s*>/;
const RE_LIST = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/;
const RE_HTML_BLOCK = /^\s*(?:<!--|<\/?[A-Za-z][\w:-]*(?:\s|>|\/>))/;
const RE_TABLE_ROW = /^\s*\|/;
const RE_TABLE_DELIM = /^\s*\|?[\s:|-]*-[\s:|-]*\|?\s*$/;
const RE_IMAGE_ONLY = /^\s*!\[[^\]]*\]\(\s*(?:<[^>\n]+>|[^)\s]+)(?:\s+["'][^"']*["'])?\s*\)\s*$/;

function splitRow(line) {
    let s = line.trim();
    if (s.startsWith("|")) { s = s.slice(1); }
    if (s.endsWith("|")) { s = s.slice(0, -1); }
    const cells = [];
    let cur = "";
    let escaped = false;
    for (const ch of s) {
        if (escaped) { cur += ch; escaped = false; continue; }
        if (ch === "\\") { escaped = true; cur += ch; continue; }
        if (ch === "|") { cells.push(cur); cur = ""; continue; }
        cur += ch;
    }
    cells.push(cur);
    return cells.map((c) => c.trim());
}

function renderBlocks(lines, ctx, top) {
    const used = ctx.headingIds;
    let out = "";
    let i = 0;

    const isBlockStart = (line, idx) => {
        if (!line.trim()) { return true; }
        if (RE_FENCE.test(line) || RE_HEADING.test(line) || RE_HR.test(line) ||
            RE_QUOTE.test(line) || RE_LIST.test(line) || RE_HTML_BLOCK.test(line)) { return true; }
        if (RE_TABLE_ROW.test(line) && idx + 1 < lines.length && RE_TABLE_DELIM.test(lines[idx + 1]) &&
            lines[idx + 1].includes("|")) { return true; }
        return false;
    };

    while (i < lines.length) {
        const line = lines[i];

        if (!line.trim()) { i++; continue; }

        // ---- 代码块 ----
        const fence = RE_FENCE.exec(line);
        if (fence) {
            const marker = fence[2][0];
            const indent = fence[1].length;
            const lang = fence[3].trim().split(/\s+/)[0] || "";
            const body = [];
            i++;
            while (i < lines.length) {
                const close = new RegExp("^\\s*" + (marker === "\x60" ? "\x60" : "~") + "{3,}\\s*$");
                if (close.test(lines[i])) { i++; break; }
                body.push(lines[i].slice(Math.min(indent, lines[i].length - lines[i].trimStart().length)));
                i++;
            }
            out += '<pre class="code"><code>' +
                (lang ? '<span class="code-lang">' + esc(lang) + "</span>" : "") +
                esc(body.join("\n")) + "</code></pre>\n";
            continue;
        }

        // ---- 独立公式：$$…$$ 或 \[…\]（可以跨行）----
        const mathOpen = /^\s*(\$\$|\\\[)[ \t]*(.*)$/.exec(line);
        if (mathOpen) {
            const closer = mathOpen[1] === "$$" ? "$$" : "\\]";
            let tex = mathOpen[2];
            let closed = tex.includes(closer);
            if (closed) { tex = tex.slice(0, tex.indexOf(closer)); }
            i++;
            while (!closed && i < lines.length) {
                const at = lines[i].indexOf(closer);
                if (at >= 0) { tex += "\n" + lines[i].slice(0, at); closed = true; i++; break; }
                tex += "\n" + lines[i];
                i++;
            }
            if (!closed) { warn(ctx.label + " 有个公式没找到收尾的 " + closer); }
            ctx.hasMath = true;
            out += '<div class="math-block">\\[' + esc(tex.trim()) + "\\]</div>\n";
            continue;
        }

        // ---- 小标题 ----
        const heading = RE_HEADING.exec(line);
        if (heading) {
            let level = heading[1].length;
            let text = heading[2];
            if (level === 1) {
                if (ctx.warnH1 !== false) {
                    warn(ctx.label + " 正文里出现了 # 一级标题，已按 ## 处理（一级留给页面标题）");
                }
                level = 2;
            }
            level = Math.min(Math.max(level, 2), 6);
            let id = null;
            const explicit = /\s*\{#([A-Za-z0-9_-]+)\}\s*$/.exec(text);
            if (explicit) {
                text = text.slice(0, explicit.index).trim();
                id = used.has(explicit[1]) ? headingId(explicit[1], used) : (used.add(explicit[1]), explicit[1]);
            } else {
                id = headingId(text, used);
            }
            const tag = "h" + level;
            if (top) { out += headMark(level); }
            out += "<" + tag + ' id="' + esc(id) + '">' + inline(text, ctx) + "</" + tag + ">\n";
            i++;
            continue;
        }

        // ---- 分隔线 ----
        if (RE_HR.test(line)) {
            out += '<hr class="rule">\n';
            i++;
            continue;
        }

        // ---- 引用 ----
        if (RE_QUOTE.test(line)) {
            const buf = [];
            while (i < lines.length && (RE_QUOTE.test(lines[i]) || (buf.length && lines[i].trim()))) {
                buf.push(lines[i].replace(/^\s*>\s?/, ""));
                i++;
            }
            out += "<blockquote>\n" + renderBlocks(buf, ctx, false) + "</blockquote>\n";
            continue;
        }

        // ---- 表格 ----
        if (RE_TABLE_ROW.test(line) && i + 1 < lines.length && RE_TABLE_DELIM.test(lines[i + 1]) &&
            lines[i + 1].includes("|")) {
            const head = splitRow(line);
            const align = splitRow(lines[i + 1]).map((c) => {
                const l = c.startsWith(":");
                const r = c.endsWith(":");
                return l && r ? "c" : r ? "r" : l ? "l" : "";
            });
            i += 2;
            const rows = [];
            while (i < lines.length && lines[i].includes("|") && lines[i].trim()) {
                rows.push(splitRow(lines[i]));
                i++;
            }
            const cell = (text, idx, tag) => {
                const cls = align[idx] ? ' class="' + align[idx] + '"' : "";
                return "<" + tag + cls + ">" + inline(text, ctx) + "</" + tag + ">";
            };
            out += '<div class="table-wrap"><table>\n<thead><tr>' +
                head.map((c, n) => cell(c, n, "th")).join("") +
                "</tr></thead>\n<tbody>\n" +
                rows.map((r) => "<tr>" + head.map((_, n) => cell(r[n] || "", n, "td")).join("") + "</tr>").join("\n") +
                "\n</tbody>\n</table></div>\n";
            continue;
        }

        // ---- 列表 ----
        if (RE_LIST.test(line)) {
            const res = renderList(lines, i, ctx);
            out += res.html;
            i = res.next;
            continue;
        }

        // ---- 原样透传的 HTML 块 ----
        if (RE_HTML_BLOCK.test(line)) {
            const buf = [];
            while (i < lines.length && lines[i].trim()) { buf.push(lines[i]); i++; }
            out += buf.join("\n") + "\n";
            continue;
        }

        // ---- 段落 ----
        const buf = [];
        while (i < lines.length && !isBlockStart(lines[i], i)) {
            buf.push(lines[i]);
            i++;
        }
        if (!buf.length) { buf.push(lines[i++]); }

        let html = "";
        let hard = false;
        // 整段只有图片 → 每张都做成带图注的 <figure>（段落不再包 <p>）；
        // 只要段落里还有文字，图片就都按行内 <img> 处理，免得 <figure> 被塞进 <p>
        const imageParagraph = buf.every((l) => RE_IMAGE_ONLY.test(l));
        for (const raw of buf) {
            const hardBreak = /\s{2,}$/.test(raw) || /\\$/.test(raw);
            const text = raw.replace(/\s+$/, "").replace(/\\$/, "");
            html = hard
                ? html + "<br>\n" + inline(text, ctx, imageParagraph)
                : joinSoft(html, inline(text, ctx, imageParagraph));
            hard = hardBreak;
        }
        out += imageParagraph
            ? html + "\n"
            : "<p>" + html + "</p>\n";
    }

    return out;
}

/** 列表：支持嵌套、有序、松紧两种写法 */
function renderList(lines, start, ctx) {
    const first = RE_LIST.exec(lines[start]);
    const indent = first[1].length;
    const ordered = /\d/.test(first[2]);
    const items = [];
    let i = start;

    while (i < lines.length) {
        const m = RE_LIST.exec(lines[i]);
        if (!m) { break; }
        const ind = m[1].length;
        if (ind !== indent) { break; }
        if (/\d/.test(m[2]) !== ordered) { break; }

        const itemLines = [m[3]];
        i++;
        while (i < lines.length) {
            const line = lines[i];
            if (!line.trim()) {
                const next = lines[i + 1] || "";
                const nextIndent = (next.match(/^\s*/) || [""])[0].length;
                if (next.trim() && (nextIndent > indent || RE_LIST.test(next) === false)) {
                    itemLines.push("");
                    i++;
                    continue;
                }
                break;
            }
            const lineIndent = (line.match(/^\s*/) || [""])[0].length;
            if (lineIndent <= indent) { break; }
            itemLines.push(line.slice(Math.min(indent + 2, lineIndent)));
            i++;
        }
        items.push(itemLines);
    }

    const html = items.map((itemLines) => {
        let inner = renderBlocks(itemLines, ctx, false).trim();
        // 列表项里的段落不套 <p>，免得列表项之间多出一堆段间距
        const single = /^<p>([\s\S]*?)<\/p>$/.exec(inner);
        if (single) {
            inner = single[1];
        } else {
            const lead = /^<p>([\s\S]*?)<\/p>\s*/.exec(inner);
            if (lead) { inner = lead[1] + "\n" + inner.slice(lead[0].length); }
        }
        return "<li>" + inner + "</li>";
    }).join("\n");

    return {
        html: ordered ? "<ol>\n" + html + "\n</ol>\n" : '<ul class="bullets">\n' + html + "\n</ul>\n",
        next: i
    };
}

/* ======================== 文章：md → html ======================== */

function discoverPosts() {
    const found = [];
    if (!fs.existsSync(POSTS_SRC)) { return found; }

    for (const entry of fs.readdirSync(POSTS_SRC, { withFileTypes: true })) {
        if (entry.name.startsWith("_") || entry.name.startsWith(".")) { continue; }   // _template 之类
        const full = path.join(POSTS_SRC, entry.name);
        if (entry.isFile()) {
            if (/\.md$/i.test(entry.name)) {
                found.push({ mdFile: full, dir: POSTS_SRC, folder: null });
            }
            continue;
        }
        if (!entry.isDirectory()) { continue; }
        const candidates = ["index.md", "index.markdown"].map((f) => path.join(full, f));
        const hit = candidates.find((f) => fs.existsSync(f));
        if (hit) {
            found.push({ mdFile: hit, dir: full, folder: entry.name });
            continue;
        }
        const mds = fs.readdirSync(full).filter((f) => /\.(md|markdown)$/i.test(f));
        if (mds.length === 1) {
            found.push({ mdFile: path.join(full, mds[0]), dir: full, folder: entry.name });
        } else if (mds.length === 0) {
            warn("site/posts/" + entry.name + "/ 里没有 md，已跳过");
        } else {
            fail("site/posts/" + entry.name + "/ 里有多个 md，不知道该生成哪一篇（建议改名 index.md）");
        }
    }
    return found;
}

/**
 * 把带着层级哨兵的正文拼成最终 HTML：
 *   h2 → 一个 <section class="post-section">
 *   h3/h4/h5 → 各自把「它自己和它下面的正文」包进 .indent-N，一层层往里缩进
 */
function assembleBody(html) {
    const parts = html.split(/\u0000H2\u0000/);
    const intro = parts.shift();
    const groups = intro.trim() ? [intro, ...parts] : parts;
    return groups
        .map((g) => '<section class="post-section">\n' + nestUnder(g).trim() + "\n</section>")
        .join("\n\n");
}

function nestUnder(html) {
    const parts = html.split(/\u0000H([3-6])\u0000/);   // 0 号是第一个小标题之前的内容
    let out = parts[0];
    const open = [];                                    // 当前打开的层级
    for (let i = 1; i < parts.length; i += 2) {
        const level = Number(parts[i]);
        const chunk = parts[i + 1] || "";
        while (open.length && open[open.length - 1] >= level) { out += "</div>"; open.pop(); }
        out += '<div class="indent-' + level + '">';
        open.push(level);
        out += chunk;
    }
    while (open.length) { out += "</div>"; open.pop(); }
    return out;
}

function buildPost(found) {
    const relMd = relOf(found.mdFile);
    const label = relMd;
    const raw = readText(found.mdFile);
    const { data, body, hasFm } = parseFrontMatter(raw, label);

    if (!hasFm) { warn(label + " 没有 front matter，标题/日期这些只能靠猜，建议补上 --- 开头的一段"); }

    // 标题：front matter → 正文第一个 # → 文件夹名
    let title = typeof data.title === "string" ? data.title.trim() : "";
    let rest = body;
    if (!title) {
        const h1 = /^\s*#\s+(.+?)\s*$/m.exec(body);
        if (h1) {
            title = h1[1].trim();
            rest = body.slice(0, h1.index) + body.slice(h1.index + h1[0].length);
        }
    }
    if (!title) {
        title = found.folder || path.basename(found.mdFile, path.extname(found.mdFile));
        warn(label + " 没有 title，用了「" + title + "」");
    }

    // slug：front matter → 文件夹名 → 文件名
    let slug = String(data.slug || found.folder || path.basename(found.mdFile, path.extname(found.mdFile)))
        .trim().replace(/\s+/g, "-");
    if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(slug)) {
        // 中文短名照样能用（浏览器会把文件名转成 %E4%B8%9C… 这样的编码），
        // 只是分享出去的链接会长得难看，所以只提示、不拦。
        warn(label + " slug「" + slug + "」不是 ASCII，页面正常生成，URL 会是 " +
            encodeURIComponent(slug) + ".html；想好看点就在 front matter 里写 slug: 英文短名");
    }
    if (/[\\/]/.test(slug) || slug.includes("..") || RESERVED_SLUGS.has(slug)) {
        fail(label + " slug「" + slug + "」会覆盖站点上的其它文件，这篇先跳过（换个文件夹名或写 slug:）");
        return null;
    }

    const stat = fs.statSync(found.mdFile);
    const date = String(data.date || "").slice(0, 10) ||
        new Date(stat.mtimeMs + new Date().getTimezoneOffset() * -60000).toISOString().slice(0, 10);
    if (!data.date) { warn(label + " 没写 date，用了文件的修改时间 " + date); }

    const category = String(data.category || "未分类").trim();
    const tags = (Array.isArray(data.tags) ? data.tags : data.tags ? [data.tags] : []).map((t) => String(t).trim());
    const draft = data.draft === true;
    const minutes = Number.isFinite(Number(data.minutes)) && Number(data.minutes) > 0
        ? Number(data.minutes)
        : readingMinutes(rest);
    const excerpt = String(data.excerpt || "").trim() || truncate(firstParagraph(rest), 90) || title;
    const lead = String(data.lead || data.summary || "").trim();

    const ctx = {
        dir: found.dir,
        label,
        headingIds: new Set()
    };

    const content = assembleBody(renderBlocks(rest.split("\n"), ctx, true));

    const chips = '<span class="chip">' + esc(category) + "</span>" +
        (draft ? '<span class="chip chip-todo">待补充</span>' : "");

    const html =
        "<!DOCTYPE html>\n" +
        '<html lang="zh-CN">\n' +
        "<head>\n" +
        '<meta charset="UTF-8">\n' +
        '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
        "<title>" + esc(title) + " · " + SITE_NAME + "</title>\n" +
        '<meta name="description" content="' + esc(excerpt) + '">\n' +
        ICON_LINKS +
        '    <link rel="stylesheet" href="assets/site.css">\n' +
        (ctx.hasMath ? katexCssTag("") : "") +
        "</head>\n" +
        "<body>\n\n" +
        '<!-- ' + BANNER_MARK + relMd + " 生成，请改 md 后重新生成 -->\n" +
        pageHeader("articles.html") +
        '<div class="shell">\n' +
        '    <aside class="toc">\n' +
        '        <p class="toc-label">目录</p>\n' +
        '        <p class="toc-page" id="toc-page">' + esc(title) + "</p>\n" +
        '        <nav id="toc"></nav>\n' +
        "    </aside>\n\n" +
        '    <main class="content" id="content">\n\n' +
        '        <h1 class="page-title">' + esc(title) + "</h1>\n" +
        '        <div class="post-meta">' + chips +
        "<span>" + esc(date) + "</span><span>约 " + minutes + " 分钟阅读</span></div>\n" +
        (lead ? '        <p class="post-lead">' + inline(lead, ctx) + "</p>\n" : "") +
        '        <hr class="rule">\n\n' +
        indentHtml(content.trim(), 8) + "\n\n" +
        '        <footer class="site-footer">© 2026 锦 · 纯静态站点，托管于 GitHub Pages</footer>\n' +
        "    </main>\n" +
        "</div>\n\n" +
        '<script src="assets/posts.js"></script>\n' +
        (ctx.hasMath ? katexScriptTags("") : "") +
        '<script src="assets/site.js"></script>\n' +
        "</body>\n</html>\n";

    return { slug, title, date, category, tags, excerpt, minutes, draft, html, relMd };
}

/** 给生成的 HTML 排版缩进，但绝不能动 <pre> 里的代码（多一个空格，代码就变了） */
function indentHtml(html, spaces) {
    const pad = " ".repeat(spaces);
    let inPre = false;
    return html.split("\n").map((line) => {
        const out = (inPre || !line.trim()) ? line : pad + line;
        if (line.includes("<pre") && !line.includes("</pre>")) { inPre = true; }
        if (line.includes("</pre>")) { inPre = false; }
        return out;
    }).join("\n");
}

function pageHeader(current, base) {
    base = base || "";
    const links = NAV.map(([href, text]) =>
        '            <a href="' + base + href + '"' + (href === current ? ' aria-current="page"' : "") + ">" + text + "</a>"
    ).join("\n");
    return '<header class="topbar">\n' +
        '    <div class="topbar-inner">\n' +
        '        <a class="brand" href="' + base + 'index.html"><img class="brand-mark" src="' + AVATAR_URL + '" alt="" referrerpolicy="no-referrer"><span>' + SITE_NAME + "</span></a>\n" +
        '        <nav class="topnav">\n' + links + "\n        </nav>\n" +
        "    </div>\n" +
        "</header>\n\n";
}

/**
 * 删掉「源 md 已经不存在」的旧页面：只认带生成标记的 html，手写的页面绝不碰。
 * 改了短名、删了源文件之后，旧页面（文章在 site/ 下、笔记在 site/notes/ 下）就不会留在站点里。
 */
function cleanOrphanPages(dir, slugs, what) {
    if (!fs.existsSync(dir)) { return; }
    for (const name of fs.readdirSync(dir)) {
        if (!name.endsWith(".html")) { continue; }
        if (slugs.has(name.slice(0, -5))) { continue; }
        const file = path.join(dir, name);
        let head = "";
        try { head = fs.readFileSync(file, "utf8").slice(0, 1000); } catch { continue; }
        if (!head.includes(BANNER_MARK)) { continue; }
        if (OPT.check) {
            report.stale.push(relOf(file) + "（" + what + "的源文件已不存在，应该删掉）");
            continue;
        }
        fs.unlinkSync(file);
        report.written.push(relOf(file) + "（删除：" + what + "的源文件已不存在）");
    }
}

function buildPostsJs(posts) {
    const body = posts.map((p) => "    {\n" +
        "        slug: " + JSON.stringify(p.slug) + ",\n" +
        "        title: " + JSON.stringify(p.title) + ",\n" +
        "        date: " + JSON.stringify(p.date) + ",\n" +
        "        category: " + JSON.stringify(p.category) + ",\n" +
        "        tags: " + JSON.stringify(p.tags) + ",\n" +
        "        excerpt: " + JSON.stringify(p.excerpt) + ",\n" +
        "        minutes: " + p.minutes + ",\n" +
        "        draft: " + (p.draft ? "true" : "false") + "\n" +
        "    }").join(",\n");

    return GEN_JS_BANNER +
        "\n" +
        "/* 原标题、日期、分类、标签、摘要、阅读时长都从 site/posts/<slug>/index.md 的 front matter 来，\n" +
        "   摘要和阅读时长不写也会自动算出来。 */\n" +
        "window.POSTS = [\n" + body + "\n];\n";
}

/* ======================== 课程资料：扫目录 → courses.js ======================== */

function walkFiles(dir, base, out) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.name.startsWith(".")) { continue; }
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) { walkFiles(full, base, out); continue; }
        if (!entry.isFile()) { continue; }
        out.push(path.relative(base, full).split(path.sep).join("/"));
    }
    return out;
}

const IGNORED_IN_FILES = new Set([".gitkeep", "course.json", "notes.md", "notes.markdown", "desktop.ini", "Thumbs.db"]);

/** 统一放笔记的目录（可选）：site/notes/note_<课程文件夹名>_<笔记名>.md */
const CENTRAL_NOTES = path.join(SITE, "notes");

/** 笔记文件名：note_ 开头（note- 也行）、.md 结尾 */
const RE_NOTE_FILE = /^note[_-].*\.(md|markdown)$/i;

function escapeRegExp(s) {
    return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** note_SM_第八章笔记.md → 第八章笔记（课程名那一段自动去掉） */
function noteTitleFromName(file, courseSlug) {
    let base = path.basename(file).replace(/\.(md|markdown)$/i, "").replace(/^note[_-]/i, "");
    const slug = String(courseSlug || "");
    if (slug && base.toLowerCase() === slug.toLowerCase()) {
        base = "";
    } else if (slug && base.toLowerCase().startsWith(slug.toLowerCase() + "_")) {
        base = base.slice(slug.length + 1);
    }
    return base.trim();
}

/**
 * 找一门课的所有笔记（= 若干个 md，每个一篇）：
 *   ① site/files/<课程>/notes.md                    单篇，直接铺开
 *   ② site/files/<课程>/**\/note_<课程>_<笔记名>.md   放课程文件夹里，可多篇
 *   ③ site/notes/**\/note_<课程>_<笔记名>.md          统一放一处，按文件名里的课程名归属
 */
function collectNotes(dir, slug, centralUsed) {
    const found = [];

    const single = ["notes.md", "notes.markdown"].map((f) => path.join(dir, f)).find((f) => fs.existsSync(f));
    if (single) { found.push({ file: single, title: "", label: relOf(single) }); }

    const local = walkFiles(dir, dir, [])
        .filter((rel) => RE_NOTE_FILE.test(path.basename(rel)))
        .map((rel) => path.join(dir, rel))
        .sort(naturalCompare);
    for (const file of local) {
        found.push({ file, title: noteTitleFromName(file, slug), label: relOf(file) });
    }

    if (fs.existsSync(CENTRAL_NOTES)) {
        const re = new RegExp("^note[_-]" + escapeRegExp(slug) + "([_-].*)?\\.(md|markdown)$", "i");
        const central = walkFiles(CENTRAL_NOTES, CENTRAL_NOTES, [])
            .filter((rel) => re.test(path.basename(rel)))
            .map((rel) => path.join(CENTRAL_NOTES, rel))
            .sort(naturalCompare);
        for (const file of central) {
            centralUsed.add(file);
            found.push({ file, title: noteTitleFromName(file, slug) || "笔记", label: relOf(file) });
        }
    }

    return found;
}

/** 笔记 md 开头如果是 # 标题，就拿它当笔记名（并从正文里去掉） */
function splitNoteTitle(md, fallback) {
    const lines = md.split("\n");
    let i = 0;
    while (i < lines.length && !lines[i].trim()) { i++; }
    const m = /^#\s+(.+?)\s*$/.exec((lines[i] || "").trim());
    if (m) { return { title: m[1], body: lines.slice(i + 1).join("\n") }; }
    return { title: fallback, body: md };
}

/** 笔记页面的短名：<课程短名>-<笔记名>，保证站点里唯一 */
function noteSlugFor(courseSlug, namePart, used) {
    let base = String(namePart || "notes")
        .replace(/\s+/g, "-")
        .replace(/[\\/:*?"<>|#%]/g, "")
        .replace(/^-+|-+$/g, "");
    if (!base) { base = "notes"; }
    let slug = courseSlug + "-" + base;
    let n = 2;
    while (used.has(slug)) { slug = courseSlug + "-" + base + "-" + n++; }
    used.add(slug);
    return slug;
}

/** 每篇笔记一个独立页面：site/notes/<短名>.html */
function buildNotePage(note) {
    const base = NOTES_BASE;
    const excerpt = truncate(firstParagraph(note.body), 90) || note.title;
    const meta = '<div class="post-meta">' +
        '<span class="chip">' + esc(note.courseName) + "</span>" +
        (note.draft ? '<span class="chip chip-todo">待补充</span>' : "") +
        "<span>" + esc(note.date) + "</span>" +
        '<a href="' + base + "courses.html#course-" + esc(note.courseSlug) + '">← 回到课程</a></div>';

    return "<!DOCTYPE html>\n" +
        '<html lang="zh-CN">\n' +
        "<head>\n" +
        '<meta charset="UTF-8">\n' +
        '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
        "<title>" + esc(note.title) + " · " + SITE_NAME + "</title>\n" +
        '<meta name="description" content="' + esc(excerpt) + '">\n' +
        ICON_LINKS +
        '    <link rel="stylesheet" href="' + base + 'assets/site.css">\n' +
        (note.hasMath ? katexCssTag(base) : "") +
        "</head>\n" +
        "<body>\n\n" +
        "<!-- " + BANNER_MARK + note.relMd + " 生成，请改 md 后重新生成 -->\n" +
        pageHeader(null, base) +
        '<div class="shell">\n' +
        '    <aside class="toc">\n' +
        '        <p class="toc-label">目录</p>\n' +
        '        <p class="toc-page" id="toc-page">' + esc(note.title) + "</p>\n" +
        '        <nav id="toc"></nav>\n' +
        "    </aside>\n\n" +
        '    <main class="content" id="content">\n\n' +
        '        <h1 class="page-title">' + esc(note.title) + "</h1>\n" +
        "        " + meta + "\n" +
        '        <hr class="rule">\n\n' +
        indentHtml(note.html || '<p class="page-sub">这篇还没写。</p>', 8) + "\n\n" +
        '        <footer class="site-footer">© 2026 锦 · 纯静态站点，托管于 GitHub Pages</footer>\n' +
        "    </main>\n" +
        "</div>\n\n" +
        (note.hasMath ? katexScriptTags(base) : "") +
        '<script src="' + base + 'assets/site.js"></script>\n' +
        "</body>\n</html>\n";
}

function buildCourses() {
    if (!fs.existsSync(FILES_SRC)) { return { courses: [], notePages: [] }; }
    const courses = [];
    const notePages = [];
    const notesHeadingIds = new Set();
    const centralUsed = new Set();   // site/notes/ 里被用到的笔记文件
    const noteSlugs = new Set();     // 已用掉的笔记页面短名

    const courseSlugs = fs.readdirSync(FILES_SRC, { withFileTypes: true })
        .filter((e) => e.isDirectory() && !e.name.startsWith("_") && !e.name.startsWith("."))
        .map((e) => e.name);

    for (const entry of fs.readdirSync(FILES_SRC, { withFileTypes: true })) {
        if (!entry.isDirectory() || entry.name.startsWith("_") || entry.name.startsWith(".")) { continue; }
        const dir = path.join(FILES_SRC, entry.name);
        const metaFile = path.join(dir, "course.json");
        let meta = {};
        if (fs.existsSync(metaFile)) {
            try {
                meta = JSON.parse(readText(metaFile));
            } catch (e) {
                fail("site/files/" + entry.name + "/course.json 不是合法 JSON：" + e.message);
            }
        } else {
            info("site/files/" + entry.name + "/ 里没有 course.json，课程名就用文件夹名「" + entry.name +
                "」；想写学期、简介、感悟，就在这个文件夹里加一个 course.json");
        }
        const courseName = String(meta.name || entry.name);

        const notes = (Array.isArray(meta.notes) ? meta.notes : meta.notes ? [meta.notes] : []).map((n) => String(n));

        // 感悟与笔记：一个 md = 一篇笔记，各自生成一个独立页面 site/notes/<短名>.html；
        // 课程页上只列标题（点进去看正文），不在这里铺开，省得页面又长又乱。
        // 一篇笔记 md 都没有时，才退回 course.json 里的 notes 数组（纯文本，一段一个字符串）。
        const notesImages = new Set();
        const noteList = [];
        for (const n of collectNotes(dir, entry.name, centralUsed)) {
            // 笔记也是 md，允许像文章那样写 front matter：title 当笔记名，
            // draft: true（或正文还空着）就标「待补充」，其余字段忽略
            const fm = parseFrontMatter(readText(n.file), n.label + " ");
            const fmTitle = typeof fm.data.title === "string" ? fm.data.title.trim() : "";
            const { title, body } = splitNoteTitle(fm.body, fmTitle || n.title);
            const stat = fs.statSync(n.file);
            const date = String(fm.data.date || "").slice(0, 10) ||
                new Date(stat.mtimeMs + new Date().getTimezoneOffset() * -60000).toISOString().slice(0, 10);
            const noteCtx = {
                dir: path.dirname(n.file),     // 笔记里的图片按它自己所在目录找
                label: n.label,
                headingIds: notesHeadingIds,   // 各课程共用，保证小标题锚点不撞车
                warnH1: false,                 // 笔记里用 # 当标题很正常，不用提醒
                images: notesImages,           // 笔记引用到的图，之后从资料列表里剔掉
                base: NOTES_BASE               // 笔记页面在 site/notes/ 下
            };
            // 注意：hasMath 是渲染过程中才会被置上的，所以必须先渲染再取
            const noteHtml = assembleBody(renderBlocks(body.split("\n"), noteCtx, true));
            const note = {
                slug: noteSlugFor(entry.name, n.title, noteSlugs),
                title: title || "笔记",
                draft: fm.data.draft === true || body.trim() === "",
                date,
                relMd: n.label,
                courseSlug: entry.name,
                courseName,
                body,
                hasMath: noteCtx.hasMath === true,
                html: noteHtml
            };
            notePages.push(note);
            noteList.push({ title: note.title, slug: note.slug, draft: note.draft });
        }
        if (noteList.length && notes.length) {
            info("site/files/" + entry.name + "/ 既有笔记 md、course.json 里又有 notes，这次用 md 那份");
        }

        const fileNotes = meta.fileNotes && typeof meta.fileNotes === "object" ? meta.fileNotes : {};
        const skip = new Set((Array.isArray(meta.exclude) ? meta.exclude : []).map((s) => String(s)));
        const urlBase = "files/" + entry.name + "/";

        const list = walkFiles(dir, dir, [])
            .filter((rel) => !IGNORED_IN_FILES.has(path.basename(rel)) && !skip.has(rel) &&
                !RE_NOTE_FILE.test(path.basename(rel)) &&
                !notesImages.has(path.join(dir, rel)))
            .sort(naturalCompare)
            .map((rel) => {
                const abs = path.join(dir, rel);
                const bytes = fs.statSync(abs).size;
                const item = {
                    name: path.basename(rel),
                    file: urlBase + rel,
                    size: formatSize(bytes)
                };
                const note = fileNotes[rel] || fileNotes[path.basename(rel)];
                if (note) { item.note = String(note); }
                if (bytes > 100 * 1024 * 1024) {
                    fail("site/files/" + entry.name + "/" + rel + " 有 " + formatSize(bytes) +
                        "，超过 100 MB，GitHub 会直接拒绝推送，请改放网盘再用 links 链接");
                } else if (bytes > 50 * 1024 * 1024) {
                    warn("site/files/" + entry.name + "/" + rel + " 有 " + formatSize(bytes) +
                        "，GitHub 会警告，建议改放网盘再用 links 链接");
                }
                return item;
            });

        const links = (Array.isArray(meta.links) ? meta.links : [])
            .filter((l) => l && l.url)
            .map((l) => {
                const item = { name: String(l.name || "外部链接"), url: String(l.url) };
                if (l.size) { item.size = String(l.size); }
                if (l.note) { item.note = String(l.note); }
                return item;
            });

        courses.push({
            slug: entry.name,
            name: courseName,
            term: meta.term ? String(meta.term) : "",
            intro: meta.intro ? String(meta.intro) : "",
            order: Number.isFinite(Number(meta.order)) ? Number(meta.order) : 999,
            files: list,
            links,
            notes,
            noteList
        });
        report.stats.files += list.length + links.length;
    }

    // site/notes/ 里没归到任何课程的笔记，提醒一下（多半是文件名里的课程名写错了）
    if (fs.existsSync(CENTRAL_NOTES)) {
        for (const rel of walkFiles(CENTRAL_NOTES, CENTRAL_NOTES, [])) {
            if (centralUsed.has(path.join(CENTRAL_NOTES, rel))) { continue; }
            const base = path.basename(rel);
            if (!/\.(md|markdown)$/i.test(base)) { continue; }
            if (RE_NOTE_FILE.test(base)) {
                warn("site/notes/" + rel + " 没归到任何课程：文件名里的课程名要是 site/files/ 下的文件夹名（现有：" +
                    courseSlugs.join("、") + "）");
            } else if (/^note/i.test(base)) {
                warn("site/notes/" + rel + " 看着像笔记但名字不对，要写成 note_<课程>_<笔记名>.md，已忽略");
            }
        }
    }

    courses.sort((a, b) => a.order - b.order || naturalCompare(a.slug, b.slug));
    return { courses, notePages };
}

function buildCoursesJs(courses) {
    const body = courses.map((c) => {
        const lines = [
            "    {",
            "        slug: " + JSON.stringify(c.slug) + ",",
            "        name: " + JSON.stringify(c.name) + ","
        ];
        if (c.term) { lines.push("        term: " + JSON.stringify(c.term) + ","); }
        if (c.intro) { lines.push("        intro: " + JSON.stringify(c.intro) + ","); }
        const items = c.files.concat(c.links);
        const filesSrc = items.length
            ? "[\n" + items.map((f) => "            " + JSON.stringify(f)).join(",\n") + "\n        ]"
            : "[]";
        lines.push("        files: " + filesSrc + ",");
        lines.push("        notes: " + JSON.stringify(c.notes) + (c.noteList.length ? "," : ""));
        if (c.noteList.length) { lines.push("        noteList: " + JSON.stringify(c.noteList)); }
        lines.push("    }");
        return lines.join("\n");
    }).join(",\n");

    return GEN_JS_BANNER +
        "\n" +
        "/* 这门课的资料清单是扫 site/files/<slug>/ 自动生成的：只要建好文件夹、" +
        "把文件丢进去，文件名和大小都会自动读出来。\n" +
        "   课程名默认就是文件夹名；学期、简介、资料备注想写才写，放在 site/files/<slug>/course.json 里。\n" +
        "   感悟与笔记：一篇笔记一个 md，文件名 note_<课程>_<笔记名>.md，" +
        "放 site/files/<slug>/ 里或统一的 site/notes/ 里都行（笔记里引用的图片不算资料）。\n" +
        "   每篇笔记会生成一个独立页面 site/notes/<短名>.html，这里只留笔记目录。\n" +
        "   也可以只用 site/files/<slug>/notes.md 一篇，或者 course.json 的 notes 数组（纯文本）。 */\n" +
        "window.COURSES = [\n" + (body || "") + "\n];\n";
}

/* ======================== 主流程 ======================== */

function build() {
    const t0 = Date.now();
    report.written.length = 0;
    report.stale.length = 0;
    report.warnings.length = 0;
    report.errors.length = 0;
    report.stats = { posts: 0, images: 0, courses: 0, files: 0, notes: 0 };

    console.log(OPT.check ? "检查生成结果是否最新…" : "开始生成博客…");

    if (!fs.existsSync(SITE)) {
        fail("找不到 site/ 目录（这个脚本应该放在仓库的 tools/ 里）");
        return;
    }

    /* ---- 文章 ---- */
    const found = discoverPosts();
    const posts = [];
    const seen = new Map();
    const slugs = new Set();

    for (const item of found) {
        const post = buildPost(item);
        if (!post) { continue; }
        if (seen.has(post.slug)) {
            fail("slug 重复：" + post.slug + "（" + post.relMd + " 和 " + seen.get(post.slug) + "）");
            continue;
        }
        seen.set(post.slug, post.relMd);
        posts.push(post);
        slugs.add(post.slug);
    }

    // 日期新的在前；同一天按短名排，保证每次生成的顺序都一样（CI 里要对比生成结果）
    posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : naturalCompare(a.slug, b.slug)));

    for (const post of posts) {
        writeIfChanged(path.join(SITE, post.slug + ".html"), post.html);
    }
    report.stats.posts = posts.length;
    cleanOrphanPages(SITE, new Set(posts.map((p) => p.slug)), "文章");
    writeJs(POSTS_JS, buildPostsJs(posts));

    /* ---- 课程资料 + 课程笔记 ---- */
    const { courses, notePages } = buildCourses();
    report.stats.courses = courses.length;
    writeJs(COURSES_JS, buildCoursesJs(courses));

    for (const note of notePages) {
        writeIfChanged(path.join(NOTES_DIR, note.slug + ".html"), buildNotePage(note));
    }
    report.stats.notes = notePages.length;
    cleanOrphanPages(NOTES_DIR, new Set(notePages.map((n) => n.slug)), "笔记");

    /* ---- 报告 ---- */
    const ms = Date.now() - t0;
    console.log("");
    console.log("文章 " + report.stats.posts + " 篇 · 课程 " + report.stats.courses +
        " 门（笔记 " + report.stats.notes + " 篇）· 资料 " + report.stats.files +
        " 项 · 图片 " + report.stats.images + " 张");

    if (OPT.check) {
        if (report.stale.length) {
            console.log("");
            console.log("\u2717 下面这些产物不是最新的，跑一下 node tools/build-blog.mjs 重新生成：");
            report.stale.forEach((f) => console.log("   " + f));
        } else {
            console.log("\u2713 所有产物都是最新的");
        }
    } else if (report.written.length) {
        console.log("已更新 " + report.written.length + " 个文件：");
        report.written.forEach((f) => console.log("   " + f));
    } else {
        console.log("没有变化，什么都没写。");
    }

    if (report.warnings.length) { console.log("\u26a0 警告 " + report.warnings.length + " 条（见上）"); }
    if (report.errors.length) { console.log("\u2717 错误 " + report.errors.length + " 条（见上）"); }
    console.log("用时 " + ms + " ms");

    if (report.errors.length) { process.exitCode = 1; }
    if (OPT.check && report.stale.length) { process.exitCode = 1; }
}

/* ---- --watch ---- */
function watch() {
    let timer = null;
    const rebuild = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            console.log("\n---- 检测到改动，重新生成 " + new Date().toLocaleTimeString() + " ----");
            try { build(); } catch (e) { console.error(e); }
        }, 150);
    };
    for (const dir of [POSTS_SRC, FILES_SRC]) {
        if (!fs.existsSync(dir)) { continue; }
        try {
            fs.watch(dir, { recursive: true }, rebuild);
            console.log("监听 " + relOf(dir) + "/ 的改动…");
        } catch (e) {
            warn("监听 " + relOf(dir) + " 失败：" + e.message);
        }
    }
    console.log("按 Ctrl+C 结束。");
}

/* ---- --serve ---- */
const MIME = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".mjs": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".md": "text/markdown; charset=utf-8",
    ".txt": "text/plain; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".ico": "image/x-icon",
    ".pdf": "application/pdf",
    ".wasm": "application/wasm",
    ".woff2": "font/woff2",
    ".zip": "application/zip",
    ".mp4": "video/mp4"
};

function serve() {
    const server = http.createServer((req, res) => {
        try {
            let rel = decodeURIComponent((req.url || "/").split("?")[0].split("#")[0]);
            if (rel.endsWith("/")) { rel += "index.html"; }
            const abs = path.resolve(SITE, "." + path.posix.normalize(rel));
            if (abs !== SITE && !abs.startsWith(SITE + path.sep)) { res.writeHead(403).end("403"); return; }
            if (!fs.existsSync(abs) || !fs.statSync(abs).isFile()) {
                const notFound = path.join(SITE, "404.html");
                res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
                res.end(fs.existsSync(notFound) ? fs.readFileSync(notFound) : "404");
                return;
            }
            res.writeHead(200, {
                "Content-Type": MIME[path.extname(abs).toLowerCase()] || "application/octet-stream",
                "Cache-Control": "no-cache"
            });
            fs.createReadStream(abs).pipe(res);
        } catch (e) {
            res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" }).end(String(e));
        }
    });
    server.listen(OPT.port, "127.0.0.1", () => {
        console.log("本地预览：http://127.0.0.1:" + OPT.port + "/   （Ctrl+C 结束）");
    });
}

build();

if (OPT.watch) { watch(); }
if (OPT.serve) { serve(); }
