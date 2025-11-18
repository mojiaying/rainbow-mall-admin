<script setup lang="ts">
import MyPage from "@/components/my-page.vue";
import {
  goodsReturnParams,
  goodsReturnApi,
  auditRefundApi,
  refundApi,
  auditRejectApi,
  rejectReturnApi
} from '@/api/mall.ts'
import {useSetTab} from "@/composables/table-data.ts";
import {columns, myPage, searchConf, loading, statusList, curItem, showAudit, showReturn} from './return.tsx'
import Reject from "@/components/reject.vue";
import {rejectRef} from "@/pages/mall/orders/orders.tsx";
import {useDataStore} from "@/stores/useDataStore.ts";
import {ReturnAddressParams} from "@/api/mallsetting.ts";
import AddReturnAddress from "@/pages/mall/return/addReturnAddress.vue";
import {useErrorImg} from "@/composables/table-data.ts";
import {message} from "ant-design-vue";
const dataSource = useDataStore()
onMounted(() => {
  getAddressList()
})
let addressList = ref<ReturnAddressParams[]>()
const addAddressRef = ref<InstanceType<typeof AddReturnAddress>>()
async function getAddressList() {
  if(dataSource.changeFlag?.refundAddress) await dataSource.getRefundAddressList()
  addressList.value = dataSource.refundAddressList || []
}
const status = ref('')
// 状态切换 配置（getList 入参加状态）= = = = = = = = =》

function statusChange(data:string) {
  status.value = data;
  useInit(loading,() =>myPage?.value?.init())
}
// 接口业务逻辑 = = = = = = = = = = = = = = = =》
// 列表
async function getList(params: goodsReturnParams)
{
  let start, finish
  if(params?.timeRange){
     start = useDate(params?.timeRange[0], 'yyyy-MM-dd') || ''
     finish = useDate(params?.timeRange[1],'yyyy-MM-dd') || ''
    params.createOrderAt = undefined
    params.payOrderAt = undefined
    params.refundAt = undefined
    if(params?.searchTimeType == 1) {
      params.createOrderAt = {start, finish}
    } else if(params?.searchTimeType == 2) {
      params.payOrderAt = {start, finish}
    } else {
      params.refundAt = {start, finish}
    }
  }

  const res = await goodsReturnApi({...params, status: status.value})
  formatData(res)
  myPage.value?.setResData(res)
}
// 处理列返回数据
function formatData(res: any) {
  // 格式化返回参数
  res?.data?.forEach((_item:any) => {
    
  })
// 状态tab签 数据计算回显
  useSetTab(statusList, res.ext)
}
// 审核 ----------------------------------------------------------》
function getFulAddress(item:any) {
  return `${item.province} ${item.city} ${item.county} ${item.address}`
}
const showAgreen = ref(false);
function openAgreen() {
  if(curItem?.value?.type == 0){
    showReturn.value = true
  } else {
    showAgreen.value = true;
  }
}
function openReject() {
  rejectRef.value?.open()
}
// 选择地址 ---------------------->
const curAddressId = ref()
function setCurAddress(item:any) {
  curAddressId.value = item.id
}
// 同意退货 ---------------------->
async function handleAgreen() {
  let params = {
    id: curItem?.value?.id,
    addressId: curAddressId.value || '',
  }
  if(curItem?.value?.type == 1){
    if(!params.addressId) return message.error('请选择退货地址！')
    params.addressId = curAddressId.value
  }
  const res = await auditRefundApi(params)
  if(res) {
    curAddressId.value = ''
    showAudit.value = false
    showAgreen.value = false
    let txt = curItem?.value?.type == 1? '同意退货' : '同意退款'
    useInit(loading,() =>myPage?.value?.init(), `${txt}成功！`)
  }
}
// 拒绝退货 ---------------------->
const rejectReasons = ref('')
const reasons = ['特殊商品不可退', '其他']
async function handleReject(){
  let params = {
    id: curItem?.value?.id,
    reason: rejectReasons.value,
  }
  const res = curItem?.value?.status == 'PENDING_APPROVAL' ? await auditRejectApi(params) : await rejectReturnApi(params)
  if(res) {
    rejectRef.value?.close()
    useInit(loading,() =>myPage?.value?.init(), curItem?.value.afterSales == 0 ? '拒绝退款成功！' :'拒绝退货退款成功！')
    showReturn.value = false
    showAudit.value = false // 关闭审核弹窗
  }
}

// 退款 ----------------------------------------------------------》
async function refundItem(){
  if(curItem?.value?.type == 0){
    handleAgreen()
  } else {
    let res = await refundApi(curItem?.value?.id)
    if(res)  useInit(loading,() =>myPage?.value?.init(), `退款成功！`)
  }
    showReturn.value = false
    showAudit.value = false // 关闭审核弹窗
}
// 展示创建地址
function openAddAddress(){
  addAddressRef?.value?.open()
  curAddressId.value = ''
}
async function updateList(){
  await dataSource.getRefundAddressList()
  addressList.value = dataSource.refundAddressList || []
}
</script>

<template>
  <div>
    <page-container>
      <my-page ref="myPage"
               :searchConf="searchConf"
               :loading="loading"
               :columns="columns"
               @statusChange="statusChange"
               :hideAddBtn="true"
               :statusList="statusList"
               @getList="getList">
        <template #timeRange="{item, formModal}">
          <a-select v-if="item?.options" :disabled="item.disabled"
                    style="width: 180px"
                    v-model:value="formModal[item.optKey as keyof typeof formModal]"
                    :placeholder="item.placeholder || `请选择${item.label}`"
                    @change="item.handleChaneg">
            <a-select-option v-for="opt in item.options" :key="opt.value" :value="opt.value">
              {{opt.label}}
            </a-select-option>
          </a-select>
          <a-range-picker style="width: 380px"  :format="item.format || 'YYYY/MM/DD'" v-model:value="formModal[item.key as keyof typeof formModal]" />

        </template>
      </my-page>
    </page-container>
    <AddReturnAddress ref="addAddressRef" @updateList="updateList"></AddReturnAddress>

<!--    同意确认框---------------------------------------------------->
    <a-modal v-model:open = 'showAgreen' width="800px" title="同意退货" @ok="handleAgreen">
      <div>选择退货地址：</div>
      <a-flex wrap="wrap" gap="small">
        <div v-for="item in addressList" :class="item.id == curAddressId ? 'address-card active' : 'address-card'" mt-1 @click="setCurAddress(item)">
          <div>{{getFulAddress(item.address)}}</div>
          <div>{{item?.contact?.name}} {{item?.contact?.phone?.number}}</div>
        </div>
      </a-flex>
      <div style="color: #0097f3; margin-top: 10px;cursor: pointer;" @click="openAddAddress">创建新地址</div>
    </a-modal>
    <!--     退款弹窗 ---------------------------------------------------->
    <a-modal v-model:open = 'showReturn' width="600px" title="同意后货款会直接返还给用户">
      <div> 是否同意用户的退款请求？ </div>
      <template #footer>
        <a-button type="primary" @click="refundItem">同意</a-button>
        <a-button danger @click="openReject">拒绝</a-button>
      </template>
    </a-modal>

    <Reject :z-index="2000" ref="rejectRef" :reason-list="reasons" v-model:reason="rejectReasons" @onReject="handleReject" title="拒绝"></Reject>
    <!--    审核详情弹窗 ----------------------------------------------------->
    <a-modal v-model:open = 'showAudit' width="500px" :title="`审核${curItem?.type ? '退货': '退款'}`">
      <div>
        <div>{{curItem?.type ? '退货': '退款'}}原因 ： {{(curItem as any)?.applyInfo?.reason || '-'}}</div>
        <div mt-2>凭证描述： {{curItem?.applyInfo?.reasonDetail}}</div>
        <a-flex gap="small" style="margin-top: 20px">
          <div v-for="item in curItem?.applyInfo?.reasonImages">
            <a-image :src="item" width="100px" height="100px" :fallback="useErrorImg()"/>
          </div>
        </a-flex>
      </div>
      <template #footer>
        <a-button type="primary" @click="openAgreen">同意</a-button>
        <a-button danger @click="openReject">拒绝</a-button>
      </template>
    </a-modal>
  </div>
</template>

<style scoped lang="scss">
.address-card{
  width: 48%;
  padding: 10px;
  cursor: pointer;
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  &:hover{
    border: 1px solid #cadadf;
  }
  &.active{
    border: 1px solid #b8dbf8;
    background-color: #f8fafd;
  }
}
</style>