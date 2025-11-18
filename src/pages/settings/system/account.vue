<script setup lang="tsx">
import MyPage from "@/components/my-page.vue";
import EditMenu from "@/pages/settings/system/components/edit-menu.vue";
import {useConfirm} from "@/composables/global-config.ts";
import {accountListApi, deleteAccountApi, updateAccountStatusApi} from "@/api/system/account.ts";
import EditAccount from "@/pages/settings/system/components/edit-account.vue";
import AccountDetail from "@/pages/settings/system/components/account-detail.vue";
import ResetPt from "@/pages/settings/system/components/account-resetPt.vue";
import {getPathByValue} from "@/utils/tools.ts";
const myConfirm = useConfirm()

const loading = ref(false)

// 子组件对象
const myPage = ref<InstanceType<typeof MyPage>>()
const editRef = ref<InstanceType<typeof EditMenu>>()
const detailRef = ref<InstanceType<typeof AccountDetail>>()
const resetPtRef = ref<InstanceType<typeof ResetPt>>()

// sourceData
const dataSource = useDataStore()
const roleList = ref(dataSource.roleList)
const deptObj:{[x:string]:any} = computed(() => {
  let list = {}
  plateTree(dataSource.deptList, list)
  return list
})
// 把数组树型转成扁平的对象
function plateTree(tree: any, list:any = {}) {
  tree.forEach((item: any) => {
    let {label, value } = item
    if (item?.children?.length) plateTree(item.children, list)
    list[value] = {label, value }
  })
}
async function getDeptData(){
  if(!dataSource.roleList) {
    await dataSource.getRoleList()
    roleList.value = dataSource.roleList
  }
  if(!dataSource.deptList) {
    await dataSource.getDeptList()
  }
}
getDeptData()

// 组件配置 = = = = = = = = = = = = = = = =》

const searchConf = computed(() =>[
  {
    label: '登录账号',
    key: 'usernameLike',
  },
  {
    label: '昵称',
    key: 'nicknameLike',
  },
  {
    label: '权限分组',
    key: 'roleId',
    type: 'select',
    options: roleList.value,
    width: '250px',
  },
])
const columns = shallowRef([
  // {
  //   title: '序号',
  //   dataIndex: 'id',
  //   width: 80,
  // },
  {
    title: '真实姓名',
    dataIndex: 'truename',
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
  },
  {
    title: '登录账号',
    dataIndex: 'username',
    customRender: (row: any) =>  row.record?.attach?.account?.username,
  },
  {
    title: '权限分组',
    dataIndex: 'role',
    customRender: (row: any) =>  row.record?.attach?.role?.name,
    width: 200,
  },

  {
    title: '部门',
    dataIndex: 'dept',
    customRender: (row: any) => {
      let id = row.record?.deptId
      if (dataSource.deptList) {
        let ids = getPathByValue(dataSource.deptList, id)
        let names = ids.map((item: string) => deptObj?.value?.[item]?.label)
        return names.join(' / ')
      } else {
        return '加载中...'
      }
    },
    width: 200,
  },
  {
    title: '岗位',
    dataIndex: 'modifier',
    customRender: (row: any) =>  row.record?.attach?.title?.name,
  },
  {
    title: '状态',
    dataIndex: 'status',
    customRender: (row: any) =>  {
      let color = row.record?.status == 1? '#246700' : '#f5222d'
      return <div style={{color: color}}>{row.record?.status == 1 ? '正常' : '停用'}</div>
    },
    width: 100,
  },
  {
    title: '操作',
    dataIndex: 'action',
    buttons: [
      {
        label: '停用',
        key: 'status',
        mapName: (row: any) => {
          return row.record?.status == 1? '停用' : '启用'
        },
        style: (row:any) => ({color: row.record?.status == 1? '#f5222d' : '#246700'}),
        onclick: (row: any) => {
          let txt = row.record?.status == 1 ? '停用' : '启用'
          myConfirm(`确认${txt}账号 ${row.record?.truename}？`, txt,  () => stopItem(row.record))
        },
      },
      // {
      //   label: '编辑',
      //   key: 'edit',
      //   onclick: async (row: any) => {
      //     editRef?.value?.open(row.record)
      //   },
      //   style: (row:any) => {
      //     let isAdmin = row.record?.attach?.account?.username == 'admin'
      //     return {
      //       color: isAdmin ? 'gray' : '',
      //       cursor: isAdmin ? 'not-allowed' : 'pointer',
      //       pointerEvents: isAdmin? 'none' : 'auto',
      //     }
      //   },
      // },
      {
        label: '详情',
        key: 'detail',
        onclick: async (row: any) => {
          detailRef?.value?.open(row.record)
        },
      },
      {
        label: '删除',
        key: 'del',
        onclick: async (row: any) => {
          myConfirm(`确定删除账号 ${row.record?.truename}？`,'删除',  () => deleteItem(row.record?.id))
        },
        style: (row:any) => {
          let isAdmin = row.record?.attach?.account?.username == 'admin'
          return {
            color: isAdmin ? 'gray' : '',
            cursor: isAdmin ? 'not-allowed' : 'pointer',
            pointerEvents: isAdmin? 'none' : 'auto',
          }
        },
      },
      {
        label: '重置密码',
        key:'resetPt',
        onclick: (row: any) => {
          resetPtRef.value?.open(row.record)
        },
      },
    ],
    width: 230,

  }
])
async function stopItem(item: any) {
  let txt = item.status == 1 ? '停用' : '启用'
  let res = await updateAccountStatusApi(item.id)
  if(res) updatePage(`${txt}成功！`)
}
async function deleteItem(id: string) {
  let res = await deleteAccountApi(id)
  if(res) updatePage('删除成功！')
}
// 接口业务逻辑 = = = = = = = = = = = = = = = =》
// 列表
async function getList(params: any){
  const res = await accountListApi(params)
  myPage.value?.setResData(res)
}
// 新增 编辑 查看 ---------------------------------------------------》
// 打开新增页面
function createMenu(){
  editRef?.value?.open()
}
function updatePage(msg: string) {
  useInit(loading, () => myPage?.value?.init(), msg)
}
</script>

<template>
  <div>
  <page-container>
    <my-page ref="myPage"
             :searchConf="searchConf"
             :loading="loading"
             :columns="columns"
             @openAdd="createMenu"
             @getList="getList"></my-page>
    <EditAccount ref="editRef" @updatePage="updatePage"></EditAccount>
    <AccountDetail ref="detailRef"></AccountDetail>
    <ResetPt ref="resetPtRef"></ResetPt>
  </page-container>
  </div>
</template>
