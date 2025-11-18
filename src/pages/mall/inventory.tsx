import MyPage from "@/components/my-page.vue";
import { CustomColumnsType } from "ant-design-vue/es/table";
import {Image, Flex, Popover} from 'ant-design-vue';
import {useDataStore} from "@/stores/useDataStore.ts";
import {useIndex} from "@/composables/table-data.ts";
import {Options} from "@/types/global";
// import {skuListApi} from "@/api/mall.ts";
// import { StatusObj } from "@/types/global";
// import { offGoodsApi } from "@/api/goods.ts";
// const myConfirm = useConfirm()
const curItem = ref<any>()
const skuList = ref<any[]>([])

const showEditStore = ref(false)
const loading = ref(false)
// 子组件对象
const myPage = ref<InstanceType<typeof MyPage>>()
const dataSource = useDataStore()
let warehouseList = ref<Options[] |undefined>(dataSource.warehouseList || undefined)
let supplierList = ref<Options[] |undefined>(dataSource.supplierList || undefined)
async function getStoreList(){
  if(dataSource.changeFlag?.warehouse) await dataSource.getWarehouseList()
  if(dataSource.changeFlag?.supplier) await dataSource.getSupplierList()
  warehouseList.value = dataSource.warehouseList || []
  supplierList.value = dataSource.supplierList || []
}

getStoreList()
// 组件配置 = = = = = = = = = = = = = = = =》
let categoryList = ref()
async function getCategoryList(){
    if(!dataSource.mallCategoryList) {
        await dataSource.getCategoryList('mall')
    }
    categoryList.value = dataSource.mallCategoryList || []
    return categoryList.value
}
getCategoryList()
/// 1.搜索组件配置
const searchConf = computed(() => [
  {
    label: '商品名称',
    key: 'spuNameLike',
  },
  {
    label: '规格名称',
    key: 'skuNameLike',
  },
  {
    label: 'SKU编码',
    key: 'skuCodeLike',
  },
  {
    label: '商品分类',
    key: 'categoryId',
    type: 'cascader',
    options: categoryList.value || [],
      width: '300px'
  }
])
// 2.table 表头配置
const columns: CustomColumnsType<any>[] = [
    {
        title: '序号',
        dataIndex: 'number',
        fixed: true,
        width: 100,
        customRender: ({ index }:{index:number}) => useIndex(myPage.value?.pagination, index),
    },{
        title: '商品',
        fixed: true,
        dataIndex: 'product',
        customRender: (row: any) => {
          const spuName = row.record.attach?.mallProductSpu?.spuName;
          return <Flex style={{ flex: 1 }}>
            <Image style={{ width: '50px', height: '50px' }} src={row.record.skuUrl} fallback={useErrorImg()}></Image>
            <Flex vertical style={{ justifyContent: 'space-between', marginLeft: '10px' }}>
              <Popover content={spuName} trigger="hover">
                <span class={'line-hide a-left'} style={{ width: '180px' }}>{spuName}</span>
              </Popover>
            </Flex>
          </Flex>
        },
        width: 250
    },{
        title: '分类',
    dataIndex: 'classification',
    },
    {
      title: '商品编码',
      dataIndex: 'spuCode',
    },{
      title: 'SKU编码',
      dataIndex: 'skuCode',
    },{
      title: '规格名称',
      dataIndex: 'skuName',
  }, {
      title: '库存数量',
      dataIndex: 'inventory',
  },{
      title: '可售库存',
      dataIndex: 'sellable',
    },{
    title: '仓库',
    dataIndex: 'warehouseName',
    customRender: ({record}) => warehouseList.value?.filter(i => i.value == record?.attach?.mallProductSpu?.warehouseId)?.[0]?.label || '-'
  },{
    title: '供应商',
    dataIndex: 'supplierName',
    customRender: ({record}) => supplierList.value?.filter(i => i.value == record?.attach?.mallProductSpu?.supplierId)?.[0]?.label || '-'
  },
    {
        title: '操作',
        dataIndex: 'action',
        fixed: 'right',
        buttons: [
            {
                label: '修改库存',
                key: 'edit',
                onclick: async (row: any) => {
                    // let Item = await skuListApi(row.record.spuId);
                    // Item.forEach((item: any) => {
                    //     item.storeChangeNum = 0
                    //     item.opType = 1
                    //     item.orgStoreNum =  item.attach?.mallProductSkuStock?.stocks || 0
                    //     item.storeNum = item.orgStoreNum
                    // })
                    // skuList.value = Item
                    let item = row.record
                    item.storeChangeNum = 0
                    item.opType = 1
                    item.orgStoreNum = item.sellable
                    item.storeNum = item.sellable
                    curItem.value = item
                    skuList.value = [item]
                    showEditStore.value = true
                },
            },
        ],
    },
]

export {columns, myPage, searchConf, loading, showEditStore, curItem, skuList}