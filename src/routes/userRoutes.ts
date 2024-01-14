import Router from 'koa-router';
import { registerUser, loginUser } from '../controllers/userController';

const router = new Router({ prefix: '/api/v1/users' });

// TODO: add validation
router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
