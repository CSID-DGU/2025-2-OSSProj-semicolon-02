# Pixel 4 삭제 및 Pixel 7 Pro 연결 가이드

## ✅ Android Studio에서 Pixel 4 삭제하기

### 1단계: Android Studio 열기
1. Android Studio 실행

### 2단계: Device Manager 열기
- 상단 메뉴: **Tools** → **Device Manager**
- 또는 상단 툴바의 **Device Manager** 아이콘 클릭

### 3단계: Pixel 4 에뮬레이터 삭제
1. Device Manager에서 **Pixel_4** 에뮬레이터 찾기
2. 에뮬레이터 오른쪽 끝의 **▼ (드롭다운 메뉴)** 클릭
3. **Delete** 선택
4. 확인 대화상자에서 **Delete** 클릭

**참고**: 에뮬레이터가 실행 중이면 먼저 종료해야 합니다.

---

## ✅ Pixel 7 Pro 에뮬레이터 실행하기

### 방법 1: Android Studio에서 실행
1. Device Manager에서 **Pixel_7_Pro** 에뮬레이터 찾기
2. **▶️ Play** 버튼 클릭
3. 에뮬레이터가 부팅될 때까지 대기 (1-3분)

### 방법 2: 명령줄에서 실행
```powershell
# PowerShell에서 실행
& "$env:LOCALAPPDATA\Android\Sdk\emulator\emulator.exe" -avd Pixel_7_Pro

# 또는 전체 경로로 실행
C:\Users\seohy\AppData\Local\Android\Sdk\emulator\emulator.exe -avd Pixel_7_Pro
```

### 방법 3: 스크립트 파일 사용
프로젝트 루트에 있는 `run-emulator.ps1` 스크립트를 실행:
```powershell
.\run-emulator.ps1
```

---

## ✅ React Native 프로젝트와 연결 확인

### 1단계: 에뮬레이터 실행 확인
```powershell
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" devices
```
출력 예시:
```
List of devices attached
emulator-5554    device
```

### 2단계: React Native 앱 실행
```powershell
cd 2025-2-OSSProj-semicolon-02\frontend
npm run android
```

---

## 🔍 문제 해결

### Pixel 4가 목록에 없을 때
- 이미 삭제되었을 수 있습니다
- `emulator -list-avds` 명령으로 확인:
```powershell
& "$env:LOCALAPPDATA\Android\Sdk\emulator\emulator.exe" -list-avds
```

### Pixel 7 Pro가 목록에 없을 때
- Device Manager에서 **Create Device** 클릭
- **Pixel 7 Pro** 선택하여 새로 생성

### 에뮬레이터가 연결되지 않을 때
1. 에뮬레이터가 완전히 부팅되었는지 확인
2. ADB 재시작:
```powershell
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" kill-server
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" start-server
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" devices
```

