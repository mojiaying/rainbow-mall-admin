<script setup lang="tsx">
import FormModal from "@/components/form-modal.vue";
import {createRoleApi, updateRoleApi, updateRoleMenuApi} from "@/api/system/roles.ts";
const dataSource = useDataStore()
const isCopy = ref(false)
// 表单配置
const formConf = ref([
  {
    label: '分组名称',
    key: 'name',
    rules: [{required: true, message: '请输入分组名称'}],
  },
  {
    label: '分组描述',
    key: 'desc',
    rules: [{required: true, message: '请输入分组描述'}],
  },
])

const initData = {
  id: '',
  name: '',
  desc: '',
}
// 表单数据
const loading = ref(false)
const emit = defineEmits(['updatePage'])
const fromRef = ref<InstanceType<typeof FormModal>>()
const title = ref('新增')
const formModal = ref({...initData})
// 提交 表单
async function submit(){
  if(isCopy.value){
    await copyRole(formModal.value)
  } else {
    loading.value = true
    let res = formModal?.value?.id ?  await updateRoleApi(formModal.value) : await createRoleApi(formModal.value)
    loading.value = false
    if(res){
      dataSource.setFlagChange('role', true)
      fromRef?.value?.close()
      emit('updatePage', `${formModal?.value?.id ? '更新' : '新增'}成功！`)
    }
  }
}
// 打开弹窗
function open(item?:any) {

  formModal.value = !!item ? {...item.role} : {...initData}
  if(item?.copyRole) {
    isCopy.value = item?.copyRole
    formModal.value.name += '-复制'
  }
  title.value = item ? item?.copyRole ? `复制权限：${item?.role?.name}` : '编辑' : '新增'
  fromRef?.value?.open()
}

// 复制角色权限
async function copyRole(role:any) {
  let {name, desc} = role
  let  id = await createRoleApi({name: name, desc: desc})
  let menuIds = role?.menuIds
  if(id){
    let res = await updateRoleMenuApi({id, menuIds})
    if(res) {
      emit('updatePage', '复制成功！')
      fromRef?.value?.close()
    }
  }
}
defineExpose({open})
</script>

<template>
  <FormModal ref="fromRef" v-model:formModal="formModal" @onOk="submit"  :formConf="formConf" :title="title" :loading="loading">
  </FormModal>
</template>

<style scoped lang="less">

</style>