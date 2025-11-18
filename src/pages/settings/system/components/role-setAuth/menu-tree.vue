<script setup lang="ts">
import RowList from "@/pages/settings/system/components/role-setAuth/row-list.vue";
defineProps(['item', 'checkAll'])
const emit = defineEmits(['updateCheck', 'updateParent', 'handleFindParent'])
function handleChange(item:any, e:any){
  emit('updateCheck', {item, target: e.target})
}
</script>

<template>
  <div class="check-item"><a-checkbox :value="item.value" v-model:checked="item.checked" :key="item.value" @change="handleChange(item, $event)">{{ item.label }}</a-checkbox></div>
  <a-flex class="column"  v-if="item?.children?.length" style="flex-grow: 1;">
    <div style="width: 100%;" class="row2" v-for="item1 in item.children">
      <a-flex>
        <MenuTree :item="item1" @updateCheck="(e) => emit('updateCheck', e)" @updateParent="(e) => emit('updateParent', e)"/>
        <RowList :item="item1" @updateParent="(e) => emit('updateParent', e)"></RowList>
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
  min-width: 140px;
  padding: 10px;
}
.column{
  flex-direction: column;
  flex-grow: 1;
}
</style>