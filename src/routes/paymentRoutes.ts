import Router from 'koa-router';
import paymentController from '../controllers/paymentController';
import authChecker from '../middleware/authChecker';
const router = new Router({ prefix: '/api/v1/payments/' });

// TODO: add validation

router.post('create', authChecker, paymentController.createPayment);

export default router;
