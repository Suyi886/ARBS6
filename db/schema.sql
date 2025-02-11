-- 充值订单表
CREATE TABLE recharge_orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_no VARCHAR(32) NOT NULL COMMENT '订单号',
    member_id VARCHAR(32) NOT NULL COMMENT '会员ID',
    amount DECIMAL(10,2) NOT NULL COMMENT '充值金额',
    image_url VARCHAR(255) COMMENT '充值凭证图片URL',
    status TINYINT NOT NULL DEFAULT 0 COMMENT '状态:0待审核,1已到账,2未到账',
    remark VARCHAR(255) COMMENT '备注',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `idx_order_no` (`order_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='充值订单表';

-- 提现订单表
CREATE TABLE withdraw_orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_no VARCHAR(32) NOT NULL COMMENT '订单号',
    member_id VARCHAR(32) NOT NULL COMMENT '会员ID',
    member_name VARCHAR(50) NOT NULL COMMENT '会员姓名',
    bank_name VARCHAR(50) NOT NULL COMMENT '银行名称',
    bank_card_no VARCHAR(32) NOT NULL COMMENT '银行卡号',
    amount DECIMAL(10,2) NOT NULL COMMENT '提现金额',
    status TINYINT NOT NULL DEFAULT 0 COMMENT '状态:0待处理,1已付款,2卡号异常,3异常,4未完成',
    remark VARCHAR(255) COMMENT '备注',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `idx_order_no` (`order_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='提现订单表'; 