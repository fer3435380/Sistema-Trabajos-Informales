$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$frontRoot = Join-Path $repoRoot "nexo-front"
$viteBin = Join-Path $frontRoot "node_modules\vite\bin\vite.js"
$nodeExe = "C:\Program Files\nodejs\node.exe"

Set-Location -LiteralPath $frontRoot
$env:CI = "1"
& $nodeExe $viteBin --host 127.0.0.1 --port 5173
