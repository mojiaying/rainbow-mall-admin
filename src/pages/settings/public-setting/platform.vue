<script setup lang="ts">
import MyPage from "@/components/my-page.vue";
// import {MerchantListParams, storeListApi} from "@/api/merchant.ts";
import {useSetTab} from "@/composables/table-data.ts";
import {columns, myPage, searchConf, loading, statusList} from './platform.ts'
import { goodsListApi, goodsListParams } from "@/api/mall.ts";
const status = ref('')
// 状态切换 配置（getList 入参加状态）= = = = = = = = =》

function statusChange(data:string) {
  status.value = data;
  useInit(loading,() =>myPage?.value?.init())
}
// 接口业务逻辑 = = = = = = = = = = = = = = = =》
// 列表
async function getList(params: goodsListParams)
{
  const res = await goodsListApi({ ...params })
  useSetTab(statusList, res.ext)
  // myPage.value?.setResData(res)
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
               :statusList="statusList"
               @getList="getList"></my-page>
    </page-container>
  </div>
</template>