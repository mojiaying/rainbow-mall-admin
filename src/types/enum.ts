export const payEnum = {
    none : '-',
    weixin: '微信支付',
    alipay: '支付宝支付'
}
export const payStatusMap = {
    1: '成功',
    2: '失败',
    3: '支付中',
    4: '退款成功',
    5: '退款失败',
    6: '退款中',
    // 退款状态 6：退款中；4：退款成功；5：退款失败
}

export const orderTypeMap = {
    'SELF_OPERATED_MALL': '自营商城订单',
    'LOCAL_LIFE': '本地生活订单',
    'IP_PRE_SALE': 'IP预售订单',
    'RAINBOW_COIN_RECHARGE': '彩虹币充值订单',
}


export const outTypeMap = {
    'NONE': '无',
    'IP_PRE_SALE': 'IP预售订单',
    'IP_PRE_SALE_REFUND': '票务-预售退款',
    'PRESALE_ORDER_TICKET': '票务-预售订单-门票',
    'PRESALE_ORDER': '票务-预售订单',
    'RECHARGE_ORDER': '充值订单',
    'LIFE_GOODS_ORDER': '本地生活-生活订单',
    'LIFE_GOODS_ORDER_COUPON': '生活订单-券码',
    'LIFE_GOODS_ORDER_REFUND': '本地生活-售后订单',
    'MALL_PRODUCT_ORDER': '自营商城-商品订单',
    'MALL_PRODUCT_ORDER_REFUND': '自营商城-售后订单',
}

