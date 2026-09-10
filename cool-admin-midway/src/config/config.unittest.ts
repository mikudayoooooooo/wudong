import { CoolConfig } from '@cool-midway/core';
import { MidwayConfig } from '@midwayjs/core';
import { TenantSubscriber } from '../modules/base/db/tenant';

/**
 * 自动化测试 npm run test 读取的配置文件
 * 数据库由 test/global-setup.js 在每次测试运行前重建
 */
export default {
  typeorm: {
    dataSource: {
      default: {
        type: 'mysql',
        host: '127.0.0.1',
        // 本机 3306 被另一个 MySQL 实例占用（root 密码非 123456），
        // 项目数据库是 docker 容器 wudong-mysql（mysql:8.0），映射到宿主机 3307
        port: 3307,
        username: 'root',
        password: '123456',
        database: 'wudong_platform_test',
        // 测试库每次重建，允许自动建表
        synchronize: true,
        // 打印日志
        logging: false,
        // 字符集
        charset: 'utf8mb4',
        // 关闭查询缓存
        cache: false,
        // 实体路径
        entities: ['**/modules/*/entity'],
        // 订阅者
        subscribers: [TenantSubscriber],
      },
    },
  },
  cool: {
    // 测试环境关闭 eps
    eps: false,
    // 关闭自动导入模块数据库：其 2s 延迟种子导入定时器不被 await，
    // 快速套件 close 后会在已销毁容器上触发，引发间歇性 teardown 失败
    // （Pool is closed 等）；测试用例不依赖种子数据，表结构由 typeorm
    // synchronize 创建
    initDB: false,
    // 判断是否初始化的方式
    initJudge: 'db',
    // 不导入菜单
    initMenu: false,
  } as CoolConfig,
} as MidwayConfig;
