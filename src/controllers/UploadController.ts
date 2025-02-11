import { Request, Response } from 'express';
import { UploadService } from '../services/UploadService';

export class UploadController {
    async uploadFile(req: Request, res: Response) {
        try {
            if (!req.file) {
                return res.status(400).json({
                    code: 400,
                    message: '未上传文件'
                });
            }

            const fileUrl = UploadService.getFileUrl(req.file.filename);
            
            res.json({
                code: 0,
                data: {
                    url: fileUrl,
                    filename: req.file.filename
                }
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: '文件上传失败'
            });
        }
    }
} 