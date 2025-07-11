import './index.less';

// 配置页
document.querySelector('.header-config').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

document.querySelector('.btn-go-xhs').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab.url.includes('xiaohongshu.com')) {
    alert('小红书页面已打开，不用重复打开');
    return;
  }

  // 动态注入 content.js
  chrome.tabs.create({
    url: 'https://www.xiaohongshu.com/explore/',
    active: true,
  });
});
