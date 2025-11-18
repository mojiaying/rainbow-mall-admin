<template>
<a-select
    :show-search="state?.showSearch"
    :mode="state?.mode"
    label-in-value
    placeholder="请输入"
    style="width: 100%"
    :filter-option="false"
    :not-found-content="state?.fetching ? undefined : null"
    :options="state?.options"
    @search="fetchUser"
    @change="handleChange"
>
<template v-if="state?.fetching" #notFoundContent>
  <a-spin size="small" />
</template>
</a-select>
</template>
<script lang="ts" setup>
import { debounce } from 'lodash-es';
/*
const state = {
  options: [], // 选项
  value: [], // 选中值
  fetching: false, // 是否正在加载
  showSearch: true, // 是否显示搜索框
  lastFetchId: 0, // 最后一次请求的id
  mode: 'multiple', // 多选
}
* */
defineProps(['state', 'value'])
/*
* searchData: 搜索数据
* update:value: 更新选中值
* onChange: 选中值变化回调
* */
const emit = defineEmits(['searchData', 'onChange', 'update:value']);
function handleChange(e:any){
  emit('update:value', e);
  emit('onChange', e);
}
const fetchUser = debounce(value => {
  emit('searchData', value);
}, 500);

</script>