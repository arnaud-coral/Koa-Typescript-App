import Router from 'koa-router';
import userController from '../controllers/userController';
import authChecker from '../middleware/authChecker';
const router = new Router({ prefix: '/api/v1/users/' });

// TODO: add validation

// User authentication
router.post('register', userController.registerUser);
router.post('login', userController.loginUser);
router.post('logout', authChecker, userController.logoutUser);

// User operations
router.get('me', authChecker, userController.getUser);
router.put('me', authChecker, userController.updateUserProfile);
router.delete('me', authChecker, userController.deleteUser);

// Email validation
router.post('validate-email', userController.validateEmail);

export default router;
