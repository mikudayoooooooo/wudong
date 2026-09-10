import { getClassMetadata, CONTROLLER_KEY } from '@midwayjs/core';
import { boot, close, createHttpRequest } from './helper';
import { AdminOperateBannerController } from '../src/modules/operate/controller/admin/banner';
import { AdminOperateAnnouncementController } from '../src/modules/operate/controller/admin/announcement';
import { AdminOperateFinanceRecordController } from '../src/modules/operate/controller/admin/finance-record';

describe('operate 管理端', () => {
  let app;

  beforeAll(async () => {
    app = await boot();
  });

  afterAll(async () => {
    await close(app);
  });

  it('三个 admin 控制器已注册且前缀正确', async () => {
    await app; // boot 已在 beforeAll
    expect(getClassMetadata(CONTROLLER_KEY, AdminOperateBannerController)?.prefix).toBe('/admin/operate/banner');
    expect(getClassMetadata(CONTROLLER_KEY, AdminOperateAnnouncementController)?.prefix).toBe('/admin/operate/announcement');
    expect(getClassMetadata(CONTROLLER_KEY, AdminOperateFinanceRecordController)?.prefix).toBe('/admin/operate/finance-record');
  });

  it.each([
    '/admin/operate/banner/page?page=1&size=10',
    '/admin/operate/announcement/page?page=1&size=10',
    '/admin/operate/finance-record/page?page=1&size=10',
    '/admin/operate/finance-record/info?id=1',
  ])('无 admin token 访问 %s 返回 401（路由已注册且受 admin 鉴权）', async (url) => {
    const res = await createHttpRequest(app).get(url);
    expect(res.status).toBe(401);
  });
});
