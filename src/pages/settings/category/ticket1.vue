<script setup lang="ts">
import {PlusOutlined} from '@ant-design/icons-vue'
import {
  CategoryModel,
  createCategoryApi,
  deleteCategoryApi,
  categoryStatusApi,
  updateCategoryApi,
  categoryTreeListApi
} from "@/api/category.ts";
import FormModal from '@/components/form-modal.vue'
import {FormConfig} from "@/types/global";
import {useConfirm} from "@/composables/global-config.ts";

const message = useMessage()
const myConfirm = useConfirm()
const loading = ref(false)
const isUpdate = ref(false)

//  表格数据  = = = = = = = = = = = start  = = = = = = = = = = =>
let dataSource = shallowRef<CategoryModel[]>([])

// 一级列表  下拉
const parentList= computed(() => dataSource.value.map(item => {
  let {name, id} = item
  return {label: name, value: id}
}))

const statusMap = {
  0: '停用',
  1: '启用',
}
// 表格配置
const columnSlots = ['sort']
const columns = shallowRef([
  {
    title: '排序',
    dataIndex: 'sort',
    slot: 'sort',
    width: 80,
  },
  {
    title: '分类名称',
    dataIndex: 'name',
    width: 120
  },
  {
    title: '修改时间',
    dataIndex: 'gmtModified',
    width: 100,
    // customRender: () => 123
  },
  {
    title: '状态',
    dataIndex: 'status',
    filter: (row:any) => {
      return statusMap[row.record.status as 0 | 1]
    },
    width: 100
  },
  {
    title: '操作',
    dataIndex: 'action',
    buttons:[
      {
        name: '修改状态',
        filter: (row:any) => {
          let action = row.record.status == 0 ? 1 :0
          return statusMap[action as 0 | 1]
        },
        onclick: async function (row:any){
          let action = row.record.status == 0 ? 1 :0
          myConfirm(`确认 ${statusMap[action as 0 | 1]} ${row.record.name} 吗？`, '',()=> toggleStatus(row.record.id))
          await useInit(loading,getList)
        }
      },
      {
        name: '编辑',
        onclick: async (row:any) =>{
          handleEdit(row.record)
        },
      },
      {
        name: '删除',
        onclick: async (row:any) =>{
          myConfirm(`确认删除分类 ${row.record.name} 吗？`, '',()=> deleteCategory(row.record.id))
        },
        style: {color:'red'}
      },{
        name: '新增子类',
        show: (row:any) => row.record.parentId == '0',
        onclick: async (row:any) =>{
          handleAdd(row.record.id)
        },
      },
    ],
    width: 220,
  },
])
//  表格数据 = = = = = = = = = = = = = = = = = = = = = = end  = = = = = = = = = = = = = = = = = = = = = =》



// 新增弹窗 = = = = = = = = = = = = =  start = = = = = = = = = = =>
// 弹窗标题
const modalTitle = ref('新增分类')
// 弹窗表单配置
const formConf = shallowRef<FormConfig[]>([
  {
    label: '上级',
    key: 'parentId',
    type: 'select',
    options: [{label: '一级', value: 0}],
    rules: [{ required: true, message: '请选择上级' }]
  },{
    label: '分类名称',
    key: 'name',
    rules: [{ required: true, message: '请输入分类名称' }]
  },
  {
    label: '分类描述',
    key: 'desc',
    rules: [{ required: true, message: '请输入分类名称' }],
    type: 'textarea'
  },
  {
    label: '排序',
    key: 'sort',
    type: 'number',
  }])
// 弹窗数据模型
const formModal =  shallowRef<CategoryModel>({
  parentId: '0',
  type: 'ticket',
  desc: '',
  name: '',
  sort: 1
})

// 新增打开弹窗
// ref 获取 弹窗对象
const editModal = ref<InstanceType<typeof FormModal>>()
function handleAdd(parentId:string, title?:string) {
  formModal.value.parentId = parentId || '0'
  if(parentId) {
    formConf.value[0].options =parentList.value
  } else{
    formConf.value[0].options = [{value: '0', label:'一级'}]
  }
  triggerRef(formConf)

  modalTitle.value = parentId == '0' ? '新增分类' : title || '新增二级分类'
  isUpdate.value = false
  editModal.value?.open()
}
function handleEdit(item: CategoryModel) {
  modalTitle.value = '编辑分类'
  isUpdate.value = true
  let {id, name, desc, sort, parentId} = item
  formModal.value = {id, name, desc, sort, parentId}
  if(parentId == '0'){
    formConf.value[0].options =parentList.value
  }
  editModal.value?.open()
}
// 弹窗确认回调
function onOk(){
  if(isUpdate.value) updateCategory()
  else createCategory()
}
//  = = = = = = = = = = = = = = = = = = = = = = = = end 新增弹窗 = = = = = = = = = = = = = = = = = = = = = = >


// 接口请求 = = = = = = = = = = =   start = = = = = = = = = =>
// 列表
async function getList(){
  const res= await categoryTreeListApi('ticket')
  dataSource.value = (res as CategoryModel[]).map((item:CategoryModel) => {
    if(item.attach?.children?.length) item.children = item.attach?.children
    item.key = item.id
    return item
  })
}
// 创建
async function createCategory(){
  await createCategoryApi(formModal.value)
  await  useInit(loading,getList)
}
// 删除
async function deleteCategory(id:string){
  await deleteCategoryApi(id)
  message.success('删除成功！')
  await useInit(loading,getList)
}
// 更新
async function updateCategory(){
  const res = await updateCategoryApi(formModal.value)
  if(res) await useInit(loading,getList, '更新成功')
  
}
// 修改状态
async function toggleStatus(id:string){
  await categoryStatusApi(id)
  message.success('状态修改成功')
  await useInit(loading,getList)
}
useInit(loading,getList)

</script>

<template>
  <div>
  <page-container>
    <a-card>
      <template #title>
        <a-button type="primary" @click="handleAdd('0')">
          <template #icon>
            <PlusOutlined/>
          </template>
          新增分类
        </a-button>
      </template>
<!--      <template #extra>-->
<!--        <Index ref="tableSetting"></Index>-->
<!--      </template>-->
      <BaseTable :loading="loading" :columns="columns" :data-source="dataSource" :columnSlots="columnSlots">
<!--        <template #column-sort="{ record }">-->
<!--          <div>{{record}}}</div>-->
<!--        </template>-->
      </BaseTable>
    </a-card>
    <FormModal ref="editModal" :title="modalTitle" :form-conf="formConf" :form-modal="formModal" @onOk="onOk"></FormModal>
  </page-container>
  </div>
</template>
<style scoped>
:deep(.ant-table-row-level-0){
  background-color: #faf8ff;
}
</style>
