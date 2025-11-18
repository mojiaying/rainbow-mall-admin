<script setup lang="tsx">
import {
  goodsListApi,
  goodsListParams,
} from "@/api/mall.ts";
import Add from "./components/add.vue";
import MyPage from "@/components/my-page.vue";
import { StatusObj } from "@/types/global";
import dayjs from "dayjs";
import {myPage, searchConf, columns, loading, showSkuShelf, curSkuList, showSetShelf, curSpuId, Readonly, formModal,
  selectAll, setSkuShelf, resetSkuPop, setShelfTime, setAllSkuIds, setSkuIds} from "./good.tsx";


// tab 签 切换 = = = = = = = = = = = = = = = = = = = = = 》
const statusList = shallowRef<StatusObj>({
  'ALL': { value: '', count: 0, label:'全部'},
  'LISTED': { value: 1, count: 0, label:'已上架' },
  'UN_LISTED': { value: 2, count: 0, label:'已下架' },
  'DRAFT': { value: 0, count: 0, label:'草稿' },
})
const status = ref()
function statusChange(data:string) {
  status.value = data;
  useInit(loading,() =>myPage?.value?.init())
}


// 接口业务逻辑 = = = = = = = = = = = = = = = =》
// 列表
async function getList(params: goodsListParams)
{
  if(Array.isArray(params?.createdAt)){
    let temp = {
      start: useDate(params?.createdAt[0], 'yyyy-MM-dd', true) || '',
      finish: useDate(params?.createdAt[1],'yyyy-MM-dd', true) || '',
    }
    params.createdAt = temp
  }
  const res = await goodsListApi({ ...params,shelfStatus:status.value })
  formatData(res)
  myPage.value?.setResData(res)
}

// 处理列返回数据 --------------------------------------》
function formatData(res: any) {
  // 格式化返回参数
  res?.data?.forEach((item: any) => {
    item.status = item?.shelfStatus
    let skus = item.attach?.mallProductSkus
    if(skus?.length){
      let stocks = 0
      let actualStocks = 0
      skus.forEach((sku:any) => {
        stocks += sku.attach?.mallProductSkuStock?.stocks
        actualStocks += sku.attach?.mallProductSkuStock?.actualStocks
      })
      item.stock = stocks
      item.allSale = actualStocks - stocks
    }
  })
// 状态tab签 数据计算回显
  useSetTab(statusList, res.ext)
}// 新增 编辑 查看 ---------------------------------------------------》
let showAdd = ref(false)
// 打开新增页面
function openAdd(id: string){
  showAdd.value = true
  curSpuId.value = id
}
// 关闭新增页面
function closeAdd(){
  showAdd.value = false
  curSpuId.value = ''
  Readonly.value = false
  // 重置状态为"全部"并刷新列表
  // status.value = '' // 对应"全部"状态
  // myPage.value?.init()
}

async function updatePage(msg?: string){
  await useInit(loading, () => myPage?.value?.init(), msg)
}
</script>

<template>
  <div>
    <page-container v-show="!curSpuId">
      <my-page ref="myPage"
               :searchConf="searchConf"
               :loading="loading"
               :columns="columns"
               @statusChange="statusChange"
               @openAdd="openAdd('new')"
               :statusList="statusList"
               @getList="getList"></my-page>
      <!--    设置定时上架-->
      <a-modal v-model:open = 'showSetShelf ' width="600px" title="设置定时上架" @ok="setShelfTime">
        <a-form ref="shelfTimeRef" :model="formModal">
          <a-form-item name="shelfTime" label="设置上架时间" :rules ="[ { required: true, message: '请选择上架时间' } ]">
            <a-date-picker
                v-model:value="formModal.shelfTime"
                :show-time="{ hideDisabledOptions: true,}"
                :disabled-date="(current:any) => current && current < dayjs().startOf('seconds')"
                format="YYYY-MM-DD HH:mm:ss"
            />
          </a-form-item>
        </a-form>
      </a-modal>
      <!--    设置SKU上下架-->
      <a-modal v-model:open = 'showSkuShelf' width="800px" title="设置SKU上下架" @cancel="resetSkuPop">
        <div>
          <div class="my-grid">
            <div class="grid-th"><a-checkbox v-model:checked="selectAll" @change="setAllSkuIds"></a-checkbox></div>
            <div class="grid-th">规格名称</div>
            <div class="grid-th">库存</div>
            <div class="grid-th">状态</div>
          </div>
          <div class="my-grid" v-for="item in curSkuList" :key="item?.id">
            <div class="grid-td"><a-checkbox v-model:checked="item.checked" @change="setSkuIds(item, $event)"></a-checkbox></div>
            <div class="grid-td">{{item.skuName}}</div>
            <div class="grid-td">{{item.stocks}}</div>
            <div class="grid-td" :style="{color:item.shelfStatus == 1 ? 'green' : 'red'}">
              {{ item.shelfStatus == 1 ? '已上架' : '已下架' }}
            </div>
          </div>
        </div>
        <template #footer>
          <a-button type="primary" @click="setSkuShelf(1)">上架</a-button>
          <a-button danger @click="setSkuShelf(0)">下架</a-button>
        </template>
      </a-modal>
    </page-container>
    <Add v-if="curSpuId" :Readonly="Readonly" @closeAdd="closeAdd" @updatePage="updatePage" :spuId="curSpuId"></Add>
  </div>
</template>
<style scoped lang="scss">
.my-grid {
  display: grid;
  grid-template-columns: 30px 1fr 1fr 1fr;
  &:nth-child(2n+1) {
    background-color: #F5F7FB;
  }
}
</style>