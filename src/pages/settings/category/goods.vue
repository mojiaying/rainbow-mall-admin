<script setup lang="ts">
import BasePage from "@/pages/settings/category/components/base-page.vue";

const columns = shallowRef([
  {
    title: '一级行业',
    dataIndex: 'depend1',
  },
  {
    title: '二级行业',
    dataIndex: 'depend2',
  },
  {
    title: '分类名称',
    dataIndex: 'name',
    minWidth: 120
  },
  {
    title: '修改时间',
    dataIndex: 'gmtModified',
    minWidth: 150,
  },
])
</script>

<template>
  <div>
  <page-container>
    <BasePage type="life_goods" :columns="columns" :maxLevel="3" ></BasePage>
  </page-container>
  </div>
</template>

<style scoped lang="less">

</style>