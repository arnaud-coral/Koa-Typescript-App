import 'dotenv/config';
import cluster from 'cluster';
import os from 'os';
import http from 'http';
import app from './app';
import config from './config/constants';

const APP_PORT = config.appPort;
const CLUSTER_MODE = config.clusterMode;

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
    server = http.createServer(app.callback());

    server.listen(APP_PORT, () => {
        console.log(
            `Server${
                CLUSTER_MODE ? ' worker ' + process.pid : ''
            } running on port ${APP_PORT}`
        );
    });
}
