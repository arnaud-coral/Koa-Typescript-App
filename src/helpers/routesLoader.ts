import fs from 'fs';
import path from 'path';

const loadRoutes = () => {
    const routesDir = path.join(__dirname, '../routes');
    const routeFiles = fs
        .readdirSync(routesDir)
        .filter((file) => file.endsWith('.ts'));

    const routes = routeFiles.map((file) => {
        const route = require(path.join(routesDir, file));
        return route.default;
    });

    return routes;
};

export default loadRoutes;
