<script setup lang="ts">
import MenuTree from "@/pages/settings/system/components/setting-auth/menu-tree.vue";
import {updateRoleMenuApi} from "@/api/system/roles.ts";
const emit = defineEmits(['updatePage'])
// 备用数据源
let allIds:string[] = []
let IdMapList:{[x:string]: any} = {}
// 获取菜单数据 ===================》
const dataSource = useDataStore()
const menuList = ref([...(dataSource.menuList || [])])
async function getDeptData(){
  if(!dataSource.menuList?.length) {
    await dataSource.getMenuList()
  }
  menuList.value = [...(dataSource.menuList || [])]
  getIds(menuList.value)
  delParent0()
}
getDeptData()

const checkedList = ref<string[]>([]) // 选中值
let curRole = ref<{[x:string]: any}>({})
let checkedParent:string[] = [] // 父节点
let curChildren:string[] = [] // 子节点
let curChecked:boolean=false // 选中状态
let checkAll = ref<boolean>(false)  // 全选
// ！！！！改变选中值 ----------------------------》
function handleCheck(e:any){
  //1.  状态为真，把当前选中值所有父节点和子节点添加到选中值中
  if(curChecked) {
    checkedList.value = [...new Set([...e, ...checkedParent, ...curChildren])]
  } else {
    // 状态为真，把当前选中值子节点 和 没有子节点的父节 点添加到选中值中
    hasSelectedChild(checkedParent, e) // 查找没有选中子节点的父节点
    let attachIds = [...checkedParent, ...curChildren]
    checkedList.value = e.filter((item:string)=> !attachIds.includes(item))
  }
  checkedParent = []
  curChildren = []
}
function handleFindParent(e:any){
  if(e?.target?.value) checkedParent = findParent(e.target.value, [])
    curChecked = e?.target?.checked
}
function handleFindChild(e:any){
  let curItem = IdMapList[e.target.value]
  curChecked = e.target.checked
  curChildren =  getChildren(curItem, [])
}
function updateCheckItem(e:any){
  handleFindParent(e)
  handleFindChild(e)
}
// 找出：没有选中子节点的父节点) ----------------------------》
function hasSelectedChild(parents: any, checkedList: any){
  if(!parents?.length) return;
  // 遍历父亲判断是否有选中子节点
  let uncheckedIdx = null
  for(let i=0;i<parents.length;i++){
    // 1.获取当前项目
    let curParent = IdMapList[parents[i]]
    // 2. 找出所有子节点
      let childIds = getChildren(curParent, [])
      // 3. checkedList 中是否有子节点
      let hasCheckedChild = checkedList.filter((item:string)=> childIds.includes(item))
      if(!hasCheckedChild?.length) {
        uncheckedIdx=i
      } else {
        if(i>0 && hasCheckedChild?.length ==1) {
          uncheckedIdx=i
        } else {
          break
        }
      }
    }
    checkedParent = uncheckedIdx != null ? checkedParent.slice(0, uncheckedIdx+1) : []
}
// 获取父节点 ----------------------------》
function findParent(id:string, parentIds:string[] = []){
  //  当前选中值 =》 父节点ID
  let curItem = IdMapList[id]
  if(curItem?.parentId && curItem?.parentId != 0) {
    parentIds.push(curItem?.parentId)
    findParent(curItem?.parentId, parentIds)
  }
  return parentIds
}
// 获取子节点 ----------------------------》
function getChildren(curItem:any, children:any[]){
  if(curItem?.children?.length) {
    let temp  = curItem.children.map((item:any)=> {
      if(item?.children?.length) {
        item?.children?.map((i:any) => {
          children.push(i.value)
          getChildren(i, children)
        })
      } else {
        if(item?.btns?.length) mapIds(item?.btns, children)
        if(item?.tabs?.length) mapIds(item?.tabs, children)
      }
      return item.value
    })
    children.push(...temp)
  } else {
    if(curItem?.btns?.length) mapIds(curItem?.btns, children)
    if(curItem?.tabs?.length) mapIds(curItem?.tabs, children)
  }
  return children
}
function mapIds(arr: any[], children:any[]){
  let ids: string[] = arr.map((item:any)=> {
    return item.value
  })
  children.push(...ids)
}
// 更新权限接口 ----------------------------》
async function updateMenuIds(){
  let res = await updateRoleMenuApi({id: curRole?.value?.id, menuIds: checkedList.value})
  if(res) {
    close()
    emit('updatePage', '权限更新成功！')
  }
}
// 全选 ---------------------》
watch(checkAll, (newVal)=> {
  if(newVal) {
      checkedList.value = [...allIds]
  } else {
    checkedList.value = []
  }
})
// 获取所有的id  并保存到allIds中 和 ID 映射表中
function getIds(item:any){
  let temp = item.map((item:any)=> {
    if(item.children?.length) getIds(item.children)
    if(item.btns?.length) getIds(item.btns)
    if(item.tabs?.length) getIds(item.tabs)
    IdMapList[item.value] = item
    return item.value
  })
  allIds = [...allIds, ...temp]
}

// 删除父节点0 ===========================》
function delParent0(){
  if(menuList?.value?.length && menuList?.value?.[0].value == 0) {
    menuList?.value.shift()
  }
}
delParent0()
// 打开弹窗 ===========================》
const showModal = ref(false)
function open(item:any){
  showModal.value = true
  curRole.value = item
  checkedList.value = item.menuIds || []
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
  <a-modal  v-model:open="showModal" :title="`权限维护 : ${curRole?.name}`" width="1200px" @ok="updateMenuIds">
   <div style="max-height: 76vh;overflow-y: auto;">
    <div style="padding: 10px 20px">
      <a-checkbox v-model:checked="checkAll">
        <span>全选</span>
      </a-checkbox>
    </div>
    <a-checkbox-group v-model:value="checkedList" style="width: 100%" @change="handleCheck">
      <a-flex class="menu-box">
        <div class="row1" v-for="item in menuList">
          <a-flex class="flex-row">
            <MenuTree :item="item" @updateCheckItem="updateCheckItem" @handleFindParent="handleFindParent"></MenuTree>
          </a-flex>
        </div>
      </a-flex>
    </a-checkbox-group>
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
  width: 100%;
  margin: 6px;
}
.row1{
  border-top: 1px solid #ddd;
  &:first-of-type{
    border-top: none;
  }
}
</style>