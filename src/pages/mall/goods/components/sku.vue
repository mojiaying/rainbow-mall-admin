<template>
<!--  --------------------------------------------------------------------------->
  <a-space style="display: flex;justify-content: flex-end">
  <a-button type="primary" @click="addSku"> + 添加一行</a-button>
  <a-button danger @click="removeSkus">批量移除</a-button>
  </a-space>


  <div class="my-grid">
    <div class="grid-th"><a-checkbox v-model:checked="selectAll" @change="setAllSkuIds"></a-checkbox></div>
    <div class="grid-th required">商品图片</div>
    <div class="grid-th required">
      <div>规格名称</div>
      <div class="coppy" @click="coppyFirstLine('skuName')">（同首行）</div>
    </div>
    <div class="grid-th required">SKU编号</div>
    <div class="grid-th required">售价 <span class="coppy" @click="coppyFirstLine('price')">（同首行）</span></div>
    <div class="grid-th">商品颜色 <span class="coppy" @click="coppyFirstLine('color')">（同首行）</span></div>
    <div class="grid-th">大小<span class="coppy" @click="coppyFirstLine('size')">（同首行）</span></div>
    <div class="grid-th">操作</div>
  </div>


  <a-form
      v-if="formData?.mallProductSkus"
      ref="formRef"
      name="dynamic_form_nest_item"
      :model="formData"
  >
    <a-space
        v-for="(sku, index) in formData.mallProductSkus"
        :key="sku.idx" class="my-grid">
      <a-form-item>
        <a-checkbox v-model:checked="sku.checked" @change="setSkuIds(sku, $event)"/>
      </a-form-item>
      <a-form-item :name="['mallProductSkus', index, 'skuUrl']"
          :rules="{ required: true, message: '请上传商品图片'}">
        <UploadImg :max-count="1" v-model:imgUrl="sku.skuUrl" size="small-upload">
          <template #uploadBtn>
            <PlusOutlined />
          </template>
        </UploadImg>
      </a-form-item>
      <a-form-item :name="['mallProductSkus', index, 'skuName']" :rules="[{ required: true, message: '请输入规格名称'}]">
        <a-input allow-clear v-model:value="sku.skuName" placeholder="规格名称" />
      </a-form-item>
      <a-form-item :name="['mallProductSkus', index, 'skuCode']" :rules="{ required: true, message: '请输入SKU编码'}">
        <a-input allow-clear v-model:value="sku.skuCode" :disabled="!editAll && !!sku.id" placeholder="SKU编码" />
      </a-form-item>
      <a-form-item :name="['mallProductSkus', index, 'price']" :rules="[ {required: true, message: '请输入价格'}, {validator: validateMaxPrice}]">
        <a-input-number allow-clear v-model:value="sku.price" placeholder="价格" />
      </a-form-item>
      <a-form-item :name="['mallProductSkus', index, 'color']" >
        <a-input allow-clear v-model:value="sku.color" placeholder="颜色"/>
      </a-form-item>
      <a-form-item :name="['mallProductSkus', index, 'size']">
        <a-input allow-clear v-model:value="sku.size" placeholder="大小"/>
      </a-form-item>
      <a-form-item>
        <a-button danger @click="removeSku(sku)">移除</a-button>
      </a-form-item>
    </a-space>
  </a-form>
  <a-alert
      v-if="duplicateSkus.length > 0"
      message="规格名称、商品颜色、大小 不能全部重复！"
      type="error"
      closable
      style="width: 500px"
  />
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import {FormInstance, message} from 'ant-design-vue';
import UploadImg from "@/components/upload-img.vue";
import {hasDuplicateObj} from "@/utils/tools.ts";

const formRef = ref<FormInstance>();
const props = defineProps(["formData", "editAll"])
const emits = defineEmits(["delSku", "updateSkuData", "updateMallProductSkus"]);
let formData = reactive({...props.formData})
let duplicateSkus = ref<number[]>([])
const removeSku = (item: any) => {
  const index = formData.mallProductSkus.indexOf(item);
  if (index !== -1) {
    formData.mallProductSkus.splice(index, 1);
  }
};
const addSku = () => {
  formData.mallProductSkus.push({
    skuCode: '',
    skuName: '',
    skuUrl: '',
    price: '',
    size: '',
    idx: Date.now(),
  });
};
 function validForm() {
   return new Promise((resolve) => {
     formRef.value?.validate().then(() => {
       emits("updateMallProductSkus", formData.mallProductSkus)
       resolve(true)
     }).catch(() => {
       resolve(false)
     });
     duplicateSkus.value = hasDuplicateObj(formData.mallProductSkus as any, ['skuName', 'size','color'])
     if(duplicateSkus?.value?.length > 0) {
       message.error('商品规格存在重复项，请修改后再提交！')
       resolve(false)
     }
   })
}
function validateMaxPrice(_rule: any, _value: any){
  if(_value > 999999){
    return Promise.reject('商品价格不能超过999999');
  } else {
    return Promise.resolve();
  }
}
// （同首行）
function coppyFirstLine(key: 'skuName' | 'price' | 'color' | 'size') {
  let skuData = formData.mallProductSkus
  let txt = skuData && skuData[0] ? skuData[0][key as keyof typeof skuData[0]] : ''
  skuData?.forEach((item:any) => {
    item[key] = txt
  })
}
// 全选状态   批量删除
const selectAll = ref(false);
const selectSkuIds = ref<string[]>([])
function setAllSkuIds(e:any){
  selectAll.value = e?.target.checked
  if(e?.target.checked) {
    selectSkuIds.value = formData.mallProductSkus.map((item:any) => {
      item.checked = true
      return item.idx
    })
  } else {
    selectSkuIds.value = []
    formData.mallProductSkus.forEach((item:any) => {
      item.checked = false
    })
  }
}
function setSkuIds(cur: any, e:any){
  if(e.target.checked) {
    selectSkuIds.value.push(cur.idx)
  } else {
    selectSkuIds.value = selectSkuIds.value.filter(item => item !== cur.idx)
  }
  selectSkuIds.value.length === formData.mallProductSkus.length ? selectAll.value = true : selectAll.value = false
}

const removeSkus = () => {
  if (!selectSkuIds.value.length) return message.error('请先选择要删除的规格')
  formData.mallProductSkus = formData?.mallProductSkus?.filter((item:any) => {
    return !selectSkuIds.value.includes(item.idx)
  })
}
defineExpose({
  validForm
})
</script>

<style lang="scss" scoped>
.my-grid{
  grid-template-columns: 50px 120px 1.5fr 1fr 0.8fr 1fr 1fr 0.5fr;
  text-align: center;
  padding-top: 24px;
}
.coppy{
  color: var(--pro-ant-color-primary-text);
  cursor: pointer;
  font-size: 14px;
  display: block;
}
.required{
  &::before{
    content: '*';
    color: red;
    margin-right: 4px;
  }
}
</style>

