/// <reference types="vite/client" />

import type {RuleObject} from "ant-design-vue/es/form/interface";
declare module '*.vue' {
    import type {DefineComponent} from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component

}
// 分页请求参数
interface ListParams {
    pageSize?: number | string
    pageIndex?: number | string
    nicknameLike?: string
}
// 下拉选项
interface Options {
    value: string | number | undefined | boolean,
    label: string | undefined,
    disabled?: boolean | undefined,
    children?: Options[]
    parentId?: string,
    tabs?: string[],
    btns?: string[],
    checked?: boolean
    keyVal?: {val: string, unit?: string, disabled?: boolean},
}

// 详情展示配置 descriptions list
interface ItemType {
    label?: string,
    value?: string | string[],
    type?: 'img' | 'txt',
    right?: boolean,
    w?: number
    thin?: boolean
    slotData?: any
    html?: string
    slot?: string
}
interface DesConf{
    title?: string
    desc?: string
    column?: ItemType[][]
    row?: ItemType[]
    list?:ItemType[][] | ItemType[]
}
// 表单组件配置
type Type = 'linkSelect' | 'text' | 'date' | 'select' | 'textarea' | 'number' | 'input' | 'radio' | 'checkbox' | 'tag' | 'img' | 'editor' | 'checkboxes' | 'select-tree' | 'cascader'
interface FormConfig {
    label?: string,
    key: string,
    width?: string,
    type?: Type,
    keyVal?: {val: string, unit?: string, disabled?: boolean},
    disabled?: boolean,
    placeholder?: string,
    options?: Options[] | [],
    rules?: RuleObject | RuleObject[] | 'required',
    blurUpdate?: boolean,
    slots?: string,
    afterSlot?: string,
    addTips?: string,
    relyOn?: string,
    maxCount?: number,// 图片上传最大数量
    accept?: string[], // 图片上传类型
    onChange?: Function,
}
type ChildItem = FormConfig | FormConfig[]
interface MyFormConfig{
    title?: string
    titleSlot?: string
    slot?: string
    itemWidth?: number | string
    children?: ChildItem[]
}
// 分页列表
interface PageList<T>  {
    count: number
    data: T[]
    presales?: T[]
    ext: any
}

// 状态切换签
interface StatusItem {
    value?: string | number;
    count: number;
    label: string
}
interface StatusObj {
    [key: string]: StatusItem
}




