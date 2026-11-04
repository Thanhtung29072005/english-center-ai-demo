$lines = Get-Content "src\dashboard.js" -Encoding UTF8
$kept = $lines | Select-Object -First 6530
$kept | Set-Content "src\dashboard.js" -Encoding UTF8
Write-Host "Total lines now: $(($kept | Measure-Object).Count)"
