export interface OperatorBuild {
  id: string;
  name: string;
  codeName: string;
  chineseName: string;
  rarity: 6 | 5 | 4;
  element: 'Nature' | 'Cryo' | 'Heat' | 'Electric' | 'Physical';
  elementVi: string;
  elementColor: string;
  role: 'Caster' | 'Striker' | 'Vanguard' | 'Guard' | 'Defender' | 'Supporter';
  roleVi: string;
  tier: 'S+' | 'S' | 'A+' | 'A' | 'B';
  isNew16?: boolean;
  avatar: string;
  summary: string;
  ratings: {
    singleTarget: number;
    aoe: number;
    support: number;
    synergy: number;
    contingencyContract: number;
  };
  branches?: {
    name: string;
    description: string;
    statFocus: string;
    gearRecommendation: string;
  }[];
  weapons: {
    signature: {
      name: string;
      rarity: 6 | 5 | 4;
      effect: string;
      tierNote: string;
    };
    alternatives: {
      name: string;
      rarity: 5 | 4;
      effect: string;
      performance: string;
      source: string;
    }[];
  };
  gear: {
    bestSet: {
      name: string;
      pieces: string;
      bonus: string;
      aicBlueprint: string;
    };
    alternativeSet?: {
      name: string;
      pieces: string;
      bonus: string;
    };
  };
  stats: {
    mainStats: string[];
    subStats: string[];
    benchmarks: {
      label: string;
      target: string;
    }[];
  };
  skills: {
    priority: string[];
    masteryNotes: string;
  };
  comboMechanics: {
    triggerCondition: string;
    appliedEffect: string;
    rotationTip: string;
  };
  bestTeams: {
    name: string;
    operators: {
      name: string;
      roleInTeam: string;
      element: string;
    }[];
    description: string;
  }[];
  externalLinks: {
    prydwenUrl?: string;
    mobalyticsUrl?: string;
    icyVeinsUrl?: string;
    endfieldGgUrl?: string;
    bwikiUrl?: string;
  };
}

export const ENDFIELD_OPERATOR_BUILDS: OperatorBuild[] = [
  {
    id: 'si',
    name: 'Si',
    codeName: 'SI // SANCTUARY OF INK',
    chineseName: '诀 (Jué)',
    rarity: 6,
    element: 'Nature',
    elementVi: 'Tự Nhiên (Nature)',
    elementColor: '#22c55e',
    role: 'Caster',
    roleVi: 'Thuật Sư (Arts Caster)',
    tier: 'S+',
    isNew16: true,
    avatar: '/avatars/endfield/si.webp',
    summary: 'Chủ lực sát thương phép Tự Nhiên cực mạnh bản 1.6. Áp dụng hiệu ứng Ăn Mòn (Corrosion) diện rộng, tích lũy Mực Khí hủy diệt boss đơn mục tiêu và quét sạch quái đông.',
    ratings: {
      singleTarget: 9.8,
      aoe: 9.7,
      support: 7.5,
      synergy: 9.6,
      contingencyContract: 9.9,
    },
    weapons: {
      signature: {
        name: 'Ink-Stained Verdance (Trấn 6★)',
        rarity: 6,
        effect: 'Tăng 36% Sát thương Arts Nature. Khi thi triển Kỹ năng Kích hoạt, hồi 12 SP và khuếch đại 24% sát thương của tầng Ăn Mòn (Corrosion) kế tiếp.',
        tierNote: 'Tuyệt đối ưu tiên. Tối ưu 100% vòng lặp SP và bùng nổ sát thương diện rộng.',
      },
      alternatives: [
        {
          name: 'Verdant Siphon (5★ Gacha)',
          rarity: 5,
          effect: 'Tăng 22% Sát thương Nguyên tố, mỗi tầng Ăn Mòn tăng thêm 3% Xuyên Kháng.',
          performance: 'Khoảng 88% hiệu suất so với Trấn',
          source: 'Gacha Vũ Khí Thường',
        },
        {
          name: 'AIC Tactical Resonator-IV (4★ Chế Tạo)',
          rarity: 4,
          effect: 'Tăng Chỉ số Intellect và 15% Tốc độ tích Nộ khi đánh trúng mục tiêu dính debuff.',
          performance: 'Khoảng 76% hiệu suất (R5)',
          source: 'Xưởng Chế Tạo AIC Cấp 4',
        },
      ],
    },
    gear: {
      bestSet: {
        name: 'Sanctuary Inkweaver (Bộ 4 Mảnh)',
        pieces: '4 Mảnh',
        bonus: '2P: +18% Sát thương Tự Nhiên (Nature). 4P: Khi mục tiêu kích hoạt hiệu ứng Ăn Mòn, nhận 28% Tỷ lệ Bạo kích Arts trong 10 giây.',
        aicBlueprint: 'Dây chuyền Chế tác Tự động AIC Khu 3 (Sợi Tổng Hợp Mực + Tinh Thể Kháng)',
      },
      alternativeSet: {
        name: 'Overloaded Resonance (2P) + Deepflow (2P)',
        pieces: '2 Mảnh + 2 Mảnh',
        bonus: '+12% Intellect và +15% Hiệu suất Hồi Năng lượng SP.',
      },
    },
    stats: {
      mainStats: ['Intellect (Trí Tuệ)', 'Tỷ Lệ Bạo Kích (Crit Rate)', 'Sát Thương Bạo Kích (Crit DMG)', 'Hiệu Quả SP Return'],
      subStats: ['Crit DMG > Crit Rate > % Intellect > Tốc Độ Hồi Nộ > Xuyên Kháng'],
      benchmarks: [
        { label: 'Crit Rate', target: '65%+' },
        { label: 'Crit DMG', target: '190%+' },
        { label: 'SP Gain Efficiency', target: '125%+' },
        { label: 'Intellect', target: '2,200+' },
      ],
    },
    skills: {
      priority: ['Kỹ năng Nộ (Ultimate) > Kỹ năng Kích hoạt (Active) > Combo Skill > Đánh thường'],
      masteryNotes: 'M1 tăng trực tiếp 20% khả năng hồi SP sau nộ. M3 mở khóa thêm tầng bão Ăn Mòn mở rộng bán kính 40%.',
    },
    comboMechanics: {
      triggerCondition: 'Yêu cầu mục tiêu đang chịu hiệu ứng [Dễ Tổn Thương / Vulnerable] hoặc [Bị Đẩy Lên / Lift].',
      appliedEffect: 'Thi triển Mực Thủy kích hoạt [Ăn Mòn Cấp 2 / Nature Corrosion], trừ 35% Kháng nguyên tố của toàn bộ kẻ địch trong phạm vi.',
      rotationTip: 'Đồng đội mở màn bằng Lift/Vulnerable -> Si thi triển Combo Skill khóa quái -> Si Active Skill đặt vũng Mực -> Ultimate dứt điểm chuỗi combo.',
    },
    bestTeams: [
      {
        name: 'Đội Hình Hủy Diệt Ăn Mòn (Nature Burst)',
        description: 'Đội hình tối ưu nhất bản 1.6 xoay quanh Si làm hạt nhân DPS dồi dào tài nguyên.',
        operators: [
          { name: 'Si', roleInTeam: 'Main DPS (Phép Tự Nhiên)', element: 'Nature' },
          { name: 'Avywenna', roleInTeam: 'Sub-DPS / Tạo Vulnerable', element: 'Electric' },
          { name: 'Purrchena', roleInTeam: 'Vanguard / Pin SP Năng Lượng', element: 'Physical' },
          { name: 'Typhoeus', roleInTeam: 'Hộ Vệ / Gom Quái & Khiên', element: 'Heat' },
        ],
      },
    ],
    externalLinks: {
      prydwenUrl: 'https://www.prydwen.gg/arknights-endfield/characters/si',
      mobalyticsUrl: 'https://mobalytics.gg/arknights-endfield/builds',
      icyVeinsUrl: 'https://www.icy-veins.com/arknights-endfield/',
      endfieldGgUrl: 'https://arknightsendfield.gg/characters',
      bwikiUrl: 'https://wiki.biligame.com/zmd',
    },
  },
  {
    id: 'argent_flow',
    name: 'Argent Flow',
    codeName: 'ARGENT FLOW // GLACIAL CURRENT',
    chineseName: '别礼 (Bieli)',
    rarity: 6,
    element: 'Cryo',
    elementVi: 'Băng (Cryo)',
    elementColor: '#38bdf8',
    role: 'Guard',
    roleVi: 'Cận Chiến Phá Trụ (Cryo Guard Breaker)',
    tier: 'S+',
    isNew16: true,
    avatar: '/avatars/endfield/argent_flow.webp',
    summary: 'Chuyên viên hệ Băng mới trong bản 1.6 với khả năng Phá Thế (Break) cực nhanh. Đóng băng và Hóa Rắn (Solidification) mọi kẻ địch, khống chế cứng trong các tầng thử thách khó.',
    ratings: {
      singleTarget: 9.4,
      aoe: 9.6,
      support: 8.8,
      synergy: 9.8,
      contingencyContract: 9.8,
    },
    weapons: {
      signature: {
        name: 'Frostbite Cataract (Trấn 6★)',
        rarity: 6,
        effect: 'Tăng 40% Tốc độ phá vỡ thanh Thế (Stagger Bar). Khi mục tiêu bị Đóng Băng hoặc Hóa Rắn, toàn đội nhận 20% sát thương bạo kích.',
        tierNote: 'Trấn biến Argent Flow thành cỗ máy phá thế và buff toàn diện cho đội.',
      },
      alternatives: [
        {
          name: 'Permafrost Carver (5★ Gacha)',
          rarity: 5,
          effect: 'Tăng 25% Sát thương Băng và kéo dài thời gian Hóa Rắn thêm 2.5 giây.',
          performance: 'Khoảng 89% hiệu suất',
          source: 'Gacha Thường',
        },
        {
          name: 'AIC Cryo Alloy Blade (4★ Chế Tạo)',
          rarity: 4,
          effect: 'Tăng tốc độ nạp SP khi tấn công mục tiêu dính trạng thái làm chậm.',
          performance: 'Khoảng 79% hiệu suất (R5)',
          source: 'Sơ đồ Nhà Máy AIC Khu 2',
        },
      ],
    },
    gear: {
      bestSet: {
        name: 'Glacial Absolute (Bộ 4 Mảnh)',
        pieces: '4 Mảnh',
        bonus: '2P: +20% Hiệu ứng Hóa Rắn (Solidification). 4P: Khi phá vỡ thanh Thế của kẻ địch, bộc phát sóng xung kích gây 420% sát thương Băng diện rộng.',
        aicBlueprint: 'Blueprint Dây Chuyền Hợp Kim Lạnh AIC Khu 4',
      },
    },
    stats: {
      mainStats: ['Agility (Nhanh Nhẹn)', 'Tỷ Lệ Bạo Kích', 'Tốc Độ Phá Thế (Stagger Efficiency)', 'SP Return'],
      subStats: ['Stagger Rate > Crit Rate > Crit DMG > % Agility > Giảm Hồi Chiêu'],
      benchmarks: [
        { label: 'Stagger Efficiency', target: '+50%+' },
        { label: 'Crit Rate', target: '60%+' },
        { label: 'Agility', target: '2,000+' },
      ],
    },
    skills: {
      priority: ['Kỹ năng Kích hoạt (Active) > Kỹ năng Nộ (Ultimate) > Combo Skill > Đánh thường'],
      masteryNotes: 'M1 giảm 4 giây hồi chiêu Kỹ năng Kích hoạt. M3 tăng thời gian Hóa Rắn thêm 3 giây.',
    },
    comboMechanics: {
      triggerCondition: 'Yêu cầu mục tiêu đang dính hiệu ứng [Nhiễm Lạnh / Chill] hoặc [Choáng / Stun].',
      appliedEffect: 'Băng phong toàn phần chuyển hóa sang [Hóa Rắn Tuyệt Đối / Solidification], phong tỏa hành động hoàn toàn.',
      rotationTip: 'Đồng đội áp dụng khống chế nhẹ -> Argent Flow lướt Combo Skill đóng băng cứng -> Đổi sang DPS dồn sát thương cực đại.',
    },
    bestTeams: [
      {
        name: 'Đội Khống Chế Tuyệt Đối (Permafreeze)',
        description: 'Vô hiệu hóa hoàn toàn cơ chế phản công của boss thông qua chuỗi Hóa Rắn liên tục.',
        operators: [
          { name: 'Argent Flow', roleInTeam: 'Breaker & Control', element: 'Cryo' },
          { name: 'Camille', roleInTeam: 'Stagger & Lift Sub-DPS', element: 'Physical' },
          { name: 'Si', roleInTeam: 'Arts Finisher', element: 'Nature' },
          { name: 'Akekuri', roleInTeam: 'Battery & Hồi SP', element: 'Heat' },
        ],
      },
    ],
    externalLinks: {
      prydwenUrl: 'https://www.prydwen.gg/arknights-endfield/characters',
      mobalyticsUrl: 'https://mobalytics.gg/arknights-endfield/builds',
      icyVeinsUrl: 'https://www.icy-veins.com/arknights-endfield/',
      endfieldGgUrl: 'https://arknightsendfield.gg/',
    },
  },
  {
    id: 'arcane',
    name: 'Arcane',
    codeName: 'ARCANE // METEORIC RESOLVE',
    chineseName: '弧光 (Arc Light)',
    rarity: 6,
    element: 'Electric',
    elementVi: 'Điện (Electric)',
    elementColor: '#eab308',
    role: 'Striker',
    roleVi: 'Chủ Lực Đa Dụng (Hybrid Striker / Supporter)',
    tier: 'S+',
    avatar: '/avatars/endfield/arcane.webp',
    summary: 'Operator độc đáo bậc nhất với 2 phân nhánh lối chơi hoàn toàn khác biệt tùy theo cách chọn chỉ số: Nhánh Intellect (Sát thương bộc phá) hoặc Nhánh Will (Hỗ trợ khống chế gom quái).',
    ratings: {
      singleTarget: 9.5,
      aoe: 9.3,
      support: 9.4,
      synergy: 9.9,
      contingencyContract: 9.8,
    },
    branches: [
      {
        name: 'Nhánh 1: Thuần Sát Thương (Intellect Burst DPS)',
        description: 'Tối đa hóa chỉ số Trí Tuệ (Intellect) để tăng bội số sát thương kỹ năng nộ và chuỗi sét lan.',
        statFocus: 'Intellect > Crit Rate > Crit DMG',
        gearRecommendation: 'Bộ 4 Mảnh Overloaded Voltage (Tăng 45% Crit DMG khi kích hoạt Quá Tải)',
      },
      {
        name: 'Nhánh 2: Hỗ Trợ & Gom Quái (Will Utility / Crowd Control)',
        description: 'Đầu tư mạnh vào Ý Chí (Will) để mở rộng bán kính hút quái, giảm hồi chiêu và tạo khiên cho đồng đội.',
        statFocus: 'Will > SP Return > Máu Tối Đa',
        gearRecommendation: 'Bộ 4 Mảnh Resonant Harmony (Tăng 25% Hiệu suất Năng lượng toàn đội)',
      },
    ],
    weapons: {
      signature: {
        name: 'Conductive Astralite (Trấn 6★)',
        rarity: 6,
        effect: 'Tự động thích ứng: Nếu Intellect cao hơn Will, tăng 35% Sát thương Điện. Nếu Will cao hơn, hồi 15 SP cho toàn đội mỗi chu kỳ xoay tua.',
        tierNote: 'Vũ khí hoàn hảo tương thích cả 2 nhánh build của Arcane.',
      },
      alternatives: [
        {
          name: 'Thunderbolt Halberd (5★ Gacha)',
          rarity: 5,
          effect: 'Tăng 20% Tỷ lệ Bạo kích và tăng tốc độ đánh thường.',
          performance: 'Khoảng 87% so với Trấn (nhánh DPS)',
          source: 'Gacha Vũ Khí',
        },
        {
          name: 'AIC Kinetic Core-II (4★ Chế Tạo)',
          rarity: 4,
          effect: 'Tăng chỉ số Will và tốc độ hồi kỹ năng kích hoạt.',
          performance: 'Khoảng 82% so với Trấn (nhánh Support)',
          source: 'Xưởng Đúc AIC',
        },
      ],
    },
    gear: {
      bestSet: {
        name: 'Overloaded Voltage (Nhánh DPS) hoặc Resonant Harmony (Nhánh SP)',
        pieces: '4 Mảnh',
        bonus: 'DPS: +25% Sát thương Điện, bùng nổ khiêu khích giật sét. Support: Tăng 20% SP Gain cho 3 đồng đội còn lại.',
        aicBlueprint: 'Dây Chuyền Tinh Thể Năng Lượng AIC Trung Ương',
      },
    },
    stats: {
      mainStats: ['Intellect (DPS) HOẶC Will (Support)', 'Crit Rate', 'Crit DMG', 'SP Return'],
      subStats: ['Tùy nhánh: Intellect/Crit (DPS) vs Will/SP Efficiency (Support)'],
      benchmarks: [
        { label: 'Intellect (Nhánh 1)', target: '2,400+' },
        { label: 'Will (Nhánh 2)', target: '2,100+' },
        { label: 'SP Efficiency', target: '135%+' },
      ],
    },
    skills: {
      priority: ['Kỹ năng Nộ (Ultimate) > Combo Skill > Kỹ năng Kích hoạt (Active) > Đánh thường'],
      masteryNotes: 'M1 cực kỳ quan trọng vì giảm 30% ngưỡng yêu cầu kích hoạt Combo Skill.',
    },
    comboMechanics: {
      triggerCondition: 'Kích hoạt khi mục tiêu bị dính [Quá Tải / Overload] hoặc [Nhiễm Điện / Shocked].',
      appliedEffect: 'Tạo lốc điện từ hút quái vào tâm điểm và gắn trạng thái [Vulnerable] suy yếu 25%.',
      rotationTip: 'Dùng Arcane gom quái và hạ kháng -> Chuyển sang DPS dồn sát thương diện rộng.',
    },
    bestTeams: [
      {
        name: 'Lôi Điện Siêu Dẫn (Electric Res-Shred)',
        description: 'Tận dụng Arcane vừa hút quái vừa trừ kháng để các Operator hệ Điện và Băng bộc phá.',
        operators: [
          { name: 'Arcane', roleInTeam: 'Sub-DPS / Gom Quái / Buff', element: 'Electric' },
          { name: 'Avywenna', roleInTeam: 'Main DPS Xuyên Kháng', element: 'Electric' },
          { name: 'Argent Flow', roleInTeam: 'Khống Chế & Phá Thế', element: 'Cryo' },
          { name: 'Purrchena', roleInTeam: 'SP Battery', element: 'Physical' },
        ],
      },
    ],
    externalLinks: {
      prydwenUrl: 'https://www.prydwen.gg/arknights-endfield/characters/arcane',
      mobalyticsUrl: 'https://mobalytics.gg/arknights-endfield/builds',
      icyVeinsUrl: 'https://www.icy-veins.com/arknights-endfield/',
      endfieldGgUrl: 'https://arknightsendfield.gg/characters',
    },
  },
  {
    id: 'purrchena',
    name: 'Purrchena',
    codeName: 'PURRCHENA // ACROBATIC BATTERY',
    chineseName: '大潘 (Da Pan)',
    rarity: 5,
    element: 'Physical',
    elementVi: 'Vật Lý (Physical)',
    elementColor: '#94a3b8',
    role: 'Vanguard',
    roleVi: 'Tiên Phong Bơm SP (SP Battery Vanguard)',
    tier: 'S+',
    avatar: '/avatars/endfield/purrchena.webp',
    summary: 'Cốt lõi vận hành xoay tua kỹ năng của mọi đội hình meta 1.6. Tạo lượng SP dồi dào, đánh lùi quái nhỏ và mở chuỗi combo cực nhanh.',
    ratings: {
      singleTarget: 8.6,
      aoe: 8.8,
      support: 9.9,
      synergy: 10.0,
      contingencyContract: 9.7,
    },
    weapons: {
      signature: {
        name: 'Sprint Stride (Vũ khí chuyên dụng 5★)',
        rarity: 5,
        effect: 'Mỗi đòn đánh thứ 3 hồi 4 SP cho bản thân và 2 SP cho nhân vật tiếp theo trong thứ tự xoay tua.',
        tierNote: 'Không thể thiếu nếu muốn vận hành mượt mà chu kỳ xoay tua 15 giây.',
      },
      alternatives: [
        {
          name: 'AIC Lightweight Baton (4★ Chế Tạo)',
          rarity: 4,
          effect: 'Tăng 18% Tốc độ đánh và giảm tiêu hao thể lực lướt né.',
          performance: 'Khoảng 85% hiệu suất',
          source: 'Xưởng Chế Tạo AIC Cấp 2',
        },
      ],
    },
    gear: {
      bestSet: {
        name: 'Kinetic Recharger (Bộ 4 Mảnh)',
        pieces: '4 Mảnh',
        bonus: '2P: +20% Tốc độ di chuyển và hồi thể lực. 4P: Thi triển Combo Skill lập tức hoàn trả 25% Năng lượng Nộ cho cả đội.',
        aicBlueprint: 'Dây Chuyền Pin Tích Điện AIC Khu 2',
      },
    },
    stats: {
      mainStats: ['Agility (Nhanh Nhẹn)', 'Hiệu Quả Hồi SP (SP Return Rate)', 'Tốc Độ Đánh', 'Máu Tối Đa'],
      subStats: ['SP Return Efficiency > Agility > Tốc Độ Đánh > Kháng Sát Thương'],
      benchmarks: [
        { label: 'SP Gain Efficiency', target: '140%+' },
        { label: 'Agility', target: '1,800+' },
      ],
    },
    skills: {
      priority: ['Kỹ năng Kích hoạt (Active) > Combo Skill > Kỹ năng Nộ (Ultimate) > Đánh thường'],
      masteryNotes: 'Nâng M1 ngay lập tức để mở khóa khả năng hồi SP đa mục tiêu.',
    },
    comboMechanics: {
      triggerCondition: 'Bất kỳ khi nào kẻ địch bị đẩy lùi hoặc dính sát thương bạo kích từ đòn đánh thường.',
      appliedEffect: 'Lao vào đá xoay gây Choáng nhẹ và kích hoạt nạp nhanh 15 SP cho toàn đội.',
      rotationTip: 'Mở màn trận đấu luôn dùng Purrchena lướt Active tạo SP -> kích hoạt Combo -> chuyển giao sang Main DPS nộ.',
    },
    bestTeams: [
      {
        name: 'Đội Hình Đa Dụng Tương Thích Mọi Trận Đấu',
        description: 'Purrchena có thể ghép vào bất kỳ đội hình nào nhờ khả năng hồi SP vượt trội.',
        operators: [
          { name: 'Purrchena', roleInTeam: 'Battery & Mở Combo', element: 'Physical' },
          { name: 'Si', roleInTeam: 'Main DPS Tự Nhiên', element: 'Nature' },
          { name: 'Argent Flow', roleInTeam: 'Khống Chế Băng', element: 'Cryo' },
          { name: 'Typhoeus', roleInTeam: 'Khiên & Hút Quái', element: 'Heat' },
        ],
      },
    ],
    externalLinks: {
      prydwenUrl: 'https://www.prydwen.gg/arknights-endfield/characters',
      mobalyticsUrl: 'https://mobalytics.gg/arknights-endfield/builds',
      icyVeinsUrl: 'https://www.icy-veins.com/arknights-endfield/',
      endfieldGgUrl: 'https://arknightsendfield.gg/',
    },
  },
  {
    id: 'typhoeus',
    name: 'Typhoeus',
    codeName: 'TYPHOEUS // HEAVY LIFTER',
    chineseName: '莱万汀 (Laevatain)',
    rarity: 6,
    element: 'Heat',
    elementVi: 'Nhiệt / Hỏa (Heat)',
    elementColor: '#ef4444',
    role: 'Guard',
    roleVi: 'Hộ Vệ Trọng Khiên (Heavy Guard / Tank)',
    tier: 'S',
    avatar: '/avatars/endfield/typhoeus.webp',
    summary: 'Lớp lá chắn thép của Endfield. Vừa tạo giáp bảo hộ cho cả đội, vừa sở hữu cơ chế Hất Tung (Lift) siêu mạnh – là điều kiện tiên quyết kích hoạt chuỗi combo của nhiều DPS hàng đầu.',
    ratings: {
      singleTarget: 8.9,
      aoe: 9.4,
      support: 9.6,
      synergy: 9.8,
      contingencyContract: 10.0,
    },
    weapons: {
      signature: {
        name: 'Molten Bulwark (Trấn 6★)',
        rarity: 6,
        effect: 'Tăng 45% Sức Mạnh (Strength) và giá trị khiên tạo ra tăng 35%. Khi kích hoạt Hất Tung (Lift), kẻ địch bị giảm 25% Giáp Vật lý.',
        tierNote: 'Biến Typhoeus thành bức tường kiên cố kiêm công cụ trừ giáp cực mạnh.',
      },
      alternatives: [
        {
          name: 'Vulcan Bastion (5★ Gacha)',
          rarity: 5,
          effect: 'Tăng 25% Phòng ngự và phản đòn hỏa thiêu khi trúng sát thương.',
          performance: 'Khoảng 86% hiệu suất',
          source: 'Gacha Vũ Khí',
        },
        {
          name: 'AIC Heavy Shield Frame (4★ Chế Tạo)',
          rarity: 4,
          effect: 'Tăng Máu Tối Đa và hiệu suất giảm chấn khi chặn đòn.',
          performance: 'Khoảng 78% hiệu suất (R5)',
          source: 'Xưởng Chế Tạo AIC Cấp 3',
        },
      ],
    },
    gear: {
      bestSet: {
        name: 'Ironclad Titan (Bộ 4 Mảnh)',
        pieces: '4 Mảnh',
        bonus: '2P: +25% Giá trị Khiên. 4P: Khi giữ khiên, toàn bộ đồng đội nhận 18% Sát thương Nguyên tố cộng thêm.',
        aicBlueprint: 'Dây Chuyền Đúc Giáp Nặng AIC Khu 4',
      },
    },
    stats: {
      mainStats: ['Strength (Sức Mạnh)', 'Máu Tối Đa (Max HP)', 'Phòng Ngự', 'Kháng Chấn'],
      subStats: ['Strength > % Max HP > % Def > SP Return'],
      benchmarks: [
        { label: 'Strength', target: '2,300+' },
        { label: 'Max HP', target: '28,000+' },
        { label: 'Shield Efficiency', target: '+35%+' },
      ],
    },
    skills: {
      priority: ['Kỹ năng Kích hoạt (Tạo Khiên) > Kỹ năng Nộ (Ultimate Lift) > Combo Skill > Đánh thường'],
      masteryNotes: 'M2 kéo dài thời gian lơ lửng của mục tiêu bị Hất Tung thêm 1.5 giây.',
    },
    comboMechanics: {
      triggerCondition: 'Mục tiêu bị đập trúng khiên chắn hoặc bị phá vỡ thế phòng thủ.',
      appliedEffect: 'Kích hoạt [Hất Tung / Lift] và áp trạng thái [Bốc Cháy / Heat Burn] thiêu đốt liên tục.',
      rotationTip: 'Chặn đòn boss -> Kích hoạt Lift diện rộng -> Ngay lập tức mở đường cho Si hoặc Arcane nối tiếp Combo.',
    },
    bestTeams: [
      {
        name: 'Đội Hình Hỏa Nhiệt Khống Chế (Heat & Lift Lockdown)',
        description: 'Tận dụng hất tung liên tục để các nhân vật dồn sát thương an toàn tuyệt đối.',
        operators: [
          { name: 'Typhoeus', roleInTeam: 'Main Tank & Lift Enabler', element: 'Heat' },
          { name: 'Akekuri', roleInTeam: 'Sub-DPS Nhiệt & Pin Năng Lượng', element: 'Heat' },
          { name: 'Si', roleInTeam: 'Main DPS', element: 'Nature' },
          { name: 'Purrchena', roleInTeam: 'Vanguard', element: 'Physical' },
        ],
      },
    ],
    externalLinks: {
      prydwenUrl: 'https://www.prydwen.gg/arknights-endfield/characters',
      mobalyticsUrl: 'https://mobalytics.gg/arknights-endfield/builds',
      icyVeinsUrl: 'https://www.icy-veins.com/arknights-endfield/',
      endfieldGgUrl: 'https://arknightsendfield.gg/',
    },
  },
  {
    id: 'avywenna',
    name: 'Avywenna',
    codeName: 'AVYWENNA // THUNDERSTRIKE LANCE',
    chineseName: '艾维文娜',
    rarity: 6,
    element: 'Electric',
    elementVi: 'Điện (Electric)',
    elementColor: '#eab308',
    role: 'Striker',
    roleVi: 'Chủ Lực Đột Kích (Fast Striker & Res-Shred)',
    tier: 'S+',
    avatar: '/avatars/endfield/avywenna.webp',
    summary: 'Bậc thầy chọc giáp và giảm kháng nguyên tố trong Endfield. Cung cấp trạng thái Vulnerable (Dễ Tổn Thương) liên tục, tương tác cực mạnh với Si và Arcane.',
    ratings: {
      singleTarget: 9.7,
      aoe: 9.1,
      support: 8.5,
      synergy: 9.8,
      contingencyContract: 9.6,
    },
    weapons: {
      signature: {
        name: 'Lightning Pierce (Trấn 6★)',
        rarity: 6,
        effect: 'Tăng 38% Sát thương Bạo kích. Mỗi đòn xuyên phá tích tầng Giảm 8% Kháng Điện & Kháng Tự Nhiên (tối đa 4 tầng).',
        tierNote: 'Tối ưu hóa khả năng dồn sát thương và buff gián tiếp cho toàn đội.',
      },
      alternatives: [
        {
          name: 'High-Voltage Pike (5★ Gacha)',
          rarity: 5,
          effect: 'Tăng 22% Sát thương Điện và tăng tốc độ đâm kích.',
          performance: 'Khoảng 88% so với Trấn',
          source: 'Gacha Thường',
        },
      ],
    },
    gear: {
      bestSet: {
        name: 'Stormchaser Piercer (Bộ 4 Mảnh)',
        pieces: '4 Mảnh',
        bonus: '2P: +18% Sát thương Đâm kích. 4P: Khi mục tiêu dính trạng thái Dễ Tổn Thương, toàn bộ đòn đánh của Avywenna gây thêm 35% Sát thương Bạo kích.',
        aicBlueprint: 'Dây Chuyền Gia Công Mũi Thương AIC Khu 3',
      },
    },
    stats: {
      mainStats: ['Agility (Nhanh Nhẹn)', 'Tỷ Lệ Bạo Kích', 'Sát Thương Bạo Kích', 'Xuyên Kháng'],
      subStats: ['Crit Rate > Crit DMG > Agility > SP Return'],
      benchmarks: [
        { label: 'Crit Rate', target: '70%+' },
        { label: 'Crit DMG', target: '200%+' },
        { label: 'Agility', target: '2,200+' },
      ],
    },
    skills: {
      priority: ['Kỹ năng Kích hoạt (Lao Đâm) > Kỹ năng Nộ > Combo Skill > Đánh thường'],
      masteryNotes: 'M3 tăng thêm 15% hiệu quả trừ kháng từ đòn lướt.',
    },
    comboMechanics: {
      triggerCondition: 'Mục tiêu bị Đóng Băng hoặc bị Hất Tung.',
      appliedEffect: 'Ghim giáo gắn ấn [Dễ Tổn Thương / Vulnerable] và kích nổ luồng sét lan.',
      rotationTip: 'Hất tung quái -> Avywenna lướt Combo ghim Vulnerable -> Chuyển giao Si hoặc Arcane xả Ultimate.',
    },
    bestTeams: [
      {
        name: 'Siêu Dẫn & Ăn Mòn Hỗn Hợp (Duo Core Meta)',
        description: 'Cặp bài trùng Avywenna + Si gây lượng sát thương khủng khiếp nhất bản 1.6.',
        operators: [
          { name: 'Avywenna', roleInTeam: 'Res-Shred & Vulnerable Lead', element: 'Electric' },
          { name: 'Si', roleInTeam: 'Main Burst Caster', element: 'Nature' },
          { name: 'Purrchena', roleInTeam: 'Pin Năng Lượng SP', element: 'Physical' },
          { name: 'Typhoeus', roleInTeam: 'Hộ Vệ & Hút Quái', element: 'Heat' },
        ],
      },
    ],
    externalLinks: {
      prydwenUrl: 'https://www.prydwen.gg/arknights-endfield/characters',
      mobalyticsUrl: 'https://mobalytics.gg/arknights-endfield/builds',
      icyVeinsUrl: 'https://www.icy-veins.com/arknights-endfield/',
      endfieldGgUrl: 'https://arknightsendfield.gg/',
    },
  },
  {
    id: 'akekuri',
    name: 'Akekuri',
    codeName: 'AKEKURI // BLAZING RUNNER',
    chineseName: '秋栗 (Akekuri)',
    rarity: 5,
    element: 'Heat',
    elementVi: 'Nhiệt / Hỏa (Heat)',
    elementColor: '#ef4444',
    role: 'Vanguard',
    roleVi: 'Tiên Phong Nhanh (Fast Combo & Battery)',
    tier: 'S',
    avatar: '/avatars/endfield/akekuri.webp',
    summary: 'Nhân vật cũ được Icy Veins đánh giá lại rất cao trong bản 1.6 nhờ chuỗi hồi SP siêu tốc và tương tác nhiệt xuất sắc với Typhoeus.',
    ratings: {
      singleTarget: 8.7,
      aoe: 8.9,
      support: 9.5,
      synergy: 9.7,
      contingencyContract: 9.4,
    },
    weapons: {
      signature: {
        name: 'Ignition Twin-Daggers (5★ Gacha)',
        rarity: 5,
        effect: 'Tăng 25% Tốc độ đánh, đòn bạo kích hồi 3 SP cho bản thân.',
        tierNote: 'Vũ khí tối ưu hóa chu kỳ nạp nộ cho Akekuri.',
      },
      alternatives: [
        {
          name: 'AIC Thermal Blade (4★ Chế Tạo)',
          rarity: 4,
          effect: 'Tăng sát thương Nhiệt và hồi thể lực.',
          performance: 'Khoảng 83% hiệu suất',
          source: 'Xưởng Chế Tạo AIC',
        },
      ],
    },
    gear: {
      bestSet: {
        name: 'Blazing Vanguard (Bộ 4 Mảnh)',
        pieces: '4 Mảnh',
        bonus: '2P: +15% Tốc độ tấn công. 4P: Thi triển Combo Skill kích hoạt vòng lửa hồi 20 SP cho nhân vật tiếp theo.',
        aicBlueprint: 'Dây Chuyền Đốt Năng Lượng AIC Khu 2',
      },
    },
    stats: {
      mainStats: ['Agility (Nhanh Nhẹn)', 'Tỷ Lệ Bạo Kích', 'SP Return Efficiency', 'Sát Thương Nhiệt'],
      subStats: ['SP Return > Crit Rate > Agility > Crit DMG'],
      benchmarks: [
        { label: 'SP Gain Efficiency', target: '135%+' },
        { label: 'Crit Rate', target: '65%+' },
      ],
    },
    skills: {
      priority: ['Combo Skill > Kỹ năng Kích hoạt > Kỹ năng Nộ > Đánh thường'],
      masteryNotes: 'M1 rút ngắn hồi chiêu Combo Skill xuống chỉ còn 8 giây.',
    },
    comboMechanics: {
      triggerCondition: 'Mục tiêu bị dính [Bốc Cháy / Heat Burn] hoặc [Hất Tung / Lift].',
      appliedEffect: 'Bộc phá vụ nổ lửa hồi SP cấp tốc cho toàn đội và tiếp lửa cho chuỗi liên hoàn.',
      rotationTip: 'Hợp tác nhịp nhàng cùng Typhoeus để tạo chuỗi Lift -> Akekuri chém lửa -> Hoàn trả SP dồi dào.',
    },
    bestTeams: [
      {
        name: 'Song Hỏa Bứt Tốc (Dual Heat Battery)',
        description: 'Tận dụng cặp bài trùng Akekuri + Typhoeus để xoay tua nộ liên tục không ngừng.',
        operators: [
          { name: 'Akekuri', roleInTeam: 'Battery & Combo Opener', element: 'Heat' },
          { name: 'Typhoeus', roleInTeam: 'Tank & Hất Tung', element: 'Heat' },
          { name: 'Si', roleInTeam: 'Main DPS', element: 'Nature' },
          { name: 'Argent Flow', roleInTeam: 'Khống Chế', element: 'Cryo' },
        ],
      },
    ],
    externalLinks: {
      prydwenUrl: 'https://www.prydwen.gg/arknights-endfield/characters',
      mobalyticsUrl: 'https://mobalytics.gg/arknights-endfield/builds',
      icyVeinsUrl: 'https://www.icy-veins.com/arknights-endfield/',
      endfieldGgUrl: 'https://arknightsendfield.gg/',
    },
  },
  {
    id: 'camille',
    name: 'Camille',
    codeName: 'CAMILLE // RESONANT STRIKER',
    chineseName: '卡缪 (Camille)',
    rarity: 5,
    element: 'Physical',
    elementVi: 'Vật Lý (Physical)',
    elementColor: '#94a3b8',
    role: 'Striker',
    roleVi: 'Chủ Lực Đập Tan (Stagger & Lift Breaker)',
    tier: 'A+',
    avatar: '/avatars/endfield/camille.webp',
    summary: 'Chuyên gia phá thanh Thế và kích hoạt trạng thái Nghiền Nát (Physical Crush). Là mắt xích hoàn hảo trong các đội hình khống chế vật lý phối hợp cùng Argent Flow.',
    ratings: {
      singleTarget: 8.8,
      aoe: 9.0,
      support: 8.6,
      synergy: 9.4,
      contingencyContract: 9.2,
    },
    weapons: {
      signature: {
        name: 'Heavy Impact Greatsword (5★ Gacha)',
        rarity: 5,
        effect: 'Tăng 30% Sát thương Phá Thế và tăng 25% Sát thương Nghiền Nát.',
        tierNote: 'Tối ưu hóa khả năng bẻ gãy giáp boss nhanh nhất.',
      },
      alternatives: [
        {
          name: 'AIC Tempered Claymore (4★ Chế Tạo)',
          rarity: 4,
          effect: 'Tăng Sức Mạnh và tăng sát thương khi đối đầu mục tiêu bị Hóa Rắn.',
          performance: 'Khoảng 84% hiệu suất',
          source: 'Xưởng Đúc Kim Loại AIC',
        },
      ],
    },
    gear: {
      bestSet: {
        name: 'Crushing Momentum (Bộ 4 Mảnh)',
        pieces: '4 Mảnh',
        bonus: '2P: +20% Sát thương Vật lý. 4P: Khi gây trạng thái Nghiền Nát, giảm 30% Giáp Vật lý của kẻ địch trong 8 giây.',
        aicBlueprint: 'Dây Chuyền Gia Công Khối Thép Nặng AIC Khu 3',
      },
    },
    stats: {
      mainStats: ['Strength (Sức Mạnh)', 'Tỷ Lệ Bạo Kích', 'Sát Thương Bạo Kích', 'Tốc Độ Phá Thế'],
      subStats: ['Strength > Crit Rate > Crit DMG > Stagger Efficiency'],
      benchmarks: [
        { label: 'Strength', target: '2,100+' },
        { label: 'Crit Rate', target: '60%+' },
        { label: 'Stagger Efficiency', target: '+40%+' },
      ],
    },
    skills: {
      priority: ['Kỹ năng Nộ > Kỹ năng Kích hoạt > Combo Skill > Đánh thường'],
      masteryNotes: 'M1 tăng thêm 25% sát thương khi mục tiêu đang bị lơ lửng trên không.',
    },
    comboMechanics: {
      triggerCondition: 'Mục tiêu bị Hóa Rắn (Bởi Argent Flow) hoặc dính Vulnerable.',
      appliedEffect: 'Bổ nhát chém sấm sét kích hoạt [Nghiền Nát / Crush] và hất tung mục tiêu.',
      rotationTip: 'Argent Flow đóng băng Hóa Rắn -> Camille kích hoạt Combo bổ Crush gây sát thương bộc phá khổng lồ.',
    },
    bestTeams: [
      {
        name: 'Băng - Vật Lý Phá Giáp (Cryo-Physical Shatter)',
        description: 'Tận dụng trạng thái Hóa Rắn của Băng để Camille bẻ gãy thanh Thế và nghiền nát giáp mục tiêu.',
        operators: [
          { name: 'Camille', roleInTeam: 'Stagger & Crush Finisher', element: 'Physical' },
          { name: 'Argent Flow', roleInTeam: 'Cryo Breaker & Solidification', element: 'Cryo' },
          { name: 'Purrchena', roleInTeam: 'SP Battery', element: 'Physical' },
          { name: 'Arcane', roleInTeam: 'Sub-DPS & Gom Quái', element: 'Electric' },
        ],
      },
    ],
    externalLinks: {
      prydwenUrl: 'https://www.prydwen.gg/arknights-endfield/characters',
      mobalyticsUrl: 'https://mobalytics.gg/arknights-endfield/builds',
      icyVeinsUrl: 'https://www.icy-veins.com/arknights-endfield/',
      endfieldGgUrl: 'https://arknightsendfield.gg/',
    },
  },
  {
    id: 'endministrator',
    name: 'Endministrator',
    codeName: 'ENDMINISTRATOR // PROTOCOL LEADER',
    chineseName: '管理员',
    rarity: 6,
    element: 'Physical',
    elementVi: 'Vật Lý (Physical)',
    elementColor: '#94a3b8',
    role: 'Striker',
    roleVi: 'Chỉ Huy Toàn Năng (All-Rounder / Driver)',
    tier: 'S',
    avatar: '/avatars/endfield/endministrator.webp',
    summary: 'Nhân vật chính của Arknights: Endfield. Sở hữu bộ kỹ năng cân bằng toàn diện, kết nối mượt mà mọi chuỗi combo nguyên tố và tăng chỉ số tấn công cho cả đội.',
    ratings: {
      singleTarget: 9.1,
      aoe: 9.2,
      support: 9.3,
      synergy: 10.0,
      contingencyContract: 9.5,
    },
    weapons: {
      signature: {
        name: 'Originium Bastion Sword (Trấn 6★)',
        rarity: 6,
        effect: 'Tăng 30% Sát thương toàn thể. Mỗi khi đồng đội kích hoạt Combo Skill, hồi 10 SP cho Endministrator.',
        tierNote: 'Vũ khí định chuẩn giúp Endministrator nộ liên tục.',
      },
      alternatives: [
        {
          name: 'AIC Standard Tactical Blade (4★ Chế Tạo)',
          rarity: 4,
          effect: 'Tăng Sức Mạnh và tăng tốc độ di chuyển.',
          performance: 'Khoảng 80% hiệu suất',
          source: 'Nhiệm Vụ Cốt Truyện',
        },
      ],
    },
    gear: {
      bestSet: {
        name: 'Frontier Pioneer (Bộ 4 Mảnh)',
        pieces: '4 Mảnh',
        bonus: '2P: +15% Sức Mạnh và Trí Tuệ. 4P: Tăng 20% Sát thương toàn đội sau khi thi triển Nộ.',
        aicBlueprint: 'Dây Chuyền Căn Bản AIC Khu 1',
      },
    },
    stats: {
      mainStats: ['Strength / Intellect', 'Crit Rate', 'Crit DMG', 'SP Return'],
      subStats: ['Crit Rate > Crit DMG > % Atk > SP Return'],
      benchmarks: [
        { label: 'Crit Rate', target: '65%+' },
        { label: 'Crit DMG', target: '180%+' },
      ],
    },
    skills: {
      priority: ['Kỹ năng Nộ > Kỹ năng Kích hoạt > Combo Skill > Đánh thường'],
      masteryNotes: 'M3 nâng cao hào quang buff sát thương cho toàn đội lên 25%.',
    },
    comboMechanics: {
      triggerCondition: 'Có thể kích hoạt sau bất kỳ hiệu ứng khống chế nào (Choáng, Đóng Băng, Hất Tung).',
      appliedEffect: 'Bùng nổ nhát chém kiếm khí gây sát thương vật lý chuẩn và tăng tốc độ đánh cho cả đội.',
      rotationTip: 'Được sử dụng như nhân vật liên kết chuỗi khi các Operator khác đang chờ hồi chiêu.',
    },
    bestTeams: [
      {
        name: 'Đội Hình Tiên Phong Khai Phá (F2P Friendly)',
        description: 'Đội hình cơ bản cực kỳ mạnh mẽ và dễ xây dựng ngay từ đầu game.',
        operators: [
          { name: 'Endministrator', roleInTeam: 'Leader & All-Rounder', element: 'Physical' },
          { name: 'Purrchena', roleInTeam: 'Battery Hồi SP', element: 'Physical' },
          { name: 'Akekuri', roleInTeam: 'Sub-DPS Hỏa', element: 'Heat' },
          { name: 'Typhoeus', roleInTeam: 'Khiên & Hút Quái', element: 'Heat' },
        ],
      },
    ],
    externalLinks: {
      prydwenUrl: 'https://www.prydwen.gg/arknights-endfield/characters',
      mobalyticsUrl: 'https://mobalytics.gg/arknights-endfield/builds',
      icyVeinsUrl: 'https://www.icy-veins.com/arknights-endfield/',
      endfieldGgUrl: 'https://arknightsendfield.gg/',
    },
  },
  {
    id: 'perlica',
    name: 'Perlica',
    codeName: 'PERLICA // OVERLOAD SPECIALIST',
    chineseName: '佩丽卡',
    rarity: 5,
    element: 'Electric',
    elementVi: 'Điện (Electric)',
    elementColor: '#eab308',
    role: 'Caster',
    roleVi: 'Thuật Sư Tầm Xa (Long-Range Arts Caster)',
    tier: 'A+',
    avatar: '/avatars/endfield/perlica.webp',
    summary: 'Thuật sư tầm xa hệ Điện sở hữu khả năng kích nổ Quá Tải (Overload) diện rộng. Khả năng tích dồn ấn điện liên tục hỗ trợ tối đa cho Arcane và Avywenna.',
    ratings: {
      singleTarget: 8.9,
      aoe: 9.3,
      support: 8.2,
      synergy: 9.5,
      contingencyContract: 9.0,
    },
    weapons: {
      signature: {
        name: 'Electromagnetic Wand (5★ Gacha)',
        rarity: 5,
        effect: 'Tăng 28% Sát thương Arts Điện. Đòn đánh tầm xa vào mục tiêu bị giật điện kích hoạt vụ nổ phụ gây 120% sát thương.',
        tierNote: 'Vũ khí tầm xa tối ưu sát thương đơn và đa mục tiêu.',
      },
      alternatives: [
        {
          name: 'AIC Induction Rod (4★ Chế Tạo)',
          rarity: 4,
          effect: 'Tăng Trí Tuệ (Intellect) và tăng 15% hiệu quả nạp SP.',
          performance: 'Khoảng 82% hiệu suất',
          source: 'Xưởng Chế Tạo AIC Cấp 2',
        },
      ],
    },
    gear: {
      bestSet: {
        name: 'Overloaded Resonance (Bộ 4 Mảnh)',
        pieces: '4 Mảnh',
        bonus: '2P: +18% Sát thương Phép Điện. 4P: Kích nổ Quá Tải tăng 30% Sát thương Bạo kích cho toàn đội trong 12 giây.',
        aicBlueprint: 'Dây Chuyền Tinh Chế Điện Từ AIC Khu 3',
      },
    },
    stats: {
      mainStats: ['Intellect (Trí Tuệ)', 'Tỷ Lệ Bạo Kích', 'Sát Thương Bạo Kích', 'SP Return'],
      subStats: ['Intellect > Crit Rate > Crit DMG > Xuyên Kháng Điện'],
      benchmarks: [
        { label: 'Intellect', target: '2,150+' },
        { label: 'Crit Rate', target: '60%+' },
        { label: 'SP Gain', target: '125%+' },
      ],
    },
    skills: {
      priority: ['Kỹ năng Kích hoạt (Sấm Sét Tầm Xa) > Kỹ năng Nộ > Combo Skill > Đánh thường'],
      masteryNotes: 'M1 gia tăng bán kính nổ Quá Tải thêm 35%. M3 giảm kháng Điện của mục tiêu 20%.',
    },
    comboMechanics: {
      triggerCondition: 'Mục tiêu bị làm chậm hoặc dính trạng thái Dễ Tổn Thương (Vulnerable).',
      appliedEffect: 'Bắn tia sét xuyên thấu kích hoạt Quá Tải Cấp 2 và làm choáng kẻ địch trong 2 giây.',
      rotationTip: 'Avywenna ghim giáo -> Perlica bắn Combo nổ Quá Tải -> Arcane dứt điểm diện rộng.',
    },
    bestTeams: [
      {
        name: 'Bão Điện Quá Tải (Overload Cascade)',
        description: 'Tập trung vào chuỗi giật điện liên hoàn quét sạch phòng thử thách đông quái.',
        operators: [
          { name: 'Perlica', roleInTeam: 'Ranged AoE Caster', element: 'Electric' },
          { name: 'Arcane', roleInTeam: 'Main Burst DPS / Gom Quái', element: 'Electric' },
          { name: 'Purrchena', roleInTeam: 'SP Battery', element: 'Physical' },
          { name: 'Typhoeus', roleInTeam: 'Tank & Hút Quái', element: 'Heat' },
        ],
      },
    ],
    externalLinks: {
      prydwenUrl: 'https://www.prydwen.gg/arknights-endfield/characters',
      mobalyticsUrl: 'https://mobalytics.gg/arknights-endfield/builds',
      icyVeinsUrl: 'https://www.icy-veins.com/arknights-endfield/',
      endfieldGgUrl: 'https://arknightsendfield.gg/',
    },
  },
  {
    id: 'wulfgard',
    name: 'Wulfgard',
    codeName: 'WULFGARD // FERAL BERSERKER',
    chineseName: '狼卫 (Wulfgard)',
    rarity: 5,
    element: 'Heat',
    elementVi: 'Nhiệt / Hỏa (Heat)',
    elementColor: '#ef4444',
    role: 'Striker',
    roleVi: 'Cuồng Chiến Sĩ Bộc Phá (Berserker Striker)',
    tier: 'A+',
    avatar: '/avatars/endfield/wulfgard.webp',
    summary: 'Đấu sĩ càn quét hệ Nhiệt với lối đánh liều lĩnh dồn sát thương cực hạn khi máu giảm. Phá vỡ giáp boss nhanh và tạo trạng thái Hỏa Thiêu liên tục.',
    ratings: {
      singleTarget: 9.3,
      aoe: 8.7,
      support: 7.0,
      synergy: 9.1,
      contingencyContract: 9.2,
    },
    weapons: {
      signature: {
        name: 'Crimson Howl (5★ Gacha)',
        rarity: 5,
        effect: 'Tăng 32% Sát thương Nhiệt. Khi máu dưới 50%, nhân đôi tỷ lệ bạo kích và nhận trạng thái Không Thể Bị Đẩy Lùi.',
        tierNote: 'Vũ khí trấn phái cho lối chơi cuồng nộ của Wulfgard.',
      },
      alternatives: [
        {
          name: 'AIC Forge Cleaver (4★ Chế Tạo)',
          rarity: 4,
          effect: 'Tăng Sức Mạnh và tăng sát thương khi mục tiêu bị Bốc Cháy.',
          performance: 'Khoảng 81% hiệu suất',
          source: 'Xưởng Đúc Thép AIC',
        },
      ],
    },
    gear: {
      bestSet: {
        name: 'Berserker Flame (Bộ 4 Mảnh)',
        pieces: '4 Mảnh',
        bonus: '2P: +20% Sát thương Đòn đánh thường. 4P: Mất máu tăng tối đa 40% Sát thương Bạo kích và hồi lại 15% SP.',
        aicBlueprint: 'Dây Chuyền Đúc Lò Cao AIC Khu 3',
      },
    },
    stats: {
      mainStats: ['Strength (Sức Mạnh)', 'Tỷ Lệ Bạo Kích', 'Sát Thương Bạo Kích', 'Tốc Độ Đánh'],
      subStats: ['Crit DMG > Crit Rate > Strength > % Max HP'],
      benchmarks: [
        { label: 'Strength', target: '2,250+' },
        { label: 'Crit Rate', target: '65%+' },
        { label: 'Crit DMG', target: '185%+' },
      ],
    },
    skills: {
      priority: ['Kỹ năng Nộ (Hóa Cuồng) > Combo Skill > Kỹ năng Kích hoạt > Đánh thường'],
      masteryNotes: 'M1 cấp trạng thái Bất Tử trong 3 giây khi kích hoạt Kỹ năng Nộ.',
    },
    comboMechanics: {
      triggerCondition: 'Mục tiêu bị Hất Tung (Lift) hoặc bị Nghiền Nát (Crush).',
      appliedEffect: 'Bổ rìu lửa giáng xuống đất kích hoạt Nổ Nhiệt (Heat Explosion) và gây Choáng.',
      rotationTip: 'Typhoeus hất tung -> Wulfgard Combo bổ rách giáp -> Kích hoạt Nộ chém cuồng nhiệt.',
    },
    bestTeams: [
      {
        name: 'Hỏa Cuồng Càn Quét (Pure Heat Berserk)',
        description: 'Tập trung bộc phá sát thương hỏa cực mạnh trong thời gian ngắn.',
        operators: [
          { name: 'Wulfgard', roleInTeam: 'Main Burst Striker', element: 'Heat' },
          { name: 'Typhoeus', roleInTeam: 'Tank & Hất Tung', element: 'Heat' },
          { name: 'Akekuri', roleInTeam: 'SP Battery Hỏa', element: 'Heat' },
          { name: 'Purrchena', roleInTeam: 'Vanguard Toàn Năng', element: 'Physical' },
        ],
      },
    ],
    externalLinks: {
      prydwenUrl: 'https://www.prydwen.gg/arknights-endfield/characters',
      mobalyticsUrl: 'https://mobalytics.gg/arknights-endfield/builds',
      icyVeinsUrl: 'https://www.icy-veins.com/arknights-endfield/',
      endfieldGgUrl: 'https://arknightsendfield.gg/',
    },
  },
  {
    id: 'chen_qianyu',
    name: 'Chen Qianyu',
    codeName: 'CHEN QIANYU // SWORDMASTER FLURRY',
    chineseName: '陈千语',
    rarity: 5,
    element: 'Physical',
    elementVi: 'Vật Lý (Physical)',
    elementColor: '#94a3b8',
    role: 'Vanguard',
    roleVi: 'Kiếm Sĩ Tiên Phong (Rapid Striker & SP Generator)',
    tier: 'A+',
    avatar: '/avatars/endfield/chen_qianyu.webp',
    summary: 'Kiếm sĩ với tốc độ chém vũ bão bậc nhất. Tích lũy điểm Kiếm Ý để thi triển liên hoàn kiếm pháp, cắt nát hàng phòng ngự kẻ địch và mở ra khoảng trống cho đồng đội.',
    ratings: {
      singleTarget: 9.0,
      aoe: 8.8,
      support: 8.7,
      synergy: 9.6,
      contingencyContract: 9.1,
    },
    weapons: {
      signature: {
        name: 'Azure Swiftblade (5★ Gacha)',
        rarity: 5,
        effect: 'Tăng 26% Tốc độ đánh. Mỗi 5 đòn chém liên tiếp hồi 6 SP cho bản thân và giảm 10% Giáp mục tiêu.',
        tierNote: 'Duy trì trạng thái Kiếm Ý tối đa gần như vĩnh viễn.',
      },
      alternatives: [
        {
          name: 'AIC Precision Rapier (4★ Chế Tạo)',
          rarity: 4,
          effect: 'Tăng Nhanh Nhẹn (Agility) và tăng sát thương bạo kích.',
          performance: 'Khoảng 83% hiệu suất',
          source: 'Xưởng Chế Tạo AIC Cấp 2',
        },
      ],
    },
    gear: {
      bestSet: {
        name: 'Swordmaster Rhythm (Bộ 4 Mảnh)',
        pieces: '4 Mảnh',
        bonus: '2P: +15% Tốc độ di chuyển và tấn công. 4P: Thi triển Combo Skill kích hoạt 8 kiếm khí gây thêm 320% Sát thương Vật lý chuẩn.',
        aicBlueprint: 'Dây Chuyền Rèn Kiếm Khí AIC Khu 2',
      },
    },
    stats: {
      mainStats: ['Agility (Nhanh Nhẹn)', 'Tỷ Lệ Bạo Kích', 'Sát Thương Bạo Kích', 'Tốc Độ Đánh'],
      subStats: ['Agility > Crit Rate > Crit DMG > SP Return'],
      benchmarks: [
        { label: 'Agility', target: '2,100+' },
        { label: 'Crit Rate', target: '65%+' },
        { label: 'Attack Speed', target: '+35%+' },
      ],
    },
    skills: {
      priority: ['Combo Skill > Kỹ năng Kích hoạt > Kỹ năng Nộ > Đánh thường'],
      masteryNotes: 'M1 mở khóa khả năng xuyên qua mục tiêu khi lướt chém.',
    },
    comboMechanics: {
      triggerCondition: 'Mục tiêu bị Đẩy Lùi hoặc bị Đóng Băng.',
      appliedEffect: 'Lướt qua mục tiêu chém 6 nhát liên hoàn gây Suy Giáp (Armor Break) 25%.',
      rotationTip: 'Đồng đội mở khống chế -> Chen lướt chém trừ giáp -> Chuyển sang DPS dứt điểm.',
    },
    bestTeams: [
      {
        name: 'Trảm Kích Tốc Độ (Flurry Blitz)',
        description: 'Tận dụng tốc độ chém liên hồi và trừ giáp liên tục.',
        operators: [
          { name: 'Chen Qianyu', roleInTeam: 'Rapid Striker & Debuffer', element: 'Physical' },
          { name: 'Endministrator', roleInTeam: 'Leader Buffer', element: 'Physical' },
          { name: 'Argent Flow', roleInTeam: 'Khống Chế Băng', element: 'Cryo' },
          { name: 'Purrchena', roleInTeam: 'Pin SP', element: 'Physical' },
        ],
      },
    ],
    externalLinks: {
      prydwenUrl: 'https://www.prydwen.gg/arknights-endfield/characters',
      mobalyticsUrl: 'https://mobalytics.gg/arknights-endfield/builds',
      icyVeinsUrl: 'https://www.icy-veins.com/arknights-endfield/',
      endfieldGgUrl: 'https://arknightsendfield.gg/',
    },
  },
  {
    id: 'xaihi',
    name: 'Xaihi',
    codeName: 'XAIHI // GLACIAL SANCTUARY',
    chineseName: '赛希',
    rarity: 5,
    element: 'Cryo',
    elementVi: 'Băng (Cryo)',
    elementColor: '#38bdf8',
    role: 'Supporter',
    roleVi: 'Hỗ Trợ Băng & Trị Liệu (Glacial Supporter & Healer)',
    tier: 'S',
    avatar: '/avatars/endfield/xaihi.webp',
    summary: 'Cứu cánh hồi máu và tạo trận địa bảo vệ số 1 trong các thử thách khắc nghiệt. Đặt trường Băng thanh tẩy hiệu ứng bất lợi và liên tục làm chậm quái xung quanh.',
    ratings: {
      singleTarget: 7.2,
      aoe: 8.5,
      support: 9.8,
      synergy: 9.7,
      contingencyContract: 9.9,
    },
    weapons: {
      signature: {
        name: 'Frostbell Chime (5★ Gacha)',
        rarity: 5,
        effect: 'Tăng 35% Lượng trị liệu. Đồng đội đứng trong trận địa Băng nhận thêm 20% Kháng Sát thương toàn phần.',
        tierNote: 'Vũ khí trị liệu toàn diện số một cho Xaihi.',
      },
      alternatives: [
        {
          name: 'AIC Cryo Catalyst (4★ Chế Tạo)',
          rarity: 4,
          effect: 'Tăng Ý Chí (Will) và tăng lượng hồi phục dựa trên Máu Tối Đa.',
          performance: 'Khoảng 85% hiệu suất',
          source: 'Xưởng Chế Tạo AIC Cấp 3',
        },
      ],
    },
    gear: {
      bestSet: {
        name: 'Glacial Bloom (Bộ 4 Mảnh)',
        pieces: '4 Mảnh',
        bonus: '2P: +25% Lượng Trị Liệu. 4P: Thi triển Kỹ năng Kích hoạt tăng 20% Tấn công cho toàn bộ đồng đội trong 10 giây.',
        aicBlueprint: 'Dây Chuyền Thuốc Tinh Chế AIC Khu 3',
      },
    },
    stats: {
      mainStats: ['Will (Ý Chí)', 'Máu Tối Đa (Max HP)', 'Hiệu Suất Trị Liệu', 'SP Return'],
      subStats: ['Will > % Max HP > SP Gain > Tốc Độ Hồi Chiêu'],
      benchmarks: [
        { label: 'Will', target: '2,300+' },
        { label: 'Healing Bonus', target: '+45%+' },
        { label: 'SP Gain', target: '135%+' },
      ],
    },
    skills: {
      priority: ['Kỹ năng Kích hoạt (Trận Địa Hồi Máu) > Kỹ năng Nộ > Combo Skill > Đánh thường'],
      masteryNotes: 'M3 mở khóa khả năng Hồi Sinh đồng đội 1 lần mỗi trận đấu với 50% Máu.',
    },
    comboMechanics: {
      triggerCondition: 'Mục tiêu dính hiệu ứng Hóa Rắn hoặc đồng đội bị hạ máu xuống dưới 40%.',
      appliedEffect: 'Kích hoạt trận tuyết bão bảo hộ lập tức hồi 35% Máu và đóng băng kẻ địch xung quanh.',
      rotationTip: 'Đặt trận địa hồi máu trước các đợt bão đòn của boss để toàn đội an tâm xả sát thương.',
    },
    bestTeams: [
      {
        name: 'Băng Hàn Bất Tử (Glacial Fortress)',
        description: 'Đội hình sinh tồn tối thượng cho Contingency Contract cấp cao.',
        operators: [
          { name: 'Xaihi', roleInTeam: 'Healer & Frost Buffer', element: 'Cryo' },
          { name: 'Argent Flow', roleInTeam: 'Cryo Breaker & Khống Chế', element: 'Cryo' },
          { name: 'Si', roleInTeam: 'Main DPS Tự Nhiên', element: 'Nature' },
          { name: 'Typhoeus', roleInTeam: 'Tank & Hút Quái', element: 'Heat' },
        ],
      },
    ],
    externalLinks: {
      prydwenUrl: 'https://www.prydwen.gg/arknights-endfield/characters',
      mobalyticsUrl: 'https://mobalytics.gg/arknights-endfield/builds',
      icyVeinsUrl: 'https://www.icy-veins.com/arknights-endfield/',
      endfieldGgUrl: 'https://arknightsendfield.gg/',
    },
  },
  {
    id: 'zhuang_fangyi',
    name: 'Zhuang Fangyi',
    codeName: 'FIORINA // BRAMBLE BULWARK',
    chineseName: '庄方宜 (Fiorina)',
    rarity: 5,
    element: 'Nature',
    elementVi: 'Tự Nhiên (Nature)',
    elementColor: '#22c55e',
    role: 'Guard',
    roleVi: 'Hộ Vệ Dây Gai (Bramble Guard & Debuffer)',
    tier: 'A+',
    avatar: '/avatars/endfield/zhuang_fangyi.webp',
    summary: 'Hộ vệ hệ Tự Nhiên có khả năng phản đòn kịch độc và trói chân quái vật. Phối hợp với Si tạo chuỗi Ăn Mòn liên hoàn hủy diệt phòng tuyến địch.',
    ratings: {
      singleTarget: 8.1,
      aoe: 9.1,
      support: 9.2,
      synergy: 9.7,
      contingencyContract: 9.3,
    },
    weapons: {
      signature: {
        name: 'Verdant Barbed Shield (5★ Gacha)',
        rarity: 5,
        effect: 'Tăng 30% Sức Mạnh và phản lại 40% sát thương dưới dạng sát thương Tự Nhiên kèm hiệu ứng Ăn Mòn.',
        tierNote: 'Biến Fiorina thành cỗ máy phản đòn cực kỳ khó chịu.',
      },
      alternatives: [
        {
          name: 'AIC Briar Shield (4★ Chế Tạo)',
          rarity: 4,
          effect: 'Tăng Phòng Ngự và kéo dài thời gian trói chân thêm 1.5 giây.',
          performance: 'Khoảng 82% hiệu suất',
          source: 'Xưởng Chế Tạo AIC Cấp 2',
        },
      ],
    },
    gear: {
      bestSet: {
        name: 'Bramble Fortress (Bộ 4 Mảnh)',
        pieces: '4 Mảnh',
        bonus: '2P: +20% Sức Mạnh và Giáp. 4P: Khi trói chân kẻ địch, giảm 25% Kháng Tự Nhiên của toàn bộ kẻ địch xung quanh.',
        aicBlueprint: 'Dây Chuyền Đúc Gai Thép AIC Khu 2',
      },
    },
    stats: {
      mainStats: ['Strength (Sức Mạnh)', 'Máu Tối Đa', 'Phòng Ngự', 'Kháng Chấn'],
      subStats: ['Strength > % Max HP > % Def > SP Return'],
      benchmarks: [
        { label: 'Strength', target: '2,100+' },
        { label: 'Max HP', target: '25,000+' },
      ],
    },
    skills: {
      priority: ['Kỹ năng Kích hoạt (Trói Gai) > Kỹ năng Nộ > Combo Skill > Đánh thường'],
      masteryNotes: 'M2 tăng phạm vi trói chân dây gai thêm 40%.',
    },
    comboMechanics: {
      triggerCondition: 'Mục tiêu bị dính Ăn Mòn (Nature Corrosion) hoặc bị Choáng.',
      appliedEffect: 'Bung lồng gai trói chặt mục tiêu trong 3.5 giây và tăng thêm 1 tầng Ăn Mòn.',
      rotationTip: 'Si thả vũng Mực -> Fiorina kích hoạt Combo trói quái cố định -> Si dứt điểm bằng Nộ.',
    },
    bestTeams: [
      {
        name: 'Rừng Gai Ăn Mòn (Nature Bramble Hazard)',
        description: 'Khóa cứng kẻ địch trong vũng độc và hủy diệt bằng sát thương theo thời gian.',
        operators: [
          { name: 'Zhuang Fangyi', roleInTeam: 'Tank & Bramble Lockdown', element: 'Nature' },
          { name: 'Si', roleInTeam: 'Main Burst Caster', element: 'Nature' },
          { name: 'Purrchena', roleInTeam: 'SP Battery', element: 'Physical' },
          { name: 'Avywenna', roleInTeam: 'Res-Shred & Vulnerable', element: 'Electric' },
        ],
      },
    ],
    externalLinks: {
      prydwenUrl: 'https://www.prydwen.gg/arknights-endfield/characters',
      mobalyticsUrl: 'https://mobalytics.gg/arknights-endfield/builds',
      icyVeinsUrl: 'https://www.icy-veins.com/arknights-endfield/',
      endfieldGgUrl: 'https://arknightsendfield.gg/',
    },
  },
  {
    id: 'ember',
    name: 'Ember',
    codeName: 'EMBER // FLAMESTORM INQUISITOR',
    chineseName: '余烬 (Ember)',
    rarity: 6,
    element: 'Heat',
    elementVi: 'Nhiệt / Hỏa (Heat)',
    elementColor: '#ef4444',
    role: 'Striker',
    roleVi: 'Trọng Kiếm Hỏa Diệm (Heavy Heat Striker)',
    tier: 'S',
    avatar: '/avatars/endfield/ember.webp',
    summary: 'Trọng kiếm sư hệ Nhiệt với sát thương bạo kích khổng lồ. Thiêu đốt và kích nổ toàn bộ thanh Thế của boss lớn chỉ trong một chuỗi đòn đánh chuẩn chỉ.',
    ratings: {
      singleTarget: 9.6,
      aoe: 9.2,
      support: 7.2,
      synergy: 9.4,
      contingencyContract: 9.5,
    },
    weapons: {
      signature: {
        name: 'Sunfury Greatblade (Trấn 6★)',
        rarity: 6,
        effect: 'Tăng 42% Sát thương Bạo kích và 25% Sát thương Nhiệt. Khi chém trúng mục tiêu dính Hỏa Thiêu, phóng thích sóng nhiệt gây thêm 220% sát thương bộc phá.',
        tierNote: 'Vũ khí tối thượng đưa sát thương của Ember lên tầm cao nhất.',
      },
      alternatives: [
        {
          name: 'Infernal Cleaver (5★ Gacha)',
          rarity: 5,
          effect: 'Tăng 24% Sát thương Nhiệt và tăng tốc độ tích nộ.',
          performance: 'Khoảng 87% hiệu suất so với Trấn',
          source: 'Gacha Vũ Khí',
        },
        {
          name: 'AIC Heavy Thermal Slasher (4★ Chế Tạo)',
          rarity: 4,
          effect: 'Tăng Sức Mạnh và tăng sát thương khi phá vỡ thanh Thế.',
          performance: 'Khoảng 77% hiệu suất',
          source: 'Xưởng Chế Tạo AIC Cấp 3',
        },
      ],
    },
    gear: {
      bestSet: {
        name: 'Solar Conflagration (Bộ 4 Mảnh)',
        pieces: '4 Mảnh',
        bonus: '2P: +20% Sát thương Nhiệt. 4P: Kích hoạt Nộ tăng 35% Sát thương Bạo kích và biến đòn đánh thường thành nhát chém dung nham trong 12 giây.',
        aicBlueprint: 'Dây Chuyền Nhiệt Đốt Nóng Chảy AIC Khu 4',
      },
    },
    stats: {
      mainStats: ['Strength (Sức Mạnh)', 'Tỷ Lệ Bạo Kích', 'Sát Thương Bạo Kích', 'SP Return'],
      subStats: ['Crit Rate > Crit DMG > Strength > Xuyên Kháng Nhiệt'],
      benchmarks: [
        { label: 'Strength', target: '2,350+' },
        { label: 'Crit Rate', target: '70%+' },
        { label: 'Crit DMG', target: '210%+' },
      ],
    },
    skills: {
      priority: ['Kỹ năng Nộ > Kỹ năng Kích hoạt > Combo Skill > Đánh thường'],
      masteryNotes: 'M3 nâng thời gian cường hóa dung nham lên 15 giây và bỏ qua 25% Giáp kẻ địch.',
    },
    comboMechanics: {
      triggerCondition: 'Mục tiêu bị Hất Tung (Lift) hoặc bị Phá Vỡ Thế (Broken).',
      appliedEffect: 'Bổ nhát chém thiên hỏa gây sát thương bộc phát cực hạn và thiêu rụi giáp mục tiêu.',
      rotationTip: 'Typhoeus Lift mục tiêu -> Akekuri cấp SP -> Ember lao vào Ultimate chém kết liễu.',
    },
    bestTeams: [
      {
        name: 'Bão Lửa Tận Diệt (Solar Inferno)',
        description: 'Đội hình thuần Nhiệt với lượng sát thương dồn cực sốc.',
        operators: [
          { name: 'Ember', roleInTeam: 'Main Burst DPS', element: 'Heat' },
          { name: 'Typhoeus', roleInTeam: 'Tank & Hất Tung', element: 'Heat' },
          { name: 'Akekuri', roleInTeam: 'Pin SP & Hỏa Thiêu', element: 'Heat' },
          { name: 'Purrchena', roleInTeam: 'SP Battery Toàn Năng', element: 'Physical' },
        ],
      },
    ],
    externalLinks: {
      prydwenUrl: 'https://www.prydwen.gg/arknights-endfield/characters',
      mobalyticsUrl: 'https://mobalytics.gg/arknights-endfield/builds',
      icyVeinsUrl: 'https://www.icy-veins.com/arknights-endfield/',
      endfieldGgUrl: 'https://arknightsendfield.gg/',
    },
  },
  {
    id: 'gilberta',
    name: 'Gilberta',
    codeName: 'ANGELINA // GRAVITATIONAL ARTS',
    chineseName: '洁尔佩塔 (Gilberta)',
    rarity: 6,
    element: 'Electric',
    elementVi: 'Điện & Trọng Lực (Gravity Arts)',
    elementColor: '#a855f7',
    role: 'Supporter',
    roleVi: 'Hỗ Trợ Trọng Lực (Gravity Supporter & Buffer)',
    tier: 'S+',
    avatar: '/avatars/endfield/gilberta.webp',
    summary: 'Nhân vật huyền thoại trở lại trong Endfield với bộ điều khiển trọng trường tân tiến. Giảm trọng lượng kẻ địch giúp mọi kỹ năng Hất Tung (Lift) hoạt động trên cả boss siêu nặng, đồng thời khuếch đại sát thương Arts toàn đội.',
    ratings: {
      singleTarget: 8.8,
      aoe: 9.8,
      support: 10.0,
      synergy: 9.9,
      contingencyContract: 9.9,
    },
    weapons: {
      signature: {
        name: 'Gravitational Singularity (Trấn 6★)',
        rarity: 6,
        effect: 'Tăng 35% Sát thương Nguyên tố Arts. Khi mở Vùng Không Trọng Lượng, giảm 30% Kháng Sát thương của toàn bộ kẻ địch lọt vào tầm ảnh hưởng.',
        tierNote: 'Trấn phái biến Angelina thành buffer nguyên tố toàn năng không thể thay thế.',
      },
      alternatives: [
        {
          name: 'AIC Anti-Gravity Resonator (4★ Chế Tạo)',
          rarity: 4,
          effect: 'Tăng Trí Tuệ (Intellect) và tăng 15% hiệu quả nạp SP khi kẻ địch bị lơ lửng.',
          performance: 'Khoảng 84% hiệu suất',
          source: 'Xưởng Chế Tạo AIC Cấp 3',
        },
      ],
    },
    gear: {
      bestSet: {
        name: 'Spatial Distortion (Bộ 4 Mảnh)',
        pieces: '4 Mảnh',
        bonus: '2P: +20% Hiệu ứng Khống Chế & Hút Quái. 4P: Kẻ địch chịu hiệu ứng Không Trọng Lượng nhận thêm 28% Sát thương Bạo kích từ đồng đội trong 12 giây.',
        aicBlueprint: 'Dây Chuyền Tinh Chế Không Gian AIC Khu 4',
      },
    },
    stats: {
      mainStats: ['Intellect (Trí Tuệ)', 'SP Return Efficiency', 'Tỷ Lệ Bạo Kích', 'Giảm Hồi Chiêu'],
      subStats: ['SP Return > Intellect > Crit Rate > Crit DMG'],
      benchmarks: [
        { label: 'Intellect', target: '2,200+' },
        { label: 'SP Gain Efficiency', target: '140%+' },
        { label: 'Crit Rate', target: '60%+' },
      ],
    },
    skills: {
      priority: ['Kỹ năng Nộ (Không Trọng Lượng) > Kỹ năng Kích hoạt (Hố Đen) > Combo Skill > Đánh thường'],
      masteryNotes: 'M3 cho phép giữ trạng thái Không Trọng Lượng thêm 4 giây và tăng 35% tốc độ đánh cho cả đội.',
    },
    comboMechanics: {
      triggerCondition: 'Mục tiêu bị Hất Tung (Lift) hoặc bị Làm Chậm.',
      appliedEffect: 'Bẻ cong trọng trường kích hoạt [Hố Đen Trọng Lực] gom toàn bộ kẻ địch và giảm 50% trọng lượng.',
      rotationTip: 'Angelina Nộ hạ trọng lượng quái -> Typhoeus tung Lift cực dễ -> DPS chính thi triển Combo dứt điểm.',
    },
    bestTeams: [
      {
        name: 'Trọng Lực & Hủy Diệt (Gravity Lift Burst)',
        description: 'Đội hình tận dụng trường trọng lực của Angelina để hất tung mọi loại quái lớn và boss.',
        operators: [
          { name: 'Gilberta', roleInTeam: 'Gravity Buffer & Crowd Control', element: 'Electric' },
          { name: 'Typhoeus', roleInTeam: 'Tank & Hất Tung Boss', element: 'Heat' },
          { name: 'Si', roleInTeam: 'Main Burst Caster', element: 'Nature' },
          { name: 'Purrchena', roleInTeam: 'Pin SP Năng Lượng', element: 'Physical' },
        ],
      },
    ],
    externalLinks: {
      prydwenUrl: 'https://www.prydwen.gg/arknights-endfield/characters',
      mobalyticsUrl: 'https://mobalytics.gg/arknights-endfield/builds',
      icyVeinsUrl: 'https://www.icy-veins.com/arknights-endfield/',
      endfieldGgUrl: 'https://arknightsendfield.gg/',
    },
  },
  {
    id: 'ardelia',
    name: 'Ardelia',
    codeName: 'ARDELIA // LIFEBLOOM NURTURER',
    chineseName: '艾尔黛拉 (Ardelia)',
    rarity: 5,
    element: 'Nature',
    elementVi: 'Tự Nhiên (Nature)',
    elementColor: '#22c55e',
    role: 'Supporter',
    roleVi: 'Trị Liệu Thảo Dược & Giải Độc (Nature Healer & Cleanser)',
    tier: 'A+',
    avatar: '/avatars/endfield/ardelia.webp',
    summary: 'Chuyên gia hồi phục dược thảo hệ Tự Nhiên. Có khả năng thanh tẩy hiệu ứng bất lợi, liên tục cấp hồi máu theo thời gian và tăng sát thương Ăn Mòn cho đồng minh.',
    ratings: {
      singleTarget: 7.8,
      aoe: 8.6,
      support: 9.7,
      synergy: 9.6,
      contingencyContract: 9.4,
    },
    weapons: {
      signature: {
        name: 'Herbal Essence Cane (5★ Gacha)',
        rarity: 5,
        effect: 'Tăng 28% Lượng trị liệu. Mỗi khi hồi máu cho đồng đội, cấp thêm khiên chắn tương đương 15% lượng hồi phục.',
        tierNote: 'Vũ khí duy trì lượng khiên và máu dồi dào cho cả đội.',
      },
      alternatives: [
        {
          name: 'AIC Botanical Sprig (4★ Chế Tạo)',
          rarity: 4,
          effect: 'Tăng Ý Chí (Will) và tăng 18% tốc độ hồi chiêu kỹ năng kích hoạt.',
          performance: 'Khoảng 83% hiệu suất',
          source: 'Xưởng Chế Tạo AIC Cấp 2',
        },
      ],
    },
    gear: {
      bestSet: {
        name: 'Herbal Sanctuary (Bộ 4 Mảnh)',
        pieces: '4 Mảnh',
        bonus: '2P: +20% Hiệu suất Trị liệu. 4P: Thi triển Kỹ năng kích hoạt tăng 24% Sát thương Tự Nhiên (Nature) cho toàn đội trong 12 giây.',
        aicBlueprint: 'Dây Chuyền Chiết Xuất Thảo Dược AIC Khu 2',
      },
    },
    stats: {
      mainStats: ['Will (Ý Chí)', 'Máu Tối Đa', 'Hiệu Suất Trị Liệu', 'SP Return'],
      subStats: ['Will > % Max HP > SP Gain > Giảm Hồi Chiêu'],
      benchmarks: [
        { label: 'Will', target: '2,150+' },
        { label: 'Healing Bonus', target: '+40%+' },
        { label: 'SP Gain', target: '130%+' },
      ],
    },
    skills: {
      priority: ['Kỹ năng Kích hoạt (Trận Thảo Dược) > Kỹ năng Nộ > Combo Skill > Đánh thường'],
      masteryNotes: 'M1 tự động xóa bỏ 1 hiệu ứng bất lợi ngẫu nhiên mỗi 5 giây cho thành viên thấp máu nhất.',
    },
    comboMechanics: {
      triggerCondition: 'Mục tiêu bị dính Ăn Mòn (Nature Corrosion) hoặc đồng đội bị hạ máu dưới 50%.',
      appliedEffect: 'Bung nở hoa sinh mệnh hồi phục tức thì 30% Máu và kéo dài thêm 4 giây hiệu ứng Ăn Mòn.',
      rotationTip: 'Si áp dụng Ăn Mòn -> Ardelia kích Combo kéo dài thời gian ăn mòn -> Đội hình an tâm duy trì DPS cao.',
    },
    bestTeams: [
      {
        name: 'Dược Thảo & Ăn Mòn Tự Nhiên (Nature Bloom Sustain)',
        description: 'Đội hình hỗ trợ hoàn hảo cho Si giúp xả sát thương Ăn Mòn bất tận mà không lo cạn máu.',
        operators: [
          { name: 'Ardelia', roleInTeam: 'Nature Healer & Corrosion Extender', element: 'Nature' },
          { name: 'Si', roleInTeam: 'Main Burst Caster', element: 'Nature' },
          { name: 'Zhuang Fangyi', roleInTeam: 'Bramble Tank & Trói Quái', element: 'Nature' },
          { name: 'Purrchena', roleInTeam: 'SP Battery Năng Lượng', element: 'Physical' },
        ],
      },
    ],
    externalLinks: {
      prydwenUrl: 'https://www.prydwen.gg/arknights-endfield/characters',
      mobalyticsUrl: 'https://mobalytics.gg/arknights-endfield/builds',
      icyVeinsUrl: 'https://www.icy-veins.com/arknights-endfield/',
      endfieldGgUrl: 'https://arknightsendfield.gg/',
    },
  },
  {
    "id": "laevatain",
    "name": "Laevatain",
    "codeName": "LAEVATAIN // INFERNAL SWORD",
    "chineseName": "莱万汀 (Láiwàntīng)",
    "rarity": 6,
    "element": "Heat",
    "elementVi": "Nhiệt Hỏa (Heat)",
    "elementColor": "#ef4444",
    "role": "Striker",
    "roleVi": "Xung Kích (Striker DPS)",
    "tier": "S+",
    "avatar": "/avatars/endfield/laevatain.webp",
    "summary": "DPS hệ Heat bộc phá cực mạnh thuộc tộc Sarkaz. Tối ưu hóa phản ứng Thiêu Đốt (Combust) và gây sát thương khuếch đại diện rộng khi mục tiêu bị gán ấn Lửa.",
    "ratings": {
      "singleTarget": 9.8,
      "aoe": 9.6,
      "support": 6.2,
      "synergy": 9.7,
      "contingencyContract": 9.9
    },
    "branches": [
      {
        "name": "Nhánh Phun Trào Thiêu Đốt (Combust Burst)",
        "description": "Tối đa hóa sát thương Ultimate và Battle Skill khi nổ ấn Heat trên kẻ địch.",
        "statFocus": "Intellect > Crit Rate > Heat DMG% > ATK%",
        "gearRecommendation": "Set 4 Mảnh Cực Nhiệt Quá Tải + Phụ kiện Tăng Tốc SP"
      },
      {
        "name": "Nhánh Trảm Kích Tốc Độ (Swift Blade)",
        "description": "Duy trì luân chuyển đòn đánh thường và Combo Skill liên tục không độ trễ.",
        "statFocus": "ATK Speed > Crit DMG > Energy Recharge",
        "gearRecommendation": "Set 4 Mảnh Kiếm Khí Tiên Phong"
      }
    ],
    "weapons": {
      "signature": {
        "name": "Spitfire Searing Edge",
        "rarity": 6,
        "effect": "Tăng 24% Heat DMG. Khi kích hoạt phản ứng Combust, đòn đánh kế tiếp tăng 40% sát thương bạo kích trong 6s.",
        "tierNote": "Trấn 6★ tối ưu tuyệt đối cho lối chơi xoay quanh phản ứng Heat"
      },
      "alternatives": [
        {
          "name": "Blazing Broadsword",
          "rarity": 5,
          "effect": "Tăng 15% ATK và hồi 4 SP mỗi khi hoàn thành chuỗi Final Strike.",
          "performance": "88% hiệu năng trấn",
          "source": "Rèn AIC Công Xưởng / Banner Thường"
        },
        {
          "name": "Pioneer Heat Blade",
          "rarity": 4,
          "effect": "Tăng 12% Heat DMG cơ bản.",
          "performance": "72% hiệu năng trấn",
          "source": "Nhiệm vụ Cốt Truyện Chương 2"
        }
      ]
    },
    "gear": {
      "bestSet": {
        "name": "Bộ Nhiệt Năng Quá Tải (Overheated Core)",
        "pieces": "4 Mảnh (Áo Giáp + Giày + Găng + Lõi Phản Ứng)",
        "bonus": "2P: Heat DMG +15%. 4P: Khi mục tiêu trúng đòn ở trạng thái Combust, toàn bộ đòn đánh kế tăng 30% DMG.",
        "aicBlueprint": "AIC Blueprint Lầu 4 Khu Vực Nghiên Cứu Talos-II"
      },
      "alternativeSet": {
        "name": "Bộ Đấu Sĩ Tiên Phong (Vanguard Fighter)",
        "pieces": "2P Heat + 2P ATK%",
        "bonus": "ATK +10%, Heat DMG +10%"
      }
    },
    "stats": {
      "mainStats": [
        "Thân: Tỉ Lệ Bạo Kích",
        "Chân: Heat DMG Bonus",
        "Phụ kiện: Tấn Công % / Năng Lượng SP"
      ],
      "subStats": [
        "Tỉ lệ Bạo Kích (Crit Rate)",
        "Sát thương Bạo Kích (Crit DMG)",
        "Trí Lực (Intellect)",
        "Hiệu suất Nạp SP"
      ],
      "benchmarks": [
        {
          "label": "Tỉ lệ Bạo kích",
          "target": "65%+"
        },
        {
          "label": "Sát thương Bạo kích",
          "target": "170%+"
        },
        {
          "label": "Trí Lực (Intellect)",
          "target": "800+"
        }
      ]
    },
    "skills": {
      "priority": [
        "Tuyệt Kỹ (Ultimate) - Hỏa Ngục Trảm",
        "Chiến Kỹ (Battle Skill) - Liệt Hỏa Trùng Kích",
        "Kỹ Năng Chuỗi (Combo Skill)",
        "Đòn Đánh Thường"
      ],
      "masteryNotes": "Ưu tiên Max Tuyệt Kỹ và Chiến Kỹ để tối đa lượng sát thương nổ đòn sau khi đồng đội gắn hiệu ứng Heat Infliction."
    },
    "comboMechanics": {
      "triggerCondition": "Đồng đội kích hoạt đòn đánh Final Strike hoặc gán trạng thái Heat Infliction lên mục tiêu.",
      "appliedEffect": "Lao tới chém ngọn lửa hình bán nguyệt, gây 480% Heat DMG và làm mục tiêu rơi vào trạng thái Thiêu Đốt (Combust).",
      "rotationTip": "Cho Akekuri hoặc Camille dùng skill gán ấn Heat trước -> Chuyển sang Laevatain tung Combo Skill -> Xả Tuyệt Kỹ ngay lập tức."
    },
    "bestTeams": [
      {
        "name": "Đội Hình Hỏa Ngục Siêu Bộc Phá (Mono Heat Hypercarry)",
        "operators": [
          {
            "name": "Laevatain",
            "roleInTeam": "Main DPS Xung Kích",
            "element": "Heat"
          },
          {
            "name": "Camille",
            "roleInTeam": "Vanguard Tiên Phong & Gán Ấn Heat",
            "element": "Heat"
          },
          {
            "name": "Akekuri",
            "roleInTeam": "Sạc SP & Kích Hoạt Combo Liên Hoàn",
            "element": "Heat"
          },
          {
            "name": "Ember",
            "roleInTeam": "Defender Hộ Vệ & Tạo Khiên Hấp Thụ",
            "element": "Heat"
          }
        ],
        "description": "Đội hình thuần Heat mạnh nhất meta v1.0 - v1.6. Camille và Akekuri sạc SP siêu tốc, liên tục nuôi Laevatain nổ Ultimate thiêu rụi toàn bộ Boss."
      }
    ],
    "externalLinks": {
      "prydwenUrl": "https://www.prydwen.gg/arknights-endfield/characters/laevatain",
      "mobalyticsUrl": "https://mobalytics.gg/arknights-endfield/operators/laevatain",
      "endfieldGgUrl": "https://endfield.gg/operators/laevatain",
      "bwikiUrl": "https://wiki.biligame.com/zmd/%E8%8E%B1%E4%B8%87%E6%B1%80"
    }
  },
  {
    "id": "last_rite",
    "name": "Last Rite",
    "codeName": "LAST RITE // GLACIAL CONDEMNATION",
    "chineseName": "终末之誓 (Zhōngmò Zhī Shì)",
    "rarity": 6,
    "element": "Cryo",
    "elementVi": "Băng Sương (Cryo)",
    "elementColor": "#38bdf8",
    "role": "Striker",
    "roleVi": "Xung Kích (Striker Boss Killer)",
    "tier": "S+",
    "avatar": "/avatars/endfield/last_rite.webp",
    "summary": "Chuyên gia trừng phạt và trảm sát Boss đơn mục tiêu hệ Băng. Kích hoạt hiệu ứng Chém Vỡ Băng (Shatter) cực mạnh khi mục tiêu bị đóng băng hoặc dính ấn Cryo.",
    "ratings": {
      "singleTarget": 10,
      "aoe": 8.5,
      "support": 5.5,
      "synergy": 9.6,
      "contingencyContract": 9.8
    },
    "branches": [
      {
        "name": "Nhánh Trảm Tuyết Đơn Mục Tiêu",
        "description": "Tập trung toàn bộ hệ số nhân vào cú bổ đại kiếm hạ sát Boss trong tích tắc.",
        "statFocus": "Strength > Crit DMG > Cryo DMG%",
        "gearRecommendation": "Set 4 Mảnh Băng Hà Vĩnh Cửu"
      }
    ],
    "weapons": {
      "signature": {
        "name": "Frostfall Oath Greatsword",
        "rarity": 6,
        "effect": "Tăng 28% Cryo DMG. Khi mục tiêu có ấn Cryo Infliction, đòn đánh bỏ qua 25% phòng ngự vật lý và kháng nguyên tố.",
        "tierNote": "Vũ khí chém vỡ giáp mạnh nhất cho các trận săn Boss cấp cao"
      },
      "alternatives": [
        {
          "name": "Glacial Sunder",
          "rarity": 5,
          "effect": "Tăng 18% Sát thương đòn đánh nặng (Heavy Smash).",
          "performance": "86% hiệu năng trấn",
          "source": "Rèn AIC Công Xưởng Cấp 4"
        }
      ]
    },
    "gear": {
      "bestSet": {
        "name": "Bộ Hàn Băng Cực Địa (Absolute Glacial)",
        "pieces": "4 Mảnh Đại Băng Nguyên",
        "bonus": "2P: Cryo DMG +15%. 4P: Tăng 35% sát thương lên kẻ địch bị Đóng Băng hoặc Chậm.",
        "aicBlueprint": "AIC Blueprint Thung Lũng Tuyết Talos-II"
      }
    },
    "stats": {
      "mainStats": [
        "Thân: Tỉ Lệ Bạo Kích",
        "Chân: Cryo DMG Bonus",
        "Găng: Sức Mạnh (Strength)"
      ],
      "subStats": [
        "Sức Mạnh (Strength)",
        "Crit DMG",
        "Crit Rate",
        "ATK%"
      ],
      "benchmarks": [
        {
          "label": "Tỉ lệ Bạo kích",
          "target": "70%+"
        },
        {
          "label": "Sát thương Bạo kích",
          "target": "180%+"
        },
        {
          "label": "Sức Mạnh (Strength)",
          "target": "850+"
        }
      ]
    },
    "skills": {
      "priority": [
        "Tuyệt Kỹ (Ultimate) - Lãnh Cực Phán Quyết",
        "Kỹ Năng Chuỗi (Combo Skill)",
        "Chiến Kỹ",
        "Đòn Đánh Thường"
      ],
      "masteryNotes": "Max Tuyệt Kỹ đầu tiên để đạt lượng số nhân sát thương cao nhất toàn game."
    },
    "comboMechanics": {
      "triggerCondition": "Mục tiêu bị gán hiệu ứng Cryo Infliction từ Xaihi hoặc Yvonne.",
      "appliedEffect": "Bổ đại kiếm đóng băng mặt đất, gây 620% sát thương Băng và kích hoạt vỡ vụn.",
      "rotationTip": "Dùng Xaihi gán Cryo -> Yvonne bắn đóng băng -> Last Rite vào chém kết liễu."
    },
    "bestTeams": [
      {
        "name": "Đội Hình Băng Phong Diệt Tuyệt (Cryo Freeze Team)",
        "operators": [
          {
            "name": "Last Rite",
            "roleInTeam": "Main Striker Dứt Điểm",
            "element": "Cryo"
          },
          {
            "name": "Yvonne",
            "roleInTeam": "Ranged Striker / Khóa Băng",
            "element": "Cryo"
          },
          {
            "name": "Xaihi",
            "roleInTeam": "Supporter Buff Cryo & Hồi Máu",
            "element": "Cryo"
          },
          {
            "name": "Snowshine",
            "roleInTeam": "Defender Hấp Thụ Khiên Băng",
            "element": "Cryo"
          }
        ],
        "description": "Đội hình băng khống chế cứng và sốc sát thương Boss đơn mục tiêu số 1 game."
      }
    ],
    "externalLinks": {
      "prydwenUrl": "https://www.prydwen.gg/arknights-endfield/characters/last-rite",
      "mobalyticsUrl": "https://mobalytics.gg/arknights-endfield/operators/last-rite"
    }
  },
  {
    "id": "lifeng",
    "name": "Lifeng",
    "codeName": "LIFENG // ASCENDING DRAGON",
    "chineseName": "黎风 (Lí Fēng)",
    "rarity": 6,
    "element": "Physical",
    "elementVi": "Vật Lý (Physical)",
    "elementColor": "#94a3b8",
    "role": "Guard",
    "roleVi": "Cận Chiến (Guard Striker)",
    "tier": "S",
    "avatar": "/avatars/endfield/lifeng.webp",
    "summary": "Võ sư thương thuật cự phách tộc Anasa. Khả năng hất ngã (Knock Down) và kích hoạt hiệu ứng Suy Giảm Vật Lý (Physical Susceptibility) liên tục cho toàn đội.",
    "ratings": {
      "singleTarget": 9.3,
      "aoe": 9,
      "support": 8.7,
      "synergy": 9.5,
      "contingencyContract": 9.4
    },
    "weapons": {
      "signature": {
        "name": "Gale Piercer Spear",
        "rarity": 6,
        "effect": "Tăng 22% Physical DMG. Mỗi đòn thương hất ngã mục tiêu giảm 20% giáp vật lý của kẻ địch trong 8s.",
        "tierNote": "Vũ khí tối ưu hóa chuỗi khống chế hất văng và phá giáp"
      },
      "alternatives": [
        {
          "name": "Heavy Alloy Polearm",
          "rarity": 5,
          "effect": "Tăng 15% ATK và tăng tỉ lệ hất ngã.",
          "performance": "85% hiệu năng trấn",
          "source": "Rèn AIC Công Xưởng"
        }
      ]
    },
    "gear": {
      "bestSet": {
        "name": "Bộ Phá Trận Thương Binh (Formation Breaker)",
        "pieces": "4 Mảnh Hợp Kim Trầm",
        "bonus": "2P: Physical DMG +15%. 4P: Tăng 25% DMG của toàn đội lên mục tiêu bị hất ngã hoặc khống chế.",
        "aicBlueprint": "AIC Blueprint Khu Quân Sự Cũ"
      }
    },
    "stats": {
      "mainStats": [
        "Thân: Tỉ Lệ Bạo Kích",
        "Chân: Physical DMG Bonus",
        "Găng: Nhanh Nhẹn (Agility)"
      ],
      "subStats": [
        "Agility",
        "Crit Rate",
        "Crit DMG",
        "Physical DMG%"
      ],
      "benchmarks": [
        {
          "label": "Tỉ lệ Bạo kích",
          "target": "60%+"
        },
        {
          "label": "Agility",
          "target": "750+"
        }
      ]
    },
    "skills": {
      "priority": [
        "Chiến Kỹ - Long Đằng Phá Trận",
        "Tuyệt Kỹ - Phong Hỏa Liệu Nguyên",
        "Combo Skill",
        "Đánh Thường"
      ],
      "masteryNotes": "Nâng Chiến Kỹ trước để giảm thời gian hồi chiêu hất ngã quái."
    },
    "comboMechanics": {
      "triggerCondition": "Mục tiêu bị hất tung hoặc phá vỡ thanh thăng bằng.",
      "appliedEffect": "Lao tới đâm thương liên hoàn và ghim chặt mục tiêu xuống đất.",
      "rotationTip": "Dùng Chen Qianyu hất tung -> Lifeng kích combo đập xuống đất -> Đội xả sát thương."
    },
    "bestTeams": [
      {
        "name": "Đội Hình Vật Lý Đè Bẹp (Physical Juggler Team)",
        "operators": [
          {
            "name": "Lifeng",
            "roleInTeam": "Sub DPS Khống Chế & Phá Giáp",
            "element": "Physical"
          },
          {
            "name": "Chen Qianyu",
            "roleInTeam": "Hất Tung & Mở Giao Tranh",
            "element": "Physical"
          },
          {
            "name": "Mi Fu",
            "roleInTeam": "Main Striker Nghiền Nát",
            "element": "Physical"
          },
          {
            "name": "Endministrator",
            "roleInTeam": "Hỗ Trợ Toàn Năng & CC",
            "element": "Physical"
          }
        ],
        "description": "Đội hình giữ quái và Boss trên không liên tục, không cho đối phương cơ hội trả đòn."
      }
    ],
    "externalLinks": {
      "prydwenUrl": "https://www.prydwen.gg/arknights-endfield/characters/lifeng"
    }
  },
  {
    "id": "liino",
    "name": "Liino",
    "codeName": "LIINO // RESONANT THUNDER",
    "chineseName": "梨诺 (Lí Nuò)",
    "rarity": 6,
    "element": "Electric",
    "elementVi": "Lôi Điện (Electric)",
    "elementColor": "#eab308",
    "role": "Supporter",
    "roleVi": "Hỗ Trợ (Supporter Healer & Amp)",
    "tier": "S+",
    "avatar": "/avatars/endfield/liino.webp",
    "summary": "Supporter hồi máu và khuếch đại điện trường đa năng số 1 hệ Lôi. Cung cấp chỉ số Amp sát thương khổng lồ và hồi phục sinh lực ổn định cho toàn đội.",
    "ratings": {
      "singleTarget": 7.2,
      "aoe": 8.8,
      "support": 9.9,
      "synergy": 9.8,
      "contingencyContract": 9.7
    },
    "weapons": {
      "signature": {
        "name": "Resonance Spire Polearm",
        "rarity": 6,
        "effect": "Tăng 20% Healing Bonus. Khi kích hoạt hồi máu, toàn đội nhận 25% Electric Amp trong 10s.",
        "tierNote": "Cốt lõi để biến các đội Lôi thành cỗ máy quét sạch sàn đấu"
      },
      "alternatives": [
        {
          "name": "Electrified Staff",
          "rarity": 5,
          "effect": "Tăng 15% Nạp Năng Lượng và tăng 12% hiệu quả hồi máu.",
          "performance": "87% hiệu năng trấn",
          "source": "Rèn AIC Công Xưởng"
        }
      ]
    },
    "gear": {
      "bestSet": {
        "name": "Bộ Âm Vang Sấm Sét (Thunder Echo)",
        "pieces": "4 Mảnh Sấm Sét",
        "bonus": "2P: Ý Chí (Will) +80. 4P: Khi dùng Tuyệt Kỹ, tăng 20% sát thương thuộc tính cho toàn đội.",
        "aicBlueprint": "AIC Blueprint Đài Thiên Văn"
      }
    },
    "stats": {
      "mainStats": [
        "Thân: Hiệu Quả Hồi Máu",
        "Chân: Nạp Năng Lượng SP",
        "Găng: Ý Chí (Will)"
      ],
      "subStats": [
        "Ý Chí (Will)",
        "Nạp SP",
        "HP%",
        "Kháng Sát Thương"
      ],
      "benchmarks": [
        {
          "label": "Ý Chí (Will)",
          "target": "800+"
        },
        {
          "label": "Hiệu suất Nạp SP",
          "target": "140%+"
        }
      ]
    },
    "skills": {
      "priority": [
        "Tuyệt Kỹ - Lôi Vân Hộ Thể",
        "Chiến Kỹ - Trị Liệu Từ Trường",
        "Combo Skill",
        "Đánh Thường"
      ],
      "masteryNotes": "Tập trung tối đa Tuyệt Kỹ và Chiến Kỹ để bảo đảm khả năng sống còn trong các phụ bản CC khó."
    },
    "comboMechanics": {
      "triggerCondition": "Đồng đội bị tụt dưới 70% máu hoặc kích hoạt Phản Ứng Điện Hóa (Electrify).",
      "appliedEffect": "Phóng ra luồng xung sét hồi phục 30% máu tối đa và gắn lôi thuẫn.",
      "rotationTip": "Giữ Liino làm chốt chặn an toàn phía sau, kích hoạt kỹ năng mỗi khi chuẩn bị vào pha bộc phá."
    },
    "bestTeams": [
      {
        "name": "Đội Hình Sấm Sét Vĩnh Cửu (Electric Hyper Team)",
        "operators": [
          {
            "name": "Liino",
            "roleInTeam": "Healer & Buff Điện Trường",
            "element": "Electric"
          },
          {
            "name": "Zhuang Fangyi",
            "roleInTeam": "Main Striker Điện Hóa",
            "element": "Electric"
          },
          {
            "name": "Perlica",
            "roleInTeam": "Caster Sốc Điện Phản Ứng",
            "element": "Electric"
          },
          {
            "name": "Avywenna",
            "roleInTeam": "Tiên Phong & Gán Ấn Lôi",
            "element": "Electric"
          }
        ],
        "description": "Đội hình Lôi chuẩn mực với sát thương liên tục và độ bền bỉ cực cao nhờ hồi phục của Liino."
      }
    ],
    "externalLinks": {
      "prydwenUrl": "https://www.prydwen.gg/arknights-endfield/characters/liino"
    }
  },
  {
    "id": "mi_fu",
    "name": "Mi Fu",
    "codeName": "MI FU // TITAN BREAKER",
    "chineseName": "弭弗 (Mǐ Fú)",
    "rarity": 6,
    "element": "Physical",
    "elementVi": "Vật Lý (Physical)",
    "elementColor": "#94a3b8",
    "role": "Guard",
    "roleVi": "Cận Chiến (Guard Armor Crusher)",
    "tier": "S+",
    "avatar": "/avatars/endfield/mi_fu.webp",
    "summary": "Chiến binh đại kiếm tộc Sarkaz với sức mạnh nghiền nát giáp sắt (Crush). Gây sát thương thanh thăng bằng quái vật cực lớn, đẩy Boss vào trạng thái Choáng Váng chỉ sau một chuỗi đòn.",
    "ratings": {
      "singleTarget": 9.7,
      "aoe": 9.2,
      "support": 7,
      "synergy": 9.4,
      "contingencyContract": 9.8
    },
    "weapons": {
      "signature": {
        "name": "Colossus Cleaver Greatsword",
        "rarity": 6,
        "effect": "Tăng 26% Physical DMG. Đòn đánh có 35% tỉ lệ gây hiệu ứng Đập Nát (Crush), tăng thêm 45% DMG lên mục tiêu bị choáng.",
        "tierNote": "Đại kiếm đập nát mọi lớp phòng thủ"
      },
      "alternatives": [
        {
          "name": "Breaker Greatsword",
          "rarity": 5,
          "effect": "Tăng 18% Sát thương Vật lý.",
          "performance": "84% hiệu năng trấn",
          "source": "Rèn AIC Công Xưởng"
        }
      ]
    },
    "gear": {
      "bestSet": {
        "name": "Bộ Phá Sơn Nghiền Nát (Titan Crush)",
        "pieces": "4 Mảnh Trọng Kích",
        "bonus": "2P: Sức Mạnh +75. 4P: Sát thương thanh thăng bằng +40%, sau khi phá vỡ giáp tăng 35% Crit DMG.",
        "aicBlueprint": "AIC Blueprint Vùng Mỏ Khoáng"
      }
    },
    "stats": {
      "mainStats": [
        "Thân: Tỉ Lệ Bạo Kích",
        "Chân: Physical DMG Bonus",
        "Găng: Sức Mạnh (Strength)"
      ],
      "subStats": [
        "Sức Mạnh (Strength)",
        "Crit DMG",
        "Crit Rate",
        "ATK%"
      ],
      "benchmarks": [
        {
          "label": "Sức Mạnh (Strength)",
          "target": "820+"
        },
        {
          "label": "Tỉ lệ Bạo kích",
          "target": "65%+"
        }
      ]
    },
    "skills": {
      "priority": [
        "Tuyệt Kỹ - Phá Thạch Kích",
        "Chiến Kỹ - Liệt Địa Trảm",
        "Combo Skill",
        "Đánh Thường"
      ],
      "masteryNotes": "Nâng tối đa Tuyệt Kỹ để xẻ đôi thanh máu Boss trong trạng thái Break."
    },
    "comboMechanics": {
      "triggerCondition": "Mục tiêu bị hất ngã hoặc rơi vào trạng thái dễ vỡ giáp.",
      "appliedEffect": "Bổ đại kiếm xuống đất tạo dư chấn gây 550% sát thương Vật lý diện rộng.",
      "rotationTip": "Kết hợp cùng Lifeng hoặc Pogranichnik để tận dụng tối đa thời gian phá giáp."
    },
    "bestTeams": [
      {
        "name": "Đội Hình Nghiền Nát Giáp Thép (Armor Sunder Team)",
        "operators": [
          {
            "name": "Mi Fu",
            "roleInTeam": "Main Guard Bổ Giáp",
            "element": "Physical"
          },
          {
            "name": "Pogranichnik",
            "roleInTeam": "Sạc Năng Lượng & Mở Giáp",
            "element": "Physical"
          },
          {
            "name": "Chen Qianyu",
            "roleInTeam": "Hất Tung Khống Chế",
            "element": "Physical"
          },
          {
            "name": "Ardelia",
            "roleInTeam": "Debuff Kháng & Trị Liệu",
            "element": "Nature"
          }
        ],
        "description": "Đội hình thuần đập giáp vượt qua các ải boss có chỉ số phòng ngự cực kỳ cao."
      }
    ],
    "externalLinks": {
      "prydwenUrl": "https://www.prydwen.gg/arknights-endfield/characters/mi-fu"
    }
  },
  {
    "id": "pogranichnik",
    "name": "Pogranichnik",
    "codeName": "POGRANICHNIK // BORDER FRONTIER",
    "chineseName": "波格拉尼奇尼克 (Bōgélā Níqí Níkè)",
    "rarity": 6,
    "element": "Physical",
    "elementVi": "Vật Lý (Physical)",
    "elementColor": "#94a3b8",
    "role": "Vanguard",
    "roleVi": "Tiên Phong (Vanguard SP Battery)",
    "tier": "S+",
    "avatar": "/avatars/endfield/pogranichnik.webp",
    "summary": "Chiến binh Biên giới tộc Liberi. Là trạm sạc SP tối thượng toàn năng cho mọi đội hình, hồi phục điểm kỹ năng với tốc độ nhanh nhất game và phá vỡ phòng tuyến địch.",
    "ratings": {
      "singleTarget": 8.8,
      "aoe": 9.1,
      "support": 9.8,
      "synergy": 9.9,
      "contingencyContract": 9.9
    },
    "weapons": {
      "signature": {
        "name": "Frontier Saber",
        "rarity": 6,
        "effect": "Tăng 20% Physical DMG. Mỗi đòn tấn công hồi 3 SP cho toàn đội, tăng 15% tốc độ nạp kỹ năng.",
        "tierNote": "Cốt lõi sạc SP biến mọi đội hình thành máy xả skill liên tục"
      },
      "alternatives": [
        {
          "name": "Border Patrol Blade",
          "rarity": 5,
          "effect": "Tăng 15% Nạp Năng Lượng SP.",
          "performance": "86% hiệu năng trấn",
          "source": "Rèn AIC Công Xưởng"
        }
      ]
    },
    "gear": {
      "bestSet": {
        "name": "Bộ Khúc Ca Biên Cương (Frontier Chant)",
        "pieces": "4 Mảnh Tiên Phong",
        "bonus": "2P: Nạp SP +20%. 4P: Khi bắt đầu trận hoặc dùng Tuyệt Kỹ, lập tức nạp 40 SP cho toàn đội.",
        "aicBlueprint": "AIC Blueprint Pháo Đài Cũ"
      }
    },
    "stats": {
      "mainStats": [
        "Thân: Tỉ Lệ Bạo Kích",
        "Chân: Hiệu Suất Nạp SP",
        "Găng: Ý Chí (Will)"
      ],
      "subStats": [
        "Hiệu Suất Nạp SP",
        "Ý Chí (Will)",
        "Crit Rate",
        "ATK%"
      ],
      "benchmarks": [
        {
          "label": "Hiệu suất Nạp SP",
          "target": "150%+"
        },
        {
          "label": "Ý Chí (Will)",
          "target": "780+"
        }
      ]
    },
    "skills": {
      "priority": [
        "Tuyệt Kỹ - Tiếng Còi Biên Giới",
        "Chiến Kỹ - Đột Kích Xung Phong",
        "Combo Skill",
        "Đánh Thường"
      ],
      "masteryNotes": "Tập trung tối đa Tuyệt Kỹ để rút ngắn thời gian luân chuyển kỹ năng của toàn đội."
    },
    "comboMechanics": {
      "triggerCondition": "Đồng đội dùng kỹ năng chiến kỹ bất kỳ.",
      "appliedEffect": "Lao tới chém đường kiếm mở đường, hồi 15 SP và phá vỡ 1 tầng giáp.",
      "rotationTip": "Bắt đầu trận đấu bằng Pogranichnik để lập tức bơm đầy bình SP cho dàn Striker xả đòn."
    },
    "bestTeams": [
      {
        "name": "Đội Hình Xả SP Liên Tục (Infinite Rotation Team)",
        "operators": [
          {
            "name": "Pogranichnik",
            "roleInTeam": "Battery Sạc Năng Lượng Chính",
            "element": "Physical"
          },
          {
            "name": "Mi Fu",
            "roleInTeam": "Main Striker Nghiền Nát",
            "element": "Physical"
          },
          {
            "name": "Rossi",
            "roleInTeam": "Sát Thương Bạo Kích Nhịp Cao",
            "element": "Physical"
          },
          {
            "name": "Ardelia",
            "roleInTeam": "Hồi Máu & Debuff Kháng",
            "element": "Nature"
          }
        ],
        "description": "Vận hành xoay tua kỹ năng không ngừng nghỉ nhờ lượng SP dồi dào từ Pogranichnik."
      }
    ],
    "externalLinks": {
      "prydwenUrl": "https://www.prydwen.gg/arknights-endfield/characters/pogranichnik"
    }
  },
  {
    "id": "rossi",
    "name": "Rossi",
    "codeName": "ROSSI // CRIMSON CRIT",
    "chineseName": "洛茜 (Luò Xī)",
    "rarity": 6,
    "element": "Physical",
    "elementVi": "Vật Lý (Physical)",
    "elementColor": "#94a3b8",
    "role": "Guard",
    "roleVi": "Cận Chiến (Guard Crit DPS)",
    "tier": "S+",
    "avatar": "/avatars/endfield/rossi.webp",
    "summary": "Kiếm khách tộc Lupo với lối đánh tốc độ cực cao và tỉ lệ chí mạng thiên bẩm. Sở trường nâng mục tiêu lên không trung (Lift) và kết liễu bằng chuỗi trảm kích dồn dập.",
    "ratings": {
      "singleTarget": 9.7,
      "aoe": 9,
      "support": 6.5,
      "synergy": 9.6,
      "contingencyContract": 9.6
    },
    "weapons": {
      "signature": {
        "name": "Crimson Fang Blade",
        "rarity": 6,
        "effect": "Tăng 25% Crit Rate và 30% Crit DMG khi chém mục tiêu đang bị hất tung trên không.",
        "tierNote": "Trấn bạo kích đưa sát thương của Rossi lên tầm cao mới"
      },
      "alternatives": [
        {
          "name": "Wolf Pack Rapier",
          "rarity": 5,
          "effect": "Tăng 18% Tỉ lệ Bạo kích.",
          "performance": "85% hiệu năng trấn",
          "source": "Rèn AIC Công Xưởng"
        }
      ]
    },
    "gear": {
      "bestSet": {
        "name": "Bộ Huyết Lang Trảm Kích (Crimson Wolf)",
        "pieces": "4 Mảnh Vuốt Sói",
        "bonus": "2P: Crit Rate +12%. 4P: Khi gây đòn chí mạng, tăng 4% Crit DMG (cộng dồn tối đa 10 tầng).",
        "aicBlueprint": "AIC Blueprint Rừng Rậm Talos-II"
      }
    },
    "stats": {
      "mainStats": [
        "Thân: Tỉ Lệ Bạo Kích",
        "Chân: Physical DMG Bonus",
        "Găng: Nhanh Nhẹn (Agility)"
      ],
      "subStats": [
        "Crit DMG",
        "Crit Rate",
        "Agility",
        "ATK%"
      ],
      "benchmarks": [
        {
          "label": "Tỉ lệ Bạo kích",
          "target": "75%+"
        },
        {
          "label": "Sát thương Bạo kích",
          "target": "200%+"
        },
        {
          "label": "Agility",
          "target": "820+"
        }
      ]
    },
    "skills": {
      "priority": [
        "Tuyệt Kỹ - Huyết Nguyệt Trảm",
        "Chiến Kỹ - Phong Cuồng Kiếm",
        "Combo Skill",
        "Đánh Thường"
      ],
      "masteryNotes": "Tập trung tối đa Tuyệt Kỹ và Chiến Kỹ để đạt lượng DPS dồn dập cao nhất."
    },
    "comboMechanics": {
      "triggerCondition": "Mục tiêu bị hất tung hoặc mất cân bằng.",
      "appliedEffect": "Nhảy vọt lên chém 8 nhát kiếm liên tiếp trên không trung.",
      "rotationTip": "Phối hợp với Chen Qianyu hoặc Lifeng hất tung mục tiêu để Rossi vào chuỗi combo trên không."
    },
    "bestTeams": [
      {
        "name": "Đội Hình Huyết Nguyệt Bạo Kích (Air Combo Crit Team)",
        "operators": [
          {
            "name": "Rossi",
            "roleInTeam": "Main Striker Tốc Độ & Crit",
            "element": "Physical"
          },
          {
            "name": "Chen Qianyu",
            "roleInTeam": "Hất Tung Khởi Đầu",
            "element": "Physical"
          },
          {
            "name": "Pogranichnik",
            "roleInTeam": "Sạc Năng Lượng Toàn Đội",
            "element": "Physical"
          },
          {
            "name": "Camille",
            "roleInTeam": "Hỗ Trợ Liên Kết & Tăng Tốc",
            "element": "Heat"
          }
        ],
        "description": "Tận dụng tuyệt đối sát thương chí mạng khi quái vật đang lơ lửng trên không trung."
      }
    ],
    "externalLinks": {
      "prydwenUrl": "https://www.prydwen.gg/arknights-endfield/characters/rossi"
    }
  },
  {
    "id": "tangtang",
    "name": "Tangtang",
    "codeName": "TANGTANG // FROSTBITE PRISM",
    "chineseName": "汤汤 (Tāng Tāng)",
    "rarity": 6,
    "element": "Cryo",
    "elementVi": "Băng Sương (Cryo)",
    "elementColor": "#38bdf8",
    "role": "Caster",
    "roleVi": "Pháp Sư (Cryo AoE Caster)",
    "tier": "S",
    "avatar": "/avatars/endfield/tangtang.webp",
    "summary": "Pháp sư súng ma pháp tộc Feline. Gây sát thương diện rộng và đóng băng toàn sân đấu, áp đặt hiệu ứng Dễ Tổn Thương Nguyên Tố Băng (Arts Susceptibility).",
    "ratings": {
      "singleTarget": 8.9,
      "aoe": 9.8,
      "support": 8.8,
      "synergy": 9.5,
      "contingencyContract": 9.5
    },
    "weapons": {
      "signature": {
        "name": "Frostbite Prism Cannon",
        "rarity": 6,
        "effect": "Tăng 24% Cryo DMG. Khi bắn trúng kẻ địch đóng băng, tạo vụ nổ băng lan tỏa gây 150% sát thương diện rộng.",
        "tierNote": "Khẩu súng càn quét quái đông đảo nhất hệ Băng"
      },
      "alternatives": [
        {
          "name": "Ice Crystal Blaster",
          "rarity": 5,
          "effect": "Tăng 16% AoE Arts DMG.",
          "performance": "85% hiệu năng trấn",
          "source": "Rèn AIC Công Xưởng"
        }
      ]
    },
    "gear": {
      "bestSet": {
        "name": "Bộ Lăng Kính Băng Giá (Glacial Prism)",
        "pieces": "4 Mảnh Hàn Tinh",
        "bonus": "2P: Cryo DMG +15%. 4P: Tăng 30% bán kính vùng ảnh hưởng của chiêu thức ma pháp.",
        "aicBlueprint": "AIC Blueprint Đỉnh Núi Tuyết"
      }
    },
    "stats": {
      "mainStats": [
        "Thân: Tỉ Lệ Bạo Kích",
        "Chân: Cryo DMG Bonus",
        "Găng: Nhanh Nhẹn (Agility)"
      ],
      "subStats": [
        "Agility",
        "Cryo DMG%",
        "Crit Rate",
        "Crit DMG"
      ],
      "benchmarks": [
        {
          "label": "Tỉ lệ Bạo kích",
          "target": "60%+"
        },
        {
          "label": "Agility",
          "target": "780+"
        }
      ]
    },
    "skills": {
      "priority": [
        "Tuyệt Kỹ - Hàn Băng Pháo",
        "Chiến Kỹ - Tia Chớp Băng Giá",
        "Combo Skill",
        "Đánh Thường"
      ],
      "masteryNotes": "Nâng Tuyệt Kỹ trước để tối đa hóa khả năng đóng băng cả phòng quái vật."
    },
    "comboMechanics": {
      "triggerCondition": "Kẻ địch bị trúng đòn Cryo từ đồng đội.",
      "appliedEffect": "Bắn loạt đạn lăng kính băng đóng băng toàn bộ kẻ địch trong phạm vi 8 mét.",
      "rotationTip": "Mở đầu đợt quái bằng Tangtang để gom và khống chế quái trước khi Last Rite xông vào."
    },
    "bestTeams": [
      {
        "name": "Đội Hình Băng Bão Toàn Sân (Blizzard AoE Team)",
        "operators": [
          {
            "name": "Tangtang",
            "roleInTeam": "AoE Cryo Caster Quét Sàn",
            "element": "Cryo"
          },
          {
            "name": "Last Rite",
            "roleInTeam": "Dứt Điểm Boss",
            "element": "Cryo"
          },
          {
            "name": "Xaihi",
            "roleInTeam": "Buff Sát Thương & Hồi Phục",
            "element": "Cryo"
          },
          {
            "name": "Perlica",
            "roleInTeam": "Kích Hoạt Phản Ứng Siêu Dẫn",
            "element": "Electric"
          }
        ],
        "description": "Khắc tinh số 1 của các màn chơi đông đảo quái vật và phụ bản phòng thủ AIC."
      }
    ],
    "externalLinks": {
      "prydwenUrl": "https://www.prydwen.gg/arknights-endfield/characters/tangtang"
    }
  },
  {
    "id": "yvonne",
    "name": "Yvonne",
    "codeName": "YVONNE // PERMAFROST SHOT",
    "chineseName": "伊冯 (Yī Féng)",
    "rarity": 6,
    "element": "Cryo",
    "elementVi": "Băng Sương (Cryo)",
    "elementColor": "#38bdf8",
    "role": "Striker",
    "roleVi": "Xung Kích (Striker Ranged Sniper)",
    "tier": "S+",
    "avatar": "/avatars/endfield/yvonne.webp",
    "summary": "Xạ thủ pháo tay tộc Vouivre. Gây sát thương tầm xa bạo kích cực lớn, gán ấn Đông Cứng (Solidify) chính xác từng phát bắn và khuếch đại sát thương vật lý lẫn nguyên tố.",
    "ratings": {
      "singleTarget": 9.8,
      "aoe": 9.1,
      "support": 7.2,
      "synergy": 9.7,
      "contingencyContract": 9.8
    },
    "weapons": {
      "signature": {
        "name": "Absolute Zero Handcannon",
        "rarity": 6,
        "effect": "Tăng 26% Cryo DMG. Mỗi phát bắn trúng điểm yếu tăng 12% Crit Rate (tối đa 3 tầng) và làm chậm 30%.",
        "tierNote": "Khẩu súng bắn tỉa điểm yếu mạnh nhất hệ Băng"
      },
      "alternatives": [
        {
          "name": "Precision Cryo Cannon",
          "rarity": 5,
          "effect": "Tăng 18% Sát thương Tầm xa.",
          "performance": "86% hiệu năng trấn",
          "source": "Rèn AIC Công Xưởng"
        }
      ]
    },
    "gear": {
      "bestSet": {
        "name": "Bộ Xạ Thủ Băng Điểm (Cryo Marksman)",
        "pieces": "4 Mảnh Kính Bắn Tỉa",
        "bonus": "2P: Intellect +80. 4P: Tăng 35% sát thương khi đứng cách mục tiêu từ 6 mét trở lên.",
        "aicBlueprint": "AIC Blueprint Tháp Canh Phía Bắc"
      }
    },
    "stats": {
      "mainStats": [
        "Thân: Tỉ Lệ Bạo Kích",
        "Chân: Cryo DMG Bonus",
        "Găng: Trí Lực (Intellect)"
      ],
      "subStats": [
        "Intellect",
        "Crit DMG",
        "Crit Rate",
        "Cryo DMG%"
      ],
      "benchmarks": [
        {
          "label": "Tỉ lệ Bạo kích",
          "target": "70%+"
        },
        {
          "label": "Sát thương Bạo kích",
          "target": "185%+"
        },
        {
          "label": "Intellect",
          "target": "800+"
        }
      ]
    },
    "skills": {
      "priority": [
        "Tuyệt Kỹ - Điểm Tuyệt Đối",
        "Chiến Kỹ - Đạn Đông Cứng",
        "Combo Skill",
        "Đánh Thường"
      ],
      "masteryNotes": "Nâng Tuyệt Kỹ tối đa để đạt lượng sốc sát thương tầm xa khủng khiếp."
    },
    "comboMechanics": {
      "triggerCondition": "Mục tiêu bị đóng băng hoặc bị làm chậm bởi đồng đội.",
      "appliedEffect": "Bắn phát đạn xuyên phá phá tan lớp giáp băng, gây 520% Cryo DMG bạo kích.",
      "rotationTip": "Giữ cự ly an toàn bắn hỗ trợ liên tục, kích hoạt combo để kết thúc quái tinh anh."
    },
    "bestTeams": [
      {
        "name": "Đội Hình Bắn Tỉa Băng Hàn (Permafrost Duo)",
        "operators": [
          {
            "name": "Yvonne",
            "roleInTeam": "Ranged Striker Tầm Xa",
            "element": "Cryo"
          },
          {
            "name": "Last Rite",
            "roleInTeam": "Melee Striker Cận Chiến",
            "element": "Cryo"
          },
          {
            "name": "Snowshine",
            "roleInTeam": "Defender Hấp Thụ Khiên",
            "element": "Cryo"
          },
          {
            "name": "Xaihi",
            "roleInTeam": "Supporter Tiếp Máu & Buff",
            "element": "Cryo"
          }
        ],
        "description": "Bộ đôi Yvonne tầm xa và Last Rite cận chiến bóp nghẹt mọi đối thủ với lượng băng sát vô song."
      }
    ],
    "externalLinks": {
      "prydwenUrl": "https://www.prydwen.gg/arknights-endfield/characters/yvonne"
    }
  },
  {
    "id": "alesh",
    "name": "Alesh",
    "codeName": "ALESH // FROST DRIFT",
    "chineseName": "阿列什 (Ālièshí)",
    "rarity": 5,
    "element": "Cryo",
    "elementVi": "Băng Sương (Cryo)",
    "elementColor": "#38bdf8",
    "role": "Vanguard",
    "roleVi": "Tiên Phong (Cryo Vanguard SP)",
    "tier": "A+",
    "avatar": "/avatars/endfield/alesh.webp",
    "summary": "Tiên phong kiếm thuật tộc Anaty. Hồi phục SP nhanh chóng đồng thời áp dụng hiệu ứng làm chậm và hóa cứng băng giá.",
    "ratings": {
      "singleTarget": 8.1,
      "aoe": 7.9,
      "support": 8.8,
      "synergy": 9,
      "contingencyContract": 8.7
    },
    "weapons": {
      "signature": {
        "name": "Glacier Needle Sword",
        "rarity": 5,
        "effect": "Tăng 16% Nạp SP và 12% Cryo DMG.",
        "tierNote": "Kiếm sạc SP chuẩn cho Vanguard 5★ hệ Băng"
      },
      "alternatives": [
        {
          "name": "Steel Patrol Blade",
          "rarity": 4,
          "effect": "Tăng 10% SP Recharge.",
          "performance": "82% hiệu năng",
          "source": "Rèn AIC"
        }
      ]
    },
    "gear": {
      "bestSet": {
        "name": "Bộ Tiên Phong Băng Giá (Cryo Pioneer)",
        "pieces": "4 Mảnh Giáp Nhẹ",
        "bonus": "2P: SP Recharge +15%. 4P: Tăng 20% sát thương đồng đội sau khi dùng kỹ năng.",
        "aicBlueprint": "AIC Blueprint Cấp 2"
      }
    },
    "stats": {
      "mainStats": [
        "Thân: Crit Rate",
        "Chân: SP Recharge",
        "Găng: Sức Mạnh"
      ],
      "subStats": [
        "SP Recharge",
        "Strength",
        "Cryo DMG%"
      ],
      "benchmarks": [
        {
          "label": "SP Recharge",
          "target": "135%+"
        }
      ]
    },
    "skills": {
      "priority": [
        "Chiến Kỹ - Băng Trảm",
        "Tuyệt Kỹ",
        "Combo Skill",
        "Đánh Thường"
      ],
      "masteryNotes": "Nâng Chiến Kỹ trước để tối ưu hóa lượng SP sinh ra."
    },
    "comboMechanics": {
      "triggerCondition": "Đồng đội tấn công kẻ địch bị làm chậm.",
      "appliedEffect": "Chém nhát kiếm băng giá hồi 12 SP.",
      "rotationTip": "Dùng Alesh mở đầu để tạo lợi thế năng lượng cho cả đội."
    },
    "bestTeams": [
      {
        "name": "Đội Băng Tân Thủ / F2P",
        "operators": [
          {
            "name": "Alesh",
            "roleInTeam": "Sạc SP Tiên Phong",
            "element": "Cryo"
          },
          {
            "name": "Snowshine",
            "roleInTeam": "Hộ Vệ Khiên Băng",
            "element": "Cryo"
          },
          {
            "name": "Perlica",
            "roleInTeam": "Sát Thương Phép",
            "element": "Electric"
          },
          {
            "name": "Wulfgard",
            "roleInTeam": "DPS Bộc Phá",
            "element": "Heat"
          }
        ],
        "description": "Đội hình dễ tiếp cận cho người chơi mới với lượng hồi SP dồi dào từ Alesh."
      }
    ],
    "externalLinks": {
      "prydwenUrl": "https://www.prydwen.gg/arknights-endfield/characters/alesh"
    }
  },
  {
    "id": "arclight",
    "name": "Arclight",
    "codeName": "ARCLIGHT // FLASH STEP",
    "chineseName": "弧光 (Hú Guāng)",
    "rarity": 5,
    "element": "Electric",
    "elementVi": "Lôi Điện (Electric)",
    "elementColor": "#eab308",
    "role": "Vanguard",
    "roleVi": "Tiên Phong (Electric Vanguard SP)",
    "tier": "A+",
    "avatar": "/avatars/endfield/arclight.webp",
    "summary": "Kiếm sĩ tộc Kuranta với tốc độ di chuyển như tia chớp. Đột kích và sạc SP thần tốc đồng thời tạo ấn Điện Hóa (Electrify) cho đối thủ.",
    "ratings": {
      "singleTarget": 8.3,
      "aoe": 8,
      "support": 8.9,
      "synergy": 9.2,
      "contingencyContract": 8.8
    },
    "weapons": {
      "signature": {
        "name": "Thunderflash Rapier",
        "rarity": 5,
        "effect": "Tăng 18% Tốc độ đánh và 15% Nạp SP.",
        "tierNote": "Vũ khí chớp giật tốc độ cao"
      },
      "alternatives": [
        {
          "name": "Alloy Sabre",
          "rarity": 4,
          "effect": "Tăng 10% ATK.",
          "performance": "80% hiệu năng",
          "source": "Rèn AIC"
        }
      ]
    },
    "gear": {
      "bestSet": {
        "name": "Bộ Tia Chớp Tốc Hành (Flash Dash)",
        "pieces": "4 Mảnh Tốc Độ",
        "bonus": "2P: Tốc độ di chuyển +15%. 4P: Khi lướt trúng đích, hồi ngay 10 SP.",
        "aicBlueprint": "AIC Blueprint Cấp 2"
      }
    },
    "stats": {
      "mainStats": [
        "Thân: Crit Rate",
        "Chân: SP Recharge",
        "Găng: Agility"
      ],
      "subStats": [
        "Agility",
        "SP Recharge",
        "Crit Rate"
      ],
      "benchmarks": [
        {
          "label": "Agility",
          "target": "700+"
        }
      ]
    },
    "skills": {
      "priority": [
        "Chiến Kỹ - Thiểm Điện Kích",
        "Tuyệt Kỹ",
        "Combo Skill",
        "Đánh Thường"
      ],
      "masteryNotes": "Ưu tiên Chiến Kỹ để duy trì khả năng lướt và tạo điện trường."
    },
    "comboMechanics": {
      "triggerCondition": "Mục tiêu bị dính sát thương Lôi.",
      "appliedEffect": "Lướt xuyên người mục tiêu và để lại vệt sét gây sát thương liên tục.",
      "rotationTip": "Kết hợp cùng Perlica và Avywenna để tạo chuỗi sấm sét liên hoàn."
    },
    "bestTeams": [
      {
        "name": "Đội Hình Tốc Chiến Hệ Lôi",
        "operators": [
          {
            "name": "Arclight",
            "roleInTeam": "Mở Đường & Sạc SP",
            "element": "Electric"
          },
          {
            "name": "Avywenna",
            "roleInTeam": "Xung Kích Đột Kích",
            "element": "Electric"
          },
          {
            "name": "Perlica",
            "roleInTeam": "Sốc Điện AoE",
            "element": "Electric"
          },
          {
            "name": "Liino",
            "roleInTeam": "Hồi Phục & Buff",
            "element": "Electric"
          }
        ],
        "description": "Vận động với tốc độ cực cao, liên tục sạc năng lượng và phóng điện toàn bản đồ."
      }
    ],
    "externalLinks": {
      "prydwenUrl": "https://www.prydwen.gg/arknights-endfield/characters/arclight"
    }
  },
  {
    "id": "da_pan",
    "name": "Da Pan",
    "codeName": "DA PAN // IRON BRAWLER",
    "chineseName": "大潘 (Dà Pān)",
    "rarity": 5,
    "element": "Physical",
    "elementVi": "Vật Lý (Physical)",
    "elementColor": "#94a3b8",
    "role": "Striker",
    "roleVi": "Xung Kích (Physical Heavy Brawler)",
    "tier": "A+",
    "avatar": "/avatars/endfield/da_pan.webp",
    "summary": "Chiến binh gấu dũng mãnh tộc Ursus. Sử dụng đại kiếm vung đập uy lực kinh hồn, hất văng mục tiêu và nghiền nát thanh thăng bằng quái vật.",
    "ratings": {
      "singleTarget": 8.9,
      "aoe": 8.6,
      "support": 6.8,
      "synergy": 8.9,
      "contingencyContract": 9
    },
    "weapons": {
      "signature": {
        "name": "Ursus Heavy Iron Cleaver",
        "rarity": 5,
        "effect": "Tăng 20% Physical DMG và tăng 25% sát thương đập đất.",
        "tierNote": "Vũ khí chém uy lực tối đa cho Da Pan"
      },
      "alternatives": [
        {
          "name": "Steel Sledge Greatsword",
          "rarity": 4,
          "effect": "Tăng 12% ATK.",
          "performance": "82% hiệu năng",
          "source": "Rèn AIC"
        }
      ]
    },
    "gear": {
      "bestSet": {
        "name": "Bộ Cường Lực Hùng Binh (Ursus Might)",
        "pieces": "4 Mảnh Trọng Binh",
        "bonus": "2P: Strength +60. 4P: Tăng 25% sát thương khi mục tiêu bị hất ngã hoặc đập xuống đất.",
        "aicBlueprint": "AIC Blueprint Vùng Núi Đá"
      }
    },
    "stats": {
      "mainStats": [
        "Thân: Crit Rate",
        "Chân: Physical DMG",
        "Găng: Sức Mạnh (Strength)"
      ],
      "subStats": [
        "Strength",
        "Crit Rate",
        "Crit DMG",
        "ATK%"
      ],
      "benchmarks": [
        {
          "label": "Strength",
          "target": "750+"
        }
      ]
    },
    "skills": {
      "priority": [
        "Tuyệt Kỹ - Hùng Phong Phách",
        "Chiến Kỹ - Cuồng Bạo Chấn",
        "Combo Skill",
        "Đánh Thường"
      ],
      "masteryNotes": "Nâng Tuyệt Kỹ trước để tối đa hóa cú đập diện rộng dứt điểm."
    },
    "comboMechanics": {
      "triggerCondition": "Mục tiêu bị hất ngã hoặc mất thăng bằng.",
      "appliedEffect": "Bổ đại kiếm từ trên cao xuống nghiền nát kẻ thù.",
      "rotationTip": "Dùng Chen Qianyu hất tung trước rồi Da Pan vào đập xuống đất."
    },
    "bestTeams": [
      {
        "name": "Đội Hình Húc Đổ Phá Giáp",
        "operators": [
          {
            "name": "Da Pan",
            "roleInTeam": "DPS Va Đập & Bổ Giáp",
            "element": "Physical"
          },
          {
            "name": "Chen Qianyu",
            "roleInTeam": "Hất Tung Khống Chế",
            "element": "Physical"
          },
          {
            "name": "Endministrator",
            "roleInTeam": "Hỗ Trợ & Cắt Giáp",
            "element": "Physical"
          },
          {
            "name": "Ardelia",
            "roleInTeam": "Hồi Máu & Giảm Kháng",
            "element": "Nature"
          }
        ],
        "description": "Đội hình vật lý dũng mãnh đập nát mọi chướng ngại vật trên đường đi."
      }
    ],
    "externalLinks": {
      "prydwenUrl": "https://www.prydwen.gg/arknights-endfield/characters/da-pan"
    }
  },
  {
    "id": "snowshine",
    "name": "Snowshine",
    "codeName": "SNOWSHINE // POLAR SHIELD",
    "chineseName": "昼雪 (Zhòuxuě)",
    "rarity": 5,
    "element": "Cryo",
    "elementVi": "Băng Sương (Cryo)",
    "elementColor": "#38bdf8",
    "role": "Defender",
    "roleVi": "Hộ Vệ (Cryo Defender Tank)",
    "tier": "S",
    "avatar": "/avatars/endfield/snowshine.webp",
    "summary": "Hộ vệ tộc Ursus mang đại khiên băng vĩnh cửu. Hấp thụ lượng sát thương khổng lồ cho đồng đội, tạo khiên chắn Băng và hồi phục sinh lực tại trận địa.",
    "ratings": {
      "singleTarget": 6.5,
      "aoe": 7.2,
      "support": 9.6,
      "synergy": 9.7,
      "contingencyContract": 9.8
    },
    "weapons": {
      "signature": {
        "name": "Polar Greatshield Blade",
        "rarity": 5,
        "effect": "Tăng 22% DEF và tạo khiên hấp thụ bằng 20% máu tối đa cho toàn đội khi dùng kỹ năng.",
        "tierNote": "Lá chắn bất khả xâm phạm cho hệ Băng"
      },
      "alternatives": [
        {
          "name": "Heavy Defense Sunder",
          "rarity": 4,
          "effect": "Tăng 14% DEF.",
          "performance": "85% hiệu năng",
          "source": "Rèn AIC"
        }
      ]
    },
    "gear": {
      "bestSet": {
        "name": "Bộ Pháo Đài Băng Giá (Glacial Fortress)",
        "pieces": "4 Mảnh Giáp Băng",
        "bonus": "2P: DEF +20%. 4P: Khi có khiên, toàn đội tăng 15% kháng nguyên tố và miễn nhiễm gián đoạn.",
        "aicBlueprint": "AIC Blueprint Thung Lũng Tuyết"
      }
    },
    "stats": {
      "mainStats": [
        "Thân: DEF%",
        "Chân: HP%",
        "Găng: Sức Mạnh (Strength)"
      ],
      "subStats": [
        "DEF%",
        "HP%",
        "Kháng Sát Thương",
        "Strength"
      ],
      "benchmarks": [
        {
          "label": "Phòng Ngự (DEF)",
          "target": "1200+"
        }
      ]
    },
    "skills": {
      "priority": [
        "Tuyệt Kỹ - Cực Địa Băng Thuẫn",
        "Chiến Kỹ - Khiên Băng Khiêu Khích",
        "Combo Skill",
        "Đánh Thường"
      ],
      "masteryNotes": "Tối đa Tuyệt Kỹ và Chiến Kỹ để duy trì khiên bảo hộ liên tục."
    },
    "comboMechanics": {
      "triggerCondition": "Đồng đội nhận sát thương nặng hoặc bị Boss nhắm tới.",
      "appliedEffect": "Lao tới che chắn, khiêu khích quái và tạo khiên băng dày cho cả đội.",
      "rotationTip": "Kích hoạt Snowshine trước những đòn tất sát diện rộng của Boss để bảo vệ an toàn cho chủ lực."
    },
    "bestTeams": [
      {
        "name": "Đội Băng Phòng Thủ Tuyệt Đối",
        "operators": [
          {
            "name": "Snowshine",
            "roleInTeam": "Tanker Che Chắn Khiên Băng",
            "element": "Cryo"
          },
          {
            "name": "Last Rite",
            "roleInTeam": "Main Striker Tiêu Diệt Boss",
            "element": "Cryo"
          },
          {
            "name": "Xaihi",
            "roleInTeam": "Healer Tiếp Ứng",
            "element": "Cryo"
          },
          {
            "name": "Yvonne",
            "roleInTeam": "Xạ Thủ Bắn Tỉa",
            "element": "Cryo"
          }
        ],
        "description": "Bất tử trước mọi lượng sát thương bộc phát trong các ải Contingency Contract khó nhất."
      }
    ],
    "externalLinks": {
      "prydwenUrl": "https://www.prydwen.gg/arknights-endfield/characters/snowshine"
    }
  },
  {
    "id": "antal",
    "name": "Antal",
    "codeName": "ANTAL // STATIC CURRENT",
    "chineseName": "安塔尔 (Āntǎ'ěr)",
    "rarity": 4,
    "element": "Electric",
    "elementVi": "Lôi Điện (Electric)",
    "elementColor": "#eab308",
    "role": "Supporter",
    "roleVi": "Hỗ Trợ (Electric Supporter Debuffer)",
    "tier": "A",
    "avatar": "/avatars/endfield/antal.webp",
    "summary": "Học giả tộc Savra. Thiết bị ma pháp của Antal tạo ra dòng điện tĩnh làm giảm mạnh kháng nguyên tố của kẻ địch và khuếch đại sát thương đồng đội.",
    "ratings": {
      "singleTarget": 7,
      "aoe": 7.5,
      "support": 8.9,
      "synergy": 9,
      "contingencyContract": 8.4
    },
    "weapons": {
      "signature": {
        "name": "Static Core Unit",
        "rarity": 4,
        "effect": "Tăng 12% Electric Amp cho toàn đội.",
        "tierNote": "Pháp khí hỗ trợ phổ thông dễ rèn"
      },
      "alternatives": []
    },
    "gear": {
      "bestSet": {
        "name": "Bộ Truyền Dẫn Điện Từ",
        "pieces": "4 Mảnh Hỗ Trợ",
        "bonus": "2P: Intellect +50. 4P: Giảm 15% kháng Lôi của kẻ địch dính chiêu.",
        "aicBlueprint": "AIC Blueprint Cấp 1"
      }
    },
    "stats": {
      "mainStats": [
        "Thân: Intellect",
        "Chân: Nạp SP",
        "Găng: HP%"
      ],
      "subStats": [
        "Intellect",
        "SP Recharge"
      ],
      "benchmarks": [
        {
          "label": "Intellect",
          "target": "600+"
        }
      ]
    },
    "skills": {
      "priority": [
        "Chiến Kỹ",
        "Tuyệt Kỹ",
        "Combo Skill",
        "Đánh Thường"
      ],
      "masteryNotes": "Nâng Chiến Kỹ để duy trì bùa giảm kháng cho chủ lực xả đòn."
    },
    "comboMechanics": {
      "triggerCondition": "Đồng đội đánh trúng mục tiêu dính ấn Lôi.",
      "appliedEffect": "Phóng ra tia sét phụ giảm 10% phòng ngự kẻ địch.",
      "rotationTip": "Dùng đầu giao tranh để debuff quái trước khi chủ lực tung chiêu."
    },
    "bestTeams": [
      {
        "name": "Đội Hình Lôi Tân Thủ F2P",
        "operators": [
          {
            "name": "Antal",
            "roleInTeam": "Hỗ Trợ Debuff Giảm Kháng",
            "element": "Electric"
          },
          {
            "name": "Perlica",
            "roleInTeam": "Main DPS Sét Đánh",
            "element": "Electric"
          },
          {
            "name": "Avywenna",
            "roleInTeam": "Tiên Phong",
            "element": "Electric"
          },
          {
            "name": "Catcher",
            "roleInTeam": "Hộ Vệ Che Chắn",
            "element": "Physical"
          }
        ],
        "description": "Đội hình miễn phí cho người chơi mới bắt đầu làm quen với phản ứng hệ Lôi."
      }
    ],
    "externalLinks": {
      "prydwenUrl": "https://www.prydwen.gg/arknights-endfield/characters/antal"
    }
  },
  {
    "id": "catcher",
    "name": "Catcher",
    "codeName": "CATCHER // STEADFAST GUARD",
    "chineseName": "卡契尔 (Kǎqì'ěr)",
    "rarity": 4,
    "element": "Physical",
    "elementVi": "Vật Lý (Physical)",
    "elementColor": "#94a3b8",
    "role": "Defender",
    "roleVi": "Hộ Vệ (Physical Defender Tank)",
    "tier": "A",
    "avatar": "/avatars/endfield/catcher.webp",
    "summary": "Vệ sĩ kiên định tộc Perro. Hộ vệ đại khiên phòng ngự vững chắc, thu hút hỏa lực và giảm sát thương nhận vào cho các thành viên yếu máu.",
    "ratings": {
      "singleTarget": 6,
      "aoe": 6.8,
      "support": 8.8,
      "synergy": 8.7,
      "contingencyContract": 8.5
    },
    "weapons": {
      "signature": {
        "name": "Guard Greatshield",
        "rarity": 4,
        "effect": "Tăng 18% DEF cơ bản.",
        "tierNote": "Lá chắn cơ bản bảo hộ đầu game"
      },
      "alternatives": []
    },
    "gear": {
      "bestSet": {
        "name": "Bộ Giáp Hộ Vệ Kiên Cố",
        "pieces": "4 Mảnh Thép Gai",
        "bonus": "2P: DEF +15%. 4P: Giảm 20% sát thương khi đứng che chắn cho đồng đội.",
        "aicBlueprint": "AIC Blueprint Cấp 1"
      }
    },
    "stats": {
      "mainStats": [
        "Thân: DEF%",
        "Chân: HP%",
        "Găng: Sức Mạnh"
      ],
      "subStats": [
        "DEF%",
        "HP%"
      ],
      "benchmarks": [
        {
          "label": "DEF",
          "target": "900+"
        }
      ]
    },
    "skills": {
      "priority": [
        "Chiến Kỹ - Che Chắn",
        "Tuyệt Kỹ - Khiên Thép",
        "Combo Skill",
        "Đánh Thường"
      ],
      "masteryNotes": "Tập trung nâng cấp khả năng chịu đòn và tạo giáp."
    },
    "comboMechanics": {
      "triggerCondition": "Đồng đội bị quái tấn công dồn dập.",
      "appliedEffect": "Lao vào đỡ đòn và hất lùi kẻ thù.",
      "rotationTip": "Bật khiên bảo vệ chủ lực xả kỹ năng an toàn."
    },
    "bestTeams": [
      {
        "name": "Đội Hình Phòng Thủ Cơ Bản",
        "operators": [
          {
            "name": "Catcher",
            "roleInTeam": "Tanker Hút Đòn",
            "element": "Physical"
          },
          {
            "name": "Endministrator",
            "roleInTeam": "Chiến Đấu Chính",
            "element": "Physical"
          },
          {
            "name": "Chen Qianyu",
            "roleInTeam": "Khống Chế",
            "element": "Physical"
          },
          {
            "name": "Perlica",
            "roleInTeam": "Pháp Sư Tầm Xa",
            "element": "Electric"
          }
        ],
        "description": "Đội hình vượt cốt truyện chương đầu an toàn cho tân thủ."
      }
    ],
    "externalLinks": {
      "prydwenUrl": "https://www.prydwen.gg/arknights-endfield/characters/catcher"
    }
  },
  {
    "id": "estella",
    "name": "Estella",
    "codeName": "ESTELLA // FROST PIKE",
    "chineseName": "艾丝特拉 (Àisītélā)",
    "rarity": 4,
    "element": "Cryo",
    "elementVi": "Băng Sương (Cryo)",
    "elementColor": "#38bdf8",
    "role": "Guard",
    "roleVi": "Cận Chiến (Cryo Guard Juggler)",
    "tier": "A",
    "avatar": "/avatars/endfield/estella.webp",
    "summary": "Chiến binh thương thuật tộc Feline. Gây sát thương Băng liên hoàn kết hợp hất tung đối thủ, tạo tiền đề cho các phản ứng nguyên tố tiếp theo.",
    "ratings": {
      "singleTarget": 7.8,
      "aoe": 7.4,
      "support": 7.9,
      "synergy": 8.6,
      "contingencyContract": 8.2
    },
    "weapons": {
      "signature": {
        "name": "Frost Feather Spear",
        "rarity": 4,
        "effect": "Tăng 14% Cryo DMG và tăng tỉ lệ hất tung.",
        "tierNote": "Cây thương băng nhẹ nhàng linh hoạt"
      },
      "alternatives": []
    },
    "gear": {
      "bestSet": {
        "name": "Bộ Thương Thủ Băng Sương",
        "pieces": "4 Mảnh Băng Nhẹ",
        "bonus": "2P: Cryo DMG +10%. 4P: Tăng 15% sát thương lên kẻ địch trên không.",
        "aicBlueprint": "AIC Blueprint Cấp 1"
      }
    },
    "stats": {
      "mainStats": [
        "Thân: Crit Rate",
        "Chân: Cryo DMG",
        "Găng: Will"
      ],
      "subStats": [
        "Will",
        "Cryo DMG%",
        "Crit Rate"
      ],
      "benchmarks": [
        {
          "label": "Will",
          "target": "650+"
        }
      ]
    },
    "skills": {
      "priority": [
        "Chiến Kỹ - Băng Thương Hất Tung",
        "Tuyệt Kỹ",
        "Combo Skill",
        "Đánh Thường"
      ],
      "masteryNotes": "Ưu tiên Chiến Kỹ để duy trì khả năng khống chế trên không."
    },
    "comboMechanics": {
      "triggerCondition": "Mục tiêu bị đóng băng hoặc làm chậm.",
      "appliedEffect": "Đâm thương hất tung kẻ địch lên không trung.",
      "rotationTip": "Dùng Estella hất tung để kích hoạt combo của đồng đội."
    },
    "bestTeams": [
      {
        "name": "Đội Băng Không Chiến F2P",
        "operators": [
          {
            "name": "Estella",
            "roleInTeam": "Hất Tung & Gán Cryo",
            "element": "Cryo"
          },
          {
            "name": "Chen Qianyu",
            "roleInTeam": "Nối Đòn Không Gian",
            "element": "Physical"
          },
          {
            "name": "Perlica",
            "roleInTeam": "Pháp Thuật",
            "element": "Electric"
          },
          {
            "name": "Xaihi",
            "roleInTeam": "Hồi Phục",
            "element": "Cryo"
          }
        ],
        "description": "Đội hình giữ quái trên không giá rẻ dễ xây dựng."
      }
    ],
    "externalLinks": {
      "prydwenUrl": "https://www.prydwen.gg/arknights-endfield/characters/estella"
    }
  },
  {
    "id": "fluorite",
    "name": "Fluorite",
    "codeName": "FLUORITE // NATURE SHOT",
    "chineseName": "萤石 (Yíngshí)",
    "rarity": 4,
    "element": "Nature",
    "elementVi": "Tự Nhiên (Nature)",
    "elementColor": "#22c55e",
    "role": "Caster",
    "roleVi": "Pháp Sư (Nature Poison Caster)",
    "tier": "A",
    "avatar": "/avatars/endfield/fluorite.webp",
    "summary": "Xạ thủ súng hoa ma pháp tộc Phidia. Bắn ra các bào tử tự nhiên gây hiệu ứng Ăn Mòn (Corrode) và độc tố dây chuyền liên tục.",
    "ratings": {
      "singleTarget": 7.9,
      "aoe": 8.2,
      "support": 7.8,
      "synergy": 8.8,
      "contingencyContract": 8.3
    },
    "weapons": {
      "signature": {
        "name": "Spore Handcannon",
        "rarity": 4,
        "effect": "Tăng 14% Nature DMG và tăng 20% sát thương độc ăn mòn.",
        "tierNote": "Khẩu pháo bào tử độc Nature"
      },
      "alternatives": []
    },
    "gear": {
      "bestSet": {
        "name": "Bộ Bào Tử Rừng Xanh",
        "pieces": "4 Mảnh Rừng Rậm",
        "bonus": "2P: Nature DMG +10%. 4P: Tăng 20% thời gian duy trì của độc ăn mòn.",
        "aicBlueprint": "AIC Blueprint Cấp 1"
      }
    },
    "stats": {
      "mainStats": [
        "Thân: Crit Rate",
        "Chân: Nature DMG",
        "Găng: Agility"
      ],
      "subStats": [
        "Agility",
        "Nature DMG%",
        "Crit Rate"
      ],
      "benchmarks": [
        {
          "label": "Agility",
          "target": "650+"
        }
      ]
    },
    "skills": {
      "priority": [
        "Chiến Kỹ - Bắn Bào Tử Độc",
        "Tuyệt Kỹ",
        "Combo Skill",
        "Đánh Thường"
      ],
      "masteryNotes": "Ưu tiên Chiến Kỹ để duy trì tối đa tầng độc Corrode."
    },
    "comboMechanics": {
      "triggerCondition": "Kẻ địch bị dính hiệu ứng Nature.",
      "appliedEffect": "Kích nổ bào tử gây sát thương lan cho các mục tiêu xung quanh.",
      "rotationTip": "Kết hợp cùng Ardelia hoặc Arcane để kích nổ chuỗi phản ứng Nature."
    },
    "bestTeams": [
      {
        "name": "Đội Tự Nhiên Ăn Mòn",
        "operators": [
          {
            "name": "Fluorite",
            "roleInTeam": "Rải Bào Tử Độc",
            "element": "Nature"
          },
          {
            "name": "Ardelia",
            "roleInTeam": "Khuếch Đại Ăn Mòn",
            "element": "Nature"
          },
          {
            "name": "Arcane",
            "roleInTeam": "Main Caster Trừ Kháng",
            "element": "Nature"
          },
          {
            "name": "Catcher",
            "roleInTeam": "Hộ Vệ Đỡ Đòn",
            "element": "Physical"
          }
        ],
        "description": "Đội hình rút máu quái vật theo thời gian bằng độc tính ăn mòn liên tục."
      }
    ],
    "externalLinks": {
      "prydwenUrl": "https://www.prydwen.gg/arknights-endfield/characters/fluorite"
    }
  }
];
