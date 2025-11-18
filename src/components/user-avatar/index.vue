<script setup lang="ts">
import { LogoutOutlined, EditOutlined } from '@ant-design/icons-vue'
import FormModal from "@/components/form-modal.vue";

const message = useMessage()
const userStore = useUserStore()
const multiTabStore = useMultiTab()
const layoutMenuStore = useLayoutMenu()
const router = useRouter()
const { avatar, nickname } = storeToRefs(userStore)
async function handleClick({ key }: any) {
  if (key === 'logout') {
    const hide = message.loading('退出登录...', 0)
    try {
      await userStore.logout()
    }
    finally {
      hide()
      message.success('退出登录成功', 3)
      router.push({
        path: '/login',
      }).then(() => {
        multiTabStore.clear()
        layoutMenuStore.clear()
      })
    }
  }
}

// 弹窗代码 - - - - - - -  - - - -修改密码 -  - - - - - -  - - - - - - - - - - - - - - - - -- - -- - - - - - -- - >
const resetModal = ref<InstanceType<typeof FormModal>>()
function handleOpen() {
  resetModal.value?.open()
}
function afterReset(){
  handleClick({key:'logout'})
}
</script>

<template>
  <a-dropdown>
    <span hover="bg-[var(--hover-color)]" flex items-center h-48px px-12px cursor-pointer class="transition-all-300">
      <a-avatar :src="avatar" mr-8px size="small" />
      <span class="anticon">{{ nickname }}</span>
    </span>
    <template #overlay>
      <a-menu @click="handleClick">
        <a-menu-item key="1" @click="handleOpen">
          <template #icon>
            <EditOutlined />
          </template>
          <div>修改密码</div>
        </a-menu-item>
        <a-menu-divider />
        <a-menu-item key="logout">
          <template #icon>
            <LogoutOutlined />
          </template>
          退出登录
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
  <reset-password ref="resetModal" @afterReset="afterReset"></reset-password>
</template>
