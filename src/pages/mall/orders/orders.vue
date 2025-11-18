<script setup lang="ts">
import MyPage from "@/components/my-page.vue";
// import {MerchantListParams, storeListApi} from "@/api/merchant.ts";
import {useContact, useSetTab} from "@/composables/table-data.ts";
import { columns, myPage, searchConf, loading, statusList, curItem, rejectRef, detailRef } from './orders.tsx'
import {goodsSalesParams, goodsSalesApi, cancelOrderApi} from '@/api/mall.ts'
import Reject from "@/components/reject.vue";
import Detail from "@/pages/mall/orders/detail.vue";
const status = ref('')
// 状态切换 配置（getList 入参加状态）= = = = = = = = =》

function statusChange(data:string) {
  status.value = data;
  useInit(loading,() =>myPage?.value?.init())
}
// 接口业务逻辑 = = = = = = = = = = = = = = = =》
// 列表
async function getList(params: goodsSalesParams) {
  type TimeRange = {
    start: string | null,  // 开始时间
    finish: string | null // 结束时间
  }
  let payAt: TimeRange | undefined = undefined
  let createdAt: TimeRange | undefined = undefined
  if(Array.isArray(params?.createdAt)){
    let temp = {
    start: useDate(params?.createdAt[0], 'yyyy-MM-dd'),
    finish: useDate(params?.createdAt[1],'yyyy-MM-dd'),
  }
    if(params?.searchTimeType == 2) payAt = temp
    if(params?.searchTimeType == 1) createdAt = temp
}
  const res = await goodsSalesApi({ ...params, status: status.value, payAt, createdAt })
  formatData(res)
  myPage.value?.setResData(res)
}

// 处理列返回数据
function formatData(res: any) {
  // 格式化返回参数
  res?.data?.forEach((item:any) => {
    let contact:any = item?.skuUrl
    item.contact = (contact && useContact(contact)) 
  })
// 状态tab签 数据计算回显
  useSetTab(statusList, res.ext)
}
// 取消订单 ---------------------->
const rejectReasons = ref('')
const reasons = ['商品缺货', '客户申请取消', '重复订单', '逾期未支付', '其他']
async function cancelOrder() {
  const res = await cancelOrderApi({id: curItem?.value?.id, reason: rejectReasons.value})
  if(res) {
    rejectRef.value?.close()
    detailRef?.value?.close()
    useInit(loading,() =>myPage?.value?.init(), '订单取消成功')
  }
}
function initPage(){
  useInit(loading,() =>myPage?.value?.init())
}
// 订单详情 ------------------------------》
</script>

<template>
  <div>
    <page-container>
      <my-page ref="myPage"
               :searchConf="searchConf"
               :loading="loading"
               :columns="columns"
               :hideAddBtn="true"
               @statusChange="statusChange"
               :statusList="statusList"
               @getList="getList">
        <template #createdAt="{item, formModal}">
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
    <Detail ref="detailRef"  @initPage="initPage" :rejectRef="rejectRef"></Detail>
    <div>
      <Reject ref="rejectRef" :reason-list="reasons" v-model:reason="rejectReasons" @onReject="cancelOrder" title="取消订单"></Reject>
    </div>

  </div>
</template>