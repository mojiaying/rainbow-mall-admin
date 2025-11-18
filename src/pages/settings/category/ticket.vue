<script setup lang="ts">
import BasePage from "@/pages/settings/category/components/base-page.vue";
import { CustomColumnsType } from "ant-design-vue/es/table";
const statusMap = {
  0: '停用',
  1: '启用',
}
const columns: CustomColumnsType<any>[] = [
  {
    title: '排序',
    dataIndex: 'sort',
    align: 'center',
    slot: 'sort',
    width: 30,
  },
  {
    title: '分类名称',
    dataIndex: 'name',
    width: 120
  },
  {
    title: '修改时间',
    dataIndex: 'gmtModified',
    width: 100,
  },
  {
    title: '状态',
    dataIndex: 'status',
    mapName: (row:any) => {
      return statusMap[row.record.status as 0 | 1]
    },
    width: 100
  }
]
const basePage = ref<InstanceType<typeof BasePage>>()
</script>

<template>
  <div>
  <page-container>
    <BasePage ref="basePage" type="ticket" :columns="columns" :maxLevel="2"></BasePage>
  </page-container>
  </div>
</template>

<style scoped lang="less">

</style>