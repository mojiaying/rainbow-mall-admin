<script setup lang="ts">
import BasePage from "@/pages/settings/category/components/base-page.vue";
import {FormConfig} from "@/types/global";
import { CustomColumnsType } from "ant-design-vue/es/table";

const basePage = ref<InstanceType<typeof BasePage>>()
const columns: CustomColumnsType<any>[] = [
  {
    title: '一级',
    dataIndex: 'parentName',
    mapName: (row:any) => row.record.parentId == '0' ? row.record.name : '',
    align: 'center',
    width: 100,
  },
  {
    title: '二级',
    dataIndex: 'name',
    mapName: (row:any) => row.record.parentId != '0' ? row.record.name : '-',
    width: 120,
    align: 'center',
  },
  {
    title: '行业ID',
    dataIndex: 'code',
    width: 100,
  },
  {
    title: '行业资质是否必填',
    dataIndex: 'config',
    mapName: (row:any) => row.record.parentId != '0'? row.text.needIndustryQualification ? '是' : '否' : '',
    width: 130
  }
]
const formConf = shallowRef<FormConfig[]>([
  {
    label: '上级',
    key: 'parentId',
    slots: 'selects',
    rules: [{ validator: () => {
        // 检查formModal.value.parentId的值
        const formModal = basePage.value?.getFormData();
        // LinkSelects组件传递的是数组，需要检查数组最后一个元素
        if (formModal?.parentId) {
          if (Array.isArray(formModal.parentId)) {
            // 如果是数组，检查最后一个元素
            const lastValue = formModal.parentId[formModal.parentId.length - 1];
            if (lastValue) {
              return Promise.resolve();
            }
          } else if (formModal.parentId !== '') {
            // 如果是字符串且非空，则通过验证
            return Promise.resolve();
          }
        }
        return Promise.reject('请选择上一级');
      }, trigger: 'blur' }]
  },
  {
    label: '分类名称',
    key: 'name',
    rules: [{ required: true, message: '请输入分类名称' }, {pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{1,6}$/, message: '请输入6位以内的中英文字符'}]
  },
  {
    label: '行业ID',
    key: 'code',
    rules: [{ required: true, message: '请输入行业ID' }]
  },
  {
    label: '行业资质',
    key: 'needIndustryQualification',
    options: [{value: true, label: '必填'}, {value: false, label: '非必填'}],
    type: 'radio',
    rules: [{ required: true, message: '行业资质是否必填' }]
  },
  {
    label: '所需行业资质',
    key: 'industryQualifications',
    type: 'tag',
    addTips: '添加资质',
    rules: [{validator: () => {
        let data = basePage?.value?.getFormData()
        let need = data.needIndustryQualification
        let text = data.industryQualifications
        if(need && !text) {
          return Promise.reject('请添加所需资质')
        } else {
          return Promise.resolve()
        }

      }, trigger: 'blur'}]
  },
])
</script>

<template>
  <div>
  <page-container>
    <BasePage ref="basePage" type="life_industry" :formConf="formConf" :columns="columns" :maxLevel="2">
    </BasePage>
  </page-container>
  </div>
</template>

<style scoped lang="less">

</style>