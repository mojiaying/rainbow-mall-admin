<template>
  <div style="border: 1px solid #ccc">
    <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" />
    <Editor
      :style="{ height: height + 'px' }"
      v-model="editorContent"
      :defaultConfig="editorConfig"
      @on-change="handleChange"
      @on-created="handleCreated"
    />
  </div>
</template>
<script setup>
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import {computed} from "vue";
const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  height: {
    type: Number,
    default: 300
  }
})
const editorConfig = {
  placeholder: '请输入内容',
  readOnly: false,
  MENU_CONF: {
    fullscreen: {
      enable: false // 禁用全屏功能
    },
    uploadImage: {
      customUpload: async (file, insertFn) => {
        let url = await useUploadFile(file)
        insertFn(url)
      }
    },
    uploadVideo: {
      async customUpload(file, insertFn) {
        let url = await useUploadFile(file)
        insertFn(url)
      }
    }
  }
}
onMounted(() => {
  setTimeout(() => {
    if (props.disabled) {
      disable()
    }
  }, 550)
})

const emit = defineEmits(['change', 'update:value'])

const editorContent = computed({
  get() {
    return props.value
  },
  set(val) {
    // emit('update:value', val);
  },
});
const editorRef = shallowRef()
const handleCreated = editor => {
  editorRef.value = editor
}

const handleChange = editor => {
  let html = editor.getHtml()
  if (html === '<p><br></p>') html = ''
  emit('change', html)
  emit('update:value', html)
}
const disable = () => {
  const editor = editorRef.value
  if (editor == null) return
  editor.disable()
}
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})
</script>
<style lang="scss"></style>
