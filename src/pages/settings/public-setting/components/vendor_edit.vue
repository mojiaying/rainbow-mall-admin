<script setup lang="tsx">
import FormModal from "@/components/form-modal.vue";
import {createThirdPartyApi, thirdPartyDetailApi, updateThirdPartyApi} from "@/api/publicsetting.ts";

// 新增/编辑 弹窗 -------------------------------------------------------->
const loading = ref(false)

const props = defineProps(['accountList'])
const accountRes = ref(props.accountList)
const emit = defineEmits(['updatePage'])
const fromRef = ref<InstanceType<typeof FormModal>>()
const title = ref('新增')
//初始化表格数据
watch(() => props.accountList, (val) => {
  accountRes.value = val
})
const initData = {
  name: '', //第三方商城名称
  username: '', //登录账号
  vendorMallId: undefined, //
  urlStatus: 0, //跳转路径状态
  pname: '',
  scheme: '',
  capitalStatus: 0,
  appid: '',
  appletUrl: '',
  statusCheck: false,
  url: '', // 入口封面
  accountCode: '', //资金账号编码
  status: 1, //开启状态
  userId: undefined,
  id: undefined
}
//提交 创建/编辑 表单
// 表单数据
const curItem = reactive({...initData})
//表单配置模板
const formConf = computed(() => [
  {
    label: '三方商城名称',
    key: 'name',
    rules: [{required: true, message: '请输入三方商城名称'}],
  },
  {
    label: 'ID',
    key: 'vendorMallId',
    disabled: !!curItem.id,
    rules: [{required: true, message: '请输入ID'}],
  },
  {
    label: '资金账户编码',
    key: 'accountCode',
    rules: [{required: true, message: '请输入资金账户编码'}],
    disabled: !!curItem.capitalStatus,
  },
  {
    label: '入口封面',
    key: 'url',
    type: 'img',
    rules: [{required: true, message: '请选择图片'}],
    imgTips: '建议上传16:9,大小在5M以内的图片',
  },
  {
    label: '跳转路径',
    itemSlot: 'urlItem',
    rules: [{required: true, message: '请选择跳转路径'}],
  },
  {
    label: '登录账号',
    key: 'userId',
    itemSlot: 'username',
    // rules: [{required: true, message: '请选择登录账号'}],
  },
  {
    label: '启用',
    key: 'statusCheck',
    type: 'switch',
  },


])
function handleSearch(val:string){
  accountRes.value = props.accountList.filter((item:any) => item.label.includes(val))
}
function changeAccount(_:any, node:any){
  curItem.username = node.label
}
// 提交 表单
async function submit(){
  const txt = !curItem?.id ? '新增' : '编辑'
  let params = {...curItem}
  if(Array.isArray(params.url)){
    params.url = params.url[0]
  }
  clearUnuse(params)
 params.status = params.statusCheck ? 1 : 0
  loading.value = true
  const res =  params.id ? await updateThirdPartyApi(params) : await createThirdPartyApi(params)
  loading.value = false
  if(res){
    fromRef?.value?.close()
    emit('updatePage', `${txt}成功！`)
  }
}
function clearUnuse(params:any){
  if(params.urlStatus == 1){
    params.pname = ''
    params.scheme = ''
  } else {
    params.appid = ''
    params.appletUrl = ''
  }
}
// 打开弹窗
function open(item?:any){
  if(item) {
    item.statusCheck = item?.status == 1
    Object.assign(curItem, item)
    thirdPartyDetailApi(item.id).then(res => {
      if(res){
        res.statusCheck = res?.status == 1
        Object.assign(curItem, res)
      }
    })

  } else {
    // curItem = {...initData}
    Object.assign(curItem, initData)
  }
  title.value = item ? '编辑' : '新增'
  fromRef?.value?.open()
}
defineExpose({open})
</script>

<template>
  <FormModal ref="fromRef" :title="title" :formConf="formConf" :formModal="curItem" @onOk="submit">
    <template #topTip>
      <a-alert message="" type="warning">
        <template #description>
          <p>账户发生资金变动后将
            <span style="color: red">“资金账户编码”</span> 和
            <span style="color: red">“登录账号”</span>
            将不支持修改，请仔细检查所填信息</p>
        </template>
      </a-alert>
    </template>
    <template #urlItem>
      <a-form-item name="urlStatus" label="跳转路径" :rules="[{required: true, message: '请选择跳转路径'}]">
        <a-radio-group v-model:value="curItem.urlStatus">
          <a-radio :value="0">App</a-radio>
          <a-radio :value="1">小程序</a-radio>
        </a-radio-group>
      </a-form-item>

      <div v-if="curItem.urlStatus === 0">
        <a-form-item name="pname" label="pname" :rules="[{ required: true, message:  '请输入pname'}]">
          <a-input placeholder="请输入pname" v-model:value="curItem.pname"></a-input>
        </a-form-item>
        <a-form-item name="scheme" label="scheme" :rules="[{ required: true, message:  '请输入scheme'}]">
          <a-input placeholder="请输入scheme" v-model:value="curItem.scheme"></a-input>
        </a-form-item>
      </div>

      <div v-if="curItem.urlStatus === 1">
        <a-form-item name="appid" label="appid" :rules="[{ required: true, message:  '请输入appid'}]">
          <a-input placeholder="请输入appid" v-model:value="curItem.appid"></a-input>
        </a-form-item>
        <a-form-item name="appletUrl" label="路径" :rules="[{ required: true, message:  '请输入路径'}]">
          <a-input placeholder="请输入路径" v-model:value="curItem.appletUrl"></a-input>
        </a-form-item>
      </div>
    </template>
    <template #username>
      <a-form-item name="username" label="登录账号" :rules="[{ required: true, message:  '请输入或选择登录账号'}]">
<!--        <a-auto-complete :disabled="!!curItem.capitalStatus"-->
<!--            v-model:value="curItem.username"-->
<!--            :data-source="accountList"-->
<!--        placeholder="请输入或选择登录账号"-->
<!--        />-->
        <a-select
            :disabled="!!curItem.capitalStatus"
            v-model:value="curItem.userId"
            show-search
            placeholder="选择登录账号"
            style="width: 200px"
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="null"
            :options="accountRes"
            @search="handleSearch"
            @change="changeAccount"
        ></a-select>
      </a-form-item>
    </template>
  </FormModal>
</template>

<style scoped lang="less">

</style>