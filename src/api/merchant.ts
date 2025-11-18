
import {PageList} from "@/types/global";
// 请求列表参数类型
export interface MerchantListParams {
    pageSize?: number | string
    pageIndex?: number | string
    codeLike?: string
    nicknameLike?: string
    status?: string
}
export interface AuditListParams {
    pageSize?: number | string
    pageIndex?: number | string
    storeLike?: string
    accountLike?: string
    status?: string
    statusIn?: number[]
}

// 单条用户数据类型
export interface MerchantModel{
    id: string
    creator: string
    modifier: string
    gmtCreated: string
    gmtModified: string
    isDeleted: string
    industryId: string
    code: string
    name: string
    phone: string
    reason: string
    status: 0 | 1 | 2 | 3 | 4
    attach: any
}
export interface ToggleStatusParams {
    id: string
    reason?: string,
    finishDate?: string | null
}
// 商家接口
export function merchantListApi(params: MerchantListParams) {
    return usePost<PageList<MerchantModel>, MerchantListParams>('/admin/merchant/paging', params)
}

export function merchantStatusApi(params:ToggleStatusParams){
    return useQuery<boolean, ToggleStatusParams>('/admin/merchant/status', params )
}

export function merchantDetailApi(id: number){
    return useQuery('/admin/merchant/detail', {id})
}
// 门店接口
export function storeListApi(params:any) {
    return usePost('/admin/store/paging', params)
}

export function storeNormalApi(id:string){
    return usePost<boolean, {id:string}>('/admin/store/normal', {id} )
}

export function storeBannedApi(params:ToggleStatusParams) {
    return usePost<boolean, ToggleStatusParams>('/admin/store/banned', params)
}
// 禁售记录
export function getBannedRecordApi(params:{pageSize: number, pageIndex: number,storeId:string}) {
    return usePost('/admin/store_banned_record/paging', params)
}
// 审核接口
export function auditListApi(params: AuditListParams) {
    return usePost('/admin/store_audit/paging', params)
}

export function auditPassApi(id:string){
    return useQuery('/admin/store_audit/pass', {id} )
}
export function auditRejectApi(params:ToggleStatusParams){
    return useQuery<boolean, ToggleStatusParams>('/admin/store_audit/reject', params )
}
