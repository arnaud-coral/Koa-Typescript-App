import 'dotenv/config';
import cluster from 'cluster';
import os from 'os';
import http from 'http';
import app from './app';
import logger from './config/loggingConfig';

const APP_PORT = process.env.APP_PORT || 3000;
const CLUSTER_MODE = process.env.CLUSTER_MODE === 'true';

let server;

if (CLUSTER_MODE && cluster.isPrimary) {
    const numCPUs = os.cpus().length;
    console.log(`Master ${process.pid} is running in cluster mode`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {
    app.on('error', (err, ctx) => {
        logger.error('Unhandled exception occurred', {
            error: err,
            context: ctx,
        });
    });

    server = http.createServer(app.callback());

    server.listen(APP_PORT, () => {
        console.log(
            `Server${
                CLUSTER_MODE ? ' worker ' + process.pid : ''
            } running on port ${APP_PORT}`
        );
    });
}
