import { getClassMetadata, CONTROLLER_KEY } from '@midwayjs/core';
import { boot, close, createHttpRequest } from './helper';
import { AdminAccommodationHotelController } from '../src/modules/accommodation/controller/admin/hotel';
import { AdminAccommodationRoomTypeController } from '../src/modules/accommodation/controller/admin/room-type';
import { AdminAccommodationRoomCalendarController } from '../src/modules/accommodation/controller/admin/room-calendar';

describe('accommodation 管理端', () => {
  let app;

  beforeAll(async () => {
    app = await boot();
  });

  afterAll(async () => {
    await close(app);
  });

  it('三个 admin 控制器已注册且前缀正确', async () => {
    await app; // boot 已在 beforeAll
    expect(getClassMetadata(CONTROLLER_KEY, AdminAccommodationHotelController)?.prefix).toBe('/admin/accommodation/hotel');
    expect(getClassMetadata(CONTROLLER_KEY, AdminAccommodationRoomTypeController)?.prefix).toBe('/admin/accommodation/room-type');
    expect(getClassMetadata(CONTROLLER_KEY, AdminAccommodationRoomCalendarController)?.prefix).toBe('/admin/accommodation/room-calendar');
  });

  it.each([
    '/admin/accommodation/hotel/page?page=1&size=10',
    '/admin/accommodation/room-type/page?page=1&size=10',
    '/admin/accommodation/room-calendar/page?page=1&size=10',
  ])('无 admin token 访问 %s 返回 401（路由已注册且受 admin 鉴权）', async (url) => {
    const res = await createHttpRequest(app).get(url);
    expect(res.status).toBe(401);
  });
});
