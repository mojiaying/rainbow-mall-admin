<script setup lang="tsx">
import MyPage from "@/components/my-page.vue";
import {
  createLogisticsApi,
  deleteLogisticsApi, goodsLogisticsApi,
  LogisticsParams,
  updateLogisticsApi
} from "@/api/mallsetting.ts";
import FormModal from "@/components/form-modal.vue";
import {useConfirm} from "@/composables/global-config.ts";
import {useDataStore} from "@/stores/useDataStore.ts";
import {CustomColumnsType} from "ant-design-vue/es/table";
import { TreeSelect } from 'ant-design-vue';
import {treeAddress} from "@/utils/addressSource.ts"
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const myConfirm = useConfirm()
const loading = ref(false)
const myPage = ref<InstanceType<typeof MyPage>>()
const dataSource = useDataStore()

// 组件配置 = = = = = = = = = = = = = = = =》
/// 1.搜索组件配置
// 2.table 表头配置
const columns: CustomColumnsType<any>[] = [
  {
    title: '模板名称',
    dataIndex: 'name',
  },
  {
    title: '模板内容',
    dataIndex: 'content',
    customRender: (row:any) => {
      let item = row?.record
      let isFreeShipping = item?.isFreeShipping? `包邮, 不包邮地区：${item?.nonFreeShippingCities?.map((item:any) => item.second) || '无'} 运费: ¥ ${item?.postageFee || 0}  ` : `不包邮, 运费: ¥ ${item?.postageFee || 0} `
      let restrictedSaleCities = item?.restrictedSaleCities? `不可购买地区：${item?.restrictedSaleCities?.map((item:any) => item.second)} ` : ''
      return  <div>
        <div style={{textAlign: 'left'}}>1. {isFreeShipping}</div>
        {restrictedSaleCities && <div style={{textAlign: 'left'}}>2. {restrictedSaleCities}</div>}
      </div>
    }
  },
  {
    title: '描述',
    dataIndex: 'senderAddress',
  }, {
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
          myConfirm(`确认删除 ${row.record.name} 吗？`, '', () => deleteItem(row.record.id))
        },
        style: {color: 'red'}
      }
    ]
  }
]

// // 删除
async function deleteItem(id:string){
  const res = await deleteLogisticsApi(id)
  if(res) await useInit(loading,getList, '删除成功')
}
// 接口业务逻辑 = = = = = = = = = = = = = = = =》
// 列表
async function getList(params:any){
  const res = await goodsLogisticsApi(params);
  myPage.value?.setResData(res)
}
// 新增/编辑 弹窗
const formModal = ref<InstanceType<typeof FormModal>>()
const modalTitle = ref('新增')
function selectChange(code:string[], node:string[], key?:string){
  curItem.value[key as 'nonFreeShippingCities'] = code.map((item:string, index:number) => {
    return {
      first: item,
      second: node[index]
    }
  })
}
// 表单配置模板
const formConf = ref<any>([
  {
    label: '模板名称',
    key: 'name',
    rules: [{required: true, message: '请输入模板名称'}]
  },
  {
    label: '是否包邮',
    key: 'isFreeShipping',
    slots: 'shipping'
  },
  {
    label: '不包邮地区',
    slots: 'nonFreeShippingCities',
    key: 'nonFreeShippingCitiesKeys',
    type: 'select-tree',
    options: treeAddress,
    relyOn: 'isFreeShipping',
    fieldNames: {label: 'label', value: 'value', children: 'children'}
  },
  {
    label: '不可购买地区',
    key: 'restrictedSaleCitiesKeys',
    type: 'select-tree',
    onChange: (value:any, node:any) => selectChange(value, node, 'restrictedSaleCities'),
    options: treeAddress,
    fieldNames: {label: 'label', value: 'value', children: 'children'}
  },
  {
    label: '描述',
    key: 'senderAddress',
    type: 'textarea',
  },
  // {
  //   label: '默认地址',
  //   key: 'isDefault',
  //   type: 'switch',
  // }
])
// 初始化表单数据
const initData:LogisticsParams = {
  name: '',
  isFreeShipping: undefined,
  isDefault: false,
  postageFee: undefined,
  nonFreeShippingCities: undefined,
  restrictedSaleCities: undefined,
  senderAddress: undefined,}
let curItem = ref<LogisticsParams>(initData)
// 打开新增/编辑
function onOpen(item?:any){
  modalTitle.value = item ? '编辑模板' : '创建模板'
  curItem.value = item ? {...item} : {...initData}
  curItem.value.isFreeShipping = item?.isFreeShipping? 1 : 0
  if(item) {
    curItem.value.nonFreeShippingCitiesKeys = item?.nonFreeShippingCities?.map((item:any) => item?.first)
    curItem.value.restrictedSaleCitiesKeys = item?.restrictedSaleCities?.map((item:any) => item?.first)
  }
  formModal?.value?.open()
}
// 提交 创建/编辑 表单
async function onSubmit(){
  const res =  curItem.value.id ? await updateLogisticsApi(curItem.value) : await createLogisticsApi(curItem.value)
  res && formModal?.value?.close()
  if(res){
    dataSource.setFlagChange('logistics', true)
    await useInit(loading,getList, curItem.value.id ? '物流模板更新成功': '物流模板创建成功')
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
               :addBtnTxt="'添加模板'"
               @openAdd="onOpen"
               @getList="getList"></my-page>
    </page-container>
    <FormModal ref="formModal" :title="modalTitle" :formConf="formConf" :formModal="curItem" @onOk="onSubmit">
      <template #nonFreeShippingCities="{formData}">
      <a-form-item-rest>
        <a-tree-select :tree-data="treeAddress" v-model:value="formData.nonFreeShippingCitiesKeys"
                       tree-checkable
                       @change="(value:any, node:any) => selectChange(value, node, 'nonFreeShippingCities')"
                       allow-clear
                       :show-checked-strategy="SHOW_PARENT"
                       :field-names="{label: 'label', value: 'value', children: 'children'}"></a-tree-select>
        <div pt-4 v-if="formData.nonFreeShippingCities">
          运费： <a-input style="width: 160px" v-model:value="formData.postageFee"  placeholder="请输入运费"><template #addonAfter>
            <div>元</div>
          </template>
          </a-input>
        </div>
      </a-form-item-rest>

      </template>
      <template #shipping="{formData}">
        <a-radio-group v-model:value="formData.isFreeShipping">
          <a-radio :value="1">是</a-radio>
          <a-radio :value="0">
            <flex gap="large" class="flex-center">
            <div>否</div>
            <a-input v-if="formData.isFreeShipping === 0" style="width: 120px" v-model:value="formData.postageFee" placeholder="基础邮费">
              <template #addonAfter>
                <div>元</div>
              </template>
            </a-input>
            </flex>
          </a-radio>
        </a-radio-group>
      </template>
    </FormModal>
  </div>
</template>