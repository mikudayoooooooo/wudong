// 图片上传：真实后端走 /app/base/comm/upload（multipart，字段名 file）；
// mock 模式把文件读成 dataURL（本地即可预览，无需后端）。
// 后端各上传插件返回形态不一致，这里统一兼容 string / {url} / {path}。
import { USE_MOCK } from '../env';
import { ApiError, authHeader } from './http';

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(new Error('图片读取失败'));
    reader.readAsDataURL(file);
  });

/** 从上传结果里取出 URL（兼容多种插件返回形态） */
export const pickUploadUrl = (data: unknown): string => {
  if (typeof data === 'string') return data;
  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>;
    for (const key of ['url', 'path', 'src']) {
      if (typeof record[key] === 'string') return record[key] as string;
    }
  }
  return '';
};

export const uploadImage = async (file: File): Promise<string> => {
  if (USE_MOCK) return fileToDataUrl(file);

  const form = new FormData();
  form.append('file', file);
  const res = await fetch('/app/base/comm/upload', {
    method: 'POST',
    headers: authHeader(),
    body: form,
  });
  if (!res.ok) {
    throw new ApiError(`HTTP ${res.status}`, res.status);
  }
  const json = (await res.json()) as { code: number; message?: string; data?: unknown };
  if (json.code !== 1000) {
    throw new ApiError(json.message || '图片上传失败', json.code);
  }
  const url = pickUploadUrl(json.data);
  if (!url) throw new ApiError('图片上传失败：返回结果缺少地址');
  return url;
};
