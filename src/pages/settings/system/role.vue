<script setup lang="tsx">
import MyPage from "@/components/my-page.vue";
import { CustomColumnsType } from "ant-design-vue/es/table";
import EditMenu from "@/pages/settings/system/components/edit-menu.vue";
import {useConfirm} from "@/composables/global-config.ts";
import { deleteRoleApi, roleListApi} from "@/api/system/roles.ts";
import EditRole from "@/pages/settings/system/components/edit-role.vue";
import SettingAuth from "@/pages/settings/system/components/setting-auth/index.vue";
import Detail from "@/pages/settings/system/components/role-detail.vue";
import RoleSetAuth from "@/pages/settings/system/components/role-setAuth/role-setAuth.vue";
const myConfirm = useConfirm()
const loading = ref(false)
// 子组件对象
const myPage = ref<InstanceType<typeof MyPage>>()
const editRef = ref<InstanceType<typeof EditMenu>>()
const detailRef = ref<InstanceType<typeof Detail>>()
const setAuthRef = ref<InstanceType<typeof SettingAuth>>()
const roleSetAuthRef = ref<InstanceType<typeof RoleSetAuth>>()

// 组件配置 = = = = = = = = = = = = = = = =》
// 2.table 表头配置
const columns: CustomColumnsType<any>[] = [
  {
    title: '分组名称',
    dataIndex: 'name',
  },
  {
    title: '分组描述',
    dataIndex: 'desc',
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 250,
    showAll: true,
    buttons: [
      {
        label: '详情',
        key: 'detail',
        onclick: async (row: any) => {
          detailRef.value?.open(row.record)
        },
      },
      {
        label: '复制',
        key: 'copy',
        onclick: async (row: any) => {
          editRef.value?.open({role:row.record, copyRole: true})
        },
      },
      {
        label: '权限维护',
        key: 'roleEdit',
        onclick: async (row: any) => {
          // setAuthRef.value?.open(row.record)
          roleSetAuthRef.value?.open(row.record)
        },
      },
      {
        label: '编辑',
        key: 'edit',
        onclick: async (row: any) => {
          editRef.value?.open({role: row.record})
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
  let res = await deleteRoleApi(id)
  if(res) updatePage('删除成功！')
}
// 接口业务逻辑 = = = = = = = = = = = = = = = =》
// 列表
async function getList(params: any){
  const res = await roleListApi(params)
  if(res){
    myPage.value?.setResData(res)
  }
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
    <SettingAuth ref="setAuthRef" @updatePage="updatePage"></SettingAuth>
    <RoleSetAuth ref="roleSetAuthRef" @updatePage="updatePage"></RoleSetAuth>
    <EditRole ref="editRef" @updatePage="updatePage"></EditRole>
    <Detail ref="detailRef"></Detail>
  </page-container>
  </div>
</template>
