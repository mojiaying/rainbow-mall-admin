
export interface thirdPartyParams {
  pageSize?: number
  pageIndex?: number
  spuNameLike?: string
  spuCodeLike?: string
  shelfStatus?: number
}
//APP版本管理
export interface appVersionParams {
  pageSize?: number
  pageIndex?: number
}
export interface appVersionCreateParams {
  size?: string
  remark?: string
  version?: string
  installPack?: string
  platform?: 'IOS' | 'ANDROID'
  forceRefresh?: boolean
  download?: string
  id?: string | undefined
}

export interface appVersionOnParams {
  id: number
}
// 第三方商城
export function thirdPartyApi(params: thirdPartyParams) {
  return usePost('/admin/vendor_mall/paging', params)
}
export interface thirdPartyModal {
  name?: string
  username?: string
  vendorMallId?: number
  urlStatus?: 0 | 1
  pname?: string
  appid?: string
  appletUrl?: string
  url?: string
  accountCode?: string
  statusCheck?: boolean
  status?: 0 | 1
  id?: string
}
export function thirdPartyDetailApi(id: string) {
  return useQuery('/admin/vendor_mall/vendorMall', {id})
}

export function createThirdPartyApi(params: any) {
  return usePost('/admin/vendor_mall/create', params)
}

export function updateThirdPartyApi(params: any) {
  return usePost('/admin/vendor_mall/update', params)
}

export function activeThirdPartyApi(params: { id: string , status: number }) {
  return usePost('/admin/vendor_mall/changeStatus', params)
}


//APP版本管理
export function appVersionApi(params: appVersionParams) {
  return usePost('/admin/app_version/paging', params)
}
export function appVersionCreateApi(params: appVersionCreateParams) {
  return usePost('/admin/app_version/create', params)
}
export function appVersionUpdateApi(params: appVersionCreateParams) {
  return usePost('/admin/app_version/update', params)
}
export function appVersionDeleteApi(id: string) {
  return useQuery('/admin/app_version/delete', {id})
}
export function appVersionOnApi(id: string) {
  return useQuery('/admin/app_version/on', {id})
}