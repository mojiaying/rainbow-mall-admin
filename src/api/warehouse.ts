// 仓库管理 接口 -----------------------------------------------》
export function warehousePagetApi(params: any) {
    return usePost('/admin/mall_warehouse/paging', params, {loading: true,})
}

export function warehouseListApi(params?: any) {
    return usePost('/admin/mall_warehouse/list', params, {loading: true,})
}
export function createWarehouseApi(params: any) {
    return usePost('/admin/mall_warehouse/create', params, {loading: true,})
}

export function updateWarehouseApi(params: any) {
    return usePost('/admin/mall_warehouse/update', params, {loading: true,})
}

export function deleteWarehouseApi(id: string) {
    return useQuery('/admin/mall_warehouse/delete', {id}, {loading: true,})
}

export function enableWarehouseApi(params: any) {
    return useQuery('/admin/mall_warehouse/enable', params, {loading: true,})
}
