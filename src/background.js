importScripts("config.js", "passwordGenerator.js");

const MENU_ID = "generate-secure-password";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: MENU_ID,
    title: "Generate Secure Password",
    contexts: ["editable"],
    documentUrlPatterns: ["http://*/*", "https://*/*"],
  });
  // Set default length if not set
  chrome.storage.sync.get(["passwordLength"], (data) => {
    if (!data.passwordLength) {
      chrome.storage.sync.set({ passwordLength: self.CONFIG.DEFAULT_LENGTH });
    }
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === MENU_ID && tab && tab.id != null) {
    chrome.storage.sync.get(["passwordLength"], (data) => {
      const length = data.passwordLength || self.CONFIG.DEFAULT_LENGTH;
      const pwd = generatePassword(length);
      // Send password to content script to fill last password field
      chrome.tabs.sendMessage(
        tab.id,
        { action: "fillPassword", password: pwd },
        (response) => {
          if (chrome.runtime.lastError) {
            // Attempt to inject content script dynamically, then resend
            chrome.scripting.executeScript(
              {
                target: { tabId: tab.id },
                files: ["contentScript.js"],
              },
              () => {
                if (!chrome.runtime.lastError) {
                  chrome.tabs.sendMessage(tab.id, {
                    action: "fillPassword",
                    password: pwd,
                  });
                }
              }
            );
          }
        }
      );
    });
  }
});
