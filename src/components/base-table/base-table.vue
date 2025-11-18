

<script setup lang="ts">
import { flow, toNumber, round } from 'lodash';
const props = defineProps(['tableIndex', 'columns', 'dataSource', 'tableSize', 'pagination', 'loading', 'columnSlots', 'rowSelection']);
const columnSlotsObj = computed(() => props.columnSlots ? props.columnSlots : [])
function  getColumnsStyle(item:any) {
  return typeof item?.column?.style === 'function' ? item?.column?.style(item) : item?.column?.style
}

// 格式化方法
const formatPercent = flow(
    (value) => toNumber(value) * 100,
    (value) => round(value, 2),
    (value) => `${value}%`
);

function formatMoney(amount: number | string, options = {}) {
  const num = toNumber(amount);
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options
  }).format(num);
}

const btnShow = computed(
    () =>
        (row:any) =>
            typeof row.item?.show == "function"
                ? row.item.show(row)
                : row.item.show ?? true
)

function  getBtnStyle(item:any) {
  return typeof item?.item?.style === 'function' ? item?.item?.style(item) : item?.item?.style
}
</script>

<template>
  <a-table ref="tableRef"
           row-key="id"
           :columns="columns"
           :scroll="{ x: 'max-content'}"
           :data-source="dataSource"
           :loading="loading"
           :indent-size="tableIndex || 0"
           :pagination="pagination"
           :row-selection="rowSelection"
           tableLayout="fixed"
           :size="tableSize || 'large'"
           >
    <template v-slot:bodyCell="{ text, record, index, column}:any ">
      <!-- 操作列 -->
      <template v-if="column.buttons">
        <btn-list :btns="column.buttons" :row="{ text, record, index, column }">
          <template #default="{item}">
            <div class="btn" v-if="item?.mapName ? item?.mapName({ text, record, index, column }) : true"
                 :key="index"
                 @click="item.onclick({ text, record, index, column }, item)"
                 :style="{
                          display: btnShow({ item,  text, record, index, column }) ? 'inline-block' : 'none',
                          ...(getBtnStyle({ item,  text, record, index, column}) || {}),
                        }" >{{item?.mapName ? item?.mapName({ text, record, index, column }) : item?.label }}</div>
          </template>
        </btn-list>
      </template>

      <template v-else-if="column.mapName">
        <div v-if="column.mapName({ text, record, index, column })" :style="{...(getColumnsStyle({ text, record, index, column }) || {})}">{{column.mapName({ text, record, index, column })}} </div>
      </template>
      <!-- 百分比 -->
      <template v-if="column.type === 'percent'">{{
          formatPercent(text)
        }}</template>
      <!-- 金额-->
      <template v-else-if="column.type === 'img'">
        <a-image :src="text" style="max-height: 80px;" fallback={useErrorImg()}></a-image>
      </template>
      <!-- 金额-->
      <template v-else-if="column.type === 'money'">{{
          formatMoney(text)
        }}</template>

      <!-- 列插槽 -->
      <template v-else-if="columnSlotsObj.includes(column.dataIndex)">
        <template v-for="slot in columnSlotsObj" :key="slot">
          <slot
              :name="`column-${slot}`"
              v-bind="{ text, record, index, column }"
          ></slot>
        </template>
      </template>

      <!-- 自定义列渲染 -->
        <template v-else-if="typeof column?.customRender === 'function'">
          <!-- 渲染customRender -->
          <component
              :is="column.customRender"
              v-bind="{ text, record, index, column }"
          ></component>
        </template>

      <!-- 插槽透传 -->
<!--      <template v-for="(value, name) in $slots"  v-slot:[name]="slotProps">-->
<!--        <slot :name="name" v-bind="slotProps"></slot>-->
<!--      </template>-->

    </template>
  </a-table>
</template>

<style scoped lang="less">
.btn{
  cursor: pointer;
  color: var(--pro-ant-color-primary);
  margin-right: 10px;
  &:hover{
    opacity: 0.8;
  }
}
:deep(.ant-table .ant-table-container .ant-table-thead > tr > th) {
  white-space: nowrap;
 }
.disabled{
  color: gray !important;
  cursor: not-allowed;
  //pointer-events: none;
}
</style>