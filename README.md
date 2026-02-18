# YouTube Transcript Summarizer Extension

A powerful browser extension that extracts YouTube video transcripts and summarizes them using Mistral AI, an open-source language model.

## Features

- 🎥 **Extract Transcripts**: Get transcripts from any YouTube video with subtitles
- 🤖 **AI-Powered Summarization**: Summarize video content using Mistral AI via Hugging Face
- 💾 **Multiple Export Options**: Export summaries as TXT, JSON, or copy to clipboard
- 🎨 **Beautiful UI**: Modern, gradient-styled interface
- ⚡ **Quick Access**: Auto-detects YouTube videos and adds in-page button
- 🔒 **Privacy-Focused**: Your API key is stored locally

## Installation

### Chrome/Edge/Brave

1. Clone or download this repository
2. Open your browser and navigate to `chrome://extensions/` (or `edge://extensions/`)
3. Enable "Developer mode" (toggle in the top right)
4. Click "Load unpacked"
5. Select the extension directory

### Firefox

1. Clone or download this repository
2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Select the `manifest.json` file from the extension directory

## Setup

### Get a Hugging Face API Token

1. Go to [Hugging Face](https://huggingface.co/) and create a free account
2. Navigate to [Settings → Access Tokens](https://huggingface.co/settings/tokens)
3. Create a new token with "read" permissions
4. Copy the token (it starts with `hf_`)

### Configure the Extension

1. Right-click the extension icon and select "Options"
2. Paste your Hugging Face API token
3. Click "Save Settings"

## Usage

### Method 1: Using the Extension Popup

1. Navigate to any YouTube video
2. Click the extension icon in your browser toolbar
3. The video URL will be auto-filled
4. Click "Extract Transcript"
5. Once the transcript appears, click "Summarize with AI"
6. Export your summary using the export buttons

### Method 2: From YouTube Page

1. While watching a YouTube video, look for the "📝 Summarize" button below the video
2. Click it to open the extension popup with the URL pre-filled
3. Follow steps 4-6 from Method 1

### Method 3: Context Menu

1. Right-click anywhere on a YouTube video page
2. Select "Summarize this YouTube video"
3. The extension popup will open

## Export Options

- **TXT**: Plain text file with transcript and summary
- **JSON**: Structured data including video ID, timestamp, transcript, and summary
- **Copy to Clipboard**: Copy summary directly for easy sharing

## Technical Details

### Architecture

- **Manifest V3**: Uses the latest Chrome extension manifest
- **Service Worker**: Background script handles API calls
- **Content Script**: Adds UI elements to YouTube pages
- **Popup Interface**: Main user interface for interaction

### API Integration

- **YouTube Transcript**: Extracts captions using YouTube's timedtext API
- **Mistral AI**: Uses Mistral-7B-Instruct-v0.2 model via Hugging Face Inference API

### Files Structure

```
sum-ext/
├── manifest.json          # Extension configuration
├── popup.html            # Main popup interface
├── popup.css             # Popup styling
├── popup.js              # Popup functionality
├── background.js         # Background service worker
├── content.js            # YouTube page integration
├── options.html          # Settings page
├── options.js            # Settings functionality
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md             # This file
```

## Limitations

- Videos must have subtitles/captions available
- Mistral AI has token limits (longer videos are truncated)
- Free Hugging Face API has rate limits
- Summarization may take 30-60 seconds depending on model availability

## Privacy

- Your API key is stored locally in your browser
- No data is sent to any servers except:
  - YouTube for transcript extraction
  - Hugging Face for AI summarization
- No tracking or analytics

## Troubleshooting

### "No captions found for this video"
- The video doesn't have subtitles. Try a different video.

### "Invalid API key"
- Check that your Hugging Face API token is correct
- Ensure it starts with `hf_`
- Verify it has proper permissions

### "Model is loading"
- The AI model is being loaded by Hugging Face
- Wait 20-30 seconds and try again

### Summarization is slow
- This is normal - AI inference can take time
- Free tier Hugging Face API may be slower
- Consider upgrading to Hugging Face Pro for faster responses

## Development

### Prerequisites
- Node.js (for generating icons)
- npm or yarn

### Generate Icons
```bash
npm install
node generate-icons.js
```

### Testing
1. Load the extension in developer mode
2. Navigate to a YouTube video with captions
3. Test all features: extract, summarize, export

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC License

## Credits

- Mistral AI for the open-source language model
- Hugging Face for the inference API
- YouTube for the transcript data

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Note**: This extension requires a free Hugging Face account and API token to function. The extension uses the Mistral-7B-Instruct model which is open-source and free to use via the Hugging Face Inference API.