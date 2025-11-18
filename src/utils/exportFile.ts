// src/utils/fileExport.ts

/**
 * 新页面打开方式导出文件的公共方法
 * @param options 导出配置
 *  - url: 后端下载接口地址（适用于接口下载）
 *  - data: 接口请求参数（适用于接口下载，默认GET，如需POST需配合method）
 *  - method: 请求方法（默认GET，POST时会动态创建表单提交）
 *  - blob: 前端生成的Blob对象（适用于前端生成文件）
 *  - fileName: 导出的文件名（可选，后端返回时可忽略）
 */
export function exportFileInNewWindow(options: {
  url?: string;
  data?: Record<string, any>;
  method?: 'GET' | 'POST';
  blob?: Blob;
  fileName?: string;
}) {
  const {
    url,
    data = {},
    method = 'GET',
    blob,
    fileName,
  } = options;

  // 校验参数：必须提供 url 或 blob
  if (!url && !blob) {
    console.error('导出失败：请提供 url 或 blob 参数');
    return;
  }

  // 场景1：前端生成Blob文件（如JSON、CSV等）
  if (blob) {
    // 创建下载链接
    const url = URL.createObjectURL(blob);
    // 打开新窗口下载
    const newWindow = window.open(url, '_blank');
    if (newWindow) {
      // 若指定文件名，通过a标签模拟下载（部分浏览器可能不生效，需后端配合）
      if (fileName) {
        const a = newWindow.document.createElement('a');
        a.href = url;
        a.download = fileName;
        newWindow.document.body.appendChild(a);
        a.click();
        newWindow.document.body.removeChild(a);
        // 关闭新窗口（可选，根据需求决定）
        setTimeout(() => newWindow.close(), 100);
      }
    } else {
      console.error('浏览器阻止了弹出窗口，请允许弹出后重试');
    }
    // 释放URL对象
    URL.revokeObjectURL(url);
    return;
  }

  // 场景2：通过后端接口下载（URL模式）
  if (url) {
    if (method === 'GET') {
      // GET请求：拼接参数到URL
      const params = new URLSearchParams();
      Object.entries(data).forEach(([key, value]) => {
        params.append(key, String(value));
      });
      const fullUrl = `${url}${params.toString() ? `?${params.toString()}` : ''}`;
      // 新窗口打开下载链接
      const newWindow = window.open(fullUrl, '_blank');
      if (!newWindow) {
        console.error('浏览器阻止了弹出窗口，请允许弹出后重试');
      }
    } else {
      // POST请求：通过表单提交（避免URL长度限制）
      const form = document.createElement('form');
      form.action = url;
      form.method = 'POST';
      form.target = '_blank'; // 在新窗口打开
      form.style.display = 'none';

      // 添加表单参数
      Object.entries(data).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });

      // 挂载表单并提交
      document.body.appendChild(form);
      form.submit();
      // 清理表单
      document.body.removeChild(form);
    }
  }
}