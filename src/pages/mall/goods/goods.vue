<script setup lang="tsx">
import {
  changeSkuStatusApi,
  deleteMallGoodsApi,
  goodsChangeParams,
  goodsListApi,
  goodsListParams,
  skuListApi
} from "@/api/mall.ts";
import Add from "./components/add.vue";
import MyPage from "@/components/my-page.vue";
import { StatusObj } from "@/types/global";
import { CustomColumnsType } from "ant-design-vue/es/table";
import {goodsChangeApi } from "@/api/mall";
import dayjs from "dayjs";
import {Flex, Image, message, Tooltip} from "ant-design-vue";
import {useErrorImg, useIndex} from "@/composables/table-data.ts";

const loading = ref(false)
const myConfirm = useConfirm()
const curSpuId = ref('')
const Readonly = ref(false)

// 子组件对象
const myPage = ref<InstanceType<typeof MyPage>>()
const shelfTimeRef = shallowRef()
const statusMap = {
  0: '草稿',
  1: '上架',
  2: '下架'
}
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

// 组件配置 = = = = = = = = = = = = = = = =》
/// 1.搜索组件配置
const searchConf = shallowReactive([
  {
    label: '商品名称',
    key: 'spuNameLike',

  },
  {
    label: '创建时间',
    key: 'createdAt',
    type: 'date-range',
  },
])
// 2.table 表头配置
const columns: CustomColumnsType<any>[] = [
  {
    title: '序号',
    dataIndex: 'index',
    fixed: true,
    customRender: ({ index }:{index:number}) => useIndex(myPage.value?.pagination, index)
  },{
    title: '商品',
    fixed: true,
    dataIndex: 'name',
    customRender: (row: any) => {
      return <Flex style={{ flex: 1, textAlign: 'left' }}>
        <Image style={{ width: '50px', height: '50px' }} src={row.record?.mainImages?.[0]} fallback={useErrorImg()}></Image>

        <Flex vertical style={{justifyContent: 'space-between', marginLeft:'10px'}}>
          <Tooltip placement="top" title={row.record.spuName}>
            <span class={'line-hide'} style={{maxWidth: '280px', cursor: 'pointer'}}>{row.record.spuName}</span>
          </Tooltip>
          <span class={'gray'}>商品编码：{row?.record?.spuCode || '-'}</span>
        </Flex>
      </Flex>},
  },{
    title: '分类',
    dataIndex: 'category',
    customRender: ({record}) => record?.attach?.category?.attach?.fullName || '-',
  },
  {
    title: '￥售价',
    dataIndex: 'priceGap',
    customRender: (row: any) => {
      let min = Infinity
      let max = 0
      row.record?.attach?.mallProductSkus?.forEach((item:any) => {
        if(item?.price < min) min = item?.price
        if(item?.price > max) max = item?.price
      })
      return !max ? '-' : max == min ? `¥${max}` : `¥${min} - ${max}`
    }
  },{
    title: '可售总库存',
    dataIndex: 'stock',
  },{
    title: '累计销售',
    dataIndex: 'allSale',
  }, {
    title: '状态',
    dataIndex: 'shelfStatusName',
    customRender: (row:any) => {
      let colorMap = {
                0: 'orange',
                1: 'green',
                2: 'red',}
      let color = {color: colorMap[row?.record?.shelfStatus as 0 | 1 | 2]}
      let shelfTime = row?.record?.shelfTime 
      
      return <div>
        <div style={color}>
          {statusMap[row?.record?.shelfStatus as 0 | 1 | 2]}
          {shelfTime && <span style={{color: 'orange'}}> (待上架)</span>}
        </div>
        {shelfTime && <div class={'gray'}>{shelfTime}</div>}
      </div>
    }
    
    },
  {
    title: '创建时间',
    dataIndex: 'gmtCreated',
  },
  {
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
    buttons:[

      {
        label: '查看',
        key: 'detail',
        onclick: async (row:any) =>{
          curSpuId.value = row.record.id
          Readonly.value = true
        },
      },
      {
        label: '编辑',
        key: 'edit',
        onclick: async (row:any) =>{
          curSpuId.value = row.record.id
        },
      },
      {
        label: '下架',
        key: 'OnOff',
        mapName:(row:any) => row.record?.shelfStatus === 1 ? '下架' : '立即上架',
        style: (row:any) => ({color: row.record?.shelfStatus === 1 ? 'red' : 'green'}),
        onclick: async function (row:any){
          formModal.value.spuId = row.record.id
          let shelfStatus = row.record?.shelfStatus
          formModal.value.operateType = shelfStatus === 1? 2 : 1
          confirmShelfUp(formModal.value.operateType, row.record.spuName)
        }
      },
      {
        label: '删除',
        key: 'del',
        onclick: async (row:any) =>{
          myConfirm(`删除后不可恢复，确认删除 ${row.record.spuName} 吗？`, '',()=> deleteItem(row.record.id))
        },
        style: {color:'red'}
      },
      {
        label: '定时上架',
        key: 'TIMING_ON',
        show: (row:any) => row.record?.shelfStatus  == 0,
        onclick: async (row:any) =>{
          formModal.value.spuId = row.record.id
          formModal.value.operateType = 1
          showSetShelf.value = true
        },
      },
      {
        label: 'SKU上下架',
        key: 'SKU_OnOff',
        onclick: async (row:any) =>{
          // 1. 获取sku列表
          const list = await skuListApi(row.record.id);
          curSkuList.value = list.map((item:any) => {
            return {
              id: item?.id,
              skuName: item?.skuName,
              checked: false,
              stocks: item?.attach?.mallProductSkuStock?.stocks,
              shelfStatus: item?.shelfStatus,
            }
          })
          // 2. 显示SKU list modal
          showSkuShelf.value = true
        },
      },
    ],
  },
]


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
}
// 删除 --------------------------------------------------》
async function deleteItem(id:string){
  const res = await deleteMallGoodsApi(id)
  if(res) await  useInit(loading, () => myPage?.value?.init(), '删除成功')
}
//  SPU 上架 / 下架 ----------------------------------------------------------》
const showSetShelf = ref(false)
const formModal = ref<goodsChangeParams>({
  spuId: '',
  operateType: 1,
  shelfTime: '',
})

// 上下架 接口
async function shelfUp(msg: string){
  if(formModal.value.operateType === 1) formModal.value.shelfTime = ''
  let res = await goodsChangeApi(formModal.value)
  if (res) useInit(loading, () => myPage?.value?.init(), `${msg}成功！`)
}
// 上下架 确认框
function confirmShelfUp(type:number, name: string){
  let tiptxt = type === 1? '立即上架' : '下架'
  myConfirm(`确认${tiptxt} ${name} 吗？`, '',async ()=> {
    await shelfUp(tiptxt)
  })
}

// 定时上架
async function setShelfTime(){
  try{
    await shelfTimeRef.value?.validate()
    formModal.value.operateType = 0
    await shelfUp('定时上架')
    showSetShelf.value = false
  } catch(e){
    message.error('请选择定时上架时间')
  }

}
//  SKU 上下架 ----------------------------------------------------------》
const showSkuShelf = ref(false)
const curSkuList = ref<any[]>([])
const selectSkuIds = ref<string[]>([])
// 调 SKU 上下架 接口
async function setSkuShelf(type:0 | 1){
  if(!selectSkuIds.value.length) {
    message.error('请选择要上下架的SKU')
    return
  }
  const res = await changeSkuStatusApi({skuIds: selectSkuIds.value, status: type})
  if(res) {
    await useInit(loading, () => myPage?.value?.init(), `SKu ${type ? '上架' : '下架' } 成功！`)
    showSkuShelf.value = false
    resetSkuPop()
  }
}
function resetSkuPop(){
  selectAll.value = false
  selectSkuIds.value = []
  curSkuList.value = []
}

// 选择 SKU 项
 // 全选状态
const selectAll = ref(false);
function setAllSkuIds(e:any){
  selectAll.value = e?.target.checked
  if(e?.target.checked) {
    selectSkuIds.value = curSkuList.value.map(item => {
      item.checked = true
      return item.id
    })
  } else {
    selectSkuIds.value = []
    curSkuList.value.forEach(item => {
      item.checked = false
    })
  }
}
function setSkuIds(cur: any, e:any){
  if(e.target.checked) {
    selectSkuIds.value.push(cur.id)
  } else {
    selectSkuIds.value = selectSkuIds.value.filter(item => item !== cur.id)
  }
}
// 新增 编辑 查看 ---------------------------------------------------》
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