<script setup lang="ts">
import BasePage from "@/pages/settings/category/components/base-page.vue";
import { CustomColumnsType } from "ant-design-vue/es/table";

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

]
const formConf = [{
    label: '分类名称',
    key: 'name',
    rules: [{ required: true, message: '请输入分类名称' }, {pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{1,20}$/, message: '请输入20位以内的中英文字符'}]
  },
  {
    label: '分类描述',
    key: 'desc',
    type: 'textarea',
    rules: [{ max: 100, message: '最多输入100位字符' }]
  },
  {
    label: '排序',
    key: 'sort',
    type: 'number',
  },
  {
    label: '父分类',
    key: 'parentName',
    type: 'text',
    disabled: true,
  },
]
</script>

<template>
  <div>
  <page-container>
    <BasePage type="mall" :columns="columns" :maxLevel="3" :formConf="formConf"></BasePage>
  </page-container>
  </div>
</template>

<style scoped lang="less">

</style>