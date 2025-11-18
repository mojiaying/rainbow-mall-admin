<script setup lang="ts">
import {FormConfig} from "ant-design-vue/es/table";
import FormModal from "@/components/form-modal.vue";
import {CategoryModel} from "@/api/category.ts";
import {Options} from "@/types/global";
const props = defineProps(['parentListObj', 'parentList', 'formConf', 'type', 'parentLevel'])
const emit = defineEmits(["onUpdate"]);
const modalTitle = ref('新增分类')
const parentIds = reactive({parentId0: '0', parentId1: '', parentId2: ''})
const initData = {
  parentId: '0',
  dependId: undefined,
  type: props.type,
  parentName: '',
  code: undefined,
  industryQualifications:undefined,
  needIndustryQualification:undefined,
  desc: '',
  name: '',
  sort: 1
}

// 弹窗数据
const formModal =  shallowRef<CategoryModel>({...initData})
// 弹窗表单配置
const defFormConfig = [
  {
    label: '上级',
    key: 'parentId',
    slots: 'selects',
    type: 'select',
    options: props.parentList,
    rules: [{ required: true, message: '请选择上一级' }]
  },{
    label: '分类名称',
    key: 'name',
    rules: [{ required: true, message: '请输入分类名称' }, {pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{1,6}$/, message: '请输入6位以内的中英文字符'}]
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
  }
]
async function onOk(){
  const idMap = {
    0: parentIds.parentId0,
    1: parentIds.parentId1,
    2: parentIds.parentId2,
  }
  formModal.value.parentId = idMap[props.parentLevel.value as 0 | 1 | 2]
  emit('onUpdate')
}
const formConf = shallowRef<FormConfig[]>(props.formConf || defFormConfig)
let childList = reactive<Options[]>([])
function setChildList(value:any):void{
  if(value) childList = props.parentListObj[value].children as Options[]
  parentIds.parentId2 = ''
}
</script>

<template>
  <FormModal ref="editModal" :title="modalTitle" :form-conf="formConf" :form-modal="formModal" @onOk="onOk">
    <template #selects>
      <a-form-item-rest>
        <a-flex gap="middle">
          <div v-if="parentLevel == 0">一级</div>
          <a-select v-else
                    v-model:value="parentIds.parentId1"
                    placeholder="请选择" @change="setChildList">
            <a-select-option v-for="opt in parentList" :key="opt.value" :value="opt.value">
              {{opt.label}}
            </a-select-option>
          </a-select>
          <a-select v-show="parentLevel > 1"
                    v-model:value="parentIds.parentId2"
                    placeholder="请选择">
            <a-select-option v-for="opt in childList" :key="opt.value" :value="opt.value">
              {{opt.label}}
            </a-select-option>
          </a-select>
        </a-flex>
      </a-form-item-rest>
    </template>
  </FormModal>
</template>

<style scoped lang="less">

</style>