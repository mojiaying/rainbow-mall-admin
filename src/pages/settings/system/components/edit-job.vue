<script setup lang="tsx">
import FormModal from "@/components/form-modal.vue";
import {createJobApi, JobModel, updateJobApi} from "@/api/system/job.ts";
// 表单配置
const formConf = ref([
  {
    label: '岗位名称',
    key: 'name',
    rules: [{required: true, message: '请输入岗位名称'}],
  },
  {
    label: '岗位描述',
    key: 'desc',
    rules: [{required: true, message: '请输入岗位描述'}],
  },
])

const initData:JobModel = {
  name: '',
  desc: '',
}
// 表单数据
const loading = ref(false)
const emit = defineEmits(['updatePage'])
const fromRef = ref<InstanceType<typeof FormModal>>()
const title = ref('新增')
const formModal = ref({...initData})
const dataSource = useDataStore()
// 提交 表单
async function submit(){
  loading.value = true
  const txt = !formModal?.value?.id ? '新增' : '编辑'
  let res = !formModal?.value?.id ? await createJobApi(formModal.value) : await updateJobApi(formModal.value)
  loading.value = false
  if(res){
    dataSource.setFlagChange('job', true)
    fromRef?.value?.close()
    emit('updatePage', `${txt}成功！`)
  }
}
// 打开弹窗
function open(item?:any){
  formModal.value = item ? {...item} : {...initData}
  title.value = item ? '编辑' : '新增'
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