// 从 HEAD 版本重建 eps 构建产物：两个二级前缀一级化（规避 @cool-vue 插件顺序缺陷）
const { execSync } = require('child_process');
const fs = require('fs');

const head = (p) => execSync(`git show "HEAD:${p}"`, { encoding: 'utf-8', maxBuffer: 1024 * 1024 * 10 });

const jp = 'cool-admin-vue/build/cool/eps.json';
const dp = 'cool-admin-vue/build/cool/eps.d.ts';

let j = head(jp);
j = j.split('/admin/merchant/application').join('/admin/merchantApplication')
     .split('/admin/message/template').join('/admin/messageTemplate');
fs.writeFileSync(jp, j);

let d = head(dp);
d = d.replace('\t\tmerchant: Merchant;', '\t\tmerchant: Merchant;\n\t\tmerchantApplication: MerchantApplication;');
d = d.replace('\t\tmessage: { message: Message; template: MessageTemplate };', '\t\tmessage: Message;\n\t\tmessageTemplate: MessageTemplate;');
fs.writeFileSync(dp, d);

const eps = require('./' + jp);
console.log('entries:', eps.length);
console.log('renamed:', eps.filter(x => /merchantApplication|messageTemplate/.test(x.prefix)).map(x => x.prefix).join(', '));
