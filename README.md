# Pass-Me-Pass Extension

Generate secure random passwords (lowercase, uppercase, digits, and special characters `,.-`) directly from the right-click context menu on password and text fields with Pass-Me-Pass.

## Features

- Right-click on password/text inputs or text areas to generate passwords
- Configurable length (8-80 characters, default: 21)
- Ensures at least one character from each character class
- Smart event detection for compatibility with modern web frameworks (React, Vue, Angular)
- Works with onkeyup, oninput, and onchange handlers

## Installation (Development)

1. Open `edge://extensions` in Microsoft Edge
2. Enable **Developer mode** (toggle at bottom-left)
3. Click **Load unpacked**
4. Select the root folder `C:\workspace\PassMePass`

## Installation (Production)

Once your extension is published in the Microsoft Edge Add-ons store:

1. Visit your extension's page in the Edge Add-ons store
2. Click **Get** to install the extension directly in your browser
3. Configure the password length in the extension options

## Configuration

1. Open the extension's details in `edge://extensions`
2. Click **Extension options** (or **Details** → **Extension options**)
3. Use the slider or number input to set desired length (8-80 characters)
4. Click **Save**

## Project Structure

```text
PassMePass/
├── manifest.json         # Extension manifest (MV3)
├── README.md             # This file
├── src/                  # Source code
│   ├── background.js     # Service worker (menu & password generation)
│   ├── contentScript.js  # Content script (field detection & filling)
│   ├── config.js         # Centralized configuration constants
│   └── passwordGenerator.js # Password generation algorithm
├── ui/                   # User interface
│   ├── options.html      # Options page UI
│   ├── options.css       # Options page styles
│   └── options.js        # Options page logic
└── assets/               # Static assets
    └── icons/            # Extension icons (16x16, 48x48, 128x128)
```

## Development

### Prerequisites

- Microsoft Edge browser (or Chromium-based browser)
- Basic knowledge of Chrome Extension APIs

### Setup

1. Clone or download this repository
2. Make changes to source files in `src/` or `ui/`
3. Reload the extension in `edge://extensions` after changes
4. Test on various websites with different input field types

### Key Files

- **src/config.js** - Modify MIN_LENGTH, MAX_LENGTH, DEFAULT_LENGTH
- **src/passwordGenerator.js** - Change character sets or generation algorithm
- **src/contentScript.js** - Customize event detection and field targeting
- **ui/options.html** - Modify options page UI

## Security & Privacy

- **100% Local**: All password generation happens in-browser; no data leaves your device
- **No Tracking**: No analytics, no data collection
- **Minimal Permissions**: Only requests necessary permissions for functionality
- **Open Source**: Code is auditable (if you choose to publish as open source)

## Technical Details

- **Manifest Version**: 3 (latest Chrome/Edge extension standard)
- **Framework Support**: Compatible with React, Vue, Angular via native value setters
- **Event Detection**: Smart detection of onkeyup, oninput, onchange handlers
- **Double-Injection Guard**: Prevents duplicate script loading
- **Fallback Support**: Dynamic injection for late-loading pages

## Troubleshooting

**Menu doesn't appear:**

- Ensure you're right-clicking on a text/password input or textarea
- Check that the extension is enabled in `edge://extensions`
- Reload the page and try again

**Password not filling:**

- Some sites use custom input components that may not be detected
- Try reloading the extension after code changes
- Check browser console for errors

**Framework-specific issues:**

- The extension triggers multiple events (input, change, keyup) to ensure compatibility
- If a specific site doesn't work, report it as an issue

## Version History

- **1.0.0** - Initial release with 8-80 character passwords, framework compatibility

## Future Enhancements

- [ ] Toggle special character inclusion in options
- [ ] Copy to clipboard option
- [ ] Customizable character sets
- [ ] Per-site remembered preferences
- [ ] Keyboard shortcut support
- [ ] Multiple password strength presets

## License

This project is licensed under the Unlicense. See the LICENSE file for details.

## Packaging for Distribution

To create a ZIP file for Edge Add-ons store submission:

1. Open PowerShell in the extension root directory (`PassMePass`)
2. Run the packaging script:

   ```powershell
   .\scripts\package.ps1
   # Or specify a version:
   .\scripts\package.ps1 -Version "1.0.1"
   ```

3. The packaged ZIP will be created in the `dist` folder (e.g., `dist\PassMePass-v1.0.1.zip`)
4. Upload this ZIP to the Microsoft Edge Add-ons Partner Center

### Development Helper

For quick development tasks, use:

```powershell
.\scripts\dev.ps1
```

This menu-driven script lets you package, validate, and inspect the extension easily.

## Testing

This repository uses Deno for running the password generator tests.

Run tests (PowerShell):

```powershell
# Install Deno if needed
irm https://deno.land/install.ps1 -useb | iex

# From repo root
cd C:\workspace\PassMePass
deno test --allow-read
```

Or use the Deno task (if your editor supports it):

```powershell
deno task test:password
```

Notes:

- The Deno test harness evaluates `src/config.js` and `src/passwordGenerator.js` in a sandbox and checks that generated passwords include lowercase, uppercase, digits, and special characters.
