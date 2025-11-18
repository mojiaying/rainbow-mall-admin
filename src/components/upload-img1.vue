<script setup lang="ts">
import {UploadOutlined} from "@ant-design/icons-vue";
import {getUrlApi} from "@/api/common";
import axios from "axios";
const uploadUrl = ref('')
const uploadType = ref('image/png')
const props = defineProps(['imgUrl', 'maxCount', 'accept', 'btnText', 'propKey'])
const emit = defineEmits(['update:imgUrl'])


const fileList = ref<any>([]);
watch(()=> props.imgUrl, (newVal) => {
  fileList.value = []
  if (newVal && typeof newVal === 'string') {
    fileList.value = [{
      uid: '-1',
      name: 'echo',
      status: 'done',
      url: newVal
    }]
  } else if(Array.isArray(newVal)) {
    // let tempArr = []
    // newVal.forEach((item:any, index:number) => {
    //   tempArr.push({
    //     uid: index,
    //     name: 'echo',
    //     status: 'done',
    //     url: item
    //   })
    // })
  }
})

const beforeUpload =async (file:any) => {
  const res = await getUrlApi({fileName: file.name, contentType: `${file.type}`})
  if(res) {
    uploadUrl.value = res.uploadUrl
    uploadType.value = file.type
    await axios({
      method: 'put',
      url: res.uploadUrl,
      headers: {
        'content-type': 'image/png',
      },
      data: file
    })
    emit('update:imgUrl', res.fileUrl)
    }
    return false
}
function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
const previewVisible = ref(false);
const previewImage = ref('');
const previewTitle = ref('')

const handlePreview = async (file: any) => {
  if (!file.url && !file.preview) {
    file.preview = (await getBase64(file.originFileObj)) as string;
  }
  previewImage.value = file.url || file.preview;
  previewVisible.value = true;
  previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
};
const handleCancel = () => {
  previewVisible.value = false;
  previewTitle.value = '';
};
function onChange(file:any) {
  if(file.file.status === "removed") {
    emit('update:imgUrl', '')
  }
}
</script>

<template>
  <div class="clearfix">
    <a-upload
        v-model:file-list="fileList"
        :accept="accept || 'png,jpg,jpeg'"
        :maxCount="maxCount || 1"
        name="file"
        :before-upload="beforeUpload"
        list-type="picture-card"
        @preview="handlePreview"
        @change="onChange"
    >
      <div v-if="fileList.length < maxCount" style="border:none">
        <UploadOutlined/>
        <div>{{ btnText || '上传图片' }}-{{maxCount}}</div>
      </div>
    </a-upload>
    <a-modal :open="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>

<style scoped lang="less">

</style>