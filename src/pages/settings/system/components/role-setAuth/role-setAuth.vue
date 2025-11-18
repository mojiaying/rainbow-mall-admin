<script setup lang="ts">
/* 页面数据初始化：
 1. 当前角色 : curRole (标题展示)
 2. 所有菜单数据 : menuList （页面渲染）
 3. 弹窗开关 : showModal （控制弹窗）
 4. 菜单ID映射表: menuIdsMap （用于修改checked）
 5. 选中菜单ids : checkedList （用于接口传参）
*/
import MenuTree from "@/pages/settings/system/components/role-setAuth/menu-tree.vue";
import {updateRoleMenuApi} from "@/api/system/roles.ts";

const emit = defineEmits(['updatePage'])
const dataSource = useDataStore()

const curRole = ref<any>({})
const menuList = ref<any>([...(dataSource.menuList || [])])
const showModal = ref(false)

let menuIdsMap: {[x:string]: any} = {}
let checkedList: string[] = []
/* 初始化菜单数据 --------------------------------------------------------》
* */
function setIdMap(item:any) {
  item.forEach((item:any) => {
    menuIdsMap[item.value] = item
    if(item.children?.length) setIdMap(item.children)
    if(item.btns?.length) setIdMap(item.btns)
    if(item.tabs?.length) setIdMap(item.tabs)
  })
}
async function getMenuData(){
  // 1. 缓存里取菜单数据
  if(!dataSource.menuList?.length) {
    await dataSource.getMenuList()
  }
  menuList.value = [...(dataSource.menuList || [])]

// 3. 删除父节点0
  if(menuList?.value?.length && menuList?.value?.[0].value == 0) {
    menuList.value.shift()
  }
  // 2. 遍历菜单数据 生成菜单ID 映射表
  menuIdsMap = {}
  setIdMap(menuList.value)
}
getMenuData()

/* 2. 弹窗打开关 ---------------------------------------------------------》
 *  页面回显步骤 ：
* */
function open(item:any){
  // 1. 取当前角色
  curRole.value = item
  // 2. 取菜单权限Ids列表
  checkedList = item.menuIds || []
  // 3. 遍历菜单权限Ids列表 并修改菜单ID映射表的checked状态
  for(let i in menuIdsMap){
    let item = menuIdsMap[i]
    item.checked = checkedList?.includes(item.value)
  }
  // 4. 打开弹窗
  showModal.value = true
}
/* 4.checked 逻辑：
* */
/* 全选逻辑：
* */
const checkAll = ref(false)
function handleCheckAll(){
  for (let item in menuIdsMap){
    menuIdsMap[item].checked = checkAll.value;
  }
}
/* 5. 提交逻辑：
* */
async function updateMenuIds(){
  checkedList = Object.values(menuIdsMap).filter((item:any)=> item.checked).map(item => item.value)
  let res = await updateRoleMenuApi({id: curRole?.value?.id, menuIds: checkedList})
  if(res) {
    close()
    emit('updatePage', '权限更新成功！')
  }
}
/* 核心： checked 状态更新： -------------------------------------------------》
* 1. 更新父状态
*   a. checked: true ： 全部选中
*   b. checked: false ： 取消选中没有选中子的父节点
* 2. 更新子状态： 全部选中/取消
* */
function updateParent({item, target}:any){
  if(item.parentId === '0') return
  let parent = menuIdsMap[item.parentId]
  if(target.checked) {
    parent.checked = true
  } else {
    if(!parent.children?.some((i:any) => i.checked == true)){
      parent.checked = false
    }
  }
  if(item?.value?.parentId !== '0') {
    updateParent({item: parent, target})
  }
}
/* 更新 子checked 状态：
* */
function updateChild({item, target}:any){
  let checked = target.checked
  item.children?.forEach((child:any)=> {
    child.checked = checked
    updateChild({item:child, target})
  })
  item.tabs?.forEach((child:any)=> child.checked = checked)
  item.btns?.forEach((child:any)=> child.checked = checked)
}
function updateCheck(e:any){
  updateChild(e)
  updateParent(e)
}
/* 关闭弹窗， 重置页面数据：-----------------------------------------》
* */
function close(){
  curRole.value = {}
  checkedList = []
  showModal.value = false
}
/* 6. 传父组件的方法：------------------------------------------------》
* */
defineExpose({
  open,
  close
})
</script>

<template>
<a-modal v-model:open="showModal" :title="`权限维护 : ${curRole?.name}`" width="1200px" @ok="updateMenuIds">
  <div style="max-height: 78vh;">
    <div style="padding: 10px;">
      <a-checkbox v-model:checked="checkAll" @change="handleCheckAll">全选</a-checkbox>
    </div>

    <a-flex class="menu-box">
      <div class="row1" v-for="item in menuList">
        <a-flex class="flex-row" style="flex-grow: 1;">
          <MenuTree :item="item" :checkAll="checkAll" @updateCheck="updateCheck" @updateParent="updateParent"></MenuTree>
        </a-flex>
      </div>
    </a-flex>
  </div>
</a-modal>
</template>

<style scoped lang="less">
.menu-box{
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow-x: hidden;
  overflow-y: auto;
  height: 70vh;
  box-shadow: 1px 1px 5px #ccc;;
  width: 100%;
}
.row1{
  border-top: 1px solid #ddd;
  width: 100%;
  &:first-of-type{
    border-top: none;
  }
}
</style>