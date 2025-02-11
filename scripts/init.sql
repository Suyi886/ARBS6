-- 创建用户表
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 创建充值订单表
CREATE TABLE recharge_orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_no VARCHAR(32) NOT NULL UNIQUE,
    member_id VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    status TINYINT NOT NULL DEFAULT 0 COMMENT '0:待审核,1:已到账,2:未到账',
    remark TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 创建提现订单表
CREATE TABLE withdraw_orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_no VARCHAR(32) NOT NULL UNIQUE,
    member_id VARCHAR(50) NOT NULL,
    member_name VARCHAR(50) NOT NULL,
    bank_name VARCHAR(50) NOT NULL,
    bank_card_no VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status TINYINT NOT NULL DEFAULT 0 COMMENT '0:待处理,1:已付款,2:卡号异常,3:异常,4:未完成',
    remark TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 插入初始管理员账号 (密码为 admin123)
INSERT INTO users (username, password, role) VALUES 
('admin', '$2b$10$s5pU1qj43Jh8Y9DZw3qQT.LqpzjZVsw17ZwB5WBw3cNOZwPBfeePi', 'admin');

-- 已有的充值订单表和提现订单表... 