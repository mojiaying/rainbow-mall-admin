// 我要赞助列表 ----------缺 草稿 入参----------------------------->
export interface sponsorListParams {
    pageSize: number
    pageIndex: number
    status?: 0 | 1 | 2 | null,
}
export function sponsorListApi(params: sponsorListParams) {
    return usePost('/admin/sponsorship/activity/list', params, {loading: true,})
}
// 新增赞助 --------------------------------------->
export interface sponsonModal {
    id?: string
    activityType?: 1 | 2 | null,
    activityName?: string,
    url?: string | string[],
    startTime?: string,
    endTime?: string,
    introduction?: string,
    sponsorTime?: [any, any] | null,
    status?: 0 | 1 | 2
}
export function createSponsorApi(params: sponsonModal) {
    return usePost('/admin/sponsorship/activity/add', params, {loading: true,})
}
// 编辑赞助------------？？？？原型没有按钮------------------------>
export function updateSponsorApi(params: sponsonModal) {
    return usePost('/admin/sponsorship/activity/update', params, {loading: true,})
}
// 删除赞助-------------------------------->
export function deleteSponsorApi(params: {id: string, isDeleted: 0 | 1}) {
    return usePost('/admin/sponsorship/activity/delete', params, {loading: true,})
}
// 更新赞助活动上下架状态 --------------------------->
export function updateSponsorStatusApi(params: {id: string, status: 0 | 1 | 2}) {
    return usePost('/admin/sponsorship/activity/update-status', params, {loading: true,})
}
// 查询赞助详情 -------------------------------->
export function sponsorDetailApi(id:string) {
    return usePost('/admin/sponsorship/activity/detail', {id}, {loading: true,})
}
// 查询赞助记录详情 --------------------------->
export function sponsorRecordApi(id:string) {
    return usePost('/admin/sponsorship/activity/sponsorshipDetail', {id}, {loading: true,})
}
// 查询赞助记录详情分页 --------------------------->
export interface SponsorRecordListParams {
    pageSize?: number
    pageIndex?: number
    activityId?: string
}
export function sponsorRecordListApi(params: SponsorRecordListParams) {
    return usePost('/admin/sponsorship/activity/sponsorshipList', params, {loading: true,})
}

// 更新赞助记录备注 --------------------------->
export function updateRemarkApi(params: {id: string, remark: string}) {
    return usePost('/admin/sponsorship/activity/sponsorshipRemark', params, {loading: true,})
}


