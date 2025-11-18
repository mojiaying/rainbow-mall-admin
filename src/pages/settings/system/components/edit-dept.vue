<script setup lang="tsx">
import FormModal from "@/components/form-modal.vue";
import {createDeptApi, DeptModel, updateDeptApi} from "@/api/system/dept.ts";
import {getPathByValue} from "@/utils/tools.ts";
const dataSource = useDataStore()
const deptList = ref(dataSource.deptList)
async function getDeptData(){
  if(!dataSource.deptList) {
    await dataSource.getDeptList()
    deptList.value = dataSource.deptList
  }
}
getDeptData()

const initData:DeptModel = {
  parentIds: ['0'],
  parentId: '0',
  name: '',
  desc: '',
}
// 表单数据
const loading = ref(false)
const emit = defineEmits(['updatePage'])
const fromRef = ref<InstanceType<typeof FormModal>>()
const title = ref('新增')
const formModal = ref<DeptModel>({...initData})
// 表单配置
const formConf = computed(() => [
  {
    label: '上级',
    key: 'parentIds',
    type: 'cascader',
    disabled: !!formModal.value.id,
    options: dataSource.deptList,
    ChangeOnSelect: true,
    rules: [{required: true, message: '请选择上级'}],
  },
  {
    label: '部门名称',
    key: 'name',
    rules: [{required: true, message: '请输入部门名称'}],
  }
])

// 提交 表单
async function submit(){
  loading.value = true
  const txt = !formModal?.value?.id ? '新增' : '编辑'
  formModal.value.parentId = formModal?.value?.parentIds?.[formModal?.value?.parentIds.length - 1] || ''
  let res = !formModal?.value?.id ? await createDeptApi(formModal.value) : await updateDeptApi(formModal.value)
  loading.value = false
  if(res){
    fromRef?.value?.close()
    emit('updatePage', `${txt}成功！`)
  }
}
// 打开弹窗
function open(item?:any){
  formModal.value = {...initData, ...item}
  title.value = item ? '编辑' : '新增'
  if(formModal.value.parentId) {
    formModal.value.parentIds = getPathByValue(dataSource.deptList, formModal?.value?.parentId, [])
  }
  fromRef?.value?.open()
}
defineExpose({open})
</script>

<template>
  <FormModal ref="fromRef" v-model:formModal="formModal" @onOk="submit"  :formConf="formConf" :title="title" :loading="loading">
  </FormModal>
</template>

<style scoped lang="less">

</style>