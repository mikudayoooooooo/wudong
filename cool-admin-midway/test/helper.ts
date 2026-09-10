import { createApp, close, createHttpRequest } from '@midwayjs/mock';
import { Framework } from '@midwayjs/koa';
import { MerchantService } from '../src/modules/merchant/service/merchant';

export { close, createHttpRequest };

/** 启动完整应用（unittest 环境自动读取 src/config/config.unittest.ts）
 *  注：@midwayjs/mock 3.20 的 createApp 签名为 (baseDir?, options?, customFramework?)，
 *  框架作为泛型参数传入：createApp<Framework>() */
export async function boot() {
  return createApp<Framework>();
}

/** 携带 C 端 token 的请求头（脚手架中间件直接读取裸 token，无 Bearer 前缀） */
export function auth(token: string) {
  return { Authorization: token };
}

/** 注册一个测试用户并返回 token（依赖 Task 4 的 /app/member/login/* 接口） */
export async function registerAndLogin(
  app,
  phone: string,
  password = 'abc123456'
) {
  const sms = await createHttpRequest(app)
    .post('/app/member/login/smsCode')
    .send({ phone });
  const register = await createHttpRequest(app)
    .post('/app/member/login/register')
    .send({ phone, smsCode: sms.body.data.code, password });
  expect(register.body.code).toBe(1000);
  return register.body.data.token as string;
}

/** 入驻申请固定材料（与 base merchant.apply 的必填校验一致） */
export const APPLY_OK = {
  shopName: '测试店铺',
  module: 'product',
  contactName: '张三',
  contactPhone: '13200132001',
  idCard: '522301199001010011',
  idCardFront: 'http://img/id-front.png',
  idCardBack: 'http://img/id-back.png',
  businessLicense: 'http://img/license.png',
};

/**
 * 注册会员 → 提交入驻申请 → 审核通过，返回 { token, userId, merchantId }。
 * module 传 'accommodation' 得到可管理民宿的商家；传 'product' 得到非住宿模块商家（P4 测试用）
 */
export async function registerMerchant(
  app,
  phone: string,
  module = 'accommodation'
) {
  const token = await registerAndLogin(app, phone);
  const me = await createHttpRequest(app)
    .get('/app/member/info/person')
    .set(auth(token));
  const userId = me.body.data.id;

  const apply = await createHttpRequest(app)
    .post('/app/merchant/apply')
    .set(auth(token))
    .send({
      ...APPLY_OK,
      module,
      contactPhone: phone,
      shopName: `测试店铺${phone}`,
    });
  expect(apply.body.code).toBe(1000);

  const progress = await createHttpRequest(app)
    .get('/app/merchant/application')
    .set(auth(token));
  const merchantService: MerchantService = await app
    .getApplicationContext()
    .getAsync(MerchantService);
  await merchantService.audit(progress.body.data.id, true, '材料齐全', 1);

  const my = await createHttpRequest(app)
    .get('/app/merchant/my')
    .set(auth(token));
  expect(my.body.code).toBe(1000);
  return { token, userId, merchantId: my.body.data.id as number };
}
