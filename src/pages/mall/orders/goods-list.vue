<script setup lang="ts">
const props = defineProps(["curItem"])
let item = props.curItem?.productInfo.sku
let spu = props.curItem?.productInfo.spu


</script>

<template>
  <div >
  <a-row :gutter="10" align="middle">
    <a-col class="center" flex="50px">
      <a-image :src="item.skuUrl" width="50px" height="50px"/>
    </a-col>
    <a-col class="center line-blue" flex="80px">{{item.skuCode}}</a-col>
    <a-col class="center red" flex="80px">¥{{item.price}}</a-col>
    <a-col class="center blue" flex="80px">x{{curItem.payInfo?.count}}</a-col>
    <a-col class="center gray" flex="80px">¥{{curItem.payInfo?.product}}</a-col>
    <a-col class="small" flex="auto" style="min-width: 100px;">
      <div class="line-hide" style="max-width: 200px;">{{ spu.spuName }}</div>
      <div>{{ item.skuName }}</div>
<!--      <div class="gray" v-if="item.expand">{{item.expand}}</div>-->
    </a-col>
  </a-row>
    <a-row :gutter="10" align="middle">
      <a-col class="center" flex="220px"></a-col>
      <a-col class="center" flex="80px">x{{curItem.payInfo?.count}}</a-col>
      <a-col class="center" flex="80px">¥{{curItem.payInfo?.product}}</a-col>
    </a-row>
  </div>
</template>

<style scoped lang="less">
.center{text-align: center}
.red{color: red;}
.blue{color: blue;}
.line-blue{color: #22b9ff;}
.small{
  font-size: 12px;
}
</style>