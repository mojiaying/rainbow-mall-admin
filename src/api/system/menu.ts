// 菜单列表
export interface MenuModel {
    parentIds?: string[]
    parentId?: string
    name?: string
    code?: string
    type?: string | number
    id?: string
    sort?: number | string
    url?: string
}
export function menuListApi() {
    return usePost('/admin/menu/tree', {}, {loading: true,})
}

// 新增菜单
export function createMenuApi(params: MenuModel) {
    return usePost('/admin/menu/create', params, {loading: true,})
}

// 更新菜单
export function updateMenuApi(params: MenuModel) {
    return usePost('/admin/menu/update', params, {loading: true,})
}

// 删除菜单
export function deleteMenuApi(id: string) {
    return useQuery('/admin/menu/delete', {id}, {loading: true,})
}



