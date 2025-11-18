<script setup lang="ts">

import RowList from "@/pages/settings/system/components/setting-auth/row-list.vue";
defineProps(['item'])
const emit = defineEmits(['updateCheckItem', 'handleFindParent', 'findParent'])
function handleChange(e:any){
  emit('updateCheckItem', e)
}
function changeItem(e:any){
  emit('updateCheckItem', e)
}
function findParent(e:any){
  emit('handleFindParent', e)
}
</script>

<template>
  <div class="check-item"><a-checkbox :value="item.value" :key="item.value" @change="handleChange">{{ item.label }}</a-checkbox></div>
  <a-flex class="column"  v-if="item?.children?.length">
    <div style="width: 100%;" class="row2" v-for="item1 in item.children">
      <a-flex>
        <MenuTree :item="item1" @updateCheckItem="changeItem" @handleFindParent="findParent"/>
        <RowList :item="item1" @updateCheckItem="findParent"></RowList>
      </a-flex>
    </div>
  </a-flex>
</template>

<style scoped lang="less">
.row2 {
  border-left: 1px solid #ddd;
  border-top: 1px solid #ddd;
  &:first-of-type{
    border-top: none;
  }
}
.check-item {
  width: 140px;
  padding: 10px;
}
.column{
  flex-direction: column;
  flex-grow: 1;
}
</style>