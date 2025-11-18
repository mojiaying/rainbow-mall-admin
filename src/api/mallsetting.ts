
// 退换货 地址入参类型
export interface ReturnAddressParams {
  name: string,
  phone?: number,
  area?: string[]
  addressTxt?: string,
  province?: string,
  city?: string,
  county?: string,
  address?: string,
  isDefault?: 0 | 1
  contact?: any,
  id?: string
}
// 退换货 地址列表
export function goodsReturnListApi(params?: any) {
  return usePost('/admin/mall_refund_address/paging', params || {})
}
// 创建退换货 地址
export function createReturnAddressApi(params: any) {
  return usePost('/admin/mall_refund_address/create', params)
}
// 更新退换货 地址
export function updateReturnAddressApi(params: any) {
  return usePost('/admin/mall_refund_address/update', params)
}
// 删除退换货 地址
export function deleteReturnAddressApi(id: string) {
  return useQuery('/admin/mall_refund_address/delete', {id: id})
}
// 物流模板入参类型
type City = {
  first: string,
  second: string,
}
export interface LogisticsParams {
  name: string,
  isFreeShipping?: number,
  postageFee?: number,
  restrictedSaleCities?: City[],
  nonFreeShippingCities?: City[],
  // nonFreeShippingCities?: string[] | string,
  // restrictedSaleCities?: string[] | string,
  //
  nonFreeShippingCitiesKeys?: string[] | string,
  restrictedSaleCitiesKeys?: string[] | string,
  senderAddress?: string,
  id?: string
  isDefault?: boolean
}
// 物流模板列表
export function goodsLogisticsApi(params?:any) {
  return usePost('/admin/mall_posts_template/paging', params || {})
}
// 创建物流模板
export function createLogisticsApi(params: LogisticsParams) {
  return usePost('/admin/mall_posts_template/create', params)
}
// 更新物流模板
export function updateLogisticsApi(params: LogisticsParams) {
  return usePost('/admin/mall_posts_template/update', params)
}
// 删除物流模板
export function deleteLogisticsApi(id: string) {
  return useQuery('/admin/mall_posts_template/delete', {id: id})
}

