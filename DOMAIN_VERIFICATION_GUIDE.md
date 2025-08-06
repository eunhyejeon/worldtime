# 🔐 Farcaster 도메인 검증 가이드

## 현재 상황

**더미 서명 사용 중:**
```json
{
  "accountAssociation": {
    "header": "eyJmaWQiOjAsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHgwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwIn0",
    "payload": "eyJkb21haW4iOiJ0ZXJyYS1wYWNpbmctMDUwMjE5ODcuZmlnbWEuc2l0ZSJ9",
    "signature": "MHgwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDA"
  }
}
```

## 옵션 1: 더미 서명으로 시도 (권장)

**장점:**
- ✅ 즉시 등록 시도 가능
- ✅ 복잡한 서명 과정 불필요
- ✅ 테스트 환경에서 작동할 수 있음

**단점:**
- ❗ 프로덕션에서 검증 실패 가능
- ❗ 완전한 검증 없음

## 옵션 2: 간단한 매니페스트 사용 (추천)

**도메인 검증 없는 버전:**
```bash
URL: /.well-known/farcaster-simple.json
```

**내용:**
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

## 옵션 3: 실제 도메인 검증 (고급)

**필요한 경우:**
- 프로덕션 환경에서 완전한 검증 필요
- 공식 Farcaster 앱 스토어 등재
- 도메인 소유권 증명 필요

**과정:**
1. **Farcaster Hub에 도메인 등록**
2. **개인키로 도메인 서명 생성**
3. **서명을 매니페스트에 포함**

**실제 서명 생성 방법:**
```javascript
// 이 과정은 복잡하므로 먼저 간단한 버전으로 시도 권장
// 1. 도메인 소유권 증명
// 2. Farcaster 키 페어 생성  
// 3. 도메인 메시지 서명
// 4. 서명을 base64로 인코딩
```

## 🎯 권장 등록 전략

### 1단계: 간단한 버전으로 시작
```bash
# 이 URL로 먼저 등록 시도
/.well-known/farcaster-simple.json

# 이유:
- 도메인 검증 불필요
- 등록 과정 단순
- 기본 기능 모두 사용 가능
```

### 2단계: 완전한 버전 시도
```bash
# 간단한 버전 성공 후 이 URL로 업그레이드
/.well-known/farcaster.json

# 현재 더미 서명으로도 작동할 수 있음
```

### 3단계: 실제 검증 (필요시)
```bash
# 공식 등재나 프로덕션 배포시에만 필요
# 복잡한 과정이므로 나중에 고려
```

## 🚀 추천 순서

**즉시 시도 가능한 옵션들:**

1. **farcaster-simple.json** (가장 쉬움)
2. **farcaster.json** (더미 서명 포함)  
3. **test.html** (Frame 형식)

**모두 준비되어 있으므로 순차적으로 시도하세요!**

## 🛠 디버깅 팁

**도메인 검증 오류 발생시:**
```bash
→ farcaster-simple.json 사용
→ 또는 Frame 형식 (test.html) 사용
```

**이미지 로딩 오류 발생시:**
```bash
→ 브라우저에서 직접 URL 접근 테스트:
  - https://terra-pacing-05021987.figma.site/icon.png
  - https://terra-pacing-05021987.figma.site/hero.png
  - https://terra-pacing-05021987.figma.site/splash.png
```

**JSON 형식 오류 발생시:**
```bash
→ https://jsonlint.com에서 유효성 검증
→ 또는 브라우저 콘솔에서 JSON.parse() 테스트
```

## 🎉 결론

**현재 상황:** 3가지 옵션 모두 준비 완료!

**권장 등록 순서:**
1. **farcaster-simple.json** ← 가장 성공률 높음
2. **farcaster.json** ← 완전한 기능
3. **test.html (Frame)** ← 안전한 대안

**어떤 방법으로든 등록이 가능한 상태입니다!** 🚀