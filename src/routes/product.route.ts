import { Router } from 'express';
import { getProducts, createProduct, exchangeProduct } from '../controllers/product.controller';
import { validateToken } from '../libs/validateToken';

const router: Router = Router();

router.get('/', validateToken, getProducts);
router.post('/', validateToken, createProduct);
router.patch('/', validateToken, exchangeProduct);

export default router;