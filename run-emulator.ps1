# Pixel 7 Pro 에뮬레이터 실행 스크립트

$emulatorPath = "$env:LOCALAPPDATA\Android\Sdk\emulator\emulator.exe"

if (Test-Path $emulatorPath) {
    Write-Host "Pixel 7 Pro 에뮬레이터를 실행합니다..." -ForegroundColor Green
    & $emulatorPath -avd Pixel_7_Pro
} else {
    Write-Host "에뮬레이터를 찾을 수 없습니다: $emulatorPath" -ForegroundColor Red
    Write-Host "Android SDK가 설치되어 있는지 확인하세요." -ForegroundColor Yellow
}








