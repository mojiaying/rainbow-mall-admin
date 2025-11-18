<script setup lang="ts">
import {PlusOutlined} from '@ant-design/icons-vue'
import {
  CategoryModel,
  createCategoryApi,
  deleteCategoryApi,
  categoryStatusApi,
  updateCategoryApi,
} from "@/api/category.ts";
import FormModal from '@/components/form-modal.vue'
import {FormConfig, Options} from "@/types/global";
import {useConfirm} from "@/composables/global-config.ts";
import {useDataStore} from "@/stores/useDataStore.ts";
import {useMenuAccess} from "@/composables/access.ts";
import {DefaultOptionType} from "ant-design-vue/es/vc-cascader";

const dataSources = useDataStore()
const props = defineProps(['type', 'columns', 'maxLevel', 'formConf']);
const message = useMessage()
const myConfirm = useConfirm()
const loading = ref(false)
const route = useRoute()
const { hasAccess } = useMenuAccess()
const parentLevel = ref<number>(1) // 控制父类的展示方式
const ticketTypeList = ref<Options[]>([])
// 父类选项
let parentListObj: {[x:string]:Options} = {}
// 状态 map
const statusMap = {
  0: '停用',
  1: '启用',
}

let levelMap = {
  1: '新增二级分类',
  2: '新增三级分类'
}

//  table 表格数据  = = = = = = = = = = = start  = = = = = = = = = = =>
let dataSource = shallowRef<CategoryModel[]>([])
// 公共表头
const baseColumns = shallowRef([
  {
    title: '操作',
    dataIndex: 'action',
    buttons:[
      {
        label: '修改状态',
        key: 'status',
        mapName: (row:any) => {
          let action = row.record.status == 0 ? 1 :0
          return statusMap[action as 0 | 1]
        },
        show: () => props.type === 'ticket',
        onclick: async function (row:any){
          let action = row.record.status == 0 ? 1 :0
          myConfirm(`确认 ${statusMap[action as 0 | 1]} ${row.record.name} 吗？`, '',()=> toggleStatus(row.record.id))
          await useInit(loading,getList)
        }
      },
      {
        label: '编辑',
        key: 'edit',
        show: (row:any) => !(row.record.parentId == 0 &&  props.type === 'life_industry'),
        onclick: (row:any) =>{
          handleEdit(row.record)
        },
      },
      {
        label: '删除',
        key: 'del',
        show: (row:any) => !(row.record.parentId == 0 &&  props.type === 'life_industry'),
        onclick: async (row:any) =>{
          myConfirm(`确认删除分类 ${row.record.name} 吗？`, '',()=> deleteCategory(row.record.id))
        },
        style: {color:'red'}
      },
      {
        label: '新增子类',
        key: 'add2',
        mapName: (row:any) => levelMap[row.record.level as 1 | 2],
        show: (row:any) => row.record.level < props.maxLevel && props.type != 'life_industry' && props.type != 'life_goods',
        onclick: async (row:any) =>{
          handleAdd(row.record)
        },
      },
    ],
    width: 200,
  },
])

//  表格数据 = = = = = = = = = = = = = = = = = = = = = = end  = = = = = = = = = = = = = = = = = = = = = =》


// 新增/编辑 弹窗 = = = = = = = = = = = = =  start = = = = = = = = = = =>
// 弹窗标题
const modalTitle = ref('新增分类')
// 弹窗表单配置
const defFormConfig = [
  {
    label: props.type == 'life_goods' ? '上级行业' : '上级',
    key:props.type === 'life_goods' ? 'dependId' : 'parentId',
    slots: 'selects',
    rules: [{ validator: () => {
      if(props.type === 'life_goods'){
        // 检查life_goods类型的dependId
        if(!formModal.value.dependId ||
           (Array.isArray(formModal.value.dependId) && formModal.value.dependId.length < 2)){
          return Promise.reject('请选择上级行业')
        }
      } else {
        // 检查life_industry类型的parentId
        if(!formModal.value.parentId || 
           (Array.isArray(formModal.value.parentId) && !formModal.value.parentId[formModal.value.parentId.length - 1])){
          return Promise.reject('请选择上级')
        }
      }
      return Promise.resolve()
      }, message: props.type === 'life_goods' ? '请选择上级行业' : '请选择上级' }]
  },{
    label: '分类名称',
    key: 'name',
    rules: [{ required: true, message: '请输入分类名称' }, {pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{1,10}$/, message: '请输入10位以内的中英文'}]
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
const formConf = shallowRef<FormConfig[]>(props.formConf || defFormConfig)
const initData = {
  parentId: '',
  dependId: '',
  type: props.type,
  parentName: '',
  code: undefined,
  industryQualifications:undefined,
  needIndustryQualification:undefined,
  desc: '',
  name: '',
  sort: 1

}
// 弹窗数据
const formModal =  shallowRef<CategoryModel>({...initData})

// ref 获取 弹窗对象
const editModal = ref<InstanceType<typeof FormModal>>()

// 新增打开弹窗 = = = = = = = = = == = = >
function handleAdd(item?: CategoryModel | undefined) {
  // 初始化数据
  resetForm()
  let title
  // 获取父类
  if(item){
    let {id, name, level} = item
    title = level == 1  ? ` 新增二级分类` : ` 新增三级分类`
    parentLevel.value = level as number
    formModal.value.parentId = id
    formModal.value.parentName = name
  } else {
    parentLevel.value = 0
    formModal.value.parentId = props.type !== 'life_industry' ? '0' : undefined
  }
  // 修改标题
  modalTitle.value = props.type === 'life_industry' ? '新增二级分类' : title || '新增分类'

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
  formatEditParams() // 根据type类型 格式化请求参数
  let id = formModal.value.id
  let params = {...formModal.value}

  if(props.type == 'life_industry' && formModal.value.parentId && Array.isArray(formModal.value.parentId)) params.parentId = formModal.value.parentId[formModal.value.parentId.length - 1] as string
  if(props.type == 'life_goods') {
    if(formModal.value.dependId !== undefined && Array.isArray(formModal.value.dependId)) params.dependId = formModal.value.dependId[formModal.value.dependId.length -  1] as string
    params.parentId = '0'
  }
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
function formatData(data:any, level: number, parentName?:'') {
  data.forEach((item:any) => {
    item.key = item.id
    item.level = level

    if(props.type == 'life_goods' && item?.attach?.depend) {
      item.depend1 = item?.attach?.depend?.attach?.parent?.name
      item.depend2 = item?.attach?.depend?.name
      item.parentId = item?.dependId
    }
    // 分类列表 选项
    insertParentList(item, props.type, parentName)
    if(item.attach?.children?.length) {
      formatData(item.attach?.children, level + 1, item.name as '')
      item.children = item.attach?.children
    }
  })
  if(props.type == 'ticket' && !parentListObj?.[0]) {
    parentListObj[0] = {value: '0', label: '一级'}
    ticketTypeList.value = Object.values(parentListObj || {})
  }
  return data
}

function insertParentList(item:any, type:string, parentName?:''){
  if(type == 'lift_goods') return
  if(item.level == 1){
    parentListObj[item.id as string] = {value: item.id, label: item.name,children:[]}
  } else if(item.level == 2){
    item.parentName = parentName as string
    if(item.parentId != '0') parentListObj[item.parentId as string]?.children?.push({value: item.id, label: item.name, parentId: item.parentId})
  }
}

// 根据type类型 格式化请求参数
function formatEditParams(){
  const type = props.type
  if(type === 'life_industry') {
    const { needIndustryQualification,  industryQualifications} = formModal.value
    formModal.value.config = { needIndustryQualification,  industryQualifications}
  }
}
// 根据类型 回显数据
function showFormData(item:CategoryModel){
  let {id, name, desc, sort, parentId, parentName, config, code, dependId} = item
  formModal.value = {...formModal.value, id, name, desc, sort, parentId, parentName, code, dependId}
  if(props.type === 'life_industry') {
    formModal.value.needIndustryQualification = config?.needIndustryQualification
    formModal.value.industryQualifications = config?.industryQualifications || []
  }
  
  // 处理商城分类的父级名称显示
  if (props.type === 'mall' && parentId && parentId !== '0') {
    // 查找父级分类名称
    const findParentName = (data: any[]): string => {
      for (const category of data) {
        if (category.id === parentId) {
          return category.name;
        }
        if (category.attach?.children?.length) {
          const found = findParentName(category.attach.children);
          if (found) {
            return found;
          }
        }
      }
      return '';
    };
    
    // 从parentListObj中查找父级名称
    if (parentListObj[parentId]) {
      formModal.value.parentName = parentListObj[parentId].label;
    } else {
      // 遍历所有父级分类查找
      for (const key in parentListObj) {
        const parent = parentListObj[key];
        if (parent.children) {
          const child = parent.children.find((c: Options) => c.value === parentId);
          if (child) {
            formModal.value.parentName = child.label;
            break;
          }
        }
      }
    }
  }
}
// 列表
async function getList(){
  // const res = await categoryTreeListApi(props.type)
  const res = await dataSources.getCategoryList(props.type)
  formatData(res as CategoryModel[], 1)
  if(props.type === 'life_industry') {
    localStorage.setItem('industryList', JSON.stringify(parentListObj))
    for(let val in parentListObj){
      delete (parentListObj[val] as Options).children
    }
  } else if(props.type === 'life_goods') {
    let industryList = JSON.parse(localStorage.getItem('industryList')|| '[]')
    parentListObj = industryList
  }
  dataSource.value = res as CategoryModel[]

}


// 删除
async function deleteCategory(id:string){
  await deleteCategoryApi(id)
  message.success('删除成功！')
  await useInit(loading,getList)
}

// 修改状态
async function toggleStatus(id:string){
  await categoryStatusApi(id)
  message.success('状态修改成功')
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
    <a-card >
      <template #title v-if="hasAccess('add', route?.meta?.btns)">
          <a-button type="primary" @click="handleAdd(undefined)">
            <template #icon>
              <PlusOutlined/>
            </template>
            {{type === 'life_industry' ? '新增二级分类' : '新增分类'}}
          </a-button>
       </template>
      <BaseTable :loading="loading" :columns="[...columns, ...baseColumns]" :data-source="dataSource">
      </BaseTable>
    </a-card>
    <FormModal ref="editModal" :title="modalTitle" :form-conf="formConf" :form-modal="formModal" @onOk="onOk" @onCancel="resetForm">
      <template #selects>
        <a-form-item-rest>
          <LinkSelects v-if="type === 'life_goods'" :sourceTree="Object.values(parentListObj || {})" v-model:selected="formModal.dependId"></LinkSelects>
          <LinkSelects v-else-if="type === 'life_industry'" :sourceTree="Object.values(parentListObj || {})" v-model:selected="formModal.parentId"></LinkSelects>
          <div v-else-if="type === 'ticket'">
          <a-select v-model:selected="formModal.parentId"
                      :options="ticketTypeList as DefaultOptionType[]"
                      placeholder="'请选择上级'"/>
          </div>
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
