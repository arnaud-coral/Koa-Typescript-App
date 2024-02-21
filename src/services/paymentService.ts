import Stripe from 'stripe';
import config from '../config/constants';

const STRIPE_SECRET = config.stripeSecret;

class PaymentService {
    private stripe: Stripe;

    constructor(stripeSecretKey: string) {
        this.stripe = new Stripe(stripeSecretKey, { apiVersion: '2023-10-16' });
    }

    async createPaymentIntent(amount: number, currency: string): Promise<Stripe.Response<Stripe.PaymentIntent>> {
        return this.stripe.paymentIntents.create({
            amount,
            currency,
        });
    }
}

export default new PaymentService(STRIPE_SECRET);


