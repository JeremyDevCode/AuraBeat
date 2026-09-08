$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$url = "file:///c:/Users/J/Documents/AntiGravity%20Project%20-%20AuraBeat/tests/test_runner.html"
$out = "tests/test_results.txt"

Start-Process -FilePath $chrome -ArgumentList "--headless=new", "--allow-file-access-from-files", "--dump-dom", $url -NoNewWindow -RedirectStandardOutput $out -Wait
$content = Get-Content -Path $out -Encoding UTF8
$content | Select-String -Pattern "\[PASS\]|\[FAIL\]|TEST RESULTS"
Remove-Item -Path $out -ErrorAction SilentlyContinue
