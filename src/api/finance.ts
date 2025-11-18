import {BusinessType, CurrencyType} from "@/types/enumType.ts";
import {OutType, PayEnum} from "@/types/enumType.ts";

export interface thirdPartyOrdersParams {
  pageSize?: number
  pageIndex?: number
  spuNameLike?: string
  spuCodeLike?: string
  shelfStatus?: number
}
export interface merchantCardParams {
  pageSize?: number
  pageIndex?: number
}

export function thirdPartyOrdersApi(params: thirdPartyOrdersParams) {
  return usePost('/admin/vendor_mall_order/paging', params)
}
// 商家银行卡审核列表 -----------------------------------------------》
export function merchantCardApi(params: merchantCardParams) {
  return usePost('/admin/ledger/paging', params)
}

// 商家银行卡审核 通过
export function merchantCardPassApi(id: string) {
  return useQuery('/admin/ledger/pass', {id})
}

// 商家银行卡审核 驳回
export function merchantCardRejectApi(params: {id: string, error: string}) {
  return useQuery('/admin/ledger/reject', params)
}

// 提现记录列表 -----------------------------------------------》
export interface withdrawRecordListParams {
  pageSize?: number | string
  pageIndex?: number | string
  userType?: 1 | 2
  status?: string | number
  identityId?: string
  accountId?: number
}
export function withdrawRecordListApi(params: withdrawRecordListParams) {
  return usePost('/admin/ledger_record/paging', params)
}

// 提现申请 打款 旧接口
export function withdrawAuditApi(params: {expressiveId: string, auditResult: 1 | 2, auditRemark?: string}) {
  return usePost('/admin/central/withdraw/audit', params)
}
// 商家分账失败 手动打款
export function manualPaymentApi(id: string) {
  return useQuery('/admin/ledger_record/manual_payment', {id})
}
// 推广人 提现失败 手动打款
export function memberManualPaymentApi(id: string) {
  return useQuery('/admin/withdraw/manual_payment', {id})
}
// 推广人 提现审核通过
export function withdrawPassApi(params: any) {
  return useQuery('/admin/withdraw/audit/pass', params)
}

// 推广人 提现审核驳回
export function withdrawRejectApi(params: {id: string, reason?: string}) {
  return useQuery('/admin/withdraw/audit/reject', params)
}

//发票 -----------------------------》
export interface InvoicesListParams {
  pageSize?: number
  pageIndex?: number
  submitInvoiceTimeRange?: [string, string] | null
  status?: string
  title?: string
  taxNo?: string
}
export function invoicesListApi(params: InvoicesListParams) {
  return usePost('/admin/invoice/queryInvoices', params)
}

// 开票
export function makeInvoiceApi(invoiceIds: string[]) {
  return useQuery('/admin/invoice/makeInvoice', {invoiceIds})
}

// 驳回
export function rejectInvoiceApi(params: {invoiceIds: string[], rejectReason: string}) {
  return usePost('/admin/invoice/rejectInvoice', params)
}

// 支付管理----------------------------------------------》
// 支付流水列表
export interface PayRecordParams {
  pageSize?: number
  pageIndex?: number
  status?: 0 | 1 | 2 | 3,
  statusStr?: string,
  statusIn?: Array<string>
  outType?: OutType,
  outTypeStr?: string,
  outTypes?: string[],
  payEnum?: PayEnum,
  payAgent?: PayAgent
}
export function payRecordListApi(params: PayRecordParams){
  return usePost('/admin/paylog/paging', params)
}
/* WEIXIN 微信官方
 * ALIPAY 支付宝官方
 * QXDPOS 钱享多 四方聚合支付
 * RAINBOW 彩虹巢
*/
export type PayAgent = 'WEIXIN' | 'ALIPAY' | 'QXDPOS' | 'RAINBOW'
// 查询退款流水
export function refundRecordListApi(params: PayRecordParams){
  return usePost('/admin/refundlog/paging', params)
}

export function refundOperateApi(id: string){
  return useQuery('/admin/refundlog/retry', {id})
}
// 彩虹币流水列表
export interface RainbowCoinListParams {
  pageSize?: number
  pageIndex?: number
  opType?: 0 | 1
  currencyType?: CurrencyType
  businessType?: BusinessType
  currencyTypeIn?: CurrencyType[]
  businessTypeIn?: BusinessType[]
}
export function rainbowCoinListApi(params: RainbowCoinListParams){
  return usePost('/admin/purse_flow/paging', params)
}
// 推广用户提现 审核列表

export function withdrawApi(params: any){
  return usePost('/admin/withdraw/paging', params)
}

