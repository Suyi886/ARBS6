import { Request, Response } from 'express';
import { UserService } from '../services/UserService.js';

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    async createUser(req: Request, res: Response) {
        try {
            const { username, password, role } = req.body;
            
            if (!username || !password) {
                return res.status(400).json({
                    code: 400,
                    message: '用户名和密码不能为空'
                });
            }

            const userId = await this.userService.createUser({
                username,
                password,
                role
            });

            res.json({
                code: 0,
                data: { id: userId }
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: error instanceof Error ? error.message : '创建用户失败'
            });
        }
    }

    async getAllUsers(req: Request, res: Response) {
        try {
            const users = await this.userService.getAllUsers();
            res.json({
                code: 0,
                data: users
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: '获取用户列表失败'
            });
        }
    }

    async updateUserRole(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const { role } = req.body;
            
            await this.userService.updateUserRole(Number(userId), role);
            
            res.json({
                code: 0,
                message: '更新成功'
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: '更新用户角色失败'
            });
        }
    }

    async deleteUser(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            await this.userService.deleteUser(Number(userId));
            
            res.json({
                code: 0,
                message: '删除成功'
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: '删除用户失败'
            });
        }
    }

    async changePassword(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const { newPassword } = req.body;
            
            await this.userService.changePassword(Number(userId), newPassword);
            
            res.json({
                code: 0,
                message: '密码修改成功'
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: '修改密码失败'
            });
        }
    }
} 