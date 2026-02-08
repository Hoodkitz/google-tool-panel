# Tauri Icons

This directory should contain the following icon files for the Tauri desktop app:

## Required Icons:

- `32x32.png` - 32x32 pixel PNG icon
- `128x128.png` - 128x128 pixel PNG icon
- `128x128@2x.png` - 256x256 pixel PNG icon (Retina)
- `icon.icns` - macOS icon file
- `icon.ico` - Windows icon file

## How to Generate Icons:

### Option 1: Use the API
Run the following command to generate icons using AI:
```bash
curl -X POST http://localhost:3000/api/generate-icons
```

Then copy the generated icons from `public/` to this directory and convert them using a tool like ImageMagick:

```bash
# Convert to different sizes
convert public/icon-512.png src-tai/icons/32x32.png -resize 32x32
convert public/icon-512.png src-tai/icons/128x128.png -resize 128x128
convert public/icon-512.png src-tai/icons/128x128@2x.png -resize 256x256

# Convert to ICO (Windows)
convert public/icon-512.png src-tai/icons/icon.ico -define icon:auto-resize=256,128,96,64,48,32,16

# Convert to ICNS (macOS) - requires iconutil (macOS only)
# On macOS:
mkdir src-tai/icons/icon.iconset
sips -z 16 16     public/icon-512.png --out src-tai/icons/icon.iconset/icon_16x16.png
sips -z 32 32     public/icon-512.png --out src-tai/icons/icon.iconset/icon_16x16@2x.png
sips -z 32 32     public/icon-512.png --out src-tai/icons/icon.iconset/icon_32x32.png
sips -z 64 64     public/icon-512.png --out src-tai/icons/icon.iconset/icon_32x32@2x.png
sips -z 128 128   public/icon-512.png --out src-tai/icons/icon.iconset/icon_128x128.png
sips -z 256 256   public/icon-512.png --out src-tai/icons/icon.iconset/icon_128x128@2x.png
sips -z 256 256   public/icon-512.png --out src-tai/icons/icon.iconset/icon_256x256.png
sips -z 512 512   public/icon-512.png --out src-tai/icons/icon.iconset/icon_256x256@2x.png
sips -z 512 512   public/icon-512.png --out src-tai/icons/icon.iconset/icon_512x512.png
sips -z 512 512   public/icon-512.png --out src-tai/icons/icon.iconset/icon_512x512@2x.png
iconutil -c icns src-tai/icons/icon.iconset -o src-tai/icons/icon.icns
```

### Option 2: Use Online Tools
- Windows ICO: https://icoconvert.com/
- macOS ICNS: Use Xcode or online converter
- PNG: Any image editor like GIMP, Photoshop, etc.

## Temporary Build Without Icons
If you want to test the build without proper icons, you can create simple placeholder icons or comment out the icon paths in `tauri.conf.json`.
