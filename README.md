# 🌍 Live World Clocks - Farcaster Miniapp

Meet our adorable pixel globe companion and explore world time zones! This charming Farcaster miniapp makes tracking international time both functional and delightful.

## ✨ Features

- **🎯 Farcaster Integration**: Native miniapp with haptic feedback
- **🌐 Multiple Time Zone Support**: Track up to 10 different time zones
- **🎨 Pixel Art Character**: Adorable globe buddy with clock
- **🔄 Real-time Updates**: Live clock display with second-precision
- **🔗 URL Sharing**: Share timezone configurations via URL parameters
- **📱 Mobile Optimized**: Safe area insets and responsive design
- **💾 Persistent Storage**: localStorage + Supabase backend
- **⚡ Local Calculation**: Fast, browser-based time calculations

## 🚀 Farcaster Frame

**Launch URL**: https://terra-pacing-05021987.figma.site

**Frame Configuration**:
```
Icon: /img/icon.png (픽셀 지구 캐릭터)
Splash: #FFB74D 배경에 지구 캐릭터
Title: "live world clocks"
```

## 🎮 Quick Start

### URL Parameters
Share timezone configurations:
```
https://terra-pacing-05021987.figma.site/?tz1=Asia/Seoul&tz2=America/New_York&tz3=Europe/London
```

### In Farcaster
1. Frame에서 "what time is it now?" 버튼 클릭
2. 미니앱이 픽셀 지구 캐릭터와 함께 시작
3. 타임존 선택하고 저장
4. Share 버튼으로 설정 공유

## 🎨 Design

**Pixel Art Character**: 시계를 든 귀여운 지구 캐릭터가 앱 전반에 등장

**Visual Style**:
- Orange color scheme (#FFB74D, #E65100)
- Pixelated image rendering for crisp graphics
- Glass-morphism cards with backdrop blur
- Smooth animations (bounce, spin)

## 🌍 Supported Timezones

**Popular**: Seoul, New York, London, Tokyo, Los Angeles, Paris, Shanghai, Sydney

**All Regions**: North America, South America, Europe, Asia, Africa, Oceania

## 🏗️ Built With

- **Farcaster Mini App SDK** - Native integration
- **React 18** + TypeScript
- **Tailwind CSS V4** 
- **shadcn/ui** components
- **Supabase** backend (optional)
- **Pixel Art Magic** ✨

## 📁 Project Structure

```
├── App.tsx                     # Main Farcaster miniapp
├── farcaster.json             # Frame configuration
├── components/
│   ├── PixelGlobeIcon.tsx     # Pixel globe character
│   ├── TimezoneSelector.tsx   # Timezone management
│   └── WorldClock.tsx         # Live clock display
├── hooks/
│   └── useFarcaster.tsx       # Farcaster SDK integration
├── services/
│   └── timezoneService.tsx    # Timezone logic
└── img/
    ├── icon.png               # Frame icon (지구 캐릭터)
    ├── hero.png               # Social sharing image
    └── ...
```

## 🎯 Farcaster Capabilities

- **Haptic Feedback**: Touch감 향상
- **Safe Area**: 모든 기기에서 완벽한 레이아웃
- **User Context**: Farcaster 사용자 정보 활용
- **Development Mode**: Frame 외부에서도 테스트 가능

---

**🎉 What time is it now?** Find out with our pixel globe companion in Farcaster! 🌍⏰✨