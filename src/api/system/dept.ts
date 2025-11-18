// 部门列表
export interface DeptModel {
    parentIds?: string[]
    parentId?: string
    name?: string
    desc?: string
    id?: string
}
export function deptListApi() {
    return usePost('/admin/dept/tree', {}, {loading: true,})
}

// 新增部门
export function createDeptApi(params: DeptModel) {
    return usePost('/admin/dept/create', params, {loading: true,})
}

// 更新部门
export function updateDeptApi(params: DeptModel) {
    return usePost('/admin/dept/update', params, {loading: true,})
}

// 删除部门
export function deleteDeptApi(id: string) {
    return useQuery('/admin/dept/delete', {id}, {loading: true,})
}



