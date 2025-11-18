<script setup lang="ts">
import {useMenuAccess} from "@/composables/access.ts";

let props = defineProps(['btns', 'row'])
const { hasAccess } = useMenuAccess()
const route = useRoute()
const BtnCodes = route.meta?.btns || []
let btnNums = 0
props.btns.forEach((item: any) => {
  let show = typeof item?.show == "function"
      ? item.show(props?.row)
      : item.show ?? true
  item.showBtn = show && hasAccess(item?.key, BtnCodes)
  if(item.showBtn) btnNums++
})
let moreBtns = []
let showTowBtns = props.btns
if(btnNums > 4 && !props.row?.column?.showAll) {
  showTowBtns = props.btns.slice(0, 2)
  moreBtns = props.btns.slice(2)
}

</script>

<template>
  <div>
  <div v-if="btnNums<5">
    <a-flex>
    <span v-for="item in btns" >
      <slot :item="item"></slot>
    </span>
    </a-flex>
  </div>
    <div v-else>
      <a-flex>
      <span v-for="item in showTowBtns">
        <slot :item="item"></slot>
      </span>
      <a-dropdown v-if="!row?.column?.showAll">
        <template #overlay>
          <a-menu >
            <a-menu-item :key="item" v-for="item in moreBtns">
              <slot :item="item"></slot>
            </a-menu-item>
          </a-menu>
        </template>
        <a-button size="small">
          更多
        </a-button>
      </a-dropdown>
      </a-flex>
    </div>
  </div>
</template>

<style scoped lang="less">

</style>