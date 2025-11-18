

// 请求列表参数类型
import {ListParams, PageList} from "@/types/global";

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
export function starListApi(params: ListParams) {
    return usePost<PageList<StarModal>, ListParams>('/admin/star/paging', params, {loading: true,})
}

export function createStarApi(params: CreateStarParams) {
    return usePost('/admin/star/create', params, {loading: true,})
}

export function updateStarApi(params: CreateStarParams) {
    return usePost('/admin/star/update', params, {loading: true,})
}

export function deleteStarApi(id: string) {
    return useQuery('/admin/star/delete', {id}, {loading: true,})
}

export function detailStarApi(params: CreateStarParams) {
    return useQuery('/admin/star/detail', params, {loading: true,})
}
