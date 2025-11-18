<script lang="ts" setup>
import type {FormInstance} from 'ant-design-vue'
import {LockOutlined} from '@ant-design/icons-vue'
import UploadImg from "@/components/upload-img.vue";
import Address from "@/components/address.vue";
import { TreeSelect } from 'ant-design-vue';
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
// 创建表单对象，用于表单验证种重置
const formRef = ref<FormInstance>()
// 模态框 显示/隐藏
const visible = ref(false)
// 存储Address组件的引用
const componentRefs = ref(new Map())
// 父组件传参：表单配置，表单数据
const props = defineProps([ 'formConf', 'formModal', 'title', 'modalConf', 'isUpdate'])

// 父组件事件：确认回调 confirmCb, 取消回调 cancelCb,修改表单数据
const emits = defineEmits(['onOk', 'onCancel', 'update:formModal'])

// 创建 表单数据 副本
let formData = ref(props.formModal)
watch(visible, (newVal) => {
  if (newVal && visible) { // 弹窗打开时
    formData.value = props.formModal
  }
});

// 设置组件引用
function setComponentRef(el: any, key: string) {
  if (el) {
    componentRefs.value.set(key, el)
  } else {
    componentRefs.value.delete(key)
  }
}

// 打开：1.展示弹窗， 2.设置标题，3.初始化：表单数据
function open(){
  visible.value = true
}

function close(){
  visible.value = false
}

// 重置表单字段，包括Address等特殊组件
function resetFields() {
  // 调用Ant Design Vue表单的重置方法
  formRef.value?.resetFields()
  
  // 重置特殊组件
  componentRefs.value.forEach((componentRef) => {
    if (componentRef && typeof componentRef.reset === 'function') {
      componentRef.reset()
    }
  })
}

// 确认：1.验证表单输入 2.确认回调 3.关闭弹窗

async function handleOk() {
  try {
    await formRef.value?.validate()
    emits("update:formModal", formData.value)
    // 新增或者编辑接口...
    emits('onOk')
  } catch (errorInfo) {
    console.log('Form Validate Failed:', errorInfo)
  }
}

// 取消：取消回调

function handleCancel() {
  resetFields()
  visible.value = false
  emits('onCancel')
}

// 动态标题
const modalTitle = computed(() => props.title)


// label 和 输入框距离
const labelCol = {style: {width: '120px'}}
const wrapperCol = {span: 15}
// 同步父组件数据

function getFormData() {
  return formData.value
}
// 暴露给父组件
defineExpose({
  open,
  close,
  getFormData,
  formRef,
  formData,
  resetFields
})

</script>

<template>
  <a-modal v-model:open="visible" :title="modalTitle" @ok="handleOk" @cancel="handleCancel" :width="modalConf?.width || '600px'">
    <slot name="topTip"></slot>
    <a-form ref="formRef" :model="formData" class="w-full" :label-col="labelCol" :wrapper-col="wrapperCol">
      <div v-for="item in formConf" :style="{display: item.relyOn ? formData[item.relyOn] ? 'block' : 'none' : 'block'}" class="mt-8">
        <slot v-if="item.itemSlot" :name="item.itemSlot"  :formData="formData"></slot>
        <a-form-item v-else :name="item.key"  :key="item.key" :label="item.label || ' '" :colon="item.label !== ''" :rules="item.rules || []">
          <!--        插槽-->
          <slot v-if="item.slots" :name="item.slots"  :formData="formData"></slot>
<!--        input-->
          <a-input  v-else-if="item.type=== undefined || item.type === 'input'" allow-clear
                    :disabled="item.disabled"
                    v-model:value="formData[item.key as keyof typeof formData]"
                    :autocomplete="item?.notAuto ? 'off' : 'on'"
                    :placeholder="item.placeholder || `请输入${item.label}`"/>

<!--          文本框-->
        <a-textarea v-else-if="item.type === 'textarea'" allow-clear
                    :disabled="item.disabled"
                       v-model:value="formData[item.key as keyof typeof formData]"
                       :placeholder="item.placeholder || `请输入${item.label}`"></a-textarea>
<!--        数字输入-->
          <a-input-number v-else-if="item.type === 'number'" allow-clear
                          :disabled="item.disabled"
                          style="width: 100%"
                          v-model:value="formData[item.key as keyof typeof formData]"
                          :placeholder="item.placeholder || `请输入${item.label}`"/>
<!--        日期选择-->
          <a-date-picker v-else-if="item.type === 'date'"
                         :disabled="item.disabled"
              v-model:value="formData[item.key as keyof typeof formData] as string"
          />
<!--        下拉选择框-->
        <div v-else-if="item.type === 'select'">
          <a-select
              v-model:value="formData[item.key as keyof typeof formData]"
              :disabled="item.disabled"
              :placeholder="item.placeholder || `请选择${item.label}`">
            <a-select-option v-for="opt in item.options" :key="opt.value" :value="opt.value">
              {{opt.label}}
            </a-select-option>
          </a-select>
        </div>
<!--          树状多选 下拉选择框-->
          <a-tree-select
              v-else-if="item.type === 'select-tree'"
              v-model:value="formData[item.key as keyof typeof formData]"
              :tree-data="item.options"
              :disabled="item.disabled"
              @change="(value:any, selectedOptions:any) => {
                item?.onChange && item?.onChange(value, selectedOptions)
              }"
              tree-checkable
              allow-clear
              :show-checked-strategy="SHOW_PARENT"
              :placeholder="item.placeholder || `请选择${item.label}`"
              :field-names="item?.fieldNames || {label: 'value', value: 'value', children: 'children'}"
              tree-node-filter-prop="label"
          />
<!--          级联选择器-->
          <a-cascader v-if="item.type ===  'cascader'"
                      :disabled="item.disabled"
              v-model:value="formData[item.key as keyof typeof formData]"
              :options="item.options"
                      :expandTrigger="'hover'"
                      :change-on-select="item?.ChangeOnSelect"
                      :field-names="item?.fieldNames || {label: 'label', value: 'value', children: 'children'}"
                      @change="(_:any, selectedOptions:any) => item?.onChane && item?.onChane(selectedOptions)"
              :placeholder="item.placeholder || `请选择${item.label}`"
          />
          <a-switch v-else-if="item.type === 'switch'" v-model:checked="formData[item.key as keyof typeof formData]" />
<!--        单选-->
        <a-radio-group v-else-if="item.type === 'radio'" v-model:value="formData[item.key as keyof typeof formData]">
          <a-radio v-for="opt in item.options" :key="opt.value" :value="opt.value">{{opt.label}}</a-radio>
        </a-radio-group>
<!--        密码框-->
        <a-input-password v-else-if="item.type === 'password'"
                          :autocomplete="item?.notAuto ? 'off' : 'on'"
                          allow-clear
                          v-model:value="formData[item.key as keyof typeof formData]"
                          :placeholder="item.placeholder || `请输入${item.label}`">
          <template #prefix>
            <LockOutlined class="site-form-item-icon"/>
          </template>
        </a-input-password>
<!--        地址联动-->
        <Address v-else-if="item.type === 'address'" 
                 v-model:address="formData[item.key as keyof typeof formData]"
                 :ref="(el: any) => setComponentRef(el, item.key)">
        </Address>
<!--        动态添加tag-->

        <AddTag v-else-if="item.type === 'tag'"
                v-model:tags="formData[item.key as keyof typeof formData] as string[]"
                :addTips="item.addTips">
        </AddTag>
<!--          联动下拉框-->
          <LinkSelects v-else-if="item.type === 'linkSelect'"
                       :sourceTree="item?.options || []"
                       v-model:selected="formData[item.key as keyof typeof formData]"
          ></LinkSelects>
<!--        图片上传-->
          <a-flex  v-else-if="item.type === 'img'" style="align-items: flex-end">
            <UploadImg
                :maxCount="1"
                v-model:imgUrl="formData[item.key as keyof typeof formData]"></UploadImg>
            <slot v-if="item?.imgTips">
              <div class="gray" style="margin-bottom: 15px;">{{item?.imgTips}}</div>
            </slot>
          </a-flex>

<!--        文本展示-->
          <div style="color: #999" v-else-if="item.type === 'text'">{{ formData[item.key as keyof typeof formData] || '无' }}</div>
          <div v-if="item.tips" style="color: #d38c00;position: relative;top: 6px;">{{item.tips}}</div>
      </a-form-item>
      </div>
    </a-form>
    <template #footer>
      <slot name="footer">
        <a-button @click="handleCancel">取消</a-button>
        <a-button type="primary" :loading="isUpdate" @click="handleOk"> 确定</a-button>
      </slot>
    </template>
  </a-modal>
</template>
