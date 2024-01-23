import Router from 'koa-router';
import userController from '../controllers/userController';
import authChecker from '../middleware/authChecker';
const router = new Router({ prefix: '/api/v1/users' });

// TODO: add validation
router.post('/register', userController.registerUser);
router.post('/validate-email', userController.validateEmail);
router.post('/login', userController.loginUser);
router.post('/logout', authChecker, userController.logoutUser);
router.delete('/:id', authChecker, userController.deleteUser);

export default router;
