
// 定义用户数据类型（可选，TypeScript 推荐）
import {goodsLogisticsApi, goodsReturnListApi, ReturnAddressParams} from "@/api/mallsetting.ts";
import {categoryTreeListApi} from "@/api/category.ts";
import {Options} from "@/types/global"
import {theaterListApi} from "@/api/theater.ts";
import {starListApi} from "@/api/star.ts";
import {ipListApi} from "@/api/tickets/ticket.ts";
import {deptListApi} from "@/api/system/dept.ts";
import {jobListApi} from "@/api/system/job.ts";
import {roleListApi} from "@/api/system/roles.ts";
import {menuListApi} from "@/api/system/menu.ts";
import {getProvinceApi} from "@/api/common";
import {warehouseListApi} from "@/api/warehouse.ts";
import {supplierListApi} from "@/api/supplier.ts";


interface dataState {
    logisticsList: Options[] | null, // 物流模板列表
    mallCategoryList: Options[] | null, // 商品分类列表
    ticketCategoryList: Options[] | null, // 票务分类列表
    lifeCategoryList: Options[] | null, // 生活商品分类列表
    refundAddressList: ReturnAddressParams[] | null, // 退货地址列表
    warehouseList: Options[] | null, // 仓库列表
    supplierList: Options[] | null, // 供应商列表
    theaterList: any[] | null, // 场馆地址列表
    starList: any[] | null, // 明星列表
    deptList: any[] | null, // 部门列表
    jobList: any[] | null,
    roleList: any[] | null,
    provinceList: any[] | null,
    menuList: any[] | null,
    IPList: any[] | null, // IP 列表
    loading: boolean; // 加载状态
    error: string | null; // 错误信息
    changeFlag: {
        logistics: boolean,
        theaters: boolean,
        stars: boolean,
        refundAddress: boolean,
        warehouse: boolean,
        supplier: boolean,
        job: boolean,
        role: boolean,
    }
}
function setOptions(data:any, setDisabled?: boolean) {
    if(!data || !Array.isArray(data) || data.length == 0) return []
    return data.map(item => {
        let {name, id, parentId, attach, status} = item;
        let children
        if(attach?.children?.length) {
            item.children = attach.children
            children = setOptions(attach.children);
        }
        let temp:Options = {value: id, label: name, parentId,children}
        if(setDisabled) {
            temp.disabled = !status
        }
        return temp
    })
}

function setMenu(data:any) {
    if(!data || !Array.isArray(data) || data.length == 0) return []
    return data.map(item => {
        let {name, id, parentId, attach} = item;
        let children, btns, tabs
        if(attach?.children?.length) {
            item.children = attach.children
            children = setMenu(attach.children);
        }
        if(attach?.buttons?.length) {
            item.btns = attach.buttons
            btns = attach.buttons.map((item:any) => ({label: item.name, value: item.id, parentId: item.parentId, checked: false}));
        }
        if(attach?.searchs?.length) {
            item.tabs = attach.searchs
            tabs =  attach.searchs.map((item:any) => ({label: item.name, value: item.id, parentId: item.parentId, checked: false}));
        }
        let temp:Options = {value: id, label: name, parentId,children, tabs, btns, checked: false}
        return temp
    })
}
// 定义并导出 store
export const useDataStore = defineStore('dataStore', {
    // 状态初始化
    state: (): dataState => ({
        logisticsList: null,
        mallCategoryList: null,
        lifeCategoryList: null,
        refundAddressList: null,
        warehouseList: null,
        supplierList: null,
        deptList: null,
        jobList: null,
        roleList: null,
        menuList: null,
        provinceList: null,
        theaterList: null,
        starList: null,
        ticketCategoryList: null,
        IPList: null,
        loading: false,
        error: null,
        changeFlag: {
            logistics: true,
            theaters: true,
            stars: true,
            refundAddress: true,
            warehouse: true,
            supplier: true,
            job: true,
            role: true,
        }
    }),

    // 封装接口请求的方法
    actions: {
        setFlagChange(key: string, value:boolean) {
            this.changeFlag[key as 'stars'] = value;
        },
        // 获取物流模板列表
        async getLogisticsList() {
            if(!this.changeFlag.logistics) return;
            this.changeFlag.logistics = false;
            try {
                this.loading = true; // 开始加载
                this.error = null; // 清空错误
                // 调用接口
                const response = await goodsLogisticsApi();
                // 接口返回成功后，将数据存入状态
                this.logisticsList = response?.map((item:any) => {
                    return {value: item.id, label: item.name, ...item};
                })
                return response // 可返回数据供组件使用
            } catch (err) {
                // 处理错误
                this.error = err instanceof Error ? err.message : '获取物流列表失败';
                throw err; // 抛出错误供组件捕获
            } finally {
                this.loading = false; // 结束加载
            }
        },
        // 获取退货地址列表
        async getRefundAddressList() {
            if(!this.changeFlag.refundAddress) return;
            this.changeFlag.refundAddress = false;
            try {
                this.loading = true; // 开始加载
                this.error = null; // 清空错误
                // 调用接口
                const response = await goodsReturnListApi({pageSize: 1000, pageIndex: 1});
                // 接口返回成功后，将数据存入状态
                this.refundAddressList = response?.data.map((item:any) => {
                    return {value: item.id, label: item.contact.name, ...item};
                })
                return response // 可返回数据供组件使用
            } catch (err) {
                // 处理错误
                this.error = err instanceof Error ? err.message : '获取退货地址列表失败';
                throw err; // 抛出错误供组件捕获
            } finally {
                this.loading = false; // 结束加载
            }
        },

        // 商品分类列表
        async getCategoryList(type: 'mall' | 'ticket' | 'life_goods' | 'life_industry') {
            const response = await categoryTreeListApi(type);
            if(type == 'mall') this.mallCategoryList = setOptions(response);
            if(type == 'ticket') this.ticketCategoryList = setOptions(response, true);
            if(type == 'life_goods') this.lifeCategoryList = setOptions(response);
            return response // 可返回数据供组件使用
        },

        // 场馆地址列表
        async getTheaterList() {
            if(!this.changeFlag.theaters) return;
            this.changeFlag.theaters = false;
            const theaters = await theaterListApi({pageSize: 1000, pageIndex: 1});
            this.theaterList = theaters.data.map((item:any) => {
                let value, label, description, address
                label = item.name
                description = useFullAddress(item.address)
                address = item.address
                value = item.id
                return {value, label, description, address}
            })
            return theaters // 可返回数据供组件使用
        },
        // 明星列表
        async getStarList(params = {pageSize: 1000, pageIndex: 1}) {
            if(!this.changeFlag.stars) return;
            this.changeFlag.stars = false;
            const response = await starListApi(params);
            this.starList = response.data.map((item:any) => {
                item.value = item.id
                item.label = item.name
                return item
            })
            return response
        },

        //  仓库列表
        async getWarehouseList() {
            if(!this.changeFlag.warehouse) return;
            this.changeFlag.warehouse = false;
            const response = await warehouseListApi();
            this.warehouseList = response?.map((item:any) => ({value: item.id, label: item.name, disabled: !item.enable}))
            return response
        },

        // 供应商列表
        async getSupplierList() {
            if(!this.changeFlag.supplier) return;
            this.changeFlag.supplier = false;
            const response = await supplierListApi();
            this.supplierList = response?.map((item:any) => ({value: item.id, label: item.name, disabled: !item.enable}))
            return response
        },
        // IP 预售列表

        async getIpList(performanceNameLike?: string) {
            const response = await ipListApi({pageSize: 50, pageIndex: 1, performanceNameLike});
            this.IPList = response.data.map((item:any) => {
                let value = item.id
                let label = item.performanceName
                let showInfos = item?.showInfos?.map((show:any, index:number) => {
                    let value = index
                    let label = show.sessionName
                    return {label, value}
                })
                return {value, label, showInfos}
            })
            return response
        },
        // 部门列表
        async getDeptList() {
            const response = await deptListApi();
            this.deptList = setOptions(response);
            this.deptList.unshift({label: '一级', value: '0'})
            return response
        },
        // 岗位列表
        async getJobList() {
            const response = await jobListApi({pageSize: 1000, pageIndex: 1});
            this.jobList = response.data.map((item:any) => ({value: item.id, label: item.name}))
            return response
        },
        // 角色列表
        async getRoleList() {
            const response = await roleListApi({pageSize: 1000, pageIndex: 1});
            this.roleList = response.data.map((item:any) => ({value: item.id, label: item.name}))
            return response
        },
        // 菜单列表
        async getMenuList() {
            const response = await menuListApi();
            this.menuList = setMenu(response);
            this.menuList.unshift({label: '一级', value: '0'})
            return response
        },

        // 省份列表
        async getProvinceList() {
            const res = await getProvinceApi()
            this.provinceList = res.map((item:any) => {
                let {id, fullname} = item
                return {value:fullname, label: fullname, id}
            })
            return res
        },

    },

    // 可选：定义计算属性（类似 Vuex 的 getters）
    getters: {

    }
});
