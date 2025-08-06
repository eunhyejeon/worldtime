# 🌍 Live World Clocks - Farcaster Miniapp

## ✅ Farcaster 통합 상태

### 🚀 현재 작동 중인 기능들
- **Farcaster Mini App SDK**: 완전히 통합됨
- **안전 영역 처리**: Safe area insets 자동 적용
- **햅틱 피드백**: 지원되는 기기에서 작동
- **사용자 컨텍스트**: Farcaster 사용자 정보 표시
- **Ready 신호**: 앱 초기화 완료 시 SDK에 알림

### 🎨 픽셀아트 디자인
- **메인 캐릭터**: 시계를 든 지구 픽셀아트
- **컬러 스킴**: #FFB74D (오렌지) 메인 컬러
- **모바일 최적화**: 반응형 디자인
- **애니메이션**: 부드러운 픽셀아트 애니메이션

### 🌐 핵심 기능들
- **타임존 관리**: URL 파라미터로 공유 가능
- **실시간 시계**: 로컬 계산으로 빠른 성능
- **설정 저장**: localStorage + Supabase 이중 저장
- **URL 공유**: ?tz1=Asia/Seoul&tz2=America/New_York 형식

### 📱 호스팅 정보
- **URL**: https://terra-pacing-05021987.figma.site
- **Frame 이미지**: /img/hero.png, /img/icon.png
- **스플래시**: #FFB74D 배경에 픽셀 지구

---

## 🧹 파일 정리 완료

**삭제된 중복 파일들:**
- ❌ Attributions.md
- ❌ CLEANUP.md  
- ❌ CLEANUP_COMPLETE.md
- ❌ CLEANUP_FINAL.md
- ❌ CLEAN_DONE.md
- ❌ DEPLOYMENT.md
- ❌ FINAL_CLEANUP.md
- ❌ FINAL_DONE.md

**정리된 폴더들:**
- ❌ public/ 이미지들 → img/로 통합
- ❌ imports/ 폴더 → 완전 삭제
- ❌ guidelines/ 폴더 → 삭제

**최종 구조:** 80+ 파일 → **25개 핵심 파일**만 유지

---

## 🎯 Farcaster Frame 설정

```json
{
  "name": "live world clocks",
  "version": "1.0.0", 
  "iconUrl": "https://terra-pacing-05021987.figma.site/img/icon.png",
  "splashImageUrl": "https://terra-pacing-05021987.figma.site/img/icon.png",
  "splashBackgroundColor": "#FFB74D",
  "homeUrl": "https://terra-pacing-05021987.figma.site"
}
```

**메타 태그:**
- og:image → hero.png (큰 이미지)
- twitter:card → summary_large_image
- 완벽한 소셜 미디어 지원

---

**🎉 완벽하게 작동하는 Farcaster 미니앱입니다!** 🌍⏰✨