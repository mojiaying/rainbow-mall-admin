<template>
  <a-flex wrap="wrap" gap="small">
  <template v-for="(tag, index) in state.tags" :key="tag">
    <a-tooltip v-if="tag.length > 20" :title="tag">
      <a-tag :closable="index !== 0" @close="handleClose(tag)">
        {{ `${tag?.slice(0, 20)}...` }}
      </a-tag>
    </a-tooltip>
    <a-tag v-else :closable="true" @close="handleClose(tag)">
      {{ tag }}
    </a-tag>
  </template>
  <a-input
      v-if="state.inputVisible"
      ref="inputRef"
      v-model:value="state.inputValue"
      type="text"
      size="small"
      :style="{ width: '78px' }"
      @blur="handleInputConfirm"
      @keyup.enter="handleInputConfirm"
  />
  <a-tag v-else style="background: #fff; border-style: dashed" @click="showInput">
    <plus-outlined />
    {{addTips}}
  </a-tag>
  </a-flex>
</template>
<script lang="ts" setup>
import { ref, reactive, nextTick } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
const props = defineProps(['addTips', 'tags'])
const emit = defineEmits(['update:tags'])
const inputRef = ref();
type StateType = {tags: string[], inputVisible: boolean, inputValue: string};
const state = reactive<StateType>({
  tags: props.tags || [],
  inputVisible: false,
  inputValue: '',
});
watch(() => props.tags, (newVal) => {
  state.tags = newVal
})
const handleClose = (removedTag: string) => {
  state.tags = state.tags.filter(tag => tag !== removedTag)
  emit('update:tags', state.tags);
};

const showInput = () => {
  state.inputVisible = true;
  nextTick(() => {
    inputRef.value.focus();
  });
};

const handleInputConfirm = () => {
  const inputValue = state.inputValue;
  let tags = state?.tags || [];
  if (inputValue && tags?.indexOf(inputValue) === -1) {
    tags = [...tags, inputValue];
  }
  Object.assign(state, {
    tags,
    inputVisible: false,
    inputValue: '',
  });
  emit('update:tags', tags);
};
</script>

