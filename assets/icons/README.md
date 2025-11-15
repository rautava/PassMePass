# Extension Icons

This directory should contain the following icon files:

- **icon16.png** - 16x16 pixels (toolbar icon)
- **icon48.png** - 48x48 pixels (extensions management page)
- **icon128.png** - 128x128 pixels (Chrome Web Store)

## Creating Icons

You can create icons using:
- Online tools: Canva, Figma, or icon generators
- Image editors: GIMP, Photoshop, or Paint.NET
- SVG to PNG converters for scalable designs

## Design Recommendations

- Use a simple, recognizable symbol (e.g., key, lock, or password dots)
- Ensure good contrast and visibility at small sizes
- Follow Microsoft Edge add-ons design guidelines
- Use transparent backgrounds (PNG format)

## Once created, update manifest.json:

```json
"icons": {
  "16": "assets/icons/icon16.png",
  "48": "assets/icons/icon48.png",
  "128": "assets/icons/icon128.png"
}
```
