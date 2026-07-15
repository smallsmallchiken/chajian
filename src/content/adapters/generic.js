(() => {
  'use strict';

  const { getFieldContext, setValue, flatProfile } = window.CampusUtils;
  const { matchField } = window.CampusFieldMatcher;

  function match() {
    return true;
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
        const key = matchField(ctx, usedKeys);
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

    return { filled, matched };
  }

  window.CampusAdapters = window.CampusAdapters || {};
  window.CampusAdapters.generic = { match, fill };
})();
