<script setup lang="ts">
import {createStarApi, deleteStarApi, starListApi, updateStarApi} from "@/api/star.ts";
import MyPage from "@/components/my-page.vue";
import FormModal from "@/components/form-modal.vue";
import {useConfirm} from "@/composables/global-config.ts";
import {ListParams} from "@/types/global";
import { CustomColumnsType } from "ant-design-vue/es/table";
import {useDataStore} from "@/stores/useDataStore.ts";
import {useIndex} from "@/composables/table-data.ts";
const myConfirm = useConfirm()
const dataSource = useDataStore()

const loading = ref(false)

// 子组件对象
const myPage = ref<InstanceType<typeof MyPage>>()
const formModal = ref<InstanceType<typeof FormModal>>()

// 组件配置 = = = = = = = = = = = = = = = =》
// 1.搜索组件配置
const searchConf = shallowReactive([
  {
    label: '演员名称',
    key: 'nameLike',
  }
])

// 2.table 表头配置
const columns: CustomColumnsType<any>[] = [
  {
    title: '序号',
    dataIndex: 'index',
    customRender: ({ index }:{index:number}) => useIndex(myPage.value?.pagination, index),
    width: 80,
  },
  {
    title: '演员名称',
    dataIndex: 'name',
  },
  {
    title: '头像',
    dataIndex: 'avatar',
    type: 'img',
    width: 100,
  },
  {
    title: '操作',
    dataIndex: 'action',
    buttons:[
      {
        label: '编辑',
        key: 'edit',
        onclick: async (row:any) =>{
          onOpen(row.record)
        },
      },
      {
        label: '删除',
        key: 'del',
        onclick: async (row:any) =>{
          myConfirm(`确认删除 ${row.record.name} 吗？`, '',()=> deleteItem(row.record.id))
        },
        style: {color:'red'}
      }
    ],
    width: 200,
  },
]
//3. 弹窗表单配置
const modalTitle = ref('新增')
const formConf = ref([
  {
    label: '名字',
    key: 'name',
    type: 'input',
    rules: [{ required: true, message: '请输入名字' }]
  },
  {
    label: '头像',
    key: 'avatar',
    type: 'img',
    rules: [{ required: true, message: '请上传头像' }]
  },
])
const initData = {name: undefined, avatar:'' , id: undefined}
let curItem = ref(initData)
function onOpen(item?:any){
  modalTitle.value = item ? '编辑' : '新增'
  curItem.value = item ? {...item} : {...initData}
  formModal?.value?.open()
}

// 接口业务逻辑 = = = = = = = = = = = = = = = =》
// 列表
async function getList(params:ListParams){
  const res = await starListApi(params)
  myPage.value?.setResData(res)
}
// // 创建
async  function editItem(){
  let avatar = curItem.value.avatar
  if(avatar && Array.isArray(avatar) && avatar?.length > 0) {
    curItem.value.avatar = avatar[0]
  }
  const res = curItem.value.id ?  await updateStarApi(curItem.value) :  await createStarApi(curItem.value)
  if(res) {
    dataSource.setFlagChange('stars', true)
    await useInit(loading,getList, curItem.value.id ? '更新成功': '新增成功')
    formModal?.value?.close()
  }
}
// // 删除
async function deleteItem(id:string){
  const res = await deleteStarApi(id)
  if(res) await useInit(loading,getList, '删除成功')
}
</script>

<template>
  <div>
  <page-container>
    <my-page ref="myPage"
             :searchConf="searchConf"
             :loading="loading"
             :columns="columns"
             @openAdd="onOpen"
             @getList="getList"></my-page>
    <FormModal ref="formModal" :title="modalTitle" :formConf="formConf" :formModal="curItem" @onOk="editItem"></FormModal>
  </page-container>
  </div>
</template>
