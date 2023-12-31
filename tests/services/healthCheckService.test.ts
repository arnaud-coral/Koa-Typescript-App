import { HealthCheckService } from '../../src/services/healthCheckService';

describe('HealthCheckService', () => {
    it('should return UP status when healthy', async () => {
        const service = new HealthCheckService();
        const status = await service.checkHealth();
        expect(status).toEqual({ status: 'UP' });
    });
});
