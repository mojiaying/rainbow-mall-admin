// 供应商管理 接口 -----------------------------------------------》
export function supplierPagetApi(params: any) {
    return usePost('/admin/mall_supplier/paging', params, {loading: true,})
}

export function supplierListApi(params?: any) {
    return usePost('/admin/mall_supplier/list', params, {loading: true,})
}
export function createSupplierApi(params: any) {
    return usePost('/admin/mall_supplier/create', params, {loading: true,})
}

export function updateSupplierApi(params: any) {
    return usePost('/admin/mall_supplier/update', params, {loading: true,})
}

export function deleteSupplierApi(id: string) {
    return useQuery('/admin/mall_supplier/delete', {id}, {loading: true,})
}

export function enableSupplierApi(params: any) {
    return useQuery('/admin/mall_supplier/enable', params, {loading: true,})
}
