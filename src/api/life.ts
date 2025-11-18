

// 请求列表参数类型
export interface ListParams{
    pageSize?: number
    pageIndex?: number
    merchantId?: string
    categoryId?: number
    nameLike?: string
    code?: string
    sellStatus?: number
    auditStatus?: number
    createdAt?: {
        start: string
        finish: string
    } | [string, string]
}
export type OrderStatus = 'UNPAID' | 'PENDING_USE' | 'COMPLETED' | 'REFUNDED' | 'CLOSED'
export interface orderParams{
    pageSize?: number
    pageIndex?:number
    codeLike?: string
    status?: OrderStatus
    payTimeDuration?: {
        start: string
        finish: string
    }
}
export interface auditParams {
    id: string
    reason?: string
    auditStatus:  number
}

// 单条用户数据类型
export interface StarModal{
    id: string
    creator: string
    modifier: string
    gmtCreated: string
    gmtModified: string
    isDeleted: string
    avatar: string
    name: string
    ext: any
}
export interface CreateStarParams {
    name: string | undefined
    avatar?: string | undefined
}
export function goodsListApi(params: ListParams) {
    return usePost('/admin/life_goods/paging', params)
}
// export function ordersListApi(params: orderParams) {
//     return usePost('/admin/life_goods_order/paging', params)
// }
export function ordersListApi(params: orderParams) {
    return usePost('/admin/life_goods_order_coupon/paging', params)
}

// 下架商品
export function offGoodsApi(id: string) {
    return useQuery('/admin/life_goods/off', {id})
}
// 审核商品
export function auditGoodsApi(params: auditParams) {
    return usePost('/admin/life_goods/audit', params)
}
// 删除商品
export function deleteGoodsApi(id: string) {
    return useQuery('/admin/life_goods/freeze', {id})
}
