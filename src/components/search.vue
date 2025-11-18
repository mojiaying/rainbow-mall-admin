<script setup lang="ts">
/* 父组件配置数据：
1. searchData 搜索条件初始数据
2. searchConf 搜索条件对象
3. onSearch 搜索事件：page 初始化 + init（）
4. Reset 重置事件 初始化searchData + onSearch
* */
// import Address from "@/components/address.vue";

const props = defineProps(['searchConf','exportFile'])
const emits = defineEmits(['onSearch', 'initCurrent'])

let searchForm = reactive<{[key:string]:any}>({})
props.searchConf.forEach((item:any) => {
  searchForm[item.key] = item?.defaultValue || undefined;
  if(item?.optKey){
    searchForm[item.optKey] = item?.defaultOpt
  }
})
async function handelSearch() {
  emits('initCurrent')
  emits('onSearch', searchForm)
}

function handelReset() {
  for (const key in searchForm) {
    searchForm[key] = undefined
  }
  emits('onSearch', searchForm)
}

const loading = shallowRef(false)
function setSearchData(key:string) {
  searchForm[key] = undefined
}
defineExpose({setSearchData})
</script>

<template>
  <a-card mb-4>
    <a-form :wrapper-col="{ span: 18 }" :model="searchForm" class="search">
      <div v-for="item in searchConf">
        <slot name="searchSlot" v-if="item.slot"  :item="item" :formModal="searchForm">
        </slot>
        <slot v-if="item.slot" :name="item.key" :item="item" :formData="searchForm" :formModal="searchForm" :itemWidth="item?.itemWidth"/>
        <my-form-item v-else  :item="item" :form-data="searchForm" :formModal="searchForm" :itemWidth="item?.itemWidth"/>
      </div>
      <a-row>
        <a-col>
          <a-space flex justify-end w-full mb-4>
            <a-button :loading="loading" type="primary" @click="handelSearch">查询</a-button>
            <a-button :loading="loading" @click="handelReset">重置</a-button>
            <a-button :loading="loading" @click="handelReset" v-if="exportFile">导出</a-button>
          </a-space>
        </a-col>
      </a-row>
    </a-form>
  </a-card>
</template>

<style scoped lang="less">
.search {
  display: flex;
  gap: 2%;
  flex-wrap: wrap;

  .item {
    max-width: 500px;
    min-width: 200px;
    background-color: #9b59b6;
  }
}
:deep(.ant-card-body){
  padding-bottom: 0;
}
</style>
