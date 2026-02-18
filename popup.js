// popup.js - Main popup functionality

let currentTranscript = '';
let currentSummary = '';
let currentVideoId = '';

document.addEventListener('DOMContentLoaded', function() {
  const videoUrlInput = document.getElementById('videoUrl');
  const extractBtn = document.getElementById('extractBtn');
  const summarizeBtn = document.getElementById('summarizeBtn');
  const exportTxtBtn = document.getElementById('exportTxt');
  const exportJsonBtn = document.getElementById('exportJson');
  const copyBtn = document.getElementById('copyBtn');

  // Check if we're on a YouTube page and auto-fill the URL
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const currentTab = tabs[0];
    if (currentTab.url && currentTab.url.includes('youtube.com/watch')) {
      videoUrlInput.value = currentTab.url;
    }
  });

  extractBtn.addEventListener('click', extractTranscript);
  summarizeBtn.addEventListener('click', summarizeTranscript);
  exportTxtBtn.addEventListener('click', () => exportAs('txt'));
  exportJsonBtn.addEventListener('click', () => exportAs('json'));
  copyBtn.addEventListener('click', copyToClipboard);

  // Allow Enter key to trigger extraction
  videoUrlInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      extractTranscript();
    }
  });
});

function showLoading(text = 'Processing...') {
  document.getElementById('loading').classList.remove('hidden');
  document.getElementById('loadingText').textContent = text;
  document.getElementById('error').classList.add('hidden');
}

function hideLoading() {
  document.getElementById('loading').classList.add('hidden');
}

function showError(message) {
  const errorDiv = document.getElementById('error');
  const errorMessage = errorDiv.querySelector('.error-message');
  errorMessage.textContent = message;
  errorDiv.classList.remove('hidden');
  hideLoading();
}

function hideError() {
  document.getElementById('error').classList.add('hidden');
}

function extractVideoId(url) {
  const regex = /[?&]v=([^&#]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

async function extractTranscript() {
  const videoUrl = document.getElementById('videoUrl').value.trim();
  
  if (!videoUrl) {
    showError('Please enter a YouTube video URL');
    return;
  }

  const videoId = extractVideoId(videoUrl);
  if (!videoId) {
    showError('Invalid YouTube URL. Please enter a valid video URL.');
    return;
  }

  currentVideoId = videoId;
  showLoading('Extracting transcript...');
  hideError();

  try {
    // Send message to background script to fetch transcript
    chrome.runtime.sendMessage(
      { action: 'getTranscript', videoId: videoId },
      function(response) {
        if (chrome.runtime.lastError) {
          showError('Error: ' + chrome.runtime.lastError.message);
          return;
        }

        if (response.success) {
          currentTranscript = response.transcript;
          displayTranscript(response.transcript);
          hideLoading();
        } else {
          showError(response.error || 'Failed to extract transcript');
        }
      }
    );
  } catch (error) {
    showError('Error extracting transcript: ' + error.message);
  }
}

function displayTranscript(transcript) {
  const transcriptSection = document.getElementById('transcriptSection');
  const transcriptText = document.getElementById('transcriptText');
  
  transcriptText.textContent = transcript;
  transcriptSection.classList.remove('hidden');
}

async function summarizeTranscript() {
  if (!currentTranscript) {
    showError('No transcript available to summarize');
    return;
  }

  showLoading('Generating summary with AI... This may take a minute.');
  hideError();

  try {
    // Send message to background script to summarize with Mistral
    chrome.runtime.sendMessage(
      { action: 'summarize', text: currentTranscript },
      function(response) {
        if (chrome.runtime.lastError) {
          showError('Error: ' + chrome.runtime.lastError.message);
          return;
        }

        if (response.success) {
          currentSummary = response.summary;
          displaySummary(response.summary);
          hideLoading();
        } else {
          showError(response.error || 'Failed to generate summary');
        }
      }
    );
  } catch (error) {
    showError('Error generating summary: ' + error.message);
  }
}

function displaySummary(summary) {
  const summarySection = document.getElementById('summarySection');
  const summaryText = document.getElementById('summaryText');
  
  summaryText.textContent = summary;
  summarySection.classList.remove('hidden');
}

function exportAs(format) {
  if (!currentSummary) {
    showError('No summary available to export');
    return;
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  let filename, content, mimeType;

  if (format === 'txt') {
    filename = `youtube-summary-${currentVideoId}-${timestamp}.txt`;
    content = `YouTube Video Summary\n`;
    content += `Video ID: ${currentVideoId}\n`;
    content += `Date: ${new Date().toLocaleString()}\n`;
    content += `\n${'='.repeat(50)}\n\n`;
    content += `TRANSCRIPT:\n${currentTranscript}\n\n`;
    content += `${'='.repeat(50)}\n\n`;
    content += `SUMMARY:\n${currentSummary}`;
    mimeType = 'text/plain';
  } else if (format === 'json') {
    filename = `youtube-summary-${currentVideoId}-${timestamp}.json`;
    const data = {
      videoId: currentVideoId,
      timestamp: new Date().toISOString(),
      transcript: currentTranscript,
      summary: currentSummary
    };
    content = JSON.stringify(data, null, 2);
    mimeType = 'application/json';
  }

  // Create download
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function copyToClipboard() {
  if (!currentSummary) {
    showError('No summary available to copy');
    return;
  }

  const textToCopy = `YouTube Video Summary\nVideo ID: ${currentVideoId}\n\nSummary:\n${currentSummary}`;
  
  navigator.clipboard.writeText(textToCopy).then(() => {
    // Show temporary success message
    const copyBtn = document.getElementById('copyBtn');
    const originalText = copyBtn.textContent;
    copyBtn.textContent = '✓ Copied!';
    copyBtn.style.background = '#2196F3';
    
    setTimeout(() => {
      copyBtn.textContent = originalText;
      copyBtn.style.background = '#4caf50';
    }, 2000);
  }).catch(err => {
    showError('Failed to copy to clipboard: ' + err.message);
  });
}
