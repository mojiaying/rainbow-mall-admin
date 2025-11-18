// 交易币种 积分/货币类型枚举  金币/GOLD 积分/POINT 彩虹币/RAINBOW 余额/BALANCE
export type CurrencyType = 'GOLD' | 'POINT' | 'RAINBOW' | 'BALANCE'

// 交易类型 积分/货币类型枚举
/* 积分-消费/POINT_CONSUMPTION
 * 彩虹币-赠送/RAINBOW_GIFT
 * 彩虹币-退款/RAINBOW_REFUND
 * 彩虹币-充值/RAINBOW_RECHARGE
 * 彩虹币-兑换/RAINBOW_EXCHANGE
 * 彩虹币-消费/RAINBOW_CONSUMPTION
 */
export type BusinessType = 'POINT_CONSUMPTION' | 'RAINBOW_GIFT' | 'RAINBOW_REFUND' | 'RAINBOW_RECHARGE' | 'RAINBOW_EXCHANGE' | 'RAINBOW_CONSUMPTION'

/* 支付方式
* NONE 无
* WEIXIN 微信支付
* ALIPAY 支付宝支付
* BALANCE 余额抵扣
* RAINBOW 彩 虹币抵扣
* */
export type PayEnum = 'NONE' | 'WEIXIN' | 'ALIPAY' | 'BALANCE' | 'RAINBOW'


// IP_PRE_SALE 票务-预售订单
// RECHARGE_ORDER 充值订单
// LIFE_GOODS_ORDER 本地生活-生活订单
// LIFE_GOODS_ORDER_REFUND 本地生活-售后订单
// MALL_PRODUCT_ORDER 自营商城-商品订单
// MALL_PRODUCT_ORDER_REFUND 自营商城-售后订单
export type OutType = 'NONE' | 'IP_PRE_SALE' | 'RECHARGE_ORDER' | 'LIFE_GOODS_ORDER' | 'LIFE_GOODS_ORDER_REFUND' | 'MALL_PRODUCT_ORDER' | 'MALL_PRODUCT_ORDER_REFUND'
