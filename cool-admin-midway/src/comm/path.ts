import * as path from 'path';
import * as os from 'os';
import * as md5 from 'md5';
import * as fs from 'fs';
import { isTypeScriptEnvironment } from '@midwayjs/core';

/**
 * 获得配置文件中的 keys
 * jest(ts-jest) 直接从 src 运行，__dirname 下只有 .ts 源码；
 * dev/build 从 dist 运行，为编译后的 .js。两种情况都要能读到。
 */
const getKeys = () => {
  const candidates = isTypeScriptEnvironment()
    ? ['../config/config.default.ts', '../config/config.default.js']
    : ['../config/config.default.js', '../config/config.default.ts'];
  for (const rel of candidates) {
    const configFile = path.join(__dirname, rel);
    if (fs.existsSync(configFile)) {
      const configContent = fs.readFileSync(configFile, 'utf8');
      return configContent.match(/keys: '([^']+)'/)?.[1];
    }
  }
  return undefined;
};

/**
 * 项目数据目录
 * @returns
 */
export const pDataPath = () => {
  const dirPath = path.join(os.homedir(), '.cool-admin', md5(getKeys()));
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  return dirPath;
};

/**
 * 上传目录
 * @returns
 */
export const pUploadPath = () => {
  const uploadPath = path.join(pDataPath(), 'upload');
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
  return uploadPath;
};

/**
 * 插件目录
 * @returns
 */
export const pPluginPath = () => {
  const pluginPath = path.join(pDataPath(), 'plugin');
  if (!fs.existsSync(pluginPath)) {
    fs.mkdirSync(pluginPath, { recursive: true });
  }
  return pluginPath;
};

/**
 * sqlite 数据库文件
 */
export const pSqlitePath = () => {
  return path.join(pDataPath(), 'cool.sqlite');
};

/**
 * 缓存目录
 * @returns
 */
export const pCachePath = () => {
  return path.join(pDataPath(), 'cache');
};
