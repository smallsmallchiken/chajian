(() => {
  const sampleProfile = {
    basic: {
      name: '张三',
      gender: '男',
      birthDate: '2002-05-10',
      nation: '汉族',
      politicalStatus: '共青团员',
      idCard: '110101200205101234'
    },
    contact: {
      phone: '13800138000',
      email: 'zhangsan@example.com'
    },
    education: {
      school: '北京大学',
      department: '计算机学院',
      major: '计算机科学与技术',
      rank: '3/120',
      gpa: '3.85',
      degree: '学士'
    },
    grades: {
      cet4: '620',
      cet6: '580'
    },
    statement: {
      personalStatement: '我对人工智能方向有浓厚兴趣，希望继续深造。'
    },
    awards: ['国家奖学金', 'ACM-ICPC 区域赛金奖'],
    papers: [],
    projects: []
  };

  document.getElementById('fill').addEventListener('click', async () => {
    const result = await window.CampusAdapter.fillPage(sampleProfile);
    document.getElementById('result').textContent = JSON.stringify(result, null, 2);
  });
})();
