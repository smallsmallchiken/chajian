(() => {
  'use strict';

  const { normalizeText, getFieldContext, setValue, flatProfile } = window.CampusUtils;
  const { matchField } = window.CampusFieldMatcher;

  function match({ host }) {
    return host.includes('chsi.com.cn') || host.includes('chsi.cn');
  }

  function fill(profile) {
    const flat = flatProfile(profile);
    const roots = window.CampusFormFinder.getAllIFramesAndRoots();
    let filled = 0;
    const matched = [];
    const usedKeys = new Set();

    for (const { doc } of roots) {
      const elements = window.CampusFormFinder.getFillableElements(doc);
      for (const el of elements) {
        const ctx = getFieldContext(el);
        let key = matchField(ctx, usedKeys);

        // chsi-specific patterns
        const combined = normalizeText(ctx.combined);
        if (!key) {
          if (combined.includes('推免资格') && combined.includes('专业')) key = 'major';
          if (combined.includes('本科') && combined.includes('专业')) key = 'major';
          if (combined.includes('本科') && combined.includes('学校')) key = 'school';
          if (combined.includes('录取') && combined.includes('学位') && !usedKeys.has('degree')) key = 'degree';
        }

        if (!key) continue;
        const value = flat[key];
        if (!value) continue;
        usedKeys.add(key);
        const success = setValue(el, value);
        if (success) {
          filled++;
          matched.push({ key, value: String(value).slice(0, 30), tag: el.tagName, label: ctx.labelraw });
        }
      }
    }

    // Chsi sometimes hides sections until previous is saved; notify user when possible.
    return { filled, matched, adapter: 'chsi' };
  }

  window.CampusAdapters = window.CampusAdapters || {};
  window.CampusAdapters.chsi = { match, fill };
})();
