<script setup lang="tsx">
// 表单数据
const visible = ref(false)
const initData:any = {
  deptId: '',
  title: '',
  username: '',
  password: '',
  truename: '',
  nickname: '',
  roleId: '',
  sex: '',
  avatar: '',
  phone: '',
}
const formModal = ref<any>({...initData})
// 打开弹窗
function open(item?:any){
  console.log(item)
  formModal.value = item ? {...item} : {...initData}
  visible.value = true
}
defineExpose({open})
</script>

<template>
  <a-modal v-model:open="visible" :width="800" title="详情" :footer="false">

    <h3>基本信息</h3>
    <a-flex gap="large" style="flex-wrap: wrap;margin-top: 20px;">
      <div class="item">
        <div class="title">真实姓名：</div>
        <div class="content">{{formModal?.truename}}</div>
      </div>
      <div class="item">
        <div class="title"> 昵称：</div>
        <div class="content">{{formModal.nickname}}</div>
      </div>
      <div class="item">
        <div class="title">登录账号：</div>
        <div class="content">{{formModal?.attach?.account?.username}}</div>
      </div>
      <div class="item">
        <div class="title">部门：</div>
        <div class="content">{{formModal?.attach?.dept?.name}}</div>
      </div>
      <div class="item">
        <div class="title">岗位：</div>
        <div class="content">{{formModal?.attach?.title?.name}}</div>
      </div>
      <div class="item">
        <div class="title">权限分组：</div>
        <div class="content">{{formModal?.attach?.role?.name}}</div>
      </div>
      <div class="item">
        <div class="title"> 状态：</div>
        <div class="content">{{formModal?.status === 1 ? '启用' : '停用'}}</div>
      </div>
<!--      <div class="item">-->
<!--        <div class="title">最近登录：</div>-->
<!--        <div class="content"></div>-->
<!--      </div>-->

    </a-flex>
  </a-modal>
</template>

<style scoped lang="less">
.item{
  display: flex;
  margin-right: 30px;
  .title{
    font-weight: bolder;
  }
  .content{
    font-size: 16px;
    color: gray;
  }
}
</style>