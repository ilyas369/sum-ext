# Testing Guide

## Extension Testing Checklist

### Installation Testing
- [ ] Extension loads without errors in Chrome
- [ ] Extension loads without errors in Edge
- [ ] Extension loads without errors in Firefox
- [ ] Extension icon appears in toolbar
- [ ] All icon sizes (16px, 48px, 128px) are present

### Popup Interface Testing
- [ ] Popup opens when clicking extension icon
- [ ] UI renders correctly with gradient background
- [ ] Input field accepts YouTube URLs
- [ ] "Extract Transcript" button is clickable
- [ ] Auto-fill works when on YouTube page
- [ ] Enter key triggers transcript extraction
- [ ] Loading spinner appears during processing
- [ ] Error messages display correctly

### Transcript Extraction Testing
- [ ] Valid YouTube URL extracts transcript successfully
- [ ] Invalid URL shows appropriate error message
- [ ] Video without captions shows helpful error
- [ ] Transcript displays in scrollable text box
- [ ] Long transcripts are fully readable
- [ ] "Summarize with AI" button appears after extraction

### AI Summarization Testing
- [ ] Without API key: Shows helpful error about needing API key
- [ ] With valid API key: Generates summary successfully
- [ ] Summary displays in separate text box
- [ ] Long processing time shows appropriate loading message
- [ ] Model loading message appears if needed
- [ ] Summary is coherent and relevant

### Export Functionality Testing
- [ ] Export as TXT creates downloadable file
- [ ] TXT file contains video ID, transcript, and summary
- [ ] Export as JSON creates valid JSON file
- [ ] JSON contains all expected fields
- [ ] Copy to Clipboard works correctly
- [ ] Copy button shows success feedback

### Options Page Testing
- [ ] Options page accessible via right-click menu
- [ ] API key input field works correctly
- [ ] Empty API key shows validation error
- [ ] Invalid API key format shows error
- [ ] Valid API key saves successfully
- [ ] Success message appears after saving
- [ ] API key persists after browser restart
- [ ] Password field properly masks API key

### Content Script Testing
- [ ] "📝 Summarize" button appears on YouTube videos
- [ ] Button has correct styling
- [ ] Button hover effect works
- [ ] Clicking button opens extension popup
- [ ] Button re-appears after navigating to new video
- [ ] Button doesn't appear on non-video pages

### Context Menu Testing
- [ ] Right-click menu item appears on YouTube pages
- [ ] "Summarize this YouTube video" option is present
- [ ] Clicking menu item opens popup
- [ ] Menu item doesn't appear on non-YouTube pages

### Error Handling Testing
- [ ] Network errors are caught and displayed
- [ ] API errors show meaningful messages
- [ ] Rate limit errors are handled gracefully
- [ ] Invalid JSON responses don't crash extension
- [ ] Browser compatibility issues are handled

### Security Testing
- [ ] API key stored securely in chrome.storage
- [ ] No API key logged to console
- [ ] No sensitive data sent to unexpected servers
- [ ] HTTPS used for all API calls
- [ ] No XSS vulnerabilities in content display
- [ ] No code injection vulnerabilities

### Performance Testing
- [ ] Extension doesn't slow down browser
- [ ] Memory usage is reasonable
- [ ] Popup opens quickly
- [ ] Transcript extraction is reasonably fast
- [ ] No memory leaks after repeated use

### Edge Cases
- [ ] Very long video transcripts (>1 hour)
- [ ] Special characters in transcript
- [ ] Non-English captions
- [ ] Videos with multiple caption tracks
- [ ] Private/Unlisted videos (with access)
- [ ] Age-restricted videos
- [ ] Live streams

## Manual Testing Steps

### Test 1: Basic Functionality
1. Install extension in developer mode
2. Navigate to: https://www.youtube.com/watch?v=dQw4w9WgXcQ
3. Click extension icon
4. Verify URL is auto-filled
5. Click "Extract Transcript"
6. Verify transcript appears
7. Click "Summarize with AI"
8. Verify summary is generated

### Test 2: Export Features
1. Complete Test 1
2. Click "Export as TXT"
3. Open downloaded file and verify content
4. Click "Export as JSON"
5. Open downloaded file and verify valid JSON
6. Click "Copy to Clipboard"
7. Paste in text editor and verify content

### Test 3: API Key Configuration
1. Right-click extension icon
2. Select "Options"
3. Enter invalid API key (e.g., "test123")
4. Verify error message appears
5. Enter valid Hugging Face API key
6. Click "Save Settings"
7. Verify success message appears
8. Try summarizing a video to confirm it works

### Test 4: Error Scenarios
1. Enter invalid YouTube URL
2. Verify error message
3. Enter URL of video without captions
4. Verify helpful error message
5. Try summarizing without API key
6. Verify error about missing API key

### Test 5: YouTube Integration
1. Navigate to any YouTube video
2. Look for "📝 Summarize" button below video
3. Click the button
4. Verify popup opens with URL pre-filled
5. Navigate to different video
6. Verify button appears again

## Browser Compatibility

### Chrome/Edge/Brave (Chromium)
- Manifest V3 fully supported
- All features should work

### Firefox
- Requires loading as temporary add-on
- Some API differences may require adjustments
- Test all features thoroughly

## Performance Benchmarks

### Expected Timings
- Popup open: <100ms
- Transcript extraction: 2-5 seconds
- AI summarization: 30-90 seconds (free tier)
- Export operations: <100ms

### Resource Usage
- Memory: <50MB
- CPU: Minimal when idle
- Network: Only during transcript/summarization

## Known Limitations

1. **Captions Required**: Only works with videos that have captions/subtitles
2. **Token Limits**: Long videos truncated to ~3000 characters for summarization
3. **API Rate Limits**: Free Hugging Face API has usage limits
4. **Model Loading**: First request may take longer as model loads
5. **Language**: Best results with English captions

## Debugging

### Chrome DevTools
1. Go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Inspect views: popup.html" to debug popup
4. Click "Inspect views: service worker" to debug background script
5. Check Console tab for errors

### Common Issues

**"No captions found"**
- Video doesn't have subtitles
- Try a different video

**"Model is loading"**
- Hugging Face is initializing the model
- Wait 30 seconds and try again

**Slow summarization**
- Normal for free tier
- Can take 60-90 seconds

**Extension not loading**
- Check manifest.json for errors
- Verify all files are present
- Try reloading extension

## Automated Testing

Currently, the extension uses manual testing. Future improvements could include:

1. **Unit Tests**: Jest for individual functions
2. **Integration Tests**: Puppeteer for end-to-end testing
3. **API Mocking**: Mock Hugging Face API responses
4. **CI/CD**: Automated testing on push

## Test Results

Date: 2024-02-18

- ✅ JavaScript syntax validation: PASSED
- ✅ Manifest.json validation: PASSED
- ✅ npm audit: 0 vulnerabilities
- ✅ CodeQL security scan: 0 alerts
- ✅ UI rendering: PASSED
- ✅ Code review: Addressed all feedback

## Sign-off

Tested by: [Your Name]
Date: [Date]
Browser: [Browser and Version]
OS: [Operating System]

All critical functionality: ☐ PASS ☐ FAIL
Ready for deployment: ☐ YES ☐ NO

Notes:
_______________________________________
_______________________________________
_______________________________________
