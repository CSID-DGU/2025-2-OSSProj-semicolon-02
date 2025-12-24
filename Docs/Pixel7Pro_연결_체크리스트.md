# Pixel 7 Pro 연결 체크리스트 ✅

## 1단계: 에뮬레이터 실행 확인
Android Studio의 Device Manager에서 Pixel 7 Pro를 실행했는지 확인하세요.

## 2단계: 연결 상태 확인
PowerShell에서 다음 명령 실행:
```powershell
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" devices
```

**정상 출력 예시:**
```
List of devices attached
emulator-5554    device
```

## 3단계: React Native 프로젝트 실행
```powershell
cd 2025-2-OSSProj-semicolon-02\frontend
npm run android
```

## 4단계: (선택사항) Pixel 4 삭제
Android Studio → Device Manager → Pixel_4 → ▼ → Delete

---

## 문제 해결

### 에뮬레이터가 목록에 나타나지 않을 때
- Android Studio를 재시작해보세요
- 또는 명령줄에서 확인:
```powershell
& "$env:LOCALAPPDATA\Android\Sdk\emulator\emulator.exe" -list-avds
```

### 연결이 안 될 때
1. ADB 재시작:
```powershell
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" kill-server
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" start-server
```

2. 에뮬레이터가 완전히 부팅되었는지 확인 (잠금 화면이 해제되어야 함)

3. 다시 연결 확인:
```powershell
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" devices
```








