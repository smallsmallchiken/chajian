(() => {
  'use strict';

  const STORAGE_KEY = 'campus_profile_v1';
  const DEFAULT_PROFILE = {
    basic: {
      name: '',
      gender: '',
      birthDate: '',
      nation: '',
      politicalStatus: '',
      idCard: ''
    },
    contact: {
      phone: '',
      email: '',
      qq: '',
      wechat: '',
      address: '',
      postcode: ''
    },
    education: {
      school: '',
      major: '',
      gpa: '',
      rank: '',
      rankType: '',
      degree: '',
      enrollmentYear: '',
      graduationYear: '',
      studentId: '',
      schoolType: '',
      department: '',
      tutor: ''
    },
    identity: {
      idCard: '',
      passport: ''
    },
    family: {
      fatherName: '',
      fatherPhone: '',
      fatherOccupation: '',
      motherName: '',
      motherPhone: '',
      motherOccupation: '',
      homeAddress: ''
    },
    grades: {
      cet4: '',
      cet6: '',
      ielts: '',
      toefl: '',
      gre: '',
      gmat: '',
      score: ''
    },
    awards: [],
    papers: [],
    projects: [],
    statement: {
      personalStatement: '',
      researchPlan: '',
      reason: ''
    }
  };

  async function getProfile() {
    const result = await chrome.storage.local.get(STORAGE_KEY);
    const stored = result[STORAGE_KEY] || {};
    return mergeDeep(JSON.parse(JSON.stringify(DEFAULT_PROFILE)), stored);
  }

  async function saveProfile(profile) {
    const cleaned = mergeDeep(JSON.parse(JSON.stringify(DEFAULT_PROFILE)), profile);
    await chrome.storage.local.set({ [STORAGE_KEY]: cleaned });
    return cleaned;
  }

  function mergeDeep(base, override) {
    const output = { ...base };
    if (isObject(base) && isObject(override)) {
      for (const key of Object.keys(override)) {
        if (isObject(override[key])) {
          if (!(key in base)) Object.assign(output, { [key]: override[key] });
          else output[key] = mergeDeep(base[key], override[key]);
        } else {
          Object.assign(output, { [key]: override[key] });
        }
      }
    }
    return output;
  }

  function isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
  }

  function exportProfile(profile) {
    const blob = new Blob([JSON.stringify(profile, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campus_profile_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function importProfile(file) {
    const text = await file.text();
    const parsed = JSON.parse(text);
    return saveProfile(parsed);
  }

  window.CampusProfile = {
    STORAGE_KEY,
    DEFAULT_PROFILE,
    getProfile,
    saveProfile,
    exportProfile,
    importProfile,
    isObject
  };
})();
