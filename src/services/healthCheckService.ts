class HealthCheckService {
    async checkHealth() {
        return { status: 'UP' };
    }
}

export default new HealthCheckService();
