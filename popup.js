document.getElementById('saveSettings').addEventListener('click', () => {
  const webhookUrl = document.getElementById('webhookUrl').value;
  const username = document.getElementById('username').value;
  const webhookError = document.getElementById('webhook-error');
  const usernameError = document.getElementById('username-error');

  // Basic validation
  let isValid = true;
  webhookError.textContent = '';
  usernameError.textContent = '';

  if (!webhookUrl.startsWith('https://discord.com/api/webhooks/')) {
    webhookError.textContent = 'Invalid Webhook URL.  Must start with "https://discord.com/api/webhooks/".';
    isValid = false;
  }

    if (!username) {
    usernameError.textContent = "Username can not be empty"
    isValid = false;
    }

  if (isValid) {
    // Save settings using chrome.storage.sync
    chrome.storage.sync.set({ webhookUrl, username }, () => {
      // Notify user that settings are saved (optional)
      alert('Settings saved!');
       // Close the popup (optional)
      window.close();
    });
  }
});

// Load saved settings when popup opens
chrome.storage.sync.get(['webhookUrl', 'username'], (data) => {
  if (data.webhookUrl) {
    document.getElementById('webhookUrl').value = data.webhookUrl;
  }
    if (data.username) {
    document.getElementById('username').value = data.username;
  }
});