export class HealthCheckService {
    async checkHealth() {
        return { status: 'UP' };
    }
}
