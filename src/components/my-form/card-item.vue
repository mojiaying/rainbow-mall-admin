<script setup lang="ts">
defineProps(["item", "formData", "formModal"])
const changeTest = ()=> {}
</script>

<template>
    <a-flex class="title1" pl-3 mb-6>
      <span class="line"></span>
      <span>{{ item.title }}</span>
      <slot name="titleSlot"></slot>
    </a-flex>
  <slot v-if="item.slot" name="content"></slot>
    <div v-for="(children, index) in item.children" :key="index">
<!--  children 数组 遍历在同一行      -->
      <div v-if="Array.isArray(children)">
        <a-flex style="width: 100%" jst="flex-start">
          <div v-for="child in children">
<!--            插槽-->
            <slot v-if="child.slots" name="childSlot" :child="child"/>
            <my-form-item v-else :item="child" :form-data="formData" :formModal="formModal" :itemWidth="item?.itemWidth" @onChange="(e:any) => child?.onChange(e) ||  changeTest"/>
            <slot name="afterSlot" v-if="child.afterSlot" :child="child" >
              {{child.afterSlot}}
            </slot>
          </div>
        </a-flex>
      </div>
<!--      对象单独放一行 -->
      <div v-else>
<!--        插槽 -->
        <slot v-if="children.slots" name="childSlot" :child="children"/>
        <my-form-item v-else :item="children" :form-data="formData" :formModal="formModal" :itemWidth="item?.itemWidth" @onChange="(e:any) => children?.onChange(e) || changeTest"/>
        <slot name="afterSlot" v-if="children.afterSlot" :child="children">
          {{children.afterSlot}} ===
        </slot>
      </div>
    </div>

</template>

<style scoped lang="less">
.title1{
  font-weight: bolder;
  font-size: 16px;
  align-items: center;
  margin-bottom: 12px;
  .line{
    height: 20px;
    display: inline-block;
    padding-right: 5px;
    border-left: 3px solid var(--pro-ant-color-primary);
  }
}
</style>