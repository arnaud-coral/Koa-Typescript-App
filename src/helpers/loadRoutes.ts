import fs from 'fs';
import path from 'path';
import Koa from 'koa';

const loadRoutes = (app: Koa) => {
    const routesPath = path.join(__dirname, '..', 'routes');
    fs.readdirSync(routesPath).forEach((file) => {
        if (file.endsWith('.ts')) {
            const route = require(path.join(routesPath, file)).default;
            app.use(route.routes()).use(route.allowedMethods());
        }
    });
};

export default loadRoutes;
