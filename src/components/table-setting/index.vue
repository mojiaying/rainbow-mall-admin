<script setup lang="ts">
import { ReloadOutlined, ColumnHeightOutlined, SettingOutlined} from '@ant-design/icons-vue'
import type {MenuProps} from "ant-design-vue";

const props = defineProps(['columns', 'filterColumns', 'storeKey'])
const emits = defineEmits(['update:filterColumns', 'onRefresh', 'changeTableSize'])
function handleRefresh(){
  emits('onRefresh')
}
// 密度 setting =======================>
const tableSize = ref<string[]>(['large'])
const sizeItems = ref<MenuProps['items']>([
  {
    key: 'large',
    label: '默认',
    title: ''
  },{
    key: 'middle',
    label: '中等',
    title: '中等'
  },{
    key: 'small',
    label: '紧凑',
    title: '紧凑'
  }
])
/**
 * 密度切换
 *
 */
const handleSizeChange: MenuProps['onClick'] = (e) => {
  emits('changeTableSize', e.key)
}


/**
 * 过滤 = = =  = = = = = == = = == = == = == = = = = == = = ==>
 *
 */
const visible = ref(false)
function filterAction(value: string[]) {
  // 为true时，循环遍历的值会暴露出去
  return props.columns?.filter((item:any) => value.includes(item?.dataIndex))
}
const getCheckList = ref(props.columns?.map((item:any) => item?.dataIndex))
// 设置列表
const state = reactive({
  indeterminate: false,
  checkAll: true,
  checkList: getCheckList.value,
})

watch(()=> props.columns , () => {
  emits('update:filterColumns', filterAction(getCheckList?.value))
})
// 备份columns
emits('update:filterColumns', filterAction(getCheckList?.value))
const options = computed(() => {
  let opt = props.columns.map((item:any) => {
    if (item.dataIndex === 'action') {
      return {
        label: item.title,
        value: item.dataIndex,
        disabled: true,
      }
    }
    return {
      label: item.title,
      value: item.dataIndex,
    }
  })
  return opt
})
/**
 * 全选/反选事件
 *
 */

function handleCheckAllChange(e: any) {
  Object.assign(state, {
    checkList: e.target.checked ? getCheckList.value : [],
    indeterminate: true,
  })
  let temp = e.target.checked ? filterAction(getCheckList.value) : props.filterColumns.filter((item:any) => item.dataIndex === 'action')
  emits('update:filterColumns', temp)
}
/**
 * checkbox点击事件
 *
 */
function handleCheckChange(value: any) {
  const filterValue = filterAction(value)
  emits('update:filterColumns', filterValue)
}
/**
 * 重置事件
 *
 */
function handleResetChange() {
  state.checkList = getCheckList.value
  emits('update:filterColumns', filterAction(getCheckList.value))
}

</script>

<template>
  <a-space size="middle">
    <a-tooltip title="刷新">
      <ReloadOutlined @click="handleRefresh"/>
    </a-tooltip>
    <a-tooltip title="密度">
      <a-dropdown trigger="click">
        <ColumnHeightOutlined/>
        <template #overlay>
          <a-menu v-model:selected-keys="tableSize" :items="sizeItems" @click="handleSizeChange"/>
        </template>
      </a-dropdown>
    </a-tooltip>
    <a-tooltip title="设置列表">
      <a-dropdown v-model:open="visible" trigger="click">
        <SettingOutlined/>
        <template #overlay>
          <a-card>
            <template #title>
              <a-checkbox
                  v-model:checked="state.checkAll" :indeterminate="state.indeterminate"
                  @change="handleCheckAllChange"
              >
                列选择
              </a-checkbox>
            </template>
            <template #extra>
              <a-button type="link" @click="handleResetChange">
                重置
              </a-button>
            </template>
            <a-checkbox-group
                v-model:value="state.checkList" :options="options"
                style="display: flex; flex-direction: column;" @change="handleCheckChange"
            />
          </a-card>
        </template>
      </a-dropdown>
    </a-tooltip>
  </a-space>
</template>

<style scoped lang="less">

</style>