<script setup lang="ts" xmlns="http://www.w3.org/1999/html">
import {UploadOutlined} from "@ant-design/icons-vue";
import {useUploadFile} from "@/composables/api.ts";
import {message} from "ant-design-vue";
const props = defineProps(['imgUrl', 'maxCount', 'type', 'btnText', 'size', 'quality'])
const emit = defineEmits(['update:imgUrl'])

let initFile =  (url: string, uuid:number) => ({
  uid: uuid++,
  name: 'echo',
  status: 'done',
  url: url})

// 图片 id 映射 用于删除图时更新 父组件的imgURL
let imgIdMap:any[] = []
let hasUpload=false
function getFileList(urls:any) {
  let uuId = 0
  let tempList
  if(urls && typeof urls == "string") {
    tempList =  [initFile(urls, uuId)]
  } else if(Array.isArray(urls)) {
    tempList = urls.map((file:any) => {
      if(typeof file == "string") {
        return initFile(file, uuId)
      } else {
        return { status: 'done', uid: uuId++, ...file};
      }
    })
  } else {
    tempList = []
  }
  imgIdMap = [...tempList]
  return tempList
}
// 文件列表
const fileList = ref(getFileList(props.imgUrl))
watch(() => props.imgUrl, (val:any) => {
  if(!hasUpload) {
    fileList.value = getFileList(val)
  } else {
    hasUpload = false
  }

})
let acceptType = props.type || 'image/png, image/jpeg, image/jpg'
const beforeUpload =async (file:any) => {
  console.log(file.type, )
  if(acceptType.indexOf(file.type) == -1) {
    message.error('请上传正确格式的图片')
    return false
  }
  // 压缩图片
  const compressedFile = await compressImage(file)
  let url = await useUploadFile(compressedFile)
  imgIdMap.push({uuid: file.uid, url: url})
  hasUpload=true
  emit('update:imgUrl', [...props.imgUrl, url])
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
// 图片压缩
const maxWidth = 1000;
const maxHeight = 1000;
const quality = props.quality || 0.8; // {number} [quality=0.7] - 压缩质量（0~1，默认 0.7，值越小体积越小）
/**
 * 压缩图片文件
 * @param file 原始图片文件
 * @param options 压缩选项
 * @returns 压缩后的图片文件Promise
 */
function compressImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      // 确保e.target.result是字符串类型（DataURL）
      img.src = e.target?.result as string;

      img.onload = () => {
        // 创建Canvas元素
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('无法获取Canvas上下文');
        }

        // 计算压缩后的尺寸（保持比例）
        let width = img.width;
        let height = img.height;

        // 如果图片尺寸超过限制，按比例缩小
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(
              maxWidth / width,
              maxHeight / height
          );
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        // 设置Canvas尺寸
        canvas.width = width;
        canvas.height = height;

        // 绘制图片到Canvas
        ctx.drawImage(img, 0, 0, width, height);

        // 将Canvas内容转为Blob对象
        canvas.toBlob((blob) => {
          if (!blob) {
            throw new Error('Canvas转换为Blob失败');
          }

          // 将Blob对象转为File对象，保持原文件名称和类型
          const compressedFile = new File(
              [blob],
              file.name,
              {
                type: file.type || blob.type,
                lastModified: Date.now()
              }
          );

          resolve(compressedFile);
        }, file.type || 'image/jpeg', quality);
      };
    };

    // 处理FileReader错误
    reader.onerror = () => {
      throw new Error('文件读取失败: ' + reader.error?.message);
    };
  });
}
// 图片预览
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
    let index = imgIdMap.findIndex((item:any) => item.status == 'removed')
    imgIdMap.splice(index, 1)
    emit('update:imgUrl', imgIdMap.map((item:any) => item.url))
  }
}
</script>

<template>
  <div class="clearfix">
    <a-upload
        v-model:file-list="fileList"
        :class="size"
        :multiple="true"
        :accept="type || 'png,jpg,jpeg,jpg'"
        :maxCount="maxCount"
        name="file"
        :before-upload="beforeUpload"
        list-type="picture-card"
        @preview="handlePreview"
        @change="onChange">
      <slot v-if="fileList.length < maxCount" name="uploadBtn">
      <div style="border:none">
        <UploadOutlined/>
        <div>{{ btnText || '上传图片' }}</div>
      </div>
      </slot>
    </a-upload>
    <a-modal :open="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>

<style scoped lang="less">
/* 小尺寸上传框 (80x80px) */
:deep(.small-upload .ant-upload.ant-upload-select-picture-card) {
  width: 80px;
  height: 80px;
  line-height: 80px;
}
:deep(.small-upload .ant-upload-list-picture-card .ant-upload-list-item) {
  width: 80px;
  height: 80px;
}
:deep(.small-upload .ant-upload-list-item-container) {
  width: 80px !important;
  height: 80px !important;
}
:deep(.small-upload .ant-upload-icon) {
  font-size: 16px;
}
</style>