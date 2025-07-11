import './index.less';

import { getConfig, saveConfig, resetConfig, PRESET_AI_PERSONA } from '../constants/config';

document.addEventListener('DOMContentLoaded', function () {
  // DOM元素
  const enableFilter = document.getElementById('enableFilter');
  const filterSettings = document.getElementById('filterSettings');
  const aiPersonaPreset = document.getElementById('aiPersonaPreset');

  // 切换过滤设置显示
  enableFilter.addEventListener('change', function () {
    filterSettings.style.display = this.checked ? 'block' : 'none';
  });

  // 加载保存的配置
  getConfig().then(config => {
    // 填充AI人设
    document.getElementById('aiPersona').value = config.aiPersona;

    // 填充过滤设置
    enableFilter.checked = config.filterEnabled !== false;
    filterSettings.style.display = enableFilter.checked ? 'block' : 'none';
    document.getElementById('minComments').value = config.minComments || 100;

    // 填充模型列表
    renderModels(config.models);
  });

  // 添加模型按钮
  document.getElementById('addModel').addEventListener('click', function () {
    const modelsContainer = document.getElementById('modelsContainer');
    const newModel = {
      name: '新模型',
      value: '',
      apiKey: '',
      url: '',
      isSelected: false,
    };

    const modelElement = createModelElement(newModel, true);
    modelsContainer.appendChild(modelElement);
  });

  // 保存配置
  document.getElementById('save').addEventListener('click', function () {
    onSaveConfig();
  });

  // 恢复默认
  document.getElementById('reset').addEventListener('click', function () {
    if (confirm('确定要恢复默认配置吗？当前配置将会丢失。')) {
      resetConfig().then(() => {
        window.location.reload();
      });
    }
  });

  // 渲染模型列表
  function renderModels(models) {
    const modelsContainer = document.getElementById('modelsContainer');
    modelsContainer.innerHTML = '';

    models.forEach((model, index) => {
      const modelElement = createModelElement(model, false);
      modelsContainer.appendChild(modelElement);
    });
  }

  // 显示人设预设值
  for (let item of PRESET_AI_PERSONA.reverse()) {
    const presetElement = document.createElement('div');
    presetElement.className = 'preset-item';
    presetElement.innerHTML = `
      <span>${item.name}</span>
    `;
    presetElement.addEventListener('click', () => {
      document.getElementById('aiPersona').value = item.value;
    });
    aiPersonaPreset.appendChild(presetElement);
  }

  // 创建单个模型元素
  function createModelElement(model, isNew) {
    const modelElement = document.createElement('div');
    modelElement.className = 'model-item';

    modelElement.innerHTML = `
      <input type="text" class="model-name" value="${model.name || ''}" placeholder="模型名称">
      <input type="text" class="model-value" value="${model.value || ''}" placeholder="模型ID">
      <input type="text" class="model-apiKey" value="${model.apiKey || ''}" placeholder="API密钥">
      <input type="text" class="model-url" value="${model.url || ''}" placeholder="API地址">
      <select class="model-select">
        <option value="false">禁用</option>
        <option value="true" ${model.isSelected ? 'selected' : ''}>启用</option>
      </select>
      <button class="delete-model secondary">删除</button>
    `;

    // 如果是新模型，自动聚焦名称输入框
    if (isNew) {
      setTimeout(() => {
        modelElement.querySelector('.model-name').focus();
      }, 0);
    }

    // 删除按钮
    modelElement.querySelector('.delete-model').addEventListener('click', function () {
      if (confirm('确定要删除这个模型配置吗？')) {
        modelElement.remove();
      }
    });

    return modelElement;
  }

  // 保存配置
  function onSaveConfig() {
    const aiPersona = document.getElementById('aiPersona').value.trim();
    const filterEnabled = enableFilter.checked;
    const minComments = filterEnabled
      ? parseInt(document.getElementById('minComments').value) || 0
      : 0;

    // 收集模型配置
    const models = [];
    const modelElements = document.querySelectorAll('.model-item');
    let hasSelected = false;

    modelElements.forEach((element, index) => {
      const name = element.querySelector('.model-name').value.trim();
      const value = element.querySelector('.model-value').value.trim();
      const apiKey = element.querySelector('.model-apiKey').value.trim();
      const url = element.querySelector('.model-url').value.trim();
      const isSelected = element.querySelector('.model-select').value === 'true';

      if (name && value) {
        models.push({
          name,
          value,
          apiKey,
          url,
          isSelected,
        });

        if (isSelected) hasSelected = true;
      }
    });

    // 验证
    if (!aiPersona) {
      showStatus('请填写AI人设描述', false);
      return;
    }

    if (models.length === 0) {
      showStatus('请至少添加一个AI模型', false);
      return;
    }

    if (!hasSelected) {
      // showStatus('请选择一个默认模型', false);
      if (!confirm('当前配置下没有默认模型，是否保存？')) {
        return;
      }
    }

    // 保存配置
    const config = {
      aiPersona,
      models,
      filterEnabled,
      minComments,
    };

    saveConfig(config).then(() => {
      showStatus('配置保存成功!', true);
      alert('配置保存成功！');
    });
  }

  // 显示状态消息
  function showStatus(message, isSuccess) {
    const statusElement = document.getElementById('status');
    statusElement.textContent = message;
    statusElement.className = isSuccess ? 'status success' : 'status error';

    setTimeout(() => {
      statusElement.className = 'status';
      statusElement.textContent = '';
    }, 3000);
  }
});
