/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 显式开关：true 走 mocks 演示数据；false 走真实后端 8001 */
  readonly VITE_USE_MOCK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
