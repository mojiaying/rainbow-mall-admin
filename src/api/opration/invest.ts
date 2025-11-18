
// 我要投资列表 --------------------------------------->
export interface investListParams {
    pageSize: number
    pageIndex: number
    status?: 0 | 1
}
export function investListApi(params: investListParams) {
    return usePost('/admin/investment/activity/list', params, {loading: true,})
}
// 新增投资 --------------------------------------->
export interface investModal {
    id?: string
    activityId: 0,
    activityName: string,
    startTime: string,
    endTime: string,
}
export function createInvestApi(params: { activityList: investModal[] }) {
    return usePost('/admin/investment/activity/add', params, {loading: true,})
}
// 编辑投资活动-------------？？？？没有原型------------------------>
// 查询投资记录详情 -------------------------------->
export function updateInvestApi(params: investModal) {
    return usePost('/admin/investment/activity/update', params, {loading: true,})
}
// 逻辑删除投资活动 -------------------------------->
export function deleteInvestApi(params: {id: string, isDeleted: 0 | 1}) {
    return usePost('/admin/investment/activity/delete', params, {loading: true,})
}
// 更新投资活动上下架状态 --------------------------->
export function updateInvestStatusApi(params: {id: string, status: 0 | 1 | 2}) {
    return usePost('/admin/investment/activity/update-status', params, {loading: true,})
}

// 查询投资详情 -------------------------------->
export function investDetailApi(id:string) {
    return usePost('/admin/investment/activity/investmentDetail', {id}, {loading: true,})
}
// 查询投资记录详情分页 --------------------------->
export interface InvestRecordListParams {
    pageSize?: number
    pageIndex?: number
    activity_id?: string
    investmentActivityId?: string
}
export function investRecordListApi(params: InvestRecordListParams) {
    return usePost('/admin/investment/activity/investmentList', params, {loading: true,})
}
// 更新投资记录备注 --------------------------->
export function updateRemarkApi(params: {id: string, remark: string}) {
    return usePost('/admin/investment/activity/investmentRemark', params, {loading: true,})
}

