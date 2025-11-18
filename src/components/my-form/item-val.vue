<script setup lang="ts">
defineProps(['keyVal'])
let emits = defineEmits(['update'])
function updateVal(e:any) {
  emits('update', e?.target?.value)
}
</script>

<template>
  <a-input style="width: 80px" v-model:value="keyVal.val" @change="updateVal">
    <template v-if="keyVal.unit" #addonAfter>
      {{keyVal.unit}}
    </template>
  </a-input>
</template>

<style scoped lang="less">

</style>