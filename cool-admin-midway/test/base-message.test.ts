import {
  auth,
  boot,
  close,
  createHttpRequest,
  registerAndLogin,
} from './helper';
import { MessageService } from '../src/modules/message/service/message';

const phone = '13300133001';
const phoneOther = '13300133002';

describe('message 消息中心', () => {
  let app;
  let token: string;
  let tokenOther: string;
  let messageService: MessageService;
  let myId: number;
  let directId: number;

  beforeAll(async () => {
    app = await boot();
    messageService = await app
      .getApplicationContext()
      .getAsync(MessageService);
    token = await registerAndLogin(app, phone);
    tokenOther = await registerAndLogin(app, phoneOther);
    const me = await createHttpRequest(app)
      .get('/app/member/info/person')
      .set(auth(token));
    myId = me.body.data.id;

    await messageService.send(myId, 'order', '支付成功', '订单 A 支付成功');
    await messageService.send(null, 'system', '系统公告', '平台上线公告');
    await messageService.send(null, 'activity', '节日活动', '国庆活动开启');
    const mine = await createHttpRequest(app)
      .get('/app/message/page?page=1&size=10')
      .set(auth(token));
    directId = mine.body.data.list.find(x => x.type === 'order').id;
  });

  afterAll(async () => {
    await close(app);
  });

  it('未登录访问被拦截', async () => {
    const res = await createHttpRequest(app).get('/app/message/page');
    expect(res.status).toBe(200);
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('登录失效~');
  });

  it('pageList 同时返回定向与全员消息', async () => {
    const res = await createHttpRequest(app)
      .get('/app/message/page?page=1&size=10')
      .set(auth(token));
    expect(res.body.code).toBe(1000);
    expect(res.body.data.total).toBe(3);
  });

  it('type 过滤', async () => {
    const res = await createHttpRequest(app)
      .get('/app/message/page?page=1&size=10&type=system')
      .set(auth(token));
    expect(res.body.data.total).toBe(1);
    expect(res.body.data.list[0].title).toBe('系统公告');
  });

  it('unreadCount 统计未读（含全员）', async () => {
    const res = await createHttpRequest(app)
      .get('/app/message/unreadCount')
      .set(auth(token));
    expect(res.body.data).toBe(3);
  });

  it('markRead 仅能标记自己的消息', async () => {
    const ok = await createHttpRequest(app)
      .post('/app/message/read')
      .set(auth(token))
      .send({ ids: [directId] });
    expect(ok.body.code).toBe(1000);

    const unread = await createHttpRequest(app)
      .get('/app/message/unreadCount')
      .set(auth(token));
    expect(unread.body.data).toBe(2);

    // 定向消息 userId=myId，他人标记无效
    const other = await createHttpRequest(app)
      .post('/app/message/read')
      .set(auth(tokenOther))
      .send({ ids: [directId] });
    expect(other.body.code).toBe(1000);
    const otherUnread = await createHttpRequest(app)
      .get('/app/message/unreadCount')
      .set(auth(tokenOther));
    // 他人：2 条全员消息未读，定向消息标记不动
    expect(otherUnread.body.data).toBe(2);
  });

  it('非法消息类型被拒绝', async () => {
    await expect(
      messageService.send(1, 'news', 't', 'c')
    ).rejects.toThrow('消息类型不正确');
  });

  it('管理端接口未登录返回401', async () => {
    const res = await createHttpRequest(app).get(
      '/admin/message/page?page=1&size=10'
    );
    expect(res.status).toBe(401);
  });
});
