import MyPage from "@/components/my-page.vue";
import { StatusObj } from "@/types/global";
import { CustomColumnsType } from "ant-design-vue/es/table";
import {Image, Flex, Popover } from 'ant-design-vue';
import {useIndex} from "@/composables/table-data.ts";
const curItem = ref()
const loading = ref(false)
const showAudit = ref(false)
const showReturn = ref(false)
// 子组件对象
const myPage = ref<InstanceType<typeof MyPage>>()

const statusList = shallowRef<StatusObj>({
    'ALL': { value: '', count: 0, label:'全部' },
    'PENDING_APPROVAL': { value: 'PENDING_APPROVAL', count: 0, label:'待审核' },
    'PENDING_RETURN': { value: 'PENDING_RETURN', count: 0, label:'待寄回' },
    'RETURNED': { value: 'RETURNED', count: 0, label:'待收货' },
    'REFUND_SUCCESS': { value: 'REFUND_SUCCESS', count: 0, label:'已退款' },
})

const statusMap = {
    'PENDING_APPROVAL': '待审核',
    'PENDING_RETURN': '待寄回',
    'RETURNED': '待收货',
    'REFUNDING': '退款中',
    'REFUND_SUCCESS': '已退款',
    'REFUND_FAILURE': '退款失败',
    'CLOSED': '用户取消'
}


// 组件配置 = = = = = = = = = = = = = = = =》
/// 1.搜索组件配置
const searchConf = shallowReactive([
  {
    label: '订单号',
    key: 'orderCodeLike',
  },
    {
        label: '',
        key: 'timeRange',
        type: 'date-range',
        slot: 'timeRange',
        options: [
            {label: '订单创建时间', value: 1},
            {label: '订单支付时间', value: 2},
            {label: '申请退货时间', value: 3},
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
    },
    {
        title: '售后单号',
        fixed: true,
        dataIndex: 'orderId',
        customRender: (row:any) => row.record?.code
    },
    {
        title: '原订单号',
        dataIndex: 'orderId',
        customRender: (row:any) => row.record?.attach?.order?.code
    },{
        title: '商品',
        dataIndex: 'product',
        customRender: (row: any) => {
            let pro = row.record?.attach?.order?.attach?.detail?.productInfo
            return pro && <Flex style={{ flex: 1 }}>
                <Image style={{ width: '50px', height: '50px' }} src={pro?.sku?.skuUrl} fallback={useErrorImg()}></Image>
                <Flex vertical style={{ justifyContent: 'space-between', marginLeft: '10px' }}>
                    <Popover content={pro?.sku.skuName} trigger="hover">
                        <div class={'line-hide a-left'} style={{ width: '180px' }}>
                            <div>{pro?.spu?.spuName}</div>
                            <div class={'gray'}>{pro?.sku?.skuName}</div>
                        </div>
                    </Popover>
                    <span class={'gray a-left sm'}>{pro?.sku.expand}</span>
                </Flex>
            </Flex>
        },
        width: 250
    },
    {
    title: '售后状态',
        dataIndex: 'status',
        customRender: (row: any) => {
        let item = row?.record;
            return <span >
                <div style={{color: `${item?.status == 'PENDING_APPROVAL' ? 'red' : ''}`}}>{statusMap[item.status as 'CLOSED'] || item.status}</div>
                {item?.status == 'PENDING_APPROVAL' && <div>退款原因：{item?.applyInfo?.reason}</div>}
            </span>
        }
    }, {
        title: '售后类型',
        dataIndex: 'type',
        customRender: (row: any) => row.record?.type == 0 ? '仅退款' : '退货退款',
    }, {
        title: '申请时间',
        dataIndex: 'gmtCreated',
    },{
        title: '退款金额',
        dataIndex: 'refundMoney',
        customRender: (row:any) => row.record?.attach?.order?.attach?.detail?.payInfo?.actualPayment
    }, 
    {
        title: '退款物流信息',
        dataIndex: 'information',
        customRender: (row: any) => {
            let deliveryInfo = row.record?.deliveryInfo
            return <Flex style={{ flex: 1 }}>
                <Flex vertical style={{ justifyContent: 'space-between', marginLeft: '10px' }}>
                    <Popover content={deliveryInfo?.logisticsComp} trigger="hover">
                        <span class={'line-hide a-left'}>快递公司：{deliveryInfo?.logisticsComp}</span>
                    </Popover>
                    <Popover content={deliveryInfo?.logisticsNo} trigger="hover">
                        <span class={'gray a-left sm'}>快递单号：{deliveryInfo?.logisticsNo}</span>
                    </Popover>
                </Flex>
            </Flex>
        },
        width: 200,
    },
    {
        title: '操作',
        dataIndex: 'action',
        buttons: [
            {
                label: '退款',
                key: 'refund',
                mapName: (row: any) => row.record?.status == 'RETURNED' ? '退款' : '',
                onclick: async (row: any) => {
                    showReturn.value = true
                    curItem.value = row.record
                },
            },
            {
                label: '审核',
                key:'audit',
                // mapName: (row: any) => row.record?.status !== 'PENDING_APPROVAL' ? '' : row.record?.type == 0 ? '退款' : '审核',
                mapName: (row: any) => row.record?.status !== 'PENDING_APPROVAL' ? '' : '审核',
                onclick: async (row: any) => {
                    // if(row.record?.type == 0) {
                    //     showReturn.value = true
                    // }  else {
                    //     showAudit.value = true
                    // }
                    showAudit.value = true
                    curItem.value = row.record
                    // let refundVoucher = JSON.parse(row.record.refundVoucher)
                    // curItem.value.pics = refundVoucher.pics || []
                    // curItem.value.desc = refundVoucher.desc
                },
            },
        ],
    },
]

export {columns, myPage, searchConf, loading, statusList, curItem, showAudit, showReturn}

