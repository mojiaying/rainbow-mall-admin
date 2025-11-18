<script setup lang="tsx">

import MyPage from "@/components/my-page.vue";
import { CustomColumnsType } from "ant-design-vue/es/table";
import {activeThirdPartyApi,  thirdPartyApi } from "@/api/publicsetting.ts";
import { ref } from 'vue';
import {myConfirm} from "@/pages/merchant/index";
import VendorEdit from "@/pages/settings/public-setting/components/vendor_edit.vue";
import {accountListApi} from "@/api/system/account.ts";

const loading = ref(false)
const status = ref('')
const myPage = ref<InstanceType<typeof MyPage>>()
const editRef = ref<InstanceType<typeof VendorEdit>>()

// 获取用户账号列表
const accountList = ref<any[]>([])
async function getAccountList(){
  const res = await accountListApi({pageSize: 999})
  accountList.value = res?.data.map((item:any)=>{
    let account = item.attach?.account?.username
    if(account) return {label: account, value:item.id}
  }) || []

}
getAccountList()
// 状态切换 配置（getList 入参加状态）= = = = = = = =》
const columns: CustomColumnsType<any>[] = [
    {
    title: '三方商城名称',
    dataIndex: 'name',
  },
  {
        title: 'API密钥',
    dataIndex: 'api',
    },
  {
      title: '资金账户编码',
      dataIndex: 'accountCode',
    },
  {
    title: '登录账号',
    dataIndex: 'username',
  },
  {
    title: '开启状态',
    dataIndex: 'cycle',
    customRender: (row: any) =>  {
      let color = row.record?.status == 1? '#246700' : '#f5222d'
      return <div style={{color: color}}>{row.record?.status == 0 ? '禁用' : '启用'}</div>
    },
  },
    {
        title: '操作',
    dataIndex: 'action',
    buttons: [
      {
        label: '编辑',
        key: 'edit',
        onclick: async (row: any) => {
          // onOpen(row.record)
          editRef?.value?.open(row.record)
        },
      },
      {
        label: '禁用',
        key: 'status',
        mapName: (row: any) => {
          return row.record?.status == 1 ? '禁用' : '开启'
        },
        style: (row:any) => ({color: row.record?.status == 1? '#f5222d' : '#246700'}),
        onclick: async (row: any) => {
          let txt = row.record?.status == 1 ? '禁用' : '开启'
          myConfirm(`确认${txt} : ${row.record?.name}？`, txt,  () => stopItem(row.record))
        },
      },
    ],
    width: 200,
  },
]

async function stopItem(item: any) {
  let txt = item.status == 1 ? '停用' : '启用'
  let res = await activeThirdPartyApi({id: item.id, status: item.status == 1? 0 : 1})
  if(res) updatePage(`${txt}成功！`)
}
function statusChange(data: string) {
  status.value = data;
  useInit(loading,() =>myPage?.value?.init())
}

// 接口业务逻辑 = = = = = = = = = = = = = = = =》
// 列表
async function getList(params: any){
  const res = await thirdPartyApi(params)
  myPage.value?.setResData(res)
}
// 新增/编辑 弹窗 -------------------------------------------------------->
// 打开新增/编辑
function onOpen(){
  editRef?.value?.open()
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
               @openAdd="onOpen"
               @statusChange="statusChange"
               @getList="getList"></my-page>
    </page-container>
    <VendorEdit ref="editRef" @updatePage="updatePage" :accountList="accountList"/>
  </div>
</template>

