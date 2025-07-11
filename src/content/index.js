import { $tap, $select } from '../utils/dom.js';
import { getConfig } from '../constants/config';

function onAIButtonClick(e) {
  const ai_btn = e.target;

  // 帖子标题
  const title = document.getElementById('detail-title')?.textContent || '';
  // 帖子内容
  const content = document.getElementById('detail-desc')?.textContent;
  // 帖子日期
  const date = document.querySelector('.date').textContent || '';
  // 图片链接
  let images = $tap([], arr => {
    $select('.img-container img').forEach(img => {
      const src = img.src;
      if (img.naturalWidth > 300 && src && arr.filter(s => s == src).length == 0) {
        arr.push(src);
      }
    });
  });
  if (title || content) {
    // 禁用按钮
    if (ai_btn) {
      ai_btn.disabled = true;
      ai_btn.style.opacity = 0.5;
    }

    // 通知后台，请求AI数据
    chrome.runtime.sendMessage(
      {
        action: 'generateComment', // AI 生成评论内容
        content: {
          title: title,
          date: date,
          content: content,
          images: images,
        },
      },
      function (response) {
        console.log('AI返回啦', response);
        if (response?.content) {
          document.getElementById('content-textarea').textContent = response.content.replace(
            /^["“]|["”]$/g,
            ''
          );
          document
            .getElementById('content-textarea')
            .dispatchEvent(new Event('input', { bubbles: true }));
        }
        if (ai_btn) {
          // 重新开启按钮
          ai_btn.disabled = false;
          ai_btn.style.opacity = 1;
        }
      }
    );
  }
}

let aiButtonPresent = false;
function appendAIButton() {
  aiButtonPresent = !!document.getElementById('lint-btn');

  try {
    const _note = document.getElementById('noteContainer');
    if (_note) {
      const buttons = _note.querySelector('.left-icon-area');

      if (buttons) {
        // 跳过自己的帖子
        if (document.querySelector('.list-container .author')?.textContent.indexOf('一笔账') >= 0) {
          return;
        }
        const exist = document.getElementById('lint-btn');
        var ai_btn;
        if (exist) {
          ai_btn = exist;
        } else {
          ai_btn = document.createElement('a');
          ai_btn.id = 'lint-btn';
          ai_btn.textContent = 'AI';
          ai_btn.style.cursor = 'pointer';
          ai_btn.style.padding = '12px';
          ai_btn.style.marginLeft = '16px';
          ai_btn.className = 'ai';
          buttons.append(ai_btn);
        }

        aiButtonPresent ||
          document.getElementById('lint-btn').addEventListener('click', onAIButtonClick);
        aiButtonPresent = true;
      }
    }
  } catch (e) {
    console.log(e.message);
  }
}
// 监听 DOM 变化，确保动态加载的内容也能被处理
const observer = new MutationObserver(() => {
  // addAIButtonsToInputs();

  if (document.location.host == 'www.xiaohongshu.com') {
    const buttons = document.querySelector('.input-box');
    let sections = document.querySelectorAll('.feeds-container section.note-item');
    const exist = document.getElementById('lint-main-btn');
    if (buttons) {
      if (sections.length > 0) {
        getConfig().then(config => {
          // 需要根据评论数过滤
          if (config?.filterEnabled && config?.minComments && config?.minComments > 0) {
            for (let i = 0; i < sections.length; i++) {
              const section = sections[i];

              const stars = Number(section.querySelector('.count')?.textContent) || 0;
              // 评论数 100 以上的帖子没意义，直接半透明掉
              if (stars < config?.minComments) {
                if (section.querySelector('.play-icon')) {
                  section.style.opacity = '0.2';
                }
              } else {
                section.style.opacity = '0.5';
              }
            }
          }
        });
      }

      appendAIButton();
    } else if (exist) {
      exist.textContent = `AI(${sections.length})`;
    }
  }
});

observer.observe(document.body, { childList: true, subtree: true });
