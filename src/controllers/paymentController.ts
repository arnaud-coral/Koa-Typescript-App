import { Context } from 'koa';
import paymentService from '../services/paymentService';
import { HttpError } from '../middleware/errorHandler';

interface PaymentRequestBody {
    amount: number;
    currency: string;
}

class PaymentController {
    async createPayment(ctx: Context) {
        const { amount, currency } = ctx.request.body as PaymentRequestBody;

        if (!amount) {
            throw new HttpError(
                'Amount is required',
                400,
                'AMOUNT_REQUIRED'
            );
        }

        if (!currency) {
            throw new HttpError(
                'Currency is required',
                400,
                'CURRENCY_REQUIRED'
            );
        }

        const paymentIntent = await paymentService.createPaymentIntent(
            amount,
            currency
        );

        ctx.status = 201;
        ctx.body = { message: 'Payment successfully created', clientSecret: paymentIntent.client_secret };
    }

}

export default new PaymentController();
