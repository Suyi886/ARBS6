import { Request, Response } from 'express';
import { UserService } from '../services/UserService.js';

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    getAllUsers = async (req: Request, res: Response) => {
        try {
            const users = await this.userService.getAllUsers();
            res.json(users);
        } catch (error) {
            console.error('Get users error:', error);
            res.status(500).json({ message: '获取用户列表失败' });
        }
    };

    createUser = async (req: Request, res: Response) => {
        try {
            const { username, password, role } = req.body;
            
            if (!username || !password) {
                return res.status(400).json({ message: '用户名和密码不能为空' });
            }

            const userId = await this.userService.createUser({ username, password, role });
            res.status(201).json({ id: userId });
        } catch (error: any) {
            console.error('Create user error:', error);
            res.status(400).json({ message: error.message || '创建用户失败' });
        }
    };

    updateUserRole = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { role } = req.body;

            if (!role || !['admin', 'user'].includes(role)) {
                return res.status(400).json({ message: '无效的角色值' });
            }

            await this.userService.updateUserRole(Number(id), role);
            res.json({ message: '更新角色成功' });
        } catch (error) {
            console.error('Update role error:', error);
            res.status(500).json({ message: '更新角色失败' });
        }
    };

    changePassword = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { password } = req.body;

            if (!password) {
                return res.status(400).json({ message: '密码不能为空' });
            }

            await this.userService.changePassword(Number(id), password);
            res.json({ message: '修改密码成功' });
        } catch (error) {
            console.error('Change password error:', error);
            res.status(500).json({ message: '修改密码失败' });
        }
    };

    deleteUser = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await this.userService.deleteUser(Number(id));
            res.json({ message: '删除用户成功' });
        } catch (error) {
            console.error('Delete user error:', error);
            res.status(500).json({ message: '删除用户失败' });
        }
    };
} 