import Router from 'koa-router';
import userController from '../controllers/userController';

const router = new Router({ prefix: '/api/v1/users' });

// TODO: add validation
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.delete('/:id', userController.deleteUser);

export default router;
