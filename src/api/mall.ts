// 请求列表参数类型
export interface goodsListParams {
  pageSize?: number
  pageIndex?: number
  spuNameLike?: string
  spuCodeLike?: string
  shelfStatus?: number
  createdAt?: {
    start: string
    finish: string
  }
}
export interface goodsSalesParams {
  pageSize?: number
  pageIndex?: number
  orderNo?: number
  status?: string
  statusIn?: string
  searchTimeType?: 2 | 1
  payAt?: {
    start: string | null,
    finish: string | null,
  },
  createdAt?: {
    start: string | null,
    finish: string | null,
  },
}
export interface goodsInventoryParams {
  pageSize?: number
  pageIndex?: number
  categoryId?: string[] | string
  skuNameLike?: string
  skuCodeLike?: string
  spuNameLike?: string
}
export interface goodsReturnParams { 
  pageSize?: number
  pageIndex?: number
  orderNo?: string
  searchTimeType?: 2 | 1 | 3
  timeRange?: [string, string]
  createOrderAt?: {
    start: string | null,
    finish: string | null,
  },
  payOrderAt?: {
    start: string | null,
    finish: string | null,
  }
  refundAt?: {
    start: string | null,
    finish: string | null,
  }
  status?: string
  start?: string
  finish?: string
}
class skuExpand {
  skuUrl?: string
  skuTitle?: string
  skuDes?: string
  expand?: string
}
class mallProductSkuParams {
  attach?: {
    mallProductSkuExpands?: skuExpand[]
  } | null = null
  idx?:number
  skuCode?: string
  skuName?: string
  skuUrl?: string
  price?: number
  costPrice?: number
  color?: string
  size?: string
  expand?: string
}
export interface goodsChangeParams {
  spuId: string
  operateType: number
  shelfTime?: string
}
export type SpuImagesType = {
  imageType?: number
  url?: string
  expand?: string
}
export type AfterSellType = 'is7daysReturnable' | 'hasReturnCommitment' | 'invoicing' | 'genuine'
export interface goodsUpdateParams {
  id?:string,
  spuName?: string // 商品名称（必填）Validate[max: 200; 消息：商品名称长度不能超过200]
  spuCode?: string // 商品编码（必填）Validate[max: 50; 消息：商品编码长度不能超过5```````0]
  categoryId?: string
  categoryIds?: string[]
  stockInfo?: 0 | 1 // 库存计数（0=创单减库存，1=支付减库存）（必填）
  logisticsTemplateId?: string // 物流模板ID（必填）
  is7daysReturnable?: 0 | 1 // 7天可返回（0=否，1=是）（必填）
  hasReturnCommitment?:  0 | 1  // 是否有退换货承诺（0=否，1=是）（必填）
  invoicing?: 0 | 1 // 是否可开发票（0=否，1=是）（必填）
  genuine?:  0 | 1  // 是否保证正品（0=否，1=是）（必填）
  shelfStatus?: number // 上架状态（0=草稿，1=已上架，2=已下架）（必填）
  shelfTime?: string // 上架时间（上架状态为已上架时必填,为草稿时此为预上架时间，必须设置）
  pointsType?: number // 积分 类型（0=无积分，1=按金额比例，2=固定积分）（必填）
  pointsValue?: number // 积分数值（比例或固定值，保留4位小数）（积分类型不为无时必填）
  firstDistributionValue?: number // （比例或固定值，保留4位小数）（一级分销类型不为无时必填）
  secondDistributionValue?: number // （比例或固定值，保留4位小数）（二级分销类型不为无时必填）
  expand?: string //拓展字段 Validate[max: 2000; 消息：拓展字段长度不能超过2000]
  mallProductSpuImages?: SpuImagesType[] | string[]
  mallProductSkus?: mallProductSkuParams[],
  afterSell?: AfterSellType[]
  type?: 0 | 1 | 2,
  rainbowCoinPayType?: 0 | 1 | 2 // 0=固定值，1=百分比 2=不限
  rainbowCoinPayValue?: number // 固定值或百分比（保留4位小数）
  payType?: {
    type?: 0 | 1 | 2,
    rainbowCoinPayType?: 0 | 1 | 2 // 0=固定值，1=百分比 2=不限
    rainbowCoinPayValue?: number // 固定值或百分比（保留4位小数）
  }
  afterSale?: {
    is7daysReturnable?: 0 | 1 // 7天可返回（0=否，1=是）（必填）
    hasReturnCommitment?:  0 | 1  // 是否有退换货承诺（0=否，1=是）（必填）
    invoicing?: 0 | 1 // 是否可开发票（0=否，1=是）（必填）
    genuine?:  0 | 1  // 是否保证正品（0=否，1=是）（必填）
  },
  attach?: {
    mallProductSkus?: mallProductSkuParams[] //关联的SKU列表（至少需要一个SKU）
    mallProductSpuImages?: SpuImagesType[]
    afterSell?: AfterSellType[]
  }
}
// 商品列表
export function goodsListApi(params: goodsListParams) {
  return usePost('/admin/mall_product_spu/paging', params)
}
// 新增商品
export function createMallGoodsApi(params: goodsListParams) {
  return usePost('/admin/mall_product_spu/create', params)
}
//修改商品
export function updateMallGoodsApi(params: goodsListParams) {
  return usePost('/admin/mall_product_spu/update', params)
}
//删除商品
export function deleteMallGoodsApi(spuId: string) {
  return useQuery('/admin/mall_product_spu/delete', {spuId:spuId})
}

// /admin/mall_product_spu/detail
// 商品详情
export function mallGoodsDetailApi(params: {spuId: string}) {
  return useQuery('/admin/mall_product_spu/detail', params)
}
// -----------------------------------------------------------------------------------------》
// 商品销售列表
export function goodsSalesApi(params: goodsSalesParams) {
  return usePost('/admin/mall_product_order/paging', params)
}
// 取消订单
// export function cancelOrderApi(params: {orderId: string, reason: string}) {
//   return usePost('/admin/mall_product_order/adminCancel', params)
// }
export function cancelOrderApi(params: {id: string, reason: string}) {
  return useQuery('/admin/mall_product_order/cancel', params)
}
// 填写订单编号
// export function deliveredApi(params: {orderId: string, logisticsNo: string}) {
//   return useQuery('/admin/mall_product_order/delivered', params)
// }
export function deliveredApi(params: {id: string, logisticsNo: string}) {
  return useQuery('/admin/mall_product_order/delivery', params)
}
// 确认完成订单
export function confirmFinishOrderApi(orderId: string) {
  return useQuery('/admin/mall_product_order/finish', {orderId})
}
// 订单详情
export function mallOrderDetailApi(orderId: string) {
  return useQuery('/admin/mall_product_order/orderDetail', {orderId})
}
// 审核通过 ： 同意退货 / 同意仅退款
export interface auditRefundParams {
  id: string
  addressId?: string
  reason?: string
}
export function auditRefundApi(params: auditRefundParams) {
  return usePost('/admin/mall_product_order_refund/audit/pass', params)
}
// 审核不通过：拒绝退货 / 拒绝仅退款
export function auditRejectApi(params: auditRefundParams) {
  return usePost('/admin/mall_product_order_refund/audit/reject', params)
}
// 已经寄回商品

// 退货寄回 -----退款接口
export function refundApi(id: string) {
  return useQuery('/admin/mall_product_order_refund/check/pass', {id})
}
// 退货寄回 -----拒绝退款接口
export function rejectReturnApi(params: auditRefundParams) {
  return usePost('/admin/mall_product_order_refund/check/reject', params)
}
// --------------------------------------------------------------------------------------------》
// 商品库存列表
export function goodsInventoryApi(params: goodsInventoryParams) {
  return usePost('/admin/mall_product_sku/paging', params)
}
// sku 列表
export function skuListApi(spuId: string) {
  return useQuery('/admin/mall_product_sku/listBySpu', {spuId})
}
// 库存修改
export interface storeUpdateParams {
  skuId: string
  opType: 0 | 1
  number: number
}
export function storeUpdateApi(params: storeUpdateParams) {
  return usePost('/admin/mall_product_stock/update', params)
}
// SKU 上下架
export function changeSkuStatusApi(params: {skuIds: string[], status: 0 | 1}) {
  return usePost('/admin/mall_product_sku/changeStatus', params)
}

// 商品退货列表
// export function goodsReturnApi(params: goodsReturnParams) {
//   return usePost('/admin/mall_product_order/refund_paging', params)
// }
export function goodsReturnApi(params: goodsReturnParams) {
  return usePost('/admin/mall_product_order_refund/paging', params)
}

// 商品上下架
export function goodsChangeApi(params: goodsChangeParams) {
  return usePost('/admin/mall_product_spu/changeStatus', params)
}



