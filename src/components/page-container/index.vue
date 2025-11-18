<script setup lang="ts">
import { isFunction } from '@v-c/utils'
import type { VNodeChild} from 'vue'
import { useLayoutMenuInject } from './context.ts'
import { useLayoutState } from '@/layouts/basic-layout/context'

defineProps<{
  title?: string
}>()
const emit = defineEmits(['goBack'])
const slots = defineSlots<{
  default: (props: any) => any
  title?: (props: any) => any
  content?: (props: any) => any
  extraContent?: (props: any) => any
  extra?: (props: any) => any
  footer?: (props: any) => any
  back?: (props: any) => any
}>()

const { layoutMenu: layoutMenuStore, appStore } = useLayoutMenuInject()
const { layoutSetting } = (storeToRefs as any)(appStore)
const { menuDataMap } = (storeToRefs as any)(layoutMenuStore)
const route = useRoute()
function getCurrentItem() {
  const key: string = route.meta?.originPath ?? route.path
  if (key && menuDataMap.value.has(key))
    return menuDataMap.value.get(key)
  return {} as any
}
const currentItem = shallowRef(getCurrentItem())
onBeforeMount(() => {
  currentItem.value = getCurrentItem()
})

let timer: ReturnType<typeof setTimeout> | undefined
watch(() => route.path, () => {
  if (timer) {
    clearTimeout(timer)
    timer = undefined
  }
  timer = setTimeout(() => {
    currentItem.value = getCurrentItem()
  }, 300)
})

const { contentWidth } = useLayoutState()
const contentCls = computed(() => {
  const cls: string[] = [
    'flex flex-col flex-1',
  ]
  if (contentWidth.value === 'Fluid')
    cls.push('w-full')

  else if (contentWidth.value === 'Fixed')
    cls.push(...['max-w-1200px w-1200px', 'mx-auto'])

  return cls
})
function renderTitle(title: VNodeChild | (() => VNodeChild)) {
  if (isFunction(title))
    return title()

  return title
}
const TabStyle = {
  color: '#333',
  cursor: 'pointer',
  '&:hover': {
    color: 'blue',
    backgroundColor: 'blue',
  }
}
</script>

<template>
<!--  <a-button class="ml-6" size="middle" @click="emit('goBack')">返回</a-button>-->
  <div class="ant-pro-page-container">
    <div class="bg-white top-box" :class="layoutSetting.multiTab ? 'pb-16px' : 'py-16px'">
      <a-flex style="width: 100%;justify-content: space-between">
      <a-breadcrumb v-if="!currentItem.hideInBreadcrumb">
        <template v-if="currentItem.matched?.length">
          <a-breadcrumb-item v-for="item in currentItem.matched" :key="item.path">
            {{ renderTitle(item.title) }}
          </a-breadcrumb-item>
        </template>
        <a-breadcrumb-item @click="emit('goBack')" :style="title ? TabStyle : null">
          {{ renderTitle(currentItem.title) }}
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          {{ title }}
        </a-breadcrumb-item>
      </a-breadcrumb>
      <slot name="back"/>
      </a-flex>
      <div flex justify-between>
<!--                <div flex items-center my-4px of-hidden>-->
<!--                  <slot name="title">-->
<!--                    <span text-20px line-height-32px mr-12px mb-0 truncate font-600>{{ renderTitle(title ?? currentItem.title) }}</span>-->
<!--                  </slot>-->
<!--                </div>-->
        <div>
          <slot name="extra" />
        </div>
      </div>
      <div v-if="slots.content || slots.extraContent" pt-12px>
        <div flex w-full>
          <div flex-auto>
            <slot name="content" />
          </div>
          <div flex-shrink-0>
            <slot name="extraContent" />
          </div>
        </div>
      </div>
      <slot name="footer" />
    </div>
    <div :class="contentCls" style="margin-top: 4px; padding: 16px 24px;flex-grow: 1;overflow-y: scroll;">
      <slot />
    </div>
  </div>
</template>
<style scoped lang="less">
.top-box{
  padding: 0 24px 16px 24px;
  position: sticky;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  flex-grow: 0;
  flex-shrink: 0;
}
.ant-pro-page-container{
  height: calc(100vh - 112px);
  display: flex;
  flex-direction: column;
}
</style>
