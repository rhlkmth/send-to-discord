// Function to send the message to Discord (same as before)
function sendToDiscord(content) {
  chrome.storage.sync.get(['webhookUrl', 'username'], (data) => {
    if (!data.webhookUrl || !data.username) {
      console.error('Webhook URL or username not set.  Open the extension popup to configure.');
      return;
    }

    const payload = {
      content: `**${data.username}**: ${content}`,
    };

    fetch(data.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok ${response.status} ${response.statusText}`);
      }
    })
    .catch(error => {
      console.error('Error sending to Discord:', error);
      // In a real extension, you'd show this error to the user, maybe via a notification.
    });
  });
}


// Context menu item creation (same as before)
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'send-image',
    title: 'Send Image to Discord',
    contexts: ['image'],
  });
  chrome.contextMenus.create({
    id: 'send-link',
    title: 'Send Link to Discord',
    contexts: ['link'],
  });
  chrome.contextMenus.create({
    id: 'send-selection',
    title: 'Send Selection to Discord',
    contexts: ['selection'],
  });
  chrome.contextMenus.create({
    id: 'send-page',
    title: 'Send Page to Discord',
    contexts: ['page'],
  });
});

// Context menu click handler (same as before)
chrome.contextMenus.onClicked.addListener((info, tab) => {
  let content = '';

  switch (info.menuItemId) {
    case 'send-image':
      content = info.srcUrl;
      break;
    case 'send-link':
      content = info.linkUrl;
      break;
    case 'send-selection':
      content = `"${info.selectionText}" - ${info.pageUrl}`;
      break;
    case 'send-page':
      content = info.pageUrl;
      break;
  }

  if (content) {
    sendToDiscord(content);
  }
});

// NEW: Listen for the keyboard shortcut command
chrome.commands.onCommand.addListener((command) => {
  if (command === 'send-page-shortcut') {
    // Get the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs.length > 0) {
        const currentTab = tabs[0];
        sendToDiscord(currentTab.url);
      }
    });
  }
});