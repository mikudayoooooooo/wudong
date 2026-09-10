import { CoolController, BaseController } from '@cool-midway/core';
import { FinanceRecordEntity } from '../../entity/finance-record';

/**
 * 财务记录（本期只读，结算逻辑 Phase 4）
 */
@CoolController({
  prefix: '/admin/operate/finance',
  api: ['page', 'list', 'info'],
  entity: FinanceRecordEntity,
  pageQueryOp: {
    fieldEq: ['a.settlementStatus', 'a.merchantId'],
    keyWordLikeFields: ['a.settlementBatch'],
  },
})
export class AdminOperateFinanceController extends BaseController {}
