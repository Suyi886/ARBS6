import { Router } from 'express';
import { upload } from '../services/UploadService';
import { UploadController } from '../controllers/UploadController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const uploadController = new UploadController();

router.post(
    '/image',
    authMiddleware,
    upload.single('file'),
    uploadController.uploadFile.bind(uploadController)
);

export default router; 