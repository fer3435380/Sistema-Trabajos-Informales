$processes = Get-CimInstance Win32_Process |
  Where-Object { $_.CommandLine -like "*cloudflared-windows-amd64.exe* tunnel --url*" }

if (!$processes) {
  Write-Host "No hay quick tunnels de Cloudflare activos para este proyecto."
  return
}

foreach ($process in $processes) {
  Stop-Process -Id $process.ProcessId -Force -ErrorAction SilentlyContinue
  Write-Host "Detenido cloudflared PID $($process.ProcessId)"
}
