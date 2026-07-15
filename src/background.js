(() => {
  'use strict';

  chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ installDate: new Date().toISOString() });
  });

  chrome.action.onClicked.addListener(async (tab) => {
    // Left-click on extension icon triggers quick fill.
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          if (window.CampusAutoFill) window.CampusAutoFill.performFill();
        }
      });
    } catch (e) {
      console.error('[夏令营填表助手] 快速填充失败:', e);
    }
  });
})();
