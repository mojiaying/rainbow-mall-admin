<script setup lang="tsx">
import MyPage from "@/components/my-page.vue";
import {
  createReturnAddressApi, deleteReturnAddressApi, goodsReturnListApi, updateReturnAddressApi
} from "@/api/mallsetting.ts";
import FormModal from "@/components/form-modal.vue";
import {useConfirm} from "@/composables/global-config.ts";
import {CustomColumnsType} from "ant-design-vue/es/table";
import {useDataStore} from "@/stores/useDataStore.ts";
import {useIndex, usePartAddress} from "@/composables/table-data.ts";
import {cascaderAreaData} from "@/utils/addressSource.ts";
let selectedAddress: {value: string, text: string}[] = []
const myConfirm = useConfirm()
const loading = ref(false)
const dataSource = useDataStore()
const myPage = ref<InstanceType<typeof MyPage>>()
// 组件配置 = = = = = = = = = = = = = = = =》
/// 1.搜索组件配置
// 2.table 表头配置
const columns: CustomColumnsType<any>[] = [
  {
    title: '序号',
    dataIndex: 'index',
    customRender: ({ index }:{index:number}) => useIndex(myPage.value?.pagination, index)
  },{
    title: '收货人',
    dataIndex: 'name',
    customRender: (row:any) => row.record?.contact?.name,
    width: 200
  },{
    title: '手机号',
    dataIndex: 'phone',
    customRender: (row:any) => row.record?.contact?.phone?.number,
  },
  {
    title: '省市',
    dataIndex: 'address',
    customRender: (row:any) => usePartAddress(row.record?.address),
  },
  {
    title: '详细地址',
    dataIndex: 'address',
    customRender: (row:any) => row.record?.address.address,
  },{
    title: '操作',
    dataIndex: 'action',
    buttons: [
      {
        label: '编辑',
        key: 'edit',
        onclick: async (row: any) => {
          onOpen(row.record)
        },
      },
      {
        label: '删除',
        key: 'del',
        onclick: async (row: any) => {
          myConfirm(`确认删除 ${row.record.contact.name} 的退货地址吗？`, '', () => deleteItem(row.record.id))
        },
        style: {color: 'red'}
      }
    ]
  }
]

// // 删除
async function deleteItem(id:string){
  const res = await deleteReturnAddressApi(id)
  if(res) {
    await useInit(loading,getList, '删除成功')
    dataSource.setFlagChange('refundAddress', true)
  }
}
// 获取退换货地址列表= = = = = = = = = = = = = = = =》
async function getList(params: any) {
  const res = await goodsReturnListApi(params);
  myPage.value?.setResData(res)
}

// 新增/编辑 弹窗 -------------------------------------------------------->
const formModal = ref<InstanceType<typeof FormModal>>()
const modalTitle = ref('新增')
// 表单配置模板
const formConf = ref([
  {
    label: '收货人',
    key: 'name',
    rules: [{required: true, message: '请输入收货人'}],
  },
  {
    label: '手机号',
    key: 'phone',
    type: 'number',
    rules: [
      { required: true, message: '请输入手机号' },
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的11位手机号' }
    ],
  },
  {
    label: '地址',
    key: 'area',
    type: 'cascader',
    options: cascaderAreaData,
    fieldNames:  {label: 'text', value: 'value', children: 'children'},
    onChane: (item:any) => {
      selectedAddress = item
    },
    rules: [{ required: true, message: '请选择省市区' }]
  },
  {
    label: '详细地址',
    key: 'addressTxt',
    type: 'textarea',
    rules: [{required: true, message: '请输入详细地址'}],
  },

  {
    label: '',
    key: 'isDefault',
    slots: 'isDefault',
  },
])
// 初始化表单数据
const initData:any = {
  name: '',
  phone: undefined,
  province: undefined,
  city: undefined,
  county: undefined,
  isDefault: 0,}
let curItem = ref(initData)
// 打开新增/编辑
function onOpen(item?:any){
  modalTitle.value = item ? '编辑地址' : '新增地址'
  if(item) {
    const {isDefault, address, contact,id} = item
    let area = [address.provinceCode, address.cityCode, address.countyCode]
    curItem.value = {
      addressTxt: address?.address,
      isDefault: isDefault ? 1 : 0,
      name: contact?.name,
      phone: contact?.phone?.number,
      id,
      address,
      area
  }
  } else {
    curItem.value = {...initData}
  }
  console.log('new==================', item)
  formModal?.value?.open()
}
// 提交 创建/编辑 表单
async function onSubmit(){
  const {addressTxt, name, phone, isDefault, id} = curItem.value
  // 转地址格式
  let tempAddress = {...curItem.value.address, address: addressTxt}
  if(selectedAddress.length == 3) {
    let {text: province, value: provinceCode} = selectedAddress[0]
    let {text: city, value: cityCode} = selectedAddress[1]
    let {text: county, value: countyCode} = selectedAddress[2]
    tempAddress = {province, city, county, provinceCode, cityCode, countyCode, address: addressTxt}
  }
  let params = { address: tempAddress, contact:{ name, phone: { number: phone } }, isDefault, id }
  const res = curItem.value.id ? await updateReturnAddressApi(params) : await createReturnAddressApi(params)
  res && formModal?.value?.close()
  if(res){
    dataSource.setFlagChange('refundAddress', true)
    await useInit(loading,getList, curItem.value.id ? '退换货地址更新成功': '退换货地址创建成功')
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
               :addBtnTxt="'添加地址'"
               @openAdd="onOpen"
               @getList="getList"></my-page>
    </page-container>
    <FormModal ref="formModal" :title="modalTitle" :formConf="formConf" :formModal="curItem" @onOk="onSubmit">

      <template #isDefault="{formData}">
        <a-radio-group v-model:value="formData.isDefault">
          <a-radio :value="1">默认地址</a-radio>
          <a-radio :value="0">非默认地址</a-radio>
        </a-radio-group>
      </template>
    </FormModal>
  </div>
</template>