<script setup lang="ts">

// import {LockOutlined} from "@ant-design/icons-vue";
// import UploadImg from "@/components/upload-img.vue";
// import Address from "@/components/address.vue";
import type {FormInstance} from "ant-design-vue";
import { Form } from 'ant-design-vue';
const useForm = Form.useForm;
const props = defineProps([ 'formConf', 'formModal', 'disabled' ]);
const emits = defineEmits(['onOk', 'onCancel', 'update:formModal'])
const formRef = ref<FormInstance>()
const visible = ref(false)
// 创建 表单数据 副本
let formData = ref(props.formModal)
watch(visible, (newVal) => {
  if (newVal && visible) { // 弹窗打开时
    formData.value = props.formModal
  }
});

const { resetFields } = useForm(props.formModal);
async function onSubmit() {
  try {
    await formRef.value?.validate()
    emits("update:formModal", formData.value)
    // 新增或者编辑接口...
    emits('onOk')
    return true
  } catch (errorInfo) {
    console.log('Form Validate Failed:', errorInfo)
    return false
  }
}
function onReset(){
  resetFields()
  emits("update:formModal", formData.value)
  emits('onCancel')
}
defineExpose({
  onSubmit,
  onReset
})
</script>

<template>
  <a-form ref="formRef" :model="formData" class="w-full" :disabled="disabled">
    <div v-for="item in formConf" :style="{display: item.relyOn ? formData[item.relyOn] ? 'block' : 'none' : 'block'}">
      <a-card v-if="Array.isArray(item)">
        <div mb-1 v-for="obj in item">
          <card-item  :item="obj" :form-data="formData" :formModal="formModal">
            <template #titleSlot>
              <slot :name="obj.titleSlot"></slot>
            </template>
            <template #content>
              <slot :name="obj.slot"></slot>
            </template>
            <template #childSlot="{child}">
              <!--   插槽-->
              <slot  :name="child.slots">
                {{child.slots}}
              </slot>
            </template>

            <template #afterSlot="{child}">
              <!--   插槽-->
              <slot  :name="child.afterSlot">
                {{child.afterSlot}}
              </slot>
            </template>
          </card-item>
        </div>
      </a-card>
      <a-card mb-1 v-else >
        <card-item  :item="item" :form-data="formData" :formModal="formModal">
          <template #titleSlot>
            <slot :name="item.titleSlot"></slot>
          </template>

          <template #content>
            <slot :name="item.slots"></slot>
          </template>
        <template #childSlot="{child}">
          <!--   插槽-->
          <slot  :name="child.slots">
            {{child.slots}}
          </slot>
        </template>
          <template #afterSlot="{child}">
            <!--   插槽-->
            <slot  :name="child.afterSlot">
              {{child.afterSlot}}
            </slot>
          </template>
      </card-item>
      </a-card>

    </div>
    <slot name="footer">
      <a-form-item class="error-infos" :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="primary" @click.prevent="onSubmit">确认</a-button>
        <a-button style="margin-left: 10px" @click="onReset">重置</a-button>
      </a-form-item>
    </slot>
  </a-form>
</template>

<style scoped lang="less">

</style>