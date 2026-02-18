// options.js - Handle options page functionality

document.addEventListener('DOMContentLoaded', function() {
  const apiKeyInput = document.getElementById('apiKey');
  const saveBtn = document.getElementById('saveBtn');
  const successMessage = document.getElementById('successMessage');
  const errorMessage = document.getElementById('errorMessage');

  // Load saved settings
  chrome.storage.local.get(['hfApiKey'], function(result) {
    if (result.hfApiKey) {
      apiKeyInput.value = result.hfApiKey;
    }
  });

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    successMessage.classList.remove('show');
    
    setTimeout(() => {
      errorMessage.classList.remove('show');
    }, 5000);
  }

  function showSuccess() {
    successMessage.classList.add('show');
    errorMessage.classList.remove('show');
    
    setTimeout(() => {
      successMessage.classList.remove('show');
    }, 3000);
  }

  // Save settings
  saveBtn.addEventListener('click', function() {
    const apiKey = apiKeyInput.value.trim();
    
    if (!apiKey) {
      showError('Please enter an API key');
      return;
    }

    if (!apiKey.startsWith('hf_')) {
      showError('Invalid API key format. Hugging Face API keys should start with "hf_"');
      return;
    }

    chrome.storage.local.set({ hfApiKey: apiKey }, function() {
      showSuccess();
    });
  });
});
