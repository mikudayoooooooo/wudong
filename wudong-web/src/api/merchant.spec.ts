import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const okJson = (data: unknown) => ({
  ok: true,
  json: async () => ({ code: 1000, data }),
});

/** USE_MOCK 在模块顶层求值，必须先设定环境变量再动态导入 */
const loadApi = async () => {
  vi.resetModules();
  return import('./merchant');
};

describe('api/merchant', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  describe('真实后端分支', () => {
    beforeEach(() => {
      vi.stubEnv('VITE_USE_MOCK', 'false');
    });

    it('merchantMy 无店铺时返回 null（cool 不输出 data 键）', async () => {
      const { merchantMy } = await loadApi();
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ code: 1000 }) }));
      await expect(merchantMy()).resolves.toBeNull();
    });

    it('民宿分页请求路径与 query 正确', async () => {
      const { merchantHotelPage } = await loadApi();
      let url = '';
      vi.stubGlobal('fetch', vi.fn((u: string) => {
        url = u;
        return Promise.resolve(okJson({ list: [], total: 0 }));
      }));
      await merchantHotelPage({ page: 2, size: 10, name: '苗寨' });
      expect(url).toBe(
        '/app/accommodation/merchant/hotel/page?page=2&size=10&name=%E8%8B%97%E5%AF%A8'
      );
    });

    it('merchantHotelSave 无 id 走 add，有 id 走 update', async () => {
      const { merchantHotelSave } = await loadApi();
      // 只收集写请求：update 后端返回 boolean，故保存后再 GET /hotel/info 回读完整行（非路由决策）
      const calls: string[] = [];
      vi.stubGlobal('fetch', vi.fn((u: string, i: any) => {
        if (i?.method === 'POST') calls.push(u);
        return Promise.resolve(okJson({ id: 1, name: 'x' }));
      }));
      const base = {
        name: '苗寨一号院',
        address: '雷山县',
        longitude: 108,
        latitude: 26,
        styleTags: [],
        facilityTags: [],
        mainImage: '',
        images: [],
        intro: '',
        checkInTime: '14:00',
        checkOutTime: '12:00',
        petPolicy: '',
        hasBreakfast: 0,
        deposit: 0,
        status: 1,
      };
      await merchantHotelSave(base);
      await merchantHotelSave({ ...base, id: 5 });
      expect(calls).toEqual([
        '/app/accommodation/merchant/hotel/add',
        '/app/accommodation/merchant/hotel/update',
      ]);
    });

    it('房态区间查询归一 decimal', async () => {
      const { merchantCalendarRange } = await loadApi();
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(okJson([
        { date: '2026-10-01', price: '480.00', availableStock: '3', status: '1' },
      ])));
      const rows = await merchantCalendarRange(2, '2026-10-01', '2026-10-01');
      expect(rows[0].price).toBe(480);
      expect(rows[0].availableStock).toBe(3);
      expect(rows[0].status).toBe(1);
    });

    it('批量设置提交 JSON body', async () => {
      const { merchantCalendarBatch } = await loadApi();
      let body = '';
      vi.stubGlobal('fetch', vi.fn((_u: string, i: any) => {
        body = i.body;
        return Promise.resolve(okJson({ count: 7 }));
      }));
      await merchantCalendarBatch({
        roomTypeId: 2,
        startDate: '2026-10-01',
        endDate: '2026-10-07',
        price: 480,
      });
      expect(body).toBe(
        JSON.stringify({ roomTypeId: 2, startDate: '2026-10-01', endDate: '2026-10-07', price: 480 })
      );
    });

    it('上下架提交 id 与 status', async () => {
      const { merchantHotelSetStatus } = await loadApi();
      let url = '';
      let body = '';
      let method = '';
      vi.stubGlobal('fetch', vi.fn((_u: string, i: any) => {
        url = _u;
        method = i.method;
        body = i.body;
        return Promise.resolve(okJson(true));
      }));
      await merchantHotelSetStatus(3, 0);
      // 路径与 body 都要钉住：只断 body 时走错路由仍然会绿
      expect(url).toBe('/app/accommodation/merchant/hotel/update');
      expect(method).toBe('POST');
      expect(body).toBe(JSON.stringify({ id: 3, status: 0 }));
    });
  });

  describe('mock 分支（内存态可增删改）', () => {
    beforeEach(() => {
      vi.stubEnv('VITE_USE_MOCK', 'true');
    });

    it('mock 模式下不发出网络请求', async () => {
      const { merchantHotelPage, merchantCalendarRange } = await loadApi();
      const fetchMock = vi.fn();
      vi.stubGlobal('fetch', fetchMock);
      await merchantHotelPage();
      await merchantCalendarRange(11, '2026-10-01', '2026-10-03');
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('mock 模式新增民宿后列表可见', async () => {
      const { merchantHotelPage, merchantHotelSave } = await loadApi();
      const before = await merchantHotelPage();
      const created = await merchantHotelSave({
        name: '演示新院子',
        address: '雷山县五组',
        longitude: 108.5,
        latitude: 26.8,
        styleTags: ['苗寨'],
        facilityTags: [],
        mainImage: '',
        images: [],
        intro: '',
        checkInTime: '14:00',
        checkOutTime: '12:00',
        petPolicy: '',
        hasBreakfast: 0,
        deposit: 0,
        status: 1,
      });
      const after = await merchantHotelPage();
      expect(after.total).toBe(before.total + 1);
      expect(after.list.some((h) => h.id === created.id)).toBe(true);
    });
  });
});
