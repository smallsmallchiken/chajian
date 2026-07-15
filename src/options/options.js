(() => {
  'use strict';

  const PROFILE_MAP = {
    basic: {
      name: '姓名',
      gender: '性别',
      birthDate: '出生日期',
      nation: '民族',
      politicalStatus: '政治面貌',
      idCard: '身份证号'
    },
    contact: {
      phone: '手机号',
      email: '电子邮箱',
      qq: 'QQ',
      wechat: '微信号',
      address: '通讯地址',
      postcode: '邮编'
    },
    education: {
      school: '本科学校',
      department: '学院',
      major: '专业',
      gpa: '绩点 / 平均分',
      rank: '专业排名',
      rankType: '排名方式（如 5/120）',
      degree: '拟获学位',
      enrollmentYear: '入学年份',
      graduationYear: '毕业年份',
      studentId: '学号',
      schoolType: '学校类型',
      tutor: '导师'
    },
    identity: {
      idCard: '身份证号',
      passport: '护照号'
    },
    family: {
      fatherName: '父亲姓名',
      fatherPhone: '父亲电话',
      fatherOccupation: '父亲职业/单位',
      motherName: '母亲姓名',
      motherPhone: '母亲电话',
      motherOccupation: '母亲职业/单位',
      homeAddress: '家庭住址'
    },
    grades: {
      cet4: '英语四级',
      cet6: '英语六级',
      ielts: '雅思',
      toefl: '托福',
      gre: 'GRE',
      gmat: 'GMAT',
      score: '其他成绩'
    },
    statement: {
      personalStatement: '个人陈述',
      researchPlan: '研究计划',
      reason: '申请理由'
    }
  };

  const TEXTAREA_KEYS = ['personalStatement', 'researchPlan', 'reason'];

  let currentProfile = {};

  async function init() {
    await renderNav();
    await loadProfile();
    renderForm();
    bindEvents();
  }

  async function loadProfile() {
    const result = await chrome.storage.local.get('campus_profile_v1');
    currentProfile = deepMerge(DEFAULT_PROFILE_BASE, result.campus_profile_v1 || {});
    populateTextAreas();
  }

  function renderForm() {
    for (const [section, fields] of Object.entries(PROFILE_MAP)) {
      const container = document.querySelector(`[data-section="${section}"]`);
      if (!container) continue;
      container.innerHTML = '';
      for (const [key, label] of Object.entries(fields)) {
        const value = (currentProfile[section] && currentProfile[section][key]) || '';
        const field = createField(section, key, label, value);
        container.appendChild(field);
      }
    }
  }

  function createField(section, key, label, value) {
    const div = document.createElement('div');
    div.className = 'field';
    const labelEl = document.createElement('label');
    labelEl.textContent = label;
    labelEl.htmlFor = `${section}-${key}`;
    div.appendChild(labelEl);

    let input;
    if (TEXTAREA_KEYS.includes(key)) {
      input = document.createElement('textarea');
      input.rows = 4;
    } else if (key.toLowerCase().includes('date') || key.toLowerCase().includes('birth')) {
      input = document.createElement('input');
      input.type = value && value.includes('-') ? 'date' : 'text';
      input.placeholder = '如 2002-05-10 或 20020510';
    } else if (key === 'gender') {
      input = document.createElement('select');
      input.innerHTML = `<option value="">请选择</option><option value="男">男</option><option value="女">女</option>`;
    } else {
      input = document.createElement('input');
      input.type = 'text';
    }
    input.id = `${section}-${key}`;
    input.dataset.section = section;
    input.dataset.key = key;
    input.value = value;
    div.appendChild(input);
    return div;
  }

  function populateTextAreas() {
    document.getElementById('awards').value = (currentProfile.awards || []).join('\n');
    document.getElementById('papers').value = (currentProfile.papers || []).map(p =>
      typeof p === 'string' ? p : `${p.title || ''} / ${p.journal || ''} / ${p.year || ''}`.trim()
    ).join('\n');
    document.getElementById('projects').value = (currentProfile.projects || []).map(p =>
      typeof p === 'string' ? p : `${p.name || ''} / ${p.role || ''} / ${p.desc || ''}`.trim()
    ).join('\n');
  }

  async function saveProfile() {
    const profile = JSON.parse(JSON.stringify(DEFAULT_PROFILE_BASE));

    document.querySelectorAll('.field input, .field select, .field textarea').forEach(el => {
      const section = el.dataset.section;
      const key = el.dataset.key;
      if (!section || !key) return;
      if (!profile[section]) profile[section] = {};
      profile[section][key] = el.value.trim();
    });

    profile.awards = document.getElementById('awards').value.split('\n').map(s => s.trim()).filter(Boolean);
    profile.papers = document.getElementById('papers').value.split('\n').map(s => s.trim()).filter(Boolean);
    profile.projects = document.getElementById('projects').value.split('\n').map(s => s.trim()).filter(Boolean);

    await chrome.storage.local.set({ campus_profile_v1: profile });
    currentProfile = profile;
    showToast('保存成功');
  }

  function exportProfile() {
    const blob = new Blob([JSON.stringify(currentProfile, null, 2)], { type: 'application/json' });
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
    await chrome.storage.local.set({ campus_profile_v1: parsed });
    currentProfile = deepMerge(DEFAULT_PROFILE_BASE, parsed);
    renderForm();
    populateTextAreas();
    showToast('导入成功');
  }

  function bindEvents() {
    document.getElementById('saveProfile').addEventListener('click', saveProfile);
    document.getElementById('exportProfile').addEventListener('click', exportProfile);
    document.getElementById('importProfile').addEventListener('click', () => {
      document.getElementById('importInput').click();
    });
    document.getElementById('importInput').addEventListener('change', (e) => {
      if (e.target.files?.[0]) importProfile(e.target.files[0]);
    });
  }

  async function renderNav() {
    const nav = document.getElementById('nav');
    const sections = document.querySelectorAll('main .panel');
    for (const section of sections) {
      const a = document.createElement('a');
      a.href = `#${section.id}`;
      a.textContent = section.querySelector('h3').textContent;
      nav.appendChild(a);
    }
  }

  function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.hidden = false;
    setTimeout(() => { toast.hidden = true; }, 2000);
  }

  function deepMerge(base, override) {
    const out = JSON.parse(JSON.stringify(base));
    for (const key of Object.keys(override)) {
      if (out[key] && typeof out[key] === 'object' && !Array.isArray(override[key])) {
        Object.assign(out[key], override[key]);
      } else {
        out[key] = override[key];
      }
    }
    return out;
  }

  const DEFAULT_PROFILE_BASE = {
    basic: {},
    contact: {},
    education: {},
    identity: {},
    family: {},
    grades: {},
    statement: {},
    awards: [],
    papers: [],
    projects: []
  };

  init();
})();
