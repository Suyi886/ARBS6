// 订单状态枚举
export enum RechargeStatus {
    PENDING = 0,    // 待审核
    CONFIRMED = 1,  // 已到账
    REJECTED = 2    // 未到账
}

export enum WithdrawStatus {
    PENDING = 0,    // 待处理
    PAID = 1,      // 已付款
    CARD_ERROR = 2, // 卡号异常
    ERROR = 3,      // 异常
    INCOMPLETE = 4  // 未完成
}

// 充值订单类型
export interface RechargeOrder {
    id: number;
    order_no: string;
    member_id: string;
    amount: number;
    image_url: string;
    status: RechargeStatus;
    remark?: string;
    created_at: string;
    updated_at: string;
}

// 提现订单类型
export interface WithdrawOrder {
    id: number;
    order_no: string;
    member_id: string;
    member_name: string;
    bank_name: string;
    bank_card_no: string;
    amount: number;
    status: WithdrawStatus;
    remark?: string;
    created_at: string;
    updated_at: string;
} 