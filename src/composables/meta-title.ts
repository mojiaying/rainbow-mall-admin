// import type { RouteLocationNormalizedLoaded, RouteRecordRaw } from 'vue-router'
// import { i18n } from '@/locales'

export function useMetaTitle(route: any) {
  // console.log('useMetaTitle-----', route)
  const { title } = route.meta ?? {}
  useTitle(title)
  // if (title || locale) {
  //   if (locale)
  //     useTitle((i18n?.global as any).t?.(locale) ?? title)
  //   else
  //     useTitle(title)
  // }
}
