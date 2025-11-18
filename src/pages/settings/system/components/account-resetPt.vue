<script setup lang="tsx">
import FormModal from "@/components/form-modal.vue";
import {resetAccountPwApi} from "@/api/system/account.ts";
import {message} from "ant-design-vue";
// 表单配置
const formConf = ref([
  {
    label: '新密码',
    key: 'password',
    rules: [{required: true, message: '请输入新密码'}],
  },
])

const initData = {
  id: undefined,
  password: '',
}
// 表单数据
const loading = ref(false)
const fromRef = ref<InstanceType<typeof FormModal>>()
const formModal = ref({...initData})
// 提交 表单
async function submit(){
  loading.value = true
  let res = await resetAccountPwApi(formModal.value)
  loading.value = false
  if(res){
    fromRef?.value?.close()
    message.success('密码重置成功！')
  }
}
// 打开弹窗
const title = ref<string>('重置密码')
function open(item?:any){
  formModal.value.id = item.id
  title.value = `${item.truename}账号 重置密码:  `
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