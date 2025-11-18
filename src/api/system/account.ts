// 单条账号数据类型
interface Account {username?: string, password?: string}
export interface AccountModel{
    id?: string
    deptId?: string
    deptIds?: string[]
    roleId?: string
    titleId?: string
    avatar?: string
    sex?:  0 | 1 // 0 女 1 男
    truename?: string
    nickname?: string
    username?: string
    password?: string
    phone?: string
    attach?: {account?:Account}
}
export interface AccountListParams {
    pageSize?: number | string
    pageIndex?: number | string
    usernameLike?: string
    nicknameLike?: string
    roleId?: string
}
// 账号列表
export function accountListApi(params?: AccountListParams): any {
    return usePost('/admin/admin_account/paging', params)
}

// 新增账号
export function createAccountApi(params: AccountModel) {
    return usePost('/admin/admin_account/create', params)
}

// 更新账号
export function updateAccountApi(params: AccountModel) {
    return usePost('/admin/admin_account/update', params)
}

// 删除账号
export function deleteAccountApi(id: string) {
    return useQuery('/admin/admin_account/delete', {id})
}

// 停用账号
export function updateAccountStatusApi(id: string) {
    return useQuery('/admin/admin_account/status', {id})
}

// 重置密码
export function resetAccountPwApi(params: {id?:string, password?:string}) {
    return usePost('/admin/admin_account/password/reset', params)
}


