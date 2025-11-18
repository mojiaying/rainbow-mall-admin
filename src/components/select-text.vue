<script setup lang="ts">
const props = defineProps(['textList'])
const emit = defineEmits(['setText'])
const textIndex = ref('')
function setText(e: any){
  textIndex.value = e?.target?.value
  let text = props.textList[e?.target?.value]
  let value = text == '其他' ? '' :  text
  emit('setText', value)
}
</script>

<template>
  <a-radio-group v-if="textList" @change="setText" mb-2 v-model:value="textIndex">
    <a-radio v-for="(item, index) in textList" :value="index">{{item}}</a-radio>
  </a-radio-group>
</template>
