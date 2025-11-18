<script setup lang="ts">
const props = defineProps(['item'])
const emit = defineEmits(['updateParent'])
const tabs = props.item?.tabs
const btns = props.item?.btns
const hasTabs = tabs?.length
function handleChange(item: any, type: string, e:any){
  if(type == 'tab') {
    /* 1. 有tab， tab状态联动 父类状态改变
    *  2. 是否有选中的tab  没有的话 按钮为 disabled 状态
     */
    let checkedTabsLength= tabs?.filter((i: any) => i.checked == true).length
    if(!checkedTabsLength) {
      btns?.forEach((i:any) => {
        i.checked = false
      })
      emit('updateParent', {type, target: e.target, item})
    }
    if(checkedTabsLength == 1 && e.target.checked == true) emit('updateParent', {type, target: e.target, item})
  } else if(!hasTabs && type == 'btn'){
    /* 只有按钮 没有tab 选中第一个会影响父状态，取消不影响父状态
     */
    let btnCheckedLen = btns?.filter((i: any) => i.checked == true).length
    if(e.target.checked ==true && btnCheckedLen ==1) emit('updateParent', {type, target: e.target, item})
  }
}
</script>

<template>
  <flex class="column">
  <a-flex v-if="item.tabs" class="btns">
    <div class="title">Tabs：</div>
    <div class="check-item" v-for="tab in tabs"><a-checkbox v-model:checked="tab.checked" :value="tab.value" :parentId="tab.parentId" :key="tab.value"  @change="handleChange(tab, 'tab', $event)">{{ tab.label }}</a-checkbox></div>
  </a-flex>
  <a-flex v-if="item.btns" class="btns">
    <div class="title">按钮：</div>
    <div class="check-item" v-for="btn in btns"><a-checkbox :disabled="!item.checked && !!hasTabs" v-model:checked="btn.checked" :value="btn.value" :key="btn.value" @change="handleChange(btn, 'btn', $event)">{{ btn.label }}</a-checkbox></div>
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