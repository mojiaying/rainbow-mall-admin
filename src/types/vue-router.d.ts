// 仅在这个文件中扩展Vue Router类型，其他文件不再重复定义
import 'vue-router';

declare module 'vue-router' {
    interface RouteMeta {
        title?: string
        icon?: string
        hideInMenu?: boolean
        parentKeys?: string[]
        isIframe?: boolean
        url?: string
        hideInBreadcrumb?: boolean
        hideChildrenInMenu?: boolean
        keepAlive?: boolean
        target?: '_blank' | '_self' | '_parent'
        affix?: boolean
        id?: string | number
        parentId?: string | number | null
        access?: (string | number)[]
        locale?: string
        parentName?: string
        parentComps?: RouteRecordRaw['component'][]
        originPath?: string
        path?: string
        meta?: RouteMeta
        children?: RouteRecordRaw[]
        name?: string
        component?: RouteRecordRaw['component']
        // 扩展meta字段
        tabs?: string[];
        btns?: string[];
        requiresAuth?: boolean;
    }

    // 如需在路由根节点添加字段，扩展RouteRecordRaw
    interface RouteRecordRaw {
        // 注意：仅添加必要的自定义字段，避免覆盖内置属性
        hidden?: boolean; // 示例：是否在菜单中隐藏
    }
}
