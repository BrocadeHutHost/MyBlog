# 列出 site\files\ 下的资料文件，按课程文件夹分组，
# 输出能直接粘进 site\assets\courses.js 的 files 条目（含大小）。
#
# 注意：现在 site\assets\courses.js 由 tools\build-blog.mjs 自动生成（大小也是自动读的），
# 这个脚本只是留着手动看一眼文件大小，平时用不上。
#
# 用法（在仓库根目录）：
#   powershell -File tools\scan-files.ps1
# 指定别的目录：
#   powershell -File tools\scan-files.ps1 -Root site\files

param(
    [string]$Root = (Join-Path $PSScriptRoot '..\site\files')
)

$ErrorActionPreference = 'Continue'

if (-not (Test-Path $Root)) {
    Write-Host "没有找到 $Root"
    Write-Host "先在 site\files\ 下建一个以课程 slug 命名的文件夹（比如 ml\），把 PPT / PDF / Word / zip 放进去。"
    exit 0
}

$Root = (Resolve-Path $Root).Path

function Format-Size([long]$bytes) {
    if ($bytes -ge 1GB) { '{0:N2} GB' -f ($bytes / 1GB) }
    elseif ($bytes -ge 1MB) { '{0:N2} MB' -f ($bytes / 1MB) }
    elseif ($bytes -ge 1KB) { '{0:N0} KB' -f ($bytes / 1KB) }
    else { "$bytes B" }
}

$courses = Get-ChildItem $Root -Directory | Sort-Object Name
if (-not $courses) {
    Write-Host "site\files\ 下面还没有课程文件夹。"
    exit 0
}

$big = @()

foreach ($course in $courses) {
    Write-Host ""
    Write-Host ("// ---- {0} ----" -f $course.Name) -ForegroundColor Cyan
    $files = Get-ChildItem $course.FullName -Recurse -File | Where-Object { $_.Name -ne '.gitkeep' } | Sort-Object FullName
    if (-not $files) {
        Write-Host "（这个文件夹还是空的）"
        continue
    }
    foreach ($f in $files) {
        $rel = ($f.FullName.Substring($Root.Length).TrimStart('\') -replace '\\', '/')
        $size = Format-Size $f.Length
        Write-Host ('  { name: "{0}", file: "files/{1}", size: "{2}" },' -f $f.Name, $rel, $size)
        if ($f.Length -gt 50MB) { $big += $f }
    }
}

Write-Host ""
if ($big) {
    Write-Host "⚠ 下面这些超过 50 MB，GitHub 会警告（超过 100 MB 直接拒绝推送），建议改放网盘再用 url 字段链接：" -ForegroundColor Yellow
    $big | ForEach-Object { Write-Host ("   {0}  {1}" -f (Format-Size $_.Length), $_.FullName) }
} else {
    Write-Host "没有超过 50 MB 的文件。" -ForegroundColor Green
}
