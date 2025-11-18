<script setup lang="ts">
import {createTheaterApi, deleteTheaterApi, theaterListApi, TheaterModal, updateTheaterApi, ListParams} from "@/api/theater.ts";
import MyPage from "@/components/my-page.vue";
import FormModal from "@/components/form-modal.vue";
import {useConfirm} from "@/composables/global-config.ts";
import { CustomColumnsType } from "ant-design-vue/es/table";
import {cascaderAreaData} from "@/utils/addressSource.ts";
import {useIndex} from "@/composables/table-data.ts";
const myConfirm = useConfirm()
const dataSource = useDataStore()
let selectedAddress: {value: string, text: string}[] = []
const loading = ref(false)

// 子组件对象
const myPage = ref<InstanceType<typeof MyPage>>()
const formModal = ref<InstanceType<typeof FormModal>>()

// 组件配置 = = = = = = = = = = = = = = = =》
// 1.搜索组件配置
const searchConf = shallowReactive([
  {
    label: '场馆名称',
    key: 'nameLike',
  },
  {
    label: '省份',
    key: 'provinceLike',
  },
  {
    label: '城市',
    key: 'cityLike',
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
    title: '场馆名称',
    dataIndex: 'name',
  },
  {
    title: '省市',
    dataIndex: 'addressObj',
  },
  {
    title: '详细地址',
    dataIndex: 'addressTxt',
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
    label: '场馆名称',
    key: 'name',
    type: 'input',
    rules: [{ required: true, message: '请输入场馆名称' }]
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
    rules: [{ required: true, message: '请输入详细地址' }]
  },
])
let curItem = ref<TheaterModal>({})

// 重置表单数据的方法
function resetForm() {
  curItem.value = {name: '', address: '', addressTxt: '', area: []}
}
function onOpen(item?:any){
  resetForm()
  modalTitle.value = item ? '编辑' : '新增'
  if(item) {
    console.log(item)
    const {name, id, address, addressTxt} = item
    let area = [address.provinceCode, address.cityCode, address.countyCode]
    curItem.value = {name, area, addressTxt, id, address}
  } else {
    // 每次新增时都重置表单数据
    resetForm()
    // 延迟重置表单字段，确保在FormModal打开后执行
    nextTick(() => {
      formModal.value?.resetFields()
    })
  }
  formModal?.value?.open()
}

// 处理表单取消事件，确保数据被重置
function onFormCancel() {
  // 重置为初始状态
  resetForm()
  // 在取消时也确保表单关闭
  formModal.value?.close()
}


// 接口业务逻辑 = = = = = = = = = = = = = = = =》
// 列表
async function getList(params:ListParams){
  const res = await theaterListApi(params)
  res?.data?.forEach(item => {
    let {city, county, province, address} = item.address
    item.addressObj = (province || '') + '-' + (city || '') + '-' + (county || '')
    item.area = item.address
    item.addressTxt = address
  })
  myPage.value?.setResData(res)
}
// // 创建
async  function editItem(){
  const {name, id, addressTxt} = formModal?.value?.formData
  let tempAddress
  if(selectedAddress.length == 3) {
    let {text: province, value: provinceCode} = selectedAddress[0]
    let {text: city, value: cityCode} = selectedAddress[1]
    let {text: county, value: countyCode} = selectedAddress[2]
    tempAddress = {province, city, county, provinceCode, cityCode, countyCode, address: addressTxt}
  }
  curItem.value ={name, id, address: tempAddress || {...curItem.value.address, address: addressTxt}}
  const res = curItem.value.id ?  await updateTheaterApi(curItem.value) :  await createTheaterApi(curItem.value)
  if(res) {
    dataSource.setFlagChange('theaters', true)
    await useInit(loading,getList, curItem.value.id ? '更新成功': '新增成功')
    formModal.value?.close()
  }
}
// // 删除
async function deleteItem(id:string){
  const res = await deleteTheaterApi(id)
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
    <FormModal ref="formModal" :title="modalTitle" :formConf="formConf" v-model:formModal="curItem" @onOk="editItem" @onCancel="onFormCancel"></FormModal>
  </page-container>
  </div>
</template>
