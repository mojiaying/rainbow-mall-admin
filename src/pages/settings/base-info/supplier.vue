<script setup lang="tsx">
import MyPage from "@/components/my-page.vue";
import FormModal from "@/components/form-modal.vue";
import {useConfirm} from "@/composables/global-config.ts";
import {CustomColumnsType} from "ant-design-vue/es/table";
import {useDataStore} from "@/stores/useDataStore.ts";
import {
  createSupplierApi,
  deleteSupplierApi,
  enableSupplierApi,
  supplierPagetApi,
  updateSupplierApi
} from "@/api/supplier.ts";
const myConfirm = useConfirm()
const loading = ref(false)
const dataSource = useDataStore()
const myPage = ref<InstanceType<typeof MyPage>>()
// 组件配置 = = = = = = = = = = = = = = = =》
// 2.table 表头配置
const columns: CustomColumnsType<any>[] = [
  {
    title: '编号',
    dataIndex: 'code',
  },{
    title: '供应商名称',
    dataIndex: 'name',
    width: 200
  },{
    title: '联系人',
    dataIndex: 'contactName',
    customRender: ({record}) => record?.contact?.name,
  },
  {
    title: '联系电话',
    dataIndex: 'phone',
    customRender: ({record}) => record?.contact?.phone?.number,
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
  {
    title: '状态',
    dataIndex: 'enable',
    style: ({record}) => ({color: record?.enable ==  false? '#f5222d' : '#246700'}),
    mapName: ({record}) => record.enable === true ? '启用' : '禁用',
  },{
    title: '操作',
    dataIndex: 'action',
    buttons: [
      {
        label: '编辑',
        key: 'edit',
        onclick: async (row: any) => onOpen(row.record),
      },
      {
        label: '删除',
        key: 'del',
        onclick: async (row: any) => {
          myConfirm(`确认删除 供应商 ：${row.record.name} 吗？`, '', () => deleteItem(row.record.id))
        },
        style: {color: 'red'}
      },{
        label: '禁用',
        key: 'status',
        mapName: (row: any) => {
          return row.record?.enable == true ? '禁用' : '启用'
        },
        style: (row:any) => ({color: row.record?.enable == true? '#f5222d' : '#246700'}),
        onclick: async (row: any) => {
          let txt = row.record?.enable == true ? '禁用' : '启用'
          myConfirm(`确认${txt}供应商 ${row.record?.name}？`, txt,  () => enableItem(row.record))
        },
      },
    ]
  }
]

// 删除
async function deleteItem(id:string){
  const res = await deleteSupplierApi(id)
  if(res) await useInit(loading,getList, '删除成功')
}
// 禁用
async function enableItem(item:any){
  const res = await enableSupplierApi({id: item.id})
  let txt = item?.enable == true ? '禁用' : '启用'
  if(res) await useInit(loading,getList, `供应商${txt}成功`)
}
// 获取列表数据= = = = = = = = = = = = = = = =》
async function getList(params: any) {
  const res = await supplierPagetApi(params);
  myPage.value?.setResData(res)
}

// 初始化表单数据
const initData:any =  {
  name: '',
  code: '',
  enable: true,}
let curItem = ref(initData)
// 新增/编辑 弹窗 -------------------------------------------------------->
const formModal = ref<InstanceType<typeof FormModal>>()
const modalTitle = ref('新增')
// 表单配置模板
const formConf = computed(() => ([
  {
    label: '供应商编号',
    key: 'code',
    rules: [{required: true, message: '请输入供应商编号'}],
    disabled: !!curItem?.value?.id,
  },
  {
    label: '供应商名称',
    key: 'name',
    rules: [{required: true, message: '请输入供应商名称'}]
  },
  {
    label: '联系人',
    key: 'contactName',
    // rules: [{required: true, message: '请输入联系人'}],
  },
  {
    label: '联系电话',
    key: 'phone',
    // rules: [{required: true, message: '请输入联系电话'}]
  },
  {
    label: '供应商备注',
    type: 'textarea',
    key: 'remark',
    // rules: [{required: true, message: '请输入供应商备注'}],
  },
  {
    label: '状态',
    key: 'enable',
    type: 'switch',
  },
]))
// 打开新增/编辑
function onOpen(item?:any){
  modalTitle.value = item ? '编辑供应商' : '新增供应商'
  if(item) {
    const {enable,  name, code, id, remark, contact} = item
    curItem.value = {
      contactName: contact?.name,
      phone: contact?.phone?.number,
      enable, name, code, id, remark
    }
  } else {
    curItem.value = {...initData}
  }
  console.log('new==================', item)
  formModal?.value?.open()
}
// 提交 创建/编辑 表单
async function onSubmit(){
  const {enable, name, code, contactName, id, remark, phone} = curItem.value
  let params = { contact:{ name: contactName, phone: { number: phone } }, enable, name, code, id, remark }
  const res = curItem.value.id ? await updateSupplierApi(params) : await createSupplierApi(params)

  res && formModal?.value?.close()
  if(res){
    dataSource.setFlagChange('refundAddress', false)
    await useInit(loading,getList, curItem.value.id ? '供应商更新成功': '供应商创建成功')
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
               :addBtnTxt="'新增供应商'"
               @openAdd="onOpen"
               @getList="getList"></my-page>
    </page-container>
    <FormModal ref="formModal" :title="modalTitle" :formConf="formConf" :formModal="curItem" @onOk="onSubmit"></FormModal>
  </div>
</template>