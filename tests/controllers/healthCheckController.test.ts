import { HealthCheckController } from '../../src/controllers/healthCheckController';

jest.mock('../../src/services/healthCheckService', () => {
    return {
        HealthCheckService: jest.fn().mockImplementation(() => {
            return {
                checkHealth: jest.fn().mockResolvedValue({ status: 'UP' }),
            };
        }),
    };
});

describe('HealthCheckController', () => {
    let controller: HealthCheckController;
    let mockCtx: any;

    beforeEach(() => {
        controller = new HealthCheckController();
        mockCtx = {
            status: null,
            body: null,
        };
    });

    it('should set ctx.status to 200 and ctx.body to UP status', async () => {
        await controller.checkHealth(mockCtx);

        expect(mockCtx.status).toBe(200);
        expect(mockCtx.body).toEqual({ status: 'UP' });
    });
});
