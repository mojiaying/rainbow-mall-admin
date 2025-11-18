export interface LoginParams {
  username: string
  password: string
  type?: 'account'
}

export interface LoginMobileParams {
  mobile: string
  code: string
  type: 'mobile'
}

export interface LoginResultModel {
  token: string
  id: string
  avatar: string
  nickname: string
  attach:{token:string,account: {username:string,password:string}}
}

export interface changeParams {
  oldPassword: string,
  newPassword: string
}

export function loginApi(params: LoginParams | LoginMobileParams) {
  return usePost<LoginResultModel, LoginParams | LoginMobileParams>('/admin/auth/login', params, {
    // 设置为false的时候不会携带token
    token: false,
    // 开发模式下使用自定义的接口
    customDev: true,
    // 是否开启全局请求loading
    loading: true,
  })
}

export function logoutApi() {
  return usePost('/admin/auth/loginout', undefined, {token:true})
}

export function changePasswordAPi(params: changeParams) {
  return usePost<changeParams, changeParams>('/admin/auth/password/reset', params)
}

export function getUserInfoApi() {
  return usePost('/admin/auth/detail', undefined, {token:true})
}
