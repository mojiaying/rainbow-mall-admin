<script setup lang="tsx">
import MyPage from "@/components/my-page.vue";
import FormModal from "@/components/form-modal.vue";
import {useConfirm} from "@/composables/global-config.ts";
import {CustomColumnsType} from "ant-design-vue/es/table";
import {useDataStore} from "@/stores/useDataStore.ts";
import { usePartAddress} from "@/composables/table-data.ts";
import {cascaderAreaData} from "@/utils/addressSource.ts";
import {
  createWarehouseApi,
  deleteWarehouseApi,
  enableWarehouseApi,
  updateWarehouseApi,
  warehousePagetApi
} from "@/api/warehouse.ts";

let selectedAddress: {value: string, text: string}[] = []
const myConfirm = useConfirm()
const loading = ref(false)
const dataSource = useDataStore()
const myPage = ref<InstanceType<typeof MyPage>>()
// 组件配置 = = = = = = = = = = = = = = = =》
// 2.table 表头配置
const columns: CustomColumnsType<any>[] = [
  {
    title: '仓库编码',
    dataIndex: 'code',
  },{
    title: '仓库名称',
    dataIndex: 'name',
    width: 200
  },{
    title: '仓库地址',
    dataIndex: 'address',
    customRender: (row:any) => usePartAddress(row.record?.address),
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
          myConfirm(`确认删除 仓库： ${row.record.name} 吗？`, '', () => deleteItem(row.record.id))
        },
        style: {color: 'red'}
      },{
        label: '禁用',
        key: 'status',
        mapName: (row: any) => {
          return row.record?.enable == true? '禁用' : '启用'
        },
        style: (row:any) => ({color: row.record?.enable == true? '#f5222d' : '#246700'}),
        onclick: async (row: any) => {
          let txt = row.record?.enable == 1 ? '禁用' : '启用'
          myConfirm(`确认${txt}仓库 ${row.record?.name}？`, txt,  () => enableItem(row.record))
        },
      },
    ]
  }
]

// 删除
async function deleteItem(id:string){
  const res = await deleteWarehouseApi(id)
  if(res) await useInit(loading,getList, '删除成功')
}
// 禁用
async function enableItem(item:any){
  const res = await enableWarehouseApi({id: item.id})
  let txt = item?.enable == true ? '禁用' : '启用'
  if(res) await useInit(loading,getList, `仓库${txt}成功`)
}
// 获取列表数据= = = = = = = = = = = = = = = =》
async function getList(params: any) {
  const res = await warehousePagetApi(params);
  myPage.value?.setResData(res)
}

// 初始化表单数据
const initData:any = {
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
    label: '仓库编码',
    key: 'code',
    rules: [{required: true, message: '请输入仓库编码'}],
    disabled: !!curItem?.value?.id,
  },
  {
    label: '仓库名称',
    key: 'name',
    rules: [{required: true, message: '请输入仓库名称'}]
  },
  {
    label: '仓库地址',
    key: 'area',
    type: 'cascader',
    options: cascaderAreaData,
    fieldNames:  {label: 'text', value: 'value', children: 'children'},
    onChane: (item:any) => {selectedAddress = item},
    // rules: [{ required: true, message: '请选择省市区' }]
  },
  {
    label: '详细地址',
    key: 'addressTxt',
    type: 'textarea',
    // rules: [{required: true, message: '请输入详细地址'}],
  },
  {
    label: '仓库备注',
    type: 'textarea',
    key: 'remark',
    // rules: [{required: true, message: '请输入仓库备注'}],
  },
  {
    label: '状态',
    key: 'enable',
    type: 'switch',
  },
]))
// 打开新增/编辑
function onOpen(item?:any){
  modalTitle.value = item ? '编辑仓库' : '新增仓库'
  if(item) {
    const {enable, address, name, code, id, remark} = item
    let area = [address.provinceCode, address.cityCode, address.countyCode]
    curItem.value = {
      enable, address, name, code, id, remark, area,
      addressTxt: address?.address,
  }
  } else {
    curItem.value = {...initData}
  }
  formModal?.value?.open()
}
// 提交 创建/编辑 表单
async function onSubmit(){
  const {addressTxt, enable, name, code, id, remark} = curItem.value
  // 转地址格式
  let tempAddress = {...curItem.value.address, address: addressTxt}
  if(selectedAddress.length == 3) {
    let {text: province, value: provinceCode} = selectedAddress[0]
    let {text: city, value: cityCode} = selectedAddress[1]
    let {text: county, value: countyCode} = selectedAddress[2]
    tempAddress = {province, city, county, provinceCode, cityCode, countyCode, address: addressTxt}
  }

  let params = { address: tempAddress, enable, name, code, id, remark }
  const res = curItem.value.id ? await updateWarehouseApi(params) : await createWarehouseApi(params)

  res && formModal?.value?.close()
  if(res){
    dataSource.setFlagChange('refundAddress', false)
    await useInit(loading,getList, curItem.value.id ? '仓库更新成功': '仓库创建成功')
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
               :addBtnTxt="'新增仓库'"
               @openAdd="onOpen"
               @getList="getList"></my-page>
    </page-container>
    <FormModal ref="formModal" :title="modalTitle" :formConf="formConf" :formModal="curItem" @onOk="onSubmit">
    </FormModal>
  </div>
</template>