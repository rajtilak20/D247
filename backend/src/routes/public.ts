import { Router } from 'express';
import { dealController } from '../controllers/dealController';
import { storeController } from '../controllers/storeController';
import { categoryController } from '../controllers/categoryController';

const router = Router();

// Deals routes
router.get('/deals', dealController.getDeals);
router.get('/deals/:idOrSlug', dealController.getDealBySlugOrId);
router.post('/deals/:id/click', dealController.recordClick);

// Stores route
router.get('/stores', storeController.getStores);

// Categories route
router.get('/categories', categoryController.getCategories);

export default router;
