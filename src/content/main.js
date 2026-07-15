(() => {
  'use strict';

  async function performFill() {
    const profile = await window.CampusProfile.getProfile();
    const result = await window.CampusAdapter.fillPage(profile);
    console.log('[夏令营填表助手] 填充结果:', result);
    return result;
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'ping') {
      sendResponse({ ok: true });
      return false;
    }
    if (request.action === 'fill') {
      performFill()
        .then(sendResponse)
        .catch(err => sendResponse({ filled: 0, matched: [], errors: [err.message] }));
      return true;
    }
    if (request.action === 'getProfile') {
      window.CampusProfile.getProfile().then(sendResponse);
      return true;
    }
  });

  // Expose for manual debugging.
  window.CampusAutoFill = { performFill };
})();
