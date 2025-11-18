<script setup lang="ts">
const props = defineProps(['tabList'])
const activeTab = ref(props.tabList[0].key)
function changeTab(value: any) {
  activeTab.value = value
}
</script>

<template>
  <a-tabs :active-key="activeTab" @update:active-key="changeTab">
    <a-tab-pane v-for="item in tabList" :key="item.key" :tab="item.label" />
  </a-tabs>
  <div v-for="item in tabList">
    <slot v-if="activeTab == item.key" :name="item.key">{{item.label}}</slot>
  </div>
</template>

<style scoped lang="less">

</style>