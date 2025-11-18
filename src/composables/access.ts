import { toArray } from '@v-c/utils'
import type { AccessEnum } from '@/utils/constant'

export function useAccess() {
  const userStore = useUserStore()
  const roles = computed(() => userStore.roles)
  const hasAccess = (roles: (string | number)[] | string | number | AccessEnum) => {
    const accessRoles = userStore.roles
    const roleArr = toArray(roles).flat(1)
    return roleArr.some(role => accessRoles?.includes(role))
  }
  return {
    hasAccess,
    roles,
  }
}

export function useMenuAccess() {
  const userStore = useUserStore()
  const menuKeys = Object.keys(userStore.backEndMenu)
  const hasAccess = (key: string | number, Keys: (string | number) [] = menuKeys) => Keys.includes(key)
  return {
    hasAccess
  }
}
