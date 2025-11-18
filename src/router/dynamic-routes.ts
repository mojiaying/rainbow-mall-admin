// 前端动态路由文件
// import type {RouteRecordRaw} from 'vue-router'
import {basicRouteMap} from './router-modules'

const dynamicRoutes: any[] = [
    {
        path: '/mall',
        redirect: '/mall/goods',
        name: 'Mall',
        meta: {
            title: '商城',
            icon: 'ShopOutlined',
        },
        component: basicRouteMap.RouteView,
        children: [
            {
                path: '/mall/goods',
                name: 'MallGoods',
                component: () => import('@/pages/mall/goods/goods.vue'),
                meta: {
                    title: '商品列表',
                },
            },
            {
                path: '/mall/orders',
                name: ' MallOrders',
                component: () => import('@/pages/mall/orders/orders.vue'),
                meta: {
                    title: '销售列表',
                },
            },
            {
                path: '/mall/return',
                name: ' MallReturn',
                component: () => import('@/pages/mall/return/return.vue'),
                meta: {
                    title: '退货订单',
                },
            },
            {
                path: '/mall/inventory',
                name: ' MallInventory',
                component: () => import('@/pages/mall/inventory.vue'),
                meta: {
                    title: '实时库存',
                },
            }
        ],
    },
    {
        path: '/settings',
        redirect: '/settings/category/ticket',
        name: 'Settings',
        meta: {
            title: '设置',
            icon: 'SettingOutlined',
        },
        component: basicRouteMap.RouteView,
        children: [
            {
                path: '/settings/base-info',
                redirect: '/settings/base-info/star',
                name: 'BaseInfo',
                meta: {
                    title: '基础信息',
                    icon: '',
                },
                children:[
                    {
                        path: '/settings/base-info/logistics',
                        name: 'Logistics',
                        component: () => import('@/pages/settings/base-info/logistics.vue'),
                        meta: {
                            title: '物流模板',
                        }
                    }
                ]
            },

        ],

    },
]
export default dynamicRoutes
