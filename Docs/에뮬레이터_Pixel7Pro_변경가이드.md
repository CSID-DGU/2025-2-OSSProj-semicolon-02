# Android 에뮬레이터 Pixel 4 → Pixel 7 Pro 변경 가이드

## 방법 1: Android Studio GUI를 통한 방법 (가장 쉬움) ⭐ 권장

### 1단계: Android Studio 열기
1. Android Studio를 실행합니다.

### 2단계: AVD Manager 열기
1. 상단 메뉴에서 **Tools** → **Device Manager** (또는 **Tools** → **AVD Manager**) 클릭
2. 또는 상단 툴바의 **Device Manager** 아이콘 클릭

### 3단계: 새 Virtual Device 생성
1. **Create Device** 버튼 클릭
2. **Phone** 카테고리에서 **Pixel 7 Pro** 선택
   - 만약 Pixel 7 Pro가 목록에 없다면:
     - **New Hardware Profile** 클릭하여 수동으로 생성하거나
     - **Pixel 6 Pro** 또는 **Pixel 8 Pro** 선택 후 이름만 변경
3. **Next** 클릭

### 4단계: System Image 선택
1. 사용 가능한 시스템 이미지 중 하나 선택 (예: **API 34 (Android 14)** 또는 **API 33**)
2. 다운로드가 필요하면 **Download** 클릭하여 다운로드
3. **Next** 클릭

### 5단계: AVD 구성 확인
1. **AVD Name**: 원하는 이름 입력 (예: `Pixel_7_Pro_API_34`)
2. **Startup orientation**: Portrait (세로) 또는 Landscape (가로) 선택
3. **Show Advanced Settings** 클릭하여 세부 설정 조정 가능:
   - RAM: 2048MB 이상 권장
   - VM heap: 512MB
   - Internal Storage: 2048MB
4. **Finish** 클릭

### 6단계: 새 에뮬레이터 실행
1. 생성된 **Pixel 7 Pro** 에뮬레이터 옆의 **▶️ Play** 버튼 클릭
2. 에뮬레이터가 부팅될 때까지 대기

### 7단계: (선택사항) 기존 Pixel 4 에뮬레이터 삭제
1. AVD Manager에서 기존 **Pixel 4** 또는 **Medium_Phone_API_36.0** 에뮬레이터 선택
2. 오른쪽 **▼** 아이콘 클릭 → **Delete** 선택
3. 확인 대화상자에서 **Delete** 클릭

---

## 방법 2: 명령줄을 통한 방법

### 사전 준비: cmdline-tools 설치 확인
1. Android Studio → **Tools** → **SDK Manager**
2. **SDK Tools** 탭 선택
3. **Android SDK Command-line Tools (latest)** 체크
4. **Apply** → **OK** 클릭하여 설치

### 1단계: 환경 변수 설정 (PowerShell에서)
```powershell
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:PATH += ";$env:ANDROID_HOME\cmdline-tools\latest\bin;$env:ANDROID_HOME\platform-tools"
```

### 2단계: 사용 가능한 시스템 이미지 확인
```powershell
sdkmanager --list | Select-String "system-images"
```

### 3단계: Pixel 7 Pro용 시스템 이미지 다운로드
```powershell
# 예: Android 14 (API 34) x86_64 이미지 다운로드
sdkmanager "system-images;android-34;google_apis;x86_64"
```

### 4단계: Pixel 7 Pro 에뮬레이터 생성
```powershell
# avdmanager를 사용하여 에뮬레이터 생성
avdmanager create avd -n Pixel_7_Pro_API_34 -k "system-images;android-34;google_apis;x86_64" -d "pixel_7_pro"
```

**참고**: `-d "pixel_7_pro"`는 디바이스 정의 ID입니다. 사용 가능한 디바이스 목록 확인:
```powershell
avdmanager list device
```

### 5단계: 에뮬레이터 실행
```powershell
emulator -avd Pixel_7_Pro_API_34
```

---

## 방법 3: React Native에서 직접 실행

### 1단계: 에뮬레이터 목록 확인
```powershell
& "$env:LOCALAPPDATA\Android\Sdk\emulator\emulator.exe" -list-avds
```

### 2단계: Pixel 7 Pro 에뮬레이터 실행
```powershell
# 에뮬레이터를 백그라운드에서 실행
Start-Process -FilePath "$env:LOCALAPPDATA\Android\Sdk\emulator\emulator.exe" -ArgumentList "-avd", "Pixel_7_Pro_API_34"
```

### 3단계: React Native 앱 실행
```powershell
cd 2025-2-OSSProj-semicolon-02\frontend
npm run android
```

---

## Pixel 7 Pro 사양 정보
- **화면 크기**: 6.7인치
- **해상도**: 1440 x 3120 픽셀
- **DPI**: 512 dpi
- **RAM**: 최소 4GB 권장
- **Android 버전**: Android 13 (API 33) 이상

---

## 문제 해결

### 문제 1: Pixel 7 Pro가 디바이스 목록에 없을 때
- **해결**: Android Studio에서 최신 SDK Platform Tools 업데이트
- 또는 Pixel 6 Pro를 선택하고 이름만 변경

### 문제 2: 시스템 이미지 다운로드 실패
- **해결**: Android Studio → SDK Manager → SDK Tools에서 "Android Emulator" 업데이트

### 문제 3: 에뮬레이터가 느릴 때
- **해결**: 
  - AVD 설정에서 Graphics를 "Hardware - GLES 2.0"으로 변경
  - RAM을 4096MB 이상으로 증가
  - Windows의 경우 Hyper-V 또는 HAXM 활성화 확인

### 문제 4: React Native에서 에뮬레이터를 찾지 못할 때
```powershell
# ADB로 연결된 디바이스 확인
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" devices
```

---

## 참고 사항
- 에뮬레이터는 처음 실행 시 부팅에 시간이 걸릴 수 있습니다 (1-3분)
- 여러 에뮬레이터를 동시에 실행할 수 있지만, 시스템 리소스를 많이 사용합니다
- 개발 중에는 하나의 에뮬레이터만 실행하는 것을 권장합니다








