// background.js - Background service worker for API calls

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getTranscript') {
    getYouTubeTranscript(request.videoId)
      .then(transcript => sendResponse({ success: true, transcript }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep channel open for async response
  } else if (request.action === 'summarize') {
    summarizeWithMistral(request.text)
      .then(summary => sendResponse({ success: true, summary }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep channel open for async response
  }
});

// Function to fetch YouTube transcript
async function getYouTubeTranscript(videoId) {
  try {
    // Use YouTube's timedtext API to get transcript
    const response = await fetch(
      `https://www.youtube.com/watch?v=${videoId}`,
      { method: 'GET' }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch video page');
    }
    
    const html = await response.text();
    
    // Extract captions data from the page
    const captionsRegex = /"captions":({.*?}),"/;
    const match = html.match(captionsRegex);
    
    if (!match) {
      throw new Error('No captions found for this video. The video may not have subtitles available.');
    }
    
    const captionsData = JSON.parse(match[1].replace(/\\"/g, '"'));
    
    if (!captionsData.playerCaptionsTracklistRenderer || 
        !captionsData.playerCaptionsTracklistRenderer.captionTracks) {
      throw new Error('No caption tracks available');
    }
    
    const captionTracks = captionsData.playerCaptionsTracklistRenderer.captionTracks;
    
    // Get English captions or first available
    let captionUrl = null;
    for (const track of captionTracks) {
      if (track.languageCode === 'en') {
        captionUrl = track.baseUrl;
        break;
      }
    }
    
    if (!captionUrl && captionTracks.length > 0) {
      captionUrl = captionTracks[0].baseUrl;
    }
    
    if (!captionUrl) {
      throw new Error('No caption URL found');
    }
    
    // Fetch the actual captions
    const captionsResponse = await fetch(captionUrl);
    if (!captionsResponse.ok) {
      throw new Error('Failed to fetch captions');
    }
    
    const captionsXml = await captionsResponse.text();
    
    // Parse XML and extract text
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(captionsXml, 'text/xml');
    const textElements = xmlDoc.getElementsByTagName('text');
    
    let transcript = '';
    for (let i = 0; i < textElements.length; i++) {
      const text = textElements[i].textContent;
      // Decode HTML entities
      const decodedText = decodeHTMLEntities(text);
      transcript += decodedText + ' ';
    }
    
    if (!transcript.trim()) {
      throw new Error('Transcript is empty');
    }
    
    return transcript.trim();
  } catch (error) {
    console.error('Error fetching transcript:', error);
    throw error;
  }
}

// Helper function to decode HTML entities
function decodeHTMLEntities(text) {
  // Use DOMParser for safe HTML entity decoding
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/html');
  return doc.documentElement.textContent || text;
}

// Function to summarize text using Mistral AI via Hugging Face
async function summarizeWithMistral(text) {
  try {
    // Truncate text if too long (Mistral has token limits)
    // Approximate character limit - actual token count varies by model and language
    const maxLength = 3000; // approximate characters (~750 tokens)
    const textToSummarize = text.length > maxLength 
      ? text.substring(0, maxLength) + '...' 
      : text;
    
    // Using Hugging Face Inference API with Mistral model
    // Note: Users will need to add their own API key or use the free tier with rate limits
    const API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";
    
    // Try to get API key from storage
    const result = await chrome.storage.local.get(['hfApiKey']);
    const apiKey = result.hfApiKey || '';
    
    if (!apiKey) {
      throw new Error('Hugging Face API key not set. Please set your API key in the extension options. You can get a free API key from https://huggingface.co/settings/tokens');
    }
    
    const prompt = `Summarize the following YouTube video transcript in a clear and concise manner. Provide the main points and key takeaways:\n\n${textToSummarize}\n\nSummary:`;
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.7,
          top_p: 0.95,
          do_sample: true
        }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your Hugging Face API key.');
      } else if (response.status === 503) {
        throw new Error('Model is loading. Please try again in a few moments.');
      } else {
        throw new Error(errorData.error || `API request failed with status ${response.status}`);
      }
    }
    
    const data = await response.json();
    
    if (Array.isArray(data) && data.length > 0 && data[0].generated_text) {
      // Extract just the summary part (after the prompt)
      const fullText = data[0].generated_text;
      const summaryStart = fullText.indexOf('Summary:') + 8;
      const summary = fullText.substring(summaryStart).trim();
      return summary || fullText;
    } else if (data.error) {
      throw new Error(data.error);
    } else {
      throw new Error('Unexpected response format from API');
    }
  } catch (error) {
    console.error('Error summarizing text:', error);
    throw error;
  }
}

// Set up context menu for YouTube pages
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'summarizeVideo',
    title: 'Summarize this YouTube video',
    contexts: ['page'],
    documentUrlPatterns: ['https://www.youtube.com/watch*']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'summarizeVideo') {
    // Open popup or trigger summarization
    chrome.action.openPopup();
  }
});
