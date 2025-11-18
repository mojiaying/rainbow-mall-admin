import type {RouteRecordRaw} from 'vue-router'

const Layout = () => import('@/layouts/index.vue')
export const subRoutes: any[] = [
    {
        path: '/mall/goods/add:id',
        name: 'goodsDetail',
        key: '/mall/goods/add',
        component: () => import('@/pages/mall/goods/components/add.vue'),
        meta: {
            title: ' IP 编辑',
        },
    },
]
export default [
    {
        path: '/login',
        component: () => import('@/pages/common/login.vue'),
        meta: {
            title: '登录',
        },
    },
    {
        path: '/401',
        name: 'Error401',
        component: () => import('@/pages/exception/401.vue'),
        meta: {
            title: '授权已过期',
        },
    },
    {
        path: '/common',
        name: 'LayoutBasicRedirect',
        component: Layout,
        redirect: '/common/redirect',
        children: [
            {
                path: '/common/redirect',
                component: () => import('@/pages/common/route-view.vue'),
                name: 'CommonRedirect',
                redirect: '/redirect',
                children: [
                    {
                        path: '/redirect/:path(.*)',
                        name: 'RedirectPath',
                        component: () => import('@/pages/common/redirect.vue'),
                    },
                ],
            },

        ],
    },
] as RouteRecordRaw[]
