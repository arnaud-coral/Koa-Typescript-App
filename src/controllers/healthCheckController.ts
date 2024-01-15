import { Context } from 'koa';
import healthCheckService from '../services/healthCheckService';

class HealthCheckController {
    async checkHealth(ctx: Context) {
        try {
            const healthStatus = await healthCheckService.checkHealth();

            ctx.status = 200;
            ctx.body = healthStatus;
        } catch (error) {
            let errorMessage = 'An unknown error occurred';
            if (error instanceof Error) {
                errorMessage = error.message;
            }

            ctx.status = 500;
            ctx.body = { message: errorMessage };
        }
    };
}

export default new HealthCheckController();
