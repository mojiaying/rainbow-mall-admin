<script setup lang="tsx">
import MyPage from "@/components/my-page.vue";
import { CustomColumnsType } from "ant-design-vue/es/table";
import EditMenu from "@/pages/settings/system/components/edit-menu.vue";
import {useConfirm} from "@/composables/global-config.ts";
import { deleteDeptApi} from "@/api/system/dept.ts";
import EditDept from "@/pages/settings/system/components/edit-dept.vue";
const dataSource = useDataStore()
const myConfirm = useConfirm()

const loading = ref(false)

// 子组件对象
const myPage = ref<InstanceType<typeof MyPage>>()
const editRef = ref<InstanceType<typeof EditMenu>>()

// 组件配置 = = = = = = = = = = = = = = = =》

const searchConf = ref([
  {
    label: '部门名称',
    key: 'keyword',
  },
])
// 2.table 表头配置
const columns: CustomColumnsType<any>[] = [
  {
    title: '部门名称',
    dataIndex: 'name',
    customRender: (row:any) => {
      return <div style="text-align: left;">{row.record.name}</div>
    }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 220,
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
        key: 'add1',
        onclick: async (row: any) => {
          editRef.value?.open({parentId: row.record?.id})
        },
      },
      {
        label: '删除',
        key: 'del',
        style: {color:'red'},
        onclick: async (row: any) => {
          myConfirm(`确定删除 ${row.record?.name}？`,'删除',  () => deleteItem(row.record?.id))
        },
      }]
  }
]
async function deleteItem(id: string) {
  let res = await deleteDeptApi(id)
  if(res) updatePage('删除成功！')
}
// 接口业务逻辑 = = = = = = = = = = = = = = = =》
function filterTreeByKeyword(tree: any[], keyword: string): any[] {
  // 关键词为空时返回原始树（或空树，根据需求调整）
  if (!keyword?.trim()) {
    console.log('keyword', keyword)
    return [...tree]; // 返回副本避免修改原数据
  }

  // 递归处理每个节点
  const filterNodes = (nodes: any[]): any[] => {
    const filtered: any[] = [];


    for (const node of nodes) {
      // 1. 先处理子节点（递归）
      const filteredChildren = node.children
          ? filterNodes(node.children)
          : [];

      // 2. 检查当前节点是否匹配关键词（不区分大小写）
      const isNodeMatch = node.name.toLowerCase().includes(keyword.toLowerCase());
      // console.log('nodes', node.name, isNodeMatch, node.name.includes(keyword));
      // 3. 若当前节点匹配，或子节点有匹配的，保留该节点
      if (isNodeMatch || filteredChildren.length > 0) {
        // 复制节点并替换子节点为过滤后的结果
        console.log('nodes', node.name);
        filtered.push({
          ...node,
          children: filteredChildren // 即使子节点为空也保留结构
        });

        // 复制节点并替换子节点为过滤后的结果
      }
    }

    console.log('filtered', filtered);
    return filtered;
  };

  return filterNodes(tree);
}
// 列表
const filterData = ref<any>()
async function getList(params:any){
  const res = await dataSource.getDeptList()
  filterData.value = filterTreeByKeyword(res, params.keyword)
  myPage.value?.setResData(filterData.value)
}
// 新增 编辑 查看 ---------------------------------------------------》
// 打开新增页面
function createMenu(){
  editRef.value?.open()
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
             :tableIndex="80"
             @openAdd="createMenu"
             @getList="getList"></my-page>
    <EditDept ref="editRef" @updatePage="updatePage"></EditDept>
  </page-container>

  </div>
</template>

<style scoped lang="scss">
:deep(.ant-table-row-level-0){
  background-color: #fbfaff;
}
:deep(.ant-table-row-level-1){
  >td{
    border-bottom: solid 1px #f6ebf7 !important;
  }
}

</style>
