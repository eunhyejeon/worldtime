# Cleanup Guide: Remove Duplicate Farcaster Manifest Files

## The Problem
During development, multiple `farcaster.json` files may have been created in various locations, causing confusion and potential conflicts.

## The Solution
A Farcaster frame only needs **2 manifest files total**:

1. `/.well-known/farcaster.json` (primary)
2. `/farcaster.json` (backup)

## How to Clean Up

### Step 1: Check Current Files
```bash
# Find all farcaster.json files
find . -name "farcaster.json" -type f

# Expected output should only show:
# ./.well-known/farcaster.json
# ./farcaster.json
```

### Step 2: Remove Extras (if any)
If you see more than 2 files, remove the extras:

```bash
# Example: Remove duplicates (adjust paths as needed)
rm ./duplicate/farcaster.json
rm ./backup/farcaster.json
rm ./old/farcaster.json
```

### Step 3: Verify Content Match
Both remaining files should have identical content:

```bash
# Compare the two files
diff ./.well-known/farcaster.json ./farcaster.json

# Expected: No differences (empty output)
```

### Step 4: Test Accessibility
```bash
# Test primary manifest
curl -I https://terra-pacing-05021987.figma.site/.well-known/farcaster.json

# Test backup manifest  
curl -I https://terra-pacing-05021987.figma.site/farcaster.json

# Both should return: 200 OK
```

## IDE Cache Issues

If your IDE still shows multiple `farcaster.json` files after cleanup:

### VS Code
1. **Reload Window**: `Cmd/Ctrl + Shift + P` → "Developer: Reload Window"
2. **Clear Workspace**: Close and reopen the project folder
3. **Reset File Explorer**: `Cmd/Ctrl + Shift + E` to refresh

### Other IDEs
1. **Refresh Project**: Most IDEs have a "Refresh" or "Reload" option
2. **Restart IDE**: Close and reopen the application
3. **Clear Cache**: Check IDE settings for cache clearing options

## Final Verification

After cleanup, you should have:

```
✅ /.well-known/farcaster.json    (primary manifest)
✅ /farcaster.json                (backup manifest)
❌ No other farcaster.json files anywhere
```

## Why This Happened

Multiple manifest files often result from:
- **Development iterations**: Creating files in different locations while testing
- **Copy-paste errors**: Accidentally duplicating files during setup
- **IDE caching**: Editor showing old file states
- **Build artifacts**: Some tools creating temporary manifests

## Prevention

To avoid this in the future:
1. **Stick to standards**: Always use `/.well-known/farcaster.json` as primary
2. **Single source of truth**: Keep manifests in version control
3. **Regular cleanup**: Periodically check for duplicate files
4. **Clear documentation**: Follow deployment guides exactly

## Need Help?

If you're still seeing multiple files or having issues:

1. **Check actual filesystem**: Use command line tools instead of IDE
2. **Restart development server**: Clear any cached manifests
3. **Test in private browser**: Ensure no cached responses
4. **Verify hosting platform**: Some hosts have file syncing delays

Remember: **2 files maximum** = **1 happy Farcaster frame** 🎯