// import type {RouteRecordRaw} from 'vue-router'

export const ROOT_ROUTE_REDIRECT_PATH = '/tickets/index'
const Layout = () => import('@/layouts/index.vue')

export const rootRoute: any = {
    path: '/',
    name: 'rootPath',
    redirect: ROOT_ROUTE_REDIRECT_PATH,
    component: Layout,
    children: [],
}
