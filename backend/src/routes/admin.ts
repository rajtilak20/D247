import { Router } from 'express';
import { authController } from '../controllers/authController';
import { adminDealController } from '../controllers/adminDealController';
import { adminStoreController } from '../controllers/adminStoreController';
import { adminCategoryController } from '../controllers/adminCategoryController';
import { adminTagController } from '../controllers/adminTagController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Auth routes (no auth required for login)
router.post('/auth/login', authController.login);

// All routes below require authentication
router.use(authMiddleware);

// Protected auth routes
router.get('/auth/me', authController.me);

// Deal routes
router.get('/deals', adminDealController.getAllDeals);
router.post('/deals', adminDealController.createDeal);
router.put('/deals/:id', adminDealController.updateDeal);
router.delete('/deals/:id', adminDealController.deleteDeal);

// Store routes
router.post('/stores', adminStoreController.createStore);
router.put('/stores/:id', adminStoreController.updateStore);
router.delete('/stores/:id', adminStoreController.deleteStore);

// Category routes
router.post('/categories', adminCategoryController.createCategory);
router.put('/categories/:id', adminCategoryController.updateCategory);
router.delete('/categories/:id', adminCategoryController.deleteCategory);

// Tag routes
router.post('/tags', adminTagController.createTag);
router.put('/tags/:id', adminTagController.updateTag);
router.delete('/tags/:id', adminTagController.deleteTag);

export default router;
