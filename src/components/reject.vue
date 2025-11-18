<script setup lang="ts">
defineProps(['reasonList', 'reason', 'title'])
const emits = defineEmits(['update:reason', 'onReject'])
const openReject = ref(false);
const rejectReasons = ref('')
// const reasons = ['商品缺货', '客户申请取消', '重复订单', '逾期未支付', '其他']
function setReason(val: string){
  rejectReasons.value = val
  emits("update:reason", val)
}
function open(){
  openReject.value = true;
  rejectReasons.value = '';
}

function close(){
  rejectReasons.value = '';
  openReject.value = false;
}
defineExpose({
  open,
  close
})
</script>

<template>
  <a-modal :zIndex="1000" v-model:open = 'openReject' @ok="() => emits('onReject')" width="400px" :title="title">
    <a-form mt-6>
      <a-form-item label="">
        <div>
          <span style="padding-right: 20px;">{{ `${title}原因:` }} </span>
          <SelectText :text-list="reasonList" @set-text="setReason"></SelectText></div>
        <a-textarea v-model:value="rejectReasons" @change="(e:any) => setReason(e.target.value)"></a-textarea>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style scoped lang="less">

</style>