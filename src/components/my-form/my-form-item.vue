<script setup lang="ts">

import {LockOutlined} from "@ant-design/icons-vue";
import UploadImg from "@/components/upload-img.vue";
import Address from "@/components/address.vue";
import ItemVal from "@/components/my-form/item-val.vue";
import { TreeSelect } from 'ant-design-vue';
import SearchSelect from "@/components/my-form/search-select.vue";
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
let props = defineProps([ "item", "formData", "formModal", "itemWidth"]);
const emits = defineEmits(['onChange'])
let setRules = () => {
  let item = props?.item;
  let rules = item?.rules;
  let inputType = ['textarea' , 'number' , 'input', 'tag', 'editor']
  if(rules && rules === 'required'){
    let isInput = !item?.type || inputType.includes(item?.type);
    rules = [{ required: true, message: `请${isInput?'输入':'选择'}${item?.label}` }]
  }
  return rules || []
}
function handleChaneg(e:any){
  if(typeof props.item?.onChange === 'function') props.item?.onChange(e)
}
</script>

<template>
  <a-form-item :name="item.key" :key="item.key" :label="item.label" :rules="setRules()" mr-6 :style="{width: item.width || itemWidth || 'auto'}">
    <!--        input-->
    <a-input :disabled="item.disabled"  allow-clear
    v-if="item.type=== undefined || item.type === 'input'"
              v-model:value="formData[item.key as keyof typeof formModal]"
              :placeholder="item.placeholder || `请输入${item.label}`"/>

    <!--          文本框-->
    <a-textarea :disabled="item.disabled" v-else-if="item.type === 'textarea'"
                v-model:value="formData[item.key as keyof typeof formModal]"
                :placeholder="item.placeholder || `请输入${item.label}`"></a-textarea>
    <!--        数字输入-->
    <a-input-number :disabled="item.disabled" v-else-if="item.type === 'number'"
                    v-model:value="formData[item.key as keyof typeof formModal]"
                    :placeholder="item.placeholder || `请输入${item.label}`"/>
    <!--        日期选择-->
    <a-date-picker :disabled="item.disabled" v-else-if="item.type === 'date'"
                   v-model:value="formData[item.key as keyof typeof formModal] as string"
    />
    <a-flex v-else-if="item.type === 'date-range'">
      <a-select v-if="item?.options" :disabled="item.disabled"
                style="width: 180px"
                v-model:value="formData[item.optKey as keyof typeof formModal]"
                :placeholder="item.placeholder || `请选择${item.label}`"
                @change="handleChaneg">
        <a-select-option v-for="opt in item.options" :key="opt.value" :value="opt.value">
          {{opt.label}}
        </a-select-option>
      </a-select>
      <a-range-picker style="width: 380px"  :format="item.format || 'YYYY/MM/DD'" v-model:value="formData[item.key as keyof typeof formModal]" />
    </a-flex>

    <!--        下拉选择框-->
    <div v-else-if="item.type === 'select'">
      <a-select allow-clear
                :show-search="!!item.showSearch"
          v-model:value="formData[item.key as keyof typeof formModal]"
          :placeholder="item.placeholder || `请选择${item.label}`"
          @change="handleChaneg">
        <a-select-option v-for="opt in item.options" :disabled="opt.disabled" :key="opt.value" :value="opt.value">
          {{opt.label}}
        </a-select-option>
      </a-select>
    </div>
    <!--        远程搜索下拉选择框-->
    <div v-else-if="item.type === 'search-select'">
      <search-select :state="item?.state"
                     allow-clear
                     v-model:value="formData[item.key as keyof typeof formModal]"
                     @search-data="(e:any) => item?.state?.searchData(e)" @onChange="(e:any) => item?.state?.onChange(e)"></search-select>
    </div>
    <!--        单选-->
    <a-radio-group :disabled="item.disabled" v-else-if="item.type === 'radio'" v-model:value="formData[item.key as keyof typeof formModal]">
      <a-radio v-for="opt in item.options" :key="opt.value" :value="opt.value">
        <a-flex style="vertical-align: middle">
          <div mr-2 style="line-height: 30px">{{opt.label}}</div>
            <item-val v-if="item.keyVal || opt.keyVal"
                      :keyVal="item.keyVal || opt.keyVal"
                      @updateVal="(val:any) =>{ item.keyVal ? item.keyVal.val = val : opt.keyVal.val = val}"/>
        </a-flex>
      </a-radio>
    </a-radio-group>
<!--    多选框 -->
    <a-checkbox-group :disabled="item.disabled" v-else-if="item.type === 'checkboxes'" v-model:value="formData[item.key as keyof typeof formModal]" :options="item.options" @change="(e:any) => emits('onChange', e)"/>
    <!--        密码框-->
    <a-input-password :disabled="item.disabled" v-else-if="item.type === 'password'"
                      v-model:value="formData[item.key as keyof typeof formModal]"
                      :placeholder="item.placeholder || `请输入${item.label}`">
      <template #prefix>
        <LockOutlined class="site-form-item-icon"/>
      </template>
    </a-input-password>
    <!--          级联选择器-->
    <a-cascader :disabled="item.disabled" v-if="item.type ===  'cascader'"
                v-model:value="formData[item.key as keyof typeof formData]"
                :options="item.options"
                @change="(e: any) => {
                  item?.onChange && item?.onChange(e)
                  item?.onChange && emits ('onChange',(e))
                }"
                :placeholder="item.placeholder || `请选择${item.label}`"
    />
    <!--          树状多选 下拉选择框-->
    <a-tree-select :disabled="item.disabled"
        v-else-if="item.type === 'select-tree'"
        v-model:value="formData[item.key as keyof typeof formData]"
        :tree-data="item.options"
        tree-checkable
        allow-clear
        :show-checked-strategy="SHOW_PARENT"
        :placeholder="item.placeholder || `请选择${item.label}`"
        tree-node-filter-prop="label"
    />
    <!--          联动下拉框-->
    <LinkSelects  v-else-if="item.type === 'linkSelect'"
                  :disabled="item.disabled"
                 :sourceTree="item?.options || []"
                 v-model:selected="formData[item.key as keyof typeof formData]"
    ></LinkSelects>
    <!--        地址联动-->
    <Address v-else-if="item.type === 'address'" v-model:address="formData[item.key as keyof typeof formModal]"></Address>
    <!--        动态添加tag-->

    <AddTag v-else-if="item.type === 'tag'"
            :disabled="item.disabled"
            v-model:tags="formData[item.key as keyof typeof formModal] as string[]"
            :addTips="item.addTips">
    </AddTag>
    <!--        图片上传-->
    <div v-else-if="item.type === 'img'">
      <UploadImg
                 :disabled="item.disabled"
                 :maxCount="item.maxCount || 1"
                 :accept="item.accept || 'png,jpg,jpeg'"
                 v-model:imgUrl="formData[item.key as keyof typeof formModal]"></UploadImg>
      <div v-if="item?.tips" class="gray">{{item?.tips}}</div>
    </div>

    <!--        富文本-->
<!--    <Editor v-else-if="item.type === 'editor'"-->
<!--            v-model:modelValue="formData[item.key as keyof typeof formModal]"/>-->
    <wang-editor :disabled="item.disabled" v-else-if="item.type === 'editor'"
        v-model:value="formData[item.key as keyof typeof formModal]"></wang-editor>
    <!--        文本展示-->
    <div style="color: #999" v-else-if="item.type === 'text'">{{ formData[item.key as keyof typeof formModal] || '无' }}</div>
  </a-form-item>
</template>

<style scoped lang="less">

</style>