import * as mysql from 'mysql2/promise';
import { boot, close } from './helper';
import { MemberSmsService } from '../src/modules/member/service/sms';

describe('member 模拟短信服务', () => {
  let app;
  let svc: MemberSmsService;
  const phone = '13800138001';

  beforeAll(async () => {
    app = await boot();
    svc = await app.getApplicationContext().getAsync(MemberSmsService);
  });

  afterAll(async () => {
    await close(app);
  });

  it('手机号格式非法时抛异常', async () => {
    await expect(svc.sendCode('12345')).rejects.toThrow('手机号格式不正确');
  });

  it('发送后可验证，且验证码一次性', async () => {
    // unittest 环境响应回显验证码
    const { code } = await svc.sendCode(phone);
    expect(code).toBeTruthy();
    await expect(svc.verify(phone, code)).resolves.toBe(true);
    // 已使用，第二次验证失败
    await expect(svc.verify(phone, code)).rejects.toThrow('验证码错误或已过期');
  });

  it('错误验证码不通过', async () => {
    await svc.sendCode(phone);
    await expect(svc.verify(phone, '000000')).rejects.toThrow(
      '验证码错误或已过期'
    );
  });

  it('重复发送后旧验证码作废', async () => {
    const first = await svc.sendCode(phone);
    const second = await svc.sendCode(phone);
    await expect(svc.verify(phone, first.code)).rejects.toThrow(
      '验证码错误或已过期'
    );
    await expect(svc.verify(phone, second.code)).resolves.toBe(true);
  });

  it('过期验证码不通过', async () => {
    // 使用真实回显码：SQL 过期后码本身匹配，确保命中且仅命中过期判断分支
    const { code } = await svc.sendCode(phone);
    // 直接把该手机号未使用的验证码改为已过期
    const conn = await mysql.createConnection({
      host: '127.0.0.1',
      port: 3307,
      user: 'root',
      password: '123456',
      database: 'wudong_platform_test',
    });
    try {
      await conn.query(
        "UPDATE member_sms_code SET expireTime = '2000-01-01 00:00:00' WHERE phone = ? AND used = 0",
        [phone]
      );
    } finally {
      await conn.end();
    }
    await expect(svc.verify(phone, code)).rejects.toThrow(
      '验证码错误或已过期'
    );
  });
});
