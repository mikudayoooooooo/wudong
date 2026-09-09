import { CoolController, BaseController } from '@cool-midway/core';
import { PaymentRecordEntity } from '../../entity/record';

/**
 * 支付流水管理
 */
@CoolController({
  prefix: '/admin/pay/record',
  api: ['page', 'list', 'info'],
  entity: PaymentRecordEntity,
  pageQueryOp: {
    fieldEq: ['a.payStatus', 'a.payChannel'],
    keyWordLikeFields: ['a.paymentNo'],
  },
})
export class AdminPayRecordController extends BaseController {}
