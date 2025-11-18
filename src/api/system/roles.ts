// 角色权限列表
export interface RoleModel {
    parentId?: string
    name?: string
    desc?: string
    id?: string
}

export function roleListApi(params?: {pageSize?: number, pageIndex?: number, nameLike?: string}) {
    return usePost('/admin/role/paging', params, {loading: true,})
}

// 新增角色权限
export function createRoleApi(params: RoleModel) {
    return usePost('/admin/role/create', params, {loading: true,})
}

// 更新角色权限
export function updateRoleApi(params: RoleModel) {
    return usePost('/admin/role/update', params, {loading: true,})
}

// 删除角色权限
export function deleteRoleApi(id: string) {
    return useQuery('/admin/role/delete', {id}, {loading: true,})
}

// 维护角色权限
export function updateRoleMenuApi(params: {id: string, menuIds: string[]}) {
    return usePost('/admin/role/menu_ids/update', params, {loading: true,})
}



