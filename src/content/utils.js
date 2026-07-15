(() => {
  'use strict';

  function normalizeText(text) {
    if (!text) return '';
    return text
      .toString()
      .replace(/[\s\-_]+/g, '')
      .replace(/[：:]/g, '')
      .toLowerCase()
      .trim();
  }

  function findLabelText(input) {
    const id = input.id;
    if (id) {
      const label = input.ownerDocument.querySelector(`label[for="${id}"]`);
      if (label && label.textContent) return label.textContent.trim();
    }
    let el = input;
    while (el && el.parentElement) {
      el = el.parentElement;
      const label = el.querySelector('label');
      if (label && label.textContent) return label.textContent.trim();
    }
    const prev = input.previousElementSibling;
    if (prev && prev.textContent) return prev.textContent.trim();
    const parentText = input.parentElement?.textContent;
    if (parentText) return parentText.trim();
    return '';
  }

  function getAllAttributes(input) {
    const parts = [];
    ['name', 'id', 'placeholder', 'class'].forEach(attr => {
      const v = input.getAttribute(attr);
      if (v) parts.push(v);
    });
    const aria = input.getAttribute('aria-label');
    if (aria) parts.push(aria);
    return normalizeText(parts.join(' '));
  }

  function getFieldContext(input) {
    const label = findLabelText(input);
    const attrs = getAllAttributes(input);
    const placeholder = normalizeText(input.placeholder || '');
    return {
      labelraw: label,
      label: normalizeText(label),
      attrs,
      placeholder,
      combined: `${label} ${attrs} ${placeholder}`
    };
  }

  function setValue(input, value) {
    if (value === undefined || value === null || value === '') return false;
    const tag = input.tagName.toLowerCase();
    const type = (input.type || 'text').toLowerCase();

    if (tag === 'select') {
      const matched = Array.from(input.options).find(opt =>
        opt.text.includes(value) || opt.value === value || normalizeText(opt.text) === normalizeText(value)
      );
      if (matched) {
        input.value = matched.value;
      } else {
        const exact = Array.from(input.options).find(opt =>
          normalizeText(opt.text).includes(normalizeText(value)) ||
          normalizeText(value).includes(normalizeText(opt.text))
        );
        if (exact) input.value = exact.value;
      }
      triggerEvents(input);
      return true;
    }

    if (type === 'radio') {
      if (input.value === value || normalizeText(input.value).includes(normalizeText(value))) {
        input.checked = true;
        triggerEvents(input);
        return true;
      }
      return false;
    }

    if (type === 'checkbox') {
      if (value === true || value === '是' || value === 'yes') {
        input.checked = true;
      } else if (value === false || value === '否' || value === 'no') {
        input.checked = false;
      }
      triggerEvents(input);
      return true;
    }

    if (type === 'date' && value.length === 8 && /^\d{8}$/.test(value.replace(/-/g, ''))) {
      input.value = `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
    } else {
      input.value = value;
    }
    triggerEvents(input);
    return true;
  }

  function triggerEvents(input) {
    ['focus', 'input', 'change', 'blur'].forEach(type => {
      const event = new Event(type, { bubbles: true, cancelable: true });
      input.dispatchEvent(event);
    });
  }

  function flatProfile(profile) {
    const flat = {};
    for (const section of Object.values(profile)) {
      if (Array.isArray(section)) continue;
      if (typeof section !== 'object') continue;
      for (const [key, value] of Object.entries(section)) {
        if (value !== undefined && value !== '') flat[key] = value;
      }
    }
    flat.awardsText = (profile.awards || []).join('\n');
    flat.papersText = (profile.papers || []).map(p => typeof p === 'string' ? p : `${p.title || ''} ${p.journal || ''} ${p.year || ''}`.trim()).join('\n');
    flat.projectsText = (profile.projects || []).map(p => typeof p === 'string' ? p : `${p.name || ''} ${p.role || ''} ${p.desc || ''}`.trim()).join('\n');
    return flat;
  }

  window.CampusUtils = {
    normalizeText,
    findLabelText,
    getAllAttributes,
    getFieldContext,
    setValue,
    triggerEvents,
    flatProfile
  };
})();
