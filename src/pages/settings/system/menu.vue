<script setup lang="tsx">
import MyPage from "@/components/my-page.vue";
import { CustomColumnsType } from "ant-design-vue/es/table";
import EditMenu from "@/pages/settings/system/components/edit-menu.vue";
import {deleteMenuApi} from "@/api/system/menu.ts";
import {useConfirm} from "@/composables/global-config.ts";
import {useDataStore} from "@/stores/useDataStore.ts";
import { Tag } from "ant-design-vue";
import MenuAddTab from "@/pages/settings/system/components/menu-add-tab.vue";
const myConfirm = useConfirm()
const dataSource = useDataStore()

const loading = ref(false)
const CloseTag = (e:any, parent: any, item:any, type: string) => {
  e?.preventDefault()
  myConfirm(`确定删除  ${parent?.name}页面: ${item.name} ${type} 吗？`,'删除',  () => deleteMenu(item?.id))
}
const editTag = (parent: any, item:any, type:number) => {
  item.type = type
  tabRef.value?.open(parent,item)
}
// 子组件对象
const myPage = ref<InstanceType<typeof MyPage>>()
const editRef = ref<InstanceType<typeof EditMenu>>()
const tabRef = ref<InstanceType<typeof MenuAddTab>>()// 渲染自定义标签（包含关闭按
function addChild( parent:any, type: number) {
  tabRef.value?.open(parent, {type}, true)
}
// 组件配置 = = = = = = = = = = = = = = = =》
// 2.table 表头配置
const columns: CustomColumnsType<any>[] = [
  {
    title: '菜单名称',
    dataIndex: 'name',
    width: '300px',
    customRender: (row: any) => <div style="text-align: left;">{row.record.name}</div>
  },
  {
    title: '编码',
    dataIndex: 'code',
  },

  {
    title: '排序',
    dataIndex: 'sort',
    width: '60px',
  },
  {
    title: 'tab搜索签',
    dataIndex: 'search',
    customRender: (row: any) => {
      let tabs = row.record?.attach?.searchs
        return !row?.record?.children?.length && <div class="tag-list">
          {!!tabs?.length && tabs.map((item: any) => {
            return <Tag class={'menuTag001'} onClick={() => editTag(row.record, item, 1)} closable onClose={(e) => CloseTag(e, row.record, item, 'tab签')}>{item.name}</Tag>
          })} <Tag class={'menuTag001'} onClick={() => addChild(row.record, 1)}>+</Tag>
        </div>

    }
  },
  {
    title: '按钮',
    dataIndex: 'btn',customRender: (row: any) =>  {
      let tabs = row.record?.attach?.buttons
        return !row?.record?.children?.length && <div class="tag-list">
          {!!tabs?.length && tabs.map((item: any) => {
            return <Tag class={'menuTag001'} closable
                        onClick={() => editTag(row.record, item, 1)}
                        onClose={(e) => CloseTag(e, row.record, item, '按钮')}>{item.name}</Tag>
          })} <Tag class={'menuTag001'} onClick={() => addChild(row.record, 2)}>+</Tag>
        </div>
    },
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 160,
    buttons: [
      {
        label: '编辑',
        key: 'edit',
        onclick: async (row: any) => {
          editRef.value?.open(row.record)
        },
      },
      {
        label: '添加',
        key: 'add',
        show: (row:any) => {
          let attach = row.record?.attach
          return !attach?.searchs?.length && !attach?.buttions?.length
        },
        onclick: async (row: any) => {
          editRef.value?.open({parentId: row.record?.id})
        },
      },
      {
        label: '删除',
        key: 'del',
        style: {color:'red'},
        onclick: async (row: any) => {
          myConfirm(`确定删除菜单 ${row.record?.name}？`,'删除菜单',  () => deleteMenu(row.record?.id))
        },
      }]
  }
]
async function deleteMenu(id: string) {
  let res = await deleteMenuApi(id)
  if(res) updatePage('删除成功！')
}
// 接口业务逻辑 = = = = = = = = = = = = = = = =》
// 列表
async function getList(){
  const res = await dataSource.getMenuList()
  myPage.value?.setResData(res)
}
// 新增 编辑 查看 ---------------------------------------------------》
// 打开新增页面
function createMenu(){
  editRef.value?.open()
}
function updatePage(msg: string) {
  useInit(loading, () => myPage?.value?.init(), msg)
}
//  密码保护

// 状态管理
const password = ref(''); // 输入的密码
const isVerified = ref(false); // 是否验证通过
const errorMsg = ref(''); // 错误提示

// 密码验证逻辑（根据需求调整）
const verifyPassword = () => {
  // 1. 简单场景：前端直接校验固定密码（适合临时需求）
  const correctPassword = '172839'; // 实际项目中可通过接口获取加密后的密码进行比对
  if (!password.value) {
    errorMsg.value = '请输入密码';
    return;
  }
  if (password.value === correctPassword) {
    isVerified.value = true; // 验证通过，显示内容
    errorMsg.value = '';
    // 可选：存储验证状态（刷新页面后仍有效，如用 localStorage）
    localStorage.setItem('isVerified', 'true');
  } else {
    errorMsg.value = '密码错误，请重新输入';
  }}
</script>

<template>
  <a-flex class="wrap" v-if="!isVerified">
    <div class="password-input">
    <h2>受保护的内容,请输入密码查看</h2>
    <a-input
        type="password"
        v-model:value="password"
        placeholder="请输入密码"
        @keyup.enter="verifyPassword"
    />
    <a-button type="primary" @click="verifyPassword" class="verify-btn">
      验证
    </a-button>

      <a-alert
          type="error"
          show-icon
          v-if="errorMsg"
          :message="errorMsg"
          :closable="false"></a-alert>
    </div>
  </a-flex>
  <div v-else>
  <page-container>
    <my-page ref="myPage"
             :loading="loading"
             :columns="columns"
             :tableIndex="30"
             @openAdd="createMenu"
             @getList="getList"></my-page>
    <EditMenu ref="editRef" @updatePage="updatePage"></EditMenu>
    <MenuAddTab ref="tabRef" @updatePage="updatePage"></MenuAddTab>
  </page-container>
  </div>
</template>

<style lang="scss">
.tag-list {
  text-align: right;
  .menuTag001 {
    cursor: pointer;
    &:hover {
      color: #1677ff;
    }
  }
}
.wrap{
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  gap: 20px;
  width: 100%;
  height: 100%;
  justify-content: center;
}
.password-input{
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  gap: 20px;
  width: 300px;
  height: 300px;
}
</style>

