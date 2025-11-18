<script setup lang="ts">
import {PlusOutlined} from '@ant-design/icons-vue'
import {
  CategoryModel,
  createCategoryApi,
  deleteCategoryApi,
  updateCategoryApi,
  categoryTreeListApi
} from "@/api/category.ts";
import FormModal from '@/components/form-modal.vue'
import {useConfirm} from "@/composables/global-config.ts";
import {Options} from "@/types/global";


const message = useMessage()
const myConfirm = useConfirm()
const loading = ref(false)
const parentLevel = ref<number>(1) // 控制父类的展示方式
// 父类选项
let parentListObj: {[x:string]:Options} = {}

//  table 表格数据  = = = = = = = = = = = start  = = = = = = = = = = =>
let dataSource = shallowRef<CategoryModel[]>([])
// 公共表头
const baseColumns = shallowRef([
  {
    title: '一级行业',
    dataIndex: 'depend1',
  },
  {
    title: '二级行业',
    dataIndex: 'depend2',
  },
  {
    title: '分类名称',
    dataIndex: 'name',
    width: 120
  },
  {
    title: '修改时间',
    dataIndex: 'gmtModified',
    width: 150,
  },
  {
    title: '操作',
    dataIndex: 'action',
    buttons:[
      {
        label: '编辑',
        onclick: (row:any) =>{
          handleEdit(row.record)
        },
      },
      {
        label: '删除',
        onclick: async (row:any) =>{
          myConfirm(`确认删除分类 ${row.record.name} 吗？`, '',()=> deleteCategory(row.record.id))
        },
        style: {color:'red'}
      }
    ],
    width: 220,
  },
])

//  表格数据 = = = = = = = = = = = = = = = = = = = = = = end  = = = = = = = = = = = = = = = = = = = = = =》


// 新增/编辑 弹窗 = = = = = = = = = = = = =  start = = = = = = = = = = =>
// 弹窗标题
const modalTitle = ref('新增分类')
// 弹窗表单配置
const defFormConfig = [
  {
    label: '上级行业',
    key:'dependId',
    slots: 'selects',
    type: 'linkSelect',
    rules: [{ required: true, message: '请选择上一级' }]
  },{
    label: '分类名称',
    key: 'name',
    rules: [{ required: true, message: '请输入分类名称' }, {pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{1,6}$/, message: '请输入6位以内的中英文字符'}]
  },
  {
    label: '分类描述',
    key: 'desc',
    type: 'textarea',
    rules: [{ max: 100, message: '最多输入100位字符' }]
  },
  {
    label: '排序',
    key: 'sort',
    type: 'number',
  }
]
const initData:CategoryModel = {
  parentId: '0',
  dependId: '',
  type: 'life_goods',
  parentName: '',
  desc: '',
  name: undefined,
  sort: 1
}
// 弹窗数据
const formModal =  shallowRef<CategoryModel>({...initData})

// ref 获取 弹窗对象
const editModal = ref<InstanceType<typeof FormModal>>()

// 新增打开弹窗 = = = = = = = = = == = = >
function handleAdd(item?: CategoryModel | undefined) {
  modalTitle.value = '新增分类'
  // 初始化数据
  resetForm()
  // 获取父类
  if(item){
    let {id, name, level} = item
    parentLevel.value = level as number
    formModal.value.parentId = id || ''
    formModal.value.parentName = name || ''
  } else {
    parentLevel.value = 0
    formModal.value.parentId = '0'
  }
  // 修改标题

  // 打开弹窗
  editModal.value?.open()

}
// 编辑：打开弹窗 = = = = = = = = = =  >

function handleEdit(item: CategoryModel) {
  resetForm()
  modalTitle.value = '编辑分类'
  let {level} = item
  showFormData(item) // 数据回显
  parentLevel.value = level != undefined ? level-1 : 2
  editModal.value?.open()
}
// 弹窗确认回调 = = = == = = = = = = >
async function onOk(){
  let id = formModal.value.id
  let params = {...formModal.value}
  if(formModal.value.dependId !== undefined) params.dependId = formModal.value.dependId[1] as string
  let res = id ? await updateCategoryApi(params) : await createCategoryApi(params)
  if(res){
    await useInit(loading, getList, id ? '分类修改成功!' : '分类创建成功！')
    editModal.value?.close()
  }
}

//  = = = = = = = = = = = = = = = = = = = = = = = = end 新增弹窗 = = = = = = = = = = = = = = = = = = = = = = >

// 接口请求 = = = = = = = = = = =   start = = = = = = = = = =>
//
/*格式化列表 返回数据  限制处理两级
* Key：       table 折叠用，
* level：     创建创建展示用，
* parentName：编辑展示用，
* parentList：父类选项
* */
function formatData(data:any, level: number, parentName?:'', setParent?:boolean) {
  data.forEach((item:any) => {
    item.key = item.id
    item.level = level
    if(item?.attach?.depend) {
      item.depend1 = item?.attach?.depend?.attach?.parent?.name
      item.depend2 = item?.attach?.depend?.name
      item.parentId = item?.dependId
    }
    // 分类列表 选项
    if(setParent) insertParentList(item, parentName)
    if(item.attach?.children?.length) {
      formatData(item.attach?.children, level + 1, item.name as '', setParent)
      item.children = item.attach?.children
    }
  })
  return data
}

function insertParentList(item:any,  parentName?:''){
  if(item.level == 1){
    parentListObj[item.id as string] = {value: item.id, label: item.name,children:[]}
  } else if(item.level == 2){
    item.parentName = parentName as string
    if(item.parentId != '0') parentListObj[item.parentId as string]?.children?.push({value: item.id, label: item.name, parentId: item.parentId})
  }
}

// 根据类型 回显数据
function showFormData(item:any){
  let {id, name, desc, sort, parentId, parentName, code, dependId} = item
  formModal.value = {...formModal.value, id, name, desc, sort, parentId, parentName, code, dependId}
}
// 列表
async function getList(){
  const res = await categoryTreeListApi('life_goods')
  formatData(res as CategoryModel[], 1)
  let industryList = JSON.parse(localStorage.getItem('industryList')|| '[]')
  if(industryList.length) {
    parentListObj = industryList
  } else {
    await getIndustryList()
  }
  dataSource.value = res as CategoryModel[]
}
// 获取行业列表
async function getIndustryList(){
  const res = await categoryTreeListApi('life_industry')
  formatData(res as CategoryModel[], 1, '', true)
  localStorage.setItem('industryList', JSON.stringify(parentListObj))

}

// 删除
async function deleteCategory(id:string){
  await deleteCategoryApi(id)
  message.success('删除成功！')
  await useInit(loading,getList)
}

function getFormData(){
  return editModal?.value?.getFormData()
}
useInit(loading,getList)
defineExpose({
  parentListObj,
  getFormData
})

function resetForm(){
  formModal.value = {}
  formModal.value = {...initData}
}

// 分类选择 = = = = = = = = = = = = = = =》
</script>

<template>
  <a-card>
    <template #title>
      <a-button type="primary" @click="handleAdd(undefined)">
        <template #icon>
          <PlusOutlined/>
        </template>
        新增分类
      </a-button>
    </template>
    <BaseTable :loading="loading" :columns="baseColumns" :data-source="dataSource">
    </BaseTable>
  </a-card>
  <FormModal ref="editModal" :title="modalTitle" :form-conf="defFormConfig" :form-modal="formModal" @onOk="onOk" @onCancel="resetForm">
    <template #selects>
      <a-form-item-rest>
        <LinkSelects :sourceTree="Object.values(parentListObj || {})" v-model:selected="formModal.dependId"></LinkSelects>
      </a-form-item-rest>
    </template>
  </FormModal>
</template>
<style scoped>
:deep(.ant-table-row-level-0){
  background-color: #fbfaff;
}
:deep(.ant-table-row-level-1){
  >td{
    border-bottom: solid 1px #f6ebf7 !important;
  }
}


</style>
