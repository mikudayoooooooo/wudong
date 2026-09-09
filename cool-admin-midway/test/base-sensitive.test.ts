import { auth, boot, close, createHttpRequest } from './helper';
import { SensitiveService } from '../src/modules/sensitive/service/sensitive';

describe('sensitive 敏感词过滤', () => {
  let app;
  let sensitiveService: SensitiveService;

  beforeAll(async () => {
    app = await boot();
    sensitiveService = await app
      .getApplicationContext()
      .getAsync(SensitiveService);
  });

  afterAll(async () => {
    await close(app);
  });

  it('命中敏感词', async () => {
    const word = await sensitiveService.addWord('违禁词甲');
    const res = await sensitiveService.check('这篇游记提到违禁词甲的内容');
    expect(res.hit).toBe(true);
    expect(res.words).toContain('违禁词甲');
    await sensitiveService.removeWord(word);
  });

  it('未命中返回 hit=false', async () => {
    const res = await sensitiveService.check('苗寨风光真好');
    expect(res.hit).toBe(false);
    expect(res.words).toEqual([]);
  });

  it('禁用的敏感词不参与匹配', async () => {
    const wordId = await sensitiveService.addWord('违禁词乙');
    await sensitiveService.disableWord(wordId);
    const res = await sensitiveService.check('包含违禁词乙的文本');
    expect(res.hit).toBe(false);
  });

  it('多词同时命中', async () => {
    const w1 = await sensitiveService.addWord('暴力');
    const w2 = await sensitiveService.addWord('色情');
    const res = await sensitiveService.check('内容含暴力与色情描述');
    expect(res.hit).toBe(true);
    expect(res.words.sort()).toEqual(['暴力', '色情'].sort());
    await sensitiveService.removeWord(w1);
    await sensitiveService.removeWord(w2);
  });

  it('管理端接口未登录返回401', async () => {
    const res = await createHttpRequest(app).get(
      '/admin/sensitive/word/page?page=1&size=10'
    );
    expect(res.status).toBe(401);
  });
});
