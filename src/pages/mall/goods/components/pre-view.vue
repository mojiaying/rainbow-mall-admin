<script setup lang="ts">
import {ShareAltOutlined, StarOutlined, CloseCircleOutlined} from "@ant-design/icons-vue";
import {useErrorImg} from "@/composables/table-data.ts";
const props = defineProps(["formData"]);
const loading = ref(false);
const priceRange = ref<string | null | number>(null);
const nameList = ref<string[]>([]);
const colorList = ref<string[]>([]);
const sizeList = ref<string[]>([]);
const curSku = ref<any>()
const skuUrl = ref<string>()
const selectedName = ref<string>('')
const selectedColor = ref<string>('')
const selectedSize = ref<string>('')
watch(
  () => props.formData,
  () => {
    setSkuInfo(props.formData)
  },
  {deep: true}
)
setSkuInfo(props.formData)
const showTicket = ref(false);
function toggleTicketWrap() {
  showTicket.value = !showTicket.value;
}
function setSkuInfo(formData:any){
  // skuUrl.value = props?.formData?.mallProductSkus[0]?.skuUrl
  let priceList: string[] = []
  console.log('curSku.value===========', formData.mallProductSkus)
  let skuNames: string[] = []
  let skuColors: string[]  = []
  let skuSizes: string[]  = []
  if(formData.mallProductSkus) {
    formData.mallProductSkus?.forEach((item:any) => {
      if(item.skuName) skuNames.push(item.skuName)
      if(item.color) skuColors.push(item.color)
      if(item.size) skuSizes.push(item.size)
      if(item.price) priceList.push(item.price)
    })
  }

  nameList.value = [...new Set(skuNames)]
  colorList.value = [...new Set(skuColors)]
  sizeList.value = [...new Set(skuSizes)]
  priceList = [...new Set(priceList)]
  setPriceRange(priceList)
}
function setPriceRange(priceList:any[]){
  let lowerPrice = Infinity
  let highPrice = 0
  priceList.forEach((item:any) => {
    if(item < lowerPrice) lowerPrice = item
    if(item > highPrice) highPrice = item
  })
    priceRange.value = lowerPrice == highPrice ? highPrice : highPrice == 0 ? '商品价格' : `${lowerPrice} ~ ${highPrice}`
}
function setName(name:string){
  selectedName.value = selectedName.value == name ? '' : name
  setCurSku()
}
function setColor(color:string){
  selectedColor.value = selectedColor.value == color ? '' : color
  setCurSku()
}
function setSize(size:string){
  selectedSize.value = selectedSize.value == size ? '' : size
  setCurSku()
}

function setCurSku(){
  let validColor = !colorList.value.length || selectedColor.value
  let validSize = !sizeList.value.length || selectedSize.value
  let skuList = props.formData?.mallProductSkus
  if(validColor && validSize && selectedName.value){
    let resList = skuList?.filter((item:any) => item.skuName == selectedName.value)
    if(selectedColor.value) resList = resList.filter((item:any) => item.color == selectedColor.value)
    if(selectedSize.value) resList = resList.filter((item:any) => item.size == selectedSize.value)
    curSku.value = resList[0]
  }
}
</script>

<template>
  <div class="pre-view">
  <div class="phone">
    <div v-show="showTicket" class="mask"></div>
    <BaseLoading v-if="loading"></BaseLoading>
    <div class="tips">
      <div><img src="/logo.png" class="logo"/>仅供预览使用</div>
      <div>最终线上效果以APP演出详情页为准</div>
    </div>
<!--   商品基本 信息-->
    <div class="container">
      <div mb-2 class="banner">
        <a-carousel arrows v-if="formData?.mainImages?.length">
          <div v-for="(item,index) in formData?.mainImages">
            <img :key="index" :src="item?.url || item"/>
          </div>
        </a-carousel>
        <div v-else class="flex-center flex-column" style="width: 100%;height: 200px;background-color: #fff;">
          <div class="decs">暂无图片</div>
          <div>商品主图将在此展示</div>
        </div>
      </div>

<!--      <a-image style="width: 100%;background-size: contain;height: 300px;" :src="formData?.mallProductSpuImages" class="logo" :fallback="useErrorImg()"/>-->
      <a-flex class="block flex-column" style="gap: 2px;">
        <div class="price">¥ <span style="font-size: 22px;">{{ `${priceRange}`}}</span></div>
        <h4>{{formData?.spuName || '添加 商品后 商品名称将在此进行展示'}} </h4>
      </a-flex>

      <div class="block flex-column" mt-2>
        <h3>商品详情</h3>
        <div style="min-height: 300px;">
          <div v-if="!formData.expand" class="decs">商品详情 添加内容将在此展示</div>
          <div class="view" v-else v-html="formData?.expand" style="width: 100%;"></div>
        </div>
      </div>
      <!--    footer-->
      <a-flex class="footer flex-row" style="justify-content: space-between;width: 100%">
        <a-flex class="flex-row" style="gap: 30px;">
          <ShareAltOutlined style="font-size: 24px"/>
          <StarOutlined style="font-size: 24px"/>
        </a-flex>
        <a-button class="btn" @click="toggleTicketWrap">立即购买</a-button>
      </a-flex>
      </div>


<!--     商品规格列表 ----------------------------------------------->
    <div v-show="showTicket" class="wrap">
      <div class="content">
        <CloseCircleOutlined class="close-bnt"  @click="toggleTicketWrap"/>

        <a-flex class="cur-sku" gap-2>
          <div class="sku-img">
            <a-image style="width: 100px;min-width: 80px;" :src="curSku?.skuUrl || skuUrl " class="logo" :fallback="useErrorImg()"/>
          </div>
          <div class="sku-info">
            <div class="price">¥ <span>{{curSku?.price || priceRange}}</span></div>
            <div class="gray">库存：</div>
            <h3 mt-2>已选：{{selectedName}} {{selectedColor}} {{selectedSize}}</h3>
          </div>
        </a-flex>

        <div class="info-list" v-show="nameList?.length">
          <h3>规格名称</h3>
          <a-flex class="item-wrap">
              <div v-for="item in nameList" :class="{'item': true, 'active': selectedName == item}" @click="setName(item)">
                {{item}}
              </div>
          </a-flex>
        </div>

        <div class="info-list" v-show="colorList?.length">
          <h3>颜色</h3>
          <a-flex class="item-wrap">
            <div v-for="item in colorList" :class="{'item': true, 'active': selectedColor == item}" @click="setColor(item)">
              {{item}}
            </div>
          </a-flex>
        </div>

        <div class="info-list" v-show="sizeList?.length">
          <h3>尺寸</h3>
          <a-flex class="item-wrap">
            <div v-for="item in sizeList" :class="{'item': true, 'active': selectedSize == item}" @click="setSize(item)">
              {{item}}
            </div>
          </a-flex>
        </div>

    </div>
      <a-flex class="footer-wrap" v-show="showTicket">
        <a-button class="btn" @click="toggleTicketWrap">确定</a-button>
      </a-flex>
  </div>
  </div>
  </div>
</template>

<style scoped lang="scss">
.flex-column{
  gap: 20px;
  flex-direction: column;
  display: flex;
}
.flex-row{
  display: flex;
  gap: 20px;
  flex-direction: row;
}
.view:deep(img){
  width: 100%;
}
.pre-view{
  width: 400px;
  min-width: 320px;
  max-width: 400px;
  height: 820px;
  flex-grow: 1;
  flex-shrink: 0;
  .phone {
    position: relative;
    width: 400px;
    min-width: 320px;
    height: 820px;
    background: #fff;
    box-shadow: 0 2px 15px rgba(0, 0, 0, .2);
    border-radius: 16px;
    overflow: hidden;

    .container {
      height: 666px;
       width: 100% !important;
      overflow: auto;
      background-color: #f9f9f9;
      .banner {
        img{
          width: 100%;
          height: 280px !important;
          background-size: cover;
          object-fit: cover;
        }
      }
      .block {
        background-color: #fff;
        padding: 16px;
        display: flex;
        gap: 20px;
        position: relative;
      }
    }
    .tips {
      text-align: center;
      padding: 20px 10px;
      background: linear-gradient(#7e7777, #8c6d48);
      color: #fff;

      .logo {
        width: 20px;
        border-radius: 50%;
        overflow: hidden;
        margin: 5px 10px;
      }
    }
    .btn{
      background: linear-gradient(rgb(255, 196, 30), #ff8e00, rgb(253, 191, 15));
      color: #fff;
      font-weight: bolder;
      height: auto;
      padding: 10px 20px;
      border-radius: 30px;
      width: 50%;
    }
  }
  .footer{
    position: absolute;
    background-color: #fff;
    bottom: 0;
    border-top: 1px solid #efefef;
    padding: 20px 30px;
    width: 100%;
    box-sizing: border-box;
  }
}
.mask{
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.6);
  z-index: 1;
}
.wrap{
  position: absolute;
  border-radius: 10px;
  margin-bottom: 0;
  width: 100%;
  z-index: 2;
  //background-color: rgba(0,0,0,0.5);
  bottom: 0;
  .close-bnt{
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 24px;
    color: gray;
    z-index: 3;
  }
  .content{
    animation: slideUp 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    width: 100%;
    padding: 15px 15px 80px 15px;
    border-radius: 10px;
    height: auto;
    min-height: 500px;
    max-height: 800px;
    overflow: auto;
    position: absolute;
    bottom: 0;
    background-color: #fff;
    .info-list{
      padding: 15px 0;
    }
    .item-wrap{
      gap: 10px;
      flex-wrap: wrap;
    }
    .item{
      padding: 6px 12px;
      background-color: #fdecdf;
      border-radius: 6px;
      cursor: pointer;
      &.active{
        background-color: #ff8e00;
        color: #fff;
      }
    }
  }
  .cur-sku{
    gap: 15px;
    padding-bottom: 15px;
    align-items: flex-end;
    .sku-info{
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }
  }
  .footer-wrap{
    position: absolute;
    bottom: 0;
    width: 100%;
    text-align: center;
    padding: 15px;
    background-color: #fff;
    border-top: 1px solid #efefef;
    justify-content: space-between;
    z-index: 3;
    .btn{
      width: 100%;
    }
  }
  .session-wrap{
    flex-wrap: wrap;
    .session{
      padding: 8px 18px;
      background-color: #ffd99a;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
      &:hover{
        background-color: #fbd0a2;
      }
      &.active{
        color: #fff;
        background: linear-gradient(rgb(255, 196, 30), #ff8e00, rgb(253, 191, 15));
      }
      &.disabled{
        cursor: not-allowed !important;
        pointer-events: none;
        opacity: 0.5;
        background: #bfbfbf !important;
      }
    }
  }

}
.price{
  color: orange;
  font-size: 20px;
  span{
    font-size: 28px;
    font-weight: bold;
  }
}
/* 定义向上滑动的动画 */
@keyframes slideUp {
  from {
    /* 动画开始时，弹窗在屏幕外 */
    transform: translateY(50%);
  }
  to {
    /* 动画结束时，弹窗在屏幕内 */
    transform: translateY(0%);
  }
}


@media (min-width: 1600px) {
  .pre-view .phone{
    position: fixed;
    top: 184px;
    right: 36px;
  }
}
@media (max-height: 1000px) {
  .pre-view .phone, .pre-view{
    width: 320px !important;
    flex-grow: 0;
    height: 680px;
    .tips{
      padding: 10px;
    }
  }
}
@media (max-width: 1600px), (max-height: 860px) {
  .pre-view .phone{
    position: relative;
    top: 0;
    right: 0;
  }
  .pre-view .phone, .pre-view{
    width: 320px !important;
    flex-grow: 0;
    height: 680px;
    .tips{
      padding: 10px;
    }
  }
}

</style>