import Router from 'koa-router';
import emailController from '../controllers/emailController';
import authChecker from '../middleware/authChecker';
const router = new Router({ prefix: '/api/v1/emails/' });

// TODO: add validation

// Email validation
router.post('validation-requests', authChecker, emailController.requestValidationLink);
router.get('validations', emailController.validateEmail);

export default router;
