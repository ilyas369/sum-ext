// options.js - Handle options page functionality

document.addEventListener('DOMContentLoaded', function() {
  const apiKeyInput = document.getElementById('apiKey');
  const saveBtn = document.getElementById('saveBtn');
  const successMessage = document.getElementById('successMessage');

  // Load saved settings
  chrome.storage.local.get(['hfApiKey'], function(result) {
    if (result.hfApiKey) {
      apiKeyInput.value = result.hfApiKey;
    }
  });

  // Save settings
  saveBtn.addEventListener('click', function() {
    const apiKey = apiKeyInput.value.trim();
    
    if (!apiKey) {
      alert('Please enter an API key');
      return;
    }

    if (!apiKey.startsWith('hf_')) {
      alert('Invalid API key format. Hugging Face API keys should start with "hf_"');
      return;
    }

    chrome.storage.local.set({ hfApiKey: apiKey }, function() {
      successMessage.classList.add('show');
      
      setTimeout(() => {
        successMessage.classList.remove('show');
      }, 3000);
    });
  });
});
