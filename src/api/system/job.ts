// 岗位列表
export interface JobModel {
    name?: string
    desc?: string
    id?: string
}

export function jobListApi(params?: {pageSize?: number, pageIndex?: number, nameLike?: string}) {
    return usePost('/admin/title/paging', params, {loading: true,})
}

// 新增岗位
export function createJobApi(params: JobModel) {
    return usePost('/admin/title/create', params, {loading: true,})
}

// 更新岗位
export function updateJobApi(params: JobModel) {
    return usePost('/admin/title/update', params, {loading: true,})
}

// 删除岗位
export function deleteJobApi(id: string) {
    return useQuery('/admin/title/delete', {id}, {loading: true,})
}

// 维护岗位
export function updateJobMenuApi(params: {id: string, menuIds: string[]}) {
    return usePost('/admin/role/menu_ids/update', params, {loading: true,})
}



