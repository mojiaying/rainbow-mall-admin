// ip  订单列表
export interface OrderListParams {
    performanceName?: string,
    pageInder: number,
    pageSize: number,
    orderStatus?: string,
    performance?: any,
    sessionIndex?: number,
    session?: string,
}
export function ipOrderListApi(params: OrderListParams) {
    return usePost('/admin/presale/detail/queryPresaleDetails', params, {loading: true,})
}
// 换新接口：IP 门票订单
export function ipTicketOrderListApi(params: any) {
    return usePost('/admin/presale_order_ticket/paging', params, {loading: true,})
}

// 订单 IP名称/场次 接口
export function ipNameSessionListApi(params: any) {
    return useQuery('/admin/presale_order/performance_names', params, {loading: true,})
}

export function ticketRefundApi(params: any) {
    return useQuery('/admin/presale_order_ticket/refund', params, {loading: true,})
}

// 订单导出
export interface exportOrderListParams {
    selectedFields?: string[],
    exportAll?: boolean,
    checkedIds?: string[],
}
export function exportOrderListApi(params?: exportOrderListParams) {
    return usePost('/admin/presale/detail/export/presaleDetails', params, {loading: true,responseType: 'blob'})
}

// 订单导入

export function importOrderListApi(file: any) {
    return usePost('/admin/presale/detail/import/presaleDetails', {file}, {loading: true,})
}

// 订单退票
export function refundTicketApi(ids: string[]) {
    return useQuery('/admin/presale/detail/refundRainbow', {ids}, {loading: true,})
}

