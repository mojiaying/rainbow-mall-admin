<script setup lang="tsx">
import FormModal from "@/components/form-modal.vue";
import {AccountModel, createAccountApi, updateAccountApi} from "@/api/system/account.ts";
import {getPathByValue} from "@/utils/tools.ts";
const dataSource = useDataStore()
const deptList = ref(dataSource.deptList)
const jobList = ref(dataSource.jobList)
const roleList = ref(dataSource.roleList)
async function getDeptData(){
  if(!dataSource.deptList) {
    await dataSource.getDeptList()
    deptList.value = dataSource.deptList
  }
  if(dataSource.changeFlag?.job) {
    await dataSource.getJobList()
    jobList.value = dataSource.jobList
  }
  if(dataSource.changeFlag?.role) {
    await dataSource.getRoleList()
    roleList.value = dataSource.roleList
  }
}
getDeptData()
// if(dataSource.deptList)
// 表单配置
const formConf = computed(() => [
  {
    label: '所属部门',
    key: 'deptIds',
    type: 'cascader',
    ChangeOnSelect: true,
    options: deptList?.value?.filter(item=> item?.value !== '0'),
    rules: [{required: true, message: '请选择上级菜单'}],
  },
  {
    label: '岗位',
    key: 'titleId',
    type: 'select',
    options: jobList.value,
    rules: [{required: true, message: '请选择岗位'}],
  },
  {
    label: '权限分组',
    key: 'roleId',
    type: 'select',
    options: roleList.value,
    tips: '( 提示：分组决定权限 ）',
    rules: [{required: true, message: '请选择权限分组'}],
  },
  {
    label: '登录账号',
    key: 'username',
    notAuto: true,
    rules: [{required: true, message: '请输入登录账号'}],
  },
  {
    label: '登录密码',
    key: 'password',
    notAuto: true,
    itemSlot: 'password'
  },
  {
    label: '真实姓名',
    key: 'truename',
    rules: [{required: true, message: '请输入真实姓名'}],
  },
  {
    label: '昵称',
    key: 'nickname',
    rules: [{required: true, message: '请输入昵称'}],
  },
  // {
  //   label: '电话',
  //   key: 'phone',
  //   rules: [{required: true, message: '请输入电话'}],
  // },
  {
    label: '性别',
    key: 'sex',
    type: 'radio',
    options: [
      {label: '男', value: 1},
      {label: '女', value: 0},
    ],
    // rules: [{required: true, message: '请选择性别'}],
  },
])
const initData:AccountModel  = {
  deptIds: undefined,
  deptId: undefined,
  titleId: '',
  username: '',
  password: '',
  truename: '',
  nickname: '',
  roleId: '',
  sex: 1,
  avatar: '',
  phone: '',
}
// 表单数据
const loading = ref(false)
const emit = defineEmits(['updatePage'])
const fromRef = ref<InstanceType<typeof FormModal>>()
const title = ref('新增')
const formModal = ref({...initData})
// 提交 表单
async function submit(){
  loading.value = true
  const txt = !formModal?.value?.id ? '新增' : '编辑'
  let deptIds = formModal.value?.deptIds
  let params = {...formModal.value}
  params.deptId =deptIds?.length ?  deptIds[deptIds?.length - 1] : undefined
  params.attach = {account: {username: params.username, password: params.password}}
  let res = !formModal?.value?.id ? await createAccountApi(params) : await updateAccountApi(params)
  loading.value = false
  if(res){
    fromRef?.value?.close()
    emit('updatePage', `${txt}成功！`)
  }
}
// 打开弹窗
function open(item?:any){
  formModal.value = item ? {...item} : {...initData}
  if(item?.deptId){
    formModal.value.deptIds = getPathByValue(deptList.value, item?.deptId, [])
    formModal.value.username = item?.attach?.account?.username
  }
  title.value = item ? '编辑' : '新增'
  fromRef?.value?.open()
}
defineExpose({open})
</script>
<template>
  <FormModal ref="fromRef" v-model:formModal="formModal" @onOk="submit"  :formConf="formConf" :title="title" :loading="loading">
    <template #password v-if="!formModal.id">
      <a-form-item name="password" label="登录密码" :rules="[{required: true, message: '请输入登录密码'},
      {max: 20, message: '密码长度不超过20'},
      {pattern: /^(?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z]+$/, message: '密码必须包含数字和字母', trigger: 'blur' }]">
        <a-input v-model:value="formModal.password" type="password" placeholder="请输入登录密码" />
      </a-form-item>
    </template>
  </FormModal>
</template>

<style scoped lang="less">

</style>