import MyPage from "@/components/my-page.vue";
import { StatusObj } from "@/types/global";
import { CustomColumnsType } from "ant-design-vue/es/table";
import {useIndex} from "@/composables/table-data.ts";
// import { goodsListApi } from "@/api/mall.ts";
// const myConfirm = useConfirm()
// const curItem = ref('')
const loading = ref(false)
// 子组件对象
const myPage = ref<InstanceType<typeof MyPage>>()
const statusMap = {
  0: '未入住',
  1: '正常',
  2: '冻结'
}

const statusList = shallowRef<StatusObj>({
    'ALL': { value: '', count: 0, label:'全部'},
    '在售': { value: '0', count: 0, label:'在售' },
    '待售': { value: '1', count: 0, label:'待售' },
    '下架': { value: '2', count: 0, label:'下架' },
})



// 组件配置 = = = = = = = = = = = = = = = =》
/// 1.搜索组件配置
const searchConf = shallowReactive([
  {
    label: '商品名称',
    key: 'nameLike',
  },
  {
    label: '创建时间',
    key: 'updatedAt',
    type: 'date',
  },
])
// 2.table 表头配置
const columns: CustomColumnsType<any>[] = [
    {
        title: '序号',
    dataIndex: 'index',
    customRender: ({ index }:{index:number}) => useIndex(myPage.value?.pagination, index)
    },{
        title: '商品',
    dataIndex: 'product',
    width: 200
    },{
        title: '分类',
    dataIndex: 'classification',
    },
    {
        title: '￥售价',
      dataIndex: ' pricing',
    },{
        title: '可售库存',
      dataIndex: 'inventory',
        mapName: (row:any) => useFullAddress(row.text)
    },{
        title: '累计销售',
        dataIndex: 'sales',
    }, {
        title: '状态',
        dataIndex: 'status',
        mapName: (row: any) => statusMap[row.record.status as 0 | 1 | 2],
        style: (row: any) => {
        let colorMap = {
        '0': 'blue',
        '1': 'green',
          '2': 'red',
          }
          return { color: colorMap[row.record.status as 0 | 1 | 2] || '' }
    }
  },
  {
        title: '创建时间',
        dataIndex: 'time',
    },
    {
        title: '操作',
        dataIndex: 'action',
    },
]

export {columns, myPage, searchConf, loading, statusList}