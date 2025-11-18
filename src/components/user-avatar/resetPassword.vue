<script setup lang="ts">
import {FormInstance, notification} from "ant-design-vue";
import {changePasswordAPi} from "@/api/login.ts";
import {FormConfig} from 'ant-design-vue/es/table'
const emit = defineEmits(['afterReset'])
const formRef = ref<FormInstance>()
const visible = ref(false)
const formData = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 密码校验 ------------------------ START-------------------------------------》
const varifyPassword = {validator: () => {
    const newPassword = formData.value.newPassword
    const confirmPassword = formData.value.confirmPassword
    if(newPassword.length && confirmPassword.length && newPassword !== confirmPassword) {
      return Promise.reject('两次输入的新密码不一致');
    } else {
      return Promise.resolve()
    }
  }, trigger: 'blur'}
const passWordRules = [{pattern:/^(?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z]{6,20}$/, message: '密码格式不正确，密码长度6-20位，必须包含数字和字母，不能有特殊字符', trigger: 'blur' }]
const formConf = shallowReactive<FormConfig[]>([
  {
    label: '旧密码',
    key: 'oldPassword',
    type: 'password',
    rules: [{ required: true, message: '请输入旧密码' }, ...passWordRules]
  },
  {
    label: '新密码',
    key: 'newPassword',
    type: 'password',
    blurUpdate: true,
    rules: [{ required: true, message: '请输入新密码' }, ...passWordRules, varifyPassword]
  },
  {
    label: '确认新密码',
    key: 'confirmPassword',
    type: 'password',
    blurUpdate: true,
    rules: [{ required: true, message: '请输入确认密码',trigger: 'blur' }, ...passWordRules, varifyPassword],
    placeholder: '确认新密码'
  }])
// 密码校验 ------------------------- END------------------------------------》

// label 和 输入框距离
const labelCol = {style: {width: '120px'}}
const wrapperCol = {span: 15}
// 确认 请求接口 + 关闭
async function handleOk() {
  await formRef.value?.validate()
  const {oldPassword, newPassword} = formData.value
  const res = await changePasswordAPi({oldPassword, newPassword})
  if (res) {
    notification?.success({
      message: '密码修改成功',
      description: '请用新密码登录！',
      duration: 3,
    })
    emit('afterReset')
  }
  visible.value = false
}

// 取消 reset + 关闭
function handleCancel() {
  visible.value = false
}
// 打开弹窗
function open(){
  visible.value = true
}
// 暴露给父组件
defineExpose({
  open,
})
</script>

<template>
<a-modal v-model:open="visible" title="修改密码" @ok="handleOk" @cancel="handleCancel">
  <a-form ref="formRef" :model="formData" class="w-full" :label-col="labelCol" :wrapper-col="wrapperCol">
    <a-form-item v-for="item in formConf" :name="item.key" :key="item.key" :label="item.label" :rules="item.rules || []">
      <a-input-password
          v-model:value="formData[item.key as keyof typeof formData]"
         :placeholder="item.placeholder || `请输入${item.label}`"></a-input-password>
            </a-form-item>
          </a-form>
</a-modal>
</template>

<style scoped lang="less">

</style>