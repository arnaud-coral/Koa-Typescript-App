import { Context } from 'koa';
import healthCheckService from '../services/healthCheckService';
import { HttpError } from '../middleware/errorHandler';

class HealthCheckController {
    async checkHealth(ctx: Context) {
        const healthStatus = await healthCheckService.checkHealth();
        if (healthStatus?.status !== 'UP') {
            throw new HttpError(
                'Service is currently down',
                200,
                'DOWN'
            );
        }
        ctx.status = 200;
        ctx.body = { result: 'ok', data: { message: healthStatus }};
    };
}

export default new HealthCheckController();
