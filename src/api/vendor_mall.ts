import {PayEnum} from "@/types/enumType.ts";
// 三方商城列表 --------------------------------------->
export interface VendorListParams {
    pageSize: number
    pageIndex: number
    status?: 0 | 1
}
export function vendorListApi(params?: VendorListParams) {
    return usePost('/admin/vendor_mall/paging', params, {loading: true,})
}
// 新增三方商城 --------------------------------------->
export interface VendorModal {
    api?: string
    name?: "string",
    rebate: "string",
    cycle: "string",
    url?: "string",
}
export function createVendorApi(params: VendorModal) {
    return usePost('/admin/vendor_mall/create', params, {loading: true,})
}

// 更新三方商城  --------------------------->
export function updateVendorApi(params: VendorModal) {
    return usePost('/admin/vendor_mall/update', params, {loading: true,})
}

// 更新三方商城上下架状态 --------------------------->
export function updateVendorStatusApi(params: {id: string, status: 0 | 1 | 2}) {
    return usePost('/admin/vendor_mall/changeStatus', params, {loading: true,})
}

// 三方商城订单列表 --------------------------------------->
// 三方商城订单 充值记录对换记录 --------------------------------------->
export function vendorExchangeRecordListApi(params?: any) {
    return usePost('/admin/vendor_mall_order/queryPurseFlows', params, {loading: true,})
}
// 三方商城订单 充值 充值记录 新接口 --------------------------->
export function vendorRecordListApi(params?: any) {
    return usePost('/admin/recharge_order/paging', params, {loading: true,})
}
// // 充值API  --------------------------------------->
export interface rechargeParams {
    count?: number
    amount?: number
    currencyType: 'RAINBOW' | 'GOLD' | 'POINT' | 'BALANCE'
}
export function rechargeApi(params: rechargeParams) {
    return usePost('/admin/recharge_order/create', params, {loading: true,})
}
// 拉起支付 --------------------------------------->
// IP_PRE_SALE 票务-预售订单
// RECHARGE_ORDER 充值订单
// LIFE_GOODS_ORDER 本地生活-生活订单
// LIFE_GOODS_ORDER_REFUND 本地生活-售后订单
// MALL_PRODUCT_ORDER 自营商城-商品订单
// MALL_PRODUCT_ORDER_REFUND 自营商城-售后订单
type OutType = 'NONE' | 'IP_PRE_SALE' | 'RECHARGE_ORDER' | 'LIFE_GOODS_ORDER' | 'LIFE_GOODS_ORDER_REFUND' | 'MALL_PRODUCT_ORDER' | 'MALL_PRODUCT_ORDER_REFUND'


/* 支付终端
* H5 H5
* PC PC
* APP Android/iOS应用
* WEIXIN_MINI 微信小程序
 */
type TerminalEnum = 'H5' | 'PC' | 'APP' | 'WEIXIN_MINI'
export interface paymentParams {
    outId: string // 订单id
    outType:OutType // 订单类型
    payEnum: PayEnum // 支付方式
    terminalEnum: TerminalEnum // 支付终端
}
export function paymentApi(params: paymentParams) {
    return usePost('/base/pay/trade/create', params, {loading: true,})
}
// 查询支付结果 --------------------------------------->

export function payResultApi(params: {outId: string, outType: OutType}) {
    return usePost('/base/pay/trade/status', params, {loading: false})
}

// 彩虹币余额--------------------------------------->
export function rainbowAmountApi() {
    return usePost('/admin/purse/detail', {}, {loading: true,})
}

