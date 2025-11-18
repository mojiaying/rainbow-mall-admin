

// 请求列表参数类型
import { PageList} from "@/types/global";
interface Address {
    province?: string;
    city?: string;
    county?: string;
    address?: string;
    position?: {
        latitude: number;
        longitude: number;
    }
}
export interface ListParams {
    pageSize?: number | string
    pageIndex?: number | string
    nicknameLike?: string
    provinceLike?: string
    cityLike?: string
}
// 单条用户数据类型
export interface TheaterModal{
    id?: string
    creator?: string
    modifier?: string
    gmtCreated?: string
    gmtModified?: string
    isDeleted?: string
    province?: string;
    city?: string;
    county?: string;
    address?: any
    addressObj?: Address | string
    name?: string
    ext?: any
    area?: any
    addressTxt?: string
}

export function theaterListApi(params: ListParams) {
    return usePost<PageList<TheaterModal>, ListParams>('/admin/theater/paging', params, {loading: true,})
}

export function createTheaterApi(params: TheaterModal) {
    return usePost('/admin/theater/create', params, {loading: true,})
}

export function updateTheaterApi(params: TheaterModal) {
    return usePost('/admin/theater/update', params, {loading: true,})
}

export function deleteTheaterApi(id: string) {
    return useQuery('/admin/theater/delete', {id}, {loading: true,})
}

export function detailTheaterApi(params: TheaterModal) {
    return useQuery('/admin/theater/detail', params, {loading: true,})
}
