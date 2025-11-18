<script setup lang="ts">
import { cloneDeep } from 'lodash-es';

let curRole = ref<{[x:string]: any}>({})
const expanseKeys = ref<string[]>([])
// 1. 获取菜单数据 ===================》
const dataSource = useDataStore()
const hasCountExpanseKeys = ref(false)
const menuList = ref<any>(cloneDeep(dataSource.menuList) || [])
async function getDeptData(){
  hasCountExpanseKeys.value = false
  if(!dataSource.menuList?.length) {
    await dataSource.getMenuList()
  }
  let allMenu = cloneDeep(dataSource.menuList) || []
  menuList.value = filterMenu(curRole?.value?.menuIds, allMenu)
  hasCountExpanseKeys.value = true
}

// 2. 过滤有权限的菜单 ===================》
function filterMenu(menuIds: string[], menuList:any){
  expanseKeys.value = menuIds
  let newMenu = menuList.filter((item:any)=> {
    let inAsscess = item?.value!= '0' && menuIds?.includes(item?.value)
    if(inAsscess) {
      item.children = item?.children?.filter((child:any)=> {
        return menuIds?.includes(child?.value)
      })
      return item
    }
  })
  expanseKeys.value = []
  filterExpanseKeys(newMenu)
  return newMenu
}
function filterExpanseKeys(menu:any){
  menu.forEach((item:any)=>{
    expanseKeys.value.push(item.value)
  })
}
// 打开弹窗 ===========================》
const showModal = ref(false)
function open(item:any){
  showModal.value = true
  curRole.value = item
  getDeptData()
}
function close(){
  showModal.value = false
}
defineExpose({
  open,
  close
})
</script>

<template>
  <a-modal  v-model:open="showModal" :title="`权限详情 : ${curRole?.name}`" width="1200px" :footer="false">
   <div style="max-height: 76vh;overflow-y: auto;">
      <a-flex class="menu-box">
        <a-tree v-if="menuList?.length"
            class="draggable-tree"
            :default-expanded-keys="expanseKeys"
            :field-names="{title: 'label', key: 'value', children: 'children'}"
            :tree-data="menuList">
          <template #title="node">
            <a-flex class="node" :style="{padding: !node?.children?.length ? '10px' : '0'}">
              <div style="min-width: 90px;">{{ node.label }}</div>
              <div v-if="!node?.children?.length" style="margin-left: 10px">
                <a-flex class="line-box" v-if="node?.tabs?.length">
                  <div px-2>tab签：</div>
                  <div v-for="tab in node.tabs" px-2 class="tab">{{tab.label}}</div>
                </a-flex>
                <a-flex v-if="node?.btns?.length" class="line-box">
                  <div px-2>按钮：</div>
                  <div v-for="btn in node.btns" px-2 class="btn">{{ btn.label}}</div>
                </a-flex>

              </div>
            </a-flex>
          </template>
        </a-tree>
        <a-empty :description="`暂无权限`" v-else></a-empty>
      </a-flex>
   </div>
  </a-modal>
</template>

<style scoped lang="less">
.menu-box{
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 1px 1px 5px #ccc;;
  margin-top: 10px;
  padding: 10px;
  width: 100%;
  min-height: 300px;
}
.row1{
  border-top: 1px solid #ddd;
  &:first-of-type{
    border-top: none;
  }
}
.line-box{
  width: 100%;
  gap: 6px;
  padding-bottom: 10px;
}
.node{
  flex-direction: row;
  position: relative;
  gap: 10px;
  width: 100%;
}
.tab{
  background: #eee;
  border-radius: 20px;
  padding: 4px 16px;
}
.btn{
  color: var(--pro-ant-color-primary);
}
.draggable-tree {
  :deep(.ant-tree-node-content-wrapper:hover) {
    background-color: transparent !important; /* 透明背景 */
  }
}
</style>