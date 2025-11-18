import {getUserInfoApi, logoutApi} from '@/api/login'
import { getRouteMenusApi } from '@/api/common/menu'
import type { UserInfo } from '@/api/common/user'
import type { MenuData } from '@/layouts/basic-layout/typing'
import { rootRoute } from '@/router/constant'
import { generateFlatRoutes, generateRoutes, generateTreeRoutes } from '@/router/generate-route'
import { DYNAMIC_LOAD_WAY, DynamicLoadEnum } from '@/utils/constant'

export const useUserStore = defineStore('user', () => {
  const routerData = shallowRef()
  const menuData = shallowRef<MenuData>([])
  const backEndMenu = shallowRef<{[x: string]: any}>({})
  const userInfo = shallowRef<UserInfo>()
  const token = useAuthorization()
  const avatar = computed(() => userInfo.value?.avatar)
  const nickname = computed(() => userInfo.value?.nickname ?? userInfo.value?.username)
  const roles = computed(() => userInfo.value?.roles)

  const getMenuRoutes = async () => {
    const { data } = await getRouteMenusApi()
    return generateTreeRoutes(data ?? [])
  }

  const generateDynamicRoutes = async () => {
    const dynamicLoadWay = DYNAMIC_LOAD_WAY === DynamicLoadEnum.BACKEND ? getMenuRoutes : generateRoutes
    const { menuData: treeMenuData, routeData } = await dynamicLoadWay()

    menuData.value = treeMenuData

    routerData.value = {
      ...rootRoute,
      children: generateFlatRoutes(routeData),
    }
    return routerData.value
  }
  // 展开用户菜单
function plateBackEndMenu(endMenu: any, menu:any, parentPath: string = '') {
  // let temp:{[x: string]: any} = {}
  // console.log('plateBackEndMenu===============', menu, backEndMenu.value, backEndMenu)
  menu.forEach((item:any) => {
    let {name, parentId, attach, id, code} = item
    let btns = []
    let tabs = []
    if(attach?.children?.length){
      plateBackEndMenu(endMenu, attach?.children, `${parentPath}/${code}`)
    }
    if(attach?.buttons?.length){
      btns = attach?.buttons?.map((item:any) => item.code)
    }
    if(attach?.searchs?.length){
      tabs = attach?.searchs?.map((item:any) => item.code)
    }
    endMenu[`${parentPath}/${code}`]= {name, parentId, id, code:`${parentPath}/${code}`, tabs, btns}
  })
  return endMenu
}

  // 获取用户信息
  const getUserInfo = async () => {
    backEndMenu.value = {}
    // 获取用户信息
    const data = await getUserInfoApi()
    const {id, nickname, avatar, attach} = data
    // plateBackEndMenu(data?.attach?.role?.attach?.menus.slice(3))
    let list = await plateBackEndMenu({}, data?.attach?.role?.attach?.menus)
    backEndMenu.value = list
    userInfo.value = {id, nickname, avatar, roles: ['ADMIN'], username: attach?.account?.username}
  }

  const logout = async () => {
    // 退出登录
    // 1. 清空用户信息
    try {
      await logoutApi()
    }
    finally {
      token.value = null
      userInfo.value = undefined
      routerData.value = undefined
      menuData.value = []
    }
  }

  return {
    userInfo,
    roles,
    getUserInfo,
    logout,
    routerData,
    menuData,
    generateDynamicRoutes,
    backEndMenu,
    avatar,
    nickname,
  }
})
