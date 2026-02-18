# Quick Start Guide

## Step-by-Step Setup

### 1. Install the Extension

**For Chrome/Edge/Brave:**
1. Open your browser
2. Type `chrome://extensions/` in the address bar
3. Enable "Developer mode" (toggle switch in top-right)
4. Click "Load unpacked" button
5. Navigate to and select the `sum-ext` folder
6. The extension icon should appear in your toolbar

**For Firefox:**
1. Open Firefox
2. Type `about:debugging#/runtime/this-firefox` in the address bar
3. Click "Load Temporary Add-on"
4. Navigate to the `sum-ext` folder and select `manifest.json`
5. The extension will be loaded temporarily (until browser restart)

### 2. Get Your Free Hugging Face API Token

1. Visit https://huggingface.co/
2. Click "Sign Up" and create a free account
3. After logging in, go to https://huggingface.co/settings/tokens
4. Click "New token"
5. Give it a name (e.g., "YouTube Summarizer")
6. Select "read" permission
7. Click "Generate"
8. Copy the token (starts with `hf_`)

### 3. Configure the Extension

1. Right-click the extension icon in your browser toolbar
2. Select "Options" from the menu
3. Paste your Hugging Face API token in the field
4. Click "Save Settings"
5. You should see "✓ Settings saved successfully!"

### 4. Use the Extension

#### Option A: Direct URL Input
1. Click the extension icon
2. Paste any YouTube video URL
3. Click "Extract Transcript"
4. Wait for the transcript to load
5. Click "Summarize with AI"
6. Wait 30-60 seconds for the AI summary
7. Use export buttons to save your summary

#### Option B: While Watching YouTube
1. Navigate to any YouTube video with captions
2. Click the extension icon (URL auto-fills)
3. Click "Extract Transcript"
4. Click "Summarize with AI"
5. Export when ready

#### Option C: YouTube Page Button
1. While on a YouTube video page
2. Look for the "📝 Summarize" button below the video
3. Click it to open the extension
4. Continue with transcript extraction

## Export Options Explained

### TXT Export
Creates a formatted text file containing:
- Video ID
- Date and timestamp
- Full transcript
- AI-generated summary

**Use when:** You want a simple, readable document

### JSON Export
Creates a structured JSON file with:
```json
{
  "videoId": "...",
  "timestamp": "2024-...",
  "transcript": "...",
  "summary": "..."
}
```

**Use when:** You need structured data for further processing

### Copy to Clipboard
Copies the summary and video info to your clipboard.

**Use when:** You want to quickly paste into emails, notes, or documents

## Tips & Best Practices

1. **Choose videos with good captions**: Auto-generated captions work, but manual captions are better
2. **Longer videos take longer**: The AI needs more time for long transcripts
3. **First use may be slow**: The Mistral model needs to load on Hugging Face
4. **Check rate limits**: Free Hugging Face API has usage limits
5. **Keep your API key private**: Never share your API token

## Troubleshooting

### "No captions found"
- The video doesn't have any subtitles/captions available
- Try a different video with captions

### "Invalid API key"
- Double-check your token from Hugging Face
- Make sure it starts with `hf_`
- Try generating a new token

### "Model is loading"
- The Mistral model is initializing on Hugging Face's servers
- Wait 20-30 seconds and try again
- This is common on first use or after periods of inactivity

### Slow summarization
- Normal for free tier Hugging Face API
- Can take 30-90 seconds depending on server load
- Consider Hugging Face Pro for faster inference

### Extension not working
1. Check browser console for errors (F12 → Console)
2. Verify all files are present in the extension folder
3. Try reloading the extension in `chrome://extensions/`
4. Check that you have the latest version

## Common Questions

**Q: Is this free to use?**
A: Yes! Both the extension and Hugging Face API (free tier) are free.

**Q: Do I need internet?**
A: Yes, for both transcript extraction and AI summarization.

**Q: Where is my data stored?**
A: Your API key is stored locally in your browser. Nothing else is stored.

**Q: Can I use other AI models?**
A: Currently uses Mistral-7B-Instruct. You can modify `background.js` to use other models.

**Q: Why Mistral?**
A: It's open-source, powerful, and free via Hugging Face.

**Q: Can I summarize private/unlisted videos?**
A: Yes, as long as you can access the video and it has captions.

**Q: How accurate are the summaries?**
A: Mistral provides high-quality summaries, but always review for accuracy.

## Advanced Usage

### Using Different Models

Edit `background.js` line 117 to use a different Hugging Face model:
```javascript
const API_URL = "https://api-inference.huggingface.co/models/YOUR_MODEL_HERE";
```

Popular alternatives:
- `google/flan-t5-large`
- `facebook/bart-large-cnn`
- `mistralai/Mixtral-8x7B-Instruct-v0.1`

### Adjusting Summary Length

Edit `background.js` line 133 to change the max tokens:
```javascript
parameters: {
  max_new_tokens: 500, // Increase for longer summaries
  // ...
}
```

## Support & Feedback

- **Issues**: Report bugs on GitHub
- **Questions**: Open a GitHub discussion
- **Contributions**: Pull requests welcome!

---

Enjoy summarizing YouTube videos with AI! 🎉
