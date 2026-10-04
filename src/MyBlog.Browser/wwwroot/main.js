import { dotnet } from './_framework/dotnet.js'

const is_browser = typeof window != "undefined";
if (!is_browser) throw new Error(`Expected to be running in a browser`);

// Avalonia 12 的浏览器后端是把 canvas prepend 到 #out（作为第一个子节点，见 avalonia.js
// 的 attachCanvas），而 index.html 里的加载占位屏是它的后一个兄弟节点、全屏不透明绝对定位。
// 只靠 DOM 顺序的话 canvas 会被占位屏整块盖住，表现为「永远停在正在加载…、控制台却没有报错」。
// 所以这里盯着 #out：canvas 一出现就把占位屏从 DOM 里摘掉。
function removeSplashWhenReady() {
    const host = document.getElementById('out');
    const splash = document.querySelector('.avalonia-splash');
    if (!host || !splash) {
        return;
    }

    const drop = () => {
        if (!host.querySelector('canvas')) {
            return false;
        }
        splash.remove();
        return true;
    };

    if (drop()) {
        return;
    }

    const observer = new MutationObserver(() => {
        if (drop()) {
            stop();
        }
    });
    observer.observe(host, { childList: true });

    // 观察器覆盖不到的边角情况（例如 canvas 在注册之前就绪），少量轮询兜底。
    const timer = setInterval(() => {
        if (drop()) {
            stop();
        }
    }, 250);

    function stop() {
        clearInterval(timer);
        observer.disconnect();
    }

    // 最多盯一分钟，避免常驻。
    setTimeout(stop, 60000);
}

removeSplashWhenReady();

const dotnetRuntime = await dotnet
    .withDiagnosticTracing(false)
    .withApplicationArgumentsFromQuery()
    .create();

const config = dotnetRuntime.getConfig();

await dotnetRuntime.runMain(config.mainAssemblyName, [globalThis.location.href]);
