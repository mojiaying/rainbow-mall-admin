<script setup lang="tsx">
import MyPage from "@/components/my-page.vue";
import { CustomColumnsType } from "ant-design-vue/es/table";
import {useConfirm} from "@/composables/global-config.ts";
import {deleteJobApi, jobListApi} from "@/api/system/job.ts";
import EditJob from "@/pages/settings/system/components/edit-job.vue";
const myConfirm = useConfirm()

const loading = ref(false)

// 子组件对象
const myPage = ref<InstanceType<typeof MyPage>>()
const editRef = ref<InstanceType<typeof EditJob>>()

// 组件配置 = = = = = = = = = = = = = = = =》
// 2.table 表头配置
const columns: CustomColumnsType<any>[] = [
  {
    title: '岗位名称',
    dataIndex: 'name',
  },
  {
    title: '岗位描述',
    dataIndex: 'desc',
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 120,
    buttons: [
      {
        label: '编辑',
        key: 'edit',
        onclick: async (row: any) => {
          editRef.value?.open(row.record)
        },
      },
      {
        label: '删除',
        key: 'del',
        style: {color:'red'},
        onclick: async (row: any) => {
          myConfirm(`确定删除 ${row.record?.name}？`,'删除',  () => deleteItem(row.record?.id))
        },
      }]
  }
]
async function deleteItem(id: string) {
  let res = await deleteJobApi(id)
  if(res) updatePage('删除成功！')
}
// 接口业务逻辑 = = = = = = = = = = = = = = = =》
// 列表
async function getList(params: any){
  const res = await jobListApi(params)
  myPage.value?.setResData(res)
}
// 新增 编辑 查看 ---------------------------------------------------》
// 打开新增页面
function createMenu(){
  editRef.value?.open()
}
function updatePage(msg: string) {
  useInit(loading, () => myPage?.value?.init(), msg)
}
</script>

<template>
  <div>
  <page-container>
    <my-page ref="myPage"
             :loading="loading"
             :columns="columns"
             @openAdd="createMenu"
             @getList="getList"></my-page>
    <EditJob ref="editRef" @updatePage="updatePage"></EditJob>
  </page-container>
  </div>
</template>
