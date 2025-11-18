<script setup lang="ts">
import type {PaginationProps} from "ant-design-vue";
import {PageList} from "@/types/global";
import Search from "@/components/search.vue";
import {PlusOutlined} from "@ant-design/icons-vue";
import {useMenuAccess} from "@/composables/access.ts";
const { hasAccess } = useMenuAccess()
const route = useRoute()
const TabList = route.meta?.tabs || []
const btnList = route.meta?.btns || []
const loading = ref(false)
const tableSize = ref<string>('large')
const searchRef = ref<InstanceType<typeof Search>>()
let props = defineProps(['searchConf', 'columns', 'status', 'loading', 'statusList', 'hideAddBtn','exportFile','addBtnTxt', 'rowSelection', 'tableIndex'])
const emit = defineEmits(["getList", 'openAdd', "statusChange"])
const curStatus = ref<any>(props.status || '')
function getStatusAccessList(){
  let list = props.statusList
  let firstAccessItem = undefined // 第一个有权限的tab
  let statusHasAccess // 当前选中的tab是否有权限
  for(let item in list){
    let access = hasAccess(item, TabList)
    // 1. 给每个tab添加权限属性
    list[item].access = access
    // 2. 查找第一个有权限的tab
    if(!firstAccessItem && access) firstAccessItem = list[item]
    // 3. 当前选中的tab是否有权限
    if(curStatus.value == list[item].value && !access) {
      console.log('当前选中的tab:', list[item], '没有权限')
      statusHasAccess = false
    }
  }
  // 4. 当前选中的tab没有权限，则切换到第一个有权限的tab
  if(statusHasAccess == false) {
    emit('statusChange', firstAccessItem?.value)
  }
}
getStatusAccessList()

const filterColumns = ref()
const pagination = reactive<PaginationProps>({
  pageSize: 10,
  current: 1,
  total: 0,
  pageSizeOptions: ['10', '20', '30', '40'],
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: total => `总数：${total}`,
  onChange(current, pageSize) {
    pagination.pageSize = pageSize
    pagination.current = current
    useInit(loading, init)
  },
})
const dataSource = ref<any[]>([])
let searchData:{[key: string]: any} = {}

function setResData<T>(data:PageList<T>) {
  if(Array.isArray(data)) {
    dataSource.value = data
  } else {
    pagination.total = data?.count
    dataSource.value = data?.data || data?.presales || []
  }

}
function setList<T>(data:T[]) {
  dataSource.value = data
}

function init(params?:any){
  emit('getList', {pageIndex:pagination.current, pageSize:pagination.pageSize, ...searchData, ...params})
}

function handleSearch(data:any){
  searchData = data
  useInit(loading, init)
}
function handleOpen(){
  emit('openAdd')
}
function handleRefresh(){
  useInit(loading, init)
}

function changeTableSize(value:any){
  tableSize.value = value
}
function initCurrent() {
  pagination.current = 1
}
useInit(loading, init)

defineExpose({
  setResData,
  setList,
  setSearchData,
  pagination,
  init
})
function switchTab(e: any) {
  pagination.current = 1
  emit('statusChange', e.target.value)
}
function setSearchData(key:string){
  return searchRef.value?.setSearchData(key)
}
</script>

<template>
  <Access :access="route.path">
    <a-flex class="page">
  <Search v-if="searchConf" ref="searchRef" :exportFile="exportFile" :searchConf="searchConf" @onSearch="handleSearch" @initCurrent="initCurrent">
    <template #searchSlot="{item, formModal}">
      <!--   插槽-->
      <slot  :name="item.slot" :item="item" :formModal="formModal">
      </slot>
    </template>
  </Search>

<div ref="TableWrap" class="table-wrap">
  <a-card>
    <template #title>
      <a-radio-group v-if="statusList" v-model:value="curStatus" button-style="solid" @change="switchTab">
        <a-radio-button v-for="(value, key) in statusList" :key="key" :disabled="!value?.access" :value="value.value">
          <a-space>{{value.label}}<a-badge :number-style='{color: "#000", background: "#ccc"}' :count="isNaN(value?.count) ? 0 : value?.count" :overflow-count="9999" /></a-space>
        </a-radio-button>
      </a-radio-group>
    </template>
    <template #extra>
      <a-flex>
        <a-space size="middle">
          <slot name="btns" :access="route.meta" :hasAccess="hasAccess"></slot>
      <a-button v-if="!hideAddBtn && hasAccess('add', btnList)" type="primary" @click="handleOpen">
        <template #icon>
          <PlusOutlined />
        </template>
        {{addBtnTxt || '新增'}}
      </a-button>
      <TableSetting ref="refSetting" :columns="columns"
                    @onRefresh="handleRefresh"
                    v-model:filterColumns="filterColumns"
                    storeKey="starColumns"
                    @changeTableSize="changeTableSize"></TableSetting>
        </a-space>
      </a-flex>
    </template>
    <BaseTable :loading="loading" :columns="filterColumns"  :rowSelection="rowSelection"  :data-source="dataSource" :pagination="pagination" :tableSize="tableSize" :tableIndex="tableIndex">
    </BaseTable>
  </a-card>
</div>
    </a-flex>
  </Access>
</template>

<style scoped lang="less">
.page{
  flex-direction: column;
  height: 100%;
  .table-wrap{
    flex-grow: 1;
  }
}
</style>