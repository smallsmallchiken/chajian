(() => {
  'use strict';

  function getAdapters() {
    return window.CampusAdapters || {};
  }

  function detectAdapter() {
    const Adapters = getAdapters();
    const host = location.hostname.toLowerCase();
    const path = location.pathname.toLowerCase();
    for (const [name, adapter] of Object.entries(Adapters)) {
      if (name === 'generic') continue;
      if (adapter.match && adapter.match({ host, path, url: location.href })) return adapter;
    }
    return Adapters.generic;
  }

  async function fillPage(profile) {
    const adapter = detectAdapter();
    if (!adapter) return { filled: 0, matched: [], errors: ['no adapter'] };
    return adapter.fill(profile);
  }

  window.CampusAdapter = {
    detectAdapter,
    fillPage
  };
})();
