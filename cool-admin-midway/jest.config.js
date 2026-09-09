module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/test/fixtures'],
  coveragePathIgnorePatterns: ['<rootDir>/test/'],
  globalSetup: '<rootDir>/test/global-setup.js',
  // 在加载任何测试模块前重定向 cool 的 LocationUtil.getRunPath 到 src（见该文件注释）
  setupFiles: ['<rootDir>/test/jest-setup.js'],
  // 单 worker 串行执行，避免并发 synchronize 建表竞态
  maxWorkers: 1,
  // 应用启动 + 建表较慢，放宽单用例超时
  testTimeout: 120000,
  // midway/cool 框架在 close 后仍有残留句柄（连接池/调度器）挂住事件循环，
  // 用例与 afterAll 均已完成后由 jest 强制退出
  forceExit: true,
};
