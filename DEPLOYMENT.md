# Deployment Guide for Live World Clocks - Farcaster Frame

## Overview
This guide helps you deploy the Live World Clocks Farcaster Frame with a clean, minimal configuration.

## Required Manifest Files

For a Farcaster frame, you only need **TWO** manifest files:

### 1. Primary Manifest (Required)
- **Location**: `/.well-known/farcaster.json` ✅
- **Purpose**: Official Farcaster standard location
- **Priority**: This is the file Farcaster clients will check first
- **Must be accessible at**: `https://terra-pacing-05021987.figma.site/.well-known/farcaster.json`

### 2. Backup Manifest (Optional)
- **Location**: `/farcaster.json` ✅
- **Purpose**: Fallback for compatibility with older clients
- **Priority**: Secondary - only used if `.well-known` version is not found

> **Important**: Both files should have identical content. The `.well-known` location takes precedence.

## Required Image Assets

The manifest references these images (all should be accessible in `/img` folder):
- `/img/icon.png` (256x256px) - App icon 
- `/img/image.png` (1200x630px) - Preview/Frame image
- `/img/splash.png` (512x512px) - Splash screen
- `/img/hero.png` (1200x800px) - Hero image

### Additional Assets
- `/socialshare.png` (1200x630px) - Social sharing (kept in root for compatibility)

## Current Configuration

### Domain
`terra-pacing-05021987.figma.site`

### Essential URLs
```
✅ https://terra-pacing-05021987.figma.site/.well-known/farcaster.json
✅ https://terra-pacing-05021987.figma.site/farcaster.json
✅ https://terra-pacing-05021987.figma.site/img/icon.png
✅ https://terra-pacing-05021987.figma.site/img/image.png
✅ https://terra-pacing-05021987.figma.site/img/splash.png
✅ https://terra-pacing-05021987.figma.site/img/hero.png
✅ https://terra-pacing-05021987.figma.site/socialshare.png
```

### Frame Configuration
```json
{
  "frame": {
    "name": "live world clocks",
    "version": "1",
    "iconUrl": "https://terra-pacing-05021987.figma.site/img/icon.png",
    "imageUrl": "https://terra-pacing-05021987.figma.site/img/image.png",
    "splashImageUrl": "https://terra-pacing-05021987.figma.site/img/splash.png",
    "heroImageUrl": "https://terra-pacing-05021987.figma.site/img/hero.png",
    "buttonTitle": "what time is it now?",
    "primaryCategory": "social",
    "splashBackgroundColor": "#FFB74D"
  }
}
```

## Required File Structure for Farcaster

### **Critical**: img Folder Setup
Farcaster requires the following specific structure:

```
├── img/
│   ├── icon.png              # App icon (256x256)
│   ├── image.png             # Main frame preview (1200x630)
│   ├── splash.png            # Splash screen (512x512)
│   └── hero.png              # Hero image (1200x800)
```

### Steps to Set Up img Folder:
1. **Create img folder** in your project root
2. **Copy/move images** from public folder to img folder:
   ```bash
   mkdir img
   cp public/icon.png img/
   cp public/og-image.png img/image.png
   cp public/splash.png img/
   cp public/hero.png img/
   ```
3. **Verify accessibility** - all img/* files must be accessible via direct URL

## Farcaster Registration Steps

### 1. Frame Submission
- **Portal**: [Farcaster Developer Portal](https://developers.farcaster.xyz)
- **Category**: Social
- **Review Time**: 1-3 business days

### 2. Required Information
- **Frame Name**: live world clocks
- **Description**: World Time Checker lets you track time zones across the globe
- **Domain**: terra-pacing-05021987.figma.site
- **Manifest URL**: https://terra-pacing-05021987.figma.site/.well-known/farcaster.json

### 3. Pre-submission Checklist
- [ ] Domain is accessible and secure (HTTPS)
- [ ] **img folder exists** with all required images
- [ ] Manifest files return proper JSON content type
- [ ] All referenced images load correctly
- [ ] Frame works in Farcaster preview tool
- [ ] App provides value to Farcaster community

## Testing Your Deployment

### 1. Image Assets Test
```bash
# Test all required images in img folder
curl -I https://terra-pacing-05021987.figma.site/img/icon.png
curl -I https://terra-pacing-05021987.figma.site/img/image.png
curl -I https://terra-pacing-05021987.figma.site/img/splash.png
curl -I https://terra-pacing-05021987.figma.site/img/hero.png
# All should return: 200 OK
```

### 2. Primary Manifest Test
```bash
curl -I https://terra-pacing-05021987.figma.site/.well-known/farcaster.json
# Expected: 200 OK
```

### 3. Backup Manifest Test  
```bash
curl -I https://terra-pacing-05021987.figma.site/farcaster.json
# Expected: 200 OK
```

### 4. Farcaster Preview Tool
**URL**: `https://farcaster.xyz/~/developers/frames/preview?url=https://terra-pacing-05021987.figma.site`

### 5. Content Type Check
```bash
curl -H "Accept: application/json" https://terra-pacing-05021987.figma.site/.well-known/farcaster.json
# Should return proper JSON with content-type: application/json
```

## Troubleshooting

### "Image Assets Not Found"
- **Check img folder**: Ensure `/img` folder exists at project root
- **Verify file names**: Must be exactly `icon.png`, `image.png`, `splash.png`, `hero.png`
- **Test direct access**: Each image URL should return 200 OK
- **File permissions**: Ensure web server can serve static files from img folder

### "Manifest Not Found"
- **Primary issue**: `.well-known` directory not being served properly
- **Quick fix**: Ensure both manifest files are accessible via direct URL
- **Figma hosting**: Should serve hidden directories automatically

### "Invalid JSON Format"
- **Validate JSON**: Use https://jsonlint.com to check syntax
- **Check encoding**: Ensure UTF-8 encoding, no BOM
- **Content-Type**: Server should return `application/json`

## Clean Deployment Checklist

- [ ] **img folder created** with all 4 required images
- [ ] Only 2 manifest files exist: `/.well-known/farcaster.json` and `/farcaster.json`
- [ ] Both manifests have identical content and valid JSON
- [ ] All img/* URLs return 200 OK and proper image content
- [ ] Primary manifest URL returns 200 OK with correct content-type
- [ ] Farcaster preview tool works correctly
- [ ] Frame loads and functions properly in test environment
- [ ] Domain uses HTTPS and has valid SSL certificate

## Final File Structure

```
├── .well-known/
│   └── farcaster.json          # Primary manifest
├── farcaster.json              # Backup manifest
├── img/                        # ⭐ CRITICAL for Farcaster
│   ├── icon.png               # App icon (256x256)
│   ├── image.png              # Frame preview (1200x630)
│   ├── splash.png             # Splash screen (512x512)
│   └── hero.png               # Hero image (1200x800)
├── public/
│   ├── index.html             # Main HTML with meta tags
│   └── socialshare.png        # Social sharing image
├── App.tsx                     # Main React component
├── package.json               # Project metadata
├── README.md                  # Documentation
└── components/                 # React components
```

## Next Steps

1. **✅ Create img folder** - Most critical step for Farcaster approval
2. **Verify file count**: Confirm you only have 2 manifest files
3. **Test URLs**: Check that both manifests and all images are accessible
4. **Submit to Farcaster**: Use developer portal for frame submission
5. **Monitor approval**: Check email for Farcaster team updates

## Success Metrics

After approval, your frame will be:
- **Discoverable**: Listed in Farcaster frame directory
- **Embeddable**: Users can cast with your frame
- **Searchable**: Found by keywords like "world clock" or "time"
- **Shareable**: URL parameters work for timezone sharing

**🚨 Critical Note**: The `/img` folder structure is **mandatory** for Farcaster registration. Without it, your submission will be rejected! 🎯