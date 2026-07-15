(() => {
  'use strict';

  const fillBtn = document.getElementById('fillBtn');
  const optionsBtn = document.getElementById('optionsBtn');
  const siteEl = document.getElementById('site');
  const resultEl = document.getElementById('result');
  const filledCountEl = document.getElementById('filledCount');
  const matchedListEl = document.getElementById('matchedList');
  const exportLink = document.getElementById('exportLink');
  const importLink = document.getElementById('importLink');
  const importInput = document.getElementById('importInput');

  async function init() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url) {
      siteEl.textContent = new URL(tab.url).hostname;
    }
  }

  fillBtn.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) return;
    try {
      const [injected] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          if (window.CampusAutoFill) {
            return window.CampusAutoFill.performFill();
          }
          return Promise.resolve({ filled: -1, matched: [] });
        }
      });
      const response = await injected?.result;
      showResult(response);
    } catch (err) {
      showResult({ filled: 0, matched: [], errors: [err.message] });
    }
  });

  optionsBtn.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
    window.close();
  });

  exportLink.addEventListener('click', async (e) => {
    e.preventDefault();
    const profile = await chrome.storage.local.get('campus_profile_v1');
    if (!profile.campus_profile_v1) {
      alert('还没有填写个人信息，请先到"管理个人信息"页面录入。');
      return;
    }
    const blob = new Blob([JSON.stringify(profile.campus_profile_v1, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campus_profile_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  importLink.addEventListener('click', (e) => {
    e.preventDefault();
    importInput.click();
  });

  importInput.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      await chrome.storage.local.set({ campus_profile_v1: parsed });
      alert('导入成功！');
    } catch (err) {
      alert('导入失败：' + err.message);
    }
  });

  function showResult(result) {
    resultEl.hidden = false;
    filledCountEl.textContent = result?.filled ?? 0;
    matchedListEl.innerHTML = '';
    if (!result?.matched?.length) {
      matchedListEl.innerHTML = '<li style="justify-content:center;color:#6b7280">未匹配到可填写项</li>';
      return;
    }
    for (const item of result.matched.slice(0, 20)) {
      const li = document.createElement('li');
      li.innerHTML = `<span class="key">${escapeHtml(item.key)}</span><span class="val">${escapeHtml(item.label || item.value)}</span>`;
      matchedListEl.appendChild(li);
    }
    if (result.matched.length > 20) {
      const li = document.createElement('li');
      li.style.justifyContent = 'center';
      li.style.color = '#6b7280';
      li.textContent = `还有 ${result.matched.length - 20} 项已折叠`;
      matchedListEl.appendChild(li);
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  init();
})();
