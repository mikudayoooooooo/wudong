const { Bootstrap } = require('@midwayjs/bootstrap');

/**
 * 生产启动（无 bundle 构建）：
 * - 省略 imports → 自动加载 dist/configuration.js
 * - 省略 moduleDetector → CommonJSFileDetector 目录扫描 dist/**
 *   （保留方法级 @CoolTag 元数据，/app/** 匿名豁免在生产环境正常生效；
 *    原方式经 bundle 内联会丢失方法级元数据，导致匿名接口全部 401）
 */
Bootstrap.configure({}).run();
