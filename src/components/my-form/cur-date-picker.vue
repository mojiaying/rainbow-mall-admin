<script setup lang="ts">
defineProps(['item', 'type', 'format'])
import dayjs from "dayjs";
</script>

<template>
  <a-date-picker ref="datePicker"
                 :disabled-date="(current: any) => current && current < dayjs().startOf(type || 'day')"
                  v-model:value="item?.value"
                 @change="item?.onChange"
                 :format="format || 'YYYY-MM-DD HH:mm:ss'"
                 :placeholder="item?.placeholder || `请选择日期`"/>
</template>

<style scoped lang="less">

</style>