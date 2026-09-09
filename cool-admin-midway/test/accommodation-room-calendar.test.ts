import { boot, close } from './helper';
import { RoomCalendarService } from '../src/modules/accommodation/service/room-calendar';

describe('accommodation 房态日历服务 batch/range', () => {
  let app;
  let svc: RoomCalendarService;
  let roomTypeId: number;

  beforeAll(async () => {
    app = await boot();
    svc = await app.getApplicationContext().getAsync(RoomCalendarService);
    // 造民宿 + 房型种子（价格 380，3 间），createTime/updateTime 由框架 hook 填充
    const hotel = await svc.hotelEntity.save({
      name: '乌东苗寨木楼', address: '雷山县乌东村', longitude: 108.1, latitude: 26.3,
    } as any);
    const rt = await svc.roomTypeEntity.save({
      hotelId: hotel.id, name: '木屋大床房', price: 380, stock: 3,
    } as any);
    roomTypeId = rt.id;
  });

  afterAll(async () => {
    await close(app);
  });

  it('range 对无记录日期回退房型默认价/满库/可订', async () => {
    const rows = await svc.range(roomTypeId, '2026-10-01', '2026-10-03');
    expect(rows).toHaveLength(3);
    expect(rows[0].date).toBe('2026-10-01');
    expect(String(rows[0].price)).toBe('380.00');
    expect(rows[0].availableStock).toBe(3);
    expect(rows[0].status).toBe(1);
  });

  it('batch 落库、覆盖、关房、库存截断到房型 stock', async () => {
    await svc.batch({
      roomTypeId, startDate: '2026-10-01', endDate: '2026-10-05',
      price: 520, availableStock: 9, // 9 > stock 3 → 截断为 3
    });
    const rows = await svc.range(roomTypeId, '2026-10-01', '2026-10-05');
    expect(String(rows[0].price)).toBe('520.00');
    expect(rows[0].availableStock).toBe(3);

    // 关房 10-03
    await svc.batch({
      roomTypeId, startDate: '2026-10-03', endDate: '2026-10-03', closed: true,
    });
    const closed = await svc.range(roomTypeId, '2026-10-03', '2026-10-03');
    expect(closed[0].status).toBe(0);
  });

  it('batch 支持 weekDays 限调（仅周六 600，其余回退 380）', async () => {
    // 2026-10-10 是周六(day=6)、10-11 周日、10-12 周一
    await svc.batch({
      roomTypeId, startDate: '2026-10-10', endDate: '2026-10-12',
      weekDays: [6], price: 600,
    });
    const rows = await svc.range(roomTypeId, '2026-10-10', '2026-10-12');
    expect(String(rows.find(r => r.date === '2026-10-10')!.price)).toBe('600.00');
    expect(String(rows.find(r => r.date === '2026-10-11')!.price)).toBe('380.00'); // 周日未调
    expect(String(rows.find(r => r.date === '2026-10-12')!.price)).toBe('380.00'); // 周一未调
  });

  it('batch 对不存在房型抛业务异常', async () => {
    await expect(
      svc.batch({ roomTypeId: 999999, startDate: '2026-10-01', endDate: '2026-10-02' })
    ).rejects.toThrow(/房型不存在/);
  });
});
