// /admin/admin_account/paging

import {PageList} from "@/types/global";

interface Account2 {username: string, password: string}
// 请求列表参数类型
export interface AccountListParams {
    pageSize?: number | string
    pageIndex?: number | string
    usernameLike?: string
    nicknameLike?: string
}

// 单条用户数据类型
export interface AccountModel{
    id: string
    creator: string
    modifier: string
    gmtCreated: string
    gmtModified: string
    isDeleted: string
    avatar: string
    nickname: string
    attach: {token: string, account:Account2}
}

export function accountListApi(params: AccountListParams) {
    return usePost<PageList<AccountModel>, AccountListParams>('/admin/admin_account/paging', params, {loading: true,})
}


interface CreateAccountParams {
    avatar: string
    nickname: string
    attach: {account:Account2}
}
export function createAccountApi(params: CreateAccountParams) {
    return usePost('/rainbow/admin/admin_account/create', params, {loading: true,})
}
