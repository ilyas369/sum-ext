// content.js - Content script for YouTube pages

// This script runs on YouTube pages and can add UI elements directly on the page

console.log('YouTube Transcript Summarizer loaded');

// Add a button to YouTube video pages
function addSummarizeButton() {
  // Check if we're on a video page
  if (!window.location.pathname.startsWith('/watch')) {
    return;
  }

  // Check if button already exists
  if (document.getElementById('yt-summarize-btn')) {
    return;
  }

  // Wait for YouTube's UI to load
  const observer = new MutationObserver(() => {
    const targetElement = document.querySelector('#actions');
    
    if (targetElement && !document.getElementById('yt-summarize-btn')) {
      // Create button
      const button = document.createElement('button');
      button.id = 'yt-summarize-btn';
      button.textContent = '📝 Summarize';
      button.style.cssText = `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 18px;
        font-weight: 600;
        cursor: pointer;
        margin-left: 8px;
        font-size: 14px;
        transition: transform 0.2s;
      `;
      
      button.addEventListener('mouseover', () => {
        button.style.transform = 'scale(1.05)';
      });
      
      button.addEventListener('mouseout', () => {
        button.style.transform = 'scale(1)';
      });
      
      button.addEventListener('click', () => {
        // Open the extension popup
        chrome.runtime.sendMessage({ action: 'openPopup' });
      });
      
      // Insert button into YouTube UI
      targetElement.appendChild(button);
      observer.disconnect();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Initialize
addSummarizeButton();

// Re-add button when navigating between videos (YouTube uses SPA navigation)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    setTimeout(addSummarizeButton, 1000);
  }
}).observe(document.body, { subtree: true, childList: true });
