import Router from 'koa-router';
import { registerUser } from '../controllers/userController';

const router = new Router({ prefix: '/api/v1/users' });

// TODO: add validation
router.post('/register', registerUser);

export default router;
