<script setup lang="tsx">
import {createMenuApi, MenuModel, updateMenuApi} from "@/api/system/menu.ts";
import FormModal from "@/components/form-modal.vue";
const loading = ref(false)
const emit = defineEmits(['updatePage'])
// 表单配置
const formConf = computed(() =>[
  {
    label: '111',
    key: 'name',
    itemSlot: 'tipList'
  },
  {
    label: '名称',
    key: 'name',
    rules: [{required: true, message: '请输菜单名称'}],
  },

  {
    label: '编码',
    key: 'code',
    rules: [{required: true, message: '请输菜单编码'}],
  },
  {
    label: '排序',
    key: 'sort',
  }
])
// 表单数据
const fromRef = ref<InstanceType<typeof FormModal>>()
const initData:MenuModel = {
  name: '',
  code: '',
  sort: undefined,
  type: undefined,
}
const mTitle = ref('新增')
const formModal = ref({...initData})
// 提交 表单
async function submit(){
  loading.value = true
  const txt = !formModal?.value?.id ? '新增' : '编辑'
  const typeTxt = formModal.value.type === 1? 'Tab签' : '按钮'
  let res = !formModal?.value?.id ? await createMenuApi(formModal.value) : await updateMenuApi(formModal.value)
  loading.value = false
  if(res){
    fromRef?.value?.close()
    emit('updatePage', `${typeTxt}${txt}成功！`)
  }
}
function open(parent?:any, item?:any, isNew?: boolean){
  formModal.value = {...initData, ...item}
  const typeTxt = formModal.value.type === 1? 'Tab签' : '按钮'
  formModal.value.parentId = parent?.id
  mTitle.value = !isNew ? `编辑${parent.name}页面：${typeTxt}` : `新增${parent.name}页面：${typeTxt}`
  if(isNew){}
  fromRef?.value?.open()
}

const btnList = [
  {label: '新增', value: 'add'},
  {label: '删除', value: 'del'},
  {label: '编辑', value: 'edit'},
  {label: '详情', value: 'detail'},
  {label: '上下架', value: 'OnOff'},
  {label: '启用/停用', value: 'status'},
  {label: '导出', value: 'export'},
  {label: '导入', value: 'import'},
  {label: '审核', value: 'audit'},
  {label: '取消', value: 'cancel'},

]
function setName(e: any){
  let newItem = btnList.filter(item => item.value === e.target.value)
  formModal.value.name = newItem[0].label
}
defineExpose({open})
</script>

<template>
  <FormModal ref="fromRef" v-model:formModal="formModal" @onOk="submit"  :formConf="formConf" :title="mTitle" :loading="loading">
  <template #tipList v-if="formModal.type === 2">
    <a-form-item label="常用参考">
    <a-radio-group v-model="formModal.name" :options="btnList" v-model:value="formModal.code" @change="setName"></a-radio-group>
    </a-form-item>
  </template>
  </FormModal>
</template>

<style scoped lang="less">

</style>