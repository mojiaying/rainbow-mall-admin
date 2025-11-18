export interface ticket{
    idx?: number
    ticketPrice?: number // 票价
    ticketName?: string // 票名
    ticketStatus?: 0 | 1 // 票状态
    cornerMark?: string // 角标
}
export interface session{
    sessionName: string // 场次名称
    sessionTime?: string
    sessionStartTime: string
    sessionStopTime: string
    idx: number
    tickets: ticket[]
}
export interface IpModal{
    id?: string
    idx?: number
    performanceType?: string// IP类型
    performanceTypes?: string[]// IP类型
    performanceName: string // IP名称
    poster: string // 海报
    addressId: string // 场馆
    // rainbowCoin: string // 彩虹币
    saleMechanism?: number // 售卖机制
    stopSaleTime?: any   // 停售时间
    countdownSaleTime?: any                                                                                          // 倒计时售卖时间
    showInfos?: session[] // 场次信息
    pointsValue?: number // 积分
    firstLevelDistributionValue?: number // 一级分销
    secondLevelDistributionValue?: number // 二级分销
    performanceIntroduction?: string // IP简介
    payType?: 0  | 1 | 2 // 支付方式 0 组合 1彩虹币 2 人民币
    rainbowCoinPayType?: 0 | 1 | 2 // 彩虹币支付方式 0 固定值 1 百分比 2不限
    rainbowCoinPayValue?: number // 彩虹币支付金额
}
// ip 投票列表
export function ipListApi(params: any) {
    return usePost('/admin/presale/paging', params)
}

// 新增 ip 投票
export function createIpApi(params: IpModal) {
    return usePost('/admin/presale/create', params, {loading: true,})
}

// 编辑 ip 投票
export function updateIpApi(params: any) {
    return usePost('/admin/presale/update', params, {loading: true,})
}
// 修改票品库存接口
export function updateTicketsApi(params: any) {
    return usePost('/admin/presale/ticket_stock/update', params)
}
// 票务详情
export function getIpDetail(id: string) {
    return useQuery('/admin/presale/detail', {id}, {loading: true,})
}

// 删除 ip 投票
export function deleteIpApi(id: string) {
    return useQuery('/admin/presale/delete', {id}, {loading: true,})
}
// 更新明星接口
export function updateVoteStarApi(params: any) {
    return usePost('/admin/presale/stars/update', params, {loading: true,})
}
// 投票详情
// export function starVoteDetailApi(presaleId: string) {
//     return useQuery('/admin/star/queryStarVote', {presaleId}, {loading: true,})
// }

export function starVoteDetailApi(presaleId: string) {
    return useQuery('/admin/star_vote_count/list/presale', {presaleId}, {loading: true,})
}

// 修改明星投票
export function updateVoteApi(params: any) {
    return usePost('/admin/star_vote_count/change_votes', params, {loading: true,})
}
// export function updateVoteApi(params: updateVoteParams[]) {
//     return usePost('/admin/star/updateVote', params, {loading: true,})
// }
// 上下架
export function ipStatusUpApi(id: string){
    return useQuery('/admin/presale/on', {id}, {loading: true,})
}

export function ipStatusDownApi(id: string){
    return useQuery('/admin/presale/off', {id}, {loading: true,})
}



