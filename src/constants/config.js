/**
 * 配置相关常量
 */

// 人设预设值
export const PRESET_AI_PERSONA = [
  {
    name: '通用人设',
    value: [
      '你是一个社交媒体助手，擅长为小红书帖子生成有价值的评论。',
      '你的任务是生成友好、真实、有趣、能引起共鸣的评论，以增强帖子的互动性。请遵循以下规则：',
      '·语言风格: 口语化、带点幽默，符合小红书社区风格，可适当使用表情包（如💡👍）',
      '·禁止行为:',
      '  - 不编造虚假信息',
      '  - 不带#话题标签',
      '  - 评论要自然，不要过多透露出做广告的嫌疑',
      '·格式: 纯文本，仅包含我可以用来直接评论的完整内容',
      '·长度: 20-50字为宜，简洁有力，不超过144个字',
    ].join('\n'),
  },
  {
    name: '二手车懂车妹',
    value: [
      '你是一个小红书风格的二手车评论助手，擅长为小红书帖子生成有价值的评论。',
      '你的任务是生成友好、真实、易懂的评论，帮助用户了解二手车市场。请遵循以下规则：',
      '·语言风格: 口语化、带点幽默，符合小红书社区风格，可适当使用表情包（如🚗💡👍）',
      '·内容方向:',
      '  - 指出车辆优缺点（如“这车省油，但后排空间小，适合单身或小两口”）',
      '  - 提供砍价建议（如“这车挂牌价偏高，建议照着8折砍”）',
      '  - 提醒避坑点（如“一定要查维保记录，避免事故车！”）',
      '·禁止行为:',
      '  - 不编造虚假信息',
      '  - 不带#话题标签',
      '  - 不推荐具体车商（保持中立）',
      '·格式: 纯文本，仅包含我可以用来直接评论的完整内容',
      '·长度: 20-50字为宜，简洁有力，不超过144个字',
    ].join('\n'),
  },
];

// 默认配置
export const DEFAULT_CONFIG = {
  aiPersona: PRESET_AI_PERSONA[0].value,
  models: [
    {
      name: 'GPT-4o',
      value: 'gpt-4o',
      apiKey: '',
      url: 'https://api.openai.com/v1/chat/completions',
      isSelected: false,
    },
    {
      name: '阿里千问',
      value: 'qwen-vl-plus',
      apiKey: '',
      url: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
      isSelected: false,
    },
  ],
  filterEnabled: false,
  minComments: 100,
};

// 配置key
export const CONFIG_KEY = 'xhs-comment-assistant-config';

// 获取当前配置
export async function getConfig() {
  return new Promise(resolve => {
    chrome.storage.sync.get([CONFIG_KEY], function (result) {
      resolve(result[CONFIG_KEY] || DEFAULT_CONFIG);
    });
  });
}

// 保存配置
export async function saveConfig(config) {
  return new Promise(resolve => {
    chrome.storage.sync.set({ [CONFIG_KEY]: config }, function () {
      resolve();
    });
  });
}

// 重置配置
export async function resetConfig() {
  return new Promise(resolve => {
    chrome.storage.sync.set({ [CONFIG_KEY]: DEFAULT_CONFIG }, function () {
      resolve();
    });
  });
}

// 取一个可用模型
export async function getAvailableModel() {
  try {
    const { models } = await getConfig();
    const arr = models.filter(item => item.isSelected);
    // 随机返回一个用模型
    return arr[Math.floor(Math.random() * arr.length)];
  } catch (error) {
    console.error('[getAvailableModel]error', error);
    return Promise.reject(new Error('没有可用模型'));
  }
}
