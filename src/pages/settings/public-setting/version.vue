<script setup lang="tsx">
import MyPage from "@/components/my-page.vue";
// import {MerchantListParams, storeListApi} from "@/api/merchant.ts";
import { CustomColumnsType } from "ant-design-vue/es/table";
import { myConfirm } from "@/pages/merchant/index/index.tsx";
import {
  appVersionApi,
  appVersionCreateApi,
  appVersionUpdateApi,
  appVersionDeleteApi,
  appVersionCreateParams,
  appVersionOnApi
} from "@/api/publicsetting.ts";
import { FormConfig } from "@/types/global.js";
import FormModal from '@/components/form-modal.vue'
const loading = ref(false)
const myPage = ref<InstanceType<typeof MyPage>>()
/// 1.搜索组件配置
// 2.table 表头配置
const columns: CustomColumnsType<any>[] = [
  {
    title:'版本号',
    dataIndex: 'version',
  },{
    title: '更新内容',
    dataIndex: 'remark',
    width: 200
  },{
    title: '下载地址',
    dataIndex: 'installPack',
  },
  {
    title: '强制更新',
    dataIndex: 'forceRefresh',
    customRender: ({ text }) => text ? '是' : '否'
  },
  {
    title: '系统',
    dataIndex: 'platform',
  },
  {
    title: '安装包',
    dataIndex: 'size',
  },
  {
    title: '创建时间',
    dataIndex: 'gmtCreated',
  },
 {
    title: '操作',
    dataIndex: 'action',
    buttons: [
       {
        label: '删除',
         key: 'del',
        onclick: async (row: any) => {
          myConfirm(`确认删除版本 ${row.record.version} 吗？`, '', () => deleteItem(row.record.id))
        },
        style: {color: 'red'}
      },
      {
        label: '编辑',
        key: 'edit',
        onclick: async (row: any) => {
          onOpen(row.record)
        },
      },
      {
        label: '发布',
        key: 'issue',
        mapName: () => '发布',
        style: (row: any) => ({
          color: row.record.status == 1 ? 'gray' : '',
          cursor: row.record.status == 1 ? 'not-allowed' : 'pointer',
          pointerEvents: row.record.status == 1? 'none' : 'auto',
        }),
        onclick: async (row: any) => {
          appVersionOnApi(row.record.id).then(res => {
            if(res) useInit(loading,getList, '发布成功')
          })
        },
      },
    ]
  }
]

//  删除
async function deleteItem(id:string){
  const res = await appVersionDeleteApi(id)
  if(res) await useInit(loading,getList, '删除成功')
}
// 获取列表= = = = = = = = = = = = = = = =》
async function getList() {
  const res = await appVersionApi({pageIndex: 1, pageSize: 999})
  myPage.value?.setResData(res)
}

// 新增/编辑 弹窗 -------------------------------------------------------->
const formModal = ref<InstanceType<typeof FormModal>>()
const modalTitle = ref('新增')

// 表单配置模板
const formConf = ref<FormConfig[]>([
  {
    label: '版本号',
    key: 'version',
    rules: [{required: true, message: '填写版本号'}],
  },
  {
    label: '下载地址',
    key: 'installPack',
    rules: [{required: true, message: '填写下载地址'}],
  },
  {
    label: '更新内容',
    key: 'remark',
    rules: [{required: true, message: '填写更新内容'}],
  },
  {
    label: '是否强制更新',
    key: 'forceRefresh',
    type: 'radio',
    options: [
      {label: '是', value: true},
      {label: '否', value: false},
    ],
    rules: [{required: true, message: '请选择是否强制更新'}],
  },

  {
    label: '系统类型',
    key: 'platform',
    type: 'radio',
    options: [
      {label: '安卓', value: 'ANDROID'},
      {label: 'IOS', value: 'IOS'},
    ],
    rules: [{required: true, message: '请选择系统类型'}],
  },
])
// 初始化表单数据
const initData: appVersionCreateParams = {
  version: '',
  download: '',
  remark: '',
  id: undefined,
  installPack: '',
  platform: undefined,
  forceRefresh: undefined,
}
let curItem = ref<appVersionCreateParams>(initData)
// 打开新增/编辑
function onOpen(item?:any){
  modalTitle.value = item ? '编辑版本' : '新增版本'
  curItem.value = item ? {...item} : {...initData}
  formModal?.value?.open()
}
//提交 创建/编辑 表单
async function onSubmit(){
  let params = {...curItem.value}
  const res =  params.id ? await appVersionUpdateApi(params) : await appVersionCreateApi(params)
  res && formModal?.value?.close()
  if(res){
    await useInit(loading,getList, params.id ? '版本更新成功': '版本创建成功')
    formModal?.value?.close()
  }
}
</script>


<template>
  <div>
    <page-container>
      <my-page ref="myPage"
               :loading="loading"
               :columns="columns"
               :addBtnTxt="'添加'"
               @openAdd="onOpen"
               @getList="getList"></my-page>
    </page-container>
    <FormModal ref="formModal" :title="modalTitle" :formConf="formConf" :formModal="curItem" @onOk="onSubmit">
    </FormModal>
  </div>
</template>