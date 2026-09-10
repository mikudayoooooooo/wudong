import { CoolController, BaseController } from '@cool-midway/core';
import { FinanceRecordEntity } from '../../entity/finance-record';

/** 财务记录只读（api 不含 add/update/delete） */
@CoolController({
  api: ['page', 'info', 'list'],
  entity: FinanceRecordEntity,
  pageQueryOp: {
    fieldEq: ['a.settlementStatus', 'a.merchantId'],
  },
})
export class AdminOperateFinanceRecordController extends BaseController {}
