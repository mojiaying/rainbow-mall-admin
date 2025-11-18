import MyPage from "@/components/my-page.vue";
import { StatusObj } from "@/types/global";
import {Badge, Image, Popover} from 'ant-design-vue';
import { CustomColumnsType } from "ant-design-vue/es/table";
import GoodsList from "@/pages/mall/orders/goods-list.vue";
import Reject from "@/components/reject.vue";
import Detail from "@/pages/mall/orders/detail.vue";
import {useIndex} from "@/composables/table-data.ts";
// import { goodsSalesApi } from "@/api/mall.ts";
// const myConfirm = useConfirm()
const curItem = ref()
const loading = ref(false)
// 子组件对象
const myPage = ref<InstanceType<typeof MyPage>>()
const rejectRef = ref<InstanceType<typeof Reject>>()
const detailRef = ref<InstanceType<typeof Detail>>()
const statusList = shallowRef<StatusObj>({
    'ALL': { value: '', count: 0, label: '全部'},
    'NOT_PAY': { value: 'NOT_PAY', count: 0, label: '待付款'},
    'TO_DELIVER': { value: 'TO_DELIVER', count: 0, label: '待发货'},
    'DELIVERED': { value: 'DELIVERED', count: 0, label: '待收货'},
    'RECEIVED': { value: 'RECEIVED', count: 0, label: '已完成' },
    'FINISH': { value: 'FINISH', count: 0, label: '已结束' },
})


// 组件配置 = = = = = = = = = = = = = = = =》
/// 1.搜索组件配置
const searchConf = shallowReactive([
  {
    label: '订单号',
    key: 'codeLike',
  },
  {
    label: '',
      key: 'createdAt',
      type: 'date-range',
      slot: 'createdAt',
      options: [
          {label: '订单创建时间', value: 1},
          {label: '订单支付时间', value: 2},
      ],
      optKey: 'searchTimeType',
      defaultOpt: 1
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
        title: '订单号',
        fixed: true,
        dataIndex: 'code',
        customRender: (row: any) => {
            return <a onClick={() => openDetail(row.record)}>{row.record?.code}</a>
        },
    }, {
        title: '商品',
        fixed: true,
        dataIndex: 'productName',
        customRender: (row: any) => {
            // let list:any[] = row.record.orderProductList
            // if(!list || list.length == 0) return
            let pro = row.record?.attach?.detail?.productInfo.sku
            return <Popover placement="top"
                content={<GoodsList curItem = {row.record?.attach?.detail}></GoodsList>}
                // content={<Image style={{width: '50px', height: '50px'}}  src={pro.skuUrl}/>}
                    title={"订单商品详情说明"}>
                    <div>
                        {/*{list.map((item: any) => )}*/}
                        <div>
                            <Image style={{width: '50px', height: '50px'}} src={pro?.skuUrl}></Image>
                            <Badge style={{position: 'absolute', left: '8px', top: '8px'}} number-style={{
                                backgroundColor: '#fff',
                                color: '#1677ff',
                                boxShadow: '0 0 0 1px #1677ff inset',
                            }} count={pro?.num}/>
                        </div>
                    </div>
                </Popover>

        },
    },{
        title: '订单状态',
        dataIndex: 'status',
        customRender: (row: any) => {
            const statusMap = {
                'NOT_PAY': '待付款',
                'TO_DELIVER': '待发货',
                'DELIVERED': '待收货',
                'RECEIVED': '已完成',
                'FINISH': '已结束',
                'CLOSED': '已关闭',
            }
            return <div>
                <div>{statusMap[row.record.status as 'NOT_PAY']}</div>
                <div class={'gray'}>{row.record?.remark}</div>
            </div>
        },
    },
    {
        title: '售后状态',
        dataIndex: 'payStatus',
        customRender: (row: any) => {
            let returnStatusMap = {
                 'PENDING_APPROVAL': '待审核',
                 'PENDING_RETURN': '待寄回',
                 'RETURNED': '待收货',
                 'REFUNDING': '退款中',
                 'REFUND_SUCCESS': '退款成功',
                 'CLOSED': '退款关闭',
            }
            return returnStatusMap[row.record?.attach?.refund?.status as 'PENDING_RETURN']
        }
    },{
        title: '买家留言',
        dataIndex: 'remark',
        width: 200,
        customRender: (row:any) => {
            let text = row.record?.attach?.detail?.memberInfo?.remark
            return <Popover placement="top" title="买家留言" content={<div style={{ maxWidth: '300px' }}>{text}</div>}>
                <div class="line-hide2">{text}</div>
            </Popover>;
        }
    },{
        title: '订单支付时间',
        dataIndex: 'payTime',
        customRender: (row: any) => row.record?.attach?.detail?.payInfo?.payTime
    }, {
        title: '订单创建时间',
        dataIndex: 'gmtCreated',
    }, {
        title: '支付方式 | 金额',
        dataIndex: 'payChannelName',
        customRender: ({record}) => {
            let payTypeMap = {
                0: '组合支付',
                1: '仅彩虹币',
                2: '仅人民币',
            }
            return <span>
                        <div class={'a-left'}>{payTypeMap[record?.attach?.detail?.productInfo?.spu?.payType?.type as 1] || '-'} ｜
                        <span>{record.attach?.detail?.payInfo?.orderPayment}</span></div>
                    </span>
        },
        width: 100
    },
    {
        title: '收货地址',
        dataIndex: 'address',
        customRender: (row:any) => {
            let address = row?.record?.attach?.detail?.addressInfo?.address
            let contact = row?.record?.attach?.detail?.addressInfo?.contact
            return <div>
                <div>{address?.province || ''} {address?.city || ''}  {address?.county || ''} {address?.address || ''}</div>
                <div class={'gray'}>({contact?.name}) ({contact?.phone?.number})</div>
            </div>
        },
        width: 182,
    },{
        title: '仓库',
        dataIndex: 'warehouseName',
        customRender: ({record}) => record?.attach?.detail?.productInfo?.spu?.warehouseInfo?.name || '-'
    },{
        title: '供应商',
        dataIndex: 'supplierName',
        customRender: ({record}) => record?.attach?.detail?.productInfo?.spu?.supplierInfo?.name || '-'
    },
    {
        title: '操作',
        dataIndex: 'action',
        fixed: 'right',
        buttons:[
            {label: '详情',
                key: 'detail',
                onclick: async (row:any) =>{
                    detailRef?.value?.open(row.record)
                    curItem.value = row.record
                },
            },
            {label: '发货',
            key: 'deliver',
            show: (row:any) => row.record.status == 'TO_DELIVER',
            onclick: async (row:any) =>{
                detailRef?.value?.open(row.record)
                curItem.value = row.record
            },
            },
            {label: '取消',
            key: 'cancel',
            style: (row:any) => ({display: row.record.status == 'NOT_PAY' ? 'block' : 'none'}),
             onclick: async (row:any) =>{
                 rejectRef?.value?.open()
                 curItem.value = row.record
             },
            }
        ],
        width: 150,
    },
]
function openDetail(record: any){
    curItem.value = record
    detailRef?.value?.open()
}

export {columns, myPage, rejectRef, searchConf, loading, statusList,  curItem, detailRef}