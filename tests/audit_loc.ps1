# AuraBeat Codebase Modularity & LOC Audit
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  AURABEAT MODULARITY AUDIT (< 300 LOC REQUIREMENT)" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

$files = Get-ChildItem -Path . -Recurse -Filter "*.js" | Where-Object { $_.FullName -notmatch "node_modules" }
$allPassed = $true
$totalFiles = 0

foreach ($f in $files) {
    $totalFiles++
    $relPath = $f.FullName.Substring($PWD.Path.Length + 1)
    $lines = (Get-Content -Path $f.FullName | Measure-Object -Line).Lines
    if ($lines -lt 300) {
        Write-Host "[PASS] $relPath ($lines lines < 300)" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] $relPath ($lines lines EXCEEDS 300)" -ForegroundColor Red
        $allPassed = $false
    }
}

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
if ($allPassed) {
    Write-Host "  ALL $totalFiles JAVASCRIPT FILES ARE ATOMIC & COMPLIANT! (100% GREEN)" -ForegroundColor Green
} else {
    Write-Host "  SOME FILES EXCEEDED 300 LOC!" -ForegroundColor Red
}
Write-Host "==================================================" -ForegroundColor Cyan
