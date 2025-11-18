<script setup lang="ts">
defineProps(['item'])
const emit = defineEmits(['updateCheckItem'])
function handleChange(e:any){
  emit('updateCheckItem', e)
}
</script>

<template>
  <flex class="column">
  <a-flex v-if="item.tabs" class="btns">
    <div class="title">Tabs：</div>
    <div class="check-item" v-for="tab in item.tabs"><a-checkbox :value="tab.value" :key="tab.value"  @change="handleChange">{{ tab.label }}</a-checkbox></div>
  </a-flex>
  <a-flex v-if="item.btns" class="btns">
    <div class="title">按钮：</div>
    <div class="check-item" v-for="btn in item.btns"><a-checkbox :value="btn.value" :key="btn.value" @change="handleChange">{{ btn.label }}</a-checkbox></div>
  </a-flex>
  </flex>
</template>

<style scoped lang="less">
.title{
  width: 60px;
  text-align: right;
}
.btns{
  padding: 10px;
  //border: 1px solid #e3e3e3;
  border-top: 1px solid #ddd;
  border-left: 1px solid #ddd;
  &:first-of-type{
    border-top: none;
  }
}
</style>