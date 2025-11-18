<script setup lang="ts">
import MyPage from "@/components/my-page.vue";
import {columns, myPage, searchConf, loading, showEditStore, curItem, skuList} from './inventory.tsx'
import {goodsInventoryParams, goodsInventoryApi, storeUpdateApi} from "@/api/mall.ts";
import {useErrorImg} from "@/composables/table-data.ts";
import {message} from "ant-design-vue";
const status = ref('')
// 状态切换 配置（getList 入参加状态）= = = = = = = = =》

function statusChange(data:string) {
  status.value = data;
  useInit(loading,() =>myPage?.value?.init())
}
// 接口业务逻辑 = = = = = = = = = = = = = = = =》
// 列表
async function getList(params: goodsInventoryParams)
{
  
  let categoryId = params?.categoryId && params?.categoryId[params?.categoryId.length - 1] || ''
  const res = await goodsInventoryApi({...params, categoryId})
  formatData(res)
  myPage.value?.setResData(res)

}

// 处理列返回数据
function formatData(res: any) {
  // 格式化返回参数
  res?.data?.forEach((item: any) => {
    item.classification = item?.attach?.mallProductSpu?.attach?.category?.attach?.fullName
    item.inventory = item?.attach?.mallProductSkuStock?.actualStocks
    item.sellable = item?.attach?.mallProductSkuStock?.stocks
  })
// 状态tab签 数据计算回显
}
//修改库存
const typeOptions = [{value: 1, label: '增加'}, {value: 0, label: '减少'}]
function computeStoreNum(item:any, e?: any) {
  if(e) item.storeChangeNum = Number(e.target.value)
  if (item.opType) {
    item.storeNum = item.orgStoreNum + item.storeChangeNum
  } else {
    item.storeNum = item.orgStoreNum - item.storeChangeNum
  }
  if (item.storeNum < 0) {
    item.err = '库存不能为负数'
  } else {
    item.err = ''
  }
}
async function updateStore(){
  skuList.value.forEach((item:any) => {
    let {opType, id, storeChangeNum} = item
    if (!!storeChangeNum) {
      storeUpdateApi({skuId: id, opType: opType, number: storeChangeNum}).then(() => {
        message.success('修改库存成功')
        showEditStore.value = false
        curItem.value = ''
        skuList.value = []
        useInit(loading, () => myPage?.value?.init())
      }).catch(err => {message.error(err?.message || '修改库存失败')})
    }
  })
}
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
               @getList="getList"></my-page>
    </page-container>
    <a-modal v-model:open = 'showEditStore' width="800px" title="修改库存" @ok="updateStore">
      <div>
        <Flex style='flex: 1'>
          <Image style="width: 50px;height: 50px" :src="curItem?.skuUrl" :fallback="useErrorImg()"></Image>
          <Flex vertical style="justify-content: space-between;margin-left:10px">
          <span >{{curItem?.skuName}}</span>
          <a-flex class="gray">
            <div mr-6>商品ID：{{curItem?.skuCode}}</div>
            <span>可售库存：{{curItem?.sellable}}</span>
          </a-flex>
        </Flex>
        </Flex>

        <div class="grid">
          <div class="grid-th">规格名称</div>
          <div class="grid-th">库存增减</div>
          <div class="grid-th">修改后可售库存</div>
        </div>
        <div class="grid" v-for="item in skuList" :key="item?.id">
          <div class="grid-td">{{item?.skuName}}</div>
          <div class="grid-td">
            <div>
            <a-flex gap="small">
              <a-radio-group v-model:value="item.opType" :options="typeOptions" option-type="button" @change="computeStoreNum(item)"/>
              <a-input type="number" style="width: 80px;text-align: center" :value="item?.storeChangeNum" @change="computeStoreNum(item, $event)"></a-input>
            </a-flex>
            <div mt-2><a-alert v-if="item.err" type="error" :message="item.err" banner /></div>
            </div>
          </div>
          <div class="grid-td">{{item.storeNum}}</div>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<style scoped lang="scss">
.grid{
  display: grid;
  grid-template-columns: 150px 2fr 1fr ;
  grid-gap: 1px;
  border-radius: 5px;
  overflow: hidden;
  margin-top: 1px;
  &:nth-child(2n+1){
    background-color: #F5F7FB;
  }
  .grid-th, .grid-td{
    padding: 12px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .grid-th{
    margin-top: 16px;
    font-weight: bold;
    background-color: rgb(228, 234, 254);
  }
}
</style>
