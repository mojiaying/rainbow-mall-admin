type categoryType = 'mall' | 'ticket' | 'life_goods' | 'life_industry'
const  enum statusType {
    STOP = 0,
    ACTIVE = 1,
}
export interface  CategoryModel {
    id?: string
    name?: string
    desc?: string
    sort?:number
    status?:statusType
    creator?:string
    modified?:string
    gmtCreated?:string
    gmtModified?:string
    isDeleted?:boolean
    parentId?:string
    dependId?:string
    parentName?:string
    level?:number
    key?: string
    showParent?:string
    type?:categoryType
    children?:CategoryModel[]
    code?: string
    needIndustryQualification?: boolean,
    industryQualifications?: string[],
    config?: {needIndustryQualification?: boolean, industryQualifications?: string[]}
    attach?: {
        itemCount:number,
        children?: CategoryModel[] | null

    }
}
export interface CategoryPageParams {
    pageSize:number
    pageIndex:number
    type:categoryType
    nameLike:string
    parentId:number
    status:statusType
}

export interface CategoryParams {
    type:categoryType
    parentId:number
    status?:statusType
}

export function categoryListApi(params: CategoryParams) {
    return useQuery<CategoryModel[], CategoryParams>('/admin/category/list', params)
}
export function categoryTreeListApi(type: categoryType) {
    return useQuery<CategoryModel[], {type:categoryType}>('/admin/category/tree', {type})
}

export function deleteCategoryApi(id: string) {
    return useQuery<boolean, {id: string}>('/admin/category/delete', { id })
}

export function createCategoryApi(params: CategoryModel){
    return usePost<boolean,CategoryModel>('/admin/category/create', params)
}

export function updateCategoryApi(params: CategoryModel){
    return usePost<boolean,CategoryModel>('/admin/category/update', params)
}

export function detailCategoryApi(params: number){
    return usePost<CategoryModel, number>('/admin/category/detail', params)
}

export function categoryStatusApi(id: string){
    return useQuery<boolean, {id: string}>('/admin/category/status', {id})
}
