import Router from 'koa-router';
import healthCheckController from '../controllers/healthCheckController';

const router = new Router({ prefix: '/api/v1' });

router.get('/health', healthCheckController.checkHealth);

export default router;
