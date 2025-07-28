console.log('[background]加载成功');

import { getConfig, getAvailableModel } from '../constants/config';

// 这里需要替换为你实际的 AI API 调用逻辑
async function callAIApi(prompt) {
  const { title, date, content, images = [] } = prompt;
  const config = await getConfig();

  try {
    // 取一个可用模型
    const model = await getAvailableModel();
    if (!model) {
      return Promise.reject(new Error('没有可用模型'));
    }
    console.log('[callAIApi]model', model);
    const question = [
      '请根据以下小红书帖子内容生成一条合适的评论（不要带任何 #话题 标签）:\n\n',
      date ? `帖子日期：${date}` : '',
      images && images.length > 0 ? '帖子配图请参考图片信息' : '',
      `帖子文字内容如下：`,
      title ? `${title}\n${content}\n` : content,
    ].join('\n');
    const imagesContent = images.map(image => {
      return { type: 'image_url', image_url: { url: image } };
    });

    const response = await fetch(model.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${model.apiKey}`,
      },
      body: JSON.stringify({
        model: model.value,
        messages: [
          {
            role: 'system',
            content: config.aiPersona, // 人设（取配置）
          },
          {
            role: 'user',
            content: [...imagesContent, { type: 'text', text: question }],
          },
        ],
        temperature: 0.7,
        max_tokens: 4096, // 0 ~ 8192
      }),
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error.message);
    }
    // 移除所有 #话题
    return {
      comment: data.choices?.[0]?.message?.content?.replace(/#\S+/g, '')?.trim() || '',
      model,
    };
  } catch (error) {
    console.error('AI API调用失败:', error);
    throw error;
  }
}

// 监听来自内容脚本的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('[background]收到消息', request);
  if (request.action === 'generateComment') {
    callAIApi(request.content)
      .then(({ comment, model }) => {
        sendResponse({ success: true, content: comment, model: model?.name });
      })
      .catch(error => {
        sendResponse({ success: false, error: error.message });
      });

    // 返回 true 表示异步响应
    return true;
  }
});
