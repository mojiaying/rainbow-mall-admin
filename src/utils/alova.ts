import adapterFetch from 'alova/fetch';

import {createAlova, Method} from 'alova';
import {AxiosLoading} from './loading'
import type {AlovaMethodCreateConfig} from 'alova';
import {message} from 'ant-design-vue'
import {useAuthorization} from "@/composables/authorization.ts";
import router from "@/router";
import _ from 'lodash'

// const notification = useNotification()
const env = import.meta.env.MODE
const axiosLoading = new AxiosLoading()

export interface ResponseBody<T = any> {
    code: number
    data?: T
    msg: string
}

const toast = message
// 1. 创建 Alova 实例
export const alovaInstance = createAlova({
    // 基础请求地址
    // baseURL: import.meta.env.VITE_APP_BASE_URL || '',
    baseURL: import.meta.env.VITE_APP_BASE_API_DEV ?? '/',
    // 请求适配器（使用 fetch API）
    requestAdapter: adapterFetch(),
    // 全局超时时间（毫秒）
    timeout: 10000,

    // 2. 请求拦截器：添加统一请求头（如 Token）
    beforeRequest(method: Method) {
        const config = method.config
        if(method.config.fullUrl) {
            method.baseURL = ''
            return config
        }
        // 处理请求前的url
        if(method.url.startsWith('/common/')) {
            method.url = method.url.slice(7)
        }
        method.baseURL = import.meta.env.VITE_APP_BASE_URL
        // 获取 Token
        const token = useAuthorization()
        if (token.value && config.token !== false) {
            //alova 的请求配置（如 headers）通常是 普通 JavaScript 对象，而非浏览器原生的 Headers 实例。因此，直接调用 set() 方法会失败，因为普通对象没有这个方法
            // config.headers.set('Authorization', token.value)
            config.headers.Authorization = token.value
            config.headers.token = token.value
        }
        if (config.loading) {
            axiosLoading.addLoading()
        }
        return config
        // 可以在这里添加加载状态（如显示 loading）
        // config.loading = true;
    },
    responded: {
        // 请求成功的拦截器
        // 第二个参数为当前请求的method实例，你可以用它同步请求前后的配置信息
        onSuccess: async (response: Response) => {
            const status = response.status
            const token = useAuthorization()
            // 请求失败，网络异常 1. 接口不存在 2. POST GET 方法用错 3. 超时
            if (status != 200) {
                    const errorMsg = {
                        404: '请求地址不存在',
                    }[status] || `网络错误: ${status}`;
                    toast.error(errorMsg)
                throw new Error(errorMsg);
            }
            // 接口业务状态处理
            const result = await response.json()
            const {data, message, code} = result
            if(code === 200) {
                return data
            } else if (code === 401) {
                token.value = null
                router.push({
                    path: '/login',
                    query: {
                        redirect: router.currentRoute.value.fullPath,
                    },
                }).then(() => {})
            }
            const errorMsg = {
                401: '登录已过期，请重新登录',
                423: '密码错误',
                403: '没有权限访问',
                429: '调用频率超限',
                409: '手机号已被注册',
                422: '账号已存在',
            }[code as number]
            toast.error(`${errorMsg || message || ''}`)
            return  Promise.reject(result)
        },

        // 请求失败的拦截器
        onError: (error: Error) => {
            toast.error('网络连接失败，请检查网络');
            return Promise.reject(error);
        },

        // 请求完成的拦截器
        onComplete: async (method: Method) => {
            if (method.config.loading) axiosLoading.closeLoading()

            // 处理请求完成逻辑
        }
    },
});
// 默认请求配置
const defConf: AlovaMethodCreateConfig<any, any, any> = {
    responseType: 'json', // 响应的数据类型
    emulateJSON: true,
    isCache: false,
    loading: true,
    interFaceErrMsg: false, // 是否抛出后台实际错误信息
    timeout: env !== 'production' ? 20000 : 36000, // 超时时间
    headers: {
        'token': '',
    },
}



export function useGet<R = any, T = any>(url: string, params?: T, conf?: AlovaMethodCreateConfig<any, any, any>): Promise<ResponseBody<R>> {
    return alovaInstance.Get(url, {...defConf, ...conf, params});
}
export function usePost<R = any, T = any>(url: string, params?: T, conf?: AlovaMethodCreateConfig<any, any, any>): Promise<R> {
    let data = params || {}
    return alovaInstance.Post(url, data, {...defConf, ...conf});
}

export function useQuery<R = any, T = any>(url: string, params?: T, conf?: AlovaMethodCreateConfig<any, any, any>): Promise<R> {
    if(params){
        const queryString = _.join(
            _.map(params, (value:any, key) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`),
            '&'
        );
        url +=  '?' + queryString;
    }

    return alovaInstance.Post(url, {}, {...defConf, ...conf});
}

export function usePut<R = any, T = any>(url: string, params?: T, conf?: AlovaMethodCreateConfig<any, any, any>): Promise<ResponseBody<R>> {
    let data = params || {}
    return alovaInstance.Put(url, data, {...defConf, ...conf});
}


export function useDelete<R = any, T = any>(url: string, params?: T, conf?: AlovaMethodCreateConfig<any, any, any>): Promise<ResponseBody<R>> {
    let data = params || {}
    return alovaInstance.Delete(url, data, {...defConf, ...conf});
}


export default alovaInstance;

