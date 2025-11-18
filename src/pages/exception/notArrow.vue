<script setup lang="ts">
const message = useMessage()
const userStore = useUserStore()
const router = useRouter()

const multiTabStore = useMultiTab()
const layoutMenuStore = useLayoutMenu()
function back() {
  router.replace({
    path: '/',
  })
}

async function handleClick() {
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
</script>

<template>
  <a-result status="403" title="暂无权限" sub-title="对不起，暂无权限， 请联系管理员！">
    <template #extra>
      <a-button type="primary" @click="back">
        返回首页
      </a-button>
      <a-button @click="handleClick">
        退出登录
      </a-button>
    </template>
  </a-result>
</template>
