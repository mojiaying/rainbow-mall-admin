<script setup lang="tsx">
defineProps(['listData', 'column', 'layout'])
const errorImg = useErrorImg()
</script>

<template>
  <div v-for="item in listData" class="info-list">
    <a-flex class="title1" pl-3 mb-6>
      <span class="line"></span>
      {{ item.title }}</a-flex>
    <div v-if="item.desc" class="title2">{{item.desc}}</div>

<!-- 横向排列 自动换行-->
      <a-flex class="row" v-if="item.row">
        <a-flex v-for="val in item.row" :style="{flexDirection: val.type == 'img' || val.html || val.slot ? 'column': 'row', width: val.w ? `${val.w}%` : 'auto'}" class="desc">
          <div :class="!val.thin ? 'title2' : 'thin'" v-if="val.label">{{ val.label }}:</div>
          <div class="gray">
            <div v-if="!val.type && val.value">{{ val.value }}</div>
            <div v-if="val.html" v-html="val.html"></div>
            <flex v-else-if="val.type == 'img'" gap="6" style="margin-top: 8px">
              <Image :width="160" :height="100" class="border" v-if="typeof val.value == 'string'" :src="val.value" :fallback="errorImg"></Image>
              <Image :width="160" :height="100" v-else v-for="j in val.value" :src="j" :fallback="errorImg"></Image>
            </flex>
          </div>
          <slot v-if="val.slot" :name="val.slot" :slotData="val.slotData || ''"></slot>
        </a-flex>
      </a-flex>
<!-- 纵向排列 等宽-->
    <a-flex class="conBox">
    <a-flex v-for="val in item.column" :style="{flexDirection: Array.isArray(val) || val.type == 'img'   ? 'column' : 'row'}">
        <a-flex v-if="Array.isArray(val)"  v-for="i in val" class="desc" :style="{flexDirection: i.type == 'img' || i.html || i.slot? 'column': 'row'}">
          <div :class="!i.thin ? 'title2' : 'thin'" v-if="i.label">{{ i.label }}:</div>
          <div class="gray">
            <div v-if="!i.type">{{ i.value }}</div>
            <div v-if="i.html" v-html="i.html"></div>
            <flex v-else-if="i.type == 'img'" gap="6" style="margin-top: 8px">
              <Image :width="160" :height="100" class="border" v-if="typeof i.value == 'string'" :src="i.value" :fallback="errorImg"></Image>
              <Image :width="160" :height="100" v-else v-for="j in i.value" :src="j" :fallback="errorImg"></Image>
            </flex>
          </div>
          <slot v-if="i.slot" :name="i.slot" :slotData="i.slotData || ''"></slot>
      </a-flex>

      <a-flex v-else :style="{flexDirection: val.type == 'img' || val.html || val.slot ? 'column': 'row'}" class="desc">
        <div :class="!val.thin ? 'title2' : 'thin'" v-if="val.label">{{ val.label }}:</div>
        <div class="gray">
          <div v-if="!val.type">{{ val.value }}</div>
          <div v-if="val.html" v-html="val.html"></div>
          <flex v-else-if="val.type == 'img'" gap="6" style="margin-top: 8px">
            <Image :width="160" :height="100" class="border" v-if="typeof val.value == 'string'" :src="val.value"></Image>
            <Image :width="160" :height="100" v-else v-for="j in val.value" :src="j"></Image>
          </flex>
        </div>
        <slot v-if="val.slot" :name="val.slot" :slotData="val.slotData || ''"></slot>
      </a-flex>

    </a-flex>
    </a-flex>

  </div>
</template>
<style lang="less" scoped>
.info-list{
  border-bottom: 1px solid #eee;
  padding: 10px 0;
  .conBox{
    justify-content: space-between;
    flex-wrap: wrap;
    >div{
      flex: 1;
    }
  }
}
.title1{
  font-weight: bolder;
  font-size: 20px;
  align-items: center;
  margin-bottom: 10px;
  .line{
    height: 20px;
    display: inline-block;
    padding-right: 5px;
    border-left: 3px solid var(--pro-ant-color-primary);
  }
}
.thin{
  margin-right: 10px;
  white-space: nowrap;
}
.desc{
  padding: 6px 0;
  font-size: 16px;
  .gray{
    font-size: 18px;
    ul{
      margin-left: -30px;
    }
  }
}
.title2{
  font-weight: bolder;
  margin-right: 10px;
  font-size: 16px;
  white-space: nowrap;
}
.row{
  flex-direction: row;
  flex-wrap: wrap;
  >div{
    padding-right: 30px;
  }
}
:deep(.ant-image>img){
  object-fit: contain;
  border-radius: 5px;
  box-shadow: 0px 0px 10px #ccc;
}
</style>
