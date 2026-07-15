(() => {
  'use strict';

  const { normalizeText } = window.CampusUtils;

  const FIELD_MAP = {
    name: {
      keys: ['姓名', 'name', '真实姓名', 'xm', 'xingming', 'fullname'],
      exclude: ['schoolname', 'classname', 'coursename', 'parentname', 'fathername', 'mothername', 'emergencyname']
    },
    gender: {
      keys: ['性别', 'gender', 'sex', 'xb', 'xingbie'],
      exclude: []
    },
    birthDate: {
      keys: ['出生日期', '生日', 'birth', 'birthday', 'born', 'csrq', 'chushengriqi', '出生年月'],
      exclude: []
    },
    nation: {
      keys: ['民族', 'nationality', 'nation', 'minzu', 'mz'],
      exclude: ['国家']
    },
    politicalStatus: {
      keys: ['政治面貌', 'political', 'politicalstatus', 'zzmm', 'zhengzhi', '面貌'],
      exclude: []
    },
    idCard: {
      keys: ['身份证', '身份证号', 'idcard', 'identitycard', 'shoufenzheng', 'sfz', '证件号', 'idnumber'],
      exclude: ['studentid', 'schoolid']
    },
    phone: {
      keys: ['手机', '电话', '联系电话', 'phone', 'mobile', 'tel', 'sjh', 'shouji', 'lianxidianhua', 'dhhm'],
      exclude: ['homephone', 'fatherphone', 'motherphone', 'emergencyphone']
    },
    email: {
      keys: ['邮箱', '电子邮件', 'email', 'e-mail', 'dianziyouxiang', 'yx'],
      exclude: []
    },
    qq: {
      keys: ['qq', 'qq号'],
      exclude: []
    },
    wechat: {
      keys: ['微信', '微信号', 'wechat', 'weixin'],
      exclude: []
    },
    address: {
      keys: ['通讯地址', '联系地址', 'address', 'dizhi', 'txdz', 'lxdz', '通信地址'],
      exclude: ['homeaddress', 'jtdz', '家庭住址', '户籍地址']
    },
    postcode: {
      keys: ['邮编', '邮政编码', 'postcode', 'zipcode', 'youbian', 'yzbm'],
      exclude: []
    },
    school: {
      keys: ['学校', '就读院校', '本科院校', '现就读学校', 'university', 'school', 'yuanxiao', 'xx', 'suozaidaxue'],
      exclude: ['middleschool', 'highschool', 'fatherschool']
    },
    department: {
      keys: ['学院', '院系', 'department', 'xueyuan', 'xy'],
      exclude: []
    },
    major: {
      keys: ['专业', '专业名称', 'major', 'zhuanye', 'zy', 'specially', 'specialty'],
      exclude: []
    },
    gpa: {
      keys: ['gpa', '平均成绩', '平均学分绩', '绩点', '平均绩点', '百分制成绩', '百分制'],
      exclude: []
    },
    rank: {
      keys: ['排名', '专业排名', '年级排名', 'rank', 'paiming', 'pm'],
      exclude: []
    },
    rankType: {
      keys: ['排名方式', '排名类型', 'ranktype'],
      exclude: []
    },
    degree: {
      keys: ['学位', '拟获学位', '将获得学位', 'degree', 'xuewei'],
      exclude: []
    },
    enrollmentYear: {
      keys: ['入学年份', '入学时间', 'enrollment', 'ruxuenianfen', 'rxnf'],
      exclude: []
    },
    graduationYear: {
      keys: ['毕业年份', '毕业时间', 'graduation', 'biyenianfen', 'bynf', '预计毕业'],
      exclude: []
    },
    studentId: {
      keys: ['学号', 'studentid', 'studentno', 'xuehao', 'xh', '学籍号'],
      exclude: []
    },
    tutor: {
      keys: ['导师', '指导教师', 'tutor', 'daoshi', 'ds'],
      exclude: []
    },
    fatherName: {
      keys: ['父亲姓名', '父亲名字', 'fathername'],
      exclude: []
    },
    fatherPhone: {
      keys: ['父亲电话', '父亲手机', 'fatherphone', 'fathertel'],
      exclude: []
    },
    fatherOccupation: {
      keys: ['父亲职业', '父亲工作单位', 'fatheroccupation', 'fatherwork'],
      exclude: []
    },
    motherName: {
      keys: ['母亲姓名', '母亲名字', 'mothername'],
      exclude: []
    },
    motherPhone: {
      keys: ['母亲电话', '母亲手机', 'motherphone', 'mothertel'],
      exclude: []
    },
    motherOccupation: {
      keys: ['母亲职业', '母亲工作单位', 'motheroccupation', 'motherwork'],
      exclude: []
    },
    homeAddress: {
      keys: ['家庭住址', '家庭地址', '户籍地址', 'homeaddress', 'jtdz', 'huji', '户籍'],
      exclude: []
    },
    cet4: {
      keys: ['四级', 'cet4', '英语四级', 'cet4成绩', '大学英语四级'],
      exclude: []
    },
    cet6: {
      keys: ['六级', 'cet6', '英语六级', 'cet6成绩', '大学英语六级'],
      exclude: []
    },
    ielts: {
      keys: ['雅思', 'ielts', 'yasi'],
      exclude: []
    },
    toefl: {
      keys: ['托福', 'toefl', 'tuofu'],
      exclude: []
    },
    gre: {
      keys: ['gre'],
      exclude: []
    },
    gmat: {
      keys: ['gmat'],
      exclude: []
    },
    personalStatement: {
      keys: ['个人陈述', '自述', '个人简介', 'personalstatement', 'ps', 'gerenchenshu', '自述信'],
      exclude: []
    },
    researchPlan: {
      keys: ['研究计划', '攻读计划', '研究规划', 'researchplan', 'yanjiujihua', '学习计划'],
      exclude: []
    },
    reason: {
      keys: ['申请理由', '报考原因', '申请原因', 'reason', 'shenqingliyou', 'whyapply'],
      exclude: []
    },
    awardsText: {
      keys: ['获奖情况', '获奖', '奖励', 'awards', 'jiangli', 'huojiang'],
      exclude: []
    },
    papersText: {
      keys: ['发表论文', '论文', '科研成果', 'papers', 'publications', 'lunwen'],
      exclude: []
    },
    projectsText: {
      keys: ['科研项目', '项目经历', '科研经历', '项目', 'projects', 'xiangmu', 'keyan'],
      exclude: []
    }
  };

  const PRECEDENCE_ORDER = [
    'name', 'gender', 'birthDate', 'nation', 'politicalStatus', 'idCard',
    'phone', 'email', 'qq', 'wechat', 'address', 'postcode',
    'school', 'department', 'major', 'gpa', 'rank', 'rankType',
    'degree', 'enrollmentYear', 'graduationYear', 'studentId', 'tutor',
    'fatherName', 'fatherPhone', 'fatherOccupation',
    'motherName', 'motherPhone', 'motherOccupation', 'homeAddress',
    'cet4', 'cet6', 'ielts', 'toefl', 'gre', 'gmat',
    'personalStatement', 'researchPlan', 'reason', 'awardsText', 'papersText', 'projectsText'
  ];

  function hasChinese(text) {
    return /[\u4e00-\u9fa5]/.test(text);
  }

  function keywordMatches(text, keyword) {
    if (hasChinese(keyword)) {
      return text.includes(keyword);
    }
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i');
    return re.test(text);
  }

  function matchField(context, used = new Set()) {
    const text = normalizeText(context.combined || '');
    for (const key of PRECEDENCE_ORDER) {
      if (used.has(key)) continue;
      const cfg = FIELD_MAP[key];
      if (!cfg) continue;
      const matched = cfg.keys.some(k => keywordMatches(text, k));
      const excluded = cfg.exclude.some(k => text.includes(k));
      if (matched && !excluded) return key;
    }
    return null;
  }

  function getValueByKey(profile, key) {
    const flat = window.CampusUtils.flatProfile(profile);
    return flat[key];
  }

  window.CampusFieldMatcher = {
    FIELD_MAP,
    PRECEDENCE_ORDER,
    matchField,
    getValueByKey
  };
})();
