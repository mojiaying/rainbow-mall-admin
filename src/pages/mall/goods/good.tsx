import {useErrorImg, useIndex} from "@/composables/table-data.ts";
import {Flex, Image, message, Tooltip} from "ant-design-vue";
import { CustomColumnsType } from "ant-design-vue/es/table";
import {changeSkuStatusApi, deleteMallGoodsApi, goodsChangeApi, goodsChangeParams, skuListApi} from "@/api/mall.ts";
import MyPage from "@/components/my-page.vue";


// 子组件对象
const myPage = ref<InstanceType<typeof MyPage>>()
const shelfTimeRef = shallowRef()
const loading = ref(false)
const myConfirm = useConfirm()
const curSpuId = ref('')
const Readonly = ref(false)
const statusMap = {
  0: '草稿',
  1: '上架',
  2: '下架'
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

export {myPage, searchConf, columns, loading, showSkuShelf, curSkuList, showSetShelf, curSpuId, Readonly, formModal,
  selectAll, setSkuShelf, setShelfTime, setAllSkuIds, setSkuIds, resetSkuPop}