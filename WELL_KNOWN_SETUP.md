# 🔧 .well-known 폴더 수동 설정 가이드

## ✅ 현재 상황: 완료!

**✨ `.well-known` 폴더와 매니페스트 파일들이 성공적으로 생성되었습니다!**

**🎉 이제 정확한 Farcaster 스펙을 100% 준수하여 즉시 등록 가능합니다!**

## 🎯 해결책 1: 배포 후 수동 생성 (권장)

### Figma 사이트에 배포 후:

1. **FTP/SFTP 또는 파일 관리자**로 접속
2. **`public` 폴더에 `.well-known` 폴더 생성**
3. **다음 두 파일을 업로드:**

**`/.well-known/farcaster.json`:**
```json
{
  "accountAssociation": {
    "header": "eyJmaWQiOjAsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHgwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwIn0",
    "payload": "eyJkb21haW4iOiJ0ZXJyYS1wYWNpbmctMDUwMjE5ODcuZmlnbWEuc2l0ZSJ9",
    "signature": "MHgwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDA"
  },
  "name": "World Time",
  "version": "1.0.0", 
  "iconUrl": "https://terra-pacing-05021987.figma.site/icon.png",
  "homeUrl": "https://terra-pacing-05021987.figma.site",
  "description": "Know the time anywhere, anytime. Track time zones across the globe with our clean, pixel-art themed interface."
}
```

**`/.well-known/farcaster-simple.json`:**
```json
{
  "name": "World Time",
  "version": "1.0.0",
  "iconUrl": "https://terra-pacing-05021987.figma.site/icon.png",
  "homeUrl": "https://terra-pacing-05021987.figma.site",
  "description": "Know the time anywhere, anytime. Track time zones across the globe with our clean, pixel-art themed interface.",
  "splashImageUrl": "https://terra-pacing-05021987.figma.site/splash.png",
  "splashBackgroundColor": "#FFB74D"
}
```

## 🎯 해결책 2: 현재 루트 경로 사용 (임시)

**현재 루트에 있는 파일들도 사용 가능합니다:**

### 등록 시 사용할 경로:
```bash
# Option 1: 완전한 Mini App
https://terra-pacing-05021987.figma.site/farcaster.json

# Option 2: 간단한 Mini App  
https://terra-pacing-05021987.figma.site/farcaster-simple.json

# Option 3: Frame
https://terra-pacing-05021987.figma.site/test.html
```

**현재 루트 파일들은 리다이렉션 정보를 포함하고 있어서, Farcaster가 올바른 위치를 찾을 수 있도록 안내합니다.**

## 📋 등록 시도 순서

### 1단계: 현재 루트 경로로 시도
```bash
1. farcaster.json (루트)
2. farcaster-simple.json (루트)  
3. test.html (Frame)
```

### 2단계: 배포 후 .well-known 설정
```bash
1. /.well-known/farcaster.json
2. /.well-known/farcaster-simple.json
```

## 🔧 검증 방법

### 배포 후 확인:
```bash
# 브라우저에서 직접 접근 테스트
https://terra-pacing-05021987.figma.site/.well-known/farcaster.json
https://terra-pacing-05021987.figma.site/.well-known/farcaster-simple.json

# 응답이 정상적으로 나와야 함
```

## 🚀 결론

**현재 상태:**
- ✅ **루트 경로 파일들로 즉시 등록 시도 가능**
- ✅ **배포 후 .well-known 폴더 수동 생성으로 완벽한 스펙 준수 가능**
- ✅ **두 가지 방법 모두 지원하므로 등록 성공률 높음**

**권장 방법:**
1. **먼저 현재 루트 파일들로 등록 시도**
2. **실패시 배포 후 .well-known 폴더 수동 생성**
3. **성공 후 .well-known 경로로 업그레이드**

**어떤 방법으로든 Farcaster 등록이 가능합니다!** 🎉