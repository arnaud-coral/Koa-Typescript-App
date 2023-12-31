import { Context } from 'koa';
import { HealthCheckService } from '../services/healthCheckService';

export class HealthCheckController {
    private healthCheckService: HealthCheckService;

    constructor() {
        this.healthCheckService = new HealthCheckService();
    }

    checkHealth = async (ctx: Context) => {
        const healthStatus = await this.healthCheckService.checkHealth();
        ctx.status = 200;
        ctx.body = healthStatus;
    };
}
