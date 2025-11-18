<script setup lang="tsx">
import { Options} from "@/types/global";
import Sku from "@/pages/mall/goods/components/sku.vue";
import {message} from "ant-design-vue";
import {findParents} from "@/utils/tools.ts";
import {QuestionCircleFilled} from "@ant-design/icons-vue";

import {
  AfterSellType,
  createMallGoodsApi,
  goodsUpdateParams,
  mallGoodsDetailApi,
  updateMallGoodsApi
} from "@/api/mall.ts";
import MyForm from "@/components/my-form/index.vue";
import {useDataStore} from "@/stores/useDataStore.ts";
import PreView from "@/pages/mall/goods/components/pre-view.vue";
import {ref} from "vue";
const props = defineProps(['spuId', 'Readonly'])
const emit = defineEmits(['closeAdd', 'updatePage'])
const { isLgDesktop } = useQueryBreakpoints()
const showPreView = ref(false)
let curCategoryId:any = undefined
// 物流模板详情
const curLogistics = ref()
// 获取 物流模板 和 商品分类数据 ------------------------------------------》
const dataSource = useDataStore()
let logisticsList = ref<Options[]>()
let categoryList = ref<Options[] |undefined>(dataSource.mallCategoryList || undefined)
let warehouseList = ref<Options[] |undefined>(dataSource.warehouseList || undefined)
let supplierList = ref<Options[] |undefined>(dataSource.supplierList || undefined)
async function getLogisticsList(){
  if(dataSource.changeFlag?.logistics) await dataSource.getLogisticsList()
  logisticsList.value = dataSource.logisticsList || []
  if(formData?.logisticsTemplateId) curLogistics.value = logisticsList.value?.find((item: any) => item.id == formData?.logisticsTemplateId)
}
async function getCategoryList(){
  if(!dataSource.mallCategoryList) {
    await dataSource.getCategoryList('mall')
  }
  categoryList.value = dataSource.mallCategoryList || []
  if(curCategoryId) {
    let categoryParent = findParents(categoryList.value as Options[], curCategoryId).map((item:any)=> item.value)
    categoryParent.push(curCategoryId)
    formData.categoryIds = categoryParent
  }
}
async function getStoreList(){
  if(dataSource.changeFlag?.warehouse) await dataSource.getWarehouseList()
  if(dataSource.changeFlag?.supplier) await dataSource.getSupplierList()
  warehouseList.value = dataSource.warehouseList || []
  supplierList.value = dataSource.supplierList || []
}




onMounted(() => {
  getCategoryList()
  getLogisticsList()
  getStoreList()
})

// 是否是创建 商品---------------》
const editAll = ref(props.spuId == 'new')
function goBack(){
  emit('closeAdd')
}
// 售后服务 复选框数据 ------------------------------------------》
const sellService = [
  {value: 'is7daysReturnable', label: '7天无理由'},
  {value: 'hasReturnCommitment', label: '退换货承诺'},
  {value: 'invoicing', label: '可开具发票'},
  {value: 'genuine', label: '正品保障'}]

const formConf = computed(()=> [
  {
    title: '商品基本信息',
    children: [
      [
        {label: ' 商品标题', key: 'spuName', type: 'input',rules: 'required'},
        {label: ' 商品编码', key: 'spuCode', type: 'input',rules: 'required', disabled: !editAll.value || props.Readonly},
      ],
      {label: ' 商品分类', key: 'categoryIds', type: 'select',rules: 'required', options: categoryList.value, width: '300px'},
      {label: ' 商品仓库 ', key: 'warehouseId', type: 'select', rules: 'required', options: warehouseList.value, width: '300px'},
      {label: '商品供应商', key: 'supplierId', type: 'select', rules: 'required', options: supplierList.value, width: '300px'},
      // {label: '商品属性标签', key: 'spuTag', type: 'tag',  disabled: !editAll.value || props.Readonly},
      {label: '支付方式', key: 'payType', slots: 'payType'},
    ]
  },
  {
    title: '商品图文信息',
    children: [
      {label: '商品主图', key: 'mainImages', type: 'img', rules: 'required', maxCount: 10, tips: '建议上传800*800,1:1的图片。图片大小5M以内。'},
    ]
  },
  {
    title: '商品规格',
    titleSlot: 'skuOpt',
    children: [
      {label: '商品标题', key: 'mallProductSkus', slots: 'productSku'},
    ]
  },
  [
    {
      title: '物流信息',
      itemWidth: '300px',
      children: [
        {label: '选择物流模板', key: 'logisticsTemplateId', type: 'select',rules: 'required', options: logisticsList.value,
          afterSlot: 'logisticsDetail'},
      ]
    },
    {
      title: '售后服务',
      children: [{label: '', key: 'afterSell', type: 'checkboxes', options: sellService}]
    },

    {
      title: '营销设置',
      slot: 'marketing',
    },
    {
      title: '商品详情描述',
      children: [{label: '', key: 'expand', type: 'editor', rules: 'required', disabled: props.Readonly}]
    },]

])
// 商品规格初始化数据 ------------------------------------------》
let skuObj = {skuCode: '', skuName: '', skuUrl: '', skuDesc: '', price: undefined,  costPrice: undefined, color: '', size: '',attach: {
    mallProductSkuExpands: []
  }}
// 初始化商品表单数据
const initFormData:any = {
  spuName: '',
  spuCode: '',
  categoryId: '',
  categoryIds: [],
  stockInfo: 0, // 0=创单减库存，1=支付减库存
  shelfStatus: 1, //（0=草稿，1=已上架，2=已下架）
  mainImages: [],
  mallProductSkus: editAll ? [{idx: 1, ...skuObj}] : [],
  logisticsTemplateId: '',
  afterSell: editAll ? ['is7daysReturnable', 'hasReturnCommitment', 'invoicing', 'genuine'] : [],
  type: 2, // 默认仅支持人民币支付
  rainbowCoinPayType: 2,
  rainbowCoinPayValue: 0,
  pointValue: undefined,
  firstDistributionValue: undefined,
  secondDistributionValue: undefined,
}

// 添加是否包邮和运费的响应式变量
const isFreeShipping = ref<0 | 1 | undefined>(undefined)
const postageFee = ref<number | undefined>(undefined)

let formData = reactive<any>({})
const isCreate = ref(false)
if(props.spuId == 'new'){
  Object.assign(formData, initFormData)
  isCreate.value = true
} else {
  getDetail()
}

function getDetail(){
  mallGoodsDetailApi({spuId:props.spuId}).then((res:any) => {

    if(res?.shelfStatus == 0) editAll.value = true //
    res.mallProductSkus=res.attach.mallProductSkus
    res.mainImages =  res.mainImages?.map((item:any, index:number) =>{
      return {url: item, idx: index}
    }) || []
    // 商品分类 回显  ----------》
    if(res.categoryId){
      if(categoryList.value){
        let categoryParent = findParents(categoryList.value as Options[], res.categoryId).map((item:any)=> item.value)
        categoryParent.push(res.categoryId)
        res.categoryIds = categoryParent
      } else {curCategoryId = res.categoryId}
    }

// 物流模板回显 -----------------------------------------------》
    curLogistics.value = logisticsList.value?.find((item: any) => item.id == res?.logisticsTemplateId)
  // 规格颜色，大小回显
    res.mallProductSkus.forEach((item:any) => {
      let color = item.attach.mallProductSkuExpands.find((item:any) => item.skuTitle == '颜色')
      let size = item.attach.mallProductSkuExpands.find((item:any) => item.skuTitle == '尺寸')
      if(item?.skuUrl.indexOf('[') != -1) item.skuUrl = JSON.parse(item.skuUrl)[0]
      item.color = color?.skuDes || ''
      item.size = size?.skuDes || ''
    })

    // 售后服务回显处理
    const afterSell: AfterSellType[] = [];
    let {is7daysReturnable, hasReturnCommitment, invoicing, genuine} = res.afterSale || {}
    if (is7daysReturnable === 1) afterSell.push('is7daysReturnable');
    if (hasReturnCommitment === 1) afterSell.push('hasReturnCommitment');
    if (invoicing === 1) afterSell.push('invoicing');
    if (genuine === 1) afterSell.push('genuine');
    res.afterSell = afterSell;
    let {type, rainbowCoinPayType, rainbowCoinPayValue} = res?.payType || {}
    // 组合支付回显 兼容旧数据
    formData.type = (!type && type != 0) ? 2 : type
    formData.rainbowCoinPayType = rainbowCoinPayType
    formData.rainbowCoinPayValue = rainbowCoinPayValue
    // 营销设置
    let {pointValue,firstDistributionValue,secondDistributionValue} = res.market
    res.pointValue = pointValue
    res.firstDistributionValue = firstDistributionValue
    res.secondDistributionValue = secondDistributionValue
    Object.assign(formData, res)
  })
}

watch(() => formData?.logisticsTemplateId, async (val) => {
  if (val) {
    curLogistics.value = logisticsList.value?.find((item:any) => item.id == val)
  }
})

const myForm = ref<InstanceType<typeof MyForm>>()
// 提交表单 前数据处理 -----------------------------------------------------------------》
async function submit(status: number){
  let res = await skuRef?.value?.validForm()
  if(!res) return
  let goNext = await myForm?.value?.onSubmit()
  if(!goNext) return

  // 验证是否包邮和运费
  if (isFreeShipping.value === 0 && (!postageFee.value || postageFee.value <= 0)) {
    message.error('请输入有效的运费')
    return
  }

  let {mallProductSkus, afterSell} = formData
  let params:any = {...formData}
  let formatSku = mallProductSkus?.map(((item:any) => {
    if(Array.isArray(item.skuUrl)) item.skuUrl = item?.skuUrl?.join(',')
    if(isCreate) item.shelfStatus = status || 0
    let newAttach = {...item.attach}
    newAttach.mallProductSkuExpands = [ {skuTitle: '颜色', skuDes: item.color}, {skuTitle: '尺寸', skuDes: item.size}]
    return {
      ...item,
      attach: newAttach
    }
  }))
  params.attach = {
    mallProductSkus: formatSku,
  }

  if(params.mainImages?.length){
    params.mainImages = params.mainImages.map((item:any) => {
      if(typeof item != "string"){
        return item.url
      } else {
        return item
      }
    })


  }
  params.categoryId = formData?.categoryIds? formData?.categoryIds[formData?.categoryIds.length - 1] : ''
  // 售后服务 字段转化: 7天无理由 退换货承诺 可开发票 保证正品
  let afterSellObj = {is7daysReturnable: 0, hasReturnCommitment: 0, invoicing: 0, genuine: 0 }
  afterSell?.forEach((item: any) => {
    afterSellObj[item as AfterSellType] = 1
  })
  params.afterSale = afterSellObj
  // 营销设置 字段转化
  params.market = {
    pointValue: formData.type !=2 ? 0 : params.pointValue || 0,
    firstDistributionValue: formData.firstDistributionValue || 0,
    secondDistributionValue: formData.secondDistributionValue || 0
  }
  params.shelfStatus = status || 0
  
  // 添加是否包邮和运费信息到attach中
  if (isFreeShipping.value !== undefined) {
    if (!params.attach) {
      params.attach = {} as any
    }
    (params.attach as any).isFreeShipping = isFreeShipping.value
    if (isFreeShipping.value === 0 && postageFee.value) {
      (params.attach as any).postageFee = postageFee.value
    }
  }
  // 支付方式 字段转化
  params.payType = {
    type: formData.type,
    rainbowCoinPayType: formData.rainbowCoinPayType,
    rainbowCoinPayValue: formData.rainbowCoinPayValue || 0
  }
  // 设置默认支付方式为人民币支付
  // params.payType = {
  //   type: 2
  // }
  isCreate.value ? createGoods(params) : updateGoods(params)
}
function createGoods(params:goodsUpdateParams){
  createMallGoodsApi(params).then((res:any) => {
    if (res) {
      emit('closeAdd')
      emit('updatePage', '新增成功')
    }
  })
}
function updateGoods(params:goodsUpdateParams){
  updateMallGoodsApi(params).then((res:any) => {
    if (res) {
      emit('updatePage', '修改成功')
      emit('closeAdd')
    }
  })
}
// 商品规格 -----------------------------------------------------------------》
// 选中的规格索引

const skuRef = ref<InstanceType<typeof Sku>>()

const Readonly = ref(false)
onMounted(() => {
  Readonly.value = props.Readonly
})
// 获取商品最低价格
function getLowestPrice(){
  let minPrice = Infinity;
  formData.mallProductSkus?.forEach((item:any)=>{
    let price = item.price
    if(!isNaN(price) && price < minPrice) minPrice = price
  })
  return minPrice
}
function resetMinRainbow(e:any){
  if(e.target.value != 2){
    formData.rainbowCoinPayType = 2
    formData.rainbowCoinPayValue = undefined
    // formData.pointValue = undefined
  }
}
function resetValue(){
  formData.rainbowCoinPayValue = undefined
}
function validPayValue(_:any, value:any){
  let val = formData.rainbowCoinPayValue || 0
  if(formData.rainbowCoinPayType === 0){
    // 固定值校验
    if(!val || val<0) return Promise.reject('请输入大于0的固定值')
    if(val.toString().split('.')[1]?.length > 2) {
      return Promise.reject('固定值最多两位小数')
    }
    let minPrice = getLowestPrice()
    if(minPrice != Infinity && val > minPrice){
      return Promise.reject(`固定值不能大于商品最低价格`)
    }
    return Promise.resolve()
  } else if(formData.rainbowCoinPayType === 1){
    if(!value) return Promise.reject('请输入百分比')
    const Regex = /^\d+$/;
    let validate = Regex.test(val as unknown as string);
    if (!validate || val < 0 || val > 100) {
      return Promise.reject('百分比必须是非负整数 且不能大于100');
    }
    return Promise.resolve()
  }
  return Promise.resolve()
}
function validRatio(_:any, value:any){
  if (!value) {
    return Promise.resolve()
  }
  const Regex = /^\d+$/;
  let validate = Regex.test(value as unknown as string);
  if (!validate || value < 0 || value > 100) {
    return Promise.reject('百分比必须是非负整数 且不能大于100');
  }
  let firstVal = formData.firstDistributionValue || 0
  let secondVal = formData.secondDistributionValue || 0
  let points = formData.pointValue || 0
  let total = Number(firstVal) + Number(secondVal) + Number(points)
  if (total > 100) {
    return Promise.reject('积分比例、一级分销比例与二级分销比例之和不能大于100%');
  }
  return Promise.resolve()
}

const windowHeight = ref(useWindowSize().height);
const showDrawer = computed(() => {
  let flag = windowHeight.value < 860
  showPreView.value = flag
  return !isLgDesktop.value || flag
})
</script>

<template>
  <page-container :title="isCreate ? '新增' : Readonly? '商品详情' : '编辑'" @goBack="goBack">
    <template #back>
      <a-flex>
        <a-button class="ml-6" size="middle" @click="showPreView = !showPreView">{{ showPreView ? ` 关闭预览` : '打开预览' }}</a-button>
        <a-button class="ml-6" size="middle" @click="goBack">返回</a-button>
      </a-flex>
    </template>
    <a-flex gap="large">
      <div style="flex-grow: 1">
        <MyForm ref="myForm" :formConf="formConf" v-model:formModal="formData" :disabled="Readonly">
      <template #payType>
        <a-form-item label="支付方式" :rules="[{required: true, message: '请选择支付方式'}]" name="type">
          <a-radio-group v-model:value="formData.type" @change="resetMinRainbow">
            <a-radio :value="0">
              彩虹币+人民币组合支付
              <a-popover trigger="click" content="说明：优先抵扣彩虹币，在彩虹币不足时可用人民币补差价。">
                <QuestionCircleFilled />
              </a-popover>
            </a-radio>
            <a-radio :value="1">仅支持彩虹币</a-radio>
            <a-radio :value="2">仅支持人民币</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item :rules="[{validator: validPayValue, trigger: 'blur'}]" name="rainbowCoinPayType" style="margin-left: 100px;">
          <a-flex v-if="formData.type === 0" style="justify-content: flex-start;align-items: flex-start;">
            <a-space>彩虹币最低额度<a-popover title="说明：" trigger="click">
              <template #content>
                <div>1、不限：不限制彩虹币最低额度，有多少付多少，不足时用人民币补足；</div>
                <div>2、固定值：设置固定最低消费彩虹币值，例：100元的商品，最低20 的限度，用户必须支付20彩虹币，剩余80可以使用人民币或彩虹币；</div>
                <div style="padding-bottom: 10px;">3、百分比：票品价格的百分比，例100元的商品，10%的限度，用户则必须支付10彩虹币，剩余90可以使用人民币或彩虹币</div>
              </template>
              <QuestionCircleFilled />
            </a-popover>：</a-space>
            <a-radio-group v-model:value="formData.rainbowCoinPayType" @change="resetValue">
              <a-flex style="flex-direction: column;">
                <a-radio :value="2">不限</a-radio>
                <a-radio :value="0">
                  <a-flex style="align-items: center; gap: 10px;height: 38px;">
                    <span>固定值</span>
                    <a-input style="width: 100px" type="number"
                             v-if="formData.rainbowCoinPayType === 0"
                             v-model:value="formData.rainbowCoinPayValue"/>
                  </a-flex>
                </a-radio>
                <a-radio :value="1">
                  <a-flex style="align-items: center; gap: 10px;height: 38px;">
                    <span>百分比</span>
                    <a-input v-if="formData.rainbowCoinPayType === 1"
                             type="number" style="width: 100px"
                             v-model:value="formData.rainbowCoinPayValue">
                      <template  #addonAfter>%</template>
                    </a-input>
                  </a-flex>
                </a-radio>
              </a-flex>
            </a-radio-group>
          </a-flex>
        </a-form-item>
      </template>
      <template #marketing>
        <a-form-item v-if="formData.type === 2" name="pointValue" :rules="[{validator: validRatio, trigger: 'blur'}]" :label-col="{ span: 2 }">
          <template #label>
            积分
            <a-popover trigger="click" content="说明：根据所支付的人民币金额，赠送对应比例的积分。">
              <QuestionCircleFilled />
            </a-popover>
          </template>
              <a-flex gap="small" class="center">
             <div> 实付人民币百分比</div>
              <a-input type="number" style="width: 100px" v-model:value="formData.pointValue">
                <template  #addonAfter>%</template>
              </a-input>
              </a-flex>
        </a-form-item>

        <a-form-item name="firstDistributionValue" label="一级分销比例" :rules="[{validator: validRatio, trigger: 'blur'}]" :label-col="{ span: 2 }">
              <a-flex gap="small" class="center">
                <div> 实付金额百分比</div>
                <a-input-number style="width: 100px" v-model:value="formData.firstDistributionValue">
                  <template  #addonAfter>%</template>
                </a-input-number>
              </a-flex>
        </a-form-item>

        <a-form-item name="secondDistributionValue" label="二级分销比例" :rules="[{validator: validRatio, trigger: 'blur'}]" :label-col="{ span: 2 }">
              <a-flex gap="small" class="center">
                <div> 实付金额百分比</div>
                <a-input-number style="width: 100px" v-model:value="formData.secondDistributionValue">
                  <template  #addonAfter>%</template>
                </a-input-number>
              </a-flex>
        </a-form-item>
      </template>
<!--      物流模板 --------------------------------------------------------------------------------------------- -->
      <template #logisticsDetail>
<!--        {{ curLogistics }}-->
        <a-flex gap="50" style="margin-left: 10px;margin-bottom: 30px;">
          <space>是否包邮:
            <span class="gray"> {{!curLogistics ? '-' : curLogistics?.isFreeShipping ? '是' : '否'}}</span>
          </space>
           <a-flex class="flex-center" v-if="!curLogistics?.isFreeShipping && curLogistics?.postageFee">
              <span>基础邮费：</span>
              <a-input :disabled="isFreeShipping !== 0" style="width: 120px" :value="curLogistics?.postageFee" placeholder='基础邮费'>
              <template #addonAfter>
                <div>元</div>
              </template>
            </a-input>
            </a-flex>
          <a-flex class="flex-center">不包邮地区:  <span class="gray"> {{curLogistics?.nonFreeShippingCities?.map((item:any) => item?.second)?.join(',')}}</span></a-flex>
          <a-flex class="flex-center">不可购买地区:  <span class="gray"> {{curLogistics?.restrictedSaleCities?.map((item:any) => item?.second)?.join(',')}}</span></a-flex>
        </a-flex>
      </template>
<!--     商品规格 --------------------------------------------------------------------------------------------- -->
       <template #productSku>
         <Sku ref="skuRef" :editAll="editAll && !Readonly" v-if="formData?.mallProductSkus" :formData="formData"></Sku>
       </template>
<!--      商品规格 end-->
<!--     富文本编辑 --------------------------------------------------------------------------------------------- -->
      <template #edit>
        <div class="rich-text-container">
          <div>{{formData.expand}}</div>
          <Editor v-model:value="formData.expand"/>
        </div>
      </template>
<!--      footer --------------------------------------------- -->
      <template #footer>
        <a-card style="margin-top: -30px;border:none">
        <a-flex gap="small" style="justify-content: center;">
          <a-button type="primary" v-if="isCreate" @click.prevent="submit(1)">立即上架</a-button>
          <a-button v-if="isCreate" @click="submit(0)">保存草稿</a-button>
          <a-button v-if="!isCreate" @click="submit(formData?.shelfStatus || 0)">保存</a-button>
          <a-button  @click="goBack">返回</a-button>
        </a-flex>
        </a-card>
      </template>
    </MyForm>
      </div>
        <PreView v-if="!showDrawer && showPreView" :formData="formData"></PreView>
        <a-drawer :visible="showDrawer && showPreView" :mask="false" :footer="false" @close="showPreView = false">
          <PreView :formData="formData"></PreView>
        </a-drawer>
    </a-flex>
  </page-container>
</template>

<style scoped lang="less">
h3{
  padding: 12px 0;
}
.center{
  //justify-content: center;
  align-items: center;
}
.gray{
  display: inline-block;
  margin-left: 10px;
}
/* 表格表头背景色修改为skyblue */
:deep(.ant-table-thead > tr > th) {
  background-color: rgb(228, 234, 254) !important;
}

.rich-text-container :deep(.w-e-hover-bar){
  bottom: 0 !important;
}
</style>
