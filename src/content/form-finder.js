(() => {
  'use strict';

  function getFillableElements(doc = document) {
    const inputs = Array.from(doc.querySelectorAll('input, select, textarea'));
    const visibleEditable = inputs.filter(el => {
      if (el.disabled || el.readOnly) return false;
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetParent !== null;
    });
    return visibleEditable;
  }

  function getAllIFramesAndRoots() {
    const roots = [{ doc: document, win: window }];
    const frames = document.querySelectorAll('iframe');
    for (const frame of frames) {
      try {
        const fdoc = frame.contentDocument;
        const fwin = frame.contentWindow;
        if (fdoc && fwin) roots.push({ doc: fdoc, win: fwin });
      } catch (e) {
        // Cross-origin iframe ignored
      }
    }
    return roots;
  }

  function groupIntoFields(elements) {
    // If the page uses labelled wrappers, each wrapper probably corresponds to one form field.
    const groups = [];
    const visited = new Set();
    for (const el of elements) {
      if (visited.has(el)) continue;
      const wrapper = findFieldWrapper(el);
      const siblings = wrapper ? findSiblingsInWrapper(wrapper, el) : [el];
      visited.add(el);
      groups.push({ wrapper, main: el, siblings });
    }
    return groups;
  }

  function findFieldWrapper(el) {
    let curr = el;
    for (let i = 0; i < 6; i++) {
      if (!curr || curr === document.body) return null;
      const text = (curr.textContent || '').trim();
      if (text.length > 0 && text.length < 80) return curr;
      curr = curr.parentElement;
    }
    return null;
  }

  function findSiblingsInWrapper(wrapper, main) {
    const tag = main.tagName.toLowerCase();
    return Array.from(wrapper.querySelectorAll(`${tag}`)).filter(el => el !== main);
  }

  window.CampusFormFinder = {
    getFillableElements,
    getAllIFramesAndRoots,
    groupIntoFields,
    findFieldWrapper
  };
})();
