<script setup lang="ts">
import {rejectRef} from "@/pages/mall/orders/orders.tsx";
import {confirmFinishOrderApi, deliveredApi} from "@/api/mall.ts";
import FormModal from "@/components/form-modal.vue";
import {message} from "ant-design-vue";
const myConfirm = useConfirm()

const activeKey = ref(['1']);
const showModal = ref(false);
const statusMap = {
  'NOT_PAY': 0,
  'TO_DELIVER': 1,
  'DELIVERED': 2,
  'RECEIVED': 3,
  'FINISH': 4,
  'CLOSED': 4
}
defineProps(['rejectRef'])
const emit = defineEmits(['initPage'])
let curItem = ref<{[key: string]: any}>({})
let detail = ref<{[key: string]: any}>({})
const tableHeader = ["序号", "商品图片", "规格名称", "数量", "单价", "成交金额", "可用库存", "备注"]
// async function getDetail(){
//   const res = await mallOrderDetailApi(curItem.value?.orderId)
//
// }
// watch(()=> props.curItem,()=>{
//   getDetail()
// })
function open(item?:any){
  if(item) {
    curItem.value = {...item}
    detail.value = item?.attach?.detail
  }
  setTimeout(()=>{ showModal.value = true; }, 100)
}
function close(){
  showModal.value = false;
}
defineExpose({
  open,
  close
})
// 确认发货 ---------------------------------------》
const formRef = ref<InstanceType<typeof FormModal>>()
const formModal = ref({
  id: '',
  logisticsNo: ''
})
const formConf = [
  {
    key: 'logisticsNo',
    label: '快递单号',
    type: 'input',
    rules: [{ required: true, message: '请填写快递单号' }]
  }
]

function toDeliver(id:string){
  formModal.value.id = id
  formRef.value?.open()
}
async function setDelivered(){
  const res = await deliveredApi(formModal.value)
  if(res) {
    message.success('发货成功')
    formRef.value?.close()
    close()
    emit('initPage')
  }
}
// 订单完成 ---------------------------------------》
async function finishOrder(orderId:string){
  myConfirm(`确认完成该订单吗？`, '',async ()=> {
    const res = await confirmFinishOrderApi(orderId)
    if(res) {
      message.success('订单完成!')
      close()
      emit('initPage')
    }
  })

}
// 取消订单 ---------------------------------------》
async function cancelOrder(){
  rejectRef.value?.open()
}
</script>

<template>
  <FormModal ref="formRef" title="填写物流信息" :form-conf="formConf" :formModal="formModal" @onOk="setDelivered"></FormModal>
<a-modal v-model:open="showModal" title="订单详情" width="1200px">
  <a-alert  type="error" mb-4 v-if="curItem?.status == 'CLOSED'">
    <template #description>
      
      <span style="color: red;font-weight: bolder">已关闭</span>
       <span class="gray"> ({{curItem.remark}})</span>
    </template>
  </a-alert>

  <a-steps mt-8 mb-8 v-else
      progress-dot
      :current="statusMap[curItem.status as keyof typeof statusMap]"
      :items="[
        {title: '待付款'},
        {title: '待发货'},
        {title: '待收货'},
        {title: '已完成'},
        {title: '已结束'},
      ]"
  ></a-steps>
  <a-collapse v-model:activeKey="activeKey">
    <!--   订单基本信息 ------------------------------------------------------------------------- -->
    <a-collapse-panel key="1" header="订单基本信息">
      <a-form :disabled="true" style="max-width: 600px;" :labelCol="{style: { width: '120px' }}">
        <a-form-item label="订单编号"><a-input :value="detail?.orderId" /></a-form-item>
        <a-flex>
        <a-form-item label="下单时间"> <a-input :value="curItem?.gmtCreated" /></a-form-item>
        <a-form-item label="支付时间"> <a-input :value="detail?.payInfo?.payTime" /></a-form-item>
        </a-flex>
        <a-flex>
        <a-form-item label="运费" > <a-input :value="detail?.payInfo?.freight" /></a-form-item>
        <a-form-item label="买家留言"> <a-input :value="detail?.memberInfo?.remark" /></a-form-item>
        </a-flex>
      </a-form>
    </a-collapse-panel>
    <!--   买家收货信息 ------------------------------------------------------------------------- -->
    <a-collapse-panel key="2" header="买家收货信息">
      <a-form :disabled="true" style="max-width: 600px;" :labelCol="{style: { width: '120px' }}">

        <a-flex>
          <a-form-item label="收件人"> <a-input :value="detail?.addressInfo?.contact?.name" /></a-form-item>
          <a-form-item label="手机号"> <a-input :value="detail?.addressInfo?.contact?.phone?.number" /></a-form-item>
        </a-flex>
        <a-form-item label="收货地址">
          <a-flex gap="small">
          <a-select :value="detail?.addressInfo?.address?.province"></a-select>
          <a-select :value="detail?.addressInfo?.address?.city"></a-select>
          <a-select :value="detail?.addressInfo?.address?.county"></a-select>
            <!--            <div>{{detail?.addressInfo?.address?.province}}</div>-->
            <!--            <div>{{detail?.addressInfo?.address?.city}}</div>-->
<!--            <div>{{detail?.addressInfo?.address?.county}}</div>-->
          </a-flex>
        </a-form-item>
        <a-form-item label="详细地址" > <a-input :value="detail?.addressInfo?.address?.address" /></a-form-item>
      </a-form>
    </a-collapse-panel>
    <!--   订单商品 ------------------------------------------------------------------------- -->
    <a-collapse-panel key="3" header="订单商品">
      <div class="my-grid">
        <div class="grid-th" v-for="(item, index) in tableHeader" :key="index">
          <div>{{item}}</div>
        </div>
      </div>
      <div class="my-grid">
        <div class="grid-td">1</div>
        <div class="grid-td"><a-image width="50px" height="50px" :src="detail?.productInfo?.sku?.skuUrl"></a-image></div>
        <div class="grid-td flex-col">
            <div class="left">{{detail?.productInfo?.sku?.skuName}}</div>
            <div class="gray left">{{detail?.productInfo?.sku?.expand}}</div>
        </div>
        <a-flex class="grid-td" >
          <div>x{{detail?.payInfo?.count}}</div>
        </a-flex>
        <div class="grid-td"><a-input :disabled="true" :value="`¥ ${detail?.productInfo?.sku?.price}`"/></div>
<!--        <div class="grid-td"><a-input :disabled="true"  :value="`¥ ${detail?.productInfo?.sku?.costPrice}`"/></div>-->
        <div class="grid-td"><a-input :disabled="true"  :value="`¥ ${detail?.payInfo?.single}`"/></div>
        <div class="grid-td">{{detail?.productInfo?.status}}</div>
        <div class="grid-td">{{detail?.productInfo?.remark}}</div>
      </div>
      <div class="flex-center">商品总数： {{detail?.payInfo?.count}}</div>
      <a-flex class="flex-col flex-left">

        <a-flex class="flex-left">
          <div class="label">商品总成交金额： </div>
          <div class="val">¥{{detail?.payInfo?.product}}</div>
        </a-flex>

        <a-flex class="flex-left">
          <div class="label"> — 优惠抵扣金额|佣金： </div>
          <div class="val">¥<a-input-number :disabled='true' style="width: 60px;" :value="detail?.payInfo?.rainbow"/></div>
        </a-flex>

        <a-flex class="flex-left">
          <div class="label"> + 运费： </div>
          <div class="val">¥{{detail?.payInfo?.freight}}</div>
        </a-flex>

        <a-flex class="flex-left">
          <div class="line"></div>
        </a-flex>
        <a-flex class="flex-left">
          <div class="label">应付总金额：  </div>
          <div class="val red">¥{{detail?.payInfo?.orderPayment}}</div>
        </a-flex>
        <a-flex class="flex-left">
          <div class="label">彩虹币抵扣：  </div>
          <div class="val red">¥{{detail?.payInfo?.rainbow}}</div>
        </a-flex>

        <a-flex class="flex-left">
          <div class="label">实际已付：  </div>
          <div class="val red">¥{{detail?.payInfo?.actualPayment}}</div>
        </a-flex>


      </a-flex>
    </a-collapse-panel>
<!--   订单支付情况 ------------------------------------------------------------------------- -->
    <a-collapse-panel key="4" header="订单支付情况">
      <a-form :disabled="true" style="max-width: 600px;" :labelCol="{style: { width: '120px' }}">
        <a-flex>
          <a-form-item label="支付宝金额"> <a-input :value="detail?.payInfo?.actualPayment" /></a-form-item>
          <a-form-item label="支付日期"> <a-input :value="detail?.payInfo?.payTime" /></a-form-item>
        </a-flex>
      </a-form>
    </a-collapse-panel>
  </a-collapse>
  <template #footer>
    <a-flex class="flex-center">
    <a-button  @click="cancelOrder" v-if="curItem?.status == 'NOT_PAY'">取消订单</a-button>
    <a-button type="primary" v-if="curItem?.status == 'TO_DELIVER'" @click="toDeliver(curItem.id)">确认发货</a-button>
    <a-button type="primary" v-if="curItem?.status == 'DELIVERED'" @click="finishOrder(curItem.orderId)">订单完成</a-button>
    </a-flex>
  </template>
</a-modal>
</template>

<style scoped lang="less">
.my-grid{
  grid-template-columns: 50px 100px 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  .grid-th{
    font-size: 14px;
  }
}
.left{
  width: 100%;
}
.flex-left{
  justify-content: flex-end;
  padding: 2px;

  .val{
    display: flex;
    gap: 2px;
    align-items: center;
    width: 120px;
  }
  .label{
    margin-right: 2px;
  }
  .line{
    width: 300px;
    border-bottom: 1px solid #a8a3a3;
    margin: 2px;
  }
}
</style>