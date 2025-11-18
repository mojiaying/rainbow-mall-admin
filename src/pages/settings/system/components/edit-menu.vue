<script setup lang="tsx">
import {createMenuApi, MenuModel, updateMenuApi} from "@/api/system/menu.ts";
import FormModal from "@/components/form-modal.vue";
import {getPathByValue} from "@/utils/tools.ts";
const loading = ref(false)
const emit = defineEmits(['updatePage'])
const dataSource = useDataStore()
const menuList = ref(dataSource.menuList)
async function getDeptData(){
  if(!dataSource.menuList) {
    await dataSource.getMenuList()
    menuList.value = dataSource.menuList
  }
}
getDeptData()

// 表单数据
const fromRef = ref<InstanceType<typeof FormModal>>()
const initData:MenuModel = {
  parentIds: ['0'],
  parentId: '0',
  name: '',
  code: '',
  sort: undefined,
  type: undefined,
  url: '',
}
const mTitle = ref('新增')
const formModal = ref({...initData})
// 表单配置
const formConf = computed(() =>[
  {
    label: '上级',
    key: 'parentIds',
    type: 'cascader',
    options: menuList.value || [],
    disabled: !!formModal.value.id,
    ChangeOnSelect: true,
    rules: [{required: true, message: '请选择上级'}],
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
    rules: [{required: true, message: '请输菜单排序'}],
  }
])
// 提交 表单
async function submit(){
  loading.value = true
  const txt = !formModal?.value?.id ? '新增' : '编辑'
  formModal.value.parentId = formModal?.value?.parentIds?.[formModal?.value?.parentIds.length - 1] || ''
  formModal.value.type = 0
  let res = !formModal?.value?.id ? await createMenuApi(formModal.value) : await updateMenuApi(formModal.value)
  loading.value = false
  if(res){
    fromRef?.value?.close()
    emit('updatePage', `菜单${txt}成功！`)
  }
}
function open(item?:any){
  formModal.value = !!item ? {...item} : {...initData}
  mTitle.value = !!item ? '编辑' : '新增'
  if(formModal.value.parentId) {
    formModal.value.parentIds = getPathByValue(menuList.value, formModal?.value?.parentId, [])
  }
  fromRef?.value?.open()
}

// const btnList = [
//   {label: '新增', value: 'add'},
//   {label: '删除', value: 'delete'},
//   {label: '编辑', value: 'update'},
//   {label: '详情', value: 'detail'},
//   {label: '上下架', value: 'OnOff'},
//   {label: '导出', value: 'export'},
//   {label: '导入', value: 'import'},
// ]
// function setName(e: any){
//   console.log(e)
//   let newItem = btnList.filter(item => item.value === e.target.value)
//   formModal.value.name = newItem[0].label
// }
defineExpose({open})
</script>

<template>

  <FormModal ref="fromRef" v-model:formModal="formModal" @onOk="submit"  :formConf="formConf" :title="mTitle" :loading="loading">
<!--    <a-radio-group v-model="formModal.name" :options="btnList" v-model:value="formModal.code" @change="setName"></a-radio-group>-->
  </FormModal>
</template>

<style scoped lang="less">

</style>