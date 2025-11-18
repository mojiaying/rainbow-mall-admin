<script setup lang="ts">
import FormModal from "@/components/form-modal.vue";
import {createReturnAddressApi, ReturnAddressParams} from "@/api/mallsetting.ts";
import {cascaderAreaData} from "@/utils/addressSource.ts";
let selectedAddress: {value: string, text: string}[] = []
const emits = defineEmits(['updateList'])
const formModal = ref<InstanceType<typeof FormModal>>()
const dataSource = useDataStore()
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
    type: 'input',
    rules: [
      { required: true, message: '请输入手机号' },
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的11位手机号', trigger: 'blur' },
    ],
  },{
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
  //
  // {
  //   label: ' ',
  //   key: 'isDefault',
  //   slots: 'isDefault',
  // },
])
// 表单数据
let initItem = {
  name: '',
  phone: undefined,
  area: [],
  addressTxt: '',
  isDefault: 0,
}
const curItem:ReturnAddressParams = reactive({
  name: '',
  phone: undefined,
  area: [],
  isDefault: 0,
  addressTxt: '',
})
// 提交 创建/编辑 表单
async function onSubmit(){
  const {addressTxt, name, phone, isDefault} = curItem
  // 转地址格式
  let tempAddress
  if(selectedAddress.length == 3) {
    let {text: province, value: provinceCode} = selectedAddress[0]
    let {text: city, value: cityCode} = selectedAddress[1]
    let {text: county, value: countyCode} = selectedAddress[2]
    tempAddress = {province, city, county, provinceCode, cityCode, countyCode, address: addressTxt}
  }
  let params = { address: tempAddress, contact:{ name, phone: { number: phone } }, isDefault }
  const res =  await createReturnAddressApi(params)
  res && formModal?.value?.close()
  if(res){
    dataSource.setFlagChange('refundAddress', true)
    formModal?.value?.close()
    emits('updateList')
  }
}
function open() {
  Object.assign(curItem, initItem)
  formModal.value?.open()
}
function close() {
  formModal.value?.close()
}
defineExpose({
  open,
  close
})
</script>

<template>
  <FormModal ref="formModal" title="新增退货地址" :formConf="formConf" :formModal="curItem" @onOk="onSubmit"></FormModal>
</template>

<style scoped lang="less">

</style>