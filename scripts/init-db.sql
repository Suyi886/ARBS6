-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 创建初始管理员账号
-- 密码为 admin123 的哈希值
INSERT INTO users (username, password, role) 
VALUES ('admin', '$2b$10$s5pU1qj43Jh8Y9DZw3qQT.LqpzjZVsw17ZwB5WBw3cNOZwPBfeePi', 'admin')
ON DUPLICATE KEY UPDATE username = username; 