import Router from 'koa-router';
import { HealthCheckController } from '../controllers/healthCheckController';

const router = new Router({ prefix: '/api/v1' });
const healthCheckController = new HealthCheckController();

router.get('/health', healthCheckController.checkHealth);

export default router;
