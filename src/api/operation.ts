export interface UserListParams {
    pageSize?: number;
    pageIndex?: number;
    keyword?: string;
}

/**
 * 获取用户列表
 */
export function usertListApi(params: UserListParams) {
    return usePost('/admin/member/paging', params, {loading: true,})
}

/**
 * 获取合作商列表
 */
export function cooperatorListApi(params: any) {
    return usePost('/admin/cooperater_apply/paging', params, {loading: true,})
}

/**
 * 修改 合作商 备注
 */
export function cooperatorUpdateRemarkApi(params: any) {
    return usePost('/admin/cooperater_apply/update_remark', params, {loading: true,})
}
